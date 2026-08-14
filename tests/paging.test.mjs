import test from 'node:test'
import assert from 'node:assert/strict'
import { splitPages, MAX_PAGES } from '../.dsh-plugin/client/paging.mjs'

const fitsUpTo = n => prefix => prefix.length <= n

test('splitPages 按容量分页且拼接还原原文', () => {
  const text = '0123456789abcde' // 15 字
  const pages = splitPages(text, fitsUpTo(5))
  assert.deepEqual(pages, ['01234', '56789', 'abcde'])
  assert.equal(pages.join(''), text)
})

test('splitPages 整段装得下 → 单页', () => {
  const pages = splitPages('短文本', fitsUpTo(100))
  assert.deepEqual(pages, ['短文本'])
})

test('splitPages 空文本 → 单空页', () => {
  assert.deepEqual(splitPages('', fitsUpTo(5)), [''])
})

test('splitPages 连 1 字都装不下 → 单字成页（保证前进）', () => {
  const pages = splitPages('abcdef', () => false)
  assert.deepEqual(pages, ['a', 'b', 'c', 'd', 'e', 'f'])
})

test('splitPages 超过页数上限 → 余量并进末页', () => {
  const text = 'x'.repeat(30)
  const pages = splitPages(text, fitsUpTo(1), { maxPages: 3 })
  assert.deepEqual(pages, ['x', 'x', 'x'.repeat(28)])
  assert.equal(pages.join(''), text)
})

test('splitPages 二分结果：每页尽量装满', () => {
  const text = 'x'.repeat(23)
  const pages = splitPages(text, fitsUpTo(8))
  assert.deepEqual(pages, ['x'.repeat(8), 'x'.repeat(8), 'x'.repeat(7)])
})

test('断点回溯：优先在句末标点处断页', () => {
  const pages = splitPages('一二三四五。六七八九十。', fitsUpTo(10))
  assert.deepEqual(pages, ['一二三四五。', '六七八九十。'])
})

test('断点回溯：换行处断页（段落/行边界优先）', () => {
  const pages = splitPages('第一行\n第二行\n第三行', fitsUpTo(5))
  assert.deepEqual(pages, ['第一行\n', '第二行\n', '第三行'])
  assert.equal(pages.join(''), '第一行\n第二行\n第三行')
})

test('断点回溯：标点太靠前时不缩短页面（保持硬断点）', () => {
  const pages = splitPages('一二。三四五六七八九', fitsUpTo(10))
  assert.deepEqual(pages, ['一二。三四五六七八九'])
})

test('无标点文本保持按容量硬断', () => {
  const pages = splitPages('x'.repeat(23), fitsUpTo(8))
  assert.deepEqual(pages, ['x'.repeat(8), 'x'.repeat(8), 'x'.repeat(7)])
})

test('页首裁剪：每页首行不含换行符（文字从页顶开始）', () => {
  const pages = splitPages('ab\ncd', fitsUpTo(2))
  assert.deepEqual(pages, ['ab', 'c', 'd'])
})

test('页首裁剪：纯换行页被剔除，整体仍至少一页', () => {
  assert.deepEqual(splitPages('', fitsUpTo(5)), [''])
})

test('MAX_PAGES 默认上限为 24', () => {
  assert.equal(MAX_PAGES, 24)
})
