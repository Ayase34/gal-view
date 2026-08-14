import test from 'node:test'
import assert from 'node:assert/strict'
import { createObservable, createHistory, loadJSON, saveJSON } from '../.dsh-plugin/client/store.mjs'

function memoryStorage() {
  const map = new Map()
  return {
    getItem: key => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => { map.set(key, String(value)) },
  }
}

test('createObservable 快照/订阅/更新', () => {
  const o = createObservable({ n: 1 })
  assert.deepEqual(o.getSnapshot(), { n: 1 })
  let fired = 0
  const un = o.subscribe(() => { fired += 1 })
  const v2 = { n: 2 }
  o.update(v2)
  o.update(v2) // 同引用不通知
  assert.equal(fired, 1)
  assert.deepEqual(o.getSnapshot(), { n: 2 })
  un()
  o.update({ n: 3 })
  assert.equal(fired, 1)
})

test('createHistory push/undo/redo/reset', () => {
  const h = createHistory(3)
  h.push('s1'); h.push('s2')
  assert.deepEqual(h.info(), { undo: 2, redo: 0 })
  assert.equal(h.undoStep('cur'), 's2')
  assert.deepEqual(h.info(), { undo: 1, redo: 1 })
  assert.equal(h.redoStep('s2'), 'cur')
  assert.deepEqual(h.info(), { undo: 2, redo: 0 })
  assert.equal(h.undoStep('c'), 's2')
  h.push('x') // 新提交清空 redo
  assert.deepEqual(h.info(), { undo: 2, redo: 0 })
  assert.equal(h.undoStep('c'), 'x')
  assert.equal(h.redoStep('c'), 'c')
  h.reset()
  assert.deepEqual(h.info(), { undo: 0, redo: 0 })
})

test('createHistory 超出上限裁剪最旧', () => {
  const h = createHistory(2)
  h.push('a'); h.push('b'); h.push('c')
  assert.equal(h.undoStep('x'), 'c')
  assert.equal(h.undoStep('x'), 'b')
  assert.equal(h.undoStep('x'), null) // 'a' 已被裁剪
})

test('loadJSON/saveJSON 往返与容错', () => {
  const storage = memoryStorage()
  assert.equal(loadJSON(storage, 'k'), null)
  saveJSON(storage, 'k', { a: 1 })
  assert.deepEqual(loadJSON(storage, 'k'), { a: 1 })
  storage.setItem('bad', '{oops')
  assert.equal(loadJSON(storage, 'bad'), null)
  assert.equal(loadJSON(null, 'k'), null)
  saveJSON(null, 'k', {}) // 不抛
})
