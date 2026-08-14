// 美术素材库：图片以 dataURL 存 IndexedDB（localStorage 配额太小），内存里维护
// 可观察镜像供组件渲染；场景元素以 el.image = assetId 引用。导出场景 JSON 时内嵌
// 被引用的素材，导入场景时还原素材库。纯函数部分（记录归一化/内嵌/提取）可单测。

import { makeId } from './scene.mjs'
import { createIdbStore } from './store.mjs'

/** 接受的图片类型（文件 import 校验 + dataURL 校验共用）。 */
export const ASSET_MIME = /^image\/(png|jpe?g|webp|gif)$/i

/** 单张素材大小上限（dataURL 内存/JSON 内嵌开销考虑）。 */
export const MAX_ASSET_BYTES = 8 * 1024 * 1024

/** 归一化素材记录；非法（非对象/非图片 dataURL）返回 null。 */
export function normalizeAsset(raw) {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return null
  const dataUrl = typeof raw.dataUrl === 'string' ? raw.dataUrl : ''
  if (!/^data:image\/[a-z0-9.+-]+;base64,/i.test(dataUrl)) return null
  return {
    id: typeof raw.id === 'string' && raw.id !== '' ? raw.id : makeId('asset'),
    name: typeof raw.name === 'string' && raw.name !== '' ? raw.name : '素材',
    mime: typeof raw.mime === 'string' ? raw.mime : 'image/png',
    dataUrl,
    width: typeof raw.width === 'number' && Number.isFinite(raw.width) ? raw.width : 0,
    height: typeof raw.height === 'number' && Number.isFinite(raw.height) ? raw.height : 0,
    createdAt: typeof raw.createdAt === 'number' && Number.isFinite(raw.createdAt) ? raw.createdAt : 0,
  }
}

/** File → dataURL（浏览器 API；调用方 catch 处理失败）。 */
export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
    reader.onerror = () => reject(reader.error ?? new Error('读取文件失败'))
    reader.readAsDataURL(file)
  })
}

/** 量取图片尺寸；解码失败返回 0×0（不影响入库与渲染）。 */
export function measureImage(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => resolve({ width: 0, height: 0 })
    img.src = dataUrl
  })
}

/** 导出负载：只内嵌被元素引用的素材（未被引用的留在本地素材库，不进 JSON）。 */
export function embedAssets(scene, assetMap) {
  const refs = new Set(
    scene.elements.map(el => el.image).filter(id => typeof id === 'string' && id !== ''),
  )
  const assets = {}
  for (const id of refs) {
    const record = assetMap.get(id)
    if (record !== undefined) assets[id] = record
  }
  return { ...scene, assets }
}

/** 从导入的场景 JSON 提取内嵌素材（非法条目丢弃）。 */
export function extractAssets(raw) {
  if (raw === null || typeof raw !== 'object' || raw.assets === null || typeof raw.assets !== 'object' || Array.isArray(raw.assets)) return []
  return Object.entries(raw.assets)
    .map(([, value]) => normalizeAsset(value))
    .filter(record => record !== null)
}

/** IndexedDB 驱动：内存镜像 + 异步落库；indexedDB 不可用时退化为纯内存（不持久）。 */
export function createIdbAssets(dbName = 'gal-view') {
  return createIdbStore(dbName, 'assets')
}
