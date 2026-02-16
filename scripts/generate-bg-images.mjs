#!/usr/bin/env node
/**
 * 预生成背景图脚本 - 一次性调用万相 API 生成 4 张图
 * 运行: node scripts/generate-bg-images.mjs
 * 需配置 DASHSCOPE_API_KEY 环境变量
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BgCards = [
  {
    id: "inkWash",
    filename: "inkWash.png",
    prompt: `A vertical Chinese Lunar New Year poster for Year of the Horse. Festive deep red background with subtle vintage rice paper texture. Center: golden-yellow rectangular scroll frame, the inner area is empty light cream color for calligraphy. Dynamic galloping horse silhouette in traditional black ink-wash style with ink splashes, outside the center. Traditional oriental aesthetic. Symmetrical composition. No text in the center. High quality, 9:16.`,
  },
  {
    id: "minimal",
    filename: "minimal.png",
    prompt: `Minimalist vertical Chinese New Year poster for Year of the Horse. Light cream and white background, subtle paper texture. Center: very subtle thin rectangular frame, mostly empty space for text. A few minimalist strokes or silhouettes. Very clean, lots of breathing room. No text. Traditional oriental minimalism. 9:16.`,
  },
  {
    id: "modern",
    filename: "modern.png",
    prompt: `Modern oriental vertical Chinese New Year poster for Year of the Horse. Deep red gradient background. Center: geometric golden frame, clean lines. Galloping horse silhouette in black, modern simplified style. Contemporary design, symmetrical. Empty center for text. 9:16.`,
  },
  {
    id: "festive",
    filename: "festive.png",
    prompt: `Festive Chinese New Year vertical poster for Year of the Horse. Bright red background with golden accents. Center: ornate golden scroll frame. Plum blossom motifs in corners. Inner scroll area empty cream color for calligraphy. Traditional celebration style. No text in center. 9:16.`,
  },
];

const WANX_URL =
  "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
const MODEL = "wan2.6-t2i";
const OUT_DIR = path.join(__dirname, "../public/card-bg");

async function generateOne(item) {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) {
    throw new Error("请设置 DASHSCOPE_API_KEY 环境变量");
  }

  console.log(`生成 ${item.id}...`);
  const res = await fetch(WANX_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      input: {
        messages: [{ role: "user", content: [{ text: item.prompt }] }],
      },
      parameters: {
        n: 1,
        size: "1104*1472",
        watermark: false,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`万相 API 失败 (${item.id}): ${res.status} ${err}`);
  }

  const data = await res.json();
  const imageUrl =
    data?.output?.choices?.[0]?.message?.content?.find(
      (c) => c.type === "image" && c.image
    )?.image;

  if (!imageUrl) {
    throw new Error(`未获取到图片 (${item.id})`);
  }

  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error(`下载图片失败: ${imageUrl}`);
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const outPath = path.join(OUT_DIR, item.filename);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(outPath, buf);
  console.log(`  已保存: ${outPath}`);
}

async function main() {
  for (const item of BgCards) {
    try {
      await generateOne(item);
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
  }
  console.log("全部完成.");
}

main();
