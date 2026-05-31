import MarkdownIt from 'markdown-it';
import type { PlatformConfig } from '../types';

const md = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: true,
  typographer: true,
});

export function parseMarkdown(content: string): string {
  return md.render(content);
}

function processVideos(html: string, platformId: string): string {
  const videoPattern = /<p>▶ 视频:\s*(.+?)<\/p>/g;
  if (!videoPattern.test(html)) return html;
  videoPattern.lastIndex = 0;

  return html.replace(videoPattern, (_match, url: string) => {
    const trimmedUrl = url.trim();
    const isDirectVideo = /\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i.test(trimmedUrl);

    if (platformId === 'zhihu') {
      return `<p>[视频: <a href="${trimmedUrl}">${trimmedUrl}</a>]</p>`;
    }
    if (platformId === 'xiaohongshu') {
      return `<p>[视频链接: ${trimmedUrl}]</p>`;
    }
    if (isDirectVideo) {
      return `<p><video src="${trimmedUrl}" controls style="max-width:100%;display:block;margin:12px auto;border-radius:8px;" width="100%"></video></p>`;
    }
    return `<p style="text-align:center;padding:20px;background:#f5f5f5;border-radius:8px;margin:12px 0;">🎬 <a href="${trimmedUrl}" target="_blank">点击播放视频</a></p>`;
  });
}

export function renderForPlatform(
  content: string,
  config: PlatformConfig
): { html: string; copyContent: string; coverImage: string | null } {
  let html = md.render(content);
  html = processVideos(html, config.id);
  html = stripUnsupportedFeatures(html, config);
  html = applyPlatformStyles(html, config);

  const plainText = stripMarkdown(content);
  const truncated = truncateText(plainText, config.maxBodyLength);
  const coverImage = extractFirstImage(content);

  let copyContent: string;
  switch (config.outputFormat) {
    case 'html':
      copyContent = html;
      break;
    case 'markdown':
      copyContent = adaptMarkdown(content, config);
      break;
    case 'plaintext':
      copyContent = truncated;
      break;
  }

  return { html, copyContent, coverImage };
}

function stripUnsupportedFeatures(html: string, config: PlatformConfig): string {
  let result = html;

  if (config.unsupportedFeatures.includes('table')) {
    result = result.replace(/<table[\s\S]*?<\/table>/g, (match) => {
      const text = match.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      return `<p><em>[表格已转为文本: ${text}]</em></p>`;
    });
  }

  if (config.unsupportedFeatures.includes('task-list')) {
    result = result.replace(/<li class="task-list-item"[\s\S]*?<\/li>/g, (match) => {
      const checked = match.includes('checked');
      const text = match.replace(/<[^>]+>/g, '').trim();
      return `<p>${checked ? '☑' : '☐'} ${text}</p>`;
    });
  }

  if (config.unsupportedFeatures.includes('code')) {
    result = result.replace(/<(pre|code)[\s\S]*?<\/(pre|code)>/g, (match) => {
      const text = match.replace(/<[^>]+>/g, '').trim();
      return `<p><em>[代码块] ${text}</em></p>`;
    });
  }

  if (config.unsupportedFeatures.includes('hr')) {
    result = result.replace(/<hr\/?>/, '<p>———</p>');
  }

  return result;
}

function applyPlatformStyles(html: string, config: PlatformConfig): string {
  if (config.id === 'wechat') {
    return html
      .replace(/<h1/g, '<h1 style="font-size:22px;color:#333;margin:16px 0 8px;font-weight:bold;"')
      .replace(/<h2/g, '<h2 style="font-size:19px;color:#333;margin:14px 0 6px;font-weight:bold;"')
      .replace(/<h3/g, '<h3 style="font-size:17px;color:#333;margin:12px 0 6px;font-weight:bold;"')
      .replace(/<p>/g, '<p style="font-size:15px;color:#3e3e3e;line-height:1.75;margin:0 0 16px;letter-spacing:0.5px;">')
      .replace(/<img /g, '<img style="max-width:100%;display:block;margin:12px auto;border-radius:4px;" ')
      .replace(/<blockquote>/g, '<blockquote style="border-left:4px solid #1aad19;padding:10px 16px;margin:16px 0;background:#f8f8f8;color:#666;font-size:14px;">')
      .replace(/<ul>/g, '<ul style="padding-left:24px;margin:8px 0;">')
      .replace(/<ol>/g, '<ol style="padding-left:24px;margin:8px 0;">')
      .replace(/<li>/g, '<li style="margin:4px 0;font-size:15px;color:#3e3e3e;line-height:1.75;">')
      .replace(/<code>/g, '<code style="background:#f0f0f0;padding:2px 6px;border-radius:3px;font-size:13px;color:#d14;">')
      .replace(/<a /g, '<a style="color:#1aad19;text-decoration:none;" ');
  }

  if (config.id === 'bilibili') {
    return html
      .replace(/<h1/g, '<h1 style="font-size:24px;font-weight:bold;margin:20px 0 12px;"')
      .replace(/<h2/g, '<h2 style="font-size:20px;font-weight:bold;margin:18px 0 10px;"')
      .replace(/<img /g, '<img style="max-width:100%;display:block;margin:16px auto;" ')
      .replace(/<pre/g, '<pre style="background:#282c34;color:#abb2bf;padding:16px;border-radius:8px;overflow-x:auto;"');
  }

  return html;
}

function adaptMarkdown(content: string, _config: PlatformConfig): string {
  return content;
}

function stripMarkdown(content: string): string {
  return content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/^>\s/gm, '')
    .replace(/[-*+]\s/g, '')
    .replace(/^\d+\.\s/gm, '')
    .replace(/---+/g, '')
    .replace(/▶\s*视频:\s*.+/g, '[视频链接]')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function truncateText(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3) + '...';
}

function extractFirstImage(content: string): string | null {
  const match = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
  return match ? match[1] : null;
}
