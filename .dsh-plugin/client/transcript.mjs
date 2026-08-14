// 会话转录 → Galgame 台词行：纯映射，零宿主依赖，可单测。
// 输入是运行时 ConversationSnapshot 的 legacy nodes（含 user/assistant/steering/
// context/tool-result/command/compaction/turn-error 等），输出统一的行模型：
//   { key, kind: 'player'|'assistant'|'system', text }
// 工具调用/结果不进台词（Galgame 对话框不展示工具噪音）；错误/命令/压缩等事件
// 以系统行进入历史。说话人映射（名字/颜色）也在这里。

/**
 * 对话文本清洗：统一换行符；纯空白行视为空行；连续多个空行折叠为一个段落分隔；
 * 去首尾空行。流式与定稿共用同一函数（contentToText/assistantToText 内应用），
 * 避免模型输出成串空行占据文本框空间，且定稿切换时文本不重打。
 */
export function cleanDialogueText(text) {
  if (typeof text !== 'string') return ''
  return text
    .replace(/\r\n?/g, '\n')
    .replace(/^[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** 用户消息的 content blocks → 纯文本。 */
export function contentToText(blocks) {
  if (!Array.isArray(blocks)) return ''
  return cleanDialogueText(blocks
    .map(block => {
      if (block === null || typeof block !== 'object') return ''
      if (typeof block.text === 'string') return block.text
      return ''
    })
    .filter(text => text !== '')
    .join('\n'))
}

/** 助手消息的 blocks → 纯文本（只取 text 块；reasoning/tool-call 不进台词）。 */
export function assistantToText(blocks) {
  if (!Array.isArray(blocks)) return ''
  return cleanDialogueText(blocks
    .map(block => {
      if (block === null || typeof block !== 'object') return ''
      if (block.kind === 'text' && typeof block.text === 'string') return block.text
      return ''
    })
    .filter(text => text !== '')
    .join('\n'))
}

/** 流式 partial 的文本（正在生成的当前行）。 */
export function partialToText(partial) {
  if (partial === null || typeof partial !== 'object') return ''
  return assistantToText(partial.blocks)
}

/**
 * AI 运行状态（流式 partial 块推导）：
 * - 有正文块 → null（正在输出实际对话，无需状态）；
 * - 有思考块 → '思考中'；
 * - 其余一切非思考、非对话的操作（工具调用/未知块/尚未产生任何块）→ '编写代码中'。
 * 非运行中由调用方不显示。
 */
export function partialStatus(partial) {
  if (partial === null || typeof partial !== 'object' || !Array.isArray(partial.blocks)) return null
  const blocks = partial.blocks
  const hasTool = blocks.some(b => b !== null && typeof b === 'object' && b.kind === 'tool-call')
  const hasReasoning = blocks.some(b => b !== null && typeof b === 'object' && b.kind === 'reasoning' && (b.text ?? '') !== '')
  const hasText = blocks.some(b => b !== null && typeof b === 'object' && b.kind === 'text' && (b.text ?? '') !== '')
  if (hasText && !hasTool) return null
  if (hasReasoning && !hasTool) return '思考中'
  // 工具调用，或任何非思考、非对话的状态（未知块/空块/等待阶段）→ 编写代码中。
  return '编写代码中'
}

/**
 * 完整状态推导（归类所有会话状态）：
 * - 非运行：最后一行是错误（turn-error）→ '出错'；发送失败（promptError op=send）→ '发送失败'。
 * - 运行中：有待回应（批准/提问）→ '等待回应'；正在输出正文 → null；
 *   思考 → '思考中'；其余（工具调用/工具执行/未知/空）统一 → '编写代码中'（不再附注工具名）。
 */
export function deriveStatus({ running, partial, pending = [], lastLine = null, promptError = null }) {
  if (!running) {
    if (lastLine !== null && lastLine.error === true) return '出错'
    if (promptError !== null && typeof promptError === 'object' && promptError.op === 'send') return '发送失败'
    return null
  }
  if (Array.isArray(pending) && pending.length > 0) return '等待回应'
  const hasText = partial !== null && typeof partial === 'object' && Array.isArray(partial.blocks)
    && partial.blocks.some(b => b !== null && typeof b === 'object' && b.kind === 'text' && (b.text ?? '') !== '')
  if (hasText) return null
  // 工具调用与工具执行合并为一个状态（不再附注工具名）。
  return partialStatus(partial) ?? '编写代码中'
}

/** 单个会话节点 → 行（无文本/工具类返回 null 跳过）。 */
export function lineFromNode(node) {
  if (node === null || typeof node !== 'object') return null
  const key = 'node-' + String(node.seq ?? 'x')
  switch (node.kind) {
    case 'user': {
      const text = contentToText(node.content)
      return text === '' ? null : { key, kind: 'player', text }
    }
    case 'steering': {
      const text = contentToText(node.content)
      return text === '' ? null : { key, kind: 'player', text }
    }
    case 'assistant': {
      const text = assistantToText(node.blocks)
      return text === '' ? null : { key, kind: 'assistant', text }
    }
    case 'context': {
      const text = contentToText(node.content)
      return text === '' ? null : { key, kind: 'system', text: '[上下文] ' + text }
    }
    case 'command': {
      const name = typeof node.name === 'string' ? node.name : ''
      const args = typeof node.args === 'string' ? node.args : '' // args 自带分隔空白
      const failed = node.outcome?.kind === 'error' && typeof node.outcome.text === 'string'
      return { key, kind: 'system', text: (failed ? '[命令失败] /' : '/') + name + args }
    }
    case 'compaction': {
      const summary = typeof node.summary === 'string' && node.summary !== ''
      return { key, kind: 'system', text: summary ? '[对话压缩] ' + node.summary : '[对话压缩检查点]' }
    }
    case 'turn-error': {
      return { key, kind: 'system', text: '[错误] ' + String(node.message ?? '回合失败'), error: true }
    }
    case 'model-retry': {
      return { key, kind: 'system', text: '[等待模型重试]' }
    }
    case 'turn-max-tokens': {
      return { key, kind: 'system', text: '[已达到输出上限]' }
    }
    case 'unknown': {
      return { key, kind: 'system', text: '[未知事件 ' + String(node.type ?? '') + ']' }
    }
    default:
      // tool-result 等：不进台词。
      return null
  }
}

/** 节点列表 → 行列表（保持日志顺序，过滤空行）。 */
export function nodesToLines(nodes) {
  if (!Array.isArray(nodes)) return []
  const out = []
  for (const node of nodes) {
    const line = lineFromNode(node)
    if (line !== null) out.push(line)
  }
  return out
}

/** 系统说话人的名字（对话框名牌据此隐藏；历史面板仍显示系统行标签）。 */
export const SYSTEM_NAME = '系统'

/** 系统说话人（固定）。 */
export function systemSpeaker() {
  return { name: SYSTEM_NAME, color: '#8f9bbd' }
}

/** 玩家说话人（名字可配置）。 */
export function playerSpeaker(scene) {
  const name = scene.settings.playerName
  return { name: name === '' ? '你' : name, color: '#4f8cff' }
}

/** 助手说话人：settings.assistantSpeaker 指向的角色元素；失效时退回系统。 */
export function assistantSpeaker(scene) {
  const el = scene.elements.find(e => e.id === scene.settings.assistantSpeaker)
  if (el !== undefined && el.type === 'character' && el.character) {
    return { name: el.character.name, color: el.character.color }
  }
  return systemSpeaker()
}

/** 指定角色的名牌元素（speaker-name + role）；不存在返回 null。 */
export function roleNameElement(scene, role) {
  return scene.elements.find(el => el.type === 'speaker-name' && el.role === role) ?? null
}

/** 玩家显示名：优先玩家名牌元素的文本（用户自定义），空/缺失回退设置里的玩家名。 */
export function playerDisplayName(scene) {
  const el = roleNameElement(scene, 'player')
  if (el !== null && el.text !== '') return el.text
  return playerSpeaker(scene).name
}

/** AI 显示名：优先 AI 名牌元素的文本（用户自定义），空/缺失回退助手角色名/系统。 */
export function assistantDisplayName(scene) {
  const el = roleNameElement(scene, 'assistant')
  if (el !== null && el.text !== '') return el.text
  return assistantSpeaker(scene).name
}

/** 行 → 说话人（名字优先取名牌元素；颜色也随元素 color，元素缺失时回退旧配色）。 */
export function speakerFor(scene, kind) {
  switch (kind) {
    case 'player': {
      const el = roleNameElement(scene, 'player')
      return { name: playerDisplayName(scene), color: el?.color ?? playerSpeaker(scene).color }
    }
    case 'assistant': {
      const el = roleNameElement(scene, 'assistant')
      return { name: assistantDisplayName(scene), color: el?.color ?? assistantSpeaker(scene).color }
    }
    default: return systemSpeaker()
  }
}

/** 欢迎行：空会话（blank）时展示的占位台词。 */
export function welcomeLine(scene) {
  const lines = scene.settings.welcome
  if (lines.length === 0) return null
  return { key: 'welcome', kind: 'assistant', text: lines.join('\n\n') }
}
