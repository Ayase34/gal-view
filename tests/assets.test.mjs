import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ASSET_MIME, MAX_ASSET_BYTES, normalizeAsset, embedAssets, extractAssets,
} from '../.dsh-plugin/client/assets.mjs'
import { defaultScene } from '../.dsh-plugin/client/scene.mjs'

const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

test('ASSET_MIME 接受 png/jpeg/webp/gif，拒绝其他', () => {
  assert.ok(ASSET_MIME.test('image/png'))
  assert.ok(ASSET_MIME.test('image/jpeg'))
  assert.ok(ASSET_MIME.test('image/webp'))
  assert.ok(ASSET_MIME.test('image/gif'))
  assert.equal(ASSET_MIME.test('text/plain'), false)
  assert.equal(ASSET_MIME.test('image/svg+xml'), false)
})

test('normalizeAsset 归一化合法记录，非法输入返回 null', () => {
  const rec = normalizeAsset({ id: 'a1', name: 'bg.png', mime: 'image/png', dataUrl: PNG, width: 1920, height: 1080, createdAt: 42 })
  assert.deepEqual(rec, { id: 'a1', name: 'bg.png', mime: 'image/png', dataUrl: PNG, width: 1920, height: 1080, createdAt: 42 })
  assert.equal(normalizeAsset(null), null)
  assert.equal(normalizeAsset('x'), null)
  assert.equal(normalizeAsset([1]), null)
  assert.equal(normalizeAsset({ id: 'a2', dataUrl: 'not-a-dataurl' }), null)
  assert.equal(normalizeAsset({ dataUrl: PNG }).name, '素材') // 缺名字兜底
})

test('embedAssets 只内嵌被引用的素材', () => {
  const scene = defaultScene()
  scene.elements[0].image = 'a1' // 背景引用 a1
  const map = new Map([
    ['a1', normalizeAsset({ id: 'a1', dataUrl: PNG })],
    ['a2', normalizeAsset({ id: 'a2', dataUrl: PNG })],
  ])
  const out = embedAssets(scene, map)
  assert.ok(out.assets.a1 !== undefined)
  assert.equal(out.assets.a2, undefined) // 未被引用 → 不进 JSON
  assert.equal(scene.assets, undefined) // 原场景不被修改
})

test('embedAssets 引用缺失的素材不内嵌', () => {
  const scene = defaultScene()
  scene.elements[0].image = 'ghost'
  const out = embedAssets(scene, new Map())
  assert.deepEqual(out.assets, {})
})

test('extractAssets 提取内嵌素材并过滤垃圾', () => {
  const raw = { assets: { a1: { id: 'a1', dataUrl: PNG }, bad: 'x', nope: { dataUrl: 'nope' } } }
  const records = extractAssets(raw)
  assert.equal(records.length, 1)
  assert.equal(records[0].id, 'a1')
  assert.deepEqual(extractAssets(null), [])
  assert.deepEqual(extractAssets({}), [])
  assert.deepEqual(extractAssets({ assets: 'x' }), [])
})

test('MAX_ASSET_BYTES 为 8MB', () => {
  assert.equal(MAX_ASSET_BYTES, 8 * 1024 * 1024)
})
