// 边缘吸附（磁吸，非钳制）：拖动/拉伸时，元素的边缘或中线靠近候选线
// （舞台边界/中线 + 其他元素的边缘/中线）阈值内即吸附对齐；超过阈值自由移动，
// 元素可以越出舞台。吸附受场景 settings.snap 总开关控制，与网格吸附同一语义；
// 边缘吸附优先于网格吸附（同轴有边缘吸附时该轴不再取整到网格）。

/** 吸附阈值（舞台逻辑坐标 px）。 */
export const EDGE_THRESHOLD = 6

/** 收集候选吸附线：舞台边界/中线 + 各可见元素的边缘/中线（排除拖动中的元素）。 */
export function collectSnapLines({ stageW, stageH, elements, excludeId }) {
  const lines = [
    { axis: 'x', pos: 0, kind: 'stage' },
    { axis: 'x', pos: stageW, kind: 'stage' },
    { axis: 'x', pos: stageW / 2, kind: 'stage' },
    { axis: 'y', pos: 0, kind: 'stage' },
    { axis: 'y', pos: stageH, kind: 'stage' },
    { axis: 'y', pos: stageH / 2, kind: 'stage' },
  ]
  for (const el of elements) {
    if (el.id === excludeId || el.hidden) continue
    lines.push(
      { axis: 'x', pos: el.x, kind: 'edge' },
      { axis: 'x', pos: el.x + el.w, kind: 'edge' },
      { axis: 'x', pos: el.x + el.w / 2, kind: 'center' },
      { axis: 'y', pos: el.y, kind: 'edge' },
      { axis: 'y', pos: el.y + el.h, kind: 'edge' },
      { axis: 'y', pos: el.y + el.h / 2, kind: 'center' },
    )
  }
  return lines
}

/** 移动手势的关键线：左右边缘 + 水平中线 + 上下边缘 + 垂直中线。 */
export const MOVE_KEYS = Object.freeze([
  { axis: 'x', get: r => r.x, set: (r, v) => ({ ...r, x: v }) },
  { axis: 'x', get: r => r.x + r.w, set: (r, v) => ({ ...r, x: v - r.w }) },
  { axis: 'x', get: r => r.x + r.w / 2, set: (r, v) => ({ ...r, x: v - r.w / 2 }) },
  { axis: 'y', get: r => r.y, set: (r, v) => ({ ...r, y: v }) },
  { axis: 'y', get: r => r.y + r.h, set: (r, v) => ({ ...r, y: v - r.h }) },
  { axis: 'y', get: r => r.y + r.h / 2, set: (r, v) => ({ ...r, y: v - r.h / 2 }) },
])

/** 缩放手势的关键线：只吸附「正在移动的边」；对边保持锚定。 */
export function resizeKeys(dir) {
  const keys = []
  if (dir.includes('w')) keys.push({ axis: 'x', get: r => r.x, set: (r, v) => ({ ...r, x: v, w: r.x + r.w - v }) })
  if (dir.includes('e')) keys.push({ axis: 'x', get: r => r.x + r.w, set: (r, v) => ({ ...r, w: v - r.x }) })
  if (dir.includes('n')) keys.push({ axis: 'y', get: r => r.y, set: (r, v) => ({ ...r, y: v, h: r.y + r.h - v }) })
  if (dir.includes('s')) keys.push({ axis: 'y', get: r => r.y + r.h, set: (r, v) => ({ ...r, h: v - r.y }) })
  return keys
}

/**
 * 对矩形应用边缘吸附：每个轴最多吸附一条线（取该轴所有关键线中距离最近者），
 * 返回吸附后的矩形与吸附指引线（供画布渲染辅助线）。
 * @param rect - { x, y, w, h }。
 * @param keys - 参与吸附的关键线（MOVE_KEYS / resizeKeys(dir)）。
 * @param lines - 候选线（collectSnapLines）。
 * @param threshold - 吸附阈值。
 */
export function snapRect(rect, keys, lines, threshold = EDGE_THRESHOLD) {
  let next = rect
  const guides = []
  for (const axis of ['x', 'y']) {
    const axisKeys = keys.filter(key => key.axis === axis)
    let bestKey = null
    let bestLine = null
    let bestDist = Infinity
    for (const key of axisKeys) {
      const value = key.get(next)
      for (const line of lines) {
        if (line.axis !== axis) continue
        const distance = Math.abs(value - line.pos)
        if (distance <= threshold && distance < bestDist) {
          bestDist = distance
          bestKey = key
          bestLine = line
        }
      }
    }
    if (bestKey !== null && bestLine !== null) {
      next = bestKey.set(next, bestLine.pos)
      guides.push({ axis, pos: bestLine.pos, kind: bestLine.kind })
    }
  }
  return { rect: next, guides }
}
