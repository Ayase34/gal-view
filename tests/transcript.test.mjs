import test from 'node:test'
import assert from 'node:assert/strict'
import {
  contentToText, assistantToText, partialToText, lineFromNode, nodesToLines,
  speakerFor, assistantSpeaker, playerSpeaker, welcomeLine, cleanDialogueText,
  playerDisplayName, assistantDisplayName, roleNameElement, partialStatus, deriveStatus,
} from '../.dsh-plugin/client/transcript.mjs'
import { defaultScene, normalizeScene } from '../.dsh-plugin/client/scene.mjs'

const user = (seq, text) => ({ kind: 'user', seq, content: [{ type: 'text', text }], source: null })
const assistant = (seq, blocks) => ({ kind: 'assistant', seq, turn: 1, step: 1, blocks })
const text = t => ({ kind: 'text', text: t })
const toolCall = () => ({ kind: 'tool-call', callId: 'c1', name: 'read', argsRaw: '{}' })

test('contentToText 只取文本块并拼接', () => {
  assert.equal(contentToText([{ type: 'text', text: '你好' }, { type: 'image', attachment: {} }, { type: 'text', text: '世界' }]), '你好\n世界')
  assert.equal(contentToText(null), '')
  assert.equal(contentToText([{ type: 'text', text: '' }]), '')
})

test('assistantToText 只取 text 块，reasoning/tool-call 不进台词', () => {
  const blocks = [{ kind: 'reasoning', text: '思考…' }, text('你好'), toolCall(), text('再见')]
  assert.equal(assistantToText(blocks), '你好\n再见')
})

test('partialToText 空/缺字段安全', () => {
  assert.equal(partialToText(null), '')
  assert.equal(partialToText({ blocks: [text('流式')] }), '流式')
})

test('partialStatus 按块推导 AI 状态（非思考非对话 → 编写代码中）', () => {
  const toolCall = () => ({ kind: 'tool-call', callId: 'c', name: 'read', argsRaw: '{}' })
  assert.equal(partialStatus({ blocks: [toolCall()] }), '编写代码中')
  assert.equal(partialStatus({ blocks: [{ kind: 'reasoning', text: '想…' }] }), '思考中')
  assert.equal(partialStatus({ blocks: [text('正文')] }), null) // 输出正文无需状态
  assert.equal(partialStatus({ blocks: [toolCall(), text('x')] }), '编写代码中') // 工具优先
  assert.equal(partialStatus({ blocks: [toolCall(), { kind: 'reasoning', text: '想' }] }), '编写代码中')
  assert.equal(partialStatus({ blocks: [] }), '编写代码中') // 无任何块 → 编写代码中
  assert.equal(partialStatus({ blocks: [{ kind: 'other', block: null }] }), '编写代码中') // 未知块 → 编写代码中
  assert.equal(partialStatus(null), null)
  assert.equal(partialStatus({}), null)
})

test('lineFromNode 映射各节点类型', () => {
  assert.deepEqual(lineFromNode(user(1, '你好')), { key: 'node-1', kind: 'player', text: '你好' })
  assert.deepEqual(lineFromNode(assistant(2, [text('嗨')])), { key: 'node-2', kind: 'assistant', text: '嗨' })
  assert.equal(lineFromNode(user(3, '')), null) // 空文本跳过
  assert.equal(lineFromNode({ kind: 'tool-result', seq: 4, callId: 'c', content: [], isError: false, call: null, callTime: null, callView: null, resultView: null, subCalls: [] }), null)
  assert.equal(lineFromNode({ kind: 'unknown', seq: 5, type: 'x' }).text, '[未知事件 x]')
  assert.equal(lineFromNode({ kind: 'turn-error', seq: 6, turn: 1, step: 1, message: 'boom' }).text, '[错误] boom')
  const cmd = lineFromNode({ kind: 'command', seq: 7, commandId: 'c', name: 'compact', args: ' now', outcome: { kind: 'success' } })
  assert.equal(cmd.text, '/compact now')
  const failed = lineFromNode({ kind: 'command', seq: 8, commandId: 'c', name: 'x', args: null, outcome: { kind: 'error', text: '失败' } })
  assert.equal(failed.text, '[命令失败] /x')
  const comp = lineFromNode({ kind: 'compaction', seq: 9, summary: '压缩内容' })
  assert.equal(comp.text, '[对话压缩] 压缩内容')
  assert.equal(lineFromNode({ kind: 'model-retry', seq: 10, retryState: 'scheduled' }).text, '[等待模型重试]')
  assert.equal(lineFromNode({ kind: 'turn-max-tokens', seq: 11, turn: 1, step: 1 }).text, '[已达到输出上限]')
  const steer = lineFromNode({ kind: 'steering', seq: 12, messageId: 'm', content: [{ type: 'text', text: '插话' }] })
  assert.deepEqual(steer, { key: 'node-12', kind: 'player', text: '插话' })
  const ctx = lineFromNode({ kind: 'context', seq: 13, content: [{ type: 'text', text: '系统注入' }], provenance: {}, form: null })
  assert.equal(ctx.text, '[上下文] 系统注入')
})

test('nodesToLines 保持顺序并过滤', () => {
  const lines = nodesToLines([user(1, 'a'), { kind: 'tool-result', seq: 2 }, assistant(3, [text('b')]), user(4, '')])
  assert.deepEqual(lines.map(l => l.kind), ['player', 'assistant'])
  assert.deepEqual(lines.map(l => l.text), ['a', 'b'])
  assert.deepEqual(nodesToLines(null), [])
})

test('说话人映射：助手/玩家/系统', () => {
  const scene = defaultScene()
  const asst = speakerFor(scene, 'assistant')
  assert.equal(asst.name, 'DeepSeek') // 默认角色 A
  assert.equal(asst.color, '#e8ebf5') // 颜色随 AI 名牌元素
  assert.equal(speakerFor(scene, 'player').name, '你')
  assert.equal(speakerFor(scene, 'system').name, '系统')
  assert.equal(speakerFor(scene, 'bogus').name, '系统')
})

test('显示名优先取名牌元素文本（用户自定义），缺失/空文本回退', () => {
  const scene = defaultScene()
  // 默认场景：名牌元素存在 → 名字来自元素文本
  assert.equal(playerDisplayName(scene), '你')
  assert.equal(assistantDisplayName(scene), 'DeepSeek')
  assert.equal(speakerFor(scene, 'player').name, '你')
  assert.equal(speakerFor(scene, 'assistant').name, 'DeepSeek')
  // 用户改名 → 显示名跟随
  const playerEl = roleNameElement(scene, 'player')
  const aiEl = roleNameElement(scene, 'assistant')
  playerEl.text = '自定义我'
  aiEl.text = '自定义AI'
  assert.equal(playerDisplayName(scene), '自定义我')
  assert.equal(assistantDisplayName(scene), '自定义AI')
  assert.equal(speakerFor(scene, 'assistant').name, '自定义AI')
  assert.equal(speakerFor(scene, 'assistant').color, aiEl.color) // 颜色随元素
  // 空文本 → 回退旧逻辑（玩家名设置 / 助手角色名或系统）
  aiEl.text = ''
  assert.equal(assistantDisplayName(scene), 'DeepSeek') // 回退助手角色名
  const noEls = normalizeScene({ settings: { assistantSpeaker: 'char-a' }, elements: [] })
  assert.equal(assistantDisplayName(noEls), '系统') // 无元素无角色 → 系统
  assert.equal(playerDisplayName(noEls), '你')
})

test('assistantSpeaker 失效引用回退系统', () => {
  const scene = normalizeScene({ settings: { assistantSpeaker: 'char-a' }, elements: [] })
  const s = assistantSpeaker(scene)
  assert.equal(s.name, '系统')
  const named = defaultScene()
  named.settings.assistantSpeaker = 'char-b'
  assert.equal(assistantSpeaker(named).name, '雾子')
})

test('cleanDialogueText 折叠成串空行并去首尾空行', () => {
  assert.equal(cleanDialogueText('a\n\n\n\n\nb'), 'a\n\nb')
  assert.equal(cleanDialogueText('a\n\n\n\n\n\n\n\n\n\nb'), 'a\n\nb')
  assert.equal(cleanDialogueText('a\n\nb'), 'a\n\nb') // 单个段落分隔保留
  assert.equal(cleanDialogueText('\n\n\na\n\n\n'), 'a')
  assert.equal(cleanDialogueText('a\r\n\r\n\r\nb'), 'a\n\nb') // 换行符归一
  assert.equal(cleanDialogueText('a\n   \n\n\t\nb'), 'a\n\nb') // 纯空白行视为空行
  assert.equal(cleanDialogueText(' 缩进保留  '), '缩进保留')
  assert.equal(cleanDialogueText(null), '')
})

test('contentToText/assistantToText 应用清洗（空行折叠进台词）', () => {
  assert.equal(contentToText([{ type: 'text', text: '第一段\n\n\n\n\n第二段' }]), '第一段\n\n第二段')
  assert.equal(partialToText({ blocks: [text('x\n\n\n\ny')] }), 'x\n\ny')
})

test('deriveStatus 归类全部会话状态', () => {
  const toolCall = () => ({ kind: 'tool-call', callId: 'c', name: 'read', argsRaw: '{}' })
  // 运行中：工具调用与工具执行合并为一个状态（不再附注工具名）
  assert.equal(deriveStatus({ running: true, partial: { blocks: [toolCall()] }, runningCalls: [{ callId: 'c', name: 'grep', argsRaw: '', turn: 1, step: 1 }] }), '编写代码中')
  // 工具执行中（partial 为空）+ 执行列表 → 同样归类编写代码中
  assert.equal(deriveStatus({ running: true, partial: null, runningCalls: [{ callId: 'c', name: 'pwsh', argsRaw: '', turn: 1, step: 1 }] }), '编写代码中')
  // 运行中无任何信息 → 编写代码中
  assert.equal(deriveStatus({ running: true, partial: null }), '编写代码中')
  // 等待回应（批准/提问）优先
  assert.equal(deriveStatus({ running: true, partial: { blocks: [toolCall()] }, pending: [{}] }), '等待回应')
  // 思考中
  assert.equal(deriveStatus({ running: true, partial: { blocks: [{ kind: 'reasoning', text: '想' }] } }), '思考中')
  // 生成正文 → 思考中（流式期间不渲染正文，定稿后才渲染）
  assert.equal(deriveStatus({ running: true, partial: { blocks: [text('正文')] } }), '思考中')
  // 非运行：错误行 → 出错
  assert.equal(deriveStatus({ running: false, lastLine: { key: 'e', kind: 'system', text: '[错误]', error: true } }), '出错')
  // 非运行：发送失败
  assert.equal(deriveStatus({ running: false, promptError: { op: 'send', error: {} } }), '发送失败')
  // 非运行：普通状态 → null
  assert.equal(deriveStatus({ running: false, lastLine: { key: 'a', kind: 'assistant', text: 'x' } }), null)
  assert.equal(deriveStatus({ running: false, promptError: { op: 'stop', error: {} } }), null)
})

test('welcomeLine 拼接欢迎台词', () => {
  const scene = defaultScene()
  const line = welcomeLine(scene)
  assert.equal(line.kind, 'assistant')
  assert.ok(line.text.includes('测试连接已经建立'))
  const bare = normalizeScene({ settings: { welcome: [] }, elements: [] })
  assert.equal(welcomeLine(bare), null)
})
