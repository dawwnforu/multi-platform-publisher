import { useMemo, useState } from 'react';
import type { PlatformId } from '../types';
import { PLATFORM_CONFIGS } from '../constants/platforms';
import { renderers } from '../engines';

interface PlatformPreviewProps {
  markdown: string;
  platform: PlatformId;
}

export default function PlatformPreview({ markdown, platform }: PlatformPreviewProps) {
  const [copied, setCopied] = useState(false);
  const config = PLATFORM_CONFIGS[platform];
  const result = useMemo(() => {
    const renderer = renderers[platform];
    return renderer(markdown);
  }, [markdown, platform]);

  const handleCopy = async () => {
    try {
      if (config.outputFormat === 'html') {
        // @ts-expect-error ClipboardItem not in all TS versions
        const item = new ClipboardItem({
          'text/html': new Blob([result.html], { type: 'text/html' }),
          'text/plain': new Blob([result.plainText], { type: 'text/plain' }),
        });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(
          config.outputFormat === 'plaintext' ? result.plainText : result.copyContent ?? result.plainText
        );
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      await navigator.clipboard.writeText(result.plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const charCount = result.plainText.length;
  const overLimit = charCount > config.maxBodyLength;

  const placeholderText = '# 标题\n\n开始写你的内容...';

  return (
    <div className="preview-panel">
      <div className="preview-header">
        <h2>{config.name} 预览</h2>
        <div className="preview-actions">
          <span className={`char-count ${overLimit ? 'over-limit' : ''}`}>
            {charCount}/{config.maxBodyLength}
          </span>
          {overLimit && <span className="limit-warn">超出字数限制</span>}
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? '已复制!' : '复制内容'}
          </button>
        </div>
      </div>

      <div className="preview-body">
        <div className="phone-frame">
          <div className="phone-header">
            <span className="phone-title">{config.name}</span>
          </div>
          {result.coverImage && config.id === 'xiaohongshu' && (
            <div className="cover-image-preview">
              <img src={result.coverImage} alt="封面图" />
              <span className="cover-label">封面图 (建议 {config.coverAspectRatio.width}:{config.coverAspectRatio.height})</span>
            </div>
          )}
          {result.coverImage && config.id !== 'xiaohongshu' && (
            <div className="cover-image-banner">
              <img src={result.coverImage} alt="封面图" />
            </div>
          )}
          <div className="phone-content">
            {markdown.trim() ? (
              <div
                className={`platform-content content-${platform}`}
                dangerouslySetInnerHTML={{ __html: result.html }}
              />
            ) : (
              <div className="empty-preview" style={{ color: '#999', padding: '40px 20px', textAlign: 'center' }}>
                在左侧编辑器中输入内容，这里会实时显示{config.name}的预览效果
              </div>
            )}
          </div>
        </div>

        {/* Copyable content preview */}
        <details className="copy-preview-details">
          <summary>原始复制内容预览（{config.outputFormat === 'html' ? 'HTML' : config.outputFormat === 'plaintext' ? '纯文本' : 'Markdown'}）</summary>
          <pre className="copy-preview">
            {config.outputFormat === 'html' ? result.html : result.plainText}
          </pre>
        </details>
      </div>
    </div>
  );
}
