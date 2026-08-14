/** 舞台视图：游戏模式与编辑模式共享的 16:9 舞台渲染。
 * - 测量容器 → 等比缩放舞台（逻辑坐标 stageW×stageH，transform: scale）。
 * - 游戏模式：场景元素 + 实时台词对话框（点击跳过打字动画）。
 * - 编辑模式：场景元素 + 网格 + 选中框/八向缩放手柄/旋转手柄 + 拖拽手势。
 * 手势经 api 直写场景（实时），起手快照、收手提交历史（可撤销）。
 */

import React, { useEffect, useRef, useState } from 'react'
import {
  elementStyle, sortElements, findDialogue, snapValue, elementCenter, MIN_SIZE,
} from './scene.mjs'
import {
  collectSnapLines, snapRect, MOVE_KEYS, resizeKeys, EDGE_THRESHOLD,
} from './snap.mjs'

/** 缩放手柄方位。 */
const HANDLES = [
  { dir: 'nw', cursor: 'nwse-resize', style: { left: -5, top: -5 } },
  { dir: 'n', cursor: 'ns-resize', style: { left: 'calc(50% - 5px)', top: -5 } },
  { dir: 'ne', cursor: 'nesw-resize', style: { right: -5, top: -5 } },
  { dir: 'e', cursor: 'ew-resize', style: { right: -5, top: 'calc(50% - 5px)' } },
  { dir: 'se', cursor: 'nwse-resize', style: { right: -5, bottom: -5 } },
  { dir: 's', cursor: 'ns-resize', style: { left: 'calc(50% - 5px)', bottom: -5 } },
  { dir: 'sw', cursor: 'nesw-resize', style: { left: -5, bottom: -5 } },
  { dir: 'w', cursor: 'ew-resize', style: { left: -5, top: 'calc(50% - 5px)' } },
]

/** 角色占位立绘：几何剪影（头 + 肩身）+ 标签牌；有素材时显示真实立绘。说话时加光晕。 */
function CharacterPlaceholder({ el, speaking, asset }) {
  const c = el.character ?? {}
  const color = c.color ?? el.color ?? '#9b8cff'
  return (
    <div className={'gv-char' + (speaking ? ' is-speaking' : '')} aria-hidden="true">
      {asset !== null && asset !== undefined
        ? <img className="gv-char-img" src={asset.dataUrl} alt={c.label ?? ''} draggable={false} />
        : (
            <svg className="gv-char-svg" viewBox="0 0 100 170" preserveAspectRatio="xMidYMax meet">
              <circle cx="50" cy="30" r="20" fill={color} fillOpacity=".34" stroke={color} strokeOpacity=".85" strokeWidth="1.4" />
              <path
                d="M16 170 C16 122 34 100 50 100 C66 100 84 122 84 170 Z"
                fill={color} fillOpacity=".26" stroke={color} strokeOpacity=".8" strokeWidth="1.4"
              />
              <path d="M50 24 L50 34" stroke={color} strokeOpacity=".5" strokeWidth="1" />
            </svg>
          )}
      <div className="gv-char-plate">
        <span className="gv-char-label">{c.label ?? 'CHARACTER'}</span>
        <span className="gv-char-name" style={{ color }}>{c.name ?? '？？？'}</span>
      </div>
    </div>
  )
}

/** 各类型元素的静态主体（游戏/编辑共用；对话框在游戏模式单独渲染实时台词）。
 * 有素材时：background/形状类隐藏占位水印（真实图片作为背景铺满）。 */
function ElementBody({ el, mode, speaking, asset }) {
  const hasAsset = asset !== null && asset !== undefined
  switch (el.type) {
    case 'background': return (
      <div className="gv-elbg">
        {!hasAsset && <span className="gv-elbg-corners" aria-hidden="true" />}
        {(!hasAsset || el.text !== '') && <span className="gv-elbg-label">{el.text !== '' ? el.text : 'BACKGROUND'}</span>}
      </div>
    )
    case 'character': return <CharacterPlaceholder el={el} speaking={speaking} asset={asset} />
    case 'dialogue': return (
      <div className="gv-elbox">
        <span className="gv-elbox-name" style={{ color: el.color }}>角色名</span>
      </div>
    )
    case 'dialogue-text': return <div className="gv-eltext">{el.text !== '' ? el.text : '……'}</div>
    case 'speaker-name': return <div className="gv-sname">{el.text !== '' ? el.text : (el.role === 'assistant' ? 'AI 名牌' : '玩家名牌')}</div>
    case 'text': return <div className="gv-eltext">{el.text}</div>
    case 'button': return <div className="gv-elbtn">{el.text !== '' ? el.text : '按钮'}</div>
    case 'action-button': return <div className="gv-elbtn">{el.text}</div>
    case 'rect': return <div className="gv-elshape">{!hasAsset && el.text === '' ? 'RECT' : el.text}</div>
    case 'circle': return <div className="gv-elshape">{!hasAsset && el.text === '' ? 'CIRCLE' : el.text}</div>
    case 'decoration': return (
      <div className="gv-eldeco">
        {(!hasAsset || el.text !== '') && <span className="gv-eldeco-label">{el.text !== '' ? el.text : '[ DECORATION ]'}</span>}
      </div>
    )
    default: return <div className="gv-elshape">{el.name}</div>
  }
}

/** 游戏模式实时对话框面板（角色名牌 + 底板；正文由独立的「台词」元素承载）。
 * 旧场景缺少台词元素时回退到内嵌正文（dtextEl 为 null）。 */
function DialogueBox({ el, line, type, pinned, onSkip, asset, dtextEl, aiStatus }) {
  const bodyRef = useRef(null)
  useEffect(() => {
    if (pinned) return // 流式/测量期间钉住开头，不追底滚动
    const body = bodyRef.current
    if (body !== null) body.scrollTop = body.scrollHeight
  }, [type.shown, line.text, pinned])
  const speaker = line.speaker
  const baseStyle = elementStyle(el)
  const style = asset !== null && asset !== undefined
    ? {
      ...baseStyle,
      backgroundImage: 'url("' + asset.dataUrl + '")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
    : baseStyle
  const hasSeparateText = dtextEl !== null && dtextEl !== undefined
  return (
    <div
      className="gv-dialogue"
      style={style}
      onClick={onSkip}
      role="button"
      tabIndex={0}
      aria-label="对话框：点击跳过打字动画"
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSkip() } }}
    >
      {!hasSeparateText && (
        <div className="gv-dialogue-body" ref={bodyRef}>
          <span className="gv-dialogue-text">{type.shown}</span>
          {!type.done && <span className="gv-dialogue-caret" aria-hidden="true" />}
          {aiStatus !== null && aiStatus !== undefined && aiStatus !== '' && (
            <span className="gv-dtext-status">{(type.shown !== '' ? '\n' : '') + '（' + aiStatus + '…）'}</span>
          )}
        </div>
      )}
    </div>
  )
}

/** 游戏模式角色名牌：每个元素只负责一方——role 'player' 仅在玩家行显示，
 * role 'assistant' 仅在 AI 行显示，系统行两者都隐藏。显示文本 = 元素自身的
 * 文本（名称可自由设置）。 */
function LiveSpeakerName({ el, line }) {
  const role = el.role === 'assistant' ? 'assistant' : 'player'
  const active = line !== null
    && line.kind !== 'system'
    && ((role === 'player' && line.kind === 'player') || (role === 'assistant' && line.kind === 'assistant'))
  if (!active || el.text === '') return null
  return (
    <div className="gv-sname" style={elementStyle(el)} aria-label="说话人">
      {el.text}
    </div>
  )
}

/** 游戏模式实时台词：渲染进独立的「台词」元素（位置/尺寸/字号/颜色随元素属性）。
 * 点击 = Galgame 翻页：打字中追平当前页；已打完且存在下一页 → 显示下一页。
 * 省略号插在最后一个可见字符之后、尾随换行符之前（否则会排到空行行首）。
 * AI 运行期间在文本下方追加状态行：\n（思考中…）/（使用工具中…）。 */
function LiveDialogueText({ el, type, running, pinned, onTextClick, hasNextPage, aiStatus }) {
  const bodyRef = useRef(null)
  useEffect(() => {
    if (pinned) return // 流式/测量期间钉住开头（展示第一段，不追尾滚动）
    const body = bodyRef.current
    if (body !== null) body.scrollTop = body.scrollHeight
  }, [type.shown, pinned])
  const showEllipsis = !running && type.done && hasNextPage
  const trailingMatch = showEllipsis ? /\n+$/.exec(type.shown) : null
  const trailing = trailingMatch !== null ? trailingMatch[0] : ''
  const visible = trailing !== '' ? type.shown.slice(0, -trailing.length) : type.shown
  return (
    <div
      className="gv-dtext"
      style={elementStyle(el)}
      ref={bodyRef}
      onClick={onTextClick}
      role="button"
      tabIndex={0}
      aria-label="台词：点击显示后续内容"
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTextClick() } }}
    >
      <span className="gv-dialogue-text">{visible}</span>
      {showEllipsis && <span className="gv-dtext-ellipsis" aria-hidden="true">…</span>}
      {trailing !== '' && <span className="gv-dialogue-text">{trailing}</span>}
      {!type.done && <span className="gv-dialogue-caret" aria-hidden="true" />}
      {aiStatus !== null && aiStatus !== undefined && aiStatus !== '' && (
        <span className="gv-dtext-status" aria-label={'AI 状态：' + aiStatus}>{(visible !== '' ? '\n' : '') + '（' + aiStatus + '…）'}</span>
      )}
      {showEllipsis && <span className="gv-dtext-more" aria-hidden="true">▼</span>}
    </div>
  )
}

/** 编辑模式选中框 + 手柄。 */
function SelectionOverlay({ el, onBeginGesture }) {
  return (
    <div className="gv-sel" style={{ left: el.x, top: el.y, width: el.w, height: el.h, transform: el.rotation === 0 ? undefined : 'rotate(' + el.rotation + 'deg)' }}>
      <span className="gv-sel-label">{el.name !== '' ? el.name : el.type}</span>
      {HANDLES.map(h => (
        <span
          key={h.dir}
          className={'gv-sel-handle gv-sel-' + h.dir}
          style={{ ...h.style, cursor: h.cursor }}
          onPointerDown={e => onBeginGesture(e, el, 'resize', h.dir)}
        />
      ))}
      <span
        className="gv-sel-rotate"
        onPointerDown={e => onBeginGesture(e, el, 'rotate', null)}
        aria-label="旋转"
      />
    </div>
  )
}

/**
 * 舞台视图主体。
 * @param props.scene - 场景快照（sceneSource）。
 * @param props.assetsMap - 素材库（id → 素材记录）。
 * @param props.mode - 'game' | 'editor'。
 * @param props.line - 当前台词 { speaker: {name,color}, text }（游戏模式）。
 * @param props.type - 打字机状态。
 * @param props.running - 助手是否在生成中。
 * @param props.pinned - 流式/分页测量期间钉住文本框开头（不追底滚动）。
 * @param props.selectedId - 编辑器选中元素 id。
 * @param props.onSelect - 编辑器选中回调。
 * @param props.api - 场景 API（编辑器手势使用；游戏模式可空）。
 * @param props.onSkip - 对话框点击（游戏模式）。
 * @param props.onTextClick - 台词文本框点击（翻页/追平）。
 * @param props.hasNextPage - 当前行是否还有下一页（显示「▼」提示）。
 * @param props.aiStatus - AI 运行状态文本（思考中/使用工具中；null = 不显示）。
 * @param props.onAction - 透明按钮功能回调（游戏模式；history/auto/skip/settings）。
 * @param props.autoOn - 自动播放开关状态（透明「自动」按钮的 is-on 视觉）。
 */
export function StageView({ scene, assetsMap, mode, line, type, running, pinned, selectedId, onSelect, api, onSkip, onTextClick, hasNextPage, aiStatus, onAction, autoOn }) {
  const wrapRef = useRef(null)
  const stageRef = useRef(null)
  const gesture = useRef(null)
  const [scale, setScale] = useState(0)
  const [guides, setGuides] = useState([])

  const sw = scene.settings.stageW
  const sh = scene.settings.stageH

  useEffect(() => {
    const wrap = wrapRef.current
    if (wrap === null) return
    const measure = () => {
      const rect = wrap.getBoundingClientRect()
      const availW = Math.max(120, rect.width - 24)
      const availH = Math.max(120, rect.height - 24)
      setScale(Math.min(availW / sw, availH / sh))
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(wrap)
    return () => { ro.disconnect() }
  }, [sw, sh])

  const visible = sortElements(scene.elements.filter(el => !el.hidden))
  const dialogue = findDialogue(scene)
  const dtext = scene.elements.find(el => el.type === 'dialogue-text' && !el.hidden) ?? null
  const snames = scene.elements.filter(el => el.type === 'speaker-name' && !el.hidden)
  const editor = mode === 'editor'
  // 游戏模式下，对话框与台词元素由实时渲染接管（不参与普通元素渲染）。
  const renderElements = editor
    ? visible
    : visible.filter(el => el.type !== 'dialogue' && el.type !== 'dialogue-text' && el.type !== 'speaker-name')

  /** 元素素材：解析引用 → 素材记录（缺失/null → 占位图形）。 */
  const assetOf = el => {
    if (typeof el.image !== 'string' || el.image === '' || assetsMap === undefined) return null
    return assetsMap.get(el.image) ?? null
  }

  const beginGesture = (e, el, kind, dir) => {
    e.preventDefault()
    e.stopPropagation()
    if (api === undefined || el.locked) return
    const before = api.snapshotScene()
    // 手势期间候选吸附线（其他元素不动，起手快照一次即可）。
    const lines = scene.settings.snap
      ? collectSnapLines({
        stageW: scene.settings.stageW,
        stageH: scene.settings.stageH,
        elements: scene.elements,
        excludeId: el.id,
      })
      : []
    gesture.current = {
      el, kind, dir, before, scale, lines,
      startX: e.clientX, startY: e.clientY,
      orig: { x: el.x, y: el.y, w: el.w, h: el.h, rotation: el.rotation },
      changed: false,
    }
    if (stageRef.current !== null && typeof e.pointerId === 'number') {
      try { stageRef.current.setPointerCapture(e.pointerId) } catch { /* 捕获失败不影响拖动 */ }
    }
    if (onSelect) onSelect(el.id)
  }

  const onStageMove = e => {
    const g = gesture.current
    if (g === null || g === undefined) return
    const s = scene.settings
    const dx = (e.clientX - g.startX) / g.scale
    const dy = (e.clientY - g.startY) / g.scale
    if (g.kind === 'move') {
      const raw = { x: g.orig.x + dx, y: g.orig.y + dy, w: g.orig.w, h: g.orig.h }
      // 边缘吸附优先；同轴无吸附时补网格吸附。
      const snapped = snapRect(raw, MOVE_KEYS, g.lines, EDGE_THRESHOLD)
      let { x, y } = snapped.rect
      if (!snapped.guides.some(guide => guide.axis === 'x') && s.snap) x = snapValue(x, s.gridSize, true)
      if (!snapped.guides.some(guide => guide.axis === 'y') && s.snap) y = snapValue(y, s.gridSize, true)
      setGuides(snapped.guides)
      if (x !== g.el.x || y !== g.el.y) {
        g.changed = true
        api.updateElement(g.el.id, { x, y })
      }
    } else if (g.kind === 'resize') {
      let { x, y, w, h } = g.orig
      const maxX = g.orig.x + g.orig.w - MIN_SIZE
      const maxY = g.orig.y + g.orig.h - MIN_SIZE
      if (g.dir.includes('e')) w = Math.max(MIN_SIZE, g.orig.w + dx)
      if (g.dir.includes('s')) h = Math.max(MIN_SIZE, g.orig.h + dy)
      if (g.dir.includes('w')) { x = Math.min(maxX, Math.max(-9999, g.orig.x + dx)); w = g.orig.x + g.orig.w - x }
      if (g.dir.includes('n')) { y = Math.min(maxY, Math.max(-9999, g.orig.y + dy)); h = g.orig.y + g.orig.h - y }
      // 边缘吸附优先（只吸附正在移动的边）；同轴无吸附时补网格吸附。
      const snapped = snapRect({ x, y, w, h }, resizeKeys(g.dir), g.lines, EDGE_THRESHOLD)
      x = snapped.rect.x
      y = snapped.rect.y
      w = snapped.rect.w
      h = snapped.rect.h
      if (!snapped.guides.some(guide => guide.axis === 'x') && s.snap) {
        x = snapValue(x, s.gridSize, true)
        w = snapValue(w, s.gridSize, true)
      }
      if (!snapped.guides.some(guide => guide.axis === 'y') && s.snap) {
        y = snapValue(y, s.gridSize, true)
        h = snapValue(h, s.gridSize, true)
      }
      setGuides(snapped.guides)
      if (x !== g.el.x || y !== g.el.y || w !== g.el.w || h !== g.el.h) {
        g.changed = true
        api.updateElement(g.el.id, { x, y, w: Math.max(MIN_SIZE, w), h: Math.max(MIN_SIZE, h) })
      }
    } else if (g.kind === 'rotate') {
      const rect = stageRef.current.getBoundingClientRect()
      const c = elementCenter(g.orig)
      const px = (e.clientX - rect.left) / g.scale
      const py = (e.clientY - rect.top) / g.scale
      let angle = Math.atan2(py - c.y, px - c.x) * 180 / Math.PI + 90
      angle = snapValue(angle, s.snap ? 5 : 1, true)
      if (angle !== g.el.rotation) {
        g.changed = true
        api.updateElement(g.el.id, { rotation: angle })
      }
    }
  }

  const endGesture = () => {
    const g = gesture.current
    if (g === null || g === undefined) return
    gesture.current = null
    setGuides([])
    if (g.changed && api !== undefined) api.commitHistory(g.before)
  }

  return (
    <div className="gv-stage-wrap" ref={wrapRef}>
      <div
        className={'gv-stage' + (editor ? ' is-editor' : '')}
        ref={stageRef}
        style={{ width: sw, height: sh, transform: scale > 0 ? 'scale(' + scale + ')' : undefined }}
        onPointerMove={editor ? onStageMove : undefined}
        onPointerUp={editor ? endGesture : undefined}
        onPointerCancel={editor ? endGesture : undefined}
        onPointerDown={editor ? () => { if (onSelect) onSelect(null) } : undefined}
        data-scale={scale > 0 ? Math.round(scale * 100) / 100 : 0}
      >
        {editor && scene.settings.showGrid && (
          <div className="gv-grid" aria-hidden="true" style={{ backgroundSize: scene.settings.gridSize + 'px ' + scene.settings.gridSize + 'px' }} />
        )}
        {editor && guides.map((guide, index) => (
          <div
            key={'guide-' + index}
            className={'gv-guide gv-guide-' + guide.axis}
            style={guide.axis === 'x' ? { left: guide.pos } : { top: guide.pos }}
            aria-hidden="true"
          />
        ))}
        {renderElements.map(el => {
          const asset = assetOf(el)
          const baseStyle = elementStyle(el)
          // 素材铺满元素盒（角色除外：立绘在内部用 <img> 底部对齐渲染）。
          const style = asset !== null && el.type !== 'character'
            ? {
              ...baseStyle,
              backgroundImage: 'url("' + asset.dataUrl + '")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
            : baseStyle
          return (
            <div
              key={el.id}
              className={'gv-el gv-el-' + el.type + (el.locked ? ' is-locked' : '') + (editor && !el.locked ? ' is-pickable' : '') + (mode === 'game' && el.type === 'action-button' && el.action === 'auto' && autoOn ? ' is-on' : '')}
              style={style}
              data-el-id={el.id}
              title={editor ? el.name : undefined}
              onPointerDown={editor && !el.locked && el.type !== 'background'
                ? e => beginGesture(e, el, 'move', null)
                : undefined}
              onClick={mode === 'game' && el.type === 'action-button' && el.action !== '' && onAction !== undefined
                ? () => onAction(el.action)
                : undefined}
            >
              <ElementBody el={el} mode={mode} asset={asset} speaking={mode === 'game' && line !== null && line.kind === 'assistant' && el.id === scene.settings.assistantSpeaker} />
            </div>
          )
        })}
        {!editor && line !== null && (
          <DialogueBox el={dialogue} line={line} type={type} pinned={pinned} onSkip={onSkip} asset={assetOf(dialogue)} dtextEl={dtext} aiStatus={aiStatus} />
        )}
        {!editor && line !== null && dtext !== null && (
          <LiveDialogueText el={dtext} type={type} running={running} pinned={pinned} onTextClick={onTextClick} hasNextPage={hasNextPage} aiStatus={aiStatus} />
        )}
        {!editor && snames.map(el => (
          <LiveSpeakerName key={el.id} el={el} line={line} />
        ))}
        {editor && selectedId !== null && selectedId !== undefined && (
          (() => {
            const sel = scene.elements.find(el => el.id === selectedId)
            if (sel === undefined) return null
            return <SelectionOverlay el={sel} onBeginGesture={beginGesture} />
          })()
        )}
      </div>
    </div>
  )
}
