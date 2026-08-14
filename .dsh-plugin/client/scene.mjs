// 场景模型：默认场景、归一化、元素工厂、几何辅助。纯函数零宿主依赖，可单测。
// 场景对象是唯一事实源：游戏模式读它渲染舞台，编辑器改它，两者实时联动。
//
// 场景结构：
// {
//   version: 1,
//   settings: { stageW, stageH, showGrid, gridSize, snap, assistantSpeaker, playerName,
//               typeSpeed, welcome[] },
//   elements: [ Element, ... ]
// }
// Element 公共字段：id/type/name/x/y/w/h/rotation/opacity/z/locked/hidden
//   外观：background/borderColor/borderWidth/borderRadius/color/fontSize/text
//   type 专属：character: { key, label, name, color }
// 元素类型：background | character | dialogue | dialogue-text | speaker-name | action-button | text | rect | circle | button | decoration

export const SCENE_VERSION = 1
export const STAGE_W = 960
export const STAGE_H = 540
export const MIN_SIZE = 12

/** 元素类型清单（添加菜单与编辑器校验共用）。 */
export const ELEMENT_TYPES = Object.freeze([
  'background', 'character', 'dialogue', 'dialogue-text', 'speaker-name', 'text', 'rect', 'circle', 'button', 'action-button', 'decoration',
])

/** 各类型文本的默认对齐：正文类（台词/名牌/对话框）左对齐，形状/水印类居中。 */
export function defaultAlign(type) {
  switch (type) {
    case 'dialogue-text':
    case 'speaker-name':
    case 'dialogue':
      return 'left'
    default:
      return 'center'
  }
}

/** 各类型的中文名（元素树/添加菜单显示）。 */
export const TYPE_LABELS = Object.freeze({
  background: '背景',
  character: '角色',
  dialogue: '对话框',
  'dialogue-text': '台词',
  'speaker-name': '说话人',
  text: '文本',
  button: '按钮',
  'action-button': '透明按钮',
  rect: '矩形',
  circle: '圆形',
  decoration: '装饰',
})

const DIALOGUE_FALLBACK = Object.freeze({
  x: 40, y: 392, w: 880, h: 128, background: 'rgba(16,20,38,.78)',
  borderColor: 'rgba(150,140,255,.35)', borderWidth: 1, borderRadius: 6,
})

/** 生成元素 id（浏览器随机源；测试可注入 random）。 */
export function makeId(prefix = 'el', random = Math.random) {
  const rand = Math.floor(random() * 0xffffff).toString(36).padStart(6, '0')
  return prefix + '-' + Date.now().toString(36) + '-' + rand
}

/** 默认设置（与归一化合并用）。 */
export function defaultSettings() {
  return {
    stageW: STAGE_W,
    stageH: STAGE_H,
    showGrid: false,
    gridSize: 24,
    snap: true,
    assistantSpeaker: 'char-a',
    playerName: '你',
    typeSpeed: 'normal',
    welcome: ['……测试连接已经建立。', '这里是一个用于测试 AI 对话系统的 Galgame 场景。'],
  }
}

/** 默认 Demo 场景（需求十六：夜晚深色背景 + 占位角色 + Galgame 对话框）。 */
export function defaultScene() {
  return normalizeScene({
    settings: defaultSettings(),
    elements: [
      {
        id: 'background', type: 'background', name: '背景',
        x: 0, y: 0, w: STAGE_W, h: STAGE_H,
        rotation: 0, opacity: 1, z: 0, locked: true, hidden: false,
        background: 'linear-gradient(158deg, #0c1026 0%, #161244 42%, #221a52 78%, #2a1d5e 100%)',
        borderColor: 'transparent', borderWidth: 0, borderRadius: 0,
        color: '#a9b4e8', fontSize: 15, text: '',
      },
      {
        id: 'char-a', type: 'character', name: '角色 A',
        x: 148, y: 74, w: 220, h: 420,
        rotation: 0, opacity: 1, z: 10, locked: false, hidden: false,
        background: 'transparent', borderColor: 'transparent', borderWidth: 0, borderRadius: 8,
        color: '#9b8cff', fontSize: 13, text: '',
        character: { key: 'character-a', label: 'CHARACTER A', name: 'DeepSeek', color: '#9b8cff' },
      },
      {
        id: 'char-b', type: 'character', name: '角色 B',
        x: 592, y: 94, w: 220, h: 400,
        rotation: 0, opacity: 1, z: 11, locked: false, hidden: false,
        background: 'transparent', borderColor: 'transparent', borderWidth: 0, borderRadius: 8,
        color: '#ff8fa3', fontSize: 13, text: '',
        character: { key: 'character-b', label: 'CHARACTER B', name: '雾子', color: '#ff8fa3' },
      },
      {
        id: 'dialogue', type: 'dialogue', name: '对话框',
        x: 40, y: 392, w: 880, h: 128,
        rotation: 0, opacity: 1, z: 20, locked: false, hidden: false,
        background: 'linear-gradient(180deg, rgba(18,22,44,.82) 0%, rgba(11,14,30,.9) 100%)',
        borderColor: 'rgba(155,140,255,.32)', borderWidth: 1, borderRadius: 6,
        color: '#e8ebf5', fontSize: 17, text: '……',
      },
      {
        id: 'dialogue-text', type: 'dialogue-text', name: '台词',
        x: 58, y: 414, w: 844, h: 88,
        rotation: 0, opacity: 1, z: 21, locked: false, hidden: false,
        background: 'transparent', borderColor: 'transparent', borderWidth: 0, borderRadius: 0,
        color: '#e8ebf5', fontSize: 17, text: '……',
      },
      {
        id: 'speaker-player', type: 'speaker-name', name: '玩家名牌',
        x: 46, y: 368, w: 140, h: 24,
        rotation: 0, opacity: 1, z: 22, locked: false, hidden: false,
        background: 'transparent', borderColor: 'transparent', borderWidth: 0, borderRadius: 0,
        color: '#e8ebf5', fontSize: 14, text: '你', role: 'player',
      },
      {
        id: 'speaker-ai', type: 'speaker-name', name: 'AI 名牌',
        x: 46, y: 368, w: 140, h: 24,
        rotation: 0, opacity: 1, z: 22, locked: false, hidden: false,
        background: 'transparent', borderColor: 'transparent', borderWidth: 0, borderRadius: 0,
        color: '#e8ebf5', fontSize: 14, text: 'DeepSeek', role: 'assistant',
      },
      {
        id: 'btn-history', type: 'action-button', name: '历史按钮',
        x: 740, y: 14, w: 44, h: 26,
        rotation: 0, opacity: 1, z: 23, locked: false, hidden: false,
        background: 'transparent', borderColor: 'rgba(255,255,255,.35)', borderWidth: 1, borderRadius: 4,
        color: '#e8ebf5', fontSize: 12, text: '历史', action: 'history',
      },
      {
        id: 'btn-auto', type: 'action-button', name: '自动按钮',
        x: 792, y: 14, w: 44, h: 26,
        rotation: 0, opacity: 1, z: 23, locked: false, hidden: false,
        background: 'transparent', borderColor: 'rgba(255,255,255,.35)', borderWidth: 1, borderRadius: 4,
        color: '#e8ebf5', fontSize: 12, text: '自动', action: 'auto',
      },
      {
        id: 'btn-skip', type: 'action-button', name: '快进按钮',
        x: 844, y: 14, w: 44, h: 26,
        rotation: 0, opacity: 1, z: 23, locked: false, hidden: false,
        background: 'transparent', borderColor: 'rgba(255,255,255,.35)', borderWidth: 1, borderRadius: 4,
        color: '#e8ebf5', fontSize: 12, text: '快进', action: 'skip',
      },
      {
        id: 'btn-settings', type: 'action-button', name: '设置按钮',
        x: 896, y: 14, w: 44, h: 26,
        rotation: 0, opacity: 1, z: 23, locked: false, hidden: false,
        background: 'transparent', borderColor: 'rgba(255,255,255,.35)', borderWidth: 1, borderRadius: 4,
        color: '#e8ebf5', fontSize: 12, text: '设置', action: 'settings',
      },
      {
        id: 'deco-corner', type: 'decoration', name: '装饰 · 菱形',
        x: 812, y: 44, w: 96, h: 96,
        rotation: 45, opacity: .5, z: 5, locked: false, hidden: false,
        background: 'transparent', borderColor: 'rgba(155,140,255,.45)', borderWidth: 1, borderRadius: 0,
        color: '#9b8cff', fontSize: 11, text: '',
      },
      {
        id: 'deco-line', type: 'decoration', name: '装饰 · 地平线',
        x: 0, y: 336, w: 960, h: 56,
        rotation: 0, opacity: .35, z: 4, locked: false, hidden: false,
        background: 'linear-gradient(90deg, transparent, rgba(120,140,255,.25) 18%, rgba(120,140,255,.25) 82%, transparent)',
        borderColor: 'transparent', borderWidth: 0, borderRadius: 0,
        color: '#a9b4e8', fontSize: 11, text: '[ DECORATION ]',
      },
    ],
  })
}

/** 新建元素的默认形状（添加元素用）。 */
export function makeElement(type, { id = makeId(), index = 0, role, stageW = STAGE_W, stageH = STAGE_H } = {}) {
  const common = {
    id, type, name: TYPE_LABELS[type] ?? '元素',
    rotation: 0, opacity: 1, locked: false, hidden: false,
    background: 'transparent', borderColor: 'rgba(155,140,255,.45)', borderWidth: 1, borderRadius: 0,
    color: '#e8ebf5', fontSize: 15, text: '',
    align: defaultAlign(type), // 文本对齐：left | center | right
    fontFamily: '', // 字体：空 = 默认；内置 CSS 字体族或导入字体的 family
    action: '', // 功能绑定：透明按钮的预设功能（history/auto/skip/settings）；空 = 装饰按钮
    image: null, // 素材引用：素材库中的 assetId；null = 占位图形
    bind: null, // 绑定引用：说话人元素绑定的台词元素 id
  }
  switch (type) {
    case 'background': return {
      ...common, x: 0, y: 0, w: stageW, h: stageH, z: -10, locked: true,
      background: 'linear-gradient(150deg, #0d1130 0%, #1a1650 60%, #241a58 100%)',
      borderColor: 'transparent', borderWidth: 0, color: '#a9b4e8', fontSize: 15,
    }
    case 'character': {
      const letter = String.fromCharCode(65 + index) // A, B, C, ...
      const palette = ['#9b8cff', '#ff8fa3', '#6fb8ff', '#ffb86b', '#7fe0c3']
      const color = palette[index % palette.length]
      return {
        ...common, x: 370, y: 70, w: 220, h: 400, z: 12,
        character: {
          key: 'character-' + letter.toLowerCase(), label: 'CHARACTER ' + letter,
          name: '角色 ' + letter, color,
        },
        color, fontSize: 13,
      }
    }
    case 'dialogue': return {
      ...common, x: 40, y: stageH - 148, w: stageW - 80, h: 128, z: 20,
      background: 'linear-gradient(180deg, rgba(18,22,44,.82) 0%, rgba(11,14,30,.9) 100%)',
      borderColor: 'rgba(155,140,255,.32)', borderRadius: 6, fontSize: 17, text: '……',
    }
    case 'dialogue-text': return {
      ...common, x: 58, y: stageH - 126, w: stageW - 116, h: 88, z: 21, text: '……',
      fontSize: 17, borderWidth: 0,
    }
    case 'speaker-name': {
      const speakerRole = role === 'assistant' ? 'assistant' : 'player'
      return {
        ...common, x: 46, y: stageH - 172, w: 140, h: 24, z: 22,
        name: speakerRole === 'player' ? '玩家名牌' : 'AI 名牌',
        text: speakerRole === 'player' ? '你' : 'DeepSeek',
        role: speakerRole, fontSize: 14, borderWidth: 0,
      }
    }
    case 'text': return { ...common, x: 400, y: 240, w: 180, h: 40, z: 15, text: '文本', fontSize: 18, borderWidth: 0 }
    case 'button': return {
      ...common, x: 410, y: 300, w: 140, h: 38, z: 16, text: '按钮', fontSize: 14, borderRadius: 19,
      background: 'rgba(155,140,255,.12)', borderColor: 'rgba(155,140,255,.6)',
    }
    case 'action-button': return {
      ...common, x: 800, y: 12, w: 44, h: 26, z: 23, text: '按钮', fontSize: 12,
      background: 'transparent', borderColor: 'rgba(255,255,255,.35)', borderRadius: 4,
    }
    case 'rect': return {
      ...common, x: 360, y: 140, w: 240, h: 140, z: 8, text: '',
      background: 'rgba(155,140,255,.10)', borderColor: 'rgba(155,140,255,.55)', color: '#8f93c9', fontSize: 13,
    }
    case 'circle': return {
      ...common, x: 430, y: 130, w: 110, h: 110, z: 9, borderRadius: 55, text: '',
      background: 'rgba(111,184,255,.10)', borderColor: 'rgba(111,184,255,.55)', color: '#8f93c9', fontSize: 13,
    }
    case 'decoration': return {
      ...common, x: 420, y: 80, w: 140, h: 90, z: 6, text: '',
      borderColor: 'rgba(155,140,255,.4)', borderWidth: 1, background: 'transparent',
      color: '#8f93c9', fontSize: 11,
    }
    default: return { ...common, x: 400, y: 200, w: 160, h: 100, z: 8 }
  }
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function toNumber(value, fallback) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function toString(value, fallback) {
  return typeof value === 'string' ? value : fallback
}

/** 归一化单个元素：数值钳制 + 必填字段兜底 + 未知类型保持（可导入外部 JSON）。 */
export function normalizeElement(raw) {
  if (!isRecord(raw)) return null
  const type = typeof raw.type === 'string' ? raw.type : 'rect'
  const el = {
    id: toString(raw.id, '') || makeId(),
    type,
    name: toString(raw.name, ''),
    x: toNumber(raw.x, 0),
    y: toNumber(raw.y, 0),
    w: Math.max(MIN_SIZE, toNumber(raw.w, 100)),
    h: Math.max(MIN_SIZE, toNumber(raw.h, 60)),
    rotation: toNumber(raw.rotation, 0),
    opacity: Math.min(1, Math.max(0, toNumber(raw.opacity, 1))),
    z: toNumber(raw.z, 0),
    locked: raw.locked === true,
    hidden: raw.hidden === true,
    background: toString(raw.background, 'transparent'),
    borderColor: toString(raw.borderColor, 'transparent'),
    borderWidth: Math.max(0, toNumber(raw.borderWidth, 0)),
    borderRadius: Math.max(0, toNumber(raw.borderRadius, 0)),
    color: toString(raw.color, '#e8ebf5'),
    fontSize: Math.max(8, toNumber(raw.fontSize, 15)),
    text: toString(raw.text, ''),
    image: typeof raw.image === 'string' && raw.image !== '' ? raw.image : null,
    bind: typeof raw.bind === 'string' && raw.bind !== '' ? raw.bind : null,
    role: raw.role === 'assistant' ? 'assistant' : raw.role === 'player' ? 'player' : null,
    align: raw.align === 'left' || raw.align === 'right' || raw.align === 'center' ? raw.align : defaultAlign(type),
    fontFamily: typeof raw.fontFamily === 'string' ? raw.fontFamily : '',
    action: typeof raw.action === 'string' ? raw.action : '',
  }
  if (isRecord(raw.character)) {
    el.character = {
      key: toString(raw.character.key, ''),
      label: toString(raw.character.label, 'CHARACTER'),
      name: toString(raw.character.name, '？？？'),
      color: toString(raw.character.color, '#9b8cff'),
    }
  }
  return el
}

/** 归一化设置：只合并已知键（白名单），类型兜底。 */
export function normalizeSettings(raw) {
  const base = defaultSettings()
  if (!isRecord(raw)) return base
  return {
    stageW: Math.max(320, toNumber(raw.stageW, base.stageW)),
    stageH: Math.max(180, toNumber(raw.stageH, base.stageH)),
    showGrid: raw.showGrid === true,
    gridSize: Math.min(64, Math.max(4, toNumber(raw.gridSize, base.gridSize))),
    snap: raw.snap !== false,
    assistantSpeaker: toString(raw.assistantSpeaker, base.assistantSpeaker),
    playerName: toString(raw.playerName, base.playerName) || '你',
    typeSpeed: ['slow', 'normal', 'fast'].includes(raw.typeSpeed) ? raw.typeSpeed : base.typeSpeed,
    welcome: Array.isArray(raw.welcome)
      ? raw.welcome.filter(line => typeof line === 'string').slice(0, 8)
      : base.welcome,
  }
}

/** 归一化整个场景；非法输入返回 null。 */
export function normalizeScene(raw) {
  if (!isRecord(raw)) return null
  const elements = (Array.isArray(raw.elements) ? raw.elements : [])
    .map(normalizeElement)
    .filter(el => el !== null)
  return {
    version: SCENE_VERSION,
    settings: normalizeSettings(raw.settings),
    elements,
  }
}

/** 深拷贝场景（历史快照/导入导出用；场景是纯 JSON 树）。 */
export function cloneScene(scene) {
  return JSON.parse(JSON.stringify(scene))
}

/** 元素公共样式 → React style 对象（舞台坐标系）。 */
export function elementStyle(el) {
  const align = el.align === 'right' || el.align === 'center' ? el.align : 'left'
  return {
    left: el.x + 'px',
    top: el.y + 'px',
    width: el.w + 'px',
    height: el.h + 'px',
    transform: el.rotation === 0 ? undefined : 'rotate(' + el.rotation + 'deg)',
    opacity: el.opacity,
    zIndex: el.z,
    background: el.background,
    borderColor: el.borderColor,
    borderWidth: el.borderWidth + 'px',
    borderRadius: el.borderRadius + 'px',
    color: el.color,
    fontSize: el.fontSize + 'px',
    fontFamily: el.fontFamily !== '' ? el.fontFamily : undefined,
    textAlign: align,
    justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
  }
}

/** 按 z 升序排序（渲染顺序；DOM 后者在上）。 */
export function sortElements(elements) {
  return [...elements].sort((a, b) => a.z - b.z || a.id.localeCompare(b.id))
}

/** 找到场景中的对话框元素；缺失时返回内置兜底形状（游戏模式仍可用）。 */
export function findDialogue(scene) {
  const el = scene.elements.find(e => e.type === 'dialogue' && !e.hidden)
  return el ?? { ...DIALOGUE_FALLBACK, id: 'dialogue-fallback', fontSize: 17, color: '#e8ebf5' }
}

/** 吸附：开启时把值对齐到网格。 */
export function snapValue(value, size, enabled) {
  return enabled ? Math.round(value / size) * size : value
}

/** 元素中心点（旋转手柄锚点）。 */
export function elementCenter(el) {
  return { x: el.x + el.w / 2, y: el.y + el.h / 2 }
}

/** 从元素列表推导下一角色字母（A/B/C…；超过 Z 回到 A）。 */
export function nextCharacterLetter(elements) {
  const count = elements.filter(e => e.type === 'character').length
  return String.fromCharCode(65 + (count % 26))
}

/**
 * 迁移：旧场景缺少「台词」文本框时，按对话框位置补一个（幂等；可随意编辑/删除）。
 * 台词元素是独立可编辑的文本盒——游戏模式把实时对话渲染进它；缺失时回退到
 * 对话框内嵌文本（旧布局），不破坏任何已保存场景。
 */
export function ensureDialogueText(scene) {
  if (scene.elements.some(el => el.type === 'dialogue-text')) return scene
  const box = scene.elements.find(el => el.type === 'dialogue')
  if (box === undefined) return scene
  const el = makeElement('dialogue-text', { id: 'dialogue-text' })
  return {
    ...scene,
    elements: [...scene.elements, { ...el, x: box.x + 18, y: box.y + 22, w: box.w - 36, h: box.h - 40 }],
  }
}

/**
 * 迁移：旧版单一「说话人」元素（无 role）删除，替换为两个角色名牌
 * （玩家名牌「你」+ AI 名牌「DeepSeek」，名字随元素文本自由设置），承接其位置。
 * 游戏模式中：玩家行 → 仅玩家名牌显示；AI 行 → 仅 AI 名牌显示；系统行 → 都隐藏。
 */
export function ensureSpeakerNames(scene) {
  const isLegacy = el => el.type === 'speaker-name' && el.role !== 'player' && el.role !== 'assistant'
  const legacy = scene.elements.filter(isLegacy)
  const hasPlayer = scene.elements.some(el => el.type === 'speaker-name' && el.role === 'player')
  const hasAi = scene.elements.some(el => el.type === 'speaker-name' && el.role === 'assistant')
  if (legacy.length === 0 && hasPlayer && hasAi) return scene
  const anchor = scene.elements.find(el => el.type === 'dialogue-text')
    ?? scene.elements.find(el => el.type === 'dialogue')
  // 旧名牌原位置直接承接；否则按台词/对话框上方摆放；都没有则用默认位置。
  const pos = legacy.length > 0
    ? { x: legacy[0].x, y: legacy[0].y }
    : anchor !== undefined
      ? { x: anchor.x, y: anchor.y - 28 }
      : { x: 46, y: 368 }
  const kept = legacy.length > 0 ? scene.elements.filter(el => !isLegacy(el)) : [...scene.elements]
  const add = []
  if (!hasPlayer) add.push({ ...makeElement('speaker-name', { id: 'speaker-player', role: 'player' }), ...pos })
  if (!hasAi) add.push({ ...makeElement('speaker-name', { id: 'speaker-ai', role: 'assistant' }), ...pos })
  return { ...scene, elements: [...kept, ...add] }
}

/**
 * 迁移：旧场景缺透明功能按钮时，补「历史/自动/快进/设置」四个预设按钮
 * （舞台右上角一排；幂等）。用户可自由删除/移动/改绑定。
 */
export function ensureActionButtons(scene) {
  if (scene.elements.some(el => el.type === 'action-button')) return scene
  if (!scene.elements.some(el => el.type === 'dialogue')) return scene
  const sw = scene.settings.stageW
  const actions = [
    { id: 'btn-history', text: '历史', action: 'history' },
    { id: 'btn-auto', text: '自动', action: 'auto' },
    { id: 'btn-skip', text: '快进', action: 'skip' },
    { id: 'btn-settings', text: '设置', action: 'settings' },
  ]
  const add = actions.map((entry, index) => ({
    ...makeElement('action-button', { id: entry.id }),
    x: sw - 220 + index * 52,
    y: 14,
    text: entry.text,
    action: entry.action,
    name: entry.text + '按钮',
  }))
  return { ...scene, elements: [...scene.elements, ...add] }
}

