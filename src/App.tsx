import { useState, useEffect, useCallback, useRef } from 'react';
import Editor from './components/Editor';
import PlatformTabs from './components/PlatformTabs';
import PlatformPreview from './components/PlatformPreview';
import Sidebar from './components/Sidebar';
import HelpModal from './components/HelpModal';
import WelcomeGuide from './components/WelcomeGuide';
import type { PlatformId } from './types';
import './App.css';

const DEMO_CONTENT = `# 如何高效做好多平台内容运营

## 为什么需要多平台运营？

在当下的内容生态中，**单一平台**已经很难满足创作者的增长需求。你需要同时在公众号、知乎、小红书、B站等平台发布内容，才能最大化你的影响力。

## 多平台运营的三大痛点

1. **格式适配麻烦** — 每个平台的编辑器不一样，排版规则也不一样
2. **重复操作耗时** — 同一篇内容要分别登录不同平台，重复上传图片
3. **缺乏统一管理** — 各个平台的数据分散，难以统一分析

## 解决方案

> 一个好的多平台发布工具，应该让创作者只关注内容本身，格式适配的事交给工具就好了。

### 核心功能

- 统一所见即所得编辑器
- 一键生成各平台适配内容
- 实时预览发布效果
- 快捷复制到各平台

---

*开始使用这个工具，提升你的发布效率吧！*`;

interface DocItem {
  id: string;
  name: string;
  markdown: string;
  createdAt: number;
}

interface Folder {
  id: string;
  name: string;
  items: DocItem[];
}

const PRESET_FOLDERS: Folder[] = [
  {
    id: 'folder-study',
    name: '学习',
    items: [
      { id: 'doc-markdown', name: 'Markdown 入门', markdown: `# Markdown 快速入门

## 什么是 Markdown？

Markdown 是一种**轻量级标记语言**，用简单的符号就能写出排版精美的文档。

## 常用语法

- \`# 标题\` → 一级标题
- \`**加粗**\` → **加粗**
- \`*斜体*\` → *斜体*
- \`- 列表项\` → 无序列表

> 这个编辑器是所见即所得的，你不需要记住这些语法！

## 试试看

选中这段文字，看看弹出的格式工具栏。`, createdAt: Date.now() },
    ],
  },
  {
    id: 'folder-work',
    name: '工作',
    items: [
      { id: 'doc-weekly', name: '周报模板', markdown: `# 本周工作总结

## 完成事项

1. 项目 A — 完成前端页面开发
2. 项目 B — 修复 3 个线上 Bug

## 下周计划

- 推进项目 A 后端联调
- 优化首页加载速度

## 遇到的问题

暂无阻塞。`, createdAt: Date.now() },
    ],
  },
  {
    id: 'folder-personal',
    name: '个人',
    items: [],
  },
  {
    id: 'folder-ops',
    name: '运营账号',
    items: [
      { id: 'demo-doc', name: '示例：多平台运营', markdown: DEMO_CONTENT, createdAt: Date.now() },
    ],
  },
];

function loadFolders(): Folder[] {
  try {
    const raw = localStorage.getItem('mp-folders');
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return PRESET_FOLDERS;
}

function isOnboarded(): boolean {
  return localStorage.getItem('mp-onboarded') === 'true';
}

let idCounter = Date.now();
function uid(): string { return String(++idCounter); }

export default function App() {
  const [folders, setFolders] = useState<Folder[]>(loadFolders);
  const [activeDocId, setActiveDocId] = useState<string>(() => {
    // Default to demo doc
    const saved = loadFolders();
    for (const f of saved) {
      if (f.items.length > 0) return f.items[0].id;
    }
    return '';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(!isOnboarded());
  const [activePlatform, setActivePlatform] = useState<PlatformId>('wechat');
  const [folderOpen, setFolderOpen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => new Set(loadFolders().map((f) => f.id)));
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const [editorPercent, setEditorPercent] = useState(50);
  const resizeRef = useRef<'sidebar' | 'preview' | null>(null);
  const resizeStartX = useRef(0);
  const resizeStartVal = useRef(0);

  useEffect(() => {
    localStorage.setItem('mp-folders', JSON.stringify(folders));
  }, [folders]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!folderOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFolderOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [folderOpen]);

  // Resize drag handlers
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!resizeRef.current || !mainRef.current) return;
      if (resizeRef.current === 'sidebar') {
        const delta = e.clientX - resizeStartX.current;
        setSidebarWidth(Math.max(120, Math.min(400, resizeStartVal.current + delta)));
      } else {
        const mainRect = mainRef.current.getBoundingClientRect();
        const sidebarW = sidebarCollapsed ? 30 : sidebarWidth;
        const handle1W = sidebarCollapsed ? 0 : 5;
        const available = mainRect.width - sidebarW - handle1W - 5;
        const editorW = e.clientX - mainRect.left - sidebarW - handle1W;
        setEditorPercent(Math.max(20, Math.min(80, (editorW / available) * 100)));
      }
    };
    const onMouseUp = () => {
      resizeRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [sidebarCollapsed, sidebarWidth]);

  // Find current doc
  let activeDoc: DocItem | undefined;
  let activeFolder: Folder | undefined;
  for (const f of folders) {
    const found = f.items.find((d) => d.id === activeDocId);
    if (found) { activeDoc = found; activeFolder = f; break; }
  }
  const markdown = activeDoc?.markdown ?? '';
  const displayName = activeFolder
    ? `${activeFolder.name} / ${activeDoc?.name ?? ''}`
    : '选择文档';

  const setMarkdown = useCallback((newMd: string) => {
    setFolders((prev) =>
      prev.map((f) => ({
        ...f,
        items: f.items.map((d) => (d.id === activeDocId ? { ...d, markdown: newMd } : d)),
      }))
    );
  }, [activeDocId]);

  const createFolder = () => {
    const name = prompt('文件夹名称:');
    if (!name?.trim()) return;
    const id = uid();
    setFolders((prev) => [...prev, { id, name: name.trim(), items: [] }]);
    setExpandedFolders((prev) => new Set(prev).add(id));
  };

  const deleteFolder = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return;
    if (folder.items.length > 0 && !confirm(`删除"${folder.name}"及其所有文档？`)) return;
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    // If active doc was in this folder, switch to another
    if (folder.items.some((d) => d.id === activeDocId)) {
      const other = folders.find((f) => f.id !== folderId && f.items.length > 0);
      setActiveDocId(other?.items[0]?.id ?? '');
    }
  };

  const addDocument = (folderId: string) => {
    const name = prompt('文档名称:');
    if (!name?.trim()) return;
    const doc: DocItem = {
      id: uid(),
      name: name.trim(),
      markdown: '',
      createdAt: Date.now(),
    };
    setFolders((prev) =>
      prev.map((f) => (f.id === folderId ? { ...f, items: [...f.items, doc] } : f))
    );
    setActiveDocId(doc.id);
    setFolderOpen(false);
  };

  const deleteDocument = (docId: string) => {
    const folder = folders.find((f) => f.items.some((d) => d.id === docId));
    if (!folder || folder.items.length <= 1) {
      alert('每个文件夹至少保留一个文档');
      return;
    }
    setFolders((prev) =>
      prev.map((f) => ({ ...f, items: f.items.filter((d) => d.id !== docId) }))
    );
    if (activeDocId === docId) {
      const other = folder.items.find((d) => d.id !== docId);
      if (other) setActiveDocId(other.id);
    }
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };

  const completeOnboarding = () => {
    localStorage.setItem('mp-onboarded', 'true');
    setShowOnboarding(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Multi-Platform</h1>

        {/* Folder dropdown */}
        <div className="folder-dropdown" ref={dropdownRef}>
          <button
            className="folder-dropdown-btn"
            onClick={() => setFolderOpen(!folderOpen)}
          >
            <span className="folder-icon">📂</span>
            <span className="folder-current">{displayName}</span>
            <span className="folder-arrow">{folderOpen ? '▴' : '▾'}</span>
          </button>

          {folderOpen && (
            <div className="folder-dropdown-menu">
              {folders.map((folder) => (
                <div key={folder.id} className="folder-group">
                  <div className="folder-group-header">
                    <button
                      className="folder-expand-btn"
                      onClick={() => toggleFolder(folder.id)}
                    >
                      <span className="folder-expand-icon">
                        {expandedFolders.has(folder.id) ? '▾' : '▸'}
                      </span>
                      <span className="folder-group-name">📁 {folder.name}</span>
                      <span className="folder-count">({folder.items.length})</span>
                    </button>
                    <div className="folder-group-actions">
                      <button
                        className="folder-action-btn"
                        onClick={() => addDocument(folder.id)}
                        title="新建文档"
                      >
                        +
                      </button>
                      <button
                        className="folder-action-btn folder-delete-btn"
                        onClick={() => deleteFolder(folder.id)}
                        title="删除文件夹"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {expandedFolders.has(folder.id) && (
                    <div className="folder-items">
                      {folder.items.length === 0 ? (
                        <div className="folder-empty">空文件夹 — 点 + 新建文档</div>
                      ) : (
                        folder.items.map((doc) => (
                          <button
                            key={doc.id}
                            className={`folder-item ${doc.id === activeDocId ? 'active' : ''}`}
                            onClick={() => { setActiveDocId(doc.id); setFolderOpen(false); }}
                          >
                            <span className="folder-item-icon">📄</span>
                            <span className="folder-item-name">{doc.name}</span>
                            {folder.items.length > 1 && (
                              <span
                                className="folder-item-delete"
                                onClick={(e) => { e.stopPropagation(); deleteDocument(doc.id); }}
                                title="删除文档"
                              >
                                ×
                              </span>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}

              <div className="folder-dropdown-footer">
                <button className="folder-new-btn" onClick={createFolder}>
                  + 新建文件夹
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="header-spacer" />
        <button className="help-btn" onClick={() => setHelpOpen(true)} title="帮助">?</button>
      </header>

      <main className="app-main" ref={mainRef}>
        <Sidebar
          markdown={markdown}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          width={sidebarWidth}
        />
        {!sidebarCollapsed && (
          <div
            className={`resize-handle${resizeRef.current === 'sidebar' ? ' dragging' : ''}`}
            onMouseDown={(e) => {
              resizeRef.current = 'sidebar';
              resizeStartX.current = e.clientX;
              resizeStartVal.current = sidebarWidth;
              document.body.style.cursor = 'col-resize';
              document.body.style.userSelect = 'none';
            }}
          />
        )}
        <div className="editor-section" style={{ flex: editorPercent }}>
          <Editor
            value={markdown}
            onChange={setMarkdown}
            activePlatform={activePlatform}
          />
        </div>
        <div
          className={`resize-handle${resizeRef.current === 'preview' ? ' dragging' : ''}`}
          onMouseDown={(e) => {
            resizeRef.current = 'preview';
            resizeStartX.current = e.clientX;
            resizeStartVal.current = editorPercent;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
          }}
        />
        <div className="preview-section" style={{ flex: 100 - editorPercent }}>
          <PlatformTabs active={activePlatform} onChange={setActivePlatform} />
          <PlatformPreview markdown={markdown} platform={activePlatform} />
        </div>
      </main>

      {showOnboarding && <WelcomeGuide onDismiss={completeOnboarding} />}
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </div>
  );
}
