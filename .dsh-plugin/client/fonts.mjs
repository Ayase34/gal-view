// 字体库：自定义字体文件以 dataURL 存 IndexedDB（store 'fonts'），注册为
// @font-face 供场景元素使用；元素以 el.fontFamily 引用。导出场景 JSON 内嵌被引用
// 字体，导入时还原。纯函数部分（记录归一化/family 生成/@font-face/内嵌提取）可单测。

import { makeId } from './scene.mjs'
import { createIdbStore } from './store.mjs'

/** 单字体文件大小上限（dataURL 开销考虑；CJK 字体可能较大）。 */
export const MAX_FONT_BYTES = 24 * 1024 * 1024

/** 扩展名 → CSS format()。 */
export const FONT_FORMATS = Object.freeze({
  ttf: 'truetype',
  otf: 'opentype',
  woff: 'woff',
  woff2: 'woff2',
})

/** 内置字体选项（属性面板下拉；value 为空 = 默认/继承宿主字体）。 */
export const BUILTIN_FONTS = Object.freeze([
  { value: '', label: '默认' },
  { value: '"Microsoft YaHei", "PingFang SC", sans-serif', label: '无衬线（雅黑）' },
  { value: 'serif', label: '衬线' },
  { value: 'monospace', label: '等宽' },
  { value: 'SimSun, serif', label: '宋体' },
  { value: 'SimHei, sans-serif', label: '黑体' },
  { value: 'KaiTi, serif', label: '楷体' },
  { value: 'FangSong, serif', label: '仿宋' },
])

/** 文件名 → 合法 CSS font-family 标识（保留中英文数字，其余转连字符）。 */
export function fontFamilyFromName(name) {
  const base = String(name ?? '')
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base === '' ? 'custom-font' : base
}

/** 文件扩展名（小写，无点）。 */
export function extOf(name) {
  const match = /\.([a-z0-9]+)$/i.exec(String(name ?? ''))
  return match === null ? '' : match[1].toLowerCase()
}

/** 归一化字体记录；非法输入返回 null。 */
export function normalizeFont(raw) {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return null
  const dataUrl = typeof raw.dataUrl === 'string' ? raw.dataUrl : ''
  if (!/^data:[^;]+;base64,/i.test(dataUrl)) return null
  const family = typeof raw.family === 'string' && raw.family !== '' ? raw.family : fontFamilyFromName(raw.name)
  const format = FONT_FORMATS[raw.format] ?? 'truetype'
  return {
    id: typeof raw.id === 'string' && raw.id !== '' ? raw.id : makeId('font'),
    name: typeof raw.name === 'string' && raw.name !== '' ? raw.name : '字体',
    family,
    format,
    dataUrl,
    createdAt: typeof raw.createdAt === 'number' && Number.isFinite(raw.createdAt) ? raw.createdAt : 0,
  }
}

/** 生成 @font-face 规则。 */
export function buildFontFace(record) {
  return '@font-face { font-family: "' + record.family + '"; src: url("' + record.dataUrl + '") format("' + record.format + '"); }'
}

/** 导出负载：只内嵌被元素 fontFamily 引用的字体。 */
export function embedFonts(scene, fontMap) {
  const used = new Set(fontMap.keys())
  const fonts = {}
  for (const [id, record] of fontMap) {
    const referenced = scene.elements.some(el => el.fontFamily === record.family)
    if (referenced) fonts[id] = record
  }
  // used 集合仅用于遍历；输出只含被引用者。
  void used
  return { ...scene, fonts }
}

/** 从导入的场景 JSON 提取内嵌字体。 */
export function extractFonts(raw) {
  if (raw === null || typeof raw !== 'object' || raw.fonts === null || typeof raw.fonts !== 'object' || Array.isArray(raw.fonts)) return []
  return Object.entries(raw.fonts)
    .map(([, value]) => normalizeFont(value))
    .filter(record => record !== null)
}

/** IndexedDB 字体库驱动（store 'fonts'；内存镜像 + 异步落库，不可用时纯内存）。 */
export function createIdbFonts(dbName = 'gal-view') {
  return createIdbStore(dbName, 'fonts')
}
