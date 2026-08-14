// 打字机效果：纯 reducer，无定时器无 DOM——组件用 rAF 驱动 tick，可单测。
// 语义：target 是应显示的完整文本，shown 是当前已显示前缀，done 表示已追平。
// 实时流式输入（模型逐块输出）时 target 持续增长：始终从头逐字追赶（不跳尾部）——
// 流式期间对话框钉住开头展示第一段，长回复不整段滚动；定稿后由分页接管逐页展示。

/** 三档速度（字/秒）。 */
export const SPEEDS = Object.freeze({ slow: 24, normal: 60, fast: 240 })

/** 初始状态：空文本、已完成。 */
export function createTypeState() {
  return { target: '', shown: '', done: true }
}

/** 换目标文本：新目标以 shown 为前缀时保留进度（流式追加无缝衔接），否则重打。 */
export function setTarget(state, text) {
  const target = typeof text === 'string' ? text : ''
  if (target === state.target) return state
  const keep = target.startsWith(state.shown)
  const shown = keep ? state.shown : ''
  return { target, shown, done: shown === target }
}

/** 立刻追平（点击跳过/自动播放）。 */
export function skip(state) {
  if (state.done) return state
  return { target: state.target, shown: state.target, done: true }
}

/** 前进一帧：按经过时间与速度推进若干字（始终从头逐字，不追尾）。无变化返回原引用。 */
export function advance(state, dtMs, speed = SPEEDS.normal) {
  if (state.done || dtMs <= 0) return state
  const gap = state.target.length - state.shown.length
  if (gap <= 0) return { target: state.target, shown: state.target, done: true }
  const chars = Math.max(1, Math.round(speed * dtMs / 1000))
  const next = state.target.slice(0, state.shown.length + chars)
  if (next === state.shown) return state
  return { target: state.target, shown: next, done: next === state.target }
}

