"use client";

/**
 * 贺卡预览 - 4 种风格
 * Traditional ink-wash · Minimalist · Modern oriental · Festive scroll
 * 设计规范：竖版海报、对称、中心卷轴、喜庆深红、金黄、水墨黑、复古纸张、宣纸感、奔马剪影、水墨飞溅、中国书法
 */

import { forwardRef } from "react";
import type { CardData, CardFont, CardTemplate } from "@/types/card";
import GallopingHorse from "./card-assets/GallopingHorse";
import PlumBlossom from "./card-assets/PlumBlossom";
import VintageTexture from "./card-assets/VintageTexture";
import InkSplashes from "./card-assets/InkSplashes";
import GoldenScroll from "./card-assets/GoldenScroll";

interface CardPreviewProps {
  data: CardData;
}

const PALETTE = {
  red: "#B71C1C",
  redDark: "#8B0000",
  gold: "#D4AF37",
  goldLight: "#E8C84A",
  ink: "#1a1a1a",
  cream: "rgba(255,248,220,0.95)",
  rice: "#FFF8E7",
} as const;

const FONT_FAMILY_MAP: Record<CardFont, string> = {
  maShanZheng: '"Ma Shan Zheng", "Noto Serif SC", "KaiTi", serif',
  liuJianMaoCao: '"Liu Jian Mao Cao", "Ma Shan Zheng", "KaiTi", serif',
  longCang: '"Long Cang", "Ma Shan Zheng", "KaiTi", serif',
  zcoolKuaiLe: '"ZCOOL KuaiLe", "Noto Serif SC", serif',
  zcoolXiaoWei: '"ZCOOL XiaoWei", "Noto Serif SC", serif',
  notoSerif: '"Noto Serif SC", "Source Han Serif SC", "SimSun", serif',
};

const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(
  function CardPreview({ data }, ref) {
    const yearLabel = `${data.year}马年 · 新春`;
    const fontFamily = FONT_FAMILY_MAP[data.cardFont ?? "maShanZheng"];
    const template: CardTemplate = data.template ?? "inkWash";

    return (
      <div
        ref={ref}
        className="aspect-[3/4] w-full max-w-sm overflow-hidden"
        style={{ minHeight: 400 }}
      >
        {template === "inkWash" && (
          <InkWashTemplate data={data} yearLabel={yearLabel} fontFamily={fontFamily} />
        )}
        {template === "minimal" && (
          <MinimalTemplate data={data} yearLabel={yearLabel} fontFamily={fontFamily} />
        )}
        {template === "modern" && (
          <ModernTemplate data={data} yearLabel={yearLabel} fontFamily={fontFamily} />
        )}
        {template === "festive" && (
          <FestiveTemplate data={data} yearLabel={yearLabel} fontFamily={fontFamily} />
        )}
      </div>
    );
  }
);

// 通用卷轴内容（主标题 + 可选马 + 祝福 + 小字）
function ScrollContent({
  data,
  yearLabel,
  fontFamily,
  titleColor,
  textColor,
  subColor,
  showHorse = false,
  showPlum = false,
}: {
  data: CardData;
  yearLabel: string;
  fontFamily: string;
  titleColor: string;
  textColor: string;
  subColor: string;
  showHorse?: boolean;
  showPlum?: boolean;
}) {
  const style = { fontFamily };
  return (
    <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4 px-6 py-4 text-center">
      <p className="text-lg font-bold tracking-[0.3em]" style={{ color: titleColor, ...style }}>
        新春快乐
      </p>
      {showHorse && (
        <div className="my-1 flex justify-center opacity-90">
          <GallopingHorse fill={textColor} inkWash className="h-16 w-auto" />
        </div>
      )}
      {showPlum && !showHorse && (
        <div className="my-1 flex justify-center gap-2">
          <PlumBlossom size={20} fill="rgba(139,105,20,0.3)" stroke={titleColor} />
          <PlumBlossom size={16} fill="rgba(139,105,20,0.25)" stroke={titleColor} />
          <PlumBlossom size={20} fill="rgba(139,105,20,0.3)" stroke={titleColor} />
        </div>
      )}
      <p className="text-sm" style={{ color: textColor, ...style }}>
        致 <span className="font-bold">{data.recipientName}</span>
      </p>
      <p className="max-w-[200px] text-sm leading-[2]" style={{ color: textColor, ...style }}>
        {data.blessing}
      </p>
      <p className="mt-1 text-[10px] tracking-widest" style={{ color: subColor, ...style }}>
        除夕守岁 · 辞旧迎新 · {yearLabel}
      </p>
      {data.senderName && (
        <p className="text-[10px]" style={{ color: subColor, opacity: 0.9, ...style }}>
          —— {data.senderName} 敬上
        </p>
      )}
    </div>
  );
}

// 1. 传统水墨感 - Traditional Chinese ink-wash
// 浓重宣纸纹理、水墨飞溅、奔马剪影、黑色书法
function InkWashTemplate({
  data,
  yearLabel,
  fontFamily,
}: {
  data: CardData;
  yearLabel: string;
  fontFamily: string;
}) {
  return (
    <div
      className="relative flex h-full flex-col overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${PALETTE.red} 0%, ${PALETTE.redDark} 100%)`,
        boxShadow: "inset 0 0 0 2px rgba(212,175,55,0.25)",
      }}
    >
      <VintageTexture />
      <InkSplashes color={PALETTE.ink} opacity={0.12} />
      <GoldenScroll>
        <ScrollContent
          data={data}
          yearLabel={yearLabel}
          fontFamily={fontFamily}
          titleColor="#8B6914"
          textColor={PALETTE.ink}
          subColor="#6B5B3D"
          showHorse
        />
      </GoldenScroll>
      <div
        className="absolute -right-2 top-[10%] text-5xl font-black opacity-[0.08]"
        style={{ color: PALETTE.goldLight, fontFamily }}
      >
        马
      </div>
    </div>
  );
}

// 2. 极简 - Minimalist
// 大留白、浅色背景、细线中心卷轴、克制元素
function MinimalTemplate({
  data,
  yearLabel,
  fontFamily,
}: {
  data: CardData;
  yearLabel: string;
  fontFamily: string;
}) {
  return (
    <div
      className="relative flex h-full flex-col overflow-hidden"
      style={{
        background: PALETTE.rice,
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <VintageTexture />
      <div
        className="absolute left-[10%] right-[10%] top-[8%] bottom-[8%] flex flex-col overflow-hidden"
        style={{
          border: "1px solid rgba(0,0,0,0.12)",
          background: "rgba(255,255,255,0.6)",
        }}
      >
        <div className="pt-8 text-center">
          <div className="mx-auto mb-2 h-px w-12 bg-[#1a1a1a]/15" />
          <p className="text-[10px] tracking-[0.5em]" style={{ color: "#78716C", fontFamily }}>
            {yearLabel}
          </p>
        </div>
        <ScrollContent
          data={data}
          yearLabel={yearLabel}
          fontFamily={fontFamily}
          titleColor={PALETTE.ink}
          textColor={PALETTE.ink}
          subColor="#78716C"
        />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 h-px w-8 bg-[#1a1a1a]/10" />
      </div>
    </div>
  );
}

// 3. 现代东方 - Modern oriental aesthetic
// 红金黑几何块、中心卷轴现代感、简洁线条
function ModernTemplate({
  data,
  yearLabel,
  fontFamily,
}: {
  data: CardData;
  yearLabel: string;
  fontFamily: string;
}) {
  return (
    <div
      className="relative flex h-full flex-col overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${PALETTE.red} 0%, #7B0A0A 100%)`,
        boxShadow: "inset 0 0 0 4px rgba(212,175,55,0.4)",
      }}
    >
      <VintageTexture />
      <div
        className="absolute left-[6%] right-[6%] top-[5%] bottom-[5%] flex flex-col overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #FFFEF5 0%, #FFF8E7 100%)",
          border: "2px solid rgba(212,175,55,0.7)",
          boxShadow: "inset 0 0 30px rgba(212,175,55,0.08)",
        }}
      >
        <div className="flex justify-center pt-4">
          <div
            className="h-px flex-1 max-w-12"
            style={{ background: `linear-gradient(90deg,transparent,${PALETTE.gold})` }}
          />
          <span
            className="px-4 text-[10px] tracking-[0.4em]"
            style={{ color: PALETTE.gold, fontFamily }}
          >
            {yearLabel}
          </span>
          <div
            className="h-px flex-1 max-w-12"
            style={{ background: `linear-gradient(90deg,${PALETTE.gold},transparent)` }}
          />
        </div>
        <div className="my-2 flex justify-center opacity-80">
          <GallopingHorse fill={PALETTE.ink} inkWash={false} className="h-14 w-auto" />
        </div>
        <ScrollContent
          data={data}
          yearLabel={yearLabel}
          fontFamily={fontFamily}
          titleColor={PALETTE.ink}
          textColor={PALETTE.ink}
          subColor="#6B5B3D"
        />
      </div>
    </div>
  );
}

// 4. 喜庆卷轴 - Festive scroll
// 对称、中心卷轴、金黄书法、红底、可加梅花
function FestiveTemplate({
  data,
  yearLabel,
  fontFamily,
}: {
  data: CardData;
  yearLabel: string;
  fontFamily: string;
}) {
  return (
    <div
      className="relative flex h-full flex-col overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #C41E3A 0%, ${PALETTE.redDark} 100%)`,
        boxShadow: "inset 0 0 0 3px rgba(232,200,74,0.4)",
      }}
    >
      <VintageTexture />
      <div className="absolute left-3 top-3 opacity-50">
        <PlumBlossom size={22} fill="rgba(255,255,255,0.8)" stroke={PALETTE.gold} />
      </div>
      <div className="absolute right-4 top-3 opacity-50">
        <PlumBlossom size={18} fill="rgba(255,255,255,0.8)" stroke={PALETTE.gold} />
      </div>
      <div className="absolute left-4 bottom-6 opacity-40">
        <PlumBlossom size={16} fill="rgba(255,255,255,0.75)" stroke={PALETTE.gold} />
      </div>
      <div className="absolute right-4 bottom-6 opacity-40">
        <PlumBlossom size={20} fill="rgba(255,255,255,0.75)" stroke={PALETTE.gold} />
      </div>
      <GoldenScroll>
        <ScrollContent
          data={data}
          yearLabel={yearLabel}
          fontFamily={fontFamily}
          titleColor="#B8860B"
          textColor="#8B6914"
          subColor="#6B5B3D"
          showPlum
        />
      </GoldenScroll>
    </div>
  );
}

export default CardPreview;
