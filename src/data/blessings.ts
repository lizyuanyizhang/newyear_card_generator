/**
 * 新年祝福语词库 - 按目标对象分类（亲人、朋友、同事、客户、crush）
 */

import type { Blessing } from "@/types/card";

export const BLESSINGS: Blessing[] = [
  // 亲人 - 温暖真挚、阖家幸福、健康长寿，紧跟 2026 马年与烟火/灯火可亲等时事
  { id: "f1", text: "新年快乐，万事如意，阖家幸福！", relationships: ["family"] },
  { id: "f2", text: "马年大吉，五福临门，幸福安康！", relationships: ["family"] },
  { id: "f3", text: "家人闲坐，灯火可亲。新年伊始，喜乐安宁。", relationships: ["family"] },
  { id: "f4", text: "去岁千般皆如意，今年万事定称心。", relationships: ["family"] },
  { id: "f5", text: "愿新年胜旧年，常安长安，有趣有盼，无灾无难。", relationships: ["family"] },
  { id: "f6", text: "马年到，福气绕！愿家人龙马精神，岁岁平安多福寿。", relationships: ["family"] },
  { id: "f7", text: "骏马驮福至，安康伴岁长。愿家人平安喜乐，福寿绵长。", relationships: ["family"] },
  { id: "f8", text: "烟火起，照人间。祝家人年年无碍，岁岁无忧，万事顺意！", relationships: ["family"] },
  { id: "f9", text: "愿新的一年，生活如熹光，温柔又明亮。爱的人，都喜乐如常。", relationships: ["family"] },
  { id: "f10", text: "马年添福寿，松鹤永延年。阖家欢乐，笑口常开！", relationships: ["family"] },

  // 朋友 - 俏皮亲切、真诚祝福
  { id: "p1", text: "暴富暴美，脱单不脱发！", relationships: ["friend"] },
  { id: "p2", text: "新的一年，搞钱顺利，干啥都顺利！", relationships: ["friend"] },
  { id: "p3", text: "祝：有钱有闲，有颜有伴", relationships: ["friend"] },
  { id: "p4", text: "愿新年胜旧年，想要的都有！", relationships: ["friend"] },
  { id: "p5", text: "马年冲冲冲，好运拦不住！", relationships: ["friend"] },
  { id: "p6", text: "春风十里，不如新年有你", relationships: ["friend"] },
  { id: "p7", text: "祝你：前程似锦，心有归处", relationships: ["friend"] },
  { id: "p8", text: "一帆风顺，万马奔腾，马到成功！", relationships: ["friend"] },

  // 同事 - 工作顺利、事业有成、专业得体，紧贴马年与职场时事
  { id: "c1", text: "新年快乐，工作顺利，步步高升！", relationships: ["colleague"] },
  { id: "c2", text: "马年行大运，锦鲤附体！", relationships: ["colleague"] },
  { id: "c3", text: "新春大吉，事业蒸蒸日上！", relationships: ["colleague"] },
  { id: "c4", text: "春风得意，大展宏图！", relationships: ["colleague"] },
  { id: "c5", text: "新年新气象，KPI 稳稳哒～", relationships: ["colleague"] },
  { id: "c6", text: "马年开工大吉，愿我们团队携手并进，达成更多目标！", relationships: ["colleague"] },
  { id: "c7", text: "马到成功，业绩飞升！新年一起加油", relationships: ["colleague"] },
  { id: "c8", text: "祝马年工作顺利，少扯皮、多顺心！", relationships: ["colleague"] },
  { id: "c9", text: "马上加薪，马上如意！新年开工大吉", relationships: ["colleague"] },
  { id: "c10", text: "马年大吉，稳、暖、顺——工作稳、心里暖、万事顺！", relationships: ["colleague"] },
  { id: "c11", text: "开工大吉！愿我们团队在马年战无不胜，人人升职加薪", relationships: ["colleague"] },
  { id: "c12", text: "龙马精神，马不停蹄，新年一起冲冲冲！", relationships: ["colleague"] },

  // 客户 - 商务祝福、生动有画面感（参考马年意象、感谢合作、财源亨通）
  { id: "b1", text: "策马扬鞭赴山海，财源广进福常伴", relationships: ["client"] },
  { id: "b2", text: "马到功成，订单排成长龙！", relationships: ["client"] },
  { id: "b3", text: "感恩信任，新的一年携手共赢！", relationships: ["client"] },
  { id: "b4", text: "福气东来，骏马奔腾启新程", relationships: ["client"] },
  { id: "b5", text: "一马平川拓商途，生意兴隆万事顺", relationships: ["client"] },
  { id: "b6", text: "龙马精神，事业腾飞正当时！", relationships: ["client"] },
  { id: "b7", text: "生意兴隆通四海，财源茂盛达三江", relationships: ["client"] },

  // crush - 含蓄心动、温暖暧昧，紧贴烟火/马年/遇见等时事梗
  { id: "r1", text: "愿新年，温暖有光，平安喜乐", relationships: ["crush"] },
  { id: "r2", text: "新年快乐，早日暴富带我飞！", relationships: ["crush"] },
  { id: "r3", text: "过年好！祝你吃好喝好不长胖～", relationships: ["crush"] },
  { id: "r4", text: "愿新年的第一缕光，落在你肩上", relationships: ["crush"] },
  { id: "r5", text: "新的一年，继续保持可爱！", relationships: ["crush"] },
  { id: "r6", text: "烟火向星辰，所愿皆成真。岁岁常欢愉～", relationships: ["crush"] },
  { id: "r7", text: "希望烟花绽放时，美好也随之降临", relationships: ["crush"] },
  { id: "r8", text: "辞暮尔尔，烟火年年。愿新的一年，与美好相遇", relationships: ["crush"] },
  { id: "r9", text: "新年愿望：有钱有你", relationships: ["crush"] },
  { id: "r10", text: "愿你策马扬鞭，所遇皆良善，岁岁常欢愉", relationships: ["crush"] },
  { id: "r11", text: "祝你心里常放烟花，新年快乐", relationships: ["crush"] },
  { id: "r12", text: "跨年的烟火再响，也没有我想你那么想", relationships: ["crush"] },
  { id: "r13", text: "把思念系在马鬃，新岁奔向你", relationships: ["crush"] },
  { id: "r14", text: "愿岁岁常欢愉，年年皆胜意，平安喜乐", relationships: ["crush"] },
];

export const BLESSING_CATEGORIES = [
  { id: "family", name: "亲人" },
  { id: "friend", name: "朋友" },
  { id: "colleague", name: "同事" },
  { id: "client", name: "客户" },
  { id: "crush", name: "crush" },
] as const;
