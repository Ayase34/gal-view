// 可观察快照源 + 撤销/重做历史：极简实现（getSnapshot/subscribe），零依赖。
// 场景存储与历史都构建在它之上。纯逻辑可单测（storage 可注入）。

/** 极简可观察值：getSnapshot/subscribe 契约（与槽位 hooks 舱一致）。 */
export function createObservable(initial) {
  let value = initial
  const listeners = new Set()
  return {
    getSnapshot: () => value,
    subscribe(fn) {
      listeners.add(fn)
      return () => { listeners.delete(fn) }
    },
    update(next) {
      if (next === value) return
      value = next
      for (const fn of [...listeners]) {
        try { fn() } catch (error) { console.error('gal-view: subscriber failed:', error) }
      }
    },
    set(next) {
      if (next === value) return
      value = next
      for (const fn of [...listeners]) {
        try { fn() } catch (error) { console.error('gal-view: subscriber failed:', error) }
      }
    },
  }
}

/** 撤销/重做历史栈（快照为完整场景深拷贝，上限裁剪最旧）。 */
export function createHistory(limit = 100) {
  let undo = []
  let redo = []
  return {
    push(snapshot) {
      undo.push(snapshot)
      if (undo.length > limit) undo.shift()
      redo.length = 0
    },
    undoStep(current) {
      if (undo.length === 0) return null
      redo.push(current)
      return undo.pop()
    },
    redoStep(current) {
      if (redo.length === 0) return null
      undo.push(current)
      return redo.pop()
    },
    info() {
      return { undo: undo.length, redo: redo.length }
    },
    reset() {
      undo.length = 0
      redo.length = 0
    },
  }
}

/** localStorage 包装：隐私模式/配额异常返回 null（无持久化，功能照常）。 */
export function createStorage() {
  try {
    const key = '__gal-view-probe__'
    window.localStorage.setItem(key, '1')
    window.localStorage.removeItem(key)
    return window.localStorage
  } catch {
    return null
  }
}

/** 读取持久化 JSON；任何失败返回 null。 */
export function loadJSON(storage, key) {
  if (storage === null) return null
  try {
    const raw = storage.getItem(key)
    if (raw === null) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/** 写入持久化 JSON；失败静默（场景仅本次会话内有效）。 */
export function saveJSON(storage, key, value) {
  if (storage === null) return
  try {
    storage.setItem(key, JSON.stringify(value))
  } catch {
    // 配额/隐私模式：忽略。
  }
}

/**
 * 通用 IndexedDB 存储驱动（素材库/字体库共用）：内存镜像 + 异步落库；
 * indexedDB 不可用时退化为纯内存（不持久）。
 */
export function createIdbStore(dbName, storeName) {
  const memory = new Map()
  let openPromise = null

  const open = () => {
    if (typeof indexedDB === 'undefined') return Promise.reject(new Error('indexedDB 不可用'))
    if (openPromise === null) {
      openPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, 1)
        req.onupgradeneeded = () => {
          const db = req.result
          if (!db.objectStoreNames.contains(storeName)) db.createObjectStore(storeName, { keyPath: 'id' })
        }
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error ?? new Error('indexedDB 打开失败'))
      })
    }
    return openPromise
  }

  /** 单次事务；不可用/失败返回 undefined（调用方降级到内存镜像）。 */
  const tx = async (mode, fn) => {
    try {
      const db = await open()
      return await new Promise((resolve, reject) => {
        const t = db.transaction(storeName, mode)
        const req = fn(t.objectStore(storeName))
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error ?? new Error('indexedDB 操作失败'))
      })
    } catch {
      return undefined
    }
  }

  return {
    async getAll() {
      const rows = await tx('readonly', store => store.getAll())
      return Array.isArray(rows) && rows.length > 0 ? rows : [...memory.values()]
    },
    async put(record) {
      memory.set(record.id, record)
      await tx('readwrite', store => store.put(record))
    },
    async remove(id) {
      memory.delete(id)
      await tx('readwrite', store => store.delete(id))
    },
  }
}
