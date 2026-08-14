// 单测聚合入口：同进程直接执行（node:test 在主入口运行时自动运行注册的测试）。
// 不依赖 `node --test` 的子进程 spawn（沙箱下 spawn 测试文件被 EPERM 拦截）。
import './scene.test.mjs'
import './typewriter.test.mjs'
import './transcript.test.mjs'
import './store.test.mjs'
import './assets.test.mjs'
import './snap.test.mjs'
import './fonts.test.mjs'
import './paging.test.mjs'
