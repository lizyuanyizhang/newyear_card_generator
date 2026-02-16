/**
 * 贺卡背景图配置（用户提供的 9 张图片）
 */

export const BG_CARD_CONFIG = [
  { id: "minimal" as const, name: "米金", desc: "米色·橙底", filename: "minimal.png" },
  { id: "scroll" as const, name: "红联", desc: "红褐·侧边对联", filename: "scroll.png" },
  { id: "playful" as const, name: "喜春", desc: "米色·喜春", filename: "playful.png" },
  { id: "handdrawn" as const, name: "手绘", desc: "米色", filename: "handdrawn.png" },
] as const;

export type BgCardId = (typeof BG_CARD_CONFIG)[number]["id"];
