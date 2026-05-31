import { useMemo } from 'react';

interface SidebarProps {
  markdown: string;
  collapsed: boolean;
  onToggle: () => void;
  width?: number;
}

interface HeadingItem {
  level: number;
  text: string;
  lineIndex: number;
}

function extractHeadings(markdown: string): HeadingItem[] {
  const lines = markdown.split('\n');
  const headings: HeadingItem[] = [];
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(#{1,6})\s+(.+)/);
    if (match) {
      headings.push({
        level: match[1].length,
        text: match[2].replace(/[`*_~\[\]\(\)]+/g, '').trim(),
        lineIndex: i,
      });
    }
  }
  return headings;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function scrollToHeading(text: string): void {
  const editorEl = document.querySelector('.milkdown .editor');
  if (!editorEl) return;

  const headingTags = editorEl.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const pattern = new RegExp(`^\\s*${escapeRegExp(text)}\\s*$`, 'i');

  for (const el of headingTags) {
    if (pattern.test(el.textContent ?? '')) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
  }

  // fallback: try partial match
  for (const el of headingTags) {
    if ((el.textContent ?? '').toLowerCase().includes(text.toLowerCase())) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
  }
}

export default function Sidebar({ markdown, collapsed, onToggle, width = 200 }: SidebarProps) {
  const headings = useMemo(() => extractHeadings(markdown), [markdown]);

  return (
    <>
      {collapsed ? (
        <div className="sidebar sidebar-collapsed" onClick={onToggle} title="展开大纲">
          <span className="sidebar-toggle-icon">»</span>
        </div>
      ) : (
        <aside className="sidebar" style={{ width }}>
          <div className="sidebar-header">
            <span className="sidebar-title">大纲</span>
            <button className="sidebar-toggle-btn" onClick={onToggle} title="收起侧边栏">
              «
            </button>
          </div>
          <div className="sidebar-body">
            {headings.length === 0 ? (
              <div className="sidebar-empty">暂无标题</div>
            ) : (
              <nav className="outline-list">
                {headings.map((h, i) => (
                  <button
                    key={i}
                    className="outline-item"
                    style={{ paddingLeft: 8 + (h.level - 1) * 12 }}
                    onClick={() => scrollToHeading(h.text)}
                    title={h.text}
                  >
                    <span className={`outline-dot outline-dot-h${h.level}`} />
                    <span className="outline-text">{h.text}</span>
                  </button>
                ))}
              </nav>
            )}
          </div>
        </aside>
      )}
    </>
  );
}
