import { renderForPlatform } from './base';
import { PLATFORM_CONFIGS } from '../constants/platforms';
import type { RenderResult } from '../types';

export function renderZhihu(markdown: string): RenderResult & { coverImage: string | null } {
  const result = renderForPlatform(markdown, PLATFORM_CONFIGS.zhihu);
  return {
    html: result.html,
    plainText: result.copyContent,
    coverImage: result.coverImage,
  };
}
