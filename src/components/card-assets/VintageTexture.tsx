"use client";

/**
 * 复古纸张纹理 - 参考 AI 提示词中的 "subtle vintage paper texture"
 * 叠加在红底上，模拟宣纸/老纸质感
 */

export default function VintageTexture() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.08]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        mixBlendMode: "overlay",
      }}
      aria-hidden
    />
  );
}
