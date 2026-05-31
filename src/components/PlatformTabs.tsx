import type { PlatformId } from '../types';
import { PLATFORM_CONFIGS } from '../constants/platforms';

interface PlatformTabsProps {
  active: PlatformId;
  onChange: (id: PlatformId) => void;
}

const platforms: PlatformId[] = ['wechat', 'zhihu', 'xiaohongshu', 'bilibili'];

export default function PlatformTabs({ active, onChange }: PlatformTabsProps) {
  return (
    <div className="platform-tabs">
      {platforms.map((id) => {
        const config = PLATFORM_CONFIGS[id];
        return (
          <button
            key={id}
            className={`platform-tab ${active === id ? 'active' : ''}`}
            onClick={() => onChange(id)}
          >
            <span className="tab-name">{config.name}</span>
            <span className="tab-desc">{config.description}</span>
          </button>
        );
      })}
    </div>
  );
}
