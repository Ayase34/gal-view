import test from 'node:test'
import assert from 'node:assert/strict'
import {
  MAX_FONT_BYTES, FONT_FORMATS, BUILTIN_FONTS, fontFamilyFromName, extOf,
  normalizeFont, buildFontFace, embedFonts, extractFonts,
} from '../.dsh-plugin/client/fonts.mjs'
import { defaultScene, normalizeElement } from '../.dsh-plugin/client/scene.mjs'

const DATA = 'data:font/ttf;base64,AAEAAAA='

test('fontFamilyFromName 生成合法 CSS family（保留中英文，其余转连字符）', () => {
  assert.equal(fontFamilyFromName('My Font.ttf'), 'My-Font')
  assert.equal(fontFamilyFromName('测试字体.otf'), '测试字体')
  assert.equal(fontFamilyFromName('a b+c#d'), 'a-b-c-d')
  assert.equal(fontFamilyFromName('!!!'), 'custom-font')
  assert.equal(fontFamilyFromName(''), 'custom-font')
})

test('extOf 提取小写扩展名', () => {
  assert.equal(extOf('x.TTF'), 'ttf')
  assert.equal(extOf('noext'), '')
  assert.equal(extOf('a.b.woff2'), 'woff2')
})

test('FONT_FORMATS / MAX_FONT_BYTES / BUILTIN_FONTS', () => {
  assert.equal(FONT_FORMATS.ttf, 'truetype')
  assert.equal(FONT_FORMATS.otf, 'opentype')
  assert.equal(FONT_FORMATS.woff, 'woff')
  assert.equal(FONT_FORMATS.woff2, 'woff2')
  assert.equal(MAX_FONT_BYTES, 24 * 1024 * 1024)
  assert.equal(BUILTIN_FONTS[0].label, '默认')
  assert.equal(BUILTIN_FONTS[0].value, '')
})

test('normalizeFont 归一化与非法输入', () => {
  const rec = normalizeFont({ id: 'f1', name: 'x.ttf', family: 'X', format: 'truetype', dataUrl: DATA, createdAt: 1 })
  assert.deepEqual(rec, { id: 'f1', name: 'x.ttf', family: 'X', format: 'truetype', dataUrl: DATA, createdAt: 1 })
  assert.equal(normalizeFont(null), null)
  assert.equal(normalizeFont({ dataUrl: 'nope' }), null)
  const byName = normalizeFont({ dataUrl: DATA, name: '测试.ttf' })
  assert.equal(byName.family, '测试')
  const badFormat = normalizeFont({ dataUrl: DATA, format: 'exe' })
  assert.equal(badFormat.format, 'truetype')
})

test('buildFontFace 生成 @font-face 规则', () => {
  const face = buildFontFace(normalizeFont({ id: 'f', family: 'My-Font', format: 'woff2', dataUrl: DATA }))
  assert.ok(face.includes('@font-face'))
  assert.ok(face.includes('font-family: "My-Font"'))
  assert.ok(face.includes('format("woff2")'))
  assert.ok(face.includes(DATA))
})

test('embedFonts 只内嵌被引用的字体；extractFonts 提取并过滤垃圾', () => {
  const scene = defaultScene()
  scene.elements[0].fontFamily = 'X-Font'
  const map = new Map([
    ['f1', normalizeFont({ id: 'f1', family: 'X-Font', dataUrl: DATA })],
    ['f2', normalizeFont({ id: 'f2', family: 'Unused', dataUrl: DATA })],
  ])
  const out = embedFonts(scene, map)
  assert.ok(out.fonts.f1 !== undefined)
  assert.equal(out.fonts.f2, undefined)
  const extracted = extractFonts({ fonts: { a: { id: 'a', family: 'A', dataUrl: DATA }, bad: 'x' } })
  assert.equal(extracted.length, 1)
  assert.deepEqual(extractFonts(null), [])
})

test('元素 fontFamily 归一化默认空（继承宿主字体）', () => {
  assert.equal(normalizeElement({ id: 'e', type: 'text' }).fontFamily, '')
  assert.equal(normalizeElement({ id: 'f', type: 'text', fontFamily: 'SimHei, sans-serif' }).fontFamily, 'SimHei, sans-serif')
})
