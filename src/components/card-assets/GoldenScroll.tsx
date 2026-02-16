"use client";

/**
 * 金色卷轴/画框 - 参考提示词 golden-yellow rectangular scroll
 * 居中垂直矩形，金色描边 + 浅金/米色内底
 */

interface GoldenScrollProps {
  children: React.ReactNode;
  className?: string;
}

const SCROLL = {
  border: "2px solid rgba(216,176,56,0.8)",
  innerBorder: "1px solid rgba(232,200,74,0.4)",
  bg: "rgba(255,248,220,0.92)",
  shadow: "inset 0 0 20px rgba(216,176,56,0.15)",
} as const;

export default function GoldenScroll({ children, className = "" }: GoldenScrollProps) {
  return (
    <div
      className={`absolute left-[8%] right-[8%] top-[6%] bottom-[6%] flex flex-col overflow-hidden ${className}`}
      style={{
        background: SCROLL.bg,
        border: SCROLL.border,
        boxShadow: SCROLL.shadow,
      }}
    >
      <div
        className="pointer-events-none absolute inset-2"
        style={{ border: SCROLL.innerBorder }}
      />
      {children}
    </div>
  );
}
