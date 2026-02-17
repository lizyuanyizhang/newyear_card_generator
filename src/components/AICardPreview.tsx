"use client";

/**
 * AI 背景贺卡 - 预生成背景图 + 文字叠层
 * 每张图独立配置：文字色、描边、衬底，保证可读性与风格匹配
 */

import { forwardRef, useState } from "react";
import type { CardData, CardFont, CardTemplate } from "@/types/card";
import { BG_CARD_CONFIG } from "@/data/bg-cards";
import { OVERLAY_CONFIG, getOverlayLayout } from "@/data/overlay-styles";

interface AICardPreviewProps {
  data: CardData;
}

const FONT_FAMILY_MAP: Record<CardFont, string> = {
  maShanZheng: '"Ma Shan Zheng", "Noto Serif SC", "KaiTi", serif',
  liuJianMaoCao: '"Liu Jian Mao Cao", "Ma Shan Zheng", "KaiTi", serif',
  longCang: '"Long Cang", "Ma Shan Zheng", "KaiTi", serif',
  zcoolKuaiLe: '"ZCOOL KuaiLe", "Noto Serif SC", serif',
  zcoolXiaoWei: '"ZCOOL XiaoWei", "Noto Serif SC", serif',
  notoSerif: '"Noto Serif SC", "Source Han Serif SC", "SimSun", serif',
};

function getStrokeShadow(stroke: "dark" | "light" | "red"): string {
  const color = stroke === "red" ? "#B91C1C" : stroke === "dark" ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.9)";
  const r = stroke === "red" ? 2 : 1.5;
  return [
    `${r}px 0 0 ${color}`,
    `-${r}px 0 0 ${color}`,
    `0 ${r}px 0 ${color}`,
    `0 -${r}px 0 ${color}`,
    `${r}px ${r}px 0 ${color}`,
    `-${r}px -${r}px 0 ${color}`,
    `${r}px -${r}px 0 ${color}`,
    `-${r}px ${r}px 0 ${color}`,
  ].join(", ");
}

const AICardPreview = forwardRef<HTMLDivElement, AICardPreviewProps>(
  function AICardPreview({ data }, ref) {
    const [imgError, setImgError] = useState(false);
    const template: CardTemplate = data.template ?? "minimal";
    const overlay = OVERLAY_CONFIG[template] ?? OVERLAY_CONFIG.minimal;
    const layout = getOverlayLayout(template);
    const fontHint = overlay.fontHint;
    const fontFamily = FONT_FAMILY_MAP[data.cardFont ?? fontHint ?? "maShanZheng"];
    const yearLabel = `${data.year}马年 · 新春`;
    const config = BG_CARD_CONFIG.find((c) => c.id === template);
    const bgSrc = config ? `/card-bg/${config.filename}` : "/card-bg/minimal.png";
    const strokeShadow = overlay.redOutline ? getStrokeShadow("red") : overlay.stroke ? getStrokeShadow(overlay.stroke) : undefined;

    return (
      <div
        ref={ref}
        data-card-export
        className="relative aspect-[3/4] w-full max-w-md overflow-hidden"
        style={{
          minHeight: 420,
          backgroundColor: layout.rootBackgroundColor,
        }}
      >
        {/* 背景图；加载失败时显示友好占位 */}
        {imgError ? (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#F5EDE4] p-6 text-center text-sm text-[#5C4033]"
            style={{ fontFamily }}
          >
            <p className="font-medium">图片加载失败</p>
            <p className="mt-2 text-xs">请刷新页面重试，或检查网络连接</p>
            <p className="mt-3 text-[10px] text-[#9B8378]">
              若为本地开发：将图片放入 public/card-bg/ 并命名为 {config?.filename ?? "minimal.png"}
            </p>
          </div>
        ) : (
          <img
            src={bgSrc}
            alt=""
            className="absolute inset-0 h-full w-full"
            style={layout.imageStyle}
            crossOrigin="anonymous"
            onError={() => setImgError(true)}
          />
        )}
        {/* 文字叠层 - 文字作为叠层子元素，确保在叠层内智能排版 */}
        {!imgError && overlay.backdrop && (
          <div
            className={`absolute flex flex-col items-center rounded-2xl py-4 ${layout.backdropClass}`}
            style={layout.backdropStyle}
          >
            <div
              className={`flex w-full flex-col items-center text-center ${layout.contentJustify === "flex-start" ? "justify-start" : "flex-1 justify-center"}`}
              style={{
                fontFamily,
                fontSize: overlay.fontSize ? `${overlay.fontSize}px` : "15px",
                lineHeight: 1.85,
                maxWidth: layout.contentMaxWidth,
              }}
            >
              <p
                className="mt-0.5"
                style={{
                  color: overlay.redOutline ? "transparent" : overlay.text,
                  textShadow: strokeShadow,
                  WebkitTextStroke: overlay.redOutline ? "2px #B91C1C" : undefined,
                }}
              >
                致 <span className="font-bold">{data.recipientName}</span>
              </p>
              <p
                className="mt-2 leading-[1.9]"
                style={{
                  color: overlay.redOutline ? "transparent" : overlay.text,
                  textShadow: strokeShadow,
                  WebkitTextStroke: overlay.redOutline ? "2px #B91C1C" : undefined,
                }}
              >
                {data.blessing}
              </p>
              <p
                className="mt-2 whitespace-nowrap"
                style={{
                  color: overlay.redOutline ? "transparent" : overlay.sub,
                  textShadow: strokeShadow,
                  opacity: 0.95,
                  fontSize: layout.footerFontSize,
                  letterSpacing: layout.footerLetterSpacing,
                  WebkitTextStroke: overlay.redOutline ? "1.5px #B91C1C" : undefined,
                }}
              >
                除夕守岁 · 辞旧迎新 · {yearLabel}
              </p>
              {data.senderName && (
                <p
                  className="mt-1.5"
                  style={{
                    color: overlay.redOutline ? "transparent" : overlay.sub,
                    textShadow: strokeShadow,
                    opacity: 0.95,
                    fontSize: overlay.fontSize && overlay.fontSize >= 35 ? "0.85em" : undefined,
                    WebkitTextStroke: overlay.redOutline ? "1.5px #B91C1C" : undefined,
                  }}
                >
                  —— {data.senderName} 敬上
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default AICardPreview;
