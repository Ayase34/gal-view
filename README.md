# gal-view · GAL 视窗

[English](README.en.md) | 中文

DSH Web GUI 会话页的 **Galgame 风格对话视图 + 场景元素可视化编辑器**（官方 bundle 插件格式）。

在会话标签页栏（「对话」/「轨迹」）中间加入 **「GAL视窗」** 标签，点开之后会话视窗变成
16:9 Galgame 舞台：占位立绘、大对话框、打字机台词、玩家输入；内置「编辑模式」可像场景
编辑器一样拖拽/改属性/换图层，编辑结果实时同步回游戏模式。

![image.png](image.png)


## 安装

```sh
# 本地目录安装（官方 profile 管理）
dsh plugin --profile web add "C:\\...\\gal-view"
# 装完重启 web（bundle 层在启动时合成）
```


## 开发

```sh
pnpm install            # 安装 esbuild devDependency
npm test                # 纯逻辑单测（node:test，同进程运行）
npm run build:client    # 生成 .dsh-plugin/client.js（生成物勿手改）
npm run check:client    # 校验 client.js 新鲜度
npm run smoke           # Playwright 冒烟（需 DSH_CHECKOUT 指向 dsh checkout）
```

## 结构

```
.dsh-plugin/index.mjs     Node half（极简，无宿主行为）
.dsh-plugin/client/       client 源码：场景模型/打字机/转录映射/组件/样式
.dsh-plugin/client.js     构建产物（scripts/build-client.mjs 生成）
scripts/build-client.mjs  esbuild 构建器（--check 守护新鲜度）
tests/                    纯逻辑单测（node:test）
```
