import { renderForPlatform } from './base';
import { PLATFORM_CONFIGS } from '../constants/platforms';
import type { RenderResult } from '../types';

export function renderXiaohongshu(markdown: string): RenderResult & { coverImage: string | null } {
  const result = renderForPlatform(markdown, PLATFORM_CONFIGS.xiaohongshu);
  const plainText = addEmojiBreaks(result.copyContent);
  return {
    html: plainTextToHtml(plainText),
    plainText,
    coverImage: result.coverImage,
  };
}

function addEmojiBreaks(text: string): string {
  return text
    .replace(/([。！？；])\n*/g, '$1\n\n')
    .replace(/\n{3,}/g, '\n\n');
}

function plainTextToHtml(text: string): string {
  const paragraphs = text.split('\n\n').filter(Boolean);
  return paragraphs
    .map((p) => `<p style="font-size:15px;color:#333;line-height:1.8;margin:0 0 12px;white-space:pre-wrap;">${p}</p>`)
    .join('');
}
