/** gal-view 浏览器 half：注册 conversation.view 槽位的 'gal' 视图。
 * 官方 bundle 插件 client 契约：经 __ModuleLoader__.load 挂载，export name/inject/apply；
 * apply 收到 client 根 ctx，用 ctx.slots.inject 等待 ui-conversation 声明后注册（
 * 卸载时随纤维自动移除标签页）。场景存储/历史/API 在 apply 闭包内构建，经
 * inject 面的 hooks 舱（scene/history 可观察源）与 api（普通回调）交付组件。
 *
 * 槽位位置：order 5 —— 「对话」(0) 与「轨迹」(10) 之间。
 */

import { CSS } from './styles.mjs'
import { GalView } from './GalView.jsx'
import { GalViewSettingsTab } from './SettingsTab.jsx'
import {
  defaultScene, normalizeScene, cloneScene, makeElement, makeId, sortElements,
  ELEMENT_TYPES, ensureDialogueText, ensureSpeakerNames, ensureActionButtons,
} from './scene.mjs'
import {
  ASSET_MIME, MAX_ASSET_BYTES, normalizeAsset, readFileAsDataUrl, measureImage,
  embedAssets, extractAssets, createIdbAssets,
} from './assets.mjs'
import {
  MAX_FONT_BYTES, FONT_FORMATS, normalizeFont, buildFontFace, fontFamilyFromName,
  extOf, embedFonts, extractFonts, createIdbFonts,
} from './fonts.mjs'
import { createObservable, createHistory, createStorage, loadJSON, saveJSON } from './store.mjs'
// 默认预设场景：仓库根 gal-scene.json（编辑器导出的格式，内嵌被引用的素材/字体）。
import presetScene from '../../gal-scene.json'

export const name = 'gal-view'

/** 依赖服务：槽位系统（会话数据经槽位框架注入，无需直接消费 sessions）。 */
export const inject = ['slots']

const PERSIST_KEY = 'gal-view:scene:v1'
const ENABLED_KEY = 'gal-view:enabled'
const HISTORY_LIMIT = 100

/**
 * 每会话阅读状态（经槽位 store 声明，框架按会话调用 create(scopeKey) 实例化）：
 * 标签页切换/刷新后恢复当前行、页码与打字进度，对话不再从头渲染。
 * 手写 handle 契约（spec + create），避免引入 runtime 模块依赖。
 */
function createReadStore() {
  return {
    spec: {
      init: () => ({ lineKey: null, pageIndex: 0, shown: '', done: true, dwellSince: null, statusHold: false }),
      persist: 'gal-view.read',
      actions: {
        saveProgress: (draft, progress) => {
          draft.lineKey = progress.lineKey
          draft.pageIndex = progress.pageIndex
          draft.shown = progress.shown
          draft.done = progress.done
          draft.dwellSince = progress.dwellSince
          draft.statusHold = progress.statusHold
        },
      },
    },
    create(scopeKey) {
      const persistKey = scopeKey === undefined
        ? 'gal-view.read'
        : 'gal-view.read.' + String(scopeKey)
      let state = { lineKey: null, pageIndex: 0, shown: '', done: true, dwellSince: null, statusHold: false }
      try {
        const raw = window.localStorage.getItem(persistKey)
        if (raw !== null) {
          const parsed = JSON.parse(raw)
          if (parsed !== null && typeof parsed === 'object') state = parsed
        }
      } catch {
        // 隐私模式/坏数据：用初始状态。
      }
      const listeners = new Set()
      const persist = () => {
        try { window.localStorage.setItem(persistKey, JSON.stringify(state)) } catch { /* 忽略 */ }
      }
      return {
        getSnapshot: () => state,
        subscribe(fn) {
          listeners.add(fn)
          return () => { listeners.delete(fn) }
        },
        actions: {
          saveProgress(progress) {
            state = {
              lineKey: progress.lineKey,
              pageIndex: progress.pageIndex,
              shown: progress.shown,
              done: progress.done,
              dwellSince: progress.dwellSince,
              statusHold: progress.statusHold === true,
            }
            persist()
            for (const fn of [...listeners]) fn()
          },
        },
        clearPersisted() {
          try { window.localStorage.removeItem(persistKey) } catch { /* 忽略 */ }
        },
      }
    },
  }
}

/** 场景 API 工厂：所有变更实时写 sceneSource；历史栈承载可撤销快照；素材/字体库读写 IDB。 */
function createSceneApi(sceneSource, history, historySource, storage, assetsSource, idb, fontsSource, fontIdb, seedPresetAssets, presetBase) {
  const current = () => sceneSource.getSnapshot()

  const commit = next => {
    sceneSource.update(next)
    saveJSON(storage, PERSIST_KEY, next)
  }

  const snapshotScene = () => cloneScene(current())

  const commitHistory = before => {
    if (before === undefined || before === null) return
    const now = current()
    if (JSON.stringify(now) === JSON.stringify(before)) return
    history.push(before)
    historySource.update(history.info())
  }

  const pushAndCommit = next => {
    const before = snapshotScene()
    commit(next)
    history.push(before)
    historySource.update(history.info())
  }

  return {
    /** 快照当前场景（拖动/属性编辑起手）。 */
    snapshotScene,

    /** 实时更新单个元素（不写历史）。 */
    updateElement(id, patch) {
      commit({
        ...current(),
        elements: current().elements.map(el => (el.id === id ? { ...el, ...patch } : el)),
      })
    },

    /** 实时更新设置（浅合并进 settings；不写历史）。 */
    updateSettings(patch) {
      commit({
        ...current(),
        settings: { ...current().settings, ...patch },
      })
    },

    /** 以起手快照提交一次历史（无变化则跳过）。 */
    commitHistory,

    /** 添加元素（自带历史），返回新 id。 */
    addElement(type, opts = {}) {
      if (!ELEMENT_TYPES.includes(type)) return null
      const s = current()
      const index = opts.index ?? s.elements.filter(el => el.type === type).length
      const el = makeElement(type, {
        id: opts.id,
        index,
        role: opts.role,
        stageW: s.settings.stageW,
        stageH: s.settings.stageH,
      })
      pushAndCommit({ ...s, elements: [...s.elements, el] })
      return el.id
    },

    /** 删除元素（自带历史）。 */
    removeElement(id) {
      const s = current()
      pushAndCommit({ ...s, elements: s.elements.filter(el => el.id !== id) })
    },

    /** 复制元素（自带历史），返回副本 id。 */
    duplicateElement(id) {
      const s = current()
      const src = s.elements.find(el => el.id === id)
      if (src === undefined) return null
      const copy = {
        ...cloneScene(src),
        id: makeId('el'),
        name: src.name + ' 副本',
        x: src.x + 16,
        y: src.y + 16,
        z: src.z + 1,
        locked: false,
      }
      pushAndCommit({ ...s, elements: [...s.elements, copy] })
      return copy.id
    },

    /** 图层操作：up/down 交换相邻 z；top/bottom 置为极值。 */
    reorderElement(id, dir) {
      const s = current()
      const sorted = sortElements(s.elements)
      const at = sorted.findIndex(el => el.id === id)
      if (at < 0) return
      const target = sorted[at]
      let z = target.z
      if (dir === 'up' && at < sorted.length - 1) z = sorted[at + 1].z + 0
      else if (dir === 'down' && at > 0) z = sorted[at - 1].z
      else if (dir === 'top') z = (sorted[sorted.length - 1]?.z ?? 0) + 1
      else if (dir === 'bottom') z = (sorted[0]?.z ?? 0) - 1
      if (z === target.z && dir !== 'top' && dir !== 'bottom') {
        // up/down 交换 z
        const other = dir === 'up' ? sorted[at + 1] : sorted[at - 1]
        if (other === undefined) return
        const zA = target.z
        const zB = other.z
        pushAndCommit({
          ...s,
          elements: s.elements.map(el => {
            if (el.id === target.id) return { ...el, z: zB }
            if (el.id === other.id) return { ...el, z: zA }
            return el
          }),
        })
        return
      }
      pushAndCommit({
        ...s,
        elements: s.elements.map(el => (el.id === id ? { ...el, z } : el)),
      })
    },

    /** 导入场景（归一化 + 自带历史；内嵌素材先还原进素材库）。 */
    replaceScene(raw) {
      const next = normalizeScene(raw)
      if (next === null) return false
      const embedded = extractAssets(raw)
      if (embedded.length > 0) {
        const map = new Map(assetsSource.getSnapshot().map)
        for (const record of embedded) {
          map.set(record.id, record)
          void idb.put(record).catch(() => {})
        }
        assetsSource.update({ map })
      }
      const embeddedFonts = extractFonts(raw)
      if (embeddedFonts.length > 0) {
        const map = new Map(fontsSource.getSnapshot().map)
        for (const record of embeddedFonts) {
          map.set(record.id, record)
          void fontIdb.put(record).catch(() => {})
        }
        fontsSource.update({ map })
      }
      pushAndCommit(next)
      return true
    },

    /** 重置为默认预设场景（自带历史；预设素材同步还原进库）。 */
    resetScene() {
      seedPresetAssets()
      pushAndCommit(presetBase())
    },

    /** 撤销 / 重做（真正的 history stack）。 */
    undo() {
      const prev = history.undoStep(snapshotScene())
      if (prev === null) return
      commit(prev)
      historySource.update(history.info())
    },
    redo() {
      const next = history.redoStep(snapshotScene())
      if (next === null) return
      commit(next)
      historySource.update(history.info())
    },

    /** 导出场景 JSON：内嵌被引用的素材与字体 dataURL（组件负责 Blob 下载）。 */
    exportScene() {
      const withAssets = embedAssets(current(), assetsSource.getSnapshot().map)
      return JSON.stringify(embedFonts(withAssets, fontsSource.getSnapshot().map), null, 2)
    },

    /** 素材库：导入图片文件（多选；跳过非图片/超限/损坏项）。 */
    async importAssets(files) {
      const list = Array.isArray(files) ? files : []
      let added = 0
      let skipped = 0
      const ids = []
      for (const file of list) {
        const type = file !== null && typeof file === 'object' ? file.type : ''
        const size = file !== null && typeof file === 'object' ? file.size : Infinity
        if (typeof type !== 'string' || !ASSET_MIME.test(type) || typeof size !== 'number' || size > MAX_ASSET_BYTES) {
          skipped += 1
          continue
        }
        try {
          const dataUrl = await readFileAsDataUrl(file)
          const { width, height } = await measureImage(dataUrl)
          const record = normalizeAsset({
            id: makeId('asset'),
            name: typeof file.name === 'string' && file.name !== '' ? file.name : '素材',
            mime: type,
            dataUrl,
            width,
            height,
            createdAt: Date.now(),
          })
          if (record === null) {
            skipped += 1
            continue
          }
          await idb.put(record)
          const map = new Map(assetsSource.getSnapshot().map)
          map.set(record.id, record)
          assetsSource.update({ map })
          ids.push(record.id)
          added += 1
        } catch (error) {
          console.warn('[gal-view] 素材导入失败：' + String(error?.message ?? error))
          skipped += 1
        }
      }
      return { added, skipped, ids }
    },

    /** 素材库：删除素材并清除所有元素引用（一次性历史）。 */
    async removeAsset(id) {
      const map = new Map(assetsSource.getSnapshot().map)
      if (!map.has(id)) return false
      map.delete(id)
      assetsSource.update({ map })
      void idb.remove(id).catch(() => {})
      const s = current()
      if (s.elements.some(el => el.image === id)) {
        pushAndCommit({ ...s, elements: s.elements.map(el => (el.image === id ? { ...el, image: null } : el)) })
      }
      return true
    },

    /** 素材记录查询（组件渲染用；缺失返回 null → 占位图形）。 */
    asset(id) {
      if (typeof id !== 'string' || id === '') return null
      return assetsSource.getSnapshot().map.get(id) ?? null
    },

    /** 字体库：导入字体文件（多选；跳过非字体/超限/损坏项）。 */
    async importFonts(files) {
      const list = Array.isArray(files) ? files : []
      let added = 0
      let skipped = 0
      const ids = []
      for (const file of list) {
        if (file === null || typeof file !== 'object') { skipped += 1; continue }
        const ext = extOf(typeof file.name === 'string' ? file.name : '')
        const format = FONT_FORMATS[ext]
        const mimeOk = typeof file.type === 'string' && /font\/(ttf|otf|woff2?)/i.test(file.type)
        if (format === undefined && !mimeOk) { skipped += 1; continue }
        const size = typeof file.size === 'number' ? file.size : Infinity
        if (size > MAX_FONT_BYTES) { skipped += 1; continue }
        try {
          const dataUrl = await readFileAsDataUrl(file)
          const baseFamily = fontFamilyFromName(typeof file.name === 'string' ? file.name : '')
          const existing = [...fontsSource.getSnapshot().map.values()]
          let family = baseFamily
          let n = 1
          while (existing.some(record => record.family.toLowerCase() === family.toLowerCase())) {
            n += 1
            family = baseFamily + '-' + n
          }
          const record = normalizeFont({
            id: makeId('font'),
            name: typeof file.name === 'string' && file.name !== '' ? file.name : '字体',
            family,
            format: format ?? 'truetype',
            dataUrl,
            createdAt: Date.now(),
          })
          if (record === null) { skipped += 1; continue }
          await fontIdb.put(record)
          const map = new Map(fontsSource.getSnapshot().map)
          map.set(record.id, record)
          fontsSource.update({ map })
          ids.push(record.id)
          added += 1
        } catch {
          skipped += 1
        }
      }
      return { added, skipped, ids }
    },

    /** 字体库：删除字体（元素引用保留 family 字符串，缺失时浏览器自然回退）。 */
    async removeFont(id) {
      const map = new Map(fontsSource.getSnapshot().map)
      if (!map.has(id)) return false
      map.delete(id)
      fontsSource.update({ map })
      void fontIdb.remove(id).catch(() => {})
      return true
    },

    /** 字体记录查询（组件渲染用）。 */
    font(id) {
      if (typeof id !== 'string' || id === '') return null
      return fontsSource.getSnapshot().map.get(id) ?? null
    },
  }
}

/**
 * 客户端插件入口：注入样式、构建场景运行时、注册视图标签页。
 * @param ctx - client 根上下文（提供 slots 服务）。
 */
export function apply(ctx) {
  // 幂等守卫：重复执行（HMR/loader 重跑）不重复注入样式。
  if (document.querySelector('style[data-gal-view-style]') !== null) return

  const styleEl = document.createElement('style')
  styleEl.setAttribute('data-gal-view-style', '')
  styleEl.setAttribute('data-plugin', 'gal-view')
  styleEl.textContent = CSS
  document.head.append(styleEl)

  const storage = createStorage()
  // 素材库：IndexedDB 持久 + 内存可观察镜像（图片 dataURL 不进 localStorage）。
  const assetsSource = createObservable({ map: new Map() })
  const idb = createIdbAssets()
  void idb.getAll().then(records => {
    // 合并而非替换：预设种子素材（同步种入内存镜像）可能尚未落库，替换会丢。
    if (records.length > 0) {
      const map = new Map(assetsSource.getSnapshot().map)
      for (const record of records) map.set(record.id, record)
      assetsSource.update({ map })
    }
  }).catch(() => {})
  // 字体库：IndexedDB 持久 + @font-face 动态注册。
  const fontsSource = createObservable({ map: new Map() })
  const fontIdb = createIdbFonts()
  const fontStyleEl = document.createElement('style')
  fontStyleEl.setAttribute('data-gal-view-fonts', '')
  fontStyleEl.setAttribute('data-plugin', 'gal-view')
  document.head.append(fontStyleEl)
  const syncFontStyles = () => {
    const faces = [...fontsSource.getSnapshot().map.values()].map(buildFontFace)
    fontStyleEl.textContent = faces.join('\n')
  }
  syncFontStyles()
  fontsSource.subscribe(syncFontStyles)
  void fontIdb.getAll().then(records => {
    // 合并而非替换：预设种子字体（同步种入内存镜像）可能尚未落库，替换会丢。
    if (records.length > 0) {
      const map = new Map(fontsSource.getSnapshot().map)
      for (const record of records) map.set(record.id, record)
      fontsSource.update({ map })
      syncFontStyles()
    }
  }).catch(() => {})

  // 默认预设：仓库根 gal-scene.json（导出格式，内嵌被引用素材/字体）。
  // 首次启动（本地无存档场景）加载预设场景，并把内嵌素材/字体还原进库；
  // 已有存档场景的用户不受影响（编辑模式「重置」也回到预设）。
  const hasPreset = presetScene !== null && typeof presetScene === 'object'
  const seedPresetAssets = () => {
    if (!hasPreset) return
    const embedded = extractAssets(presetScene)
    if (embedded.length > 0) {
      const map = new Map(assetsSource.getSnapshot().map)
      for (const record of embedded) {
        map.set(record.id, record)
        void idb.put(record).catch(() => {})
      }
      assetsSource.update({ map })
    }
    const embeddedFonts = extractFonts(presetScene)
    if (embeddedFonts.length > 0) {
      const map = new Map(fontsSource.getSnapshot().map)
      for (const record of embeddedFonts) {
        map.set(record.id, record)
        void fontIdb.put(record).catch(() => {})
      }
      fontsSource.update({ map })
    }
  }
  const presetBase = () => (hasPreset ? (normalizeScene(presetScene) ?? defaultScene()) : defaultScene())
  const savedScene = loadJSON(storage, PERSIST_KEY)
  const usePreset = hasPreset && savedScene === null
  // 迁移：旧场景补「台词」、双名牌与四个预设功能按钮（幂等）。
  const initial = ensureActionButtons(ensureSpeakerNames(ensureDialogueText(
    (usePreset ? presetBase() : normalizeScene(savedScene)) ?? defaultScene(),
  )))
  if (usePreset) seedPresetAssets()
  const sceneSource = createObservable(initial)
  const history = createHistory(HISTORY_LIMIT)
  const historySource = createObservable({ undo: 0, redo: 0 })
  const api = createSceneApi(sceneSource, history, historySource, storage, assetsSource, idb, fontsSource, fontIdb, seedPresetAssets, presetBase)

  // 插件开关：设置选项卡控制会话页「GAL视窗」标签的显隐。
  const enabledSource = createObservable(loadJSON(storage, ENABLED_KEY) !== false)
  const setEnabled = value => {
    enabledSource.update(value === true)
    saveJSON(storage, ENABLED_KEY, value === true)
  }

  ctx.effect(() => () => { styleEl.remove(); fontStyleEl.remove() }, 'gal-view: styles')

  // 注册 conversation.view 列表条目：order 5 落在「对话」(0) 与「轨迹」(10) 之间。
  // slots.inject 等待槽位声明，声明崩溃时随纤维一起移除标签页。
  // 响应开关：禁用时注销条目（标签页消失），启用时重新注册。
  ctx.slots.inject('conversation.view', () => {
    let dispose = null
    const sync = () => {
      if (dispose !== null) {
        dispose()
        dispose = null
      }
      if (enabledSource.getSnapshot() !== true) return
      dispose = ctx.slots.register({
        name: 'conversation.view',
        id: 'gal',
        order: 5,
        label: () => 'GAL视窗',
        store: createReadStore(),
        inject: () => ({
          hooks: { scene: sceneSource, history: historySource, assets: assetsSource, fonts: fontsSource },
          api,
        }),
      }, GalView)
    }
    sync()
    const unsubscribe = enabledSource.subscribe(sync)
    return () => {
      unsubscribe()
      if (dispose !== null) dispose()
    }
  })

  // 设置面板「插件」分区下的 GAL 视窗选项卡（启用/停用开关）。
  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'gal-view',
    order: 20,
    label: () => 'GAL 视窗',
    inject: () => ({
      hooks: { enabled: enabledSource },
      setEnabled,
    }),
  }, GalViewSettingsTab))
}
