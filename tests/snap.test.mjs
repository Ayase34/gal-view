import test from 'node:test'
import assert from 'node:assert/strict'
import {
  EDGE_THRESHOLD, collectSnapLines, snapRect, MOVE_KEYS, resizeKeys,
} from '../.dsh-plugin/client/snap.mjs'
import { normalizeElement, normalizeScene } from '../.dsh-plugin/client/scene.mjs'

const el = (id, x, y, w, h, extra = {}) => normalizeElement({ id, type: 'rect', x, y, w, h, ...extra })

test('collectSnapLines 含舞台边界/中线与元素边缘/中线，排除隐藏与被拖元素', () => {
  const elements = [el('a', 10, 20, 100, 50), el('b', 300, 400, 40, 60), el('c', 1, 2, 3, 4, { hidden: true })]
  const lines = collectSnapLines({ stageW: 960, stageH: 540, elements, excludeId: 'a' })
  const poses = (axis, kind) => lines.filter(l => l.axis === axis && l.kind === kind).map(l => l.pos)
  // 舞台边界/中线
  assert.deepEqual(poses('x', 'stage'), [0, 960, 480])
  assert.deepEqual(poses('y', 'stage'), [0, 540, 270])
  // 元素 b 的边缘/中线；a 被排除、c 隐藏
  assert.deepEqual(poses('x', 'edge'), [300, 340])
  assert.deepEqual(poses('y', 'center'), [430])
  assert.ok(lines.every(l => l.pos !== 10 && l.pos !== 30)) // 不含 a 的线
})

test('snapRect 移动吸附到元素边缘与舞台边界', () => {
  const lines = collectSnapLines({ stageW: 960, stageH: 540, elements: [el('b', 300, 400, 40, 60)], excludeId: 'a' })
  // 左边缘离 300 差 4 → 吸附
  const r1 = snapRect({ x: 304, y: 10, w: 100, h: 50 }, MOVE_KEYS, lines)
  assert.equal(r1.rect.x, 300)
  assert.deepEqual(r1.guides.map(g => g.pos), [300])
  // 右边缘离舞台右缘 960 差 5 → 吸附（右缘 = x + w = 955）
  const r2 = snapRect({ x: 855, y: 10, w: 100, h: 50 }, MOVE_KEYS, lines)
  assert.equal(r2.rect.x, 860) // 右缘对齐 960
  // 远离所有候选线（> 阈值）→ 不吸附
  const r3 = snapRect({ x: 400, y: 10, w: 100, h: 50 }, MOVE_KEYS, lines)
  assert.equal(r3.rect.x, 400)
  assert.deepEqual(r3.guides, [])
})

test('snapRect 双轴同时吸附（各自取最近线）', () => {
  const lines = collectSnapLines({ stageW: 960, stageH: 540, elements: [el('b', 300, 200, 40, 60)], excludeId: 'a' })
  const r = snapRect({ x: 296, y: 196, w: 100, h: 50 }, MOVE_KEYS, lines)
  assert.equal(r.rect.x, 300)
  assert.equal(r.rect.y, 200)
  assert.equal(r.guides.length, 2)
})

test('resizeKeys：e 吸附右缘（左缘锚定）；w 吸附左缘（右缘锚定）', () => {
  const lines = collectSnapLines({ stageW: 960, stageH: 540, elements: [], excludeId: 'x' })
  // e：右缘 956 → 吸附到 960，w 从 76 → 80，x 不变
  const r1 = snapRect({ x: 880, y: 10, w: 76, h: 50 }, resizeKeys('e'), lines)
  assert.equal(r1.rect.w, 80)
  assert.equal(r1.rect.x, 880)
  // w：左缘 3 → 吸附到 0，右缘 100 保持锚定（x=0, w=100）
  const r2 = snapRect({ x: 3, y: 10, w: 97, h: 50 }, resizeKeys('w'), lines)
  assert.equal(r2.rect.x, 0)
  assert.equal(r2.rect.w, 100)
  // 超出阈值 → 原样
  const r3 = snapRect({ x: 880, y: 10, w: 70, h: 50 }, resizeKeys('e'), lines)
  assert.equal(r3.rect.w, 70)
  assert.deepEqual(r3.guides, [])
})

test('resizeKeys：nw 角拉伸双轴吸附', () => {
  const lines = collectSnapLines({ stageW: 960, stageH: 540, elements: [el('b', 200, 100, 40, 60)], excludeId: 'x' })
  const r = snapRect({ x: 197, y: 97, w: 90, h: 80 }, resizeKeys('nw'), lines)
  assert.equal(r.rect.x, 200) // 左缘吸附
  assert.equal(r.rect.y, 100) // 上缘吸附
  assert.equal(r.rect.w, 87) // 右缘锚定（197+90=287 → 200+87）
  assert.equal(r.rect.h, 77) // 下缘锚定
})

test('EDGE_THRESHOLD 为 6 逻辑像素', () => {
  assert.equal(EDGE_THRESHOLD, 6)
})
