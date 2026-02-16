"use client";

/**
 * 马剪影 SVG - 免费可商用
 * Horse Silhouette SVG - Free for commercial use
 *
 * 免费图案方案说明 / Free Art Resource Options:
 * 1. 本项目使用自绘的极简马剪影（无版权问题）
 * 2. 如需替换为艺术家图案，推荐以下免费资源：
 *    - publicdomainvectors.org 搜索 "horse" → 27+ CC0 马矢量
 *    - freesvg.org - Horse Silhouette #146487 (Public Domain)
 *    - 易点 SVG 编辑器 svg.wxeditor.com - 免费可商用马图案
 * 使用方式：下载 SVG，将 <path d="..."> 的 d 值替换下方 path 的 d 属性即可
 */

interface HorseSilhouetteProps {
  className?: string;
  style?: React.CSSProperties;
  fill?: string;
}

// 极简马剪影 - 侧面立姿，灵感来自传统剪纸/年画风格
export default function HorseSilhouette({
  className = "",
  style,
  fill = "currentColor",
}: HorseSilhouetteProps) {
  return (
    <svg
      viewBox="0 0 160 100"
      className={className}
      style={style}
      aria-hidden
    >
      <path
        fill={fill}
        d="M20 85 L22 70 L28 55 L40 45 L55 40 L75 38 L95 42 L110 52 L120 65 L125 80 L122 90 L115 85 L118 72 L112 60 L95 50 L75 48 L55 52 L42 62 L35 75 L32 88 L28 92 L24 88 Z"
      />
    </svg>
  );
}
