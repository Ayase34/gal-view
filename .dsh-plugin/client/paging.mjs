// 台词分页（Galgame 点击翻页）：把超过文本框容量的文本按页拆分。
// splitPages 是纯函数（注入 fits 判定，可单测）；createFitsMeasurer 用隐藏 DOM 元素
// 按给定盒尺寸（逻辑像素）判定「前缀能否装进文本框」。

/** 最多页数上限（防御病态输入；超出余量整体并入末页）。 */
export const MAX_PAGES = 24

/** 断点偏好：句末/段落标点（回溯断点时在这些字符之后断页更自然）。 */
const BREAK_PUNCT = /[。！？!?；;…\n]/

/**
 * 把文本拆成若干页：每页取「从当前起点开始、能被 fits 容纳的最长前缀」。
 * @param text - 完整文本。
 * @param fits - (prefix) => boolean：前缀是否能完整装进文本框。
 * @param options - maxPages 上限。
 * @returns 页数组（原顺序拼接 = 原文）。
 */
export function splitPages(text, fits, { maxPages = MAX_PAGES } = {}) {
  if (text === '') return ['']
  const pages = []
  let start = 0
  while (start < text.length && pages.length < maxPages) {
    const rest = text.slice(start)
    if (fits(rest)) {
      pages.push(rest)
      start = text.length
      break
    }
    // 二分查找最长可容纳前缀（fits 单调：前缀装得下则更短前缀必装得下）。
    let lo = 1
    let hi = rest.length - 1
    let best = 0
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2)
      if (fits(rest.slice(0, mid))) {
        best = mid
        lo = mid + 1
      } else {
        hi = mid - 1
      }
    }
    if (best === 0) {
      // 兜底：连 1 个字都装不下（异常盒尺寸）→ 单字成页，保证前进。
      pages.push(rest.slice(0, 1))
      start += 1
    } else {
      // 断点优化：在页尾附近回溯到最近的句末标点，避免同段文本在句中异常截断；
      // 回溯不得把页面砍得太短（≥ 50%），否则保持硬断点。
      let cut = best
      const maxBacktrack = Math.min(48, Math.floor(best * 0.5))
      for (let i = best - 1; i >= best - maxBacktrack && i >= 0; i--) {
        if (BREAK_PUNCT.test(rest[i])) {
          cut = i + 1
          break
        }
      }
      if (cut < Math.ceil(best * 0.5)) cut = best
      pages.push(rest.slice(0, cut))
      start += cut
    }
  }
  if (start < text.length && pages.length > 0) {
    // 达到页数上限：余量并入末页（页数不超上限）。
    pages[pages.length - 1] += text.slice(start)
  }
  // 页首裁剪：每页首行不得是换行符（页首空行会让文字位置偏移；纯换行页剔除）。
  const kept = pages
    .map(page => page.replace(/^\n+/, ''))
    .filter(page => page !== '')
  return kept.length === 0 ? [''] : kept
}

/**
 * 创建 fits 判定：隐藏测量元素模拟台词文本框（逻辑像素盒：宽度/高度/字号 +
 * 与 .gv-dtext 一致的 padding/行高/换行规则），前缀写入后比较 scrollHeight 与
 * clientHeight。创建后应调用 dispose 移除测量元素。
 * @param box - { width, height, fontSize, fontFamily }（舞台逻辑像素/字体，与台词元素一致）。
 */
export function createFitsMeasurer(box) {
  const el = document.createElement('div')
  el.setAttribute('data-gal-measure', '')
  el.style.cssText = [
    'position: absolute;',
    'left: -99999px; top: 0;',
    'visibility: hidden;',
    'pointer-events: none;',
    'box-sizing: border-box;',
    'padding: 2px 10px;',
    'line-height: 1.8;',
    'white-space: pre-wrap;',
    'word-break: break-word;',
    'overflow: hidden;',
    'font-family: ' + (box.fontFamily !== undefined && box.fontFamily !== '' ? box.fontFamily : 'inherit') + ';',
    'width: ' + box.width + 'px;',
    'height: ' + box.height + 'px;',
    'font-size: ' + box.fontSize + 'px;',
  ].join(' ')
  document.body.appendChild(el)
  return {
    fits(prefix) {
      el.textContent = prefix
      return el.scrollHeight <= el.clientHeight
    },
    dispose() {
      el.remove()
    },
  }
}
