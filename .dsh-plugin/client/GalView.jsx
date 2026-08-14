/** GAL 视窗顶层：模式切换 + 游戏模式（舞台/控制条/输入/历史/设置）+ 编辑模式。
 * 数据来源：useSession（会话快照 nodes/partial/running/blank）、useScene（场景）、
 * inputActions（发送走宿主输入机，与普通输入框同一管线）。
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StageView } from './StageView.jsx'
import { Editor } from './Editor.jsx'
import { createTypeState, setTarget, skip, advance, SPEEDS } from './typewriter.mjs'
import {
  nodesToLines, partialToText, deriveStatus, speakerFor, welcomeLine,
} from './transcript.mjs'
import { splitPages, createFitsMeasurer } from './paging.mjs'

/** 玩家消息完整显示后的最短滞留时长（此后由模型状态触发翻页）。 */
const STATUS_DWELL_MS = 1500
/** 模型状态迟迟未到时的兜底等待上限（超过后按当前状态翻页）。 */
const STATUS_MAX_WAIT_MS = 6000

/** 发送玩家输入：走宿主输入机（adjudication/claim/默认 sink 同一管线）。 */
function useSend(inputActions, draft, setDraft) {
  return useCallback(() => {
    const text = draft.trim()
    if (text === '') return
    inputActions.setDraft(text)
    inputActions.submit()
    setDraft('')
  }, [draft, inputActions, setDraft])
}

/** 对话历史面板（右侧滑出）。 */
function HistoryPanel({ scene, lines, onClose }) {
  const listRef = useRef(null)
  useEffect(() => {
    const list = listRef.current
    if (list !== null) list.scrollTop = list.scrollHeight
  }, [lines])
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey) }
  }, [onClose])
  return (
    <div className="gv-history" role="dialog" aria-label="对话历史">
      <div className="gv-history-head">
        <span>历史</span>
        <button type="button" className="gv-btn" onClick={onClose}>关闭</button>
      </div>
      <div className="gv-history-list" ref={listRef}>
        {lines.length === 0 && <div className="gv-history-empty">还没有对话记录</div>}
        {lines.map(line => {
          const speaker = speakerFor(scene, line.kind)
          return (
            <div className="gv-history-row" key={line.key}>
              <span className="gv-history-name" style={{ color: speaker.color }}>{speaker.name}</span>
              <p className="gv-history-text">{line.text}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** 设置浮层：说话角色 / 玩家名 / 打字速度。开时快照、关时提交历史。 */
function SettingsPanel({ scene, api, onClose }) {
  const beforeRef = useRef(null)
  useEffect(() => {
    beforeRef.current = api.snapshotScene()
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      if (beforeRef.current !== null) {
        api.commitHistory(beforeRef.current)
        beforeRef.current = null
      }
    }
  }, [api, onClose])
  const characters = scene.elements.filter(el => el.type === 'character' && el.character)
  return (
    <div className="gv-settings" role="dialog" aria-label="设置">
      <div className="gv-settings-head">
        <span>设置</span>
        <button type="button" className="gv-btn" onClick={onClose}>关闭</button>
      </div>
      <label className="gv-settings-row">
        <span>说话角色</span>
        <select
          value={scene.settings.assistantSpeaker}
          onChange={e => api.updateSettings({ assistantSpeaker: e.target.value })}
        >
          {characters.map(el => (
            <option key={el.id} value={el.id}>{el.character.name}（{el.character.label}）</option>
          ))}
          <option value="">系统</option>
        </select>
      </label>
      <label className="gv-settings-row">
        <span>玩家名</span>
        <input
          type="text"
          value={scene.settings.playerName}
          onChange={e => api.updateSettings({ playerName: e.target.value })}
          placeholder="你"
        />
      </label>
      <label className="gv-settings-row">
        <span>打字速度</span>
        <select value={scene.settings.typeSpeed} onChange={e => api.updateSettings({ typeSpeed: e.target.value })}>
          <option value="slow">慢</option>
          <option value="normal">正常</option>
          <option value="fast">快</option>
        </select>
      </label>
      <p className="gv-settings-hint">角色名称/颜色在编辑模式中修改；说话角色引用会实时生效。</p>
    </div>
  )
}

/**
 * 填满会话区：挂载时隐藏会话外壳的输入席（data-composer-seat），让视窗占满整个
 * 会话主体（data-conversation-scroll）。GAL 视窗只在自身激活时被挂载，卸载（切回
 * 「对话」/「轨迹」标签）时恢复原状。找不到外壳（独立挂载/冒烟环境）时静默跳过。
 * @param rootRef - 视窗根节点。
 * @returns 恢复函数。
 */
function useFillSessionArea(rootRef) {
  useEffect(() => {
    const root = rootRef.current
    if (root === null) return
    const scrollBody = root.closest('[data-conversation-scroll]')
    const seat = scrollBody?.querySelector(':scope > [data-composer-seat]') ?? null
    if (scrollBody === null || seat === null) return
    const prev = {
      seatDisplay: seat.style.display,
      overflow: scrollBody.style.overflow,
      position: scrollBody.style.position,
    }
    seat.style.display = 'none'
    scrollBody.style.overflow = 'hidden'
    scrollBody.style.position = 'relative'
    root.setAttribute('data-gal-fills', '')
    return () => {
      seat.style.display = prev.seatDisplay
      scrollBody.style.overflow = prev.overflow
      scrollBody.style.position = prev.position
      root.removeAttribute('data-gal-fills')
    }
  }, [rootRef])
}

/**
 * GAL 视窗组件（conversation.view 槽位条目）。
 * @param props - 槽位框架注入：sessionId/useSession/useInput/inputActions + inject 面的 useScene/useHistory/api。
 */
export function GalView({ useSession, inputActions, useScene, useHistory, useAssets, useFonts, useStore, actions, api }) {
  const scene = useScene(s => s)
  const history = useHistory(h => h)
  const assets = useAssets(a => a)
  const fonts = useFonts(f => f)
  const readState = useStore(s => s)
  const nodes = useSession(s => s.nodes)
  const partial = useSession(s => s.partial)
  const running = useSession(s => s.running)
  const blank = useSession(s => s.blank)
  const runningCalls = useSession(s => s.runningCalls)
  const pending = useSession(s => s.pending)
  const promptError = useSession(s => s.promptError)

  const [mode, setMode] = useState('game')
  const [auto, setAuto] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [type, setType] = useState(createTypeState)
  const [pages, setPages] = useState([])
  const [pageIndex, setPageIndex] = useState(0)
  const rootRef = useRef(null)
  // 阅读状态恢复/保存（标签页切换与刷新后不从头渲染）。
  const readStateRef = useRef(readState)
  readStateRef.current = readState
  const restoredKeyRef = useRef(null)
  useFillSessionArea(rootRef)

  const lines = useMemo(() => nodesToLines(nodes), [nodes])
  const liveText = running ? partialToText(partial) : ''
  const lastLine = lines.length > 0 ? lines[lines.length - 1] : null
  const aiStatus = deriveStatus({ running, partial, pending, lastLine, promptError })
  const fallback = blank ? welcomeLine(scene) : null
  // 理想规则（用户约定）：文本框显示用户内容 → 名牌「你」；显示 AI 内容 → 名牌 DeepSeek。
  // 运行期间（AI 正文未到）先显示最后一条玩家消息；滞留片刻后「换页」到状态页。
  const pendingPlayer = running
    && lastLine !== null
    && lastLine.kind === 'player'
    && liveText === ''
    ? lastLine
    : null

  // 流式打字进度快照：定稿转分页时据此无缝衔接第一页（不闪空、不重打）。
  // 只快照「有正文」的流式状态（状态页/玩家滞留不覆盖）；新回合开始时丢弃旧快照；
  // 衔接命中后保留（不消费）——定稿后节点列表会短暂振荡回退，保留快照才能钉住回退窗口。
  const streamedTypeRef = useRef(null)
  const wasRunningRef = useRef(false)
  useEffect(() => {
    const was = wasRunningRef.current
    wasRunningRef.current = running
    if (!running) return
    if (!was) streamedTypeRef.current = null
    if (liveText !== '') streamedTypeRef.current = type
  }, [running, type, liveText])

  // 翻页由模型状态触发：玩家消息完整显示后记录滞留起点；
  // 最短滞留（STATUS_DWELL_MS）届满且模型已有状态（思考/工具/正文块）→ 立即翻页；
  // 状态一直未到 → STATUS_MAX_WAIT_MS 后兜底翻页（显示「编写代码中」）。
  const [statusHold, setStatusHold] = useState(false)
  const [dwellSince, setDwellSince] = useState(null)
  useEffect(() => {
    if (!running || pendingPlayer === null) {
      setStatusHold(false)
      setDwellSince(null)
      return
    }
    if (type.done && dwellSince === null) setDwellSince(Date.now())
  }, [running, pendingPlayer, type.done, dwellSince])
  const modelStateArrived = running && (liveText !== ''
    || (partial !== null && typeof partial === 'object' && Array.isArray(partial.blocks) && partial.blocks.length > 0)
    || (Array.isArray(runningCalls) && runningCalls.length > 0)
    || (Array.isArray(pending) && pending.length > 0))
  useEffect(() => {
    if (!running || !type.done || pendingPlayer === null) {
      setStatusHold(false)
      return
    }
    const base = dwellSince ?? Date.now()
    const delay = modelStateArrived
      ? Math.max(0, STATUS_DWELL_MS - (Date.now() - base))
      : STATUS_MAX_WAIT_MS
    const timer = setTimeout(() => { setStatusHold(true) }, delay)
    return () => { clearTimeout(timer) }
  }, [running, type.done, pendingPlayer, modelStateArrived, dwellSince])

  // 流式 → 定稿的完成窗口：定稿节点与 running=false 状态帧是分开到达的，
  // 期间（节点已到/未到）不得闪状态页或重打——用流式快照钉住已输出的正文。
  const capturedTarget = streamedTypeRef.current !== null && typeof streamedTypeRef.current.target === 'string'
    ? streamedTypeRef.current.target
    : ''
  const capturedLine = capturedTarget !== ''
    ? { key: 'live', kind: 'assistant', text: capturedTarget }
    : null
  // 无进行中的工具/待回应才钉住（多步回合的工具阶段仍正常显示状态页）。
  const capturedQuiet = (Array.isArray(runningCalls) && runningCalls.length === 0)
    && (Array.isArray(pending) && pending.length === 0)
  // 定稿节点已落地且与已显示的流式正文衔接：直接展示定稿行（等状态帧转分页）。
  // 锚定可见前缀（capturedShown），与 measure 的衔接分支一致；定稿文本与流式全文可能有分段差异。
  const capturedShown = streamedTypeRef.current !== null && typeof streamedTypeRef.current.shown === 'string'
    ? streamedTypeRef.current.shown
    : ''
  const capturedLanded = capturedQuiet
    && capturedLine !== null
    && lastLine !== null
    && lastLine.kind === 'assistant'
    && lastLine.text.startsWith(capturedShown !== '' ? capturedShown : capturedTarget)
  // 状态帧先到、定稿节点未落地：继续显示流式正文直到节点到达。
  const capturedPending = capturedQuiet
    && capturedLine !== null
    && !capturedLanded
    && (lastLine === null || lastLine.kind === 'player')
  // 状态页：换页后的独立一页——空文本 + 状态行作为正文，名牌为 AI。
  // 流式生成阶段（liveText 非空）也强制走状态页：正文不实时渲染，
  // 定稿（running=false）后才进入回复渲染（打字机/分页）。
  const showStatusPage = running && (liveText !== '' || statusHold || pendingPlayer === null)
  const currentLine = showStatusPage
    ? { key: 'live', kind: 'assistant', text: '' }
    : running
      ? (pendingPlayer ?? (liveText !== ''
        ? { key: 'live', kind: 'assistant', text: liveText }
        : (capturedLanded ? lastLine : (capturedPending ? capturedLine : { key: 'live', kind: 'assistant', text: '' }))))
      : (capturedPending ? capturedLine : (lastLine ?? fallback))
  const speaker = currentLine !== null ? speakerFor(scene, currentLine.kind) : speakerFor(scene, 'assistant')

  // ---- 台词分页（Galgame 点击翻页）----
  // 定稿（非流式）且超出文本框容量的文本按页拆分；流式期间不翻页（钉住开头实时打字）。
  const dtextSceneEl = scene.elements.find(el => el.type === 'dialogue-text' && !el.hidden) ?? null
  const fullText = currentLine !== null ? currentLine.text : ''
  // 恢复待定门：挂载后、分页测量与阅读状态恢复完成前禁止保存进度，
  // 否则恢复前的初始状态（页码 0/空文本）会覆盖旧进度。
  const restorePendingRef = useRef(true)
  // 分页归属：pages 在测量完成后才与当前全文绑定；此前旧页/空页不作为打字目标（不闪错页）。
  const pagesTextRef = useRef(null)
  useEffect(() => {
    restorePendingRef.current = true
    setPages([])
    setPageIndex(0)
    if (running || currentLine === null || currentLine.text === '' || dtextSceneEl === null) {
      restorePendingRef.current = false
      return
    }
    let cancelled = false
    const measure = () => {
      const measurer = createFitsMeasurer({
        width: dtextSceneEl.w,
        height: dtextSceneEl.h,
        fontSize: dtextSceneEl.fontSize,
        fontFamily: dtextSceneEl.fontFamily,
      })
      const nextPages = splitPages(currentLine.text, prefix => measurer.fits(prefix))
      measurer.dispose()
      if (cancelled) return
      restorePendingRef.current = false
      setPages(nextPages)
      pagesTextRef.current = currentLine.text
      // 流式 → 定稿无缝衔接（优先于重挂载恢复）：第一页沿用流式打字进度（不闪空）；
      // 流式期间已打满第一页则直接完整显示（不重打，点击照常翻下一页）。
      // 必须先于恢复分支：完成窗口内的保存会把 lineKey 写成定稿节点键，
      // 恢复分支会误判成重挂载并按旧进度重置（第一页重打）。
      const streamed = streamedTypeRef.current
      // 锚定「已打出的可见前缀」而非完整流式目标：真实运行时定稿节点文本
      // 与流式全文可能存在分段差异（startsWith(target) 会失配导致第一页重打）。
      // 命中后保留快照（不置空）：定稿后节点列表会短暂回退（settled→running 振荡），
      // 回退窗口靠 capturedPending 钉住正文；节点重新落地时再次衔接（幂等）。
      if (streamed !== null
        && typeof streamed.target === 'string'
        && streamed.target !== ''
        && typeof streamed.shown === 'string'
        && currentLine.text.startsWith(streamed.shown)) {
        const page = nextPages[0] ?? currentLine.text
        if (page.startsWith(streamed.shown)) {
          setType({ target: page, shown: streamed.shown, done: streamed.shown === page })
        } else {
          setType({ target: page, shown: page, done: true })
        }
        return
      }
      // 阅读状态恢复：同一行重挂载时回到原页码与打字进度（不从头渲染）。
      const stored = readStateRef.current
      if (stored.lineKey === currentLine.key && restoredKeyRef.current !== currentLine.key) {
        restoredKeyRef.current = currentLine.key
        const idx = Math.min(stored.pageIndex, nextPages.length - 1)
        setPageIndex(idx)
        const page = nextPages[idx] ?? currentLine.text
        const keep = page.startsWith(stored.shown) ? stored.shown : ''
        setType({ target: page, shown: keep, done: keep === page })
      }
    }
    // 测量放在宏任务：让测量元素先进入文档流，避免同帧布局未结算。
    const timer = setTimeout(measure, 0)
    // 自定义字体就绪后重新测量（@font-face 未加载完成时按回退字体测量会分错页）。
    if (typeof document !== 'undefined' && typeof document.fonts !== 'undefined' && document.fonts.ready !== undefined) {
      void document.fonts.ready.then(() => {
        if (!cancelled) measure()
      })
    }
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [running, fullText, dtextSceneEl])

  // 定稿且分页测量未完成时维持当前文本目标（衔接流式打字，不闪空不闪错页）；流式期间实时从头打字。
  const pagesReady = !running && pages.length > 0 && pagesTextRef.current === fullText
  const pageText = pagesReady
    ? (pages[Math.min(pageIndex, pages.length - 1)] ?? '')
    : fullText
  const hasNextPage = pagesReady && pageIndex < pages.length - 1
  // 流式期间与分页测量未完成时钉住文本框开头（维持画面，不闪动不追底）。
  const pinScroll = running || (dtextSceneEl !== null && !pagesReady)
  // 省略号为独立渲染标签（紧贴文本，不计入打字目标/历史/分页数据）。
  const typedTarget = pageText

  // ---- 阅读状态保存/恢复 ----
  // 关键变化点（换行/翻页/打字完成/滞留起点/状态页开关）写入会话级 store。
  // 恢复待定期间跳过保存（初始状态会覆盖旧进度）。
  // 运行中滞留玩家行时（含已换到状态页）统一按玩家行键保存，保证重挂载能对上恢复。
  const restoreKey = running && pendingPlayer !== null
    ? pendingPlayer.key
    : (currentLine?.key ?? null)
  useEffect(() => {
    if (restorePendingRef.current) return
    if (restoreKey === null) return
    actions.saveProgress({
      lineKey: restoreKey,
      pageIndex,
      shown: type.shown,
      done: type.done,
      dwellSince,
      statusHold,
    })
  }, [restoreKey, pageIndex, type.done, dwellSince, statusHold, actions])
  // 卸载（切标签页）时保存最新打字进度。
  const saveRef = useRef(null)
  saveRef.current = { key: restoreKey, pageIndex, type, dwellSince, statusHold, actions }
  useEffect(() => () => {
    const s = saveRef.current
    if (s === null || s.key === null) return
    s.actions.saveProgress({
      lineKey: s.key,
      pageIndex: s.pageIndex,
      shown: s.type.shown,
      done: s.type.done,
      dwellSince: s.dwellSince,
      statusHold: s.statusHold,
    })
  }, [])
  // 运行中重挂载：恢复滞留进度（玩家消息打字进度/滞留起点/状态页开关），
  // 切标签页回来不从头走「用户消息 → 短暂滞留 → 模型状态」。
  const runningRestoredRef = useRef(null)
  useEffect(() => {
    if (!running || pendingPlayer === null) return
    const key = pendingPlayer.key
    const stored = readStateRef.current
    if (stored.lineKey !== key || runningRestoredRef.current === key) return
    runningRestoredRef.current = key
    const target = pendingPlayer.text
    const keep = target.startsWith(stored.shown) ? stored.shown : ''
    // 恢复状态页时直接置 done（滞留效应要求 done 才不重置 statusHold）。
    setType({ target, shown: keep, done: keep === target || stored.statusHold === true })
    if (stored.dwellSince !== null && stored.dwellSince !== undefined) setDwellSince(stored.dwellSince)
    if (stored.statusHold === true) setStatusHold(true)
  }, [running, pendingPlayer])

  // 目标文本变化 → 重设打字机（自动播放时直接追平）。
  useEffect(() => {
    setType(t => {
      const next = setTarget(t, typedTarget)
      return auto ? skip(next) : next
    })
  }, [typedTarget, auto])

  // 自动播放：当前页显示完毕后，短暂停留自动翻下一页（下一页同样逐字打出/自动追平）。
  useEffect(() => {
    if (!auto || !type.done || running || !hasNextPage) return
    const timer = setTimeout(() => { setPageIndex(pageIndex + 1) }, 1500)
    return () => { clearTimeout(timer) }
  }, [auto, type.done, running, hasNextPage, pageIndex])

  // （pendingPlayer 判定基于 liveText 是否到达，无需完成记录状态。）

  // rAF 驱动打字机（done 后停止；advance 无变化返回同引用，React 自动跳过渲染）。
  const speed = SPEEDS[scene.settings.typeSpeed] ?? SPEEDS.normal
  useEffect(() => {
    if (type.done) return
    let raf = 0
    let last = performance.now()
    const loop = now => {
      const dt = now - last
      last = now
      setType(t => advance(t, dt, speed))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf) }
  }, [type.done, speed])

  const skipTyping = useCallback(() => { setType(t => skip(t)) }, [])

  // 点击文本框：打字中 → 追平当前页；已打完且有下一页 → 翻页（下一页同样逐字打出）。
  const onTextClick = useCallback(() => {
    if (running) {
      skipTyping()
      return
    }
    setType(t => (t.done ? t : skip(t)))
    if (type.done && hasNextPage) {
      setPageIndex(pageIndex + 1)
    }
  }, [running, type.done, hasNextPage, pageIndex, skipTyping])
  const send = useSend(inputActions, draft, setDraft)

  // 透明功能按钮：历史/自动/快进/设置（原底部控制栏已移除，功能由场景内按钮承载）。
  const handleAction = useCallback(action => {
    switch (action) {
      case 'history': setHistoryOpen(o => !o); break
      case 'auto': setAuto(a => !a); break
      case 'skip': skipTyping(); break
      case 'settings': setSettingsOpen(o => !o); break
      default: break
    }
  }, [skipTyping])

  const line = currentLine !== null ? { ...currentLine, speaker } : null

  return (
    <div className="gv-root" data-gal-view="" data-gal-mode={mode} ref={rootRef}>
      <div className="gv-topbar">
        <div className="gv-brand">
          <span className="gv-brand-mark" aria-hidden="true" />
          <span>GAL 视窗</span>
        </div>
        <div className="gv-mode-switch" role="tablist" aria-label="模式切换">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'game'}
            className={'gv-mode-btn' + (mode === 'game' ? ' is-on' : '')}
            onClick={() => setMode('game')}
          >
            游戏模式
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'editor'}
            className={'gv-mode-btn' + (mode === 'editor' ? ' is-on' : '')}
            onClick={() => setMode('editor')}
          >
            编辑模式
          </button>
        </div>
        <div className="gv-topbar-right">
          {mode === 'editor'
            ? <span className="gv-topbar-hint">编辑结果实时同步到游戏模式</span>
            : (
                <button type="button" className="gv-btn" onClick={() => setSettingsOpen(o => !o)}>
                  设置
                </button>
              )}
        </div>
      </div>

      {mode === 'game' && (
        <>
          <div className="gv-stage-area">
            <StageView
              scene={scene}
              assetsMap={assets.map}
              mode="game"
              line={line}
              type={type}
              running={running}
              pinned={pinScroll}
              selectedId={null}
              onSelect={() => {}}
              api={undefined}
              onSkip={skipTyping}
              onTextClick={onTextClick}
              hasNextPage={hasNextPage}
              // 错误行正文已含「[错误] …」：不再叠加「（出错…）」状态行；其余非运行状态照常显示。
              aiStatus={running ? (showStatusPage ? aiStatus : null) : (currentLine !== null && currentLine.error === true ? null : aiStatus)}
              onAction={handleAction}
              autoOn={auto}
            />
          </div>
          <form
            className="gv-input"
            onSubmit={e => {
              e.preventDefault()
              send()
            }}
          >
            <textarea
              className="gv-input-box"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault()
                  send()
                }
              }}
              placeholder="输入你想说的话……"
              rows={2}
              aria-label="玩家输入"
            />
            <button type="submit" className="gv-btn gv-btn-accent gv-send" disabled={draft.trim() === ''}>
              发送
            </button>
          </form>
        </>
      )}

      {mode === 'editor' && (
        <Editor
          scene={scene}
          api={api}
          history={history}
          assetsMap={assets.map}
          fontsMap={fonts.map}
          onExitEditor={() => setMode('game')}
        />
      )}

      {historyOpen && <HistoryPanel scene={scene} lines={lines} onClose={() => setHistoryOpen(false)} />}
      {settingsOpen && <SettingsPanel scene={scene} api={api} onClose={() => setSettingsOpen(false)} />}
    </div>
  )
}
