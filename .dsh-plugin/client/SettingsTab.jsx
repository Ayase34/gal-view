/** GAL 视窗设置选项卡（设置 → 插件 → GAL 视窗）：启用/停用开关。
 * 渲染在设置面板内（GAL 根节点之外），使用独立前缀样式。 */

import React from 'react'

export function GalViewSettingsTab({ useEnabled, setEnabled }) {
  const enabled = useEnabled(v => v)
  return (
    <div className="gvsv-tab">
      <div className="gvsv-head">
        <span className="gvsv-title">GAL 视窗</span>
        <span className="gvsv-desc">会话标签页中的 Galgame 风格对话视图（对话 / GAL视窗 / 轨迹）。</span>
      </div>
      <label className="gvsv-row">
        <span className="gvsv-label">启用 GAL 视窗</span>
        <span className="gvsv-hint">关闭后隐藏会话页的「GAL视窗」标签；场景与设置保留，重新开启即恢复。</span>
        <input
          type="checkbox"
          checked={enabled}
          onChange={e => setEnabled(e.target.checked)}
          aria-label="启用 GAL 视窗"
        />
      </label>
    </div>
  )
}
