// gal-view Node half：极简。GAL 视窗完全运行在浏览器 half——
// 场景状态、编辑历史存 localStorage，符合「完全前端运行、不需要后端」的 Demo 形态。
// 本文件只为满足官方 bundle 插件契约（name/inject/apply），不消费宿主服务。
// 契约：官方 bundle 插件的 Node half（仓库根 package.json 的 dsh.bundle + dsh.client；
// client 产物 .dsh-plugin/client.js 由 scripts/build-client.mjs 生成）。

export const name = 'gal-view'

export const inject = []

export function apply() {
  // 无宿主侧行为：client half 自行注册视图并持久化场景。
}
