import test from 'node:test'
import assert from 'node:assert/strict'
import {
  defaultScene, makeElement, normalizeScene, normalizeElement, cloneScene,
  elementStyle, sortElements, findDialogue, snapValue, elementCenter, nextCharacterLetter,
  ensureDialogueText, ensureSpeakerNames, ensureActionButtons, STAGE_W, STAGE_H, MIN_SIZE,
} from '../.dsh-plugin/client/scene.mjs'

test('defaultScene 是合法场景：含背景/两角色/对话框/独立台词，舞台 16:9', () => {
  const scene = defaultScene()
  assert.equal(scene.version, 1)
  assert.equal(scene.settings.stageW, STAGE_W)
  assert.equal(scene.settings.stageH, STAGE_H)
  const types = scene.elements.map(e => e.type)
  assert.ok(types.includes('background'))
  assert.ok(types.includes('character'))
  assert.ok(types.includes('dialogue'))
  assert.ok(types.includes('dialogue-text'))
  assert.ok(types.includes('speaker-name'))
  const snames = scene.elements.filter(e => e.type === 'speaker-name')
  assert.equal(snames.length, 2)
  const player = snames.find(e => e.role === 'player')
  const ai = snames.find(e => e.role === 'assistant')
  assert.equal(player.text, '你')
  assert.equal(ai.text, 'DeepSeek')
  const btns = scene.elements.filter(e => e.type === 'action-button')
  assert.equal(btns.length, 4)
  assert.deepEqual(btns.map(b => b.action), ['history', 'auto', 'skip', 'settings'])
  const chars = scene.elements.filter(e => e.type === 'character')
  assert.equal(chars.length, 2)
  assert.equal(chars[0].character.label, 'CHARACTER A')
  assert.equal(scene.settings.assistantSpeaker, 'char-a')
})

test('ensureDialogueText 迁移：旧场景按对话框补台词元素；幂等；无对话框不补', () => {
  const bare = normalizeScene({
    elements: [normalizeElement({ id: 'dialogue', type: 'dialogue', x: 100, y: 200, w: 600, h: 100 })],
  })
  const migrated = ensureDialogueText(bare)
  const dtext = migrated.elements.find(el => el.type === 'dialogue-text')
  assert.ok(dtext !== undefined)
  assert.equal(dtext.x, 118) // box.x + 18
  assert.equal(dtext.y, 222) // box.y + 22
  assert.equal(dtext.w, 564) // box.w - 36
  assert.equal(migrated.elements.length, 2)
  assert.equal(ensureDialogueText(migrated), migrated) // 幂等（同引用）
  const noBox = normalizeScene({ elements: [] })
  assert.equal(ensureDialogueText(noBox), noBox)
  assert.equal(defaultScene().elements.filter(el => el.type === 'dialogue-text').length, 1)
})

test('ensureSpeakerNames 迁移：删除旧版说话人元素，替换为双名牌并承接位置；幂等', () => {
  // 旧版单一说话人元素（无 role）
  const scene = normalizeScene({
    elements: [
      normalizeElement({ id: 'dialogue-text', type: 'dialogue-text', x: 100, y: 200, w: 500, h: 80 }),
      normalizeElement({ id: 'speaker-name', type: 'speaker-name', x: 106, y: 172, w: 140, h: 24, text: '角色名' }),
    ],
  })
  const migrated = ensureSpeakerNames(scene)
  assert.equal(migrated.elements.filter(el => el.type === 'speaker-name' && el.role === null).length, 0, '旧说话人元素被删除')
  const player = migrated.elements.find(el => el.type === 'speaker-name' && el.role === 'player')
  const ai = migrated.elements.find(el => el.type === 'speaker-name' && el.role === 'assistant')
  assert.ok(player !== undefined && ai !== undefined)
  assert.equal(player.x, 106) // 承接旧位置
  assert.equal(player.y, 172)
  assert.equal(ai.x, 106)
  assert.equal(player.text, '你')
  assert.equal(ai.text, 'DeepSeek')
  assert.equal(ensureSpeakerNames(migrated), migrated) // 幂等（同引用）
  // 无台词/对话框锚点：补默认位置
  const bare = normalizeScene({ elements: [] })
  const bareMigrated = ensureSpeakerNames(bare)
  assert.equal(bareMigrated.elements.length, 2)
  assert.equal(bareMigrated.elements[0].x, 46)
})

test('ensureActionButtons 迁移：缺功能按钮时补四个预设；幂等；无对话框不补', () => {
  const scene = normalizeScene({ settings: { stageW: 960, stageH: 540 }, elements: [normalizeElement({ id: 'dialogue', type: 'dialogue' })] })
  const migrated = ensureActionButtons(scene)
  const btns = migrated.elements.filter(el => el.type === 'action-button')
  assert.equal(btns.length, 4)
  assert.deepEqual(btns.map(b => b.action), ['history', 'auto', 'skip', 'settings'])
  assert.equal(btns[0].x, 740) // stageW - 220
  assert.equal(btns[3].x, 896)
  assert.equal(ensureActionButtons(migrated), migrated) // 幂等
  const bare = normalizeScene({ elements: [] })
  assert.equal(ensureActionButtons(bare), bare)
})

test('normalizeScene 对垃圾输入返回 null，对缺字段元素兜底', () => {
  assert.equal(normalizeScene(null), null)
  assert.equal(normalizeScene('x'), null)
  const scene = normalizeScene({ elements: [{ id: 'a', x: -50, w: 3, opacity: 7 }] })
  assert.equal(scene.elements.length, 1)
  const el = scene.elements[0]
  assert.equal(el.id, 'a')
  assert.equal(el.x, -50) // 坐标可为负（舞台外元素合法）
  assert.equal(el.w, MIN_SIZE) // 尺寸钳制到最小
  assert.equal(el.opacity, 1) // 不透明度钳制 0..1
  assert.equal(el.locked, false)
  assert.equal(el.hidden, false)
})

test('normalizeElement 对非对象返回 null，unknown 类型保留', () => {
  assert.equal(normalizeElement('x'), null)
  assert.equal(normalizeElement(null), null)
  const el = normalizeElement({ id: 'z', type: 'custom-thing' })
  assert.equal(el.type, 'custom-thing')
})

test('normalizeSettings 白名单合并 + 类型兜底', () => {
  const s = normalizeScene({ settings: { typeSpeed: 'warp', gridSize: 999, snap: false, welcome: [1, 'hi'] } }).settings
  assert.equal(s.typeSpeed, 'normal')
  assert.equal(s.gridSize, 64)
  assert.equal(s.snap, false)
  assert.deepEqual(s.welcome, ['hi'])
})

test('makeElement 各类型产生合法元素，角色字母递增', () => {
  const a = makeElement('character', { index: 0 })
  assert.equal(a.character.label, 'CHARACTER A')
  assert.equal(a.type, 'character')
  const b = makeElement('character', { index: 1 })
  assert.equal(b.character.label, 'CHARACTER B')
  const rect = makeElement('rect', {})
  assert.ok(rect.w >= MIN_SIZE)
  const circle = makeElement('circle', {})
  assert.equal(circle.borderRadius, 55)
})

test('cloneScene 深拷贝：改副本不影响原场景', () => {
  const scene = defaultScene()
  const copy = cloneScene(scene)
  copy.elements[0].x = 999
  assert.notEqual(scene.elements[0].x, 999)
  assert.notDeepEqual(copy, scene)
})

test('elementStyle 输出 px 坐标与旋转', () => {
  const el = normalizeElement({ id: 'e', x: 10, y: 20, w: 30, h: 40, rotation: 90, z: 5, opacity: .5 })
  const style = elementStyle(el)
  assert.equal(style.left, '10px')
  assert.equal(style.top, '20px')
  assert.equal(style.transform, 'rotate(90deg)')
  assert.equal(style.zIndex, 5)
  assert.equal(style.opacity, .5)
  const flat = elementStyle(normalizeElement({ id: 'f', rotation: 0 }))
  assert.equal(flat.transform, undefined)
})

test('align 默认与 elementStyle 输出', () => {
  // 正文类默认左对齐，形状/水印类默认居中
  assert.equal(normalizeElement({ id: 'a', type: 'dialogue-text' }).align, 'left')
  assert.equal(normalizeElement({ id: 'b', type: 'speaker-name' }).align, 'left')
  assert.equal(normalizeElement({ id: 'c', type: 'text' }).align, 'center')
  assert.equal(normalizeElement({ id: 'd', type: 'rect' }).align, 'center')
  // 显式对齐透传，非法值按类型默认
  assert.equal(normalizeElement({ id: 'e', type: 'text', align: 'right' }).align, 'right')
  assert.equal(normalizeElement({ id: 'f', type: 'text', align: 'bogus' }).align, 'center')
  // elementStyle 输出 textAlign / justifyContent
  const left = elementStyle(normalizeElement({ id: 'g', type: 'dialogue-text', align: 'left' }))
  assert.equal(left.textAlign, 'left')
  assert.equal(left.justifyContent, 'flex-start')
  const right = elementStyle(normalizeElement({ id: 'h', type: 'text', align: 'right' }))
  assert.equal(right.textAlign, 'right')
  assert.equal(right.justifyContent, 'flex-end')
  const center = elementStyle(normalizeElement({ id: 'i', type: 'text', align: 'center' }))
  assert.equal(center.justifyContent, 'center')
})

test('sortElements 按 z 升序，同 z 按 id 稳定', () => {
  const els = [
    normalizeElement({ id: 'b', z: 5 }),
    normalizeElement({ id: 'a', z: 1 }),
    normalizeElement({ id: 'c', z: 1 }),
  ]
  assert.deepEqual(sortElements(els).map(e => e.id), ['a', 'c', 'b'])
})

test('findDialogue 缺失时返回兜底形状', () => {
  const scene = defaultScene()
  const el = findDialogue(scene)
  assert.equal(el.id, 'dialogue')
  const bare = normalizeScene({ elements: [] })
  const fb = findDialogue(bare)
  assert.equal(fb.id, 'dialogue-fallback')
  assert.ok(fb.w > 0 && fb.h > 0)
})

test('snapValue 网格吸附', () => {
  assert.equal(snapValue(37, 24, true), 48)
  assert.equal(snapValue(24, 24, true), 24)
  assert.equal(snapValue(37, 24, false), 37)
})

test('elementCenter 与 nextCharacterLetter', () => {
  assert.deepEqual(elementCenter(normalizeElement({ id: 'e', x: 10, y: 10, w: 20, h: 40 })), { x: 20, y: 30 })
  const chars = [1, 2, 3].map(i => ({ type: 'character', id: String(i) }))
  assert.equal(nextCharacterLetter(chars), 'D')
})
