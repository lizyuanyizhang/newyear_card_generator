"use client";

import { useId } from "react";

/**
 * 水墨飞溅 - Ink splashes
 * 参考提示词：ink splashes (水墨飞溅)
 * 用于传统水墨风格，增加动态与写意感
 */

interface InkSplashesProps {
  className?: string;
  /** 飞溅点透明度 */
  opacity?: number;
  /** 飞溅点颜色 */
  color?: string;
}

// 抽象水墨飞溅点 - 不规则椭圆/水滴形
export default function InkSplashes({
  className = "",
  opacity = 0.15,
  color = "#1a1a1a",
}: InkSplashesProps) {
  const id = useId().replace(/:/g, "");
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id={`ink-splash-${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
          </filter>
        </defs>
        <ellipse cx="20" cy="75" rx="8" ry="4" fill={color} opacity={opacity} filter={`url(#ink-splash-${id})`} />
        <ellipse cx="85" cy="25" rx="6" ry="5" fill={color} opacity={opacity * 0.8} filter={`url(#ink-splash-${id})`} />
        <ellipse cx="75" cy="70" rx="5" ry="3" fill={color} opacity={opacity * 0.6} filter={`url(#ink-splash-${id})`} />
        <ellipse cx="15" cy="30" rx="4" ry="6" fill={color} opacity={opacity * 0.5} filter={`url(#ink-splash-${id})`} />
      </svg>
    </div>
  );
}
