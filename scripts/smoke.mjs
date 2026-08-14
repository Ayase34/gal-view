// Playwright 冒烟：真实浏览器加载真实构建产物（.dsh-plugin/client.js），
// 用假 slots ctx 驱动 apply → 捕获槽位注册 → 用假框架道具挂载 GalView → 交互断言。
// 覆盖：槽位注册（id/order/label）、游戏模式渲染、打字机、发送、编辑模式（树选中/
// Delete/Ctrl+Z/拖拽/Esc）、导出、历史面板、重置、样式清理。
// 依赖：DSH_CHECKOUT 指向 dsh checkout（playwright/react/react-dom 从那里解析）；
// 浏览器缓存 %LOCALAPPDATA%\ms-playwright。缺失时明确跳过而非假装通过。
// 注意：page.evaluate 传入函数（非字符串）——字符串会被当作函数体导致 async 箭头不执行。
import { createServer } from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = resolve(import.meta.dirname, '..')
const CHECKOUT = process.env.DSH_CHECKOUT ?? resolve('C:/Users/Administrator/deepseek-harness')
const CLIENT_JS = join(ROOT, '.dsh-plugin', 'client.js')

function resolveOptional(spec) {
  try {
    return createRequire(join(CHECKOUT, 'apps', 'web', 'package.json')).resolve(spec)
  } catch {
    return null
  }
}

/** UMD 文件绕开 exports 白名单（react 18.3 起 deep path 被 exports 拦）。 */
function resolveUmd(pkg, file) {
  const pkgJson = resolveOptional(pkg + '/package.json')
  if (pkgJson === null) return null
  return join(dirname(pkgJson), 'umd', file)
}

const SMOKE_HTML = [
  '<!doctype html><html><head><meta charset="utf-8"><title>gal-view smoke</title></head><body>',
  '<div data-conversation-scroll="" style="height:760px;position:relative">',
  '<div id="root"></div>',
  '<div data-composer-seat="">COMPOSER</div>',
  '</div>',
  '<div id="root2"></div>',
  '<script src="/react.js"></script>',
  '<script src="/react-dom.js"></script>',
  '<script>window.__ModuleLoader__ = { load(h) { window.__handoff = h } }</script>',
  '<script src="/client.js"></script>',
  '</body></html>',
].join('\n')

/** 阶段一：挂载 + 游戏模式断言 + 编辑模式交互（拖拽坐标留给外层 Playwright 鼠标）。 */
async function pageTestPhase1() {
  const results = []
  const assert = (cond, name) => { results.push({ name, ok: !!cond }) }
  const sleep = ms => new Promise(r => setTimeout(r, ms))
  const pollFor = async (cond, timeoutMs) => {
    const start = Date.now()
    for (;;) {
      if (cond()) return true
      if (Date.now() - start > timeoutMs) return false
      await sleep(40)
    }
  }

  const handoff = window.__handoff
  assert(handoff !== undefined, '构建产物注册了 __ModuleLoader__ handoff')
  if (handoff === undefined) return results

  const mod = handoff.factory(spec => {
    if (spec === 'react') return window.React
    throw new Error('unexpected require: ' + spec)
  })
  assert(mod.name === 'gal-view', '模块导出 name=gal-view')
  assert(Array.isArray(mod.inject) && mod.inject.includes('slots'), '模块导出 inject 含 slots')

  const disposers = []
  const registrations = []
  const slots = {
    register(options, Component) {
      const rec = { options, Component, disposed: false }
      registrations.push(rec)
      return () => { rec.disposed = true }
    },
    inject(_name, cb) { cb() },
  }
  mod.apply({ effect(fn) { disposers.push(fn()) }, slots })
  const registered = registrations.find(rec => rec.options.name === 'conversation.view') ?? null
  assert(registered !== null, 'apply 注册了 conversation.view 条目')
  if (registered === null) return results
  const { options, Component } = registered
  assert(options.id === 'gal', '槽位 id=gal')
  assert(options.order === 5, '槽位 order=5（对话 0 与轨迹 10 之间）')
  assert(options.label() === 'GAL视窗', '标签为 GAL视窗')
  assert(typeof Component === 'function', '组件为函数')
  assert(document.querySelector('style[data-gal-view-style]') !== null, '注入样式标签')


  const injected = options.inject('session-1')
  const sceneSource = injected.hooks.scene
  const historySource = injected.hooks.history
  const api = injected.api
  assert(Array.isArray(sceneSource.getSnapshot().elements), '场景源含 elements')
  assert(typeof api.exportScene === 'function', '注入场景 api')

  window.__galApi = api
  window.__galScene = sceneSource
  window.__galAssets = injected.hooks.assets
  window.__galFonts = injected.hooks.fonts
  window.__galHistory = historySource
  window.__disposers = disposers

  const sessionState = {
    current: {
      sessionId: 'session-1',
      nodes: [
        { kind: 'user', seq: 1, content: [{ type: 'text', text: '你好' }], source: null },
        { kind: 'assistant', seq: 2, turn: 1, step: 1, blocks: [{ kind: 'text', text: '……你终于来了。欢迎回来。' }] },
      ],
      partial: null,
      running: false,
      blank: false,
    },
  }
  const sessionListeners = new Set()
  const sessionSource = {
    getSnapshot: () => sessionState.current,
    subscribe(fn) { sessionListeners.add(fn); return () => { sessionListeners.delete(fn) } },
  }
  window.__setSession = next => {
    sessionState.current = next
    for (const fn of [...sessionListeners]) fn()
  }

  const React = window.React
  const bindHook = src => sel => React.useSyncExternalStore(src.subscribe, () => sel(src.getSnapshot()))
  const readStoreInstance = registered.options.store.create('session-1')
  const drafts = []
  let submits = 0
  const inputActions = {
    setDraft(text) { drafts.push(text) },
    submit() { submits += 1 },
    addImages: () => false,
    removeImage: () => {},
    pruneImages: () => {},
  }
  const props = {
    sessionId: 'session-1',
    useSession: bindHook(sessionSource),
    useInput: bindHook({ getSnapshot: () => ({ draft: '' }), subscribe: () => () => {} }),
    inputActions,
    useScene: bindHook(sceneSource),
    useHistory: bindHook(historySource),
    useAssets: bindHook(injected.hooks.assets),
    useFonts: bindHook(injected.hooks.fonts),
    useStore: bindHook(readStoreInstance),
    actions: readStoreInstance.actions,
    api,
  }

  // 设置选项卡注册：插件 → GAL 视窗 + 启用开关。
  const settingsReg = registrations.find(rec => rec.options.name === 'settings.plugins.tab') ?? null
  assert(settingsReg !== null && settingsReg.options.id === 'gal-view', '设置面板注册 GAL 视窗选项卡')
  assert(settingsReg !== null && settingsReg.options.label() === 'GAL 视窗', '选项卡标签为 GAL 视窗')
  if (settingsReg !== null) {
    const tabInjected = settingsReg.options.inject()
    const tabRoot = window.ReactDOM.createRoot(document.getElementById('root2'))
    tabRoot.render(React.createElement(settingsReg.Component, {
      useEnabled: bindHook(tabInjected.hooks.enabled),
      setEnabled: tabInjected.setEnabled,
    }))
    await sleep(80)
    const checkbox = document.querySelector('#root2 input[type="checkbox"]')
    assert(checkbox !== null && checkbox.checked, '设置选项卡开关默认开启')
    tabInjected.setEnabled(false)
    await sleep(80)
    assert(registered.disposed === true, '关闭开关后 GAL 标签注销')
    assert(document.querySelector('#root2 input[type="checkbox"]').checked === false, '关闭后开关状态同步')
    tabInjected.setEnabled(true)
    await sleep(80)
    const reactivated = registrations.find(rec => rec.options.name === 'conversation.view' && rec.disposed === false)
    assert(reactivated !== undefined, '重新开启后 GAL 标签恢复注册')
  }
  window.__reactRoot = window.ReactDOM.createRoot(document.getElementById('root'))
  window.__reactRoot.render(React.createElement(Component, props))
  window.__drafts = drafts
  window.__submits = () => submits
  await sleep(150)

  // 会话区接管：输入席隐藏 + 根节点填满滚动体。
  const seat = document.querySelector('[data-composer-seat]')
  const scrollBody = document.querySelector('[data-conversation-scroll]')
  assert(seat !== null && seat.style.display === 'none', '填满会话区：隐藏输入席')
  assert(scrollBody !== null && scrollBody.style.overflow === 'hidden', '填满会话区：滚动体禁滚动')
  const galRoot = document.querySelector('[data-gal-view]')
  assert(galRoot !== null && galRoot.hasAttribute('data-gal-fills'), '填满会话区：根节点绝对定位标记')

  assert(document.querySelector('[data-gal-view]') !== null, '游戏模式渲染 [data-gal-view]')
  assert(document.querySelector('[data-gal-view]').getAttribute('data-gal-mode') === 'game', '默认游戏模式')
  assert(document.querySelector('.gv-dialogue') !== null, '渲染对话框')
  // 默认预设：记录初始场景/素材库规模（重置与素材断言按预设而非代码默认），
  // 并把打字速度提到 normal（预设默认 slow 会拖慢分页用例）。
  window.__initialElementCount = sceneSource.getSnapshot().elements.length
  window.__initialAssetCount = injected.hooks.assets.getSnapshot().map.size
  api.updateSettings({ typeSpeed: 'normal' })
  // 对话框禁用毛玻璃：透明度应标准 alpha 混合（不模糊背后立绘透明区）。
  assert(getComputedStyle(document.querySelector('.gv-dialogue')).backdropFilter === 'none', '对话框无毛玻璃模糊')
  const styleText = document.querySelector('style[data-gal-view-style]').textContent
  assert(!styleText.includes('gv-dtext:hover'), '台词文本框无悬停描边')
  assert(!styleText.includes('gv-dialogue:hover'), '对话框无悬停描边')
  // 点击跳过打字后不应留下焦点高亮边框。
  const dtextFocus = document.querySelector('.gv-dtext')
  dtextFocus.focus()
  assert(getComputedStyle(dtextFocus).outlineStyle === 'none', '台词聚焦无边框')
  const boxFocus = document.querySelector('.gv-dialogue')
  boxFocus.focus()
  assert(getComputedStyle(boxFocus).outlineStyle === 'none', '对话框聚焦无边框')
  const nameEl = document.querySelector('.gv-sname')
  assert(nameEl !== null && nameEl.textContent === 'DeepSeek', '说话人名牌动态显示 AI 角色名（DeepSeek）')
  // 玩家行 → 名牌显示「你」。
  window.__setSession({
    sessionId: 'session-1',
    nodes: [{ kind: 'user', seq: 3, content: [{ type: 'text', text: '这是玩家的话' }], source: null }],
    partial: null,
    running: false,
    blank: false,
  })
  await sleep(300)
  assert(document.querySelector('.gv-sname')?.textContent === '用户', '玩家内容时名牌显示「用户」')
  // 恢复 AI 行。
  window.__setSession({
    sessionId: 'session-1',
    nodes: [
      { kind: 'user', seq: 1, content: [{ type: 'text', text: '你好' }], source: null },
      { kind: 'assistant', seq: 2, turn: 1, step: 1, blocks: [{ kind: 'text', text: '……你终于来了。欢迎回来。' }] },
    ],
    partial: null,
    running: false,
    blank: false,
  })
  await sleep(300)
  assert(document.querySelector('.gv-sname')?.textContent === 'DeepSeek', '恢复后名牌回到 DeepSeek')
  // 双名牌互斥：AI 行只有 AI 名牌，玩家行只有玩家名牌。
  assert(document.querySelectorAll('.gv-sname').length === 1, 'AI 行仅显示一个名牌元素')
  window.__setSession({
    sessionId: 'session-1',
    nodes: [{ kind: 'user', seq: 4, content: [{ type: 'text', text: '互斥检查' }], source: null }],
    partial: null,
    running: false,
    blank: false,
  })
  await sleep(300)
  assert(document.querySelectorAll('.gv-sname').length === 1 && document.querySelector('.gv-sname')?.textContent === '用户', '玩家行仅显示玩家名牌')
  // 系统行（错误事件）：两个名牌都隐藏。
  window.__setSession({
    sessionId: 'session-1',
    nodes: [{ kind: 'turn-error', seq: 9, turn: 1, step: 1, message: 'boom' }],
    partial: null,
    running: false,
    blank: false,
  })
  await sleep(300)
  assert(document.querySelector('.gv-sname') === null, '系统行两个名牌都隐藏')
  // 恢复 AI 行。
  window.__setSession({
    sessionId: 'session-1',
    nodes: [
      { kind: 'user', seq: 1, content: [{ type: 'text', text: '你好' }], source: null },
      { kind: 'assistant', seq: 2, turn: 1, step: 1, blocks: [{ kind: 'text', text: '……你终于来了。欢迎回来。' }] },
    ],
    partial: null,
    running: false,
    blank: false,
  })
  await sleep(300)
  assert(document.querySelector('.gv-sname')?.textContent === 'DeepSeek', '恢复后 AI 名牌复现')
  assert(document.querySelector('.gv-dialogue .gv-dialogue-name') === null, '对话框面板不再渲染名牌')

  // ---- Galgame 翻页：超长定稿文本分页显示，点击文本框逐页翻页 ----
  const longText = '这是很长的一段对话内容'.repeat(40)
  window.__setSession({
    sessionId: 'session-1',
    nodes: [{ kind: 'assistant', seq: 50, turn: 1, step: 1, blocks: [{ kind: 'text', text: longText }] }],
    partial: null,
    running: false,
    blank: false,
  })
  assert(await pollFor(() => document.querySelector('.gv-dtext-more') !== null, 6000), '第一页打完出现翻页提示')
  const page1 = document.querySelector('.gv-dialogue-text').textContent
  assert(page1.length < longText.length && longText.startsWith(page1), '超长文本按页显示（第一页为前缀）')
  assert(document.querySelector('.gv-dtext-ellipsis') !== null, '非末页显示省略号（独立标签）')
  const collected = [page1]
  let pageGuard = 0
  while (document.querySelector('.gv-dtext-more') !== null && pageGuard < 30) {
    document.querySelector('.gv-dtext').click()
    // 翻页后重新逐字打出（打字动画出现在每一页）。
    assert(await pollFor(() => document.querySelector('.gv-dialogue-caret') !== null, 800), '翻页后重新打字（第 ' + (pageGuard + 2) + ' 页）')
    assert(await pollFor(() => document.querySelector('.gv-dialogue-caret') === null, 5000), '翻页后打字完成（第 ' + (pageGuard + 2) + ' 页）')
    collected.push(document.querySelector('.gv-dialogue-text').textContent)
    pageGuard += 1
  }
  assert(pageGuard < 30, '翻页循环有界')
  assert(document.querySelector('.gv-dtext-more') === null, '末页无翻页提示')
  assert(document.querySelector('.gv-dtext-ellipsis') === null, '末页无省略号')
  assert(collected.join('') === longText, '各页拼接还原完整文本')
  // 阅读状态保存：重挂载（模拟切标签页再切回）应恢复到当前页，不从头渲染。
  const lastPageText = collected[collected.length - 1]
  window.__reactRoot.unmount()
  await sleep(60)
  await sleep(120)
  window.__reactRoot = window.ReactDOM.createRoot(document.getElementById('root'))
  window.__reactRoot.render(React.createElement(Component, props))
  await sleep(600)
  assert((document.querySelector('.gv-dialogue-text')?.textContent ?? '') === lastPageText, '切标签页后恢复阅读进度（不从头渲染）')
  assert(document.querySelector('.gv-dtext-more') === null, '重挂载后保持末页状态')
  // 回归：运行中重挂载（切标签页再切回）不从头走「用户消息 → 短暂滞留 → 状态页」。
  window.__setSession({
    sessionId: 'session-1',
    nodes: [{ kind: 'user', seq: 50, content: [{ type: 'text', text: '滞留测试' }], source: null }],
    partial: { turn: 3, step: 1, blocks: [{ kind: 'reasoning', text: '思考中…' }] },
    running: true,
    blank: false,
  })
  assert(await pollFor(() => (document.querySelector('.gv-dtext-status')?.textContent ?? '').includes('思考中'), 6000), '运行中滞留后进入状态页')
  window.__reactRoot.unmount()
  await sleep(60)
  await sleep(120)
  window.__reactRoot = window.ReactDOM.createRoot(document.getElementById('root'))
  window.__reactRoot.render(React.createElement(Component, props))
  assert(await pollFor(() => (document.querySelector('.gv-dtext-status')?.textContent ?? '').includes('思考中'), 700), '重挂载后直接回到状态页（不重走滞留）')
  assert(document.querySelector('.gv-dialogue-caret') === null, '重挂载后不重打玩家消息')
  // 恢复静态会话
  window.__setSession({
    sessionId: 'session-1',
    nodes: [
      { kind: 'user', seq: 1, content: [{ type: 'text', text: '你好' }], source: null },
      { kind: 'assistant', seq: 2, turn: 1, step: 1, blocks: [{ kind: 'text', text: '……你终于来了。欢迎回来。' }] },
    ],
    partial: null,
    running: false,
    blank: false,
  })
  await sleep(300)

  // ---- 空白段落折叠：成串空行不占用文本框空间 ----
  window.__setSession({
    sessionId: 'session-1',
    nodes: [{ kind: 'assistant', seq: 51, turn: 1, step: 1, blocks: [{ kind: 'text', text: '只有一段\n\n\n\n\n\n' }] }],
    partial: null,
    running: false,
    blank: false,
  })
  assert(await pollFor(() => (document.querySelector('.gv-dialogue-text')?.textContent ?? '') === '只有一段', 4000), '成串空行与尾随空行被清除')
  // 折叠保留单个段落分隔；三行文本超出两行容量 → 分页协同（第一页两行 + 翻页到第二段）。
  window.__setSession({
    sessionId: 'session-1',
    nodes: [{ kind: 'assistant', seq: 52, turn: 1, step: 1, blocks: [{ kind: 'text', text: '第一段\n\n\n\n\n第二段' }] }],
    partial: null,
    running: false,
    blank: false,
  })
  // 第一页以换行结尾：省略号应在最后一个可见字符（第一段）之后、换行之前。
  assert(await pollFor(() => (document.querySelector('.gv-dtext')?.textContent ?? '') === '第一段…\n\n▼', 4000), '省略号插在可见文本与换行之间')
  assert(document.querySelector('.gv-dialogue-text')?.textContent === '第一段', '可见文本不受影响')
  assert(document.querySelector('.gv-dtext-more') !== null, '第二页存在翻页提示')
  assert(document.querySelector('.gv-dtext-ellipsis') !== null, '非末页省略号紧贴文本显示')
  document.querySelector('.gv-dtext').click()
  assert(await pollFor(() => (document.querySelector('.gv-dtext')?.textContent ?? '') === '第二段', 2000), '翻页显示第二段（末页无省略号）')
  assert(document.querySelector('.gv-dtext-ellipsis') === null, '末页省略号消失')
  assert(!(document.querySelector('.gv-dialogue-text')?.textContent ?? '').includes('\n\n\n'), '显示中无连续空行')
  // 恢复静态会话
  window.__setSession({
    sessionId: 'session-1',
    nodes: [
      { kind: 'user', seq: 1, content: [{ type: 'text', text: '你好' }], source: null },
      { kind: 'assistant', seq: 2, turn: 1, step: 1, blocks: [{ kind: 'text', text: '……你终于来了。欢迎回来。' }] },
    ],
    partial: null,
    running: false,
    blank: false,
  })
  await sleep(300)

  // ---- 文本对齐：台词文本框默认左对齐，可切换为居中/右对齐 ----
  assert(document.querySelector('.gv-dtext').style.textAlign === 'left', '台词默认左对齐')
  const beforeAlign = window.__galApi.snapshotScene()
  window.__galApi.updateElement('dialogue-text', { align: 'center' })
  window.__galApi.commitHistory(beforeAlign)
  await sleep(80)
  assert(document.querySelector('.gv-dtext').style.textAlign === 'center', '台词对齐可切换为居中')
  const beforeAlign2 = window.__galApi.snapshotScene()
  window.__galApi.updateElement('dialogue-text', { align: 'right' })
  window.__galApi.commitHistory(beforeAlign2)
  await sleep(80)
  assert(document.querySelector('.gv-dtext').style.textAlign === 'right', '台词对齐可切换为右对齐')
  const beforeAlign3 = window.__galApi.snapshotScene()
  window.__galApi.updateElement('dialogue-text', { align: 'left' })
  window.__galApi.commitHistory(beforeAlign3)
  await sleep(80)

  // ---- 流式生成：玩家消息先入框，打字完成后切到 AI 思考态；文本到达后流式渲染 ----
  window.__setSession({
    sessionId: 'session-1',
    nodes: [{ kind: 'user', seq: 30, content: [{ type: 'text', text: '流式测试' }], source: null }],
    partial: { turn: 1, step: 1, blocks: [{ kind: 'reasoning', text: '思考中…' }] },
    running: true,
    blank: false,
  })
  assert(await pollFor(() => (document.querySelector('.gv-sname')?.textContent === '用户'
    && (document.querySelector('.gv-dialogue-text')?.textContent ?? '') === '流式测试'), 2500), '思考阶段持续显示玩家消息（名牌「用户」，完整打出）')
  await sleep(800)
  assert(document.querySelector('.gv-sname')?.textContent === '用户'
    && (document.querySelector('.gv-dialogue-text')?.textContent ?? '') === '流式测试', '思考期间玩家消息保持显示')
  assert(document.querySelector('.gv-dialogue-wait') === null, '思考占位省略号已移除')
  // 滞留后换页：状态页独立显示（空文本 + 状态行 + AI 名牌）。
  assert(await pollFor(() => (document.querySelector('.gv-sname')?.textContent === 'DeepSeek'
    && (document.querySelector('.gv-dialogue-text')?.textContent ?? '') === ''
    && (document.querySelector('.gv-dtext-status')?.textContent ?? '').includes('思考中')), 3000), '滞留后换页到状态页（思考中）')
  const statusFont = getComputedStyle(document.querySelector('.gv-dtext-status')).fontSize
  const textFont = getComputedStyle(document.querySelector('.gv-dialogue-text')).fontSize
  assert(statusFont === textFont, '状态文本字号与对话文本一致')
  window.__setSession({
    sessionId: 'session-1',
    nodes: [{ kind: 'user', seq: 30, content: [{ type: 'text', text: '流式测试' }], source: null }],
    partial: { turn: 1, step: 1, blocks: [{ kind: 'text', text: '流式回复进行中' }] },
    running: true,
    blank: false,
  })
  assert(await pollFor(() => (document.querySelector('.gv-sname')?.textContent === 'DeepSeek'
    && (document.querySelector('.gv-dialogue-text')?.textContent ?? '').includes('流式回复')), 3000), '文本流式阶段：名牌 DeepSeek + 流式文本渲染')
  assert(await pollFor(() => (document.querySelector('.gv-sname')?.textContent === 'DeepSeek'
    && document.querySelector('.gv-dtext-status') === null), 3000), '文本到达后状态行消失')
  // 回归：流式 → 定稿切换不得闪空/重打——定稿瞬间文本框保持已打出的内容（长度不回退）。
  const beforeFinalize = document.querySelector('.gv-dialogue-text')?.textContent ?? ''
  window.__setSession({
    sessionId: 'session-1',
    nodes: [
      { kind: 'user', seq: 30, content: [{ type: 'text', text: '流式测试' }], source: null },
      { kind: 'assistant', seq: 31, turn: 1, step: 1, blocks: [{ kind: 'text', text: '流式回复进行中，定稿后继续。' }] },
    ],
    partial: null,
    running: false,
    blank: false,
  })
  let minShownLen = Infinity
  for (let i = 0; i < 24; i++) {
    const t = document.querySelector('.gv-dialogue-text')?.textContent ?? ''
    minShownLen = Math.min(minShownLen, t.length)
    await sleep(30)
  }
  assert(beforeFinalize.length > 0, '定稿前流式文本已显示')
  assert(minShownLen >= beforeFinalize.length, '流式转定稿不闪空不重打（显示长度不回退）')
  assert((document.querySelector('.gv-dialogue-text')?.textContent ?? '').includes('定稿后继续'), '定稿后首段完整显示')
  // 回归：定稿节点与 running=false 状态帧分开到达时，完成窗口内不闪状态页、不重打。
  window.__setSession({
    sessionId: 'session-1',
    nodes: [{ kind: 'user', seq: 40, content: [{ type: 'text', text: '分开到达' }], source: null }],
    partial: { turn: 2, step: 1, blocks: [{ kind: 'text', text: '窗口期正文' }] },
    running: true,
    blank: false,
  })
  assert(await pollFor(() => (document.querySelector('.gv-dialogue-text')?.textContent ?? '').includes('窗口期正文'), 3000), '完成窗口流式正文已显示')
  // 节点先落地：partial 清空、running 仍为 true——应继续显示正文而不是闪状态页。
  window.__setSession({
    sessionId: 'session-1',
    nodes: [
      { kind: 'user', seq: 40, content: [{ type: 'text', text: '分开到达' }], source: null },
      { kind: 'assistant', seq: 41, turn: 2, step: 1, blocks: [{ kind: 'text', text: '窗口期正文，继续到定稿。' }] },
    ],
    partial: null,
    running: true,
    blank: false,
  })
  assert(await pollFor(() => (document.querySelector('.gv-dialogue-text')?.textContent ?? '').includes('窗口期正文')
    && document.querySelector('.gv-dtext-status') === null, 2500), '完成窗口内不闪状态页（正文持续显示）')
  const beforeWindowFinalize = document.querySelector('.gv-dialogue-text')?.textContent ?? ''
  window.__setSession({
    sessionId: 'session-1',
    nodes: [
      { kind: 'user', seq: 40, content: [{ type: 'text', text: '分开到达' }], source: null },
      { kind: 'assistant', seq: 41, turn: 2, step: 1, blocks: [{ kind: 'text', text: '窗口期正文，继续到定稿。' }] },
    ],
    partial: null,
    running: false,
    blank: false,
  })
  let minWindowLen = Infinity
  for (let i = 0; i < 24; i++) {
    const t = document.querySelector('.gv-dialogue-text')?.textContent ?? ''
    minWindowLen = Math.min(minWindowLen, t.length)
    await sleep(30)
  }
  assert(minWindowLen >= beforeWindowFinalize.length, '状态帧后到不重打（显示长度不回退）')
  // 回归：长回复定稿时流式已打满第一页 → 直接完整显示第一页，不清空重打。
  const longReply = '这是一段很长的流式回复内容。'.repeat(30)
  window.__setSession({
    sessionId: 'session-1',
    nodes: [{ kind: 'user', seq: 60, content: [{ type: 'text', text: '长回复测试' }], source: null }],
    partial: { turn: 4, step: 1, blocks: [{ kind: 'text', text: longReply }] },
    running: true,
    blank: false,
  })
  assert(await pollFor(() => (document.querySelector('.gv-dialogue-text')?.textContent ?? '').length > 250, 20000), '长回复流式打字超过第一页容量')
  window.__setSession({
    sessionId: 'session-1',
    nodes: [
      { kind: 'user', seq: 60, content: [{ type: 'text', text: '长回复测试' }], source: null },
      { kind: 'assistant', seq: 61, turn: 4, step: 1, blocks: [{ kind: 'text', text: longReply }] },
    ],
    partial: null,
    running: false,
    blank: false,
  })
  let longSawEmpty = false
  for (let i = 0; i < 40; i++) {
    const t = document.querySelector('.gv-dialogue-text')?.textContent ?? ''
    if (t === '') longSawEmpty = true
    await sleep(30)
  }
  assert(!longSawEmpty, '长回复定稿不重打第一页（无闪空）')
  const pageOne = document.querySelector('.gv-dialogue-text')?.textContent ?? ''
  assert(pageOne.length > 0 && longReply.startsWith(pageOne), '定稿后第一页完整显示')
  // 回归：真实运行时定稿节点文本与流式全文尾部存在分段差异——按已显示的
  // 可见前缀衔接第一页（startsWith 全文目标会失配导致重打）。
  const sharedBase = '完全相同的开头内容，用来撑满第一页之后继续延伸，让流式与定稿共享一个足够长的公共前缀。'.repeat(2)
  const streamedText2 = sharedBase + '流式尾部的特有内容。'.repeat(6)
  const finalText2 = sharedBase + '定稿尾部的不同内容。'.repeat(6)
  window.__setSession({
    sessionId: 'session-1',
    nodes: [{ kind: 'user', seq: 80, content: [{ type: 'text', text: '分段测试' }], source: null }],
    partial: { turn: 6, step: 1, blocks: [{ kind: 'text', text: streamedText2 }] },
    running: true,
    blank: false,
  })
  assert(await pollFor(() => (document.querySelector('.gv-dialogue-text')?.textContent ?? '').length >= 60, 20000), '分段流式打字已超过第一页容量')
  window.__setSession({
    sessionId: 'session-1',
    nodes: [
      { kind: 'user', seq: 80, content: [{ type: 'text', text: '分段测试' }], source: null },
      { kind: 'assistant', seq: 81, turn: 6, step: 1, blocks: [{ kind: 'text', text: finalText2 }] },
    ],
    partial: null,
    running: false,
    blank: false,
  })
  let segSawEmpty = false
  for (let i = 0; i < 40; i++) {
    const t = document.querySelector('.gv-dialogue-text')?.textContent ?? ''
    if (t === '') segSawEmpty = true
    await sleep(30)
  }
  assert(!segSawEmpty, '分段差异定稿不重打第一页（无闪空）')
  const segPage = document.querySelector('.gv-dialogue-text')?.textContent ?? ''
  assert(segPage.length > 0 && finalText2.startsWith(segPage), '分段差异定稿后第一页衔接显示')
  // 回归：定稿后节点列表短暂回退（真实运行时的 settled→running 振荡，lastLine
  // 一度回到玩家消息）再重新落地——不重定向打字机、不重打第一页。
  const oscText = '振荡窗口的流式正文内容。'.repeat(6)
  window.__setSession({
    sessionId: 'session-1',
    nodes: [{ kind: 'user', seq: 90, content: [{ type: 'text', text: '振荡测试' }], source: null }],
    partial: { turn: 7, step: 1, blocks: [{ kind: 'text', text: oscText }] },
    running: true,
    blank: false,
  })
  assert(await pollFor(() => (document.querySelector('.gv-dialogue-text')?.textContent ?? '').length >= 60, 20000), '振荡回归流式打字超过第一页容量')
  window.__setSession({
    sessionId: 'session-1',
    nodes: [
      { kind: 'user', seq: 90, content: [{ type: 'text', text: '振荡测试' }], source: null },
      { kind: 'assistant', seq: 91, turn: 7, step: 1, blocks: [{ kind: 'text', text: oscText }] },
    ],
    partial: null,
    running: false,
    blank: false,
  })
  await sleep(120)
  // 节点列表回退：只剩玩家消息。
  window.__setSession({
    sessionId: 'session-1',
    nodes: [{ kind: 'user', seq: 90, content: [{ type: 'text', text: '振荡测试' }], source: null }],
    partial: null,
    running: false,
    blank: false,
  })
  await sleep(120)
  // 节点重新落地。
  window.__setSession({
    sessionId: 'session-1',
    nodes: [
      { kind: 'user', seq: 90, content: [{ type: 'text', text: '振荡测试' }], source: null },
      { kind: 'assistant', seq: 91, turn: 7, step: 1, blocks: [{ kind: 'text', text: oscText }] },
    ],
    partial: null,
    running: false,
    blank: false,
  })
  let oscSawEmpty = false
  for (let i = 0; i < 40; i++) {
    const t = document.querySelector('.gv-dialogue-text')?.textContent ?? ''
    if (t === '') oscSawEmpty = true
    await sleep(30)
  }
  assert(!oscSawEmpty, '定稿振荡回退不重打第一页（无闪空）')
  const oscPage = document.querySelector('.gv-dialogue-text')?.textContent ?? ''
  assert(oscPage.length > 0 && oscText.startsWith(oscPage), '定稿振荡回退后第一页衔接显示')
  // 状态触发翻页：模型尚无任何状态时，消息滞留超过固定时长仍保持显示。
  window.__setSession({
    sessionId: 'session-1',
    nodes: [{ kind: 'user', seq: 41, content: [{ type: 'text', text: '等待状态' }], source: null }],
    partial: { turn: 1, step: 1, blocks: [] },
    running: true,
    blank: false,
  })
  await sleep(2200)
  assert(document.querySelector('.gv-sname')?.textContent === '用户'
    && (document.querySelector('.gv-dialogue-text')?.textContent ?? '') === '等待状态', '模型无状态时玩家消息持续滞留')
  // 模型状态到达 → 立即翻页（不再有额外等待）。
  window.__setSession({
    sessionId: 'session-1',
    nodes: [{ kind: 'user', seq: 41, content: [{ type: 'text', text: '等待状态' }], source: null }],
    partial: { turn: 1, step: 1, blocks: [{ kind: 'reasoning', text: '开始思考' }] },
    running: true,
    blank: false,
  })
  assert(await pollFor(() => (document.querySelector('.gv-sname')?.textContent === 'DeepSeek'
    && (document.querySelector('.gv-dtext-status')?.textContent ?? '').includes('思考中')), 1500), '模型状态到达立即翻页（思考中）')
  // 工具调用状态：partial 含 tool-call 块 → 「编写代码中」。
  window.__setSession({
    sessionId: 'session-1',
    nodes: [{ kind: 'user', seq: 3, content: [{ type: 'text', text: '查个文件' }], source: null }],
    partial: { turn: 1, step: 1, blocks: [{ kind: 'tool-call', callId: 'c1', name: 'read', argsRaw: '{}' }] },
    running: true,
    blank: false,
  })
  assert(await pollFor(() => (document.querySelector('.gv-sname')?.textContent === 'DeepSeek'
    && (document.querySelector('.gv-dtext-status')?.textContent ?? '').includes('编写代码中')), 4000), '调用工具时换页显示状态（编写代码中）')
  // 状态合并：工具执行与工具调用统一归类「编写代码中」（不附注工具名）。
  window.__setSession({
    sessionId: 'session-1',
    nodes: [{ kind: 'user', seq: 43, content: [{ type: 'text', text: '跑个工具' }], source: null }],
    partial: { turn: 1, step: 1, blocks: [{ kind: 'tool-call', callId: 'c9', name: 'grep', argsRaw: '{}' }] },
    runningCalls: [{ callId: 'c9', name: 'grep', argsRaw: '{}', turn: 1, step: 1 }],
    running: true,
    blank: false,
  })
  assert(await pollFor(() => {
    const text = document.querySelector('.gv-dtext-status')?.textContent ?? ''
    return text.includes('编写代码中') && !text.includes('grep')
  }, 4000), '工具执行时统一显示状态（编写代码中，不附注工具名）')
  // 错误归类：回合失败显示错误行正文（[错误] …），不再叠加「（出错…）」状态行。
  window.__setSession({
    sessionId: 'session-1',
    nodes: [{ kind: 'turn-error', seq: 60, turn: 1, step: 1, message: 'boom' }],
    partial: null,
    running: false,
    blank: false,
  })
  assert(await pollFor(() => (document.querySelector('.gv-dialogue-text')?.textContent ?? '').includes('[错误] boom'), 2500), '回合错误显示错误行正文')
  assert(document.querySelector('.gv-dtext-status') === null, '错误行不再叠加状态行')
  // 恢复静态会话
  window.__setSession({
    sessionId: 'session-1',
    nodes: [
      { kind: 'user', seq: 1, content: [{ type: 'text', text: '你好' }], source: null },
      { kind: 'assistant', seq: 2, turn: 1, step: 1, blocks: [{ kind: 'text', text: '……你终于来了。欢迎回来。' }] },
    ],
    partial: null,
    running: false,
    blank: false,
  })
  await sleep(300)
  const dtextEl = document.querySelector('.gv-dtext')
  assert(dtextEl !== null, '台词渲染进独立文本元素')
  assert(document.querySelector('.gv-dialogue .gv-dialogue-text') === null, '对话框面板不再内嵌正文')
  // 打字机开始输出（轮询等待，避免 rAF 时序抖动）。
  let typedAny = false
  for (let i = 0; i < 24; i++) {
    const t = document.querySelector('.gv-dialogue-text')?.textContent ?? ''
    if (t.length > 0) { typedAny = true; break }
    await sleep(50)
  }
  assert(typedAny, '打字机开始输出')
  await sleep(1200)
  const typed = document.querySelector('.gv-dialogue-text').textContent
  assert(typed.includes('你终于来了'), '打字机完整输出助手台词')

  // 记录游戏模式舞台显示尺寸（供编辑模式对齐断言）。
  window.__gameStageRect = (() => {
    const r = document.querySelector('.gv-stage').getBoundingClientRect()
    return { width: r.width, height: r.height }
  })()

  const textarea = document.querySelector('.gv-input-box')
  const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set
  valueSetter.call(textarea, '你好呀')
  textarea.dispatchEvent(new Event('input', { bubbles: true }))
  await sleep(50)
  document.querySelector('.gv-send').click()
  assert(window.__drafts.length === 1 && window.__drafts[0] === '你好呀', '发送写入宿主 draft')
  assert(window.__submits() === 1, '发送调用宿主 submit')

  const editorBtn = [...document.querySelectorAll('.gv-mode-btn')].find(b => b.textContent === '编辑模式')
  editorBtn.click()
  await sleep(150)
  assert(document.querySelector('[data-gal-view]').getAttribute('data-gal-mode') === 'editor', '切换到编辑模式')
  const treeRows = document.querySelectorAll('.gv-tree-row')
  const scene = sceneSource.getSnapshot()
  assert(treeRows.length === scene.elements.length, '元素树行数与元素数一致')

  // 舞台尺寸与游戏模式一致（WYSIWYG：编辑所见即游戏所得）。
  const stageRect = () => {
    const r = document.querySelector('.gv-stage').getBoundingClientRect()
    return { width: r.width, height: r.height }
  }
  const editorStage = stageRect()
  const gameStage = window.__gameStageRect
  const sizeMatches = Math.abs(editorStage.width - gameStage.width) < 0.6
    && Math.abs(editorStage.height - gameStage.height) < 0.6
  assert(sizeMatches, '编辑模式舞台与游戏模式同尺寸（' + Math.round(editorStage.width) + '×' + Math.round(editorStage.height) + ' vs ' + Math.round(gameStage.width) + '×' + Math.round(gameStage.height) + '）')

  // 添加元素菜单：不被工具栏裁剪，且菜单项添加正确类型。
  const addBtn = [...document.querySelectorAll('.gv-toolbar-group .gv-btn')].find(b => b.textContent.includes('添加元素'))
  addBtn.click()
  await sleep(120)
  const menuEl = document.querySelector('.gv-add-menu')
  const toolbarRect = document.querySelector('.gv-editor-toolbar').getBoundingClientRect()
  assert(menuEl !== null && menuEl.getBoundingClientRect().bottom > toolbarRect.bottom, '添加菜单不被工具栏裁剪')
  const countBefore = sceneSource.getSnapshot().elements.length
  ;[...menuEl.querySelectorAll('button')].find(b => b.textContent === '台词').click()
  await sleep(100)
  const after = sceneSource.getSnapshot().elements
  assert(after.length === countBefore + 1, '菜单项添加元素成功')
  const added = after.find(el => el.type === 'dialogue-text' && el.id !== 'dialogue-text')
  assert(added !== undefined, '菜单项添加的是正确类型（台词）')
  window.__galApi.removeElement(added.id)
  await sleep(60)
  assert(document.querySelector('.gv-add-menu') === null, '选择后菜单关闭')

  // 边栏可隐藏：侧栏悬浮于舞台之上，隐藏不影响舞台尺寸。
  const treePanel = document.querySelector('.gv-editor-tree')
  const treeToggle = [...document.querySelectorAll('.gv-toolbar-group .gv-btn')].find(b => b.textContent === '元素树')
  treeToggle.click()
  await sleep(300)
  assert(treePanel.classList.contains('is-collapsed'), '元素树可隐藏')
  const collapsedStage = stageRect()
  const collapsedMatches = Math.abs(collapsedStage.width - gameStage.width) < 0.6
    && Math.abs(collapsedStage.height - gameStage.height) < 0.6
  assert(collapsedMatches, '隐藏边栏不影响舞台尺寸')
  const propsToggle = [...document.querySelectorAll('.gv-toolbar-group .gv-btn')].find(b => b.textContent === '属性')
  propsToggle.click()
  await sleep(300)
  assert(document.querySelector('.gv-editor-props').classList.contains('is-collapsed'), '属性面板可隐藏')
  treeToggle.click()
  propsToggle.click()
  await sleep(300)
  assert(!treePanel.classList.contains('is-collapsed') && !document.querySelector('.gv-editor-props').classList.contains('is-collapsed'), '边栏可恢复显示')

  const charRow = [...treeRows].find(row => row.textContent.includes('角色'))
  charRow.click()
  await sleep(60)
  assert(document.querySelector('.gv-sel') !== null, '选中元素出现选中框')

  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }))
  await sleep(60)
  assert(!sceneSource.getSnapshot().elements.some(el => el.id === 'char-b'), 'Delete 删除选中元素')
  assert(historySource.getSnapshot().undo > 0, '删除写入撤销历史')

  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true }))
  await sleep(60)
  assert(sceneSource.getSnapshot().elements.some(el => el.id === 'char-b'), 'Ctrl+Z 恢复元素')

  // 重新选中后再 Escape：只取消选中，不退出编辑模式（拖拽随后在编辑模式进行）。
  const charRow2 = [...document.querySelectorAll('.gv-tree-row')].find(row => row.textContent.includes('角色'))
  charRow2.click()
  await sleep(60)
  assert(document.querySelector('.gv-sel') !== null, '重新选中出现选中框')
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
  await sleep(60)
  assert(document.querySelector('.gv-sel') === null, 'Escape 取消选中')
  assert(document.querySelector('[data-gal-view]').getAttribute('data-gal-mode') === 'editor', 'Escape 取消选中后仍在编辑模式')

  const exported = JSON.parse(api.exportScene())
  assert(Array.isArray(exported.elements) && exported.elements.length > 0, '导出场景 JSON 合法')

  // 此前 focus() 可能滚动了会话滚动体：重置后再取坐标（手柄/元素须在视口内可点）。
  window.scrollTo(0, 0)
  const scrollBodyReset = document.querySelector('[data-conversation-scroll]')
  if (scrollBodyReset !== null) scrollBodyReset.scrollTop = 0
  window.__dragTarget = (() => {
    const el = document.querySelector('[data-el-id="char-b"]')
    if (el === null) return null
    const rect = el.getBoundingClientRect()
    const charA = sceneSource.getSnapshot().elements.find(e => e.id === 'char-b')
    // 抓元素顶部区域：预设里立绘盒子很大，中心会被台词元素（更高 z）遮挡。
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height * 0.05,
      beforeX: charA.x,
      beforeY: charA.y,
    }
  })()

  return results
}

/** 阶段二（拖拽之后）：拖拽生效 + 退出编辑 + 历史面板 + 重置 + 清理。 */
async function pageTestPhase2() {
  const results = []
  const assert = (cond, name) => { results.push({ name, ok: !!cond }) }
  const sleep = ms => new Promise(r => setTimeout(r, ms))
  const sceneSource = window.__galScene
  const charA = sceneSource.getSnapshot().elements.find(e => e.id === 'char-b')
  assert(charA !== undefined, '拖拽后 char-b 仍存在')
  const drag = window.__dragTarget
  if (charA !== undefined && drag !== null && drag !== undefined) {
    const moved = charA.x !== drag.beforeX || charA.y !== drag.beforeY
    assert(moved, '拖拽移动元素（x ' + drag.beforeX + ' → ' + charA.x + '）')
  }
  assert(window.__galHistory.getSnapshot().undo > 0, '拖拽写入撤销历史')

  // 拖拽起手会选中元素：第一次 Esc 取消选中，第二次 Esc 退出编辑模式。
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
  await sleep(60)
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
  await sleep(120)
  const mode = document.querySelector('[data-gal-view]').getAttribute('data-gal-mode')
  assert(mode === 'game', 'Esc 退出编辑模式回到游戏模式')

  // 底部控制栏已移除：历史功能由场景内透明按钮承载。
  assert(document.querySelector('.gv-controls') === null, '底部控制栏已移除')
  // 名牌元素自定义名字 → 历史面板按元素显示。
  const beforeNames = window.__galApi.snapshotScene()
  window.__galApi.updateElement('speaker-ai', { text: '自定义AI' })
  window.__galApi.updateElement('speaker-player', { text: '自定义我' })
  window.__galApi.commitHistory(beforeNames)
  await sleep(80)
  const historyBtn = document.querySelector('[data-el-id="btn-history"]')
  historyBtn.click()
  await sleep(120)
  const rows = document.querySelectorAll('.gv-history-row')
  assert(rows.length >= 2, '历史按钮打开历史面板')
  const names = [...document.querySelectorAll('.gv-history-name')].map(n => n.textContent)
  assert(names.includes('自定义AI'), '历史行 AI 名取自定义名牌文本')
  assert(names.includes('自定义我'), '历史行玩家名取自定义名牌文本')
  assert(!names.includes('系统'), '历史行不再出现系统名（有 AI 名牌时）')
  const beforeNameRestore = window.__galApi.snapshotScene()
  window.__galApi.updateElement('speaker-ai', { text: 'DeepSeek' })
  window.__galApi.updateElement('speaker-player', { text: '你' })
  window.__galApi.commitHistory(beforeNameRestore)
  await sleep(80)
  // 自动按钮：开关状态高亮。
  const autoBtn = document.querySelector('[data-el-id="btn-auto"]')
  assert(!autoBtn.classList.contains('is-on'), '自动按钮初始关闭')
  autoBtn.click()
  await sleep(80)
  assert(document.querySelector('[data-el-id="btn-auto"]').classList.contains('is-on'), '自动按钮点击后高亮')
  document.querySelector('[data-el-id="btn-auto"]').click()
  await sleep(80)
  assert(!document.querySelector('[data-el-id="btn-auto"]').classList.contains('is-on'), '自动按钮再点关闭')
  // 删除显示文本后按钮应为空白（不再回退默认「按钮」）。
  const beforeBtnText = window.__galApi.snapshotScene()
  window.__galApi.updateElement('btn-history', { text: '' })
  window.__galApi.commitHistory(beforeBtnText)
  await sleep(80)
  assert(document.querySelector('[data-el-id="btn-history"]').textContent === '', '透明按钮删除文本后为空白')
  const beforeBtnRestore = window.__galApi.snapshotScene()
  window.__galApi.updateElement('btn-history', { text: '历史' })
  window.__galApi.commitHistory(beforeBtnRestore)
  await sleep(80)

  window.__galApi.resetScene()
  assert(sceneSource.getSnapshot().elements.length === window.__initialElementCount, '重置恢复默认预设场景元素')

  // ---- 美术素材：导入 → 应用 → 渲染 → 导出内嵌 → 删除清理 ----
  const PNG_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
  const bytes = Uint8Array.from(atob(PNG_B64), c => c.charCodeAt(0))
  const file = new File([bytes], 'bg.png', { type: 'image/png' })
  const imported = await window.__galApi.importAssets([file])
  assert(imported.added === 1 && imported.ids.length === 1, '导入素材入库')
  assert(window.__galAssets.getSnapshot().map.size === window.__initialAssetCount + 1, '素材源新增 1 条记录')
  const assetId = imported.ids[0]
  const beforeAsset = window.__galApi.snapshotScene()
  window.__galApi.updateElement('background', { image: assetId })
  window.__galApi.commitHistory(beforeAsset)
  await sleep(80)
  const bgEl = document.querySelector('[data-el-id="background"]')
  assert(bgEl !== null && bgEl.style.backgroundImage.includes('data:image/png'), '背景元素应用素材图片')
  const beforeChar = window.__galApi.snapshotScene()
  window.__galApi.updateElement('char-b', { image: assetId })
  window.__galApi.commitHistory(beforeChar)
  await sleep(60)
  const charImg = document.querySelector('[data-el-id="char-b"] .gv-char-img')
  assert(charImg !== null && charImg.src.includes('data:image/png'), '角色立绘应用素材图片')
  const withAsset = JSON.parse(window.__galApi.exportScene())
  assert(withAsset.assets !== undefined && withAsset.assets[assetId] !== undefined, '导出 JSON 内嵌被引用素材')
  await window.__galApi.removeAsset(assetId)
  assert(window.__galAssets.getSnapshot().map.size === window.__initialAssetCount, '删除素材出库')
  assert(sceneSource.getSnapshot().elements.find(e => e.id === 'background').image === null, '删除素材清除元素引用')

  // ---- 自定义字体：导入 → 注册 @font-face → 应用到台词 → 导出内嵌 → 删除 ----
  const fontBytes = new Uint8Array([0, 1, 2, 3, 4, 5])
  const fontFile = new File([fontBytes], '测试字体.ttf', { type: 'font/ttf' })
  const fRes = await window.__galApi.importFonts([fontFile])
  assert(fRes.added === 1 && fRes.ids.length === 1, '导入字体入库')
  assert(window.__galFonts.getSnapshot().map.size === 1, '字体源含 1 条记录')
  const fontId = fRes.ids[0]
  const family = window.__galFonts.getSnapshot().map.get(fontId).family
  assert(family === '测试字体', '字体 family 由文件名生成')
  const fontStyle = document.querySelector('style[data-gal-view-fonts]')
  assert(fontStyle !== null && fontStyle.textContent.includes('@font-face') && fontStyle.textContent.includes(family), '@font-face 已注册')
  const beforeFont = window.__galApi.snapshotScene()
  window.__galApi.updateElement('dialogue-text', { fontFamily: family })
  window.__galApi.commitHistory(beforeFont)
  await sleep(80)
  const dtextStyle = document.querySelector('.gv-dtext').style.fontFamily
  assert(dtextStyle.includes(family), '台词元素应用自定义字体')
  const withFont = JSON.parse(window.__galApi.exportScene())
  assert(withFont.fonts !== undefined && withFont.fonts[fontId] !== undefined, '导出 JSON 内嵌被引用字体')
  await window.__galApi.removeFont(fontId)
  assert(window.__galFonts.getSnapshot().map.size === 0, '删除字体出库')
  assert(document.querySelector('style[data-gal-view-fonts]').textContent === '', '删除后 @font-face 清空')

  for (const d of window.__disposers) d()
  assert(document.querySelector('style[data-gal-view-style]') === null, 'dispose 移除样式标签')

  // 卸载恢复：输入席与滚动体恢复原状（切回「对话」标签时执行）。
  window.__reactRoot.unmount()
  await sleep(120)
  const seat2 = document.querySelector('[data-composer-seat]')
  const scroll2 = document.querySelector('[data-conversation-scroll]')
  assert(seat2 !== null && seat2.style.display === '', '卸载后输入席恢复显示')
  assert(scroll2 !== null && scroll2.style.overflow === '', '卸载后滚动体恢复滚动')

  return results
}

async function main() {
  const pwPath = resolveOptional('playwright')
  if (pwPath === null) {
    console.log('[smoke] SKIP：playwright 不在 checkout（DSH_CHECKOUT 需指向含 playwright 的 checkout）')
    return 0
  }
  const reactUmd = resolveUmd('react', 'react.development.js')
  const reactDomUmd = resolveUmd('react-dom', 'react-dom.development.js')
  if (reactUmd === null || reactDomUmd === null) {
    console.log('[smoke] SKIP：react/react-dom UMD 不在 checkout')
    return 0
  }
  if (!existsSync(CLIENT_JS)) {
    console.error('[smoke] FAIL：.dsh-plugin/client.js 不存在，先运行 node scripts/build-client.mjs')
    return 1
  }
  const pw = await import(pathToFileURL(pwPath).href)
  const { chromium } = pw.default ?? pw
  const files = {
    '/': { type: 'text/html; charset=utf-8', body: SMOKE_HTML },
    '/react.js': { type: 'application/javascript', body: readFileSync(reactUmd, 'utf8') },
    '/react-dom.js': { type: 'application/javascript', body: readFileSync(reactDomUmd, 'utf8') },
    '/client.js': { type: 'application/javascript', body: readFileSync(CLIENT_JS, 'utf8') },
  }
  const server = createServer((req, res) => {
    if (req.url === '/favicon.ico') { res.writeHead(204); res.end(); return }
    const file = files[req.url === '/' ? '/' : (req.url ?? '').split('?')[0]]
    if (file === undefined) {
      res.writeHead(404)
      res.end('not found')
      return
    }
    res.writeHead(200, { 'content-type': file.type })
    res.end(file.body)
  })
  await new Promise(resolveServer => server.listen(0, '127.0.0.1', resolveServer))
  const port = server.address().port

  let browser = null
  let failures = 0
  try {
    // 浏览器缓存版本与 checkout 的 playwright 可能不同步：优先用缓存里的可执行文件。
    const cache = join(process.env.LOCALAPPDATA ?? process.env.USERPROFILE ?? '', 'ms-playwright')
    const candidates = [
      join(cache, 'chromium_headless_shell-1228', 'chrome-headless-shell-win64', 'chrome-headless-shell.exe'),
      join(cache, 'chromium-1208', 'chrome-win64', 'chrome.exe'),
      join(cache, 'chromium_headless_shell-1208', 'chrome-headless-shell-win64', 'chrome-headless-shell.exe'),
    ]
    const executable = candidates.find(p => existsSync(p))
    browser = await chromium.launch({ executablePath: executable })
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
    page.on('pageerror', err => { console.log('[smoke] 页面错误：' + err.message) })
    page.on('console', msg => { if (msg.type() === 'error') console.log('[smoke] 控制台错误：' + msg.text().slice(0, 200)) })
    await page.goto('http://127.0.0.1:' + port + '/', { waitUntil: 'load' })

    const first = await page.evaluate(pageTestPhase1)
    for (const r of first) {
      if (r.ok) console.log('[smoke] PASS：' + r.name)
      else { console.log('[smoke] FAIL：' + r.name); failures += 1 }
    }
    await page.evaluate(results => { window.__results = results }, first)

    const target = await page.evaluate(() => window.__dragTarget ?? null)
    if (target !== null) {
      await page.mouse.move(target.x, target.y)
      await page.mouse.down()
      await page.mouse.move(target.x + 90, target.y + 60, { steps: 8 })
      await page.mouse.up()
    }
    await page.waitForTimeout(200)

    // ---- 边缘吸附（磁吸，非钳制）----
    await page.evaluate(() => { window.__snapResults = [] })
    // 1) 拖 char-a 到舞台左缘：落在阈值内 → 吸附到 x=0。
    const plan1 = await page.evaluate(() => {
      const scale = parseFloat(document.querySelector('.gv-stage').dataset.scale)
      const el = document.querySelector('[data-el-id="char-b"]')
      const r = el.getBoundingClientRect()
      const data = window.__galScene.getSnapshot().elements.find(e => e.id === 'char-b')
      return { cx: r.left + r.width / 2, cy: r.top + r.height * 0.05, dx: (2 - data.x) * scale }
    })
    await page.mouse.move(plan1.cx, plan1.cy)
    await page.mouse.down()
    await page.mouse.move(plan1.cx + plan1.dx, plan1.cy, { steps: 20 })
    await page.mouse.up()
    await page.waitForTimeout(150)
    // 2) 继续向左越过边缘：不钳制。
    const plan2 = await page.evaluate(() => {
      const x = window.__galScene.getSnapshot().elements.find(e => e.id === 'char-b').x
      window.__snapResults.push({ name: '拖动吸附到舞台左缘', ok: x === 0 })
      const scale = parseFloat(document.querySelector('.gv-stage').dataset.scale)
      const r = document.querySelector('[data-el-id="char-b"]').getBoundingClientRect()
      return { cx: r.left + r.width / 2, cy: r.top + r.height * 0.05, dx: -40 * scale }
    })
    await page.mouse.move(plan2.cx, plan2.cy)
    await page.mouse.down()
    await page.mouse.move(plan2.cx + plan2.dx, plan2.cy, { steps: 12 })
    await page.mouse.up()
    await page.waitForTimeout(150)
    await page.evaluate(() => {
      const x = window.__galScene.getSnapshot().elements.find(e => e.id === 'char-b').x
      window.__snapResults.push({ name: '越过舞台边缘不被钳制', ok: x < 0 })
    })
    // 3) 拉伸图片元素右缘吸附到舞台右缘（960）。
    // 收起属性面板（悬浮面板会盖住舞台右缘），图片元素右缘拖到舞台右缘 960。
    const plan3 = await page.evaluate(async () => {
      const sleep = ms => new Promise(r => setTimeout(r, ms))
      const propsToggle = [...document.querySelectorAll('.gv-toolbar-group .gv-btn')].find(b => b.textContent === '属性')
      if (propsToggle !== undefined && !document.querySelector('.gv-editor-props').classList.contains('is-collapsed')) propsToggle.click()
      await sleep(300)
      const rectId = window.__galApi.addElement('image')
      window.__galApi.updateElement(rectId, { x: 600, y: 80, w: 60, h: 60 })
      await sleep(80)
      const row = [...document.querySelectorAll('.gv-tree-row')].find(r => r.textContent.includes('导入图片'))
      row.click()
      await sleep(100)
      const scale = parseFloat(document.querySelector('.gv-stage').dataset.scale)
      const h = document.querySelector('.gv-sel-e').getBoundingClientRect()
      window.__rectId = rectId
      return { hx: h.left + h.width / 2, hy: h.top + h.height / 2, dx: 300 * scale }
    })
    await page.mouse.move(plan3.hx, plan3.hy)
    await page.mouse.down()
    await page.mouse.move(plan3.hx + plan3.dx, plan3.hy, { steps: 8 })
    await page.mouse.up()
    await page.waitForTimeout(150)
    // 4) 继续拉伸越过右缘：不钳制。
    const plan4 = await page.evaluate(() => {
      const w = window.__galScene.getSnapshot().elements.find(e => e.id === window.__rectId).w
      const rect = window.__galScene.getSnapshot().elements.find(e => e.id === window.__rectId)
      window.__snapResults.push({ name: '拉伸右缘吸附到舞台边缘（w=' + w + ', x=' + rect.x + '）', ok: w === 360 })
      const scale = parseFloat(document.querySelector('.gv-stage').dataset.scale)
      const h = document.querySelector('.gv-sel-e').getBoundingClientRect()
      return { hx: h.left + h.width / 2, hy: h.top + h.height / 2, dx: 35 * scale }
    })
    await page.mouse.move(plan4.hx, plan4.hy)
    await page.mouse.down()
    await page.mouse.move(plan4.hx + plan4.dx, plan4.hy, { steps: 8 })
    await page.mouse.up()
    await page.waitForTimeout(150)
    await page.evaluate(() => {
      const w = window.__galScene.getSnapshot().elements.find(e => e.id === window.__rectId).w
      window.__snapResults.push({ name: '拉伸越过舞台边缘不被钳制', ok: w > 360 })
    })

    const all = await page.evaluate(pageTestPhase2)
    for (const r of all) {
      if (r.ok) console.log('[smoke] PASS：' + r.name)
      else { console.log('[smoke] FAIL：' + r.name); failures += 1 }
    }
    const snapResults = await page.evaluate(() => window.__snapResults)
    for (const r of snapResults) {
      if (r.ok) console.log('[smoke] PASS：' + r.name)
      else { console.log('[smoke] FAIL：' + r.name); failures += 1 }
    }
  } catch (error) {
    console.error('[smoke] ERROR：' + String(error?.message ?? error))
    failures += 1
  } finally {
    if (browser !== null) await browser.close()
    server.close()
  }
  console.log(failures === 0 ? '[smoke] 全部通过' : '[smoke] ' + failures + ' 项失败')
  return failures === 0 ? 0 : 1
}

process.exitCode = await main()
