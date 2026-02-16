/**
 * 贺卡相关类型定义
 * Type definitions for the greeting card
 */

// 贺卡模板类型 - 4 种背景
export type CardTemplate =
  | "minimal"    // 米金
  | "scroll"     // 红联
  | "playful"    // 喜春
  | "handdrawn"; // 手绘

// 祝福语适用对象 - 按关系分类
export type BlessingRelationship =
  | "family"      // 亲人
  | "friend"      // 朋友
  | "colleague"   // 同事
  | "client"      // 客户
  | "crush";      // crush

export interface Blessing {
  id: string;
  text: string;
  relationships: BlessingRelationship[]; // 适用于哪些关系
  short?: boolean;
}

// 贺卡字体选项（均为 Google Fonts 免费商用）
export type CardFont =
  | "maShanZheng"      // 马善政楷书 - 毛笔楷书
  | "liuJianMaoCao"    // 钟齐流江毛草 - 毛笔草书
  | "longCang"         // 龙藏体 - 毛笔行书
  | "zcoolKuaiLe"      // 站酷快乐体 - 活泼
  | "zcoolXiaoWei"     // 站酷小薇体 - 手写感
  | "notoSerif";       // 思源宋体 - 典雅

// 贺卡数据 - 用户自定义的内容
export interface CardData {
  recipientName: string; // 收件人姓名
  senderName: string; // 寄件人姓名
  blessing: string; // 祝福语
  template: CardTemplate; // 模板风格
  cardFont: CardFont; // 贺卡字体
  year: string; // 年份显示，如 "乙巳"
}
