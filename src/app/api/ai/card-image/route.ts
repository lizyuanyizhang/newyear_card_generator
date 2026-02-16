/**
 * AI 贺卡图像生成 - 通义万相（与千问共用 DASHSCOPE_API_KEY）
 * 节约成本：用户点击「AI 生成」才调用，支持缓存（相同 prompt 可复用）
 */

import { NextRequest, NextResponse } from "next/server";

const WANX_URL =
  "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";

// wan2.6-t2i 约 0.08-0.16 元/张；新用户 500 张免费
const MODEL = "wan2.6-t2i";

function buildPrompt(data: {
  recipientName: string;
  blessing: string;
  year: string;
  template: string;
}): string {
  const tmpl = {
    inkWash: "传统水墨画风格，宣纸质感",
    minimal: "极简风格，留白多",
    modern: "现代东方美学，几何线条",
    festive: "喜庆中国风，红金配色",
  }[data.template] || "中国风";
  return `A vertical Chinese Lunar New Year poster for Year of the Horse (${data.year}). 
Festive deep red background with subtle vintage paper texture. 
Center: golden-yellow rectangular scroll with elegant Chinese calligraphy.
Galloping horse silhouette in traditional black ink-wash style, ink splashes.
Chinese text: "新春快乐", "致 ${data.recipientName}", blessing "${data.blessing}".
${tmpl}. Symmetrical composition, traditional oriental aesthetic. High quality, 9:16 ratio.`;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "请配置 DASHSCOPE_API_KEY 环境变量（与千问共用）" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { recipientName, blessing, year, template } = body as {
      recipientName?: string;
      blessing?: string;
      year?: string;
      template?: string;
    };

    const prompt = buildPrompt({
      recipientName: recipientName || "亲爱的朋友",
      blessing: blessing || "愿新年胜旧年",
      year: year || "丙午",
      template: template || "inkWash",
    });

    const res = await fetch(WANX_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        input: {
          messages: [
            {
              role: "user",
              content: [{ text: prompt }],
            },
          ],
        },
        parameters: {
          n: 1,
          size: "1104*1472", // 3:4 竖版
          watermark: false,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Wanx error:", err);
      return NextResponse.json(
        { error: `万相 API 调用失败: ${res.status}` },
        { status: 502 }
      );
    }

    const data = (await res.json()) as {
      output?: {
        choices?: Array<{
          message?: { content?: Array<{ image?: string; type?: string }> };
        }>;
      };
    };

    const imageUrl =
      data?.output?.choices?.[0]?.message?.content?.find(
        (c) => c.type === "image" && c.image
      )?.image;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "未获取到生成图像" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      imageUrl,
      prompt: prompt.slice(0, 200) + "...",
    });
  } catch (e) {
    console.error("AI card-image error:", e);
    return NextResponse.json(
      { error: "服务暂不可用，请稍后重试" },
      { status: 500 }
    );
  }
}
