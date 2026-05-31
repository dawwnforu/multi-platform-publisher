import { renderWechat } from './wechat';
import { renderZhihu } from './zhihu';
import { renderXiaohongshu } from './xiaohongshu';
import { renderBilibili } from './bilibili';
import type { PlatformId, RenderResult } from '../types';

export type PlatformRenderer = (markdown: string) => RenderResult & { coverImage: string | null };

export const renderers: Record<PlatformId, PlatformRenderer> = {
  wechat: renderWechat,
  zhihu: renderZhihu,
  xiaohongshu: renderXiaohongshu,
  bilibili: renderBilibili,
};
