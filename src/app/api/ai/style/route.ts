/**
 * AI 卡片风格建议 - 接入通义千问
 * 针对落款风贺卡，给出字体、排版、色彩等优化建议
 */

import { NextRequest, NextResponse } from "next/server";

const DASHSCOPE_URL =
  "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

export async function POST(req: NextRequest) {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "请配置 DASHSCOPE_API_KEY 环境变量" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { template = "horseA" } = body as { template?: string };

    const prompt = `你是中式平面设计专家，擅长文人画、书法落款风格。用户有一张「落款风」新年贺卡：敦煌壁画做底，文字在右下角像题款。

请给出 3 条具体、可执行的优化建议，每条 15 字以内。例如：
- 字号可再小一号
- 行距略收紧
- 墨色再沉一点
- 落款再靠右下角
- 增加字间距

直接输出 3 条，用换行分隔，不要序号、不要解释。`;

    const res = await fetch(DASHSCOPE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "qwen-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
        max_tokens: 150,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `千问 API 调用失败: ${res.status}` },
        { status: 502 }
      );
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw =
      data?.choices?.[0]?.message?.content?.trim() || "";
    const suggestions = raw
      .split(/\n+/)
      .map((s) => s.replace(/^[\d、.]+/, "").trim())
      .filter(Boolean)
      .slice(0, 3);

    return NextResponse.json({ suggestions });
  } catch (e) {
    console.error("AI style error:", e);
    return NextResponse.json(
      { error: "服务暂不可用" },
      { status: 500 }
    );
  }
}
