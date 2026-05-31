export type PlatformId = 'wechat' | 'zhihu' | 'xiaohongshu' | 'bilibili';

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  description: string;
  outputFormat: 'html' | 'markdown' | 'plaintext';
  maxTitleLength: number;
  maxBodyLength: number;
  coverAspectRatio: { width: number; height: number };
  supportedFeatures: string[];
  unsupportedFeatures: string[];
}

export interface RenderResult {
  html: string;
  plainText: string;
  copyContent?: string;
}
