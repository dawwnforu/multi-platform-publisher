import { renderForPlatform } from './base';
import { PLATFORM_CONFIGS } from '../constants/platforms';
import type { RenderResult } from '../types';

export function renderBilibili(markdown: string): RenderResult & { coverImage: string | null } {
  const result = renderForPlatform(markdown, PLATFORM_CONFIGS.bilibili);
  return {
    html: result.html,
    plainText: stripHtml(result.html),
    coverImage: result.coverImage,
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim();
}
