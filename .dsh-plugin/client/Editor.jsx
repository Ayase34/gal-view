/** 元素编辑模式：工具栏 + 元素树 + 舞台画布 + 属性面板 + 快捷键。
 * 所有修改实时写入场景（游戏模式同步生效）；离散操作自带历史，拖拽/属性编辑
 * 采用「起手快照 → 实时写 → 收手提交」模式，撤销/重做是真正的 history stack。
 */

import React, { useEffect, useRef, useState } from 'react'
import { StageView } from './StageView.jsx'
import { ELEMENT_TYPES, TYPE_LABELS, sortElements, makeElement } from './scene.mjs'
import { BUILTIN_FONTS } from './fonts.mjs'

/** 树节点类型记号（纯 CSS 图形，不用 emoji）。 */
function TypeGlyph({ type }) {
  return <span className={'gv-glyph gv-glyph-' + type} aria-hidden="true" />
}

/** 数值属性行：聚焦快照 → 实时写 → 失焦提交历史。 */
function NumberField({ label, value, onValue, api, step = 1, min, max }) {
  const baseline = useRef(null)
  const commit = () => {
    if (baseline.current !== null) {
      api.commitHistory(baseline.current)
      baseline.current = null
    }
  }
  return (
    <label className="gv-prop-row">
      <span className="gv-prop-label">{label}</span>
      <input
        type="number"
        className="gv-prop-input"
        value={Math.round(value * 100) / 100}
        step={step}
        min={min}
        max={max}
        onFocus={() => { baseline.current = api.snapshotScene() }}
        onChange={e => {
          const n = parseFloat(e.target.value)
          if (Number.isFinite(n)) onValue(n)
        }}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur() }}
      />
    </label>
  )
}

/** 文本属性行（同历史模式）。 */
function TextField({ label, value, onValue, api, placeholder }) {
  const baseline = useRef(null)
  const commit = () => {
    if (baseline.current !== null) {
      api.commitHistory(baseline.current)
      baseline.current = null
    }
  }
  return (
    <label className="gv-prop-row">
      <span className="gv-prop-label">{label}</span>
      <input
        type="text"
        className="gv-prop-input"
        value={value}
        placeholder={placeholder}
        onFocus={() => { baseline.current = api.snapshotScene() }}
        onChange={e => onValue(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur() }}
      />
    </label>
  )
}

/** 颜色属性行。 */
function ColorField({ label, value, onValue, api }) {
  const baseline = useRef(null)
  const commit = () => {
    if (baseline.current !== null) {
      api.commitHistory(baseline.current)
      baseline.current = null
    }
  }
  return (
    <label className="gv-prop-row">
      <span className="gv-prop-label">{label}</span>
      <span className="gv-prop-color">
        <input
          type="color"
          value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : '#9b8cff'}
          onFocus={() => { baseline.current = api.snapshotScene() }}
          onChange={e => onValue(e.target.value)}
          onBlur={commit}
        />
        <span className="gv-prop-color-value">{value}</span>
      </span>
    </label>
  )
}

/** 勾选行。 */
function CheckField({ label, checked, onToggle, api }) {
  return (
    <label className="gv-prop-row">
      <span className="gv-prop-label">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => {
          const before = api.snapshotScene()
          onToggle(e.target.checked)
          api.commitHistory(before)
        }}
      />
    </label>
  )
}

/** 属性面板：按选中元素类型渲染可编辑字段。 */
function PropertiesPanel({ el, api, scene, assetsMap, fontsMap }) {
  const update = patch => api.updateElement(el.id, patch)
  const isShape = el.type === 'text' || el.type === 'dialogue-text' || el.type === 'speaker-name' || el.type === 'button' || el.type === 'action-button' || el.type === 'image' || el.type === 'rect' || el.type === 'circle' || el.type === 'decoration' || el.type === 'dialogue' || el.type === 'background'
  return (
    <div className="gv-props">
      <div className="gv-props-head">
        <span className="gv-props-type">{TYPE_LABELS[el.type] ?? el.type}</span>
        <span className="gv-props-title">{el.name !== '' ? el.name : '未命名元素'}</span>
      </div>
      <TextField label="名称" value={el.name} onValue={v => update({ name: v })} api={api} placeholder="元素名称" />
      {el.type === 'action-button' && (
        <>
          <div className="gv-props-sec">功能绑定</div>
          <label className="gv-prop-row">
            <span className="gv-prop-label">绑定功能</span>
            <select
              className="gv-prop-input"
              value={el.action ?? ''}
              onChange={e => {
                const before = api.snapshotScene()
                update({ action: e.target.value })
                api.commitHistory(before)
              }}
            >
              <option value="">无（装饰按钮）</option>
              <option value="history">历史</option>
              <option value="auto">自动</option>
              <option value="skip">快进</option>
              <option value="settings">设置</option>
            </select>
          </label>
          <p className="gv-settings-hint">游戏模式中点击触发绑定功能；「自动」按钮会随开关状态高亮。文本/样式照常自定义。</p>
        </>
      )}
      {el.type === 'speaker-name' && (
        <>
          <div className="gv-props-sec">名牌</div>
          <label className="gv-prop-row">
            <span className="gv-prop-label">显示时机</span>
            <select
              className="gv-prop-input"
              value={el.role === 'assistant' ? 'assistant' : 'player'}
              onChange={e => {
                const before = api.snapshotScene()
                update({ role: e.target.value === 'assistant' ? 'assistant' : 'player' })
                api.commitHistory(before)
              }}
            >
              <option value="player">玩家台词时</option>
              <option value="assistant">AI 台词时</option>
            </select>
          </label>
          <p className="gv-settings-hint">名称即下方「文本」字段，自由设置；仅对应一方说话时显示。</p>
        </>
      )}
      <div className="gv-props-sec">位置</div>
      <NumberField label="X" value={el.x} onValue={v => update({ x: v })} api={api} />
      <NumberField label="Y" value={el.y} onValue={v => update({ y: v })} api={api} />
      <div className="gv-props-sec">尺寸</div>
      <NumberField label="宽" value={el.w} min={12} onValue={v => update({ w: v })} api={api} />
      <NumberField label="高" value={el.h} min={12} onValue={v => update({ h: v })} api={api} />
      <div className="gv-props-sec">变换</div>
      <NumberField label="旋转°" value={el.rotation} onValue={v => update({ rotation: v })} api={api} />
      <NumberField label="不透明度%" value={el.opacity * 100} min={0} max={100} onValue={v => update({ opacity: Math.min(1, Math.max(0, v / 100)) })} api={api} />
      <NumberField label="层级" value={el.z} onValue={v => update({ z: v })} api={api} />
      <div className="gv-props-sec">外观</div>
      {el.type === 'character' && (
        <>
          <TextField label="角色名" value={el.character?.name ?? ''} onValue={v => update({ character: { ...(el.character ?? {}), name: v } })} api={api} />
          <TextField label="占位标签" value={el.character?.label ?? ''} onValue={v => update({ character: { ...(el.character ?? {}), label: v } })} api={api} />
          <ColorField label="角色色" value={el.character?.color ?? '#9b8cff'} onValue={v => update({ character: { ...(el.character ?? {}), color: v }, color: v })} api={api} />
        </>
      )}
      {isShape && <TextField label="背景" value={el.background} onValue={v => update({ background: v })} api={api} placeholder="CSS background 值" />}
      <ColorField label="边框色" value={el.borderColor} onValue={v => update({ borderColor: v })} api={api} />
      <NumberField label="边框宽" value={el.borderWidth} min={0} onValue={v => update({ borderWidth: v })} api={api} />
      <NumberField label="圆角" value={el.borderRadius} min={0} onValue={v => update({ borderRadius: v })} api={api} />
      {isShape && <NumberField label="字号" value={el.fontSize} min={8} onValue={v => update({ fontSize: v })} api={api} />}
      {(isShape || el.type === 'character') && <FontPicker el={el} api={api} fontsMap={fontsMap} />}
      {isShape && (
        <label className="gv-prop-row">
          <span className="gv-prop-label">对齐</span>
          <select
            className="gv-prop-input"
            value={el.align ?? 'left'}
            onChange={e => {
              const before = api.snapshotScene()
              update({ align: e.target.value })
              api.commitHistory(before)
            }}
          >
            <option value="left">左对齐</option>
            <option value="center">居中</option>
            <option value="right">右对齐</option>
          </select>
        </label>
      )}
      {isShape && <TextField label="文本" value={el.text} onValue={v => update({ text: v })} api={api} placeholder="占位文本" />}
      {el.type !== 'background' && <ColorField label="文字色" value={el.color} onValue={v => update({ color: v })} api={api} />}
      <div className="gv-props-sec">图片素材</div>
      <AssetPicker el={el} api={api} assetsMap={assetsMap} />
      <div className="gv-props-sec">状态</div>
      <CheckField label="锁定" checked={el.locked} onToggle={v => update({ locked: v })} api={api} />
      <CheckField label="隐藏" checked={el.hidden} onToggle={v => update({ hidden: v })} api={api} />
    </div>
  )
}

/** 字体选择：内置字体 + 导入的自定义字体；自定义字体可删除（引用自然回退）。 */
function FontPicker({ el, api, fontsMap }) {
  const update = patch => api.updateElement(el.id, patch)
  const custom = [...fontsMap.values()].sort((a, b) => b.createdAt - a.createdAt)
  const isCustom = custom.some(record => record.family === el.fontFamily)
  return (
    <>
      <label className="gv-prop-row">
        <span className="gv-prop-label">字体</span>
        <select
          className="gv-prop-input"
          value={el.fontFamily ?? ''}
          onChange={e => {
            const before = api.snapshotScene()
            update({ fontFamily: e.target.value })
            api.commitHistory(before)
          }}
        >
          {BUILTIN_FONTS.map(font => (
            <option key={font.value} value={font.value}>{font.label}</option>
          ))}
          {custom.length > 0 && (
            <optgroup label="自定义字体">
              {custom.map(record => (
                <option key={record.id} value={record.family}>{record.name}</option>
              ))}
            </optgroup>
          )}
        </select>
      </label>
      {isCustom && (
        <div className="gv-prop-actions">
          <button
            type="button"
            className="gv-btn"
            onClick={() => {
              const record = custom.find(r => r.family === el.fontFamily)
              if (record !== undefined) void api.removeFont(record.id)
            }}
          >
            从字体库删除
          </button>
        </div>
      )}
    </>
  )
}

/** 图片素材选择：下拉应用/清除 + 导入并应用 + 从素材库删除。 */
function AssetPicker({ el, api, assetsMap }) {
  const fileRef = useRef(null)
  const apply = assetId => {
    const before = api.snapshotScene()
    api.updateElement(el.id, { image: assetId === '' ? null : assetId })
    api.commitHistory(before)
  }
  const onImportAndApply = e => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file === undefined) return
    void api.importAssets([file]).then(result => {
      if (result.ids.length > 0) apply(result.ids[0])
    })
  }
  const records = [...assetsMap.values()].sort((a, b) => b.createdAt - a.createdAt)
  const current = typeof el.image === 'string' ? assetsMap.get(el.image) ?? null : null
  return (
    <>
      <label className="gv-prop-row">
        <span className="gv-prop-label">素材</span>
        <select
          className="gv-prop-input"
          value={current !== null ? current.id : ''}
          onChange={e => apply(e.target.value)}
        >
          <option value="">无（占位图形）</option>
          {records.map(record => (
            <option key={record.id} value={record.id}>
              {record.name}{record.width > 0 ? '（' + record.width + '×' + record.height + '）' : ''}
            </option>
          ))}
        </select>
      </label>
      <div className="gv-prop-actions">
        <button type="button" className="gv-btn" onClick={() => fileRef.current?.click()}>
          导入素材并应用
        </button>
        {current !== null && (
          <button type="button" className="gv-btn" onClick={() => void api.removeAsset(current.id)}>
            从素材库删除
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        style={{ display: 'none' }}
        onChange={onImportAndApply}
        aria-label="导入素材并应用"
      />
    </>
  )
}

/** 元素树：层级序 + 选中 + 锁定/显示切换 + 场景设置区。 */
function ElementTree({ scene, api, selectedId, onSelect }) {
  const rows = [...sortElements(scene.elements)].reverse()
  return (
    <div className="gv-tree">
      <div className="gv-tree-root">
        <TypeGlyph type="scene" />
        <span>SCENE</span>
        <span className="gv-tree-count">{rows.length} 元素</span>
      </div>
      <div className="gv-tree-list" role="tree" aria-label="元素树">
        {rows.map(el => (
          <div
            key={el.id}
            role="treeitem"
            aria-selected={el.id === selectedId}
            tabIndex={0}
            className={'gv-tree-row' + (el.id === selectedId ? ' is-selected' : '')}
            onClick={() => onSelect(el.id)}
            onKeyDown={e => { if (e.key === 'Enter') onSelect(el.id) }}
          >
            <TypeGlyph type={el.type} />
            <span className="gv-tree-name">{el.name !== '' ? el.name : TYPE_LABELS[el.type] ?? el.type}</span>
            <button
              type="button"
              className={'gv-tree-toggle' + (el.locked ? ' is-on' : '')}
              title={el.locked ? '解锁' : '锁定'}
              aria-label={el.locked ? '解锁' : '锁定'}
              onClick={e => {
                e.stopPropagation()
                api.updateElement(el.id, { locked: !el.locked })
              }}
            >
              锁
            </button>
            <button
              type="button"
              className={'gv-tree-toggle' + (el.hidden ? ' is-off' : '')}
              title={el.hidden ? '显示' : '隐藏'}
              aria-label={el.hidden ? '显示' : '隐藏'}
              onClick={e => {
                e.stopPropagation()
                api.updateElement(el.id, { hidden: !el.hidden })
              }}
            >
              隐
            </button>
          </div>
        ))}
      </div>
      <div className="gv-tree-scene">
        <div className="gv-props-sec">场景</div>
        <NumberField label="舞台宽" value={scene.settings.stageW} min={320} onValue={v => api.updateSettings({ stageW: v })} api={api} />
        <NumberField label="舞台高" value={scene.settings.stageH} min={180} onValue={v => api.updateSettings({ stageH: v })} api={api} />
        <NumberField label="网格尺寸" value={scene.settings.gridSize} min={4} max={64} onValue={v => api.updateSettings({ gridSize: v })} api={api} />
      </div>
    </div>
  )
}

/** 边栏显隐偏好（localStorage；隐私模式/异常时用默认值）。 */
const PANELS_KEY = 'gal-view:editor-panels'
function loadPanels() {
  try {
    const raw = window.localStorage.getItem(PANELS_KEY)
    if (raw === null) return { tree: true, props: true }
    const parsed = JSON.parse(raw)
    return {
      tree: parsed.tree !== false,
      props: parsed.props !== false,
    }
  } catch {
    return { tree: true, props: true }
  }
}
function savePanels(panels) {
  try {
    window.localStorage.setItem(PANELS_KEY, JSON.stringify(panels))
  } catch {
    // 隐私模式/配额：忽略（偏好仅本次会话内有效）。
  }
}

/** 编辑模式整体。 */
export function Editor({ scene, api, history, assetsMap, fontsMap, onExitEditor }) {
  const [selectedId, setSelectedId] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [addMenuPos, setAddMenuPos] = useState(null)
  const [panels, setPanels] = useState(loadPanels)
  const fileRef = useRef(null)
  const assetFileRef = useRef(null)
  const fontFileRef = useRef(null)
  const editorRef = useRef(null)
  const addBtnRef = useRef(null)
  const addMenuRef = useRef(null)
  const imageFileRef = useRef(null)
  const pendingImageElRef = useRef(null)
  const selected = scene.elements.find(el => el.id === selectedId) ?? null

  // 添加菜单渲染在编辑根节点（工具栏 overflow 裁剪会把下坠菜单切掉），
  // 打开时按按钮位置计算锚点；点击菜单外关闭。
  const toggleAddMenu = () => {
    if (addOpen) {
      setAddOpen(false)
      setAddMenuPos(null)
      return
    }
    const btn = addBtnRef.current?.getBoundingClientRect()
    const root = editorRef.current?.getBoundingClientRect()
    setAddMenuPos(btn !== undefined && root !== undefined
      ? { left: btn.left - root.left, top: btn.bottom - root.top + 4 }
      : { left: 0, top: 44 })
    setAddOpen(true)
  }
  useEffect(() => {
    if (!addOpen) return
    const onDown = e => {
      const target = e.target
      if (addMenuRef.current?.contains(target) || addBtnRef.current?.contains(target)) return
      setAddOpen(false)
      setAddMenuPos(null)
    }
    document.addEventListener('pointerdown', onDown)
    return () => { document.removeEventListener('pointerdown', onDown) }
  }, [addOpen])

  const togglePanel = key => {
    setPanels(prev => {
      const next = { ...prev, [key]: !prev[key] }
      savePanels(next)
      return next
    })
  }

  useEffect(() => {
    const onKey = e => {
      const target = e.target
      const typing = target instanceof HTMLElement
        && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)
      if (e.key === 'Escape') {
        if (selectedId !== null) setSelectedId(null)
        else onExitEditor()
        return
      }
      if (typing) return
      const mod = e.ctrlKey || e.metaKey
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId !== null) {
          e.preventDefault()
          api.removeElement(selectedId)
          setSelectedId(null)
        }
      } else if (mod && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault()
        if (selectedId !== null) setSelectedId(api.duplicateElement(selectedId))
      } else if (mod && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault()
        if (e.shiftKey) api.redo()
        else api.undo()
      } else if (mod && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault()
        api.redo()
      } else if (mod && (e.key === 's' || e.key === 'S')) {
        e.preventDefault()
        downloadScene(api.exportScene())
      }
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey) }
  }, [selectedId, api, onExitEditor])

  const addElement = (type, role) => {
    const count = scene.elements.filter(el => el.type === type).length
    const letter = String.fromCharCode(65 + (scene.elements.filter(el => el.type === 'character').length % 26))
    const id = api.addElement(type, { index: type === 'character' ? count : 0, letter, role })
    setAddOpen(false)
    setAddMenuPos(null)
    setSelectedId(id)
    // 「导入图片」：创建元素后直接打开文件选择，导入并应用（一步到位）。
    if (type === 'image') {
      pendingImageElRef.current = id
      imageFileRef.current?.click()
    }
  }

  /** 「导入图片」元素的文件选择：导入素材并应用到刚创建的元素。 */
  const onImportImage = e => {
    const files = e.target.files
    // 先固化文件对象再清空 input：清空 value 会让 FileList 变为空（文件对象本身不受影响）。
    const list = files === null ? [] : Array.from(files)
    e.target.value = ''
    if (list.length === 0) return
    const targetId = pendingImageElRef.current
    pendingImageElRef.current = null
    void api.importAssets(list).then(result => {
      if (result.ids.length > 0 && targetId !== null) {
        const before = api.snapshotScene()
        api.updateElement(targetId, { image: result.ids[0] })
        api.commitHistory(before)
      }
    })
  }

  const onImportFile = e => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file === undefined) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const ok = api.replaceScene(JSON.parse(String(reader.result)))
        if (ok) setSelectedId(null)
      } catch {
        // 非法 JSON：忽略（replaceScene 也会拒绝非对象输入）。
      }
    }
    reader.readAsText(file)
  }

  /** 导入素材：多选图片进入素材库（随后在属性面板应用到元素）。 */
  const onImportAssets = e => {
    const files = e.target.files
    e.target.value = ''
    if (files === null || files.length === 0) return
    void api.importAssets([...files]).then(result => {
      if (result.added === 0) console.warn('[gal-view] 素材导入失败或全部跳过')
    })
  }

  /** 导入字体：多选字体文件进入字体库（随后在属性面板「字体」下拉选择）。 */
  const onImportFonts = e => {
    const files = e.target.files
    e.target.value = ''
    if (files === null || files.length === 0) return
    void api.importFonts([...files]).then(result => {
      if (result.added === 0) console.warn('[gal-view] 字体导入失败或全部跳过')
    })
  }

  return (
    <div className="gv-editor" ref={editorRef}>
      <div className="gv-editor-toolbar" role="toolbar" aria-label="编辑器工具栏">
        <div className="gv-toolbar-group">
          <button ref={addBtnRef} type="button" className="gv-btn gv-btn-accent" onClick={toggleAddMenu}>＋ 添加元素</button>
          <button type="button" className="gv-btn" disabled={selected === null} onClick={() => { if (selected !== null) setSelectedId(api.duplicateElement(selected.id)) }} title="Ctrl+D">复制</button>
          <button type="button" className="gv-btn" disabled={selected === null} onClick={() => { if (selected !== null) { api.removeElement(selected.id); setSelectedId(null) } }} title="Delete">删除</button>
        </div>
        <div className="gv-toolbar-group">
          <button type="button" className="gv-btn" disabled={selected === null} onClick={() => selected !== null && api.reorderElement(selected.id, 'up')}>上移</button>
          <button type="button" className="gv-btn" disabled={selected === null} onClick={() => selected !== null && api.reorderElement(selected.id, 'down')}>下移</button>
          <button type="button" className="gv-btn" disabled={selected === null} onClick={() => selected !== null && api.reorderElement(selected.id, 'top')}>置顶</button>
          <button type="button" className="gv-btn" disabled={selected === null} onClick={() => selected !== null && api.reorderElement(selected.id, 'bottom')}>置底</button>
        </div>
        <div className="gv-toolbar-group">
          <button type="button" className={'gv-btn gv-toggle' + (scene.settings.showGrid ? ' is-on' : '')} onClick={() => api.updateSettings({ showGrid: !scene.settings.showGrid })}>网格</button>
          <button type="button" className={'gv-btn gv-toggle' + (scene.settings.snap ? ' is-on' : '')} onClick={() => api.updateSettings({ snap: !scene.settings.snap })}>吸附</button>
        </div>
        <div className="gv-toolbar-group">
          <button type="button" className={'gv-btn gv-toggle' + (panels.tree ? ' is-on' : '')} aria-pressed={panels.tree} onClick={() => togglePanel('tree')}>元素树</button>
          <button type="button" className={'gv-btn gv-toggle' + (panels.props ? ' is-on' : '')} aria-pressed={panels.props} onClick={() => togglePanel('props')}>属性</button>
        </div>
        <div className="gv-toolbar-group">
          <button type="button" className="gv-btn" disabled={history.undo === 0} onClick={() => api.undo()} title="Ctrl+Z">撤销</button>
          <button type="button" className="gv-btn" disabled={history.redo === 0} onClick={() => api.redo()} title="Ctrl+Y">重做</button>
        </div>
        <div className="gv-toolbar-group gv-toolbar-right">
          <button type="button" className="gv-btn" onClick={() => fileRef.current?.click()}>导入场景</button>
          <button type="button" className="gv-btn" onClick={() => assetFileRef.current?.click()}>导入素材</button>
          <button type="button" className="gv-btn" onClick={() => fontFileRef.current?.click()}>导入字体</button>
          <button type="button" className="gv-btn" onClick={() => downloadScene(api.exportScene())} title="Ctrl+S">导出</button>
          <button type="button" className="gv-btn" onClick={() => { api.resetScene(); setSelectedId(null) }}>重置</button>
          <input ref={fileRef} type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={onImportFile} aria-label="导入场景 JSON" />
          <input ref={assetFileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple style={{ display: 'none' }} onChange={onImportAssets} aria-label="导入图片素材" />
          <input ref={imageFileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" style={{ display: 'none' }} onChange={onImportImage} aria-label="导入图片" />
          <input ref={fontFileRef} type="file" accept=".ttf,.otf,.woff,.woff2" multiple style={{ display: 'none' }} onChange={onImportFonts} aria-label="导入字体文件" />
        </div>
      </div>
      <div className="gv-editor-body">
        <div className={'gv-editor-side gv-editor-tree' + (panels.tree ? '' : ' is-collapsed')} aria-hidden={!panels.tree}>
          <ElementTree scene={scene} api={api} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
        <div className="gv-editor-canvas">
          <StageView
            scene={scene}
            assetsMap={assetsMap}
            mode="editor"
            line={null}
            type={{ target: '', shown: '', done: true }}
            running={false}
            selectedId={selectedId}
            onSelect={setSelectedId}
            api={api}
            onSkip={() => {}}
          />
        </div>
        <div className={'gv-editor-side gv-editor-props' + (panels.props ? '' : ' is-collapsed')} aria-hidden={!panels.props}>
          {selected !== null
            ? <PropertiesPanel el={selected} api={api} scene={scene} assetsMap={assetsMap} fontsMap={fontsMap} />
            : (
                <div className="gv-props-empty">
                  <span className="gv-props-empty-mark" aria-hidden="true" />
                  <p>未选择元素</p>
                  <p className="gv-props-empty-hint">在画布或元素树中点选元素，编辑其位置、尺寸与外观</p>
                </div>
              )}
        </div>
      </div>
      {/* 与游戏模式输入区等高（84px）的占位条：保证舞台槽位两模式一致。 */}
      <div className="gv-editor-spacer" aria-hidden="true" />
      {/* 添加元素菜单：挂在编辑根节点，锚点按按钮位置计算（不受工具栏裁剪）。 */}
      {addOpen && addMenuPos !== null && (
        <div className="gv-add-menu" role="menu" ref={addMenuRef} style={{ left: addMenuPos.left, top: addMenuPos.top }}>
          {ELEMENT_TYPES.flatMap(type => {
            if (type === 'speaker-name') {
              return [
                { key: 'speaker-player', label: '玩家名牌', role: 'player', type },
                { key: 'speaker-ai', label: 'AI 名牌', role: 'assistant', type },
              ]
            }
            return [{ key: type, label: TYPE_LABELS[type], role: undefined, type }]
          }).map(entry => (
            <button key={entry.key} type="button" role="menuitem" onClick={() => addElement(entry.type, entry.role)}>
              <TypeGlyph type={entry.type} />
              {entry.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/** 导出：Blob 下载场景 JSON。 */
function downloadScene(json) {
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'gal-scene.json'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => { URL.revokeObjectURL(url) }, 0)
}
