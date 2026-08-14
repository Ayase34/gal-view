import test from 'node:test'
import assert from 'node:assert/strict'
import { createTypeState, setTarget, skip, advance, SPEEDS } from '../.dsh-plugin/client/typewriter.mjs'

test('初始状态：空且完成', () => {
  const s = createTypeState()
  assert.equal(s.shown, '')
  assert.equal(s.done, true)
})

test('setTarget 全新文本从零开始', () => {
  const s = setTarget(createTypeState(), '你好')
  assert.equal(s.target, '你好')
  assert.equal(s.shown, '')
  assert.equal(s.done, false)
})

test('setTarget 前缀保持进度（流式追加无缝）', () => {
  const long = '你好世界'.repeat(10) // 50 字
  let s = setTarget(createTypeState(), long)
  s = advance(s, 100, SPEEDS.normal) // 推进一部分（6 字）
  assert.ok(s.shown.length > 0 && s.shown.length < s.target.length)
  const next = setTarget(s, long + '，欢迎回来')
  assert.equal(next.shown, s.shown) // 进度保留
  assert.equal(next.target, long + '，欢迎回来')
})

test('setTarget 非前缀文本重打', () => {
  let s = setTarget(createTypeState(), '你好世界')
  s = skip(s)
  const next = setTarget(s, '完全不同')
  assert.equal(next.shown, '')
})

test('advance 按速度推进，done 时返回原引用', () => {
  let s = setTarget(createTypeState(), 'x'.repeat(100))
  const next = advance(s, 1000, SPEEDS.normal)
  assert.equal(next.shown.length, 60)
  assert.equal(next.done, false)
  const doneState = skip(next)
  assert.equal(doneState.done, true)
  assert.equal(advance(doneState, 1000), doneState) // 原引用
  assert.equal(advance(next, 0), next) // 无时间流逝不变
})

test('advance 差距过大仍从头逐字推进（流式不跳尾，钉住开头展示第一段）', () => {
  const long = 'x'.repeat(600) // 远超一帧打字量
  let s = setTarget(createTypeState(), long)
  s = advance(s, 1000, SPEEDS.normal)
  assert.equal(s.shown, long.slice(0, 60)) // 只推进一秒的打字量，不跳到尾部
  assert.equal(s.done, false)
})

test('advance 恰好追平置 done', () => {
  let s = setTarget(createTypeState(), '你好')
  s = advance(s, 99999, SPEEDS.normal)
  assert.equal(s.shown, '你好')
  assert.equal(s.done, true)
})

test('skip 追平且 done 时返回原引用', () => {
  const s = setTarget(createTypeState(), 'abc')
  const skipped = skip(s)
  assert.equal(skipped.shown, 'abc')
  assert.equal(skipped.done, true)
  assert.equal(skip(skipped), skipped)
})
