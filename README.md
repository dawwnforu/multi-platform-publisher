# Multi-Platform Publisher

一次编辑，多平台适配发布 —— 专为内容创作者打造的所见即所得多平台发布工具。

## 功能特性

- **所见即所得编辑器** — 基于 Milkdown Crepe，输入 `/` 唤起格式菜单，选中文字弹出浮动工具栏
- **四平台适配预览** — 公众号（富文本 HTML）、知乎（Markdown）、小红书（纯文本 ≤1000字）、B站专栏（HTML）
- **大纲导航** — 左侧可收起侧边栏，自动提取标题生成目录，点击跳转
- **文件夹收纳系统** — 顶部下拉菜单管理文档，支持创建/删除文件夹和文档，数据存 localStorage
- **可拖拽面板** — 侧边栏/编辑器/预览三栏之间可自由拖拽调整宽度
- **媒体插入** — / 菜单支持插入图片、GIF动图、视频
- **新手引导 + 帮助文档** — 首次访问展示使用指南，右上角 ? 查看完整功能说明

## Demo 视频

> 请将 demo 视频上传至仓库 `demo/` 目录，或在此处填写视频链接

**Demo 视频链接:** [待填写]

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:5173/`

## 技术栈

- React 19 + TypeScript
- Vite
- Milkdown Crepe (ProseMirror 所见即所得编辑器)
- markdown-it (Markdown → 各平台格式转换)

## 平台适配说明

| 平台 | 输出格式 | 字数限制 | 特殊处理 |
|------|---------|---------|---------|
| 公众号 | 富文本 HTML | 20000 | 内联样式、表格转文本 |
| 知乎 | Markdown | 50000 | 保留完整格式 |
| 小红书 | 纯文本 | 1000 | 自动提取纯文本、首图作为封面 |
| B站专栏 | 富文本 HTML | 50000 | 代码高亮 |

## 项目结构

```
src/
├── components/
│   ├── Editor.tsx          # Milkdown Crepe 编辑器
│   ├── Sidebar.tsx         # 大纲导航侧边栏
│   ├── PlatformPreview.tsx # 平台预览面板
│   ├── PlatformTabs.tsx    # 平台切换 Tab
│   ├── HelpModal.tsx       # 帮助文档弹窗
│   └── WelcomeGuide.tsx    # 新手引导弹窗
├── engines/
│   ├── base.ts             # markdown-it 渲染引擎
│   ├── wechat.ts           # 公众号渲染器
│   ├── zhihu.ts            # 知乎渲染器
│   ├── xiaohongshu.ts      # 小红书渲染器
│   └── bilibili.ts         # B站渲染器
├── constants/
│   └── platforms.ts        # 平台配置
├── types/
│   └── index.ts            # 类型定义
├── App.tsx                 # 主应用
└── App.css                 # 样式
```
