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

**B站演示视频:** [https://www.bilibili.com/video/BV1qFVQ63EeG/](https://www.bilibili.com/video/BV1qFVQ63EeG/)

## 在线使用

**直接打开**: [https://dawwnforu.github.io/multi-platform-publisher/](https://dawwnforu.github.io/multi-platform-publisher/)

> 无需安装，浏览器打开即用。编辑内容自动保存到浏览器本地存储。

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:5173/`

## 技术栈

| 依赖 | 用途 | 说明 |
|------|------|------|
| React 19 + TypeScript | 前端框架 | UI 组件与状态管理 |
| Vite | 构建工具 | 开发服务器与生产构建 |
| @milkdown/crepe | WYSIWYG 编辑器 | 提供 ProseMirror 编辑核心、斜杠菜单、浮动工具栏 |
| @milkdown/react | React 集成 | 编辑器与 React 组件桥接 |
| @milkdown/kit | 编辑器工具包 | 提供 editorViewCtx、utils 等底层 API |
| markdown-it | Markdown 解析 | 编辑器内容转为各平台格式 |
| GitHub Pages | 部署 | GitHub Actions 自动构建部署 |

## 原创功能说明

本项目基于上述开源框架构建，以下为**自主开发的核心功能**：

- **多平台格式转换引擎** (`src/engines/`) — 基于 markdown-it，针对公众号/知乎/小红书/B站各自的内容规范，自主实现格式转换、样式适配、字数限制检测
- **文件夹收纳系统** — 类浏览器收藏夹的文档管理，含预设文件夹、自定义分类、localStorage 持久化
- **大纲导航侧边栏** — 从编辑器 DOM 动态提取标题层级，点击跳转对应段落
- **三栏可拖拽布局** — 基于 mousedown/mousemove 实现的三栏比例拖拽调节
- **自定义斜杠菜单项** — 在 Crepe 原有菜单上扩展本地图片上传（base64 嵌入）、GIF 动图、视频插入、删除块等功能
- **平台预览手机框** — 模拟各平台移动端展示效果的预览组件
- **新手引导 & 帮助系统** — 首次访问弹窗 + 完整功能说明文档

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
