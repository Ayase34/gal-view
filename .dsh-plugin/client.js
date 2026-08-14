window.__ModuleLoader__.load({
	id: "gal-view",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// .dsh-plugin/client/index.mjs
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(index_exports);

// .dsh-plugin/client/styles.mjs
var CSS = `
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

/* ---------- \u586B\u6EE1\u4F1A\u8BDD\u533A ---------- */
/* \u6302\u8F7D\u65F6\u7EC4\u4EF6\u9690\u85CF\u4F1A\u8BDD\u5916\u58F3\u7684\u8F93\u5165\u5E2D\u5E76\u7ED9\u6839\u8282\u70B9\u6253\u4E0A\u8BE5\u6807\u8BB0\uFF1A\u7EDD\u5BF9\u5B9A\u4F4D\u5360\u6EE1\u6574\u4E2A\u4F1A\u8BDD\u4E3B\u4F53\u3002 */
[data-gal-view][data-gal-fills] {
  position: absolute;
  inset: 0;
  height: auto;
  min-height: 0;
  z-index: 5;
}

/* ---------- \u9876\u90E8\u680F ---------- */
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

/* ---------- \u6309\u94AE ---------- */
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

/* ---------- \u821E\u53F0 ---------- */
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
/* \u8FB9\u7F18\u5438\u9644\u6307\u5F15\u7EBF\uFF08\u624B\u52BF\u671F\u95F4\u663E\u793A\uFF09\u3002 */
.gv-guide {
  position: absolute; z-index: 9998; pointer-events: none;
  background: var(--gv-accent-2);
  box-shadow: 0 0 6px rgba(79, 140, 255, .85);
}
.gv-guide-x { top: 0; bottom: 0; width: 1px; }
.gv-guide-y { left: 0; right: 0; height: 1px; }

/* ---------- \u5143\u7D20 ---------- */
.gv-el { position: absolute; border-style: solid; pointer-events: none; overflow: visible; }
.gv-stage.is-editor .gv-el.is-pickable { pointer-events: auto; cursor: move; }
/* \u900F\u660E\u529F\u80FD\u6309\u94AE\uFF1A\u6E38\u620F\u6A21\u5F0F\u53EF\u70B9\u51FB\uFF08\u5143\u7D20\u7EA7\u4EA4\u4E92\uFF0C\u65E0\u60AC\u505C\u9AD8\u4EAE\uFF09\u3002 */
[data-gal-mode='game'] .gv-el-action-button { pointer-events: auto; cursor: pointer; }
.gv-el-action-button.is-on { border-color: var(--gv-accent); background: rgba(143, 123, 255, .14); color: #fff; }
.gv-stage.is-editor .gv-el.is-pickable:hover { outline: 1px solid rgba(143, 123, 255, .55); outline-offset: 1px; }
.gv-el.is-locked { cursor: not-allowed; }

/* \u80CC\u666F\u5360\u4F4D */
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

/* \u89D2\u8272\u5360\u4F4D\u7ACB\u7ED8 */
.gv-char { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; }
.gv-el-character .gv-char { animation: gv-float 4.6s ease-in-out infinite; }
.gv-char-svg { width: 100%; height: calc(100% - 30px); filter: drop-shadow(0 10px 22px rgba(0, 0, 0, .5)); }
/* \u771F\u5B9E\u7ACB\u7ED8\uFF1A\u5E95\u90E8\u5BF9\u9F50\u3001\u7B49\u6BD4\u7F29\u653E\uFF08\u4FDD\u6301\u900F\u660E PNG \u7684\u8F6E\u5ED3\u4E0E\u7AD9\u4F4D\u4E00\u81F4\uFF09\u3002 */
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

/* \u7F16\u8F91\u5668\u91CC\u7684\u5BF9\u8BDD\u6846\u9759\u6001\u6837\u5F0F */
.gv-elbox { position: absolute; inset: 0; display: flex; flex-direction: column; padding: 14px 18px 12px 30px; overflow: hidden; }
.gv-elbox-name {
  position: absolute; top: -18px; left: 8px;
  padding: 1px 14px; font-size: 13px; font-weight: 600; letter-spacing: .1em;
  background: rgba(14, 17, 34, .92); border-left: 3px solid currentColor;
}
.gv-elbox-text { font-size: inherit; line-height: 1.7; color: inherit; margin-top: auto; }

/* \u6587\u672C/\u5F62\u72B6/\u6309\u94AE/\u88C5\u9970 */
.gv-eltext { position: absolute; inset: 0; display: flex; align-items: center; justify-content: inherit; padding: 6px; overflow: hidden; word-break: break-word; }
.gv-elbtn { position: absolute; inset: 0; display: flex; align-items: center; justify-content: inherit; overflow: hidden; letter-spacing: .12em; }
.gv-elshape { position: absolute; inset: 0; display: flex; align-items: center; justify-content: inherit; overflow: hidden; letter-spacing: .18em; }
.gv-eldeco {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: inherit; overflow: hidden;
  background-image: repeating-linear-gradient(45deg, transparent 0 7px, rgba(255, 255, 255, .05) 7px 8px);
  border-style: dashed !important;
}
.gv-eldeco-label { font-size: inherit; letter-spacing: .22em; color: inherit; opacity: .85; }

/* ---------- \u6E38\u620F\u5BF9\u8BDD\u6846 ----------
 * \u4E0D\u542F\u7528 backdrop-filter\uFF1A\u6BDB\u73BB\u7483\u4F1A\u628A\u80CC\u540E\u7ACB\u7ED8 PNG \u7684\u900F\u660E\u533A\u57DF\u590D\u5408\u6210\u5B9E\u5FC3\u6A21\u7CCA\u5757\uFF0C
 * \u7834\u574F\u300C\u900F\u660E\u5EA6 \u2192 \u770B\u5230\u6E05\u6670\u7ACB\u7ED8\u300D\u7684\u9884\u671F\u3002\u900F\u660E\u53EA\u8D70\u6807\u51C6 alpha \u6DF7\u5408\uFF08\u5143\u7D20 opacity + \u534A\u900F\u660E\u80CC\u666F\uFF09\u3002 */
.gv-dialogue {
  position: absolute; pointer-events: auto; cursor: pointer;
  border-style: solid;
  transition: box-shadow .2s ease, border-color .2s ease;
}
/* \u6E38\u620F\u6A21\u5F0F\u5BF9\u8BDD\u533A\u4E0D\u6E32\u67D3\u4EFB\u4F55\u60AC\u505C/\u805A\u7126\u9AD8\u4EAE\uFF08\u70B9\u51FB\u8DF3\u8FC7\u6253\u5B57\u65E0\u9700\u89C6\u89C9\u53CD\u9988\u8FB9\u6846\uFF09\u3002 */
.gv-dialogue:focus, .gv-dtext:focus { outline: none; }
/* \u72EC\u7ACB\u300C\u8BF4\u8BDD\u4EBA\u300D\u5143\u7D20\uFF1A\u6587\u672C\u6846\u7C7B\u578B\uFF08\u9ED8\u8BA4\u7EAF\u6587\u672C\u5916\u89C2\uFF0C\u53EF\u81EA\u884C\u52A0\u80CC\u666F/\u8FB9\u6846\uFF09\uFF0C
 * \u6E38\u620F\u6A21\u5F0F\u52A8\u6001\u663E\u793A\u5F53\u524D\u53F0\u8BCD\u884C\u7684\u8BF4\u8BDD\u4EBA\uFF08\u4F60/DeepSeek/\u9690\u85CF\uFF09\u3002 */
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
/* \u72EC\u7ACB\u300C\u53F0\u8BCD\u300D\u5143\u7D20\uFF1A\u5B9E\u65F6\u5BF9\u8BDD\u6587\u672C\u6E32\u67D3\u8FDB\u5B83\uFF0C\u4F4D\u7F6E/\u5C3A\u5BF8/\u5B57\u53F7/\u989C\u8272\u968F\u5143\u7D20\u5C5E\u6027\u3002
 * \u5B8C\u5168\u900F\u660E\uFF08\u65E0\u80CC\u666F/\u65E0\u60AC\u505C\u63CF\u8FB9/\u65E0\u6EDA\u52A8\u6761\u89C6\u89C9\uFF09\uFF0C\u907F\u514D\u8FB9\u7F18\u9ED1\u6846\u3002 */
.gv-dtext {
  position: absolute; pointer-events: auto; cursor: pointer;
  overflow: hidden; scrollbar-width: none;
  padding: 2px 10px;
  line-height: 1.8; letter-spacing: .02em;
  white-space: pre-wrap; word-break: break-word;
  border-style: solid;
}
.gv-dtext::-webkit-scrollbar { display: none; }
/* \u9875\u5C3E\u7701\u7565\u53F7\uFF1A\u7D27\u8D34\u6587\u672C\uFF08\u8D1F\u8FB9\u8DDD\u62B5\u6D88 letter-spacing \u95F4\u9699\uFF09\u3002 */
.gv-dtext-ellipsis {
  letter-spacing: 0;
  margin-left: -0.02em;
  opacity: .85;
}
/* Galgame \u7FFB\u9875\u63D0\u793A\uFF08\u8FD8\u6709\u4E0B\u4E00\u9875\u65F6\u663E\u793A\u5728\u6587\u672C\u6846\u53F3\u4E0B\u89D2\uFF09\u3002 */
.gv-dtext-more {
  position: absolute; right: 8px; bottom: 2px;
  font-size: .7em; color: var(--gv-accent);
  animation: gv-pulse 1.4s ease-in-out infinite;
}
/* AI \u72B6\u6001\u884C\uFF08\u601D\u8003\u4E2D\u2026/\u4F7F\u7528\u5DE5\u5177\u4E2D\u2026\uFF09\uFF1A\u4E0E\u5BF9\u8BDD\u6587\u672C\u540C\u5B57\u53F7\u3001\u6B21\u7EA7\u8272\u3001\u8F7B\u5FAE\u547C\u5438\u3002 */
.gv-dtext-status {
  color: var(--gv-text-dim);
  letter-spacing: .04em;
  animation: gv-pulse 1.6s ease-in-out infinite;
}

/* ---------- \u8F93\u5165 ----------
 * \u6E38\u620F\u6A21\u5F0F\u5E95\u90E8\u4EC5\u5269\u8F93\u5165\u533A\uFF0884px\uFF0C\u56FA\u5B9A\u9AD8\u5EA6\uFF09\uFF1B\u63A7\u5236\u529F\u80FD\u5DF2\u8FC1\u5165\u573A\u666F\u5185\u300C\u900F\u660E\u6309\u94AE\u300D\u5143\u7D20\u3002
 * \u7F16\u8F91\u6A21\u5F0F\u7528\u300C\u5DE5\u5177\u680F 40px + \u5360\u4F4D\u6761 44px\u300D\u5BF9\u9F50\u8FD9\u91CC\u7684 84px\uFF0C
 * \u4FDD\u8BC1\u4E24\u79CD\u6A21\u5F0F\u7684\u821E\u53F0\u69FD\u4F4D\u5C3A\u5BF8\u4E25\u683C\u4E00\u81F4 \u2192 WYSIWYG\u3002 */
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

/* ---------- \u5386\u53F2\u9762\u677F ---------- */
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

/* ---------- \u8BBE\u7F6E\u6D6E\u5C42 ---------- */
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

/* ---------- \u7F16\u8F91\u6A21\u5F0F ----------
 * \u821E\u53F0\u69FD\u4F4D\u4E0E\u6E38\u620F\u6A21\u5F0F\u540C\u5C3A\u5BF8\uFF1A\u5DE5\u5177\u680F 40px \u5BF9\u9F50\u6E38\u620F\u63A7\u5236\u6761\uFF0C\u5E95\u90E8\u5360\u4F4D\u6761 84px \u5BF9\u9F50\u8F93\u5165\u533A\uFF1B
 * \u4FA7\u680F\u60AC\u6D6E\u5728\u821E\u53F0\u4E4B\u4E0A\uFF08\u4E0D\u6324\u538B\u821E\u53F0\uFF09\uFF0C\u9690\u85CF\u4FA7\u680F\u65F6\u821E\u53F0\u5C3A\u5BF8\u4E0D\u53D8\u3002 */
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
/* \u6DFB\u52A0\u83DC\u5355\u6302\u5728\u7F16\u8F91\u6839\u8282\u70B9\uFF08\u951A\u70B9\u7531 JS \u6309\u6309\u94AE\u4F4D\u7F6E\u8BA1\u7B97\uFF09\uFF0C\u907F\u514D\u88AB\u5DE5\u5177\u680F overflow \u88C1\u526A\u3002 */
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
/* \u4FA7\u680F\u60AC\u6D6E\u4E8E\u821E\u53F0\u4E4B\u4E0A\uFF1A\u4E0D\u6324\u538B\u821E\u53F0\uFF0C\u4FDD\u8BC1\u7F16\u8F91\u6240\u89C1\u5373\u6E38\u620F\u6240\u5F97\u3002 */
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
/* \u8FB9\u680F\u9690\u85CF\uFF1A\u5BBD\u5EA6\u6536\u62E2\u5230 0\uFF08\u4FDD\u7559\u6302\u8F7D\uFF0C\u72B6\u6001\u4E0E\u52A8\u753B\u4E0D\u4E22\uFF09\u3002 */
.gv-editor-side.is-collapsed { width: 0 !important; border-left: 0; border-right: 0; visibility: hidden; }
.gv-editor-canvas { position: absolute; inset: 0; display: flex; }
.gv-editor-canvas .gv-stage-wrap { background: radial-gradient(900px 460px at 50% 30%, rgba(30, 36, 70, .5), transparent 70%), #070912; }

/* \u5143\u7D20\u6811 */
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

/* \u7C7B\u578B\u8BB0\u53F7\uFF08\u7EAF CSS \u56FE\u5F62\uFF09 */
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

/* \u5C5E\u6027\u9762\u677F */
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

/* \u9009\u4E2D\u6846\u4E0E\u624B\u67C4 */
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

/* ---------- \u52A8\u753B ---------- */
@keyframes gv-blink { 50% { opacity: 0; } }
@keyframes gv-pulse { 0%, 100% { opacity: .4; } 50% { opacity: 1; } }
@keyframes gv-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes gv-slide-in { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes gv-rise { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

/* ---------- \u8BBE\u7F6E\u9009\u9879\u5361\uFF08\u6E32\u67D3\u5728\u8BBE\u7F6E\u9762\u677F\u5185\uFF0CGAL \u6839\u8282\u70B9\u4E4B\u5916 \u2192 \u65E0\u4F5C\u7528\u57DF\uFF09 ---------- */
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
`;

// .dsh-plugin/client/GalView.jsx
var import_react3 = __toESM(require("react"), 1);

// .dsh-plugin/client/StageView.jsx
var import_react = __toESM(require("react"), 1);

// .dsh-plugin/client/scene.mjs
var SCENE_VERSION = 1;
var STAGE_W = 960;
var STAGE_H = 540;
var MIN_SIZE = 12;
var ELEMENT_TYPES = Object.freeze([
  "background",
  "character",
  "dialogue",
  "dialogue-text",
  "speaker-name",
  "text",
  "rect",
  "circle",
  "button",
  "action-button",
  "decoration"
]);
function defaultAlign(type) {
  switch (type) {
    case "dialogue-text":
    case "speaker-name":
    case "dialogue":
      return "left";
    default:
      return "center";
  }
}
var TYPE_LABELS = Object.freeze({
  background: "\u80CC\u666F",
  character: "\u89D2\u8272",
  dialogue: "\u5BF9\u8BDD\u6846",
  "dialogue-text": "\u53F0\u8BCD",
  "speaker-name": "\u8BF4\u8BDD\u4EBA",
  text: "\u6587\u672C",
  button: "\u6309\u94AE",
  "action-button": "\u900F\u660E\u6309\u94AE",
  rect: "\u77E9\u5F62",
  circle: "\u5706\u5F62",
  decoration: "\u88C5\u9970"
});
var DIALOGUE_FALLBACK = Object.freeze({
  x: 40,
  y: 392,
  w: 880,
  h: 128,
  background: "rgba(16,20,38,.78)",
  borderColor: "rgba(150,140,255,.35)",
  borderWidth: 1,
  borderRadius: 6
});
function makeId(prefix = "el", random = Math.random) {
  const rand = Math.floor(random() * 16777215).toString(36).padStart(6, "0");
  return prefix + "-" + Date.now().toString(36) + "-" + rand;
}
function defaultSettings() {
  return {
    stageW: STAGE_W,
    stageH: STAGE_H,
    showGrid: false,
    gridSize: 24,
    snap: true,
    assistantSpeaker: "char-a",
    playerName: "\u4F60",
    typeSpeed: "normal",
    welcome: ["\u2026\u2026\u6D4B\u8BD5\u8FDE\u63A5\u5DF2\u7ECF\u5EFA\u7ACB\u3002", "\u8FD9\u91CC\u662F\u4E00\u4E2A\u7528\u4E8E\u6D4B\u8BD5 AI \u5BF9\u8BDD\u7CFB\u7EDF\u7684 Galgame \u573A\u666F\u3002"]
  };
}
function defaultScene() {
  return normalizeScene({
    settings: defaultSettings(),
    elements: [
      {
        id: "background",
        type: "background",
        name: "\u80CC\u666F",
        x: 0,
        y: 0,
        w: STAGE_W,
        h: STAGE_H,
        rotation: 0,
        opacity: 1,
        z: 0,
        locked: true,
        hidden: false,
        background: "linear-gradient(158deg, #0c1026 0%, #161244 42%, #221a52 78%, #2a1d5e 100%)",
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 0,
        color: "#a9b4e8",
        fontSize: 15,
        text: ""
      },
      {
        id: "char-a",
        type: "character",
        name: "\u89D2\u8272 A",
        x: 148,
        y: 74,
        w: 220,
        h: 420,
        rotation: 0,
        opacity: 1,
        z: 10,
        locked: false,
        hidden: false,
        background: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 8,
        color: "#9b8cff",
        fontSize: 13,
        text: "",
        character: { key: "character-a", label: "CHARACTER A", name: "DeepSeek", color: "#9b8cff" }
      },
      {
        id: "char-b",
        type: "character",
        name: "\u89D2\u8272 B",
        x: 592,
        y: 94,
        w: 220,
        h: 400,
        rotation: 0,
        opacity: 1,
        z: 11,
        locked: false,
        hidden: false,
        background: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 8,
        color: "#ff8fa3",
        fontSize: 13,
        text: "",
        character: { key: "character-b", label: "CHARACTER B", name: "\u96FE\u5B50", color: "#ff8fa3" }
      },
      {
        id: "dialogue",
        type: "dialogue",
        name: "\u5BF9\u8BDD\u6846",
        x: 40,
        y: 392,
        w: 880,
        h: 128,
        rotation: 0,
        opacity: 1,
        z: 20,
        locked: false,
        hidden: false,
        background: "linear-gradient(180deg, rgba(18,22,44,.82) 0%, rgba(11,14,30,.9) 100%)",
        borderColor: "rgba(155,140,255,.32)",
        borderWidth: 1,
        borderRadius: 6,
        color: "#e8ebf5",
        fontSize: 17,
        text: "\u2026\u2026"
      },
      {
        id: "dialogue-text",
        type: "dialogue-text",
        name: "\u53F0\u8BCD",
        x: 58,
        y: 414,
        w: 844,
        h: 88,
        rotation: 0,
        opacity: 1,
        z: 21,
        locked: false,
        hidden: false,
        background: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 0,
        color: "#e8ebf5",
        fontSize: 17,
        text: "\u2026\u2026"
      },
      {
        id: "speaker-player",
        type: "speaker-name",
        name: "\u73A9\u5BB6\u540D\u724C",
        x: 46,
        y: 368,
        w: 140,
        h: 24,
        rotation: 0,
        opacity: 1,
        z: 22,
        locked: false,
        hidden: false,
        background: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 0,
        color: "#e8ebf5",
        fontSize: 14,
        text: "\u4F60",
        role: "player"
      },
      {
        id: "speaker-ai",
        type: "speaker-name",
        name: "AI \u540D\u724C",
        x: 46,
        y: 368,
        w: 140,
        h: 24,
        rotation: 0,
        opacity: 1,
        z: 22,
        locked: false,
        hidden: false,
        background: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 0,
        color: "#e8ebf5",
        fontSize: 14,
        text: "DeepSeek",
        role: "assistant"
      },
      {
        id: "btn-history",
        type: "action-button",
        name: "\u5386\u53F2\u6309\u94AE",
        x: 740,
        y: 14,
        w: 44,
        h: 26,
        rotation: 0,
        opacity: 1,
        z: 23,
        locked: false,
        hidden: false,
        background: "transparent",
        borderColor: "rgba(255,255,255,.35)",
        borderWidth: 1,
        borderRadius: 4,
        color: "#e8ebf5",
        fontSize: 12,
        text: "\u5386\u53F2",
        action: "history"
      },
      {
        id: "btn-auto",
        type: "action-button",
        name: "\u81EA\u52A8\u6309\u94AE",
        x: 792,
        y: 14,
        w: 44,
        h: 26,
        rotation: 0,
        opacity: 1,
        z: 23,
        locked: false,
        hidden: false,
        background: "transparent",
        borderColor: "rgba(255,255,255,.35)",
        borderWidth: 1,
        borderRadius: 4,
        color: "#e8ebf5",
        fontSize: 12,
        text: "\u81EA\u52A8",
        action: "auto"
      },
      {
        id: "btn-skip",
        type: "action-button",
        name: "\u5FEB\u8FDB\u6309\u94AE",
        x: 844,
        y: 14,
        w: 44,
        h: 26,
        rotation: 0,
        opacity: 1,
        z: 23,
        locked: false,
        hidden: false,
        background: "transparent",
        borderColor: "rgba(255,255,255,.35)",
        borderWidth: 1,
        borderRadius: 4,
        color: "#e8ebf5",
        fontSize: 12,
        text: "\u5FEB\u8FDB",
        action: "skip"
      },
      {
        id: "btn-settings",
        type: "action-button",
        name: "\u8BBE\u7F6E\u6309\u94AE",
        x: 896,
        y: 14,
        w: 44,
        h: 26,
        rotation: 0,
        opacity: 1,
        z: 23,
        locked: false,
        hidden: false,
        background: "transparent",
        borderColor: "rgba(255,255,255,.35)",
        borderWidth: 1,
        borderRadius: 4,
        color: "#e8ebf5",
        fontSize: 12,
        text: "\u8BBE\u7F6E",
        action: "settings"
      },
      {
        id: "deco-corner",
        type: "decoration",
        name: "\u88C5\u9970 \xB7 \u83F1\u5F62",
        x: 812,
        y: 44,
        w: 96,
        h: 96,
        rotation: 45,
        opacity: 0.5,
        z: 5,
        locked: false,
        hidden: false,
        background: "transparent",
        borderColor: "rgba(155,140,255,.45)",
        borderWidth: 1,
        borderRadius: 0,
        color: "#9b8cff",
        fontSize: 11,
        text: ""
      },
      {
        id: "deco-line",
        type: "decoration",
        name: "\u88C5\u9970 \xB7 \u5730\u5E73\u7EBF",
        x: 0,
        y: 336,
        w: 960,
        h: 56,
        rotation: 0,
        opacity: 0.35,
        z: 4,
        locked: false,
        hidden: false,
        background: "linear-gradient(90deg, transparent, rgba(120,140,255,.25) 18%, rgba(120,140,255,.25) 82%, transparent)",
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 0,
        color: "#a9b4e8",
        fontSize: 11,
        text: "[ DECORATION ]"
      }
    ]
  });
}
function makeElement(type, { id = makeId(), index = 0, role, stageW = STAGE_W, stageH = STAGE_H } = {}) {
  const common = {
    id,
    type,
    name: TYPE_LABELS[type] ?? "\u5143\u7D20",
    rotation: 0,
    opacity: 1,
    locked: false,
    hidden: false,
    background: "transparent",
    borderColor: "rgba(155,140,255,.45)",
    borderWidth: 1,
    borderRadius: 0,
    color: "#e8ebf5",
    fontSize: 15,
    text: "",
    align: defaultAlign(type),
    // 文本对齐：left | center | right
    fontFamily: "",
    // 字体：空 = 默认；内置 CSS 字体族或导入字体的 family
    action: "",
    // 功能绑定：透明按钮的预设功能（history/auto/skip/settings）；空 = 装饰按钮
    image: null,
    // 素材引用：素材库中的 assetId；null = 占位图形
    bind: null
    // 绑定引用：说话人元素绑定的台词元素 id
  };
  switch (type) {
    case "background":
      return {
        ...common,
        x: 0,
        y: 0,
        w: stageW,
        h: stageH,
        z: -10,
        locked: true,
        background: "linear-gradient(150deg, #0d1130 0%, #1a1650 60%, #241a58 100%)",
        borderColor: "transparent",
        borderWidth: 0,
        color: "#a9b4e8",
        fontSize: 15
      };
    case "character": {
      const letter = String.fromCharCode(65 + index);
      const palette = ["#9b8cff", "#ff8fa3", "#6fb8ff", "#ffb86b", "#7fe0c3"];
      const color = palette[index % palette.length];
      return {
        ...common,
        x: 370,
        y: 70,
        w: 220,
        h: 400,
        z: 12,
        character: {
          key: "character-" + letter.toLowerCase(),
          label: "CHARACTER " + letter,
          name: "\u89D2\u8272 " + letter,
          color
        },
        color,
        fontSize: 13
      };
    }
    case "dialogue":
      return {
        ...common,
        x: 40,
        y: stageH - 148,
        w: stageW - 80,
        h: 128,
        z: 20,
        background: "linear-gradient(180deg, rgba(18,22,44,.82) 0%, rgba(11,14,30,.9) 100%)",
        borderColor: "rgba(155,140,255,.32)",
        borderRadius: 6,
        fontSize: 17,
        text: "\u2026\u2026"
      };
    case "dialogue-text":
      return {
        ...common,
        x: 58,
        y: stageH - 126,
        w: stageW - 116,
        h: 88,
        z: 21,
        text: "\u2026\u2026",
        fontSize: 17,
        borderWidth: 0
      };
    case "speaker-name": {
      const speakerRole = role === "assistant" ? "assistant" : "player";
      return {
        ...common,
        x: 46,
        y: stageH - 172,
        w: 140,
        h: 24,
        z: 22,
        name: speakerRole === "player" ? "\u73A9\u5BB6\u540D\u724C" : "AI \u540D\u724C",
        text: speakerRole === "player" ? "\u4F60" : "DeepSeek",
        role: speakerRole,
        fontSize: 14,
        borderWidth: 0
      };
    }
    case "text":
      return { ...common, x: 400, y: 240, w: 180, h: 40, z: 15, text: "\u6587\u672C", fontSize: 18, borderWidth: 0 };
    case "button":
      return {
        ...common,
        x: 410,
        y: 300,
        w: 140,
        h: 38,
        z: 16,
        text: "\u6309\u94AE",
        fontSize: 14,
        borderRadius: 19,
        background: "rgba(155,140,255,.12)",
        borderColor: "rgba(155,140,255,.6)"
      };
    case "action-button":
      return {
        ...common,
        x: 800,
        y: 12,
        w: 44,
        h: 26,
        z: 23,
        text: "\u6309\u94AE",
        fontSize: 12,
        background: "transparent",
        borderColor: "rgba(255,255,255,.35)",
        borderRadius: 4
      };
    case "rect":
      return {
        ...common,
        x: 360,
        y: 140,
        w: 240,
        h: 140,
        z: 8,
        text: "",
        background: "rgba(155,140,255,.10)",
        borderColor: "rgba(155,140,255,.55)",
        color: "#8f93c9",
        fontSize: 13
      };
    case "circle":
      return {
        ...common,
        x: 430,
        y: 130,
        w: 110,
        h: 110,
        z: 9,
        borderRadius: 55,
        text: "",
        background: "rgba(111,184,255,.10)",
        borderColor: "rgba(111,184,255,.55)",
        color: "#8f93c9",
        fontSize: 13
      };
    case "decoration":
      return {
        ...common,
        x: 420,
        y: 80,
        w: 140,
        h: 90,
        z: 6,
        text: "",
        borderColor: "rgba(155,140,255,.4)",
        borderWidth: 1,
        background: "transparent",
        color: "#8f93c9",
        fontSize: 11
      };
    default:
      return { ...common, x: 400, y: 200, w: 160, h: 100, z: 8 };
  }
}
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function toNumber(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
function toString(value, fallback) {
  return typeof value === "string" ? value : fallback;
}
function normalizeElement(raw) {
  if (!isRecord(raw)) return null;
  const type = typeof raw.type === "string" ? raw.type : "rect";
  const el = {
    id: toString(raw.id, "") || makeId(),
    type,
    name: toString(raw.name, ""),
    x: toNumber(raw.x, 0),
    y: toNumber(raw.y, 0),
    w: Math.max(MIN_SIZE, toNumber(raw.w, 100)),
    h: Math.max(MIN_SIZE, toNumber(raw.h, 60)),
    rotation: toNumber(raw.rotation, 0),
    opacity: Math.min(1, Math.max(0, toNumber(raw.opacity, 1))),
    z: toNumber(raw.z, 0),
    locked: raw.locked === true,
    hidden: raw.hidden === true,
    background: toString(raw.background, "transparent"),
    borderColor: toString(raw.borderColor, "transparent"),
    borderWidth: Math.max(0, toNumber(raw.borderWidth, 0)),
    borderRadius: Math.max(0, toNumber(raw.borderRadius, 0)),
    color: toString(raw.color, "#e8ebf5"),
    fontSize: Math.max(8, toNumber(raw.fontSize, 15)),
    text: toString(raw.text, ""),
    image: typeof raw.image === "string" && raw.image !== "" ? raw.image : null,
    bind: typeof raw.bind === "string" && raw.bind !== "" ? raw.bind : null,
    role: raw.role === "assistant" ? "assistant" : raw.role === "player" ? "player" : null,
    align: raw.align === "left" || raw.align === "right" || raw.align === "center" ? raw.align : defaultAlign(type),
    fontFamily: typeof raw.fontFamily === "string" ? raw.fontFamily : "",
    action: typeof raw.action === "string" ? raw.action : ""
  };
  if (isRecord(raw.character)) {
    el.character = {
      key: toString(raw.character.key, ""),
      label: toString(raw.character.label, "CHARACTER"),
      name: toString(raw.character.name, "\uFF1F\uFF1F\uFF1F"),
      color: toString(raw.character.color, "#9b8cff")
    };
  }
  return el;
}
function normalizeSettings(raw) {
  const base = defaultSettings();
  if (!isRecord(raw)) return base;
  return {
    stageW: Math.max(320, toNumber(raw.stageW, base.stageW)),
    stageH: Math.max(180, toNumber(raw.stageH, base.stageH)),
    showGrid: raw.showGrid === true,
    gridSize: Math.min(64, Math.max(4, toNumber(raw.gridSize, base.gridSize))),
    snap: raw.snap !== false,
    assistantSpeaker: toString(raw.assistantSpeaker, base.assistantSpeaker),
    playerName: toString(raw.playerName, base.playerName) || "\u4F60",
    typeSpeed: ["slow", "normal", "fast"].includes(raw.typeSpeed) ? raw.typeSpeed : base.typeSpeed,
    welcome: Array.isArray(raw.welcome) ? raw.welcome.filter((line) => typeof line === "string").slice(0, 8) : base.welcome
  };
}
function normalizeScene(raw) {
  if (!isRecord(raw)) return null;
  const elements = (Array.isArray(raw.elements) ? raw.elements : []).map(normalizeElement).filter((el) => el !== null);
  return {
    version: SCENE_VERSION,
    settings: normalizeSettings(raw.settings),
    elements
  };
}
function cloneScene(scene) {
  return JSON.parse(JSON.stringify(scene));
}
function elementStyle(el) {
  const align = el.align === "right" || el.align === "center" ? el.align : "left";
  return {
    left: el.x + "px",
    top: el.y + "px",
    width: el.w + "px",
    height: el.h + "px",
    transform: el.rotation === 0 ? void 0 : "rotate(" + el.rotation + "deg)",
    opacity: el.opacity,
    zIndex: el.z,
    background: el.background,
    borderColor: el.borderColor,
    borderWidth: el.borderWidth + "px",
    borderRadius: el.borderRadius + "px",
    color: el.color,
    fontSize: el.fontSize + "px",
    fontFamily: el.fontFamily !== "" ? el.fontFamily : void 0,
    textAlign: align,
    justifyContent: align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center"
  };
}
function sortElements(elements) {
  return [...elements].sort((a, b) => a.z - b.z || a.id.localeCompare(b.id));
}
function findDialogue(scene) {
  const el = scene.elements.find((e) => e.type === "dialogue" && !e.hidden);
  return el ?? { ...DIALOGUE_FALLBACK, id: "dialogue-fallback", fontSize: 17, color: "#e8ebf5" };
}
function snapValue(value, size, enabled) {
  return enabled ? Math.round(value / size) * size : value;
}
function elementCenter(el) {
  return { x: el.x + el.w / 2, y: el.y + el.h / 2 };
}
function ensureDialogueText(scene) {
  if (scene.elements.some((el2) => el2.type === "dialogue-text")) return scene;
  const box = scene.elements.find((el2) => el2.type === "dialogue");
  if (box === void 0) return scene;
  const el = makeElement("dialogue-text", { id: "dialogue-text" });
  return {
    ...scene,
    elements: [...scene.elements, { ...el, x: box.x + 18, y: box.y + 22, w: box.w - 36, h: box.h - 40 }]
  };
}
function ensureSpeakerNames(scene) {
  const isLegacy = (el) => el.type === "speaker-name" && el.role !== "player" && el.role !== "assistant";
  const legacy = scene.elements.filter(isLegacy);
  const hasPlayer = scene.elements.some((el) => el.type === "speaker-name" && el.role === "player");
  const hasAi = scene.elements.some((el) => el.type === "speaker-name" && el.role === "assistant");
  if (legacy.length === 0 && hasPlayer && hasAi) return scene;
  const anchor = scene.elements.find((el) => el.type === "dialogue-text") ?? scene.elements.find((el) => el.type === "dialogue");
  const pos = legacy.length > 0 ? { x: legacy[0].x, y: legacy[0].y } : anchor !== void 0 ? { x: anchor.x, y: anchor.y - 28 } : { x: 46, y: 368 };
  const kept = legacy.length > 0 ? scene.elements.filter((el) => !isLegacy(el)) : [...scene.elements];
  const add = [];
  if (!hasPlayer) add.push({ ...makeElement("speaker-name", { id: "speaker-player", role: "player" }), ...pos });
  if (!hasAi) add.push({ ...makeElement("speaker-name", { id: "speaker-ai", role: "assistant" }), ...pos });
  return { ...scene, elements: [...kept, ...add] };
}
function ensureActionButtons(scene) {
  if (scene.elements.some((el) => el.type === "action-button")) return scene;
  if (!scene.elements.some((el) => el.type === "dialogue")) return scene;
  const sw = scene.settings.stageW;
  const actions = [
    { id: "btn-history", text: "\u5386\u53F2", action: "history" },
    { id: "btn-auto", text: "\u81EA\u52A8", action: "auto" },
    { id: "btn-skip", text: "\u5FEB\u8FDB", action: "skip" },
    { id: "btn-settings", text: "\u8BBE\u7F6E", action: "settings" }
  ];
  const add = actions.map((entry, index) => ({
    ...makeElement("action-button", { id: entry.id }),
    x: sw - 220 + index * 52,
    y: 14,
    text: entry.text,
    action: entry.action,
    name: entry.text + "\u6309\u94AE"
  }));
  return { ...scene, elements: [...scene.elements, ...add] };
}

// .dsh-plugin/client/snap.mjs
var EDGE_THRESHOLD = 6;
function collectSnapLines({ stageW, stageH, elements, excludeId }) {
  const lines = [
    { axis: "x", pos: 0, kind: "stage" },
    { axis: "x", pos: stageW, kind: "stage" },
    { axis: "x", pos: stageW / 2, kind: "stage" },
    { axis: "y", pos: 0, kind: "stage" },
    { axis: "y", pos: stageH, kind: "stage" },
    { axis: "y", pos: stageH / 2, kind: "stage" }
  ];
  for (const el of elements) {
    if (el.id === excludeId || el.hidden) continue;
    lines.push(
      { axis: "x", pos: el.x, kind: "edge" },
      { axis: "x", pos: el.x + el.w, kind: "edge" },
      { axis: "x", pos: el.x + el.w / 2, kind: "center" },
      { axis: "y", pos: el.y, kind: "edge" },
      { axis: "y", pos: el.y + el.h, kind: "edge" },
      { axis: "y", pos: el.y + el.h / 2, kind: "center" }
    );
  }
  return lines;
}
var MOVE_KEYS = Object.freeze([
  { axis: "x", get: (r) => r.x, set: (r, v) => ({ ...r, x: v }) },
  { axis: "x", get: (r) => r.x + r.w, set: (r, v) => ({ ...r, x: v - r.w }) },
  { axis: "x", get: (r) => r.x + r.w / 2, set: (r, v) => ({ ...r, x: v - r.w / 2 }) },
  { axis: "y", get: (r) => r.y, set: (r, v) => ({ ...r, y: v }) },
  { axis: "y", get: (r) => r.y + r.h, set: (r, v) => ({ ...r, y: v - r.h }) },
  { axis: "y", get: (r) => r.y + r.h / 2, set: (r, v) => ({ ...r, y: v - r.h / 2 }) }
]);
function resizeKeys(dir) {
  const keys = [];
  if (dir.includes("w")) keys.push({ axis: "x", get: (r) => r.x, set: (r, v) => ({ ...r, x: v, w: r.x + r.w - v }) });
  if (dir.includes("e")) keys.push({ axis: "x", get: (r) => r.x + r.w, set: (r, v) => ({ ...r, w: v - r.x }) });
  if (dir.includes("n")) keys.push({ axis: "y", get: (r) => r.y, set: (r, v) => ({ ...r, y: v, h: r.y + r.h - v }) });
  if (dir.includes("s")) keys.push({ axis: "y", get: (r) => r.y + r.h, set: (r, v) => ({ ...r, h: v - r.y }) });
  return keys;
}
function snapRect(rect, keys, lines, threshold = EDGE_THRESHOLD) {
  let next = rect;
  const guides = [];
  for (const axis of ["x", "y"]) {
    const axisKeys = keys.filter((key) => key.axis === axis);
    let bestKey = null;
    let bestLine = null;
    let bestDist = Infinity;
    for (const key of axisKeys) {
      const value = key.get(next);
      for (const line of lines) {
        if (line.axis !== axis) continue;
        const distance = Math.abs(value - line.pos);
        if (distance <= threshold && distance < bestDist) {
          bestDist = distance;
          bestKey = key;
          bestLine = line;
        }
      }
    }
    if (bestKey !== null && bestLine !== null) {
      next = bestKey.set(next, bestLine.pos);
      guides.push({ axis, pos: bestLine.pos, kind: bestLine.kind });
    }
  }
  return { rect: next, guides };
}

// .dsh-plugin/client/StageView.jsx
var HANDLES = [
  { dir: "nw", cursor: "nwse-resize", style: { left: -5, top: -5 } },
  { dir: "n", cursor: "ns-resize", style: { left: "calc(50% - 5px)", top: -5 } },
  { dir: "ne", cursor: "nesw-resize", style: { right: -5, top: -5 } },
  { dir: "e", cursor: "ew-resize", style: { right: -5, top: "calc(50% - 5px)" } },
  { dir: "se", cursor: "nwse-resize", style: { right: -5, bottom: -5 } },
  { dir: "s", cursor: "ns-resize", style: { left: "calc(50% - 5px)", bottom: -5 } },
  { dir: "sw", cursor: "nesw-resize", style: { left: -5, bottom: -5 } },
  { dir: "w", cursor: "ew-resize", style: { left: -5, top: "calc(50% - 5px)" } }
];
function CharacterPlaceholder({ el, speaking, asset }) {
  const c = el.character ?? {};
  const color = c.color ?? el.color ?? "#9b8cff";
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "gv-char" + (speaking ? " is-speaking" : ""), "aria-hidden": "true" }, asset !== null && asset !== void 0 ? /* @__PURE__ */ import_react.default.createElement("img", { className: "gv-char-img", src: asset.dataUrl, alt: c.label ?? "", draggable: false }) : /* @__PURE__ */ import_react.default.createElement("svg", { className: "gv-char-svg", viewBox: "0 0 100 170", preserveAspectRatio: "xMidYMax meet" }, /* @__PURE__ */ import_react.default.createElement("circle", { cx: "50", cy: "30", r: "20", fill: color, fillOpacity: ".34", stroke: color, strokeOpacity: ".85", strokeWidth: "1.4" }), /* @__PURE__ */ import_react.default.createElement(
    "path",
    {
      d: "M16 170 C16 122 34 100 50 100 C66 100 84 122 84 170 Z",
      fill: color,
      fillOpacity: ".26",
      stroke: color,
      strokeOpacity: ".8",
      strokeWidth: "1.4"
    }
  ), /* @__PURE__ */ import_react.default.createElement("path", { d: "M50 24 L50 34", stroke: color, strokeOpacity: ".5", strokeWidth: "1" })), /* @__PURE__ */ import_react.default.createElement("div", { className: "gv-char-plate" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "gv-char-label" }, c.label ?? "CHARACTER"), /* @__PURE__ */ import_react.default.createElement("span", { className: "gv-char-name", style: { color } }, c.name ?? "\uFF1F\uFF1F\uFF1F")));
}
function ElementBody({ el, mode, speaking, asset }) {
  const hasAsset = asset !== null && asset !== void 0;
  switch (el.type) {
    case "background":
      return /* @__PURE__ */ import_react.default.createElement("div", { className: "gv-elbg" }, !hasAsset && /* @__PURE__ */ import_react.default.createElement("span", { className: "gv-elbg-corners", "aria-hidden": "true" }), (!hasAsset || el.text !== "") && /* @__PURE__ */ import_react.default.createElement("span", { className: "gv-elbg-label" }, el.text !== "" ? el.text : "BACKGROUND"));
    case "character":
      return /* @__PURE__ */ import_react.default.createElement(CharacterPlaceholder, { el, speaking, asset });
    case "dialogue":
      return /* @__PURE__ */ import_react.default.createElement("div", { className: "gv-elbox" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "gv-elbox-name", style: { color: el.color } }, "\u89D2\u8272\u540D"));
    case "dialogue-text":
      return /* @__PURE__ */ import_react.default.createElement("div", { className: "gv-eltext" }, el.text !== "" ? el.text : "\u2026\u2026");
    case "speaker-name":
      return /* @__PURE__ */ import_react.default.createElement("div", { className: "gv-sname" }, el.text !== "" ? el.text : el.role === "assistant" ? "AI \u540D\u724C" : "\u73A9\u5BB6\u540D\u724C");
    case "text":
      return /* @__PURE__ */ import_react.default.createElement("div", { className: "gv-eltext" }, el.text);
    case "button":
      return /* @__PURE__ */ import_react.default.createElement("div", { className: "gv-elbtn" }, el.text !== "" ? el.text : "\u6309\u94AE");
    case "action-button":
      return /* @__PURE__ */ import_react.default.createElement("div", { className: "gv-elbtn" }, el.text);
    case "rect":
      return /* @__PURE__ */ import_react.default.createElement("div", { className: "gv-elshape" }, !hasAsset && el.text === "" ? "RECT" : el.text);
    case "circle":
      return /* @__PURE__ */ import_react.default.createElement("div", { className: "gv-elshape" }, !hasAsset && el.text === "" ? "CIRCLE" : el.text);
    case "decoration":
      return /* @__PURE__ */ import_react.default.createElement("div", { className: "gv-eldeco" }, (!hasAsset || el.text !== "") && /* @__PURE__ */ import_react.default.createElement("span", { className: "gv-eldeco-label" }, el.text !== "" ? el.text : "[ DECORATION ]"));
    default:
      return /* @__PURE__ */ import_react.default.createElement("div", { className: "gv-elshape" }, el.name);
  }
}
function DialogueBox({ el, line, type, pinned, onSkip, asset, dtextEl, aiStatus }) {
  const bodyRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    if (pinned) return;
    const body = bodyRef.current;
    if (body !== null) body.scrollTop = body.scrollHeight;
  }, [type.shown, line.text, pinned]);
  const speaker = line.speaker;
  const baseStyle = elementStyle(el);
  const style = asset !== null && asset !== void 0 ? {
    ...baseStyle,
    backgroundImage: 'url("' + asset.dataUrl + '")',
    backgroundSize: "cover",
    backgroundPosition: "center"
  } : baseStyle;
  const hasSeparateText = dtextEl !== null && dtextEl !== void 0;
  return /* @__PURE__ */ import_react.default.createElement(
    "div",
    {
      className: "gv-dialogue",
      style,
      onClick: onSkip,
      role: "button",
      tabIndex: 0,
      "aria-label": "\u5BF9\u8BDD\u6846\uFF1A\u70B9\u51FB\u8DF3\u8FC7\u6253\u5B57\u52A8\u753B",
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSkip();
        }
      }
    },
    !hasSeparateText && /* @__PURE__ */ import_react.default.createElement("div", { className: "gv-dialogue-body", ref: bodyRef }, /* @__PURE__ */ import_react.default.createElement("span", { className: "gv-dialogue-text" }, type.shown), !type.done && /* @__PURE__ */ import_react.default.createElement("span", { className: "gv-dialogue-caret", "aria-hidden": "true" }), aiStatus !== null && aiStatus !== void 0 && aiStatus !== "" && /* @__PURE__ */ import_react.default.createElement("span", { className: "gv-dtext-status" }, (type.shown !== "" ? "\n" : "") + "\uFF08" + aiStatus + "\u2026\uFF09"))
  );
}
function LiveSpeakerName({ el, line }) {
  const role = el.role === "assistant" ? "assistant" : "player";
  const active = line !== null && line.kind !== "system" && (role === "player" && line.kind === "player" || role === "assistant" && line.kind === "assistant");
  if (!active || el.text === "") return null;
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "gv-sname", style: elementStyle(el), "aria-label": "\u8BF4\u8BDD\u4EBA" }, el.text);
}
function LiveDialogueText({ el, type, running, pinned, onTextClick, hasNextPage, aiStatus }) {
  const bodyRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    if (pinned) return;
    const body = bodyRef.current;
    if (body !== null) body.scrollTop = body.scrollHeight;
  }, [type.shown, pinned]);
  const showEllipsis = !running && type.done && hasNextPage;
  const trailingMatch = showEllipsis ? /\n+$/.exec(type.shown) : null;
  const trailing = trailingMatch !== null ? trailingMatch[0] : "";
  const visible = trailing !== "" ? type.shown.slice(0, -trailing.length) : type.shown;
  return /* @__PURE__ */ import_react.default.createElement(
    "div",
    {
      className: "gv-dtext",
      style: elementStyle(el),
      ref: bodyRef,
      onClick: onTextClick,
      role: "button",
      tabIndex: 0,
      "aria-label": "\u53F0\u8BCD\uFF1A\u70B9\u51FB\u663E\u793A\u540E\u7EED\u5185\u5BB9",
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onTextClick();
        }
      }
    },
    /* @__PURE__ */ import_react.default.createElement("span", { className: "gv-dialogue-text" }, visible),
    showEllipsis && /* @__PURE__ */ import_react.default.createElement("span", { className: "gv-dtext-ellipsis", "aria-hidden": "true" }, "\u2026"),
    trailing !== "" && /* @__PURE__ */ import_react.default.createElement("span", { className: "gv-dialogue-text" }, trailing),
    !type.done && /* @__PURE__ */ import_react.default.createElement("span", { className: "gv-dialogue-caret", "aria-hidden": "true" }),
    aiStatus !== null && aiStatus !== void 0 && aiStatus !== "" && /* @__PURE__ */ import_react.default.createElement("span", { className: "gv-dtext-status", "aria-label": "AI \u72B6\u6001\uFF1A" + aiStatus }, (visible !== "" ? "\n" : "") + "\uFF08" + aiStatus + "\u2026\uFF09"),
    showEllipsis && /* @__PURE__ */ import_react.default.createElement("span", { className: "gv-dtext-more", "aria-hidden": "true" }, "\u25BC")
  );
}
function SelectionOverlay({ el, onBeginGesture }) {
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "gv-sel", style: { left: el.x, top: el.y, width: el.w, height: el.h, transform: el.rotation === 0 ? void 0 : "rotate(" + el.rotation + "deg)" } }, /* @__PURE__ */ import_react.default.createElement("span", { className: "gv-sel-label" }, el.name !== "" ? el.name : el.type), HANDLES.map((h) => /* @__PURE__ */ import_react.default.createElement(
    "span",
    {
      key: h.dir,
      className: "gv-sel-handle gv-sel-" + h.dir,
      style: { ...h.style, cursor: h.cursor },
      onPointerDown: (e) => onBeginGesture(e, el, "resize", h.dir)
    }
  )), /* @__PURE__ */ import_react.default.createElement(
    "span",
    {
      className: "gv-sel-rotate",
      onPointerDown: (e) => onBeginGesture(e, el, "rotate", null),
      "aria-label": "\u65CB\u8F6C"
    }
  ));
}
function StageView({ scene, assetsMap, mode, line, type, running, pinned, selectedId, onSelect, api, onSkip, onTextClick, hasNextPage, aiStatus, onAction, autoOn }) {
  const wrapRef = (0, import_react.useRef)(null);
  const stageRef = (0, import_react.useRef)(null);
  const gesture = (0, import_react.useRef)(null);
  const [scale, setScale] = (0, import_react.useState)(0);
  const [guides, setGuides] = (0, import_react.useState)([]);
  const sw = scene.settings.stageW;
  const sh = scene.settings.stageH;
  (0, import_react.useEffect)(() => {
    const wrap = wrapRef.current;
    if (wrap === null) return;
    const measure = () => {
      const rect = wrap.getBoundingClientRect();
      const availW = Math.max(120, rect.width - 24);
      const availH = Math.max(120, rect.height - 24);
      setScale(Math.min(availW / sw, availH / sh));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => {
      ro.disconnect();
    };
  }, [sw, sh]);
  const visible = sortElements(scene.elements.filter((el) => !el.hidden));
  const dialogue = findDialogue(scene);
  const dtext = scene.elements.find((el) => el.type === "dialogue-text" && !el.hidden) ?? null;
  const snames = scene.elements.filter((el) => el.type === "speaker-name" && !el.hidden);
  const editor = mode === "editor";
  const renderElements = editor ? visible : visible.filter((el) => el.type !== "dialogue" && el.type !== "dialogue-text" && el.type !== "speaker-name");
  const assetOf = (el) => {
    if (typeof el.image !== "string" || el.image === "" || assetsMap === void 0) return null;
    return assetsMap.get(el.image) ?? null;
  };
  const beginGesture = (e, el, kind, dir) => {
    e.preventDefault();
    e.stopPropagation();
    if (api === void 0 || el.locked) return;
    const before = api.snapshotScene();
    const lines = scene.settings.snap ? collectSnapLines({
      stageW: scene.settings.stageW,
      stageH: scene.settings.stageH,
      elements: scene.elements,
      excludeId: el.id
    }) : [];
    gesture.current = {
      el,
      kind,
      dir,
      before,
      scale,
      lines,
      startX: e.clientX,
      startY: e.clientY,
      orig: { x: el.x, y: el.y, w: el.w, h: el.h, rotation: el.rotation },
      changed: false
    };
    if (stageRef.current !== null && typeof e.pointerId === "number") {
      try {
        stageRef.current.setPointerCapture(e.pointerId);
      } catch {
      }
    }
    if (onSelect) onSelect(el.id);
  };
  const onStageMove = (e) => {
    const g = gesture.current;
    if (g === null || g === void 0) return;
    const s = scene.settings;
    const dx = (e.clientX - g.startX) / g.scale;
    const dy = (e.clientY - g.startY) / g.scale;
    if (g.kind === "move") {
      const raw = { x: g.orig.x + dx, y: g.orig.y + dy, w: g.orig.w, h: g.orig.h };
      const snapped = snapRect(raw, MOVE_KEYS, g.lines, EDGE_THRESHOLD);
      let { x, y } = snapped.rect;
      if (!snapped.guides.some((guide) => guide.axis === "x") && s.snap) x = snapValue(x, s.gridSize, true);
      if (!snapped.guides.some((guide) => guide.axis === "y") && s.snap) y = snapValue(y, s.gridSize, true);
      setGuides(snapped.guides);
      if (x !== g.el.x || y !== g.el.y) {
        g.changed = true;
        api.updateElement(g.el.id, { x, y });
      }
    } else if (g.kind === "resize") {
      let { x, y, w, h } = g.orig;
      const maxX = g.orig.x + g.orig.w - MIN_SIZE;
      const maxY = g.orig.y + g.orig.h - MIN_SIZE;
      if (g.dir.includes("e")) w = Math.max(MIN_SIZE, g.orig.w + dx);
      if (g.dir.includes("s")) h = Math.max(MIN_SIZE, g.orig.h + dy);
      if (g.dir.includes("w")) {
        x = Math.min(maxX, Math.max(-9999, g.orig.x + dx));
        w = g.orig.x + g.orig.w - x;
      }
      if (g.dir.includes("n")) {
        y = Math.min(maxY, Math.max(-9999, g.orig.y + dy));
        h = g.orig.y + g.orig.h - y;
      }
      const snapped = snapRect({ x, y, w, h }, resizeKeys(g.dir), g.lines, EDGE_THRESHOLD);
      x = snapped.rect.x;
      y = snapped.rect.y;
      w = snapped.rect.w;
      h = snapped.rect.h;
      if (!snapped.guides.some((guide) => guide.axis === "x") && s.snap) {
        x = snapValue(x, s.gridSize, true);
        w = snapValue(w, s.gridSize, true);
      }
      if (!snapped.guides.some((guide) => guide.axis === "y") && s.snap) {
        y = snapValue(y, s.gridSize, true);
        h = snapValue(h, s.gridSize, true);
      }
      setGuides(snapped.guides);
      if (x !== g.el.x || y !== g.el.y || w !== g.el.w || h !== g.el.h) {
        g.changed = true;
        api.updateElement(g.el.id, { x, y, w: Math.max(MIN_SIZE, w), h: Math.max(MIN_SIZE, h) });
      }
    } else if (g.kind === "rotate") {
      const rect = stageRef.current.getBoundingClientRect();
      const c = elementCenter(g.orig);
      const px = (e.clientX - rect.left) / g.scale;
      const py = (e.clientY - rect.top) / g.scale;
      let angle = Math.atan2(py - c.y, px - c.x) * 180 / Math.PI + 90;
      angle = snapValue(angle, s.snap ? 5 : 1, true);
      if (angle !== g.el.rotation) {
        g.changed = true;
        api.updateElement(g.el.id, { rotation: angle });
      }
    }
  };
  const endGesture = () => {
    const g = gesture.current;
    if (g === null || g === void 0) return;
    gesture.current = null;
    setGuides([]);
    if (g.changed && api !== void 0) api.commitHistory(g.before);
  };
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "gv-stage-wrap", ref: wrapRef }, /* @__PURE__ */ import_react.default.createElement(
    "div",
    {
      className: "gv-stage" + (editor ? " is-editor" : ""),
      ref: stageRef,
      style: { width: sw, height: sh, transform: scale > 0 ? "scale(" + scale + ")" : void 0 },
      onPointerMove: editor ? onStageMove : void 0,
      onPointerUp: editor ? endGesture : void 0,
      onPointerCancel: editor ? endGesture : void 0,
      onPointerDown: editor ? () => {
        if (onSelect) onSelect(null);
      } : void 0,
      "data-scale": scale > 0 ? Math.round(scale * 100) / 100 : 0
    },
    editor && scene.settings.showGrid && /* @__PURE__ */ import_react.default.createElement("div", { className: "gv-grid", "aria-hidden": "true", style: { backgroundSize: scene.settings.gridSize + "px " + scene.settings.gridSize + "px" } }),
    editor && guides.map((guide, index) => /* @__PURE__ */ import_react.default.createElement(
      "div",
      {
        key: "guide-" + index,
        className: "gv-guide gv-guide-" + guide.axis,
        style: guide.axis === "x" ? { left: guide.pos } : { top: guide.pos },
        "aria-hidden": "true"
      }
    )),
    renderElements.map((el) => {
      const asset = assetOf(el);
      const baseStyle = elementStyle(el);
      const style = asset !== null && el.type !== "character" ? {
        ...baseStyle,
        backgroundImage: 'url("' + asset.dataUrl + '")',
        backgroundSize: "cover",
        backgroundPosition: "center"
      } : baseStyle;
      return /* @__PURE__ */ import_react.default.createElement(
        "div",
        {
          key: el.id,
          className: "gv-el gv-el-" + el.type + (el.locked ? " is-locked" : "") + (editor && !el.locked ? " is-pickable" : "") + (mode === "game" && el.type === "action-button" && el.action === "auto" && autoOn ? " is-on" : ""),
          style,
          "data-el-id": el.id,
          title: editor ? el.name : void 0,
          onPointerDown: editor && !el.locked && el.type !== "background" ? (e) => beginGesture(e, el, "move", null) : void 0,
          onClick: mode === "game" && el.type === "action-button" && el.action !== "" && onAction !== void 0 ? () => onAction(el.action) : void 0
        },
        /* @__PURE__ */ import_react.default.createElement(ElementBody, { el, mode, asset, speaking: mode === "game" && line !== null && line.kind === "assistant" && el.id === scene.settings.assistantSpeaker })
      );
    }),
    !editor && line !== null && /* @__PURE__ */ import_react.default.createElement(DialogueBox, { el: dialogue, line, type, pinned, onSkip, asset: assetOf(dialogue), dtextEl: dtext, aiStatus }),
    !editor && line !== null && dtext !== null && /* @__PURE__ */ import_react.default.createElement(LiveDialogueText, { el: dtext, type, running, pinned, onTextClick, hasNextPage, aiStatus }),
    !editor && snames.map((el) => /* @__PURE__ */ import_react.default.createElement(LiveSpeakerName, { key: el.id, el, line })),
    editor && selectedId !== null && selectedId !== void 0 && (() => {
      const sel = scene.elements.find((el) => el.id === selectedId);
      if (sel === void 0) return null;
      return /* @__PURE__ */ import_react.default.createElement(SelectionOverlay, { el: sel, onBeginGesture: beginGesture });
    })()
  ));
}

// .dsh-plugin/client/Editor.jsx
var import_react2 = __toESM(require("react"), 1);

// .dsh-plugin/client/store.mjs
function createObservable(initial) {
  let value = initial;
  const listeners = /* @__PURE__ */ new Set();
  return {
    getSnapshot: () => value,
    subscribe(fn) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    update(next) {
      if (next === value) return;
      value = next;
      for (const fn of [...listeners]) {
        try {
          fn();
        } catch (error) {
          console.error("gal-view: subscriber failed:", error);
        }
      }
    },
    set(next) {
      if (next === value) return;
      value = next;
      for (const fn of [...listeners]) {
        try {
          fn();
        } catch (error) {
          console.error("gal-view: subscriber failed:", error);
        }
      }
    }
  };
}
function createHistory(limit = 100) {
  let undo = [];
  let redo = [];
  return {
    push(snapshot) {
      undo.push(snapshot);
      if (undo.length > limit) undo.shift();
      redo.length = 0;
    },
    undoStep(current) {
      if (undo.length === 0) return null;
      redo.push(current);
      return undo.pop();
    },
    redoStep(current) {
      if (redo.length === 0) return null;
      undo.push(current);
      return redo.pop();
    },
    info() {
      return { undo: undo.length, redo: redo.length };
    },
    reset() {
      undo.length = 0;
      redo.length = 0;
    }
  };
}
function createStorage() {
  try {
    const key = "__gal-view-probe__";
    window.localStorage.setItem(key, "1");
    window.localStorage.removeItem(key);
    return window.localStorage;
  } catch {
    return null;
  }
}
function loadJSON(storage, key) {
  if (storage === null) return null;
  try {
    const raw = storage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function saveJSON(storage, key, value) {
  if (storage === null) return;
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
  }
}
function createIdbStore(dbName, storeName) {
  const memory = /* @__PURE__ */ new Map();
  let openPromise = null;
  const open = () => {
    if (typeof indexedDB === "undefined") return Promise.reject(new Error("indexedDB \u4E0D\u53EF\u7528"));
    if (openPromise === null) {
      openPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(storeName)) db.createObjectStore(storeName, { keyPath: "id" });
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error ?? new Error("indexedDB \u6253\u5F00\u5931\u8D25"));
      });
    }
    return openPromise;
  };
  const tx = async (mode, fn) => {
    try {
      const db = await open();
      return await new Promise((resolve, reject) => {
        const t = db.transaction(storeName, mode);
        const req = fn(t.objectStore(storeName));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error ?? new Error("indexedDB \u64CD\u4F5C\u5931\u8D25"));
      });
    } catch {
      return void 0;
    }
  };
  return {
    async getAll() {
      const rows = await tx("readonly", (store) => store.getAll());
      return Array.isArray(rows) && rows.length > 0 ? rows : [...memory.values()];
    },
    async put(record) {
      memory.set(record.id, record);
      await tx("readwrite", (store) => store.put(record));
    },
    async remove(id) {
      memory.delete(id);
      await tx("readwrite", (store) => store.delete(id));
    }
  };
}

// .dsh-plugin/client/fonts.mjs
var MAX_FONT_BYTES = 24 * 1024 * 1024;
var FONT_FORMATS = Object.freeze({
  ttf: "truetype",
  otf: "opentype",
  woff: "woff",
  woff2: "woff2"
});
var BUILTIN_FONTS = Object.freeze([
  { value: "", label: "\u9ED8\u8BA4" },
  { value: '"Microsoft YaHei", "PingFang SC", sans-serif', label: "\u65E0\u886C\u7EBF\uFF08\u96C5\u9ED1\uFF09" },
  { value: "serif", label: "\u886C\u7EBF" },
  { value: "monospace", label: "\u7B49\u5BBD" },
  { value: "SimSun, serif", label: "\u5B8B\u4F53" },
  { value: "SimHei, sans-serif", label: "\u9ED1\u4F53" },
  { value: "KaiTi, serif", label: "\u6977\u4F53" },
  { value: "FangSong, serif", label: "\u4EFF\u5B8B" }
]);
function fontFamilyFromName(name2) {
  const base = String(name2 ?? "").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]+/g, "-").replace(/^-+|-+$/g, "");
  return base === "" ? "custom-font" : base;
}
function extOf(name2) {
  const match = /\.([a-z0-9]+)$/i.exec(String(name2 ?? ""));
  return match === null ? "" : match[1].toLowerCase();
}
function normalizeFont(raw) {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) return null;
  const dataUrl = typeof raw.dataUrl === "string" ? raw.dataUrl : "";
  if (!/^data:[^;]+;base64,/i.test(dataUrl)) return null;
  const family = typeof raw.family === "string" && raw.family !== "" ? raw.family : fontFamilyFromName(raw.name);
  const format = FONT_FORMATS[raw.format] ?? "truetype";
  return {
    id: typeof raw.id === "string" && raw.id !== "" ? raw.id : makeId("font"),
    name: typeof raw.name === "string" && raw.name !== "" ? raw.name : "\u5B57\u4F53",
    family,
    format,
    dataUrl,
    createdAt: typeof raw.createdAt === "number" && Number.isFinite(raw.createdAt) ? raw.createdAt : 0
  };
}
function buildFontFace(record) {
  return '@font-face { font-family: "' + record.family + '"; src: url("' + record.dataUrl + '") format("' + record.format + '"); }';
}
function embedFonts(scene, fontMap) {
  const used = new Set(fontMap.keys());
  const fonts = {};
  for (const [id, record] of fontMap) {
    const referenced = scene.elements.some((el) => el.fontFamily === record.family);
    if (referenced) fonts[id] = record;
  }
  void used;
  return { ...scene, fonts };
}
function extractFonts(raw) {
  if (raw === null || typeof raw !== "object" || raw.fonts === null || typeof raw.fonts !== "object" || Array.isArray(raw.fonts)) return [];
  return Object.entries(raw.fonts).map(([, value]) => normalizeFont(value)).filter((record) => record !== null);
}
function createIdbFonts(dbName = "gal-view") {
  return createIdbStore(dbName, "fonts");
}

// .dsh-plugin/client/Editor.jsx
function TypeGlyph({ type }) {
  return /* @__PURE__ */ import_react2.default.createElement("span", { className: "gv-glyph gv-glyph-" + type, "aria-hidden": "true" });
}
function NumberField({ label, value, onValue, api, step = 1, min, max }) {
  const baseline = (0, import_react2.useRef)(null);
  const commit = () => {
    if (baseline.current !== null) {
      api.commitHistory(baseline.current);
      baseline.current = null;
    }
  };
  return /* @__PURE__ */ import_react2.default.createElement("label", { className: "gv-prop-row" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "gv-prop-label" }, label), /* @__PURE__ */ import_react2.default.createElement(
    "input",
    {
      type: "number",
      className: "gv-prop-input",
      value: Math.round(value * 100) / 100,
      step,
      min,
      max,
      onFocus: () => {
        baseline.current = api.snapshotScene();
      },
      onChange: (e) => {
        const n = parseFloat(e.target.value);
        if (Number.isFinite(n)) onValue(n);
      },
      onBlur: commit,
      onKeyDown: (e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }
    }
  ));
}
function TextField({ label, value, onValue, api, placeholder }) {
  const baseline = (0, import_react2.useRef)(null);
  const commit = () => {
    if (baseline.current !== null) {
      api.commitHistory(baseline.current);
      baseline.current = null;
    }
  };
  return /* @__PURE__ */ import_react2.default.createElement("label", { className: "gv-prop-row" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "gv-prop-label" }, label), /* @__PURE__ */ import_react2.default.createElement(
    "input",
    {
      type: "text",
      className: "gv-prop-input",
      value,
      placeholder,
      onFocus: () => {
        baseline.current = api.snapshotScene();
      },
      onChange: (e) => onValue(e.target.value),
      onBlur: commit,
      onKeyDown: (e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }
    }
  ));
}
function ColorField({ label, value, onValue, api }) {
  const baseline = (0, import_react2.useRef)(null);
  const commit = () => {
    if (baseline.current !== null) {
      api.commitHistory(baseline.current);
      baseline.current = null;
    }
  };
  return /* @__PURE__ */ import_react2.default.createElement("label", { className: "gv-prop-row" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "gv-prop-label" }, label), /* @__PURE__ */ import_react2.default.createElement("span", { className: "gv-prop-color" }, /* @__PURE__ */ import_react2.default.createElement(
    "input",
    {
      type: "color",
      value: /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#9b8cff",
      onFocus: () => {
        baseline.current = api.snapshotScene();
      },
      onChange: (e) => onValue(e.target.value),
      onBlur: commit
    }
  ), /* @__PURE__ */ import_react2.default.createElement("span", { className: "gv-prop-color-value" }, value)));
}
function CheckField({ label, checked, onToggle, api }) {
  return /* @__PURE__ */ import_react2.default.createElement("label", { className: "gv-prop-row" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "gv-prop-label" }, label), /* @__PURE__ */ import_react2.default.createElement(
    "input",
    {
      type: "checkbox",
      checked,
      onChange: (e) => {
        const before = api.snapshotScene();
        onToggle(e.target.checked);
        api.commitHistory(before);
      }
    }
  ));
}
function PropertiesPanel({ el, api, scene, assetsMap, fontsMap }) {
  const update = (patch) => api.updateElement(el.id, patch);
  const isShape = el.type === "text" || el.type === "dialogue-text" || el.type === "speaker-name" || el.type === "button" || el.type === "action-button" || el.type === "rect" || el.type === "circle" || el.type === "decoration" || el.type === "dialogue" || el.type === "background";
  return /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-props" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-props-head" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "gv-props-type" }, TYPE_LABELS[el.type] ?? el.type), /* @__PURE__ */ import_react2.default.createElement("span", { className: "gv-props-title" }, el.name !== "" ? el.name : "\u672A\u547D\u540D\u5143\u7D20")), /* @__PURE__ */ import_react2.default.createElement(TextField, { label: "\u540D\u79F0", value: el.name, onValue: (v) => update({ name: v }), api, placeholder: "\u5143\u7D20\u540D\u79F0" }), el.type === "action-button" && /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-props-sec" }, "\u529F\u80FD\u7ED1\u5B9A"), /* @__PURE__ */ import_react2.default.createElement("label", { className: "gv-prop-row" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "gv-prop-label" }, "\u7ED1\u5B9A\u529F\u80FD"), /* @__PURE__ */ import_react2.default.createElement(
    "select",
    {
      className: "gv-prop-input",
      value: el.action ?? "",
      onChange: (e) => {
        const before = api.snapshotScene();
        update({ action: e.target.value });
        api.commitHistory(before);
      }
    },
    /* @__PURE__ */ import_react2.default.createElement("option", { value: "" }, "\u65E0\uFF08\u88C5\u9970\u6309\u94AE\uFF09"),
    /* @__PURE__ */ import_react2.default.createElement("option", { value: "history" }, "\u5386\u53F2"),
    /* @__PURE__ */ import_react2.default.createElement("option", { value: "auto" }, "\u81EA\u52A8"),
    /* @__PURE__ */ import_react2.default.createElement("option", { value: "skip" }, "\u5FEB\u8FDB"),
    /* @__PURE__ */ import_react2.default.createElement("option", { value: "settings" }, "\u8BBE\u7F6E")
  )), /* @__PURE__ */ import_react2.default.createElement("p", { className: "gv-settings-hint" }, "\u6E38\u620F\u6A21\u5F0F\u4E2D\u70B9\u51FB\u89E6\u53D1\u7ED1\u5B9A\u529F\u80FD\uFF1B\u300C\u81EA\u52A8\u300D\u6309\u94AE\u4F1A\u968F\u5F00\u5173\u72B6\u6001\u9AD8\u4EAE\u3002\u6587\u672C/\u6837\u5F0F\u7167\u5E38\u81EA\u5B9A\u4E49\u3002")), el.type === "speaker-name" && /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-props-sec" }, "\u540D\u724C"), /* @__PURE__ */ import_react2.default.createElement("label", { className: "gv-prop-row" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "gv-prop-label" }, "\u663E\u793A\u65F6\u673A"), /* @__PURE__ */ import_react2.default.createElement(
    "select",
    {
      className: "gv-prop-input",
      value: el.role === "assistant" ? "assistant" : "player",
      onChange: (e) => {
        const before = api.snapshotScene();
        update({ role: e.target.value === "assistant" ? "assistant" : "player" });
        api.commitHistory(before);
      }
    },
    /* @__PURE__ */ import_react2.default.createElement("option", { value: "player" }, "\u73A9\u5BB6\u53F0\u8BCD\u65F6"),
    /* @__PURE__ */ import_react2.default.createElement("option", { value: "assistant" }, "AI \u53F0\u8BCD\u65F6")
  )), /* @__PURE__ */ import_react2.default.createElement("p", { className: "gv-settings-hint" }, "\u540D\u79F0\u5373\u4E0B\u65B9\u300C\u6587\u672C\u300D\u5B57\u6BB5\uFF0C\u81EA\u7531\u8BBE\u7F6E\uFF1B\u4EC5\u5BF9\u5E94\u4E00\u65B9\u8BF4\u8BDD\u65F6\u663E\u793A\u3002")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-props-sec" }, "\u4F4D\u7F6E"), /* @__PURE__ */ import_react2.default.createElement(NumberField, { label: "X", value: el.x, onValue: (v) => update({ x: v }), api }), /* @__PURE__ */ import_react2.default.createElement(NumberField, { label: "Y", value: el.y, onValue: (v) => update({ y: v }), api }), /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-props-sec" }, "\u5C3A\u5BF8"), /* @__PURE__ */ import_react2.default.createElement(NumberField, { label: "\u5BBD", value: el.w, min: 12, onValue: (v) => update({ w: v }), api }), /* @__PURE__ */ import_react2.default.createElement(NumberField, { label: "\u9AD8", value: el.h, min: 12, onValue: (v) => update({ h: v }), api }), /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-props-sec" }, "\u53D8\u6362"), /* @__PURE__ */ import_react2.default.createElement(NumberField, { label: "\u65CB\u8F6C\xB0", value: el.rotation, onValue: (v) => update({ rotation: v }), api }), /* @__PURE__ */ import_react2.default.createElement(NumberField, { label: "\u4E0D\u900F\u660E\u5EA6%", value: el.opacity * 100, min: 0, max: 100, onValue: (v) => update({ opacity: Math.min(1, Math.max(0, v / 100)) }), api }), /* @__PURE__ */ import_react2.default.createElement(NumberField, { label: "\u5C42\u7EA7", value: el.z, onValue: (v) => update({ z: v }), api }), /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-props-sec" }, "\u5916\u89C2"), el.type === "character" && /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, /* @__PURE__ */ import_react2.default.createElement(TextField, { label: "\u89D2\u8272\u540D", value: el.character?.name ?? "", onValue: (v) => update({ character: { ...el.character ?? {}, name: v } }), api }), /* @__PURE__ */ import_react2.default.createElement(TextField, { label: "\u5360\u4F4D\u6807\u7B7E", value: el.character?.label ?? "", onValue: (v) => update({ character: { ...el.character ?? {}, label: v } }), api }), /* @__PURE__ */ import_react2.default.createElement(ColorField, { label: "\u89D2\u8272\u8272", value: el.character?.color ?? "#9b8cff", onValue: (v) => update({ character: { ...el.character ?? {}, color: v }, color: v }), api })), isShape && /* @__PURE__ */ import_react2.default.createElement(TextField, { label: "\u80CC\u666F", value: el.background, onValue: (v) => update({ background: v }), api, placeholder: "CSS background \u503C" }), /* @__PURE__ */ import_react2.default.createElement(ColorField, { label: "\u8FB9\u6846\u8272", value: el.borderColor, onValue: (v) => update({ borderColor: v }), api }), /* @__PURE__ */ import_react2.default.createElement(NumberField, { label: "\u8FB9\u6846\u5BBD", value: el.borderWidth, min: 0, onValue: (v) => update({ borderWidth: v }), api }), /* @__PURE__ */ import_react2.default.createElement(NumberField, { label: "\u5706\u89D2", value: el.borderRadius, min: 0, onValue: (v) => update({ borderRadius: v }), api }), isShape && /* @__PURE__ */ import_react2.default.createElement(NumberField, { label: "\u5B57\u53F7", value: el.fontSize, min: 8, onValue: (v) => update({ fontSize: v }), api }), (isShape || el.type === "character") && /* @__PURE__ */ import_react2.default.createElement(FontPicker, { el, api, fontsMap }), isShape && /* @__PURE__ */ import_react2.default.createElement("label", { className: "gv-prop-row" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "gv-prop-label" }, "\u5BF9\u9F50"), /* @__PURE__ */ import_react2.default.createElement(
    "select",
    {
      className: "gv-prop-input",
      value: el.align ?? "left",
      onChange: (e) => {
        const before = api.snapshotScene();
        update({ align: e.target.value });
        api.commitHistory(before);
      }
    },
    /* @__PURE__ */ import_react2.default.createElement("option", { value: "left" }, "\u5DE6\u5BF9\u9F50"),
    /* @__PURE__ */ import_react2.default.createElement("option", { value: "center" }, "\u5C45\u4E2D"),
    /* @__PURE__ */ import_react2.default.createElement("option", { value: "right" }, "\u53F3\u5BF9\u9F50")
  )), isShape && /* @__PURE__ */ import_react2.default.createElement(TextField, { label: "\u6587\u672C", value: el.text, onValue: (v) => update({ text: v }), api, placeholder: "\u5360\u4F4D\u6587\u672C" }), el.type !== "background" && /* @__PURE__ */ import_react2.default.createElement(ColorField, { label: "\u6587\u5B57\u8272", value: el.color, onValue: (v) => update({ color: v }), api }), /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-props-sec" }, "\u56FE\u7247\u7D20\u6750"), /* @__PURE__ */ import_react2.default.createElement(AssetPicker, { el, api, assetsMap }), /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-props-sec" }, "\u72B6\u6001"), /* @__PURE__ */ import_react2.default.createElement(CheckField, { label: "\u9501\u5B9A", checked: el.locked, onToggle: (v) => update({ locked: v }), api }), /* @__PURE__ */ import_react2.default.createElement(CheckField, { label: "\u9690\u85CF", checked: el.hidden, onToggle: (v) => update({ hidden: v }), api }));
}
function FontPicker({ el, api, fontsMap }) {
  const update = (patch) => api.updateElement(el.id, patch);
  const custom = [...fontsMap.values()].sort((a, b) => b.createdAt - a.createdAt);
  const isCustom = custom.some((record) => record.family === el.fontFamily);
  return /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, /* @__PURE__ */ import_react2.default.createElement("label", { className: "gv-prop-row" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "gv-prop-label" }, "\u5B57\u4F53"), /* @__PURE__ */ import_react2.default.createElement(
    "select",
    {
      className: "gv-prop-input",
      value: el.fontFamily ?? "",
      onChange: (e) => {
        const before = api.snapshotScene();
        update({ fontFamily: e.target.value });
        api.commitHistory(before);
      }
    },
    BUILTIN_FONTS.map((font) => /* @__PURE__ */ import_react2.default.createElement("option", { key: font.value, value: font.value }, font.label)),
    custom.length > 0 && /* @__PURE__ */ import_react2.default.createElement("optgroup", { label: "\u81EA\u5B9A\u4E49\u5B57\u4F53" }, custom.map((record) => /* @__PURE__ */ import_react2.default.createElement("option", { key: record.id, value: record.family }, record.name)))
  )), isCustom && /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-prop-actions" }, /* @__PURE__ */ import_react2.default.createElement(
    "button",
    {
      type: "button",
      className: "gv-btn",
      onClick: () => {
        const record = custom.find((r) => r.family === el.fontFamily);
        if (record !== void 0) void api.removeFont(record.id);
      }
    },
    "\u4ECE\u5B57\u4F53\u5E93\u5220\u9664"
  )));
}
function AssetPicker({ el, api, assetsMap }) {
  const fileRef = (0, import_react2.useRef)(null);
  const apply2 = (assetId) => {
    const before = api.snapshotScene();
    api.updateElement(el.id, { image: assetId === "" ? null : assetId });
    api.commitHistory(before);
  };
  const onImportAndApply = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file === void 0) return;
    void api.importAssets([file]).then((result) => {
      if (result.ids.length > 0) apply2(result.ids[0]);
    });
  };
  const records = [...assetsMap.values()].sort((a, b) => b.createdAt - a.createdAt);
  const current = typeof el.image === "string" ? assetsMap.get(el.image) ?? null : null;
  return /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, /* @__PURE__ */ import_react2.default.createElement("label", { className: "gv-prop-row" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "gv-prop-label" }, "\u7D20\u6750"), /* @__PURE__ */ import_react2.default.createElement(
    "select",
    {
      className: "gv-prop-input",
      value: current !== null ? current.id : "",
      onChange: (e) => apply2(e.target.value)
    },
    /* @__PURE__ */ import_react2.default.createElement("option", { value: "" }, "\u65E0\uFF08\u5360\u4F4D\u56FE\u5F62\uFF09"),
    records.map((record) => /* @__PURE__ */ import_react2.default.createElement("option", { key: record.id, value: record.id }, record.name, record.width > 0 ? "\uFF08" + record.width + "\xD7" + record.height + "\uFF09" : ""))
  )), /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-prop-actions" }, /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "gv-btn", onClick: () => fileRef.current?.click() }, "\u5BFC\u5165\u7D20\u6750\u5E76\u5E94\u7528"), current !== null && /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "gv-btn", onClick: () => void api.removeAsset(current.id) }, "\u4ECE\u7D20\u6750\u5E93\u5220\u9664")), /* @__PURE__ */ import_react2.default.createElement(
    "input",
    {
      ref: fileRef,
      type: "file",
      accept: "image/png,image/jpeg,image/webp,image/gif",
      style: { display: "none" },
      onChange: onImportAndApply,
      "aria-label": "\u5BFC\u5165\u7D20\u6750\u5E76\u5E94\u7528"
    }
  ));
}
function ElementTree({ scene, api, selectedId, onSelect }) {
  const rows = [...sortElements(scene.elements)].reverse();
  return /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-tree" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-tree-root" }, /* @__PURE__ */ import_react2.default.createElement(TypeGlyph, { type: "scene" }), /* @__PURE__ */ import_react2.default.createElement("span", null, "SCENE"), /* @__PURE__ */ import_react2.default.createElement("span", { className: "gv-tree-count" }, rows.length, " \u5143\u7D20")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-tree-list", role: "tree", "aria-label": "\u5143\u7D20\u6811" }, rows.map((el) => /* @__PURE__ */ import_react2.default.createElement(
    "div",
    {
      key: el.id,
      role: "treeitem",
      "aria-selected": el.id === selectedId,
      tabIndex: 0,
      className: "gv-tree-row" + (el.id === selectedId ? " is-selected" : ""),
      onClick: () => onSelect(el.id),
      onKeyDown: (e) => {
        if (e.key === "Enter") onSelect(el.id);
      }
    },
    /* @__PURE__ */ import_react2.default.createElement(TypeGlyph, { type: el.type }),
    /* @__PURE__ */ import_react2.default.createElement("span", { className: "gv-tree-name" }, el.name !== "" ? el.name : TYPE_LABELS[el.type] ?? el.type),
    /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        type: "button",
        className: "gv-tree-toggle" + (el.locked ? " is-on" : ""),
        title: el.locked ? "\u89E3\u9501" : "\u9501\u5B9A",
        "aria-label": el.locked ? "\u89E3\u9501" : "\u9501\u5B9A",
        onClick: (e) => {
          e.stopPropagation();
          api.updateElement(el.id, { locked: !el.locked });
        }
      },
      "\u9501"
    ),
    /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        type: "button",
        className: "gv-tree-toggle" + (el.hidden ? " is-off" : ""),
        title: el.hidden ? "\u663E\u793A" : "\u9690\u85CF",
        "aria-label": el.hidden ? "\u663E\u793A" : "\u9690\u85CF",
        onClick: (e) => {
          e.stopPropagation();
          api.updateElement(el.id, { hidden: !el.hidden });
        }
      },
      "\u9690"
    )
  ))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-tree-scene" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-props-sec" }, "\u573A\u666F"), /* @__PURE__ */ import_react2.default.createElement(NumberField, { label: "\u821E\u53F0\u5BBD", value: scene.settings.stageW, min: 320, onValue: (v) => api.updateSettings({ stageW: v }), api }), /* @__PURE__ */ import_react2.default.createElement(NumberField, { label: "\u821E\u53F0\u9AD8", value: scene.settings.stageH, min: 180, onValue: (v) => api.updateSettings({ stageH: v }), api }), /* @__PURE__ */ import_react2.default.createElement(NumberField, { label: "\u7F51\u683C\u5C3A\u5BF8", value: scene.settings.gridSize, min: 4, max: 64, onValue: (v) => api.updateSettings({ gridSize: v }), api })));
}
var PANELS_KEY = "gal-view:editor-panels";
function loadPanels() {
  try {
    const raw = window.localStorage.getItem(PANELS_KEY);
    if (raw === null) return { tree: true, props: true };
    const parsed = JSON.parse(raw);
    return {
      tree: parsed.tree !== false,
      props: parsed.props !== false
    };
  } catch {
    return { tree: true, props: true };
  }
}
function savePanels(panels) {
  try {
    window.localStorage.setItem(PANELS_KEY, JSON.stringify(panels));
  } catch {
  }
}
function Editor({ scene, api, history, assetsMap, fontsMap, onExitEditor }) {
  const [selectedId, setSelectedId] = (0, import_react2.useState)(null);
  const [addOpen, setAddOpen] = (0, import_react2.useState)(false);
  const [addMenuPos, setAddMenuPos] = (0, import_react2.useState)(null);
  const [panels, setPanels] = (0, import_react2.useState)(loadPanels);
  const fileRef = (0, import_react2.useRef)(null);
  const assetFileRef = (0, import_react2.useRef)(null);
  const fontFileRef = (0, import_react2.useRef)(null);
  const editorRef = (0, import_react2.useRef)(null);
  const addBtnRef = (0, import_react2.useRef)(null);
  const addMenuRef = (0, import_react2.useRef)(null);
  const selected = scene.elements.find((el) => el.id === selectedId) ?? null;
  const toggleAddMenu = () => {
    if (addOpen) {
      setAddOpen(false);
      setAddMenuPos(null);
      return;
    }
    const btn = addBtnRef.current?.getBoundingClientRect();
    const root = editorRef.current?.getBoundingClientRect();
    setAddMenuPos(btn !== void 0 && root !== void 0 ? { left: btn.left - root.left, top: btn.bottom - root.top + 4 } : { left: 0, top: 44 });
    setAddOpen(true);
  };
  (0, import_react2.useEffect)(() => {
    if (!addOpen) return;
    const onDown = (e) => {
      const target = e.target;
      if (addMenuRef.current?.contains(target) || addBtnRef.current?.contains(target)) return;
      setAddOpen(false);
      setAddMenuPos(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("pointerdown", onDown);
    };
  }, [addOpen]);
  const togglePanel = (key) => {
    setPanels((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      savePanels(next);
      return next;
    });
  };
  (0, import_react2.useEffect)(() => {
    const onKey = (e) => {
      const target = e.target;
      const typing = target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable);
      if (e.key === "Escape") {
        if (selectedId !== null) setSelectedId(null);
        else onExitEditor();
        return;
      }
      if (typing) return;
      const mod = e.ctrlKey || e.metaKey;
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedId !== null) {
          e.preventDefault();
          api.removeElement(selectedId);
          setSelectedId(null);
        }
      } else if (mod && (e.key === "d" || e.key === "D")) {
        e.preventDefault();
        if (selectedId !== null) setSelectedId(api.duplicateElement(selectedId));
      } else if (mod && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        if (e.shiftKey) api.redo();
        else api.undo();
      } else if (mod && (e.key === "y" || e.key === "Y")) {
        e.preventDefault();
        api.redo();
      } else if (mod && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        downloadScene(api.exportScene());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [selectedId, api, onExitEditor]);
  const addElement = (type, role) => {
    const count = scene.elements.filter((el) => el.type === type).length;
    const letter = String.fromCharCode(65 + scene.elements.filter((el) => el.type === "character").length % 26);
    const id = api.addElement(type, { index: type === "character" ? count : 0, letter, role });
    setAddOpen(false);
    setAddMenuPos(null);
    setSelectedId(id);
  };
  const onImportFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file === void 0) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const ok = api.replaceScene(JSON.parse(String(reader.result)));
        if (ok) setSelectedId(null);
      } catch {
      }
    };
    reader.readAsText(file);
  };
  const onImportAssets = (e) => {
    const files = e.target.files;
    e.target.value = "";
    if (files === null || files.length === 0) return;
    void api.importAssets([...files]).then((result) => {
      if (result.added === 0) console.warn("[gal-view] \u7D20\u6750\u5BFC\u5165\u5931\u8D25\u6216\u5168\u90E8\u8DF3\u8FC7");
    });
  };
  const onImportFonts = (e) => {
    const files = e.target.files;
    e.target.value = "";
    if (files === null || files.length === 0) return;
    void api.importFonts([...files]).then((result) => {
      if (result.added === 0) console.warn("[gal-view] \u5B57\u4F53\u5BFC\u5165\u5931\u8D25\u6216\u5168\u90E8\u8DF3\u8FC7");
    });
  };
  return /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-editor", ref: editorRef }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-editor-toolbar", role: "toolbar", "aria-label": "\u7F16\u8F91\u5668\u5DE5\u5177\u680F" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-toolbar-group" }, /* @__PURE__ */ import_react2.default.createElement("button", { ref: addBtnRef, type: "button", className: "gv-btn gv-btn-accent", onClick: toggleAddMenu }, "\uFF0B \u6DFB\u52A0\u5143\u7D20"), /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "gv-btn", disabled: selected === null, onClick: () => {
    if (selected !== null) setSelectedId(api.duplicateElement(selected.id));
  }, title: "Ctrl+D" }, "\u590D\u5236"), /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "gv-btn", disabled: selected === null, onClick: () => {
    if (selected !== null) {
      api.removeElement(selected.id);
      setSelectedId(null);
    }
  }, title: "Delete" }, "\u5220\u9664")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-toolbar-group" }, /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "gv-btn", disabled: selected === null, onClick: () => selected !== null && api.reorderElement(selected.id, "up") }, "\u4E0A\u79FB"), /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "gv-btn", disabled: selected === null, onClick: () => selected !== null && api.reorderElement(selected.id, "down") }, "\u4E0B\u79FB"), /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "gv-btn", disabled: selected === null, onClick: () => selected !== null && api.reorderElement(selected.id, "top") }, "\u7F6E\u9876"), /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "gv-btn", disabled: selected === null, onClick: () => selected !== null && api.reorderElement(selected.id, "bottom") }, "\u7F6E\u5E95")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-toolbar-group" }, /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "gv-btn gv-toggle" + (scene.settings.showGrid ? " is-on" : ""), onClick: () => api.updateSettings({ showGrid: !scene.settings.showGrid }) }, "\u7F51\u683C"), /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "gv-btn gv-toggle" + (scene.settings.snap ? " is-on" : ""), onClick: () => api.updateSettings({ snap: !scene.settings.snap }) }, "\u5438\u9644")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-toolbar-group" }, /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "gv-btn gv-toggle" + (panels.tree ? " is-on" : ""), "aria-pressed": panels.tree, onClick: () => togglePanel("tree") }, "\u5143\u7D20\u6811"), /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "gv-btn gv-toggle" + (panels.props ? " is-on" : ""), "aria-pressed": panels.props, onClick: () => togglePanel("props") }, "\u5C5E\u6027")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-toolbar-group" }, /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "gv-btn", disabled: history.undo === 0, onClick: () => api.undo(), title: "Ctrl+Z" }, "\u64A4\u9500"), /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "gv-btn", disabled: history.redo === 0, onClick: () => api.redo(), title: "Ctrl+Y" }, "\u91CD\u505A")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-toolbar-group gv-toolbar-right" }, /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "gv-btn", onClick: () => fileRef.current?.click() }, "\u5BFC\u5165\u573A\u666F"), /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "gv-btn", onClick: () => assetFileRef.current?.click() }, "\u5BFC\u5165\u7D20\u6750"), /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "gv-btn", onClick: () => fontFileRef.current?.click() }, "\u5BFC\u5165\u5B57\u4F53"), /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "gv-btn", onClick: () => downloadScene(api.exportScene()), title: "Ctrl+S" }, "\u5BFC\u51FA"), /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "gv-btn", onClick: () => {
    api.resetScene();
    setSelectedId(null);
  } }, "\u91CD\u7F6E"), /* @__PURE__ */ import_react2.default.createElement("input", { ref: fileRef, type: "file", accept: "application/json,.json", style: { display: "none" }, onChange: onImportFile, "aria-label": "\u5BFC\u5165\u573A\u666F JSON" }), /* @__PURE__ */ import_react2.default.createElement("input", { ref: assetFileRef, type: "file", accept: "image/png,image/jpeg,image/webp,image/gif", multiple: true, style: { display: "none" }, onChange: onImportAssets, "aria-label": "\u5BFC\u5165\u56FE\u7247\u7D20\u6750" }), /* @__PURE__ */ import_react2.default.createElement("input", { ref: fontFileRef, type: "file", accept: ".ttf,.otf,.woff,.woff2", multiple: true, style: { display: "none" }, onChange: onImportFonts, "aria-label": "\u5BFC\u5165\u5B57\u4F53\u6587\u4EF6" }))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-editor-body" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-editor-side gv-editor-tree" + (panels.tree ? "" : " is-collapsed"), "aria-hidden": !panels.tree }, /* @__PURE__ */ import_react2.default.createElement(ElementTree, { scene, api, selectedId, onSelect: setSelectedId })), /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-editor-canvas" }, /* @__PURE__ */ import_react2.default.createElement(
    StageView,
    {
      scene,
      assetsMap,
      mode: "editor",
      line: null,
      type: { target: "", shown: "", done: true },
      running: false,
      selectedId,
      onSelect: setSelectedId,
      api,
      onSkip: () => {
      }
    }
  )), /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-editor-side gv-editor-props" + (panels.props ? "" : " is-collapsed"), "aria-hidden": !panels.props }, selected !== null ? /* @__PURE__ */ import_react2.default.createElement(PropertiesPanel, { el: selected, api, scene, assetsMap, fontsMap }) : /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-props-empty" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "gv-props-empty-mark", "aria-hidden": "true" }), /* @__PURE__ */ import_react2.default.createElement("p", null, "\u672A\u9009\u62E9\u5143\u7D20"), /* @__PURE__ */ import_react2.default.createElement("p", { className: "gv-props-empty-hint" }, "\u5728\u753B\u5E03\u6216\u5143\u7D20\u6811\u4E2D\u70B9\u9009\u5143\u7D20\uFF0C\u7F16\u8F91\u5176\u4F4D\u7F6E\u3001\u5C3A\u5BF8\u4E0E\u5916\u89C2")))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-editor-spacer", "aria-hidden": "true" }), addOpen && addMenuPos !== null && /* @__PURE__ */ import_react2.default.createElement("div", { className: "gv-add-menu", role: "menu", ref: addMenuRef, style: { left: addMenuPos.left, top: addMenuPos.top } }, ELEMENT_TYPES.flatMap((type) => {
    if (type === "speaker-name") {
      return [
        { key: "speaker-player", label: "\u73A9\u5BB6\u540D\u724C", role: "player", type },
        { key: "speaker-ai", label: "AI \u540D\u724C", role: "assistant", type }
      ];
    }
    return [{ key: type, label: TYPE_LABELS[type], role: void 0, type }];
  }).map((entry) => /* @__PURE__ */ import_react2.default.createElement("button", { key: entry.key, type: "button", role: "menuitem", onClick: () => addElement(entry.type, entry.role) }, /* @__PURE__ */ import_react2.default.createElement(TypeGlyph, { type: entry.type }), entry.label))));
}
function downloadScene(json) {
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "gal-scene.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
}

// .dsh-plugin/client/typewriter.mjs
var SPEEDS = Object.freeze({ slow: 24, normal: 60, fast: 240 });
function createTypeState() {
  return { target: "", shown: "", done: true };
}
function setTarget(state, text) {
  const target = typeof text === "string" ? text : "";
  if (target === state.target) return state;
  const keep = target.startsWith(state.shown);
  const shown = keep ? state.shown : "";
  return { target, shown, done: shown === target };
}
function skip(state) {
  if (state.done) return state;
  return { target: state.target, shown: state.target, done: true };
}
function advance(state, dtMs, speed = SPEEDS.normal) {
  if (state.done || dtMs <= 0) return state;
  const gap = state.target.length - state.shown.length;
  if (gap <= 0) return { target: state.target, shown: state.target, done: true };
  const chars = Math.max(1, Math.round(speed * dtMs / 1e3));
  const next = state.target.slice(0, state.shown.length + chars);
  if (next === state.shown) return state;
  return { target: state.target, shown: next, done: next === state.target };
}

// .dsh-plugin/client/transcript.mjs
function cleanDialogueText(text) {
  if (typeof text !== "string") return "";
  return text.replace(/\r\n?/g, "\n").replace(/^[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").trim();
}
function contentToText(blocks) {
  if (!Array.isArray(blocks)) return "";
  return cleanDialogueText(blocks.map((block) => {
    if (block === null || typeof block !== "object") return "";
    if (typeof block.text === "string") return block.text;
    return "";
  }).filter((text) => text !== "").join("\n"));
}
function assistantToText(blocks) {
  if (!Array.isArray(blocks)) return "";
  return cleanDialogueText(blocks.map((block) => {
    if (block === null || typeof block !== "object") return "";
    if (block.kind === "text" && typeof block.text === "string") return block.text;
    return "";
  }).filter((text) => text !== "").join("\n"));
}
function partialToText(partial) {
  if (partial === null || typeof partial !== "object") return "";
  return assistantToText(partial.blocks);
}
function partialStatus(partial) {
  if (partial === null || typeof partial !== "object" || !Array.isArray(partial.blocks)) return null;
  const blocks = partial.blocks;
  const hasTool = blocks.some((b) => b !== null && typeof b === "object" && b.kind === "tool-call");
  const hasReasoning = blocks.some((b) => b !== null && typeof b === "object" && b.kind === "reasoning" && (b.text ?? "") !== "");
  const hasText = blocks.some((b) => b !== null && typeof b === "object" && b.kind === "text" && (b.text ?? "") !== "");
  if (hasText && !hasTool) return null;
  if (hasReasoning && !hasTool) return "\u601D\u8003\u4E2D";
  return "\u7F16\u5199\u4EE3\u7801\u4E2D";
}
function deriveStatus({ running, partial, pending = [], lastLine = null, promptError = null }) {
  if (!running) {
    if (lastLine !== null && lastLine.error === true) return "\u51FA\u9519";
    if (promptError !== null && typeof promptError === "object" && promptError.op === "send") return "\u53D1\u9001\u5931\u8D25";
    return null;
  }
  if (Array.isArray(pending) && pending.length > 0) return "\u7B49\u5F85\u56DE\u5E94";
  const hasText = partial !== null && typeof partial === "object" && Array.isArray(partial.blocks) && partial.blocks.some((b) => b !== null && typeof b === "object" && b.kind === "text" && (b.text ?? "") !== "");
  if (hasText) return null;
  return partialStatus(partial) ?? "\u7F16\u5199\u4EE3\u7801\u4E2D";
}
function lineFromNode(node) {
  if (node === null || typeof node !== "object") return null;
  const key = "node-" + String(node.seq ?? "x");
  switch (node.kind) {
    case "user": {
      const text = contentToText(node.content);
      return text === "" ? null : { key, kind: "player", text };
    }
    case "steering": {
      const text = contentToText(node.content);
      return text === "" ? null : { key, kind: "player", text };
    }
    case "assistant": {
      const text = assistantToText(node.blocks);
      return text === "" ? null : { key, kind: "assistant", text };
    }
    case "context": {
      const text = contentToText(node.content);
      return text === "" ? null : { key, kind: "system", text: "[\u4E0A\u4E0B\u6587] " + text };
    }
    case "command": {
      const name2 = typeof node.name === "string" ? node.name : "";
      const args = typeof node.args === "string" ? node.args : "";
      const failed = node.outcome?.kind === "error" && typeof node.outcome.text === "string";
      return { key, kind: "system", text: (failed ? "[\u547D\u4EE4\u5931\u8D25] /" : "/") + name2 + args };
    }
    case "compaction": {
      const summary = typeof node.summary === "string" && node.summary !== "";
      return { key, kind: "system", text: summary ? "[\u5BF9\u8BDD\u538B\u7F29] " + node.summary : "[\u5BF9\u8BDD\u538B\u7F29\u68C0\u67E5\u70B9]" };
    }
    case "turn-error": {
      return { key, kind: "system", text: "[\u9519\u8BEF] " + String(node.message ?? "\u56DE\u5408\u5931\u8D25"), error: true };
    }
    case "model-retry": {
      return { key, kind: "system", text: "[\u7B49\u5F85\u6A21\u578B\u91CD\u8BD5]" };
    }
    case "turn-max-tokens": {
      return { key, kind: "system", text: "[\u5DF2\u8FBE\u5230\u8F93\u51FA\u4E0A\u9650]" };
    }
    case "unknown": {
      return { key, kind: "system", text: "[\u672A\u77E5\u4E8B\u4EF6 " + String(node.type ?? "") + "]" };
    }
    default:
      return null;
  }
}
function nodesToLines(nodes) {
  if (!Array.isArray(nodes)) return [];
  const out = [];
  for (const node of nodes) {
    const line = lineFromNode(node);
    if (line !== null) out.push(line);
  }
  return out;
}
var SYSTEM_NAME = "\u7CFB\u7EDF";
function systemSpeaker() {
  return { name: SYSTEM_NAME, color: "#8f9bbd" };
}
function playerSpeaker(scene) {
  const name2 = scene.settings.playerName;
  return { name: name2 === "" ? "\u4F60" : name2, color: "#4f8cff" };
}
function assistantSpeaker(scene) {
  const el = scene.elements.find((e) => e.id === scene.settings.assistantSpeaker);
  if (el !== void 0 && el.type === "character" && el.character) {
    return { name: el.character.name, color: el.character.color };
  }
  return systemSpeaker();
}
function roleNameElement(scene, role) {
  return scene.elements.find((el) => el.type === "speaker-name" && el.role === role) ?? null;
}
function playerDisplayName(scene) {
  const el = roleNameElement(scene, "player");
  if (el !== null && el.text !== "") return el.text;
  return playerSpeaker(scene).name;
}
function assistantDisplayName(scene) {
  const el = roleNameElement(scene, "assistant");
  if (el !== null && el.text !== "") return el.text;
  return assistantSpeaker(scene).name;
}
function speakerFor(scene, kind) {
  switch (kind) {
    case "player": {
      const el = roleNameElement(scene, "player");
      return { name: playerDisplayName(scene), color: el?.color ?? playerSpeaker(scene).color };
    }
    case "assistant": {
      const el = roleNameElement(scene, "assistant");
      return { name: assistantDisplayName(scene), color: el?.color ?? assistantSpeaker(scene).color };
    }
    default:
      return systemSpeaker();
  }
}
function welcomeLine(scene) {
  const lines = scene.settings.welcome;
  if (lines.length === 0) return null;
  return { key: "welcome", kind: "assistant", text: lines.join("\n\n") };
}

// .dsh-plugin/client/paging.mjs
var MAX_PAGES = 24;
var BREAK_PUNCT = /[。！？!?；;…\n]/;
function splitPages(text, fits, { maxPages = MAX_PAGES } = {}) {
  if (text === "") return [""];
  const pages = [];
  let start = 0;
  while (start < text.length && pages.length < maxPages) {
    const rest = text.slice(start);
    if (fits(rest)) {
      pages.push(rest);
      start = text.length;
      break;
    }
    let lo = 1;
    let hi = rest.length - 1;
    let best = 0;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (fits(rest.slice(0, mid))) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    if (best === 0) {
      pages.push(rest.slice(0, 1));
      start += 1;
    } else {
      let cut = best;
      const maxBacktrack = Math.min(48, Math.floor(best * 0.5));
      for (let i = best - 1; i >= best - maxBacktrack && i >= 0; i--) {
        if (BREAK_PUNCT.test(rest[i])) {
          cut = i + 1;
          break;
        }
      }
      if (cut < Math.ceil(best * 0.5)) cut = best;
      pages.push(rest.slice(0, cut));
      start += cut;
    }
  }
  if (start < text.length && pages.length > 0) {
    pages[pages.length - 1] += text.slice(start);
  }
  const kept = pages.map((page) => page.replace(/^\n+/, "")).filter((page) => page !== "");
  return kept.length === 0 ? [""] : kept;
}
function createFitsMeasurer(box) {
  const el = document.createElement("div");
  el.setAttribute("data-gal-measure", "");
  el.style.cssText = [
    "position: absolute;",
    "left: -99999px; top: 0;",
    "visibility: hidden;",
    "pointer-events: none;",
    "box-sizing: border-box;",
    "padding: 2px 10px;",
    "line-height: 1.8;",
    "white-space: pre-wrap;",
    "word-break: break-word;",
    "overflow: hidden;",
    "font-family: " + (box.fontFamily !== void 0 && box.fontFamily !== "" ? box.fontFamily : "inherit") + ";",
    "width: " + box.width + "px;",
    "height: " + box.height + "px;",
    "font-size: " + box.fontSize + "px;"
  ].join(" ");
  document.body.appendChild(el);
  return {
    fits(prefix) {
      el.textContent = prefix;
      return el.scrollHeight <= el.clientHeight;
    },
    dispose() {
      el.remove();
    }
  };
}

// .dsh-plugin/client/GalView.jsx
var STATUS_DWELL_MS = 1500;
var STATUS_MAX_WAIT_MS = 6e3;
function useSend(inputActions, draft, setDraft) {
  return (0, import_react3.useCallback)(() => {
    const text = draft.trim();
    if (text === "") return;
    inputActions.setDraft(text);
    inputActions.submit();
    setDraft("");
  }, [draft, inputActions, setDraft]);
}
function HistoryPanel({ scene, lines, onClose }) {
  const listRef = (0, import_react3.useRef)(null);
  (0, import_react3.useEffect)(() => {
    const list = listRef.current;
    if (list !== null) list.scrollTop = list.scrollHeight;
  }, [lines]);
  (0, import_react3.useEffect)(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  return /* @__PURE__ */ import_react3.default.createElement("div", { className: "gv-history", role: "dialog", "aria-label": "\u5BF9\u8BDD\u5386\u53F2" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "gv-history-head" }, /* @__PURE__ */ import_react3.default.createElement("span", null, "\u5386\u53F2"), /* @__PURE__ */ import_react3.default.createElement("button", { type: "button", className: "gv-btn", onClick: onClose }, "\u5173\u95ED")), /* @__PURE__ */ import_react3.default.createElement("div", { className: "gv-history-list", ref: listRef }, lines.length === 0 && /* @__PURE__ */ import_react3.default.createElement("div", { className: "gv-history-empty" }, "\u8FD8\u6CA1\u6709\u5BF9\u8BDD\u8BB0\u5F55"), lines.map((line) => {
    const speaker = speakerFor(scene, line.kind);
    return /* @__PURE__ */ import_react3.default.createElement("div", { className: "gv-history-row", key: line.key }, /* @__PURE__ */ import_react3.default.createElement("span", { className: "gv-history-name", style: { color: speaker.color } }, speaker.name), /* @__PURE__ */ import_react3.default.createElement("p", { className: "gv-history-text" }, line.text));
  })));
}
function SettingsPanel({ scene, api, onClose }) {
  const beforeRef = (0, import_react3.useRef)(null);
  (0, import_react3.useEffect)(() => {
    beforeRef.current = api.snapshotScene();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (beforeRef.current !== null) {
        api.commitHistory(beforeRef.current);
        beforeRef.current = null;
      }
    };
  }, [api, onClose]);
  const characters = scene.elements.filter((el) => el.type === "character" && el.character);
  return /* @__PURE__ */ import_react3.default.createElement("div", { className: "gv-settings", role: "dialog", "aria-label": "\u8BBE\u7F6E" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "gv-settings-head" }, /* @__PURE__ */ import_react3.default.createElement("span", null, "\u8BBE\u7F6E"), /* @__PURE__ */ import_react3.default.createElement("button", { type: "button", className: "gv-btn", onClick: onClose }, "\u5173\u95ED")), /* @__PURE__ */ import_react3.default.createElement("label", { className: "gv-settings-row" }, /* @__PURE__ */ import_react3.default.createElement("span", null, "\u8BF4\u8BDD\u89D2\u8272"), /* @__PURE__ */ import_react3.default.createElement(
    "select",
    {
      value: scene.settings.assistantSpeaker,
      onChange: (e) => api.updateSettings({ assistantSpeaker: e.target.value })
    },
    characters.map((el) => /* @__PURE__ */ import_react3.default.createElement("option", { key: el.id, value: el.id }, el.character.name, "\uFF08", el.character.label, "\uFF09")),
    /* @__PURE__ */ import_react3.default.createElement("option", { value: "" }, "\u7CFB\u7EDF")
  )), /* @__PURE__ */ import_react3.default.createElement("label", { className: "gv-settings-row" }, /* @__PURE__ */ import_react3.default.createElement("span", null, "\u73A9\u5BB6\u540D"), /* @__PURE__ */ import_react3.default.createElement(
    "input",
    {
      type: "text",
      value: scene.settings.playerName,
      onChange: (e) => api.updateSettings({ playerName: e.target.value }),
      placeholder: "\u4F60"
    }
  )), /* @__PURE__ */ import_react3.default.createElement("label", { className: "gv-settings-row" }, /* @__PURE__ */ import_react3.default.createElement("span", null, "\u6253\u5B57\u901F\u5EA6"), /* @__PURE__ */ import_react3.default.createElement("select", { value: scene.settings.typeSpeed, onChange: (e) => api.updateSettings({ typeSpeed: e.target.value }) }, /* @__PURE__ */ import_react3.default.createElement("option", { value: "slow" }, "\u6162"), /* @__PURE__ */ import_react3.default.createElement("option", { value: "normal" }, "\u6B63\u5E38"), /* @__PURE__ */ import_react3.default.createElement("option", { value: "fast" }, "\u5FEB"))), /* @__PURE__ */ import_react3.default.createElement("p", { className: "gv-settings-hint" }, "\u89D2\u8272\u540D\u79F0/\u989C\u8272\u5728\u7F16\u8F91\u6A21\u5F0F\u4E2D\u4FEE\u6539\uFF1B\u8BF4\u8BDD\u89D2\u8272\u5F15\u7528\u4F1A\u5B9E\u65F6\u751F\u6548\u3002"));
}
function useFillSessionArea(rootRef) {
  (0, import_react3.useEffect)(() => {
    const root = rootRef.current;
    if (root === null) return;
    const scrollBody = root.closest("[data-conversation-scroll]");
    const seat = scrollBody?.querySelector(":scope > [data-composer-seat]") ?? null;
    if (scrollBody === null || seat === null) return;
    const prev = {
      seatDisplay: seat.style.display,
      overflow: scrollBody.style.overflow,
      position: scrollBody.style.position
    };
    seat.style.display = "none";
    scrollBody.style.overflow = "hidden";
    scrollBody.style.position = "relative";
    root.setAttribute("data-gal-fills", "");
    return () => {
      seat.style.display = prev.seatDisplay;
      scrollBody.style.overflow = prev.overflow;
      scrollBody.style.position = prev.position;
      root.removeAttribute("data-gal-fills");
    };
  }, [rootRef]);
}
function GalView({ useSession, inputActions, useScene, useHistory, useAssets, useFonts, useStore, actions, api }) {
  const scene = useScene((s) => s);
  const history = useHistory((h) => h);
  const assets = useAssets((a) => a);
  const fonts = useFonts((f) => f);
  const readState = useStore((s) => s);
  const nodes = useSession((s) => s.nodes);
  const partial = useSession((s) => s.partial);
  const running = useSession((s) => s.running);
  const blank = useSession((s) => s.blank);
  const runningCalls = useSession((s) => s.runningCalls);
  const pending = useSession((s) => s.pending);
  const promptError = useSession((s) => s.promptError);
  const [mode, setMode] = (0, import_react3.useState)("game");
  const [auto, setAuto] = (0, import_react3.useState)(false);
  const [historyOpen, setHistoryOpen] = (0, import_react3.useState)(false);
  const [settingsOpen, setSettingsOpen] = (0, import_react3.useState)(false);
  const [draft, setDraft] = (0, import_react3.useState)("");
  const [type, setType] = (0, import_react3.useState)(createTypeState);
  const [pages, setPages] = (0, import_react3.useState)([]);
  const [pageIndex, setPageIndex] = (0, import_react3.useState)(0);
  const rootRef = (0, import_react3.useRef)(null);
  const readStateRef = (0, import_react3.useRef)(readState);
  readStateRef.current = readState;
  const restoredKeyRef = (0, import_react3.useRef)(null);
  useFillSessionArea(rootRef);
  const lines = (0, import_react3.useMemo)(() => nodesToLines(nodes), [nodes]);
  const liveText = running ? partialToText(partial) : "";
  const lastLine = lines.length > 0 ? lines[lines.length - 1] : null;
  const aiStatus = deriveStatus({ running, partial, pending, lastLine, promptError });
  const fallback = blank ? welcomeLine(scene) : null;
  const pendingPlayer = running && lastLine !== null && lastLine.kind === "player" && liveText === "" ? lastLine : null;
  const streamedTypeRef = (0, import_react3.useRef)(null);
  const wasRunningRef = (0, import_react3.useRef)(false);
  (0, import_react3.useEffect)(() => {
    const was = wasRunningRef.current;
    wasRunningRef.current = running;
    if (!running) return;
    if (!was) streamedTypeRef.current = null;
    if (liveText !== "") streamedTypeRef.current = type;
  }, [running, type, liveText]);
  const [statusHold, setStatusHold] = (0, import_react3.useState)(false);
  const [dwellSince, setDwellSince] = (0, import_react3.useState)(null);
  (0, import_react3.useEffect)(() => {
    if (!running || pendingPlayer === null) {
      setStatusHold(false);
      setDwellSince(null);
      return;
    }
    if (type.done && dwellSince === null) setDwellSince(Date.now());
  }, [running, pendingPlayer, type.done, dwellSince]);
  const modelStateArrived = running && (liveText !== "" || partial !== null && typeof partial === "object" && Array.isArray(partial.blocks) && partial.blocks.length > 0 || Array.isArray(runningCalls) && runningCalls.length > 0 || Array.isArray(pending) && pending.length > 0);
  (0, import_react3.useEffect)(() => {
    if (!running || !type.done || pendingPlayer === null) {
      setStatusHold(false);
      return;
    }
    const base = dwellSince ?? Date.now();
    const delay = modelStateArrived ? Math.max(0, STATUS_DWELL_MS - (Date.now() - base)) : STATUS_MAX_WAIT_MS;
    const timer = setTimeout(() => {
      setStatusHold(true);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [running, type.done, pendingPlayer, modelStateArrived, dwellSince]);
  const capturedTarget = streamedTypeRef.current !== null && typeof streamedTypeRef.current.target === "string" ? streamedTypeRef.current.target : "";
  const capturedLine = capturedTarget !== "" ? { key: "live", kind: "assistant", text: capturedTarget } : null;
  const capturedQuiet = Array.isArray(runningCalls) && runningCalls.length === 0 && (Array.isArray(pending) && pending.length === 0);
  const capturedLanded = capturedQuiet && capturedLine !== null && lastLine !== null && lastLine.kind === "assistant" && lastLine.text.startsWith(capturedTarget);
  const capturedPending = capturedQuiet && capturedLine !== null && !capturedLanded && (lastLine === null || lastLine.kind === "player");
  const showStatusPage = running && liveText === "" && !capturedLanded && !capturedPending && (statusHold || pendingPlayer === null);
  const currentLine = showStatusPage ? { key: "live", kind: "assistant", text: "" } : running ? pendingPlayer ?? (liveText !== "" ? { key: "live", kind: "assistant", text: liveText } : capturedLanded ? lastLine : capturedPending ? capturedLine : { key: "live", kind: "assistant", text: "" }) : capturedPending ? capturedLine : lastLine ?? fallback;
  const speaker = currentLine !== null ? speakerFor(scene, currentLine.kind) : speakerFor(scene, "assistant");
  const dtextSceneEl = scene.elements.find((el) => el.type === "dialogue-text" && !el.hidden) ?? null;
  const fullText = currentLine !== null ? currentLine.text : "";
  const restorePendingRef = (0, import_react3.useRef)(true);
  const pagesTextRef = (0, import_react3.useRef)(null);
  (0, import_react3.useEffect)(() => {
    restorePendingRef.current = true;
    setPages([]);
    setPageIndex(0);
    if (running || currentLine === null || currentLine.text === "" || dtextSceneEl === null) {
      restorePendingRef.current = false;
      return;
    }
    let cancelled = false;
    const measure = () => {
      const measurer = createFitsMeasurer({
        width: dtextSceneEl.w,
        height: dtextSceneEl.h,
        fontSize: dtextSceneEl.fontSize,
        fontFamily: dtextSceneEl.fontFamily
      });
      const nextPages = splitPages(currentLine.text, (prefix) => measurer.fits(prefix));
      measurer.dispose();
      if (cancelled) return;
      restorePendingRef.current = false;
      setPages(nextPages);
      pagesTextRef.current = currentLine.text;
      const stored = readStateRef.current;
      if (stored.lineKey === currentLine.key && restoredKeyRef.current !== currentLine.key) {
        restoredKeyRef.current = currentLine.key;
        const idx = Math.min(stored.pageIndex, nextPages.length - 1);
        setPageIndex(idx);
        const page = nextPages[idx] ?? currentLine.text;
        const keep = page.startsWith(stored.shown) ? stored.shown : "";
        setType({ target: page, shown: keep, done: keep === page });
        return;
      }
      const streamed = streamedTypeRef.current;
      if (streamed !== null && typeof streamed.target === "string" && streamed.target !== "" && currentLine.text.startsWith(streamed.target)) {
        streamedTypeRef.current = null;
        const page = nextPages[0] ?? currentLine.text;
        if (page.startsWith(streamed.shown)) {
          setType({ target: page, shown: streamed.shown, done: streamed.shown === page });
        } else {
          setType({ target: page, shown: page, done: true });
        }
      }
    };
    const timer = setTimeout(measure, 0);
    if (typeof document !== "undefined" && typeof document.fonts !== "undefined" && document.fonts.ready !== void 0) {
      void document.fonts.ready.then(() => {
        if (!cancelled) measure();
      });
    }
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [running, fullText, dtextSceneEl]);
  const pagesReady = !running && pages.length > 0 && pagesTextRef.current === fullText;
  const pageText = pagesReady ? pages[Math.min(pageIndex, pages.length - 1)] ?? "" : fullText;
  const hasNextPage = pagesReady && pageIndex < pages.length - 1;
  const pinScroll = running || dtextSceneEl !== null && !pagesReady;
  const typedTarget = pageText;
  const restoreKey = running && pendingPlayer !== null ? pendingPlayer.key : currentLine?.key ?? null;
  (0, import_react3.useEffect)(() => {
    if (restorePendingRef.current) return;
    if (restoreKey === null) return;
    actions.saveProgress({
      lineKey: restoreKey,
      pageIndex,
      shown: type.shown,
      done: type.done,
      dwellSince,
      statusHold
    });
  }, [restoreKey, pageIndex, type.done, dwellSince, statusHold, actions]);
  const saveRef = (0, import_react3.useRef)(null);
  saveRef.current = { key: restoreKey, pageIndex, type, dwellSince, statusHold, actions };
  (0, import_react3.useEffect)(() => () => {
    const s = saveRef.current;
    if (s === null || s.key === null) return;
    s.actions.saveProgress({
      lineKey: s.key,
      pageIndex: s.pageIndex,
      shown: s.type.shown,
      done: s.type.done,
      dwellSince: s.dwellSince,
      statusHold: s.statusHold
    });
  }, []);
  const runningRestoredRef = (0, import_react3.useRef)(null);
  (0, import_react3.useEffect)(() => {
    if (!running || pendingPlayer === null) return;
    const key = pendingPlayer.key;
    const stored = readStateRef.current;
    if (stored.lineKey !== key || runningRestoredRef.current === key) return;
    runningRestoredRef.current = key;
    const target = pendingPlayer.text;
    const keep = target.startsWith(stored.shown) ? stored.shown : "";
    setType({ target, shown: keep, done: keep === target || stored.statusHold === true });
    if (stored.dwellSince !== null && stored.dwellSince !== void 0) setDwellSince(stored.dwellSince);
    if (stored.statusHold === true) setStatusHold(true);
  }, [running, pendingPlayer]);
  (0, import_react3.useEffect)(() => {
    setType((t) => {
      const next = setTarget(t, typedTarget);
      return auto ? skip(next) : next;
    });
  }, [typedTarget, auto]);
  (0, import_react3.useEffect)(() => {
    if (!auto || !type.done || running || !hasNextPage) return;
    const timer = setTimeout(() => {
      setPageIndex(pageIndex + 1);
    }, 1500);
    return () => {
      clearTimeout(timer);
    };
  }, [auto, type.done, running, hasNextPage, pageIndex]);
  const speed = SPEEDS[scene.settings.typeSpeed] ?? SPEEDS.normal;
  (0, import_react3.useEffect)(() => {
    if (type.done) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now) => {
      const dt = now - last;
      last = now;
      setType((t) => advance(t, dt, speed));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [type.done, speed]);
  const skipTyping = (0, import_react3.useCallback)(() => {
    setType((t) => skip(t));
  }, []);
  const onTextClick = (0, import_react3.useCallback)(() => {
    if (running) {
      skipTyping();
      return;
    }
    setType((t) => t.done ? t : skip(t));
    if (type.done && hasNextPage) {
      setPageIndex(pageIndex + 1);
    }
  }, [running, type.done, hasNextPage, pageIndex, skipTyping]);
  const send = useSend(inputActions, draft, setDraft);
  const handleAction = (0, import_react3.useCallback)((action) => {
    switch (action) {
      case "history":
        setHistoryOpen((o) => !o);
        break;
      case "auto":
        setAuto((a) => !a);
        break;
      case "skip":
        skipTyping();
        break;
      case "settings":
        setSettingsOpen((o) => !o);
        break;
      default:
        break;
    }
  }, [skipTyping]);
  const line = currentLine !== null ? { ...currentLine, speaker } : null;
  return /* @__PURE__ */ import_react3.default.createElement("div", { className: "gv-root", "data-gal-view": "", "data-gal-mode": mode, ref: rootRef }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "gv-topbar" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "gv-brand" }, /* @__PURE__ */ import_react3.default.createElement("span", { className: "gv-brand-mark", "aria-hidden": "true" }), /* @__PURE__ */ import_react3.default.createElement("span", null, "GAL \u89C6\u7A97")), /* @__PURE__ */ import_react3.default.createElement("div", { className: "gv-mode-switch", role: "tablist", "aria-label": "\u6A21\u5F0F\u5207\u6362" }, /* @__PURE__ */ import_react3.default.createElement(
    "button",
    {
      type: "button",
      role: "tab",
      "aria-selected": mode === "game",
      className: "gv-mode-btn" + (mode === "game" ? " is-on" : ""),
      onClick: () => setMode("game")
    },
    "\u6E38\u620F\u6A21\u5F0F"
  ), /* @__PURE__ */ import_react3.default.createElement(
    "button",
    {
      type: "button",
      role: "tab",
      "aria-selected": mode === "editor",
      className: "gv-mode-btn" + (mode === "editor" ? " is-on" : ""),
      onClick: () => setMode("editor")
    },
    "\u7F16\u8F91\u6A21\u5F0F"
  )), /* @__PURE__ */ import_react3.default.createElement("div", { className: "gv-topbar-right" }, mode === "editor" ? /* @__PURE__ */ import_react3.default.createElement("span", { className: "gv-topbar-hint" }, "\u7F16\u8F91\u7ED3\u679C\u5B9E\u65F6\u540C\u6B65\u5230\u6E38\u620F\u6A21\u5F0F") : /* @__PURE__ */ import_react3.default.createElement("button", { type: "button", className: "gv-btn", onClick: () => setSettingsOpen((o) => !o) }, "\u8BBE\u7F6E"))), mode === "game" && /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, /* @__PURE__ */ import_react3.default.createElement("div", { className: "gv-stage-area" }, /* @__PURE__ */ import_react3.default.createElement(
    StageView,
    {
      scene,
      assetsMap: assets.map,
      mode: "game",
      line,
      type,
      running,
      pinned: pinScroll,
      selectedId: null,
      onSelect: () => {
      },
      api: void 0,
      onSkip: skipTyping,
      onTextClick,
      hasNextPage,
      aiStatus: running ? showStatusPage ? aiStatus : null : aiStatus,
      onAction: handleAction,
      autoOn: auto
    }
  )), /* @__PURE__ */ import_react3.default.createElement(
    "form",
    {
      className: "gv-input",
      onSubmit: (e) => {
        e.preventDefault();
        send();
      }
    },
    /* @__PURE__ */ import_react3.default.createElement(
      "textarea",
      {
        className: "gv-input-box",
        value: draft,
        onChange: (e) => setDraft(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            send();
          }
        },
        placeholder: "\u8F93\u5165\u4F60\u60F3\u8BF4\u7684\u8BDD\u2026\u2026",
        rows: 2,
        "aria-label": "\u73A9\u5BB6\u8F93\u5165"
      }
    ),
    /* @__PURE__ */ import_react3.default.createElement("button", { type: "submit", className: "gv-btn gv-btn-accent gv-send", disabled: draft.trim() === "" }, "\u53D1\u9001")
  )), mode === "editor" && /* @__PURE__ */ import_react3.default.createElement(
    Editor,
    {
      scene,
      api,
      history,
      assetsMap: assets.map,
      fontsMap: fonts.map,
      onExitEditor: () => setMode("game")
    }
  ), historyOpen && /* @__PURE__ */ import_react3.default.createElement(HistoryPanel, { scene, lines, onClose: () => setHistoryOpen(false) }), settingsOpen && /* @__PURE__ */ import_react3.default.createElement(SettingsPanel, { scene, api, onClose: () => setSettingsOpen(false) }));
}

// .dsh-plugin/client/SettingsTab.jsx
var import_react4 = __toESM(require("react"), 1);
function GalViewSettingsTab({ useEnabled, setEnabled }) {
  const enabled = useEnabled((v) => v);
  return /* @__PURE__ */ import_react4.default.createElement("div", { className: "gvsv-tab" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "gvsv-head" }, /* @__PURE__ */ import_react4.default.createElement("span", { className: "gvsv-title" }, "GAL \u89C6\u7A97"), /* @__PURE__ */ import_react4.default.createElement("span", { className: "gvsv-desc" }, "\u4F1A\u8BDD\u6807\u7B7E\u9875\u4E2D\u7684 Galgame \u98CE\u683C\u5BF9\u8BDD\u89C6\u56FE\uFF08\u5BF9\u8BDD / GAL\u89C6\u7A97 / \u8F68\u8FF9\uFF09\u3002")), /* @__PURE__ */ import_react4.default.createElement("label", { className: "gvsv-row" }, /* @__PURE__ */ import_react4.default.createElement("span", { className: "gvsv-label" }, "\u542F\u7528 GAL \u89C6\u7A97"), /* @__PURE__ */ import_react4.default.createElement("span", { className: "gvsv-hint" }, "\u5173\u95ED\u540E\u9690\u85CF\u4F1A\u8BDD\u9875\u7684\u300CGAL\u89C6\u7A97\u300D\u6807\u7B7E\uFF1B\u573A\u666F\u4E0E\u8BBE\u7F6E\u4FDD\u7559\uFF0C\u91CD\u65B0\u5F00\u542F\u5373\u6062\u590D\u3002"), /* @__PURE__ */ import_react4.default.createElement(
    "input",
    {
      type: "checkbox",
      checked: enabled,
      onChange: (e) => setEnabled(e.target.checked),
      "aria-label": "\u542F\u7528 GAL \u89C6\u7A97"
    }
  )));
}

// .dsh-plugin/client/assets.mjs
var ASSET_MIME = /^image\/(png|jpe?g|webp|gif)$/i;
var MAX_ASSET_BYTES = 8 * 1024 * 1024;
function normalizeAsset(raw) {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) return null;
  const dataUrl = typeof raw.dataUrl === "string" ? raw.dataUrl : "";
  if (!/^data:image\/[a-z0-9.+-]+;base64,/i.test(dataUrl)) return null;
  return {
    id: typeof raw.id === "string" && raw.id !== "" ? raw.id : makeId("asset"),
    name: typeof raw.name === "string" && raw.name !== "" ? raw.name : "\u7D20\u6750",
    mime: typeof raw.mime === "string" ? raw.mime : "image/png",
    dataUrl,
    width: typeof raw.width === "number" && Number.isFinite(raw.width) ? raw.width : 0,
    height: typeof raw.height === "number" && Number.isFinite(raw.height) ? raw.height : 0,
    createdAt: typeof raw.createdAt === "number" && Number.isFinite(raw.createdAt) ? raw.createdAt : 0
  };
}
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(reader.error ?? new Error("\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25"));
    reader.readAsDataURL(file);
  });
}
function measureImage(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = dataUrl;
  });
}
function embedAssets(scene, assetMap) {
  const refs = new Set(
    scene.elements.map((el) => el.image).filter((id) => typeof id === "string" && id !== "")
  );
  const assets = {};
  for (const id of refs) {
    const record = assetMap.get(id);
    if (record !== void 0) assets[id] = record;
  }
  return { ...scene, assets };
}
function extractAssets(raw) {
  if (raw === null || typeof raw !== "object" || raw.assets === null || typeof raw.assets !== "object" || Array.isArray(raw.assets)) return [];
  return Object.entries(raw.assets).map(([, value]) => normalizeAsset(value)).filter((record) => record !== null);
}
function createIdbAssets(dbName = "gal-view") {
  return createIdbStore(dbName, "assets");
}

// .dsh-plugin/client/index.mjs
var name = "gal-view";
var inject = ["slots"];
var PERSIST_KEY = "gal-view:scene:v1";
var ENABLED_KEY = "gal-view:enabled";
var HISTORY_LIMIT = 100;
function createReadStore() {
  return {
    spec: {
      init: () => ({ lineKey: null, pageIndex: 0, shown: "", done: true, dwellSince: null, statusHold: false }),
      persist: "gal-view.read",
      actions: {
        saveProgress: (draft, progress) => {
          draft.lineKey = progress.lineKey;
          draft.pageIndex = progress.pageIndex;
          draft.shown = progress.shown;
          draft.done = progress.done;
          draft.dwellSince = progress.dwellSince;
          draft.statusHold = progress.statusHold;
        }
      }
    },
    create(scopeKey) {
      const persistKey = scopeKey === void 0 ? "gal-view.read" : "gal-view.read." + String(scopeKey);
      let state = { lineKey: null, pageIndex: 0, shown: "", done: true, dwellSince: null, statusHold: false };
      try {
        const raw = window.localStorage.getItem(persistKey);
        if (raw !== null) {
          const parsed = JSON.parse(raw);
          if (parsed !== null && typeof parsed === "object") state = parsed;
        }
      } catch {
      }
      const listeners = /* @__PURE__ */ new Set();
      const persist = () => {
        try {
          window.localStorage.setItem(persistKey, JSON.stringify(state));
        } catch {
        }
      };
      return {
        getSnapshot: () => state,
        subscribe(fn) {
          listeners.add(fn);
          return () => {
            listeners.delete(fn);
          };
        },
        actions: {
          saveProgress(progress) {
            state = {
              lineKey: progress.lineKey,
              pageIndex: progress.pageIndex,
              shown: progress.shown,
              done: progress.done,
              dwellSince: progress.dwellSince,
              statusHold: progress.statusHold === true
            };
            persist();
            for (const fn of [...listeners]) fn();
          }
        },
        clearPersisted() {
          try {
            window.localStorage.removeItem(persistKey);
          } catch {
          }
        }
      };
    }
  };
}
function createSceneApi(sceneSource, history, historySource, storage, assetsSource, idb, fontsSource, fontIdb) {
  const current = () => sceneSource.getSnapshot();
  const commit = (next) => {
    sceneSource.update(next);
    saveJSON(storage, PERSIST_KEY, next);
  };
  const snapshotScene = () => cloneScene(current());
  const commitHistory = (before) => {
    if (before === void 0 || before === null) return;
    const now = current();
    if (JSON.stringify(now) === JSON.stringify(before)) return;
    history.push(before);
    historySource.update(history.info());
  };
  const pushAndCommit = (next) => {
    const before = snapshotScene();
    commit(next);
    history.push(before);
    historySource.update(history.info());
  };
  return {
    /** 快照当前场景（拖动/属性编辑起手）。 */
    snapshotScene,
    /** 实时更新单个元素（不写历史）。 */
    updateElement(id, patch) {
      commit({
        ...current(),
        elements: current().elements.map((el) => el.id === id ? { ...el, ...patch } : el)
      });
    },
    /** 实时更新设置（合并 + 白名单归一化；不写历史）。 */
    updateSettings(patch) {
      commit({
        ...current(),
        settings: { ...current().settings, ...patch }
      });
    },
    /** 以起手快照提交一次历史（无变化则跳过）。 */
    commitHistory,
    /** 添加元素（自带历史），返回新 id。 */
    addElement(type, opts = {}) {
      if (!ELEMENT_TYPES.includes(type)) return null;
      const s = current();
      const index = opts.index ?? s.elements.filter((el2) => el2.type === type).length;
      const el = makeElement(type, {
        id: opts.id,
        index,
        role: opts.role,
        stageW: s.settings.stageW,
        stageH: s.settings.stageH
      });
      pushAndCommit({ ...s, elements: [...s.elements, el] });
      return el.id;
    },
    /** 删除元素（自带历史）。 */
    removeElement(id) {
      const s = current();
      pushAndCommit({ ...s, elements: s.elements.filter((el) => el.id !== id) });
    },
    /** 复制元素（自带历史），返回副本 id。 */
    duplicateElement(id) {
      const s = current();
      const src = s.elements.find((el) => el.id === id);
      if (src === void 0) return null;
      const copy = {
        ...cloneScene(src),
        id: makeId("el"),
        name: src.name + " \u526F\u672C",
        x: src.x + 16,
        y: src.y + 16,
        z: src.z + 1,
        locked: false
      };
      pushAndCommit({ ...s, elements: [...s.elements, copy] });
      return copy.id;
    },
    /** 图层操作：up/down 交换相邻 z；top/bottom 置为极值。 */
    reorderElement(id, dir) {
      const s = current();
      const sorted = sortElements(s.elements);
      const at = sorted.findIndex((el) => el.id === id);
      if (at < 0) return;
      const target = sorted[at];
      let z = target.z;
      if (dir === "up" && at < sorted.length - 1) z = sorted[at + 1].z + 0;
      else if (dir === "down" && at > 0) z = sorted[at - 1].z;
      else if (dir === "top") z = (sorted[sorted.length - 1]?.z ?? 0) + 1;
      else if (dir === "bottom") z = (sorted[0]?.z ?? 0) - 1;
      if (z === target.z && dir !== "top" && dir !== "bottom") {
        const other = dir === "up" ? sorted[at + 1] : sorted[at - 1];
        if (other === void 0) return;
        const zA = target.z;
        const zB = other.z;
        pushAndCommit({
          ...s,
          elements: s.elements.map((el) => {
            if (el.id === target.id) return { ...el, z: zB };
            if (el.id === other.id) return { ...el, z: zA };
            return el;
          })
        });
        return;
      }
      pushAndCommit({
        ...s,
        elements: s.elements.map((el) => el.id === id ? { ...el, z } : el)
      });
    },
    /** 导入场景（归一化 + 自带历史；内嵌素材先还原进素材库）。 */
    replaceScene(raw) {
      const next = normalizeScene(raw);
      if (next === null) return false;
      const embedded = extractAssets(raw);
      if (embedded.length > 0) {
        const map = new Map(assetsSource.getSnapshot().map);
        for (const record of embedded) {
          map.set(record.id, record);
          void idb.put(record).catch(() => {
          });
        }
        assetsSource.update({ map });
      }
      const embeddedFonts = extractFonts(raw);
      if (embeddedFonts.length > 0) {
        const map = new Map(fontsSource.getSnapshot().map);
        for (const record of embeddedFonts) {
          map.set(record.id, record);
          void fontIdb.put(record).catch(() => {
          });
        }
        fontsSource.update({ map });
      }
      pushAndCommit(next);
      return true;
    },
    /** 重置为默认 Demo 场景（自带历史）。 */
    resetScene() {
      pushAndCommit(defaultScene());
    },
    /** 撤销 / 重做（真正的 history stack）。 */
    undo() {
      const prev = history.undoStep(snapshotScene());
      if (prev === null) return;
      commit(prev);
      historySource.update(history.info());
    },
    redo() {
      const next = history.redoStep(snapshotScene());
      if (next === null) return;
      commit(next);
      historySource.update(history.info());
    },
    /** 导出场景 JSON：内嵌被引用的素材与字体 dataURL（组件负责 Blob 下载）。 */
    exportScene() {
      const withAssets = embedAssets(current(), assetsSource.getSnapshot().map);
      return JSON.stringify(embedFonts(withAssets, fontsSource.getSnapshot().map), null, 2);
    },
    /** 素材库：导入图片文件（多选；跳过非图片/超限/损坏项）。 */
    async importAssets(files) {
      const list = Array.isArray(files) ? files : [];
      let added = 0;
      let skipped = 0;
      const ids = [];
      for (const file of list) {
        const type = file !== null && typeof file === "object" ? file.type : "";
        const size = file !== null && typeof file === "object" ? file.size : Infinity;
        if (typeof type !== "string" || !ASSET_MIME.test(type) || typeof size !== "number" || size > MAX_ASSET_BYTES) {
          skipped += 1;
          continue;
        }
        try {
          const dataUrl = await readFileAsDataUrl(file);
          const { width, height } = await measureImage(dataUrl);
          const record = normalizeAsset({
            id: makeId("asset"),
            name: typeof file.name === "string" && file.name !== "" ? file.name : "\u7D20\u6750",
            mime: type,
            dataUrl,
            width,
            height,
            createdAt: Date.now()
          });
          if (record === null) {
            skipped += 1;
            continue;
          }
          await idb.put(record);
          const map = new Map(assetsSource.getSnapshot().map);
          map.set(record.id, record);
          assetsSource.update({ map });
          ids.push(record.id);
          added += 1;
        } catch (error) {
          console.warn("[gal-view] \u7D20\u6750\u5BFC\u5165\u5931\u8D25\uFF1A" + String(error?.message ?? error));
          skipped += 1;
        }
      }
      return { added, skipped, ids };
    },
    /** 素材库：删除素材并清除所有元素引用（一次性历史）。 */
    async removeAsset(id) {
      const map = new Map(assetsSource.getSnapshot().map);
      if (!map.has(id)) return false;
      map.delete(id);
      assetsSource.update({ map });
      void idb.remove(id).catch(() => {
      });
      const s = current();
      if (s.elements.some((el) => el.image === id)) {
        pushAndCommit({ ...s, elements: s.elements.map((el) => el.image === id ? { ...el, image: null } : el) });
      }
      return true;
    },
    /** 素材记录查询（组件渲染用；缺失返回 null → 占位图形）。 */
    asset(id) {
      if (typeof id !== "string" || id === "") return null;
      return assetsSource.getSnapshot().map.get(id) ?? null;
    },
    /** 字体库：导入字体文件（多选；跳过非字体/超限/损坏项）。 */
    async importFonts(files) {
      const list = Array.isArray(files) ? files : [];
      let added = 0;
      let skipped = 0;
      const ids = [];
      for (const file of list) {
        if (file === null || typeof file !== "object") {
          skipped += 1;
          continue;
        }
        const ext = extOf(typeof file.name === "string" ? file.name : "");
        const format = FONT_FORMATS[ext];
        const mimeOk = typeof file.type === "string" && /font\/(ttf|otf|woff2?)/i.test(file.type);
        if (format === void 0 && !mimeOk) {
          skipped += 1;
          continue;
        }
        const size = typeof file.size === "number" ? file.size : Infinity;
        if (size > MAX_FONT_BYTES) {
          skipped += 1;
          continue;
        }
        try {
          const dataUrl = await readFileAsDataUrl(file);
          const baseFamily = fontFamilyFromName(typeof file.name === "string" ? file.name : "");
          const existing = [...fontsSource.getSnapshot().map.values()];
          let family = baseFamily;
          let n = 1;
          while (existing.some((record2) => record2.family.toLowerCase() === family.toLowerCase())) {
            n += 1;
            family = baseFamily + "-" + n;
          }
          const record = normalizeFont({
            id: makeId("font"),
            name: typeof file.name === "string" && file.name !== "" ? file.name : "\u5B57\u4F53",
            family,
            format: format ?? "truetype",
            dataUrl,
            createdAt: Date.now()
          });
          if (record === null) {
            skipped += 1;
            continue;
          }
          await fontIdb.put(record);
          const map = new Map(fontsSource.getSnapshot().map);
          map.set(record.id, record);
          fontsSource.update({ map });
          ids.push(record.id);
          added += 1;
        } catch {
          skipped += 1;
        }
      }
      return { added, skipped, ids };
    },
    /** 字体库：删除字体（元素引用保留 family 字符串，缺失时浏览器自然回退）。 */
    async removeFont(id) {
      const map = new Map(fontsSource.getSnapshot().map);
      if (!map.has(id)) return false;
      map.delete(id);
      fontsSource.update({ map });
      void fontIdb.remove(id).catch(() => {
      });
      return true;
    },
    /** 字体记录查询（组件渲染用）。 */
    font(id) {
      if (typeof id !== "string" || id === "") return null;
      return fontsSource.getSnapshot().map.get(id) ?? null;
    }
  };
}
function apply(ctx) {
  if (document.querySelector("style[data-gal-view-style]") !== null) return;
  const styleEl = document.createElement("style");
  styleEl.setAttribute("data-gal-view-style", "");
  styleEl.setAttribute("data-plugin", "gal-view");
  styleEl.textContent = CSS;
  document.head.append(styleEl);
  const storage = createStorage();
  const initial = ensureActionButtons(ensureSpeakerNames(ensureDialogueText(normalizeScene(loadJSON(storage, PERSIST_KEY)) ?? defaultScene())));
  const sceneSource = createObservable(initial);
  const history = createHistory(HISTORY_LIMIT);
  const historySource = createObservable({ undo: 0, redo: 0 });
  const assetsSource = createObservable({ map: /* @__PURE__ */ new Map() });
  const idb = createIdbAssets();
  void idb.getAll().then((records) => {
    if (records.length > 0) assetsSource.update({ map: new Map(records.map((record) => [record.id, record])) });
  }).catch(() => {
  });
  const fontsSource = createObservable({ map: /* @__PURE__ */ new Map() });
  const fontIdb = createIdbFonts();
  const fontStyleEl = document.createElement("style");
  fontStyleEl.setAttribute("data-gal-view-fonts", "");
  fontStyleEl.setAttribute("data-plugin", "gal-view");
  document.head.append(fontStyleEl);
  const syncFontStyles = () => {
    const faces = [...fontsSource.getSnapshot().map.values()].map(buildFontFace);
    fontStyleEl.textContent = faces.join("\n");
  };
  syncFontStyles();
  fontsSource.subscribe(syncFontStyles);
  void fontIdb.getAll().then((records) => {
    if (records.length > 0) {
      fontsSource.update({ map: new Map(records.map((record) => [record.id, record])) });
      syncFontStyles();
    }
  }).catch(() => {
  });
  const api = createSceneApi(sceneSource, history, historySource, storage, assetsSource, idb, fontsSource, fontIdb);
  const enabledSource = createObservable(loadJSON(storage, ENABLED_KEY) !== false);
  const setEnabled = (value) => {
    enabledSource.update(value === true);
    saveJSON(storage, ENABLED_KEY, value === true);
  };
  ctx.effect(() => () => {
    styleEl.remove();
    fontStyleEl.remove();
  }, "gal-view: styles");
  ctx.slots.inject("conversation.view", () => {
    let dispose = null;
    const sync = () => {
      if (dispose !== null) {
        dispose();
        dispose = null;
      }
      if (enabledSource.getSnapshot() !== true) return;
      dispose = ctx.slots.register({
        name: "conversation.view",
        id: "gal",
        order: 5,
        label: () => "GAL\u89C6\u7A97",
        store: createReadStore(),
        inject: () => ({
          hooks: { scene: sceneSource, history: historySource, assets: assetsSource, fonts: fontsSource },
          api
        })
      }, GalView);
    };
    sync();
    const unsubscribe = enabledSource.subscribe(sync);
    return () => {
      unsubscribe();
      if (dispose !== null) dispose();
    };
  });
  ctx.slots.inject("settings.plugins.tab", () => ctx.slots.register({
    name: "settings.plugins.tab",
    id: "gal-view",
    order: 20,
    label: () => "GAL \u89C6\u7A97",
    inject: () => ({
      hooks: { enabled: enabledSource },
      setEnabled
    })
  }, GalViewSettingsTab));
}
		return module.exports;
	}
});
