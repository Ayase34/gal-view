/** GAL 视窗样式：全部作用域限定在 [data-gal-view] 之下，避免污染宿主。
 * 视觉基调：深色夜晚 + 半透明毛玻璃 + 紫蓝/靛青/暗红点缀 + 细边框 + 克制的发光。
 */

export const CSS = `
[data-gal-view] {
  --gv-bg: #0a0d1c;
  --gv-panel: rgba(16, 20, 38, .86);
  --gv-panel-2: rgba(24, 29, 52, .94);
  --gv-line: rgba(255, 255, 255, .09);
  --gv-line-strong: rgba(255, 255, 255, .17);
  --gv-text: #e6e9f4;
  --gv-text-dim: #98a1c2;
  --gv-accent: #8f7bff;
  --gv-accent-2: #4f8cff;
  --gv-accent-red: #e05a6b;
  --gv-glow: 0 0 0 1px rgba(143, 123, 255, .30), 0 0 16px rgba(143, 123, 255, .16);
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 60vh;
  overflow: hidden;
  background:
    radial-gradient(1200px 500px at 18% -10%, rgba(79, 140, 255, .07), transparent 60%),
    radial-gradient(900px 420px at 85% 110%, rgba(143, 123, 255, .08), transparent 60%),
    var(--gv-bg);
  color: var(--gv-text);
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", system-ui, sans-serif;
  user-select: none;
}
[data-gal-view] *, [data-gal-view] *::before, [data-gal-view] *::after { box-sizing: border-box; }
[data-gal-view] input, [data-gal-view] textarea, [data-gal-view] select { user-select: text; }

/* ---------- 填满会话区 ---------- */
/* 挂载时组件隐藏会话外壳的输入席并给根节点打上该标记：绝对定位占满整个会话主体。 */
[data-gal-view][data-gal-fills] {
  position: absolute;
  inset: 0;
  height: auto;
  min-height: 0;
  z-index: 5;
}

/* ---------- 顶部栏 ---------- */
.gv-topbar {
  flex: none;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 14px;
  border-bottom: 1px solid var(--gv-line);
  background: linear-gradient(180deg, rgba(20, 24, 44, .7), rgba(14, 17, 34, .35));
}
.gv-brand { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; letter-spacing: .12em; color: var(--gv-text); }
.gv-brand-mark {
  width: 10px; height: 10px; transform: rotate(45deg);
  background: linear-gradient(135deg, var(--gv-accent), var(--gv-accent-2));
  box-shadow: 0 0 10px rgba(143, 123, 255, .55);
}
.gv-mode-switch { display: flex; border: 1px solid var(--gv-line-strong); }
.gv-mode-btn {
  border: 0; background: transparent; color: var(--gv-text-dim);
  padding: 4px 16px; font-size: 12px; cursor: pointer;
  transition: color .15s ease, background .15s ease;
}
.gv-mode-btn + .gv-mode-btn { border-left: 1px solid var(--gv-line-strong); }
.gv-mode-btn:hover { color: var(--gv-text); background: rgba(255, 255, 255, .04); }
.gv-mode-btn.is-on { color: #fff; background: linear-gradient(180deg, rgba(143, 123, 255, .22), rgba(79, 140, 255, .14)); box-shadow: inset 0 -2px 0 var(--gv-accent); }
.gv-topbar-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
.gv-topbar-hint { font-size: 11px; color: var(--gv-text-dim); letter-spacing: .05em; }

/* ---------- 按钮 ---------- */
.gv-btn {
  border: 1px solid var(--gv-line-strong);
  background: rgba(255, 255, 255, .03);
  color: var(--gv-text);
  font-size: 12px;
  padding: 3px 12px;
  border-radius: 3px;
  cursor: pointer;
  transition: border-color .15s ease, background .15s ease, box-shadow .15s ease, color .15s ease;
}
.gv-btn:hover:not(:disabled) {
  border-color: rgba(143, 123, 255, .65);
  background: rgba(143, 123, 255, .10);
  box-shadow: 0 0 12px rgba(143, 123, 255, .22);
  color: #fff;
}
.gv-btn:disabled { opacity: .38; cursor: not-allowed; }
.gv-btn-accent {
  border-color: rgba(143, 123, 255, .55);
  background: linear-gradient(180deg, rgba(143, 123, 255, .20), rgba(79, 140, 255, .12));
}
.gv-btn-accent:hover:not(:disabled) { background: linear-gradient(180deg, rgba(143, 123, 255, .30), rgba(79, 140, 255, .18)); }
.gv-toggle.is-on {
  border-color: rgba(143, 123, 255, .7);
  background: rgba(143, 123, 255, .14);
  color: #fff;
  box-shadow: 0 0 10px rgba(143, 123, 255, .2);
}

/* ---------- 舞台 ---------- */
.gv-stage-area { flex: 1 1 auto; min-height: 0; display: flex; }
.gv-stage-wrap {
  flex: 1 1 auto; min-width: 0; min-height: 0;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; position: relative;
  background: radial-gradient(900px 460px at 50% 30%, rgba(30, 36, 70, .5), transparent 70%), #070912;
}
.gv-stage {
  position: relative;
  flex: none;
  transform-origin: 0 0;
  background: #0c1026;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, .06), 0 22px 60px rgba(0, 0, 0, .55);
}
.gv-grid {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background-image:
    linear-gradient(rgba(143, 123, 255, .10) 1px, transparent 1px),
    linear-gradient(90deg, rgba(143, 123, 255, .10) 1px, transparent 1px);
}
/* 边缘吸附指引线（手势期间显示）。 */
.gv-guide {
  position: absolute; z-index: 9998; pointer-events: none;
  background: var(--gv-accent-2);
  box-shadow: 0 0 6px rgba(79, 140, 255, .85);
}
.gv-guide-x { top: 0; bottom: 0; width: 1px; }
.gv-guide-y { left: 0; right: 0; height: 1px; }

/* ---------- 元素 ---------- */
.gv-el { position: absolute; border-style: solid; pointer-events: none; overflow: visible; }
.gv-stage.is-editor .gv-el.is-pickable { pointer-events: auto; cursor: move; }
/* 透明功能按钮：游戏模式可点击（元素级交互，无悬停高亮）。 */
[data-gal-mode='game'] .gv-el-action-button { pointer-events: auto; cursor: pointer; }
.gv-el-action-button.is-on { border-color: var(--gv-accent); background: rgba(143, 123, 255, .14); color: #fff; }
.gv-stage.is-editor .gv-el.is-pickable:hover { outline: 1px solid rgba(143, 123, 255, .55); outline-offset: 1px; }
.gv-el.is-locked { cursor: not-allowed; }

/* 背景占位 */
.gv-elbg { position: absolute; inset: 0; display: flex; align-items: center; justify-content: inherit; overflow: hidden; }
.gv-elbg-label {
  font-size: inherit; letter-spacing: .5em; text-indent: .5em; opacity: .4; color: inherit;
  text-shadow: 0 1px 12px rgba(0, 0, 0, .5);
}
.gv-elbg-corners {
  position: absolute; inset: 10px; border: 1px solid rgba(255, 255, 255, .07);
}
.gv-elbg-corners::before, .gv-elbg-corners::after {
  content: ''; position: absolute; width: 18px; height: 18px;
}
.gv-elbg-corners::before { top: -1px; left: -1px; border-top: 2px solid rgba(255, 255, 255, .22); border-left: 2px solid rgba(255, 255, 255, .22); }
.gv-elbg-corners::after { bottom: -1px; right: -1px; border-bottom: 2px solid rgba(255, 255, 255, .22); border-right: 2px solid rgba(255, 255, 255, .22); }

/* 角色占位立绘 */
.gv-char { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; }
.gv-el-character .gv-char { animation: gv-float 4.6s ease-in-out infinite; }
.gv-char-svg { width: 100%; height: calc(100% - 30px); filter: drop-shadow(0 10px 22px rgba(0, 0, 0, .5)); }
/* 真实立绘：底部对齐、等比缩放（保持透明 PNG 的轮廓与站位一致）。 */
.gv-char-img { width: 100%; height: calc(100% - 30px); object-fit: contain; object-position: bottom center; filter: drop-shadow(0 10px 22px rgba(0, 0, 0, .5)); }
.gv-char.is-speaking .gv-char-svg {
  filter: drop-shadow(0 0 10px currentColor) drop-shadow(0 10px 22px rgba(0, 0, 0, .5));
  color: var(--gv-speak-color, #9b8cff);
}
.gv-char-plate {
  margin-top: 6px; display: flex; flex-direction: column; align-items: center; gap: 1px;
  padding: 3px 12px;
  background: rgba(12, 15, 30, .78);
  border: 1px solid var(--gv-line-strong);
  border-radius: 2px;
}
.gv-char-label { font-size: 10px; letter-spacing: .28em; color: var(--gv-text-dim); }
.gv-char-name { font-size: 12px; font-weight: 600; }

/* 编辑器里的对话框静态样式 */
.gv-elbox { position: absolute; inset: 0; display: flex; flex-direction: column; padding: 14px 18px 12px 30px; overflow: hidden; }
.gv-elbox-name {
  position: absolute; top: -18px; left: 8px;
  padding: 1px 14px; font-size: 13px; font-weight: 600; letter-spacing: .1em;
  background: rgba(14, 17, 34, .92); border-left: 3px solid currentColor;
}
.gv-elbox-text { font-size: inherit; line-height: 1.7; color: inherit; margin-top: auto; }

/* 文本/形状/按钮/装饰 */
.gv-eltext { position: absolute; inset: 0; display: flex; align-items: center; justify-content: inherit; padding: 6px; overflow: hidden; word-break: break-word; }
.gv-elbtn { position: absolute; inset: 0; display: flex; align-items: center; justify-content: inherit; overflow: hidden; letter-spacing: .12em; }
.gv-elshape { position: absolute; inset: 0; display: flex; align-items: center; justify-content: inherit; overflow: hidden; letter-spacing: .18em; }
.gv-eldeco {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: inherit; overflow: hidden;
  background-image: repeating-linear-gradient(45deg, transparent 0 7px, rgba(255, 255, 255, .05) 7px 8px);
  border-style: dashed !important;
}
.gv-eldeco-label { font-size: inherit; letter-spacing: .22em; color: inherit; opacity: .85; }

/* ---------- 游戏对话框 ----------
 * 不启用 backdrop-filter：毛玻璃会把背后立绘 PNG 的透明区域复合成实心模糊块，
 * 破坏「透明度 → 看到清晰立绘」的预期。透明只走标准 alpha 混合（元素 opacity + 半透明背景）。 */
.gv-dialogue {
  position: absolute; pointer-events: auto; cursor: pointer;
  border-style: solid;
  transition: box-shadow .2s ease, border-color .2s ease;
}
/* 游戏模式对话区不渲染任何悬停/聚焦高亮（点击跳过打字无需视觉反馈边框）。 */
.gv-dialogue:focus, .gv-dtext:focus { outline: none; }
/* 独立「说话人」元素：文本框类型（默认纯文本外观，可自行加背景/边框），
 * 游戏模式动态显示当前台词行的说话人（你/DeepSeek/隐藏）。 */
.gv-sname {
  position: absolute; border-style: solid;
  display: flex; align-items: center; justify-content: inherit; overflow: hidden;
  padding: 2px 6px; white-space: nowrap;
  letter-spacing: .14em; font-weight: 700;
}
.gv-el > .gv-sname { inset: 0; }
.gv-dialogue-body {
  position: absolute; inset: 10px 18px 8px 18px;
  overflow-y: auto; scrollbar-width: thin;
  font-size: inherit; line-height: 1.8; letter-spacing: .02em;
  white-space: pre-wrap; word-break: break-word; color: inherit;
}
.gv-dialogue-caret {
  display: inline-block; width: 2px; height: 1.05em; margin-left: 3px;
  background: var(--gv-accent-2); vertical-align: text-bottom;
  animation: gv-blink 1s steps(2, start) infinite;
}
/* 独立「台词」元素：实时对话文本渲染进它，位置/尺寸/字号/颜色随元素属性。
 * 完全透明（无背景/无悬停描边/无滚动条视觉），避免边缘黑框。 */
.gv-dtext {
  position: absolute; pointer-events: auto; cursor: pointer;
  overflow: hidden; scrollbar-width: none;
  padding: 2px 10px;
  line-height: 1.8; letter-spacing: .02em;
  white-space: pre-wrap; word-break: break-word;
  border-style: solid;
}
.gv-dtext::-webkit-scrollbar { display: none; }
/* 页尾省略号：紧贴文本（负边距抵消 letter-spacing 间隙）。 */
.gv-dtext-ellipsis {
  letter-spacing: 0;
  margin-left: -0.02em;
  opacity: .85;
}
/* Galgame 翻页提示（还有下一页时显示在文本框右下角）。 */
.gv-dtext-more {
  position: absolute; right: 8px; bottom: 2px;
  font-size: .7em; color: var(--gv-accent);
  animation: gv-pulse 1.4s ease-in-out infinite;
}
/* AI 状态行（思考中…/使用工具中…）：与对话文本同字号、次级色、轻微呼吸。 */
.gv-dtext-status {
  color: var(--gv-text-dim);
  letter-spacing: .04em;
  animation: gv-pulse 1.6s ease-in-out infinite;
}

/* ---------- 输入 ----------
 * 游戏模式底部仅剩输入区（84px，固定高度）；控制功能已迁入场景内「透明按钮」元素。
 * 编辑模式用「工具栏 40px + 占位条 44px」对齐这里的 84px，
 * 保证两种模式的舞台槽位尺寸严格一致 → WYSIWYG。 */
.gv-input { flex: none; height: 84px; display: flex; gap: 10px; align-items: stretch; padding: 8px 16px 10px; }
.gv-input-box {
  flex: 1 1 auto; resize: none;
  background: rgba(10, 13, 28, .72);
  border: 1px solid var(--gv-line-strong);
  border-radius: 4px;
  color: var(--gv-text);
  font-family: inherit; font-size: 14px; line-height: 1.6;
  padding: 8px 12px;
  outline: none;
  transition: border-color .15s ease, box-shadow .15s ease;
}
.gv-input-box:focus { border-color: rgba(143, 123, 255, .6); box-shadow: 0 0 0 1px rgba(143, 123, 255, .25), 0 0 16px rgba(143, 123, 255, .12); }
.gv-input-box::placeholder { color: var(--gv-text-dim); }
.gv-send { align-self: stretch; min-width: 84px; }

/* ---------- 历史面板 ---------- */
.gv-history {
  position: absolute; top: 0; right: 0; bottom: 0; z-index: 80;
  width: min(400px, 92%);
  display: flex; flex-direction: column;
  background: rgba(13, 16, 32, .94);
  border-left: 1px solid rgba(143, 123, 255, .3);
  box-shadow: -18px 0 44px rgba(0, 0, 0, .5);
  backdrop-filter: blur(10px);
  animation: gv-slide-in .24s cubic-bezier(.16, 1, .3, 1);
}
.gv-history-head {
  flex: none; display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid var(--gv-line-strong);
  font-size: 13px; font-weight: 600; letter-spacing: .2em;
}
.gv-history-list { flex: 1; overflow-y: auto; padding: 6px 14px 14px; }
.gv-history-row { padding: 9px 0; border-bottom: 1px solid var(--gv-line); }
.gv-history-name { font-size: 12px; font-weight: 700; letter-spacing: .1em; }
.gv-history-text { margin: 3px 0 0; font-size: 13px; line-height: 1.7; color: var(--gv-text); white-space: pre-wrap; word-break: break-word; }
.gv-history-empty { padding: 24px 0; text-align: center; color: var(--gv-text-dim); font-size: 13px; }

/* ---------- 设置浮层 ---------- */
.gv-settings {
  position: absolute; right: 16px; bottom: 92px; z-index: 80;
  width: 300px;
  background: var(--gv-panel-2);
  border: 1px solid var(--gv-line-strong);
  box-shadow: 0 18px 44px rgba(0, 0, 0, .5), var(--gv-glow);
  backdrop-filter: blur(10px);
  padding: 12px 14px;
  animation: gv-rise .18s cubic-bezier(.16, 1, .3, 1);
}
.gv-settings-head {
  display: flex; align-items: center; justify-content: space-between;
  padding-bottom: 8px; margin-bottom: 6px;
  border-bottom: 1px solid var(--gv-line-strong);
  font-size: 13px; font-weight: 600; letter-spacing: .2em;
}
.gv-settings-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 5px 0; font-size: 12px; color: var(--gv-text-dim); }
.gv-settings-row input[type="text"], .gv-settings-row select {
  width: 170px;
  background: rgba(10, 13, 28, .7);
  border: 1px solid var(--gv-line-strong);
  color: var(--gv-text);
  font-size: 12px; padding: 3px 8px; border-radius: 3px; outline: none;
}
.gv-settings-row input:focus, .gv-settings-row select:focus { border-color: rgba(143, 123, 255, .6); }
.gv-settings-hint { margin: 8px 0 0; font-size: 11px; color: var(--gv-text-dim); line-height: 1.6; }

/* ---------- 编辑模式 ----------
 * 舞台槽位与游戏模式同尺寸：工具栏 40px 对齐游戏控制条，底部占位条 84px 对齐输入区；
 * 侧栏悬浮在舞台之上（不挤压舞台），隐藏侧栏时舞台尺寸不变。 */
.gv-editor { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; }
.gv-editor-toolbar {
  flex: none; height: 40px; display: flex; flex-wrap: nowrap; align-items: center; gap: 8px;
  overflow-x: auto; overflow-y: hidden; scrollbar-width: none;
  padding: 0 12px;
  border-bottom: 1px solid var(--gv-line);
  background: linear-gradient(180deg, rgba(20, 24, 44, .7), rgba(14, 17, 34, .4));
}
.gv-editor-toolbar::-webkit-scrollbar { height: 0; }
.gv-editor-spacer { flex: none; height: 44px; }
.gv-toolbar-group { display: flex; gap: 4px; align-items: center; }
.gv-toolbar-group + .gv-toolbar-group { border-left: 1px solid var(--gv-line-strong); padding-left: 8px; }
.gv-toolbar-right { margin-left: auto; border-left: 0 !important; }
/* 添加菜单挂在编辑根节点（锚点由 JS 按按钮位置计算），避免被工具栏 overflow 裁剪。 */
.gv-add-menu {
  position: absolute; left: 0; top: 0; z-index: 90;
  min-width: 132px;
  background: var(--gv-panel-2);
  border: 1px solid var(--gv-line-strong);
  box-shadow: 0 14px 36px rgba(0, 0, 0, .5);
  padding: 4px;
  animation: gv-rise .16s cubic-bezier(.16, 1, .3, 1);
}
.gv-add-menu button {
  display: flex; align-items: center; gap: 8px; width: 100%;
  background: transparent; border: 0; color: var(--gv-text);
  font-size: 12px; padding: 5px 8px; cursor: pointer; text-align: left;
}
.gv-add-menu button:hover { background: rgba(143, 123, 255, .14); color: #fff; }

.gv-editor-body { flex: 1 1 auto; min-height: 0; position: relative; }
/* 侧栏悬浮于舞台之上：不挤压舞台，保证编辑所见即游戏所得。 */
.gv-editor-side {
  position: absolute; top: 0; bottom: 0; z-index: 20;
  display: flex; flex-direction: column; overflow: hidden;
  background: rgba(13, 16, 32, .84);
  backdrop-filter: blur(8px) saturate(1.1);
  box-shadow: 0 0 28px rgba(0, 0, 0, .38);
  transition: width .18s cubic-bezier(.16, 1, .3, 1), visibility 0s linear .18s;
}
.gv-editor-tree { left: 0; width: 216px; border-right: 1px solid var(--gv-line-strong); }
.gv-editor-props { right: 0; width: 264px; border-left: 1px solid var(--gv-line-strong); overflow-y: auto; }
/* 边栏隐藏：宽度收拢到 0（保留挂载，状态与动画不丢）。 */
.gv-editor-side.is-collapsed { width: 0 !important; border-left: 0; border-right: 0; visibility: hidden; }
.gv-editor-canvas { position: absolute; inset: 0; display: flex; }
.gv-editor-canvas .gv-stage-wrap { background: radial-gradient(900px 460px at 50% 30%, rgba(30, 36, 70, .5), transparent 70%), #070912; }

/* 元素树 */
.gv-tree { display: flex; flex-direction: column; min-height: 0; }
.gv-tree-root {
  flex: none; display: flex; align-items: center; gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--gv-line-strong);
  font-size: 12px; font-weight: 700; letter-spacing: .16em;
}
.gv-tree-count { margin-left: auto; font-size: 10px; font-weight: 400; color: var(--gv-text-dim); letter-spacing: 0; }
.gv-tree-list { flex: 1 1 auto; overflow-y: auto; padding: 4px; }
.gv-tree-row {
  display: flex; align-items: center; gap: 7px;
  padding: 4px 8px; margin: 1px 0;
  font-size: 12px; color: var(--gv-text);
  cursor: pointer; border: 1px solid transparent;
  transition: background .12s ease, border-color .12s ease;
}
.gv-tree-row:hover { background: rgba(255, 255, 255, .05); }
.gv-tree-row.is-selected { background: rgba(143, 123, 255, .14); border-color: rgba(143, 123, 255, .45); }
.gv-tree-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.gv-tree-toggle {
  flex: none; border: 1px solid var(--gv-line-strong); background: transparent;
  color: var(--gv-text-dim); font-size: 10px; width: 18px; height: 18px;
  border-radius: 2px; cursor: pointer; line-height: 1; padding: 0;
}
.gv-tree-toggle:hover { color: #fff; border-color: rgba(143, 123, 255, .6); }
.gv-tree-toggle.is-on { color: #fff; background: rgba(143, 123, 255, .22); border-color: rgba(143, 123, 255, .6); }
.gv-tree-toggle.is-off { opacity: .35; }
.gv-tree-scene { flex: none; border-top: 1px solid var(--gv-line-strong); padding: 8px 12px 12px; }

/* 类型记号（纯 CSS 图形） */
.gv-glyph { flex: none; width: 10px; height: 10px; display: inline-block; }
.gv-glyph-scene { border: 1px solid var(--gv-text-dim); box-shadow: inset 0 0 0 2px var(--gv-panel-2), inset 0 0 0 3px var(--gv-text-dim); }
.gv-glyph-background { background: linear-gradient(135deg, var(--gv-accent-2), var(--gv-accent)); opacity: .9; }
.gv-glyph-character { border: 1px solid var(--gv-accent); border-radius: 50% 50% 40% 40%; height: 11px; }
.gv-glyph-dialogue { border: 1px solid var(--gv-accent-2); border-radius: 2px; }
.gv-glyph-dialogue-text { border: 1px solid var(--gv-accent-2); border-radius: 2px; box-shadow: inset 0 -4px 0 rgba(79, 140, 255, .55); }
.gv-glyph-speaker-name { border: 1px solid var(--gv-accent); border-left-width: 3px; border-radius: 2px; }
.gv-glyph-text { background: linear-gradient(90deg, var(--gv-text-dim) 0 70%, transparent 70%); }
.gv-glyph-button { border: 1px solid var(--gv-accent-2); border-radius: 5px; }
.gv-glyph-rect { border: 1px solid var(--gv-text-dim); }
.gv-glyph-circle { border: 1px solid var(--gv-accent-red); border-radius: 50%; }
.gv-glyph-decoration { border: 1px dashed var(--gv-text-dim); transform: rotate(45deg) scale(.85); }

/* 属性面板 */
.gv-props { padding: 10px 12px 16px; }
.gv-props-head {
  display: flex; align-items: baseline; gap: 8px;
  padding: 2px 0 8px; margin-bottom: 6px;
  border-bottom: 1px solid var(--gv-line-strong);
}
.gv-props-type {
  flex: none; font-size: 10px; letter-spacing: .2em; color: var(--gv-accent);
  border: 1px solid rgba(143, 123, 255, .5); padding: 0 6px; border-radius: 2px;
}
.gv-props-title { font-size: 13px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.gv-props-sec {
  margin: 10px 0 4px; padding-bottom: 2px;
  font-size: 10px; letter-spacing: .28em; color: var(--gv-text-dim);
  border-bottom: 1px solid var(--gv-line);
}
.gv-prop-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 3px 0; }
.gv-prop-label { flex: none; font-size: 11px; color: var(--gv-text-dim); min-width: 58px; }
.gv-prop-input {
  width: 108px;
  background: rgba(10, 13, 28, .7);
  border: 1px solid var(--gv-line-strong);
  color: var(--gv-text);
  font-size: 12px; padding: 2px 7px; border-radius: 3px; outline: none;
  font-variant-numeric: tabular-nums;
}
.gv-prop-input:focus { border-color: rgba(143, 123, 255, .6); box-shadow: 0 0 8px rgba(143, 123, 255, .15); }
.gv-prop-row input[type="checkbox"] { accent-color: var(--gv-accent); }
.gv-prop-actions { display: flex; gap: 6px; padding: 4px 0; flex-wrap: wrap; }
.gv-prop-actions .gv-btn { font-size: 11px; padding: 2px 8px; }
.gv-prop-color { display: flex; align-items: center; gap: 6px; width: 108px; }
.gv-prop-color input[type="color"] {
  flex: none; width: 30px; height: 22px; padding: 0; border: 1px solid var(--gv-line-strong);
  background: transparent; border-radius: 3px; cursor: pointer;
}
.gv-prop-color-value { flex: 1; font-size: 10px; color: var(--gv-text-dim); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-variant-numeric: tabular-nums; }
.gv-props-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 40px 16px; color: var(--gv-text-dim); text-align: center; }
.gv-props-empty p { margin: 0; font-size: 12px; }
.gv-props-empty-hint { font-size: 11px !important; line-height: 1.7; opacity: .8; }
.gv-props-empty-mark {
  width: 40px; height: 40px; border: 1px dashed rgba(143, 123, 255, .5);
  transform: rotate(45deg);
}

/* 选中框与手柄 */
.gv-sel {
  position: absolute; z-index: 9999; pointer-events: none;
  border: 1px solid var(--gv-accent);
  box-shadow: 0 0 0 1px rgba(143, 123, 255, .25), 0 0 18px rgba(143, 123, 255, .28);
}
.gv-sel-label {
  position: absolute; top: -20px; left: -1px;
  font-size: 10px; letter-spacing: .1em; color: #fff;
  background: rgba(120, 105, 240, .92);
  padding: 1px 8px; white-space: nowrap;
}
.gv-sel-handle {
  position: absolute; width: 10px; height: 10px;
  background: #0a0d1c; border: 1.5px solid var(--gv-accent);
  pointer-events: auto;
}
.gv-sel-handle:hover { background: var(--gv-accent); box-shadow: 0 0 8px rgba(143, 123, 255, .6); }
.gv-sel-rotate {
  position: absolute; top: -40px; left: calc(50% - 5px);
  width: 10px; height: 10px; border-radius: 50%;
  background: #0a0d1c; border: 1.5px solid var(--gv-accent-2);
  pointer-events: auto; cursor: grab;
}
.gv-sel-rotate::before {
  content: ''; position: absolute; left: 50%; top: 10px;
  width: 1px; height: 28px; background: rgba(79, 140, 255, .5);
  transform: translateX(-50%);
}
.gv-sel-rotate:hover { background: var(--gv-accent-2); }

/* ---------- 动画 ---------- */
@keyframes gv-blink { 50% { opacity: 0; } }
@keyframes gv-pulse { 0%, 100% { opacity: .4; } 50% { opacity: 1; } }
@keyframes gv-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes gv-slide-in { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes gv-rise { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

/* ---------- 设置选项卡（渲染在设置面板内，GAL 根节点之外 → 无作用域） ---------- */
.gvsv-tab {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px 16px;
  font-family: inherit;
}
.gvsv-head { display: flex; flex-direction: column; gap: 4px; }
.gvsv-title { font-size: 15px; font-weight: 700; letter-spacing: .08em; }
.gvsv-desc { font-size: 12px; opacity: .7; line-height: 1.7; }
.gvsv-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, .14);
  border-radius: 4px;
}
.gvsv-label { font-size: 13px; font-weight: 600; }
.gvsv-hint { flex: 1; font-size: 11px; opacity: .6; line-height: 1.6; }
.gvsv-row input[type="checkbox"] { accent-color: #8f7bff; width: 16px; height: 16px; }

@media (prefers-reduced-motion: reduce) {
  [data-gal-view] .gv-el-character .gv-char { animation: none; }
  [data-gal-view] .gv-dialogue-caret, [data-gal-view] .gv-dialogue-wait { animation: none; }
}
`
