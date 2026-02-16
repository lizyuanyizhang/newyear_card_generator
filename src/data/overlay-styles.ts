/**
 * 每张背景图的文字叠层配置
 * 根据底色明暗、主色、风格匹配合适的文字颜色、描边、衬底
 * 布局逻辑统一在此，避免组件内 template === "xxx" 分散判断
 */

import type { CardTemplate, CardFont } from "@/types/card";

export interface OverlayConfig {
  title: string;
  text: string;
  sub: string;
  stroke?: "dark" | "light";
  backdrop?: "dark" | "light" | "lightFaint" | "lightClear";
  fontHint?: CardFont;
  fontSize?: number;
  positionOffset?: "up" | "center" | "centerUp" | "down";
  transparent?: boolean;
  redOutline?: boolean;
  red?: boolean;
}

/** 叠层布局配置 - 卡片根、背景图、叠层容器、内容区的样式 */
export interface OverlayLayoutConfig {
  rootBackgroundColor?: string;
  imageStyle: { objectFit: "cover" | "contain"; objectPosition: string };
  backdropClass: string;
  backdropStyle: Record<string, string | number>;
  contentMaxWidth: number;
  contentJustify: "flex-start" | "center";
  footerFontSize?: string;
  footerLetterSpacing: string;
}

// 统一金色系：主标题更亮，正文次之，副文案略暗
const GOLD = {
  title: "#E8C84A",
  text: "#D4AF37",
  sub: "#B8860B",
} as const;

const TRANSPARENT = { title: "rgba(255,255,255,0.92)", text: "rgba(255,255,255,0.88)", sub: "rgba(255,255,255,0.82)" };
const RED = { title: "#C41E3A", text: "#B91C1C", sub: "#9B1A1A" };

// 水墨黑 - 传统墨汁色泽，类似宣纸上的墨迹
const INK_BLACK = {
  title: "#1a1a1a",
  text: "#2d2d2d",
  sub: "#404040",
} as const;

// 暗朱绛红 - 一点点暗红，中式传统色（朱砂、印泥、喜春意境）
const DARK_VERMILION = {
  title: "#7D3C3C",
  text: "#6D2E2E",
  sub: "#5C2626",
} as const;

export const OVERLAY_CONFIG: Record<CardTemplate, OverlayConfig> = {
  minimal: { ...INK_BLACK, backdrop: "light", fontHint: "longCang", positionOffset: "up" },
  scroll: { ...GOLD, backdrop: "lightFaint", fontHint: "longCang", positionOffset: "center", fontSize: 16 },
  playful: { ...INK_BLACK, backdrop: "lightClear", fontHint: "zcoolKuaiLe", positionOffset: "center" },
  handdrawn: { ...INK_BLACK, backdrop: "light", fontHint: "zcoolXiaoWei", positionOffset: "down" },
};

// 由 positionOffset 推导的默认叠层定位
const BACKDROP_BY_OFFSET: Record<string, Record<string, string | number>> = {
  up: {
    left: 20,
    right: 20,
    top: "8%",
    height: "84%",
    minHeight: 240,
    justifyContent: "flex-start",
    paddingTop: "9%",
  },
  down: {
    left: 20,
    right: 20,
    top: "28%",
    height: "68%",
    minHeight: 240,
    justifyContent: "center",
  },
  centerUp: {
    left: 20,
    right: 20,
    top: "42%",
    height: "84%",
    minHeight: 280,
    transform: "translateY(-50%)",
    justifyContent: "center",
  },
  center: {
    left: 20,
    right: 20,
    top: "50%",
    height: "84%",
    minHeight: 280,
    transform: "translateY(-50%)",
    justifyContent: "center",
  },
};

// backdrop 颜色映射
const BACKDROP_COLOR: Record<string, string> = {
  dark: "rgba(0,0,0,0.2)",
  lightFaint: "rgba(255,255,255,0.12)",
  lightClear: "rgba(255,255,255,0.14)",
  light: "rgba(255,255,255,0.28)",
};

/** 模板专属布局覆盖 - 有则覆盖默认，无则用 positionOffset 推导 */
const LAYOUT_OVERRIDES: Partial<Record<CardTemplate, Partial<OverlayLayoutConfig>>> = {
  playful: {
    // contain 保证完整显示喜春标题与底部马年图案，避免 html2canvas 导出时顶部裁切
    imageStyle: { objectFit: "contain", objectPosition: "center" },
    rootBackgroundColor: "#F5EDE4", // 与背景图底色一致，contain 时 letterbox 区域不突兀
    backdropClass: "px-3",
    backdropStyle: {
      left: "2%",
      right: "2%",
      top: "48%",
      height: "54%",
      minHeight: 200,
      transform: "translateY(-50%)",
      justifyContent: "center",
      overflow: "hidden",
    },
    contentMaxWidth: 340,
    contentJustify: "center",
    footerFontSize: "13px",
    footerLetterSpacing: "0.05em",
  },
  scroll: {
    rootBackgroundColor: "#8B2500",
    imageStyle: { objectFit: "contain", objectPosition: "center" },
  },
  handdrawn: {
    // contain 保证完整显示「过年啦」、灯笼等背景元素，与喜春同理
    imageStyle: { objectFit: "contain", objectPosition: "center" },
    rootBackgroundColor: "#F5EDE4",
  },
};

/**
 * 根据模板返回统一的叠层布局配置
 * 默认由 positionOffset 推导，模板专属覆盖从 LAYOUT_OVERRIDES 读取
 */
export function getOverlayLayout(template: CardTemplate): OverlayLayoutConfig {
  const overlay = OVERLAY_CONFIG[template] ?? OVERLAY_CONFIG.minimal;
  const offset = overlay.positionOffset ?? "center";
  const backdropColor = BACKDROP_COLOR[overlay.backdrop ?? "light"] ?? BACKDROP_COLOR.light;

  const base: OverlayLayoutConfig = {
    rootBackgroundColor: undefined,
    imageStyle: { objectFit: "cover", objectPosition: "center" },
    backdropClass: "px-5 overflow-hidden",
    backdropStyle: {
      ...BACKDROP_BY_OFFSET[offset],
      background: backdropColor,
    },
    contentMaxWidth: 300,
    contentJustify: offset === "up" ? "flex-start" : "center",
    footerFontSize: overlay.fontSize && overlay.fontSize >= 35 ? "0.85em" : undefined,
    footerLetterSpacing: "0.1em",
  };

  const overrides = LAYOUT_OVERRIDES[template];
  if (!overrides) return base;

  const merged: OverlayLayoutConfig = { ...base };
  const m = merged as unknown as Record<string, unknown>;
  for (const key of Object.keys(overrides) as (keyof OverlayLayoutConfig)[]) {
    const v = overrides[key];
    if (v !== undefined) {
      if (key === "backdropStyle" && typeof v === "object") {
        m.backdropStyle = { ...base.backdropStyle, ...v };
      } else {
        m[key] = v;
      }
    }
  }
  return merged;
}
