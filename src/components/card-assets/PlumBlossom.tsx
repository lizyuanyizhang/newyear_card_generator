"use client";

/**
 * 梅花 SVG 组件 - 五瓣梅花装饰
 * Plum Blossom (梅花) - 传统新春意象，象征坚毅与希望
 */

interface PlumBlossomProps {
  size?: number;
  fill?: string;
  stroke?: string;
  className?: string;
}

// 单朵梅花：5 瓣 + 花蕊
export default function PlumBlossom({
  size = 24,
  fill = "rgba(255,255,255,0.9)",
  stroke = "rgba(216,176,56,0.6)",
  className = "",
}: PlumBlossomProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      {/* 5 瓣花瓣 - 环绕中心 */}
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="12"
          cy="12"
          rx="5"
          ry="3"
          fill={fill}
          stroke={stroke}
          strokeWidth="0.5"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
      {/* 花蕊 */}
      <circle cx="12" cy="12" r="1.5" fill={stroke} />
    </svg>
  );
}
