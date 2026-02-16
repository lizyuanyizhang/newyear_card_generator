"use client";

import { useId } from "react";

/**
 * 奔跑马剪影 - 水墨风格 (Shuimo ink-wash)
 * 参考提示词：dynamic silhouette of a galloping horse in traditional black ink-wash style
 * 可替换为 publicdomainvectors.org "Galloping horse outline" 或 freesvg.org "wild galloping horse"
 */

interface GallopingHorseProps {
  className?: string;
  style?: React.CSSProperties;
  fill?: string;
  /** 水墨风格：半透明 + 边缘柔化 */
  inkWash?: boolean;
}

// 奔跑态马剪影 - 四肢伸展，动态感
export default function GallopingHorse({
  className = "",
  style,
  fill = "#1a1a1a",
  inkWash = true,
}: GallopingHorseProps) {
  const filterId = useId().replace(/:/g, "-");
  return (
    <svg
      viewBox="0 0 120 80"
      className={className}
      style={style}
      aria-hidden
    >
      <defs>
        {inkWash && (
          <filter id={`galloping-ink-${filterId}`} x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
          </filter>
        )}
      </defs>
      <g filter={inkWash ? `url(#galloping-ink-${filterId})` : undefined}>
        <path
          fill={fill}
          fillOpacity={inkWash ? 0.88 : 1}
          d="M15 65 L18 50 L25 38 L38 30 L55 28 L72 32 L88 42 L98 55 L102 68 L98 75 L88 72 L92 60 L85 48 L70 40 L55 38 L42 42 L32 52 L25 65 L22 72 L18 70 L20 58 Z"
        />
      </g>
    </svg>
  );
}
