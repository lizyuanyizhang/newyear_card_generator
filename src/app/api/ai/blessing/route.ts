/**
 * AI 祝福语优化 - 接入通义千问
 * 根据收件人、寄件人、上下文生成更贴切、有文采的祝福语
 */

import { NextRequest, NextResponse } from "next/server";

// 默认北京节点；海外或网络不稳定时可改用国际/美国节点
// DASHSCOPE_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1 （新加坡）
// DASHSCOPE_BASE_URL=https://dashscope-us.aliyuncs.com/compatible-mode/v1 （美国）
const DEFAULT_BASE =
  "https://dashscope.aliyuncs.com/compatible-mode/v1";

export async function POST(req: NextRequest) {
  const apiKey = process.env.DASHSCOPE_API_KEY?.trim();
  if (!apiKey || apiKey === "sk-xxxxxxxxxxxx") {
    return NextResponse.json(
      {
        error:
          "请配置 DASHSCOPE_API_KEY：复制 .env.local.example 为 .env.local，并填入阿里云 DashScope API Key（https://dashscope.console.aliyun.com/）",
      },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const {
      recipientName,
      senderName = "",
      currentBlessing = "",
      relationship = "friend",
      persona = "default",
    } = body as {
      recipientName?: string;
      senderName?: string;
      currentBlessing?: string;
      relationship?: string;
      persona?: string;
    };

    const REL_MAP: Record<string, string> = {
      family: "亲人/家人，语气温暖真挚",
      friend: "朋友，可俏皮、真诚、亲切",
      colleague: "同事，专业又亲切，偏工作祝福",
      client: "客户/商业伙伴，正式得体，偏财运与合作",
      crush: "crush/暧昧对象，含蓄有分寸，带一点点心动",
    };
    const relHint = REL_MAP[relationship] || "一般朋友";

    const PERSONA_MAP: Record<string, string> = {
      default: "保持通用、得体、有文采",
      philosopher: `【哲学家】严格模仿庄子的寓言与逍遥、加缪的荒诞与冷峻、克尔凯郭尔的个体颤栗、康德的理性崇高。必须出现：抽象哲学术语（如必然/自由/存在/虚无）、思辨句式、留白感。禁止：直白抒情、商业用语、网络梗、意象堆砌。例句感：「愿你在必然之中觅得自由」「岁末的存在，即是祝福」`,
      literary: `【文学家】纯文学笔法：古典或现代散文、小说式的叙事感。必须出现：具体意象（春风/梅/雪/光/窗）、修辞（比喻/拟人）、画面感、可诵读的节奏。禁止：哲学术语、网络梗、暧昧情话、商业黑话。例句感：「愿新年如初雪，落满你的窗台」「春风十里，岁岁有你」`,
      poet: `【诗人】海涅式的浪漫抒情、黑塞的私语与东方神秘、博尔赫斯的迷宫与梦、塞尔努达的欲望与温柔。必须出现：第一/二人称的私密口吻、欲说还休的暧昧、心动感、时间/光/梦的意象。禁止：哲学术语、商业用语、网络梗、宏大叙事。例句感：「愿新年的第一缕光，落在你肩上」「在时间的迷宫里，愿你找到我」`,
      capitalist: `【资本家思维】主旨：用资本家的头脑去应对生活——理性决策、找准赛道、长期主义、复利思维。可自然融入：格局/风口/赛道/闭环/赋能/复利/ROI/财富自由等词，语气积极务实、有策略感，像给聪明人的新年建议。禁止：纯调侃沙雕、弹幕梗堆砌、自嘲丧气。例句感：「愿新年找准赛道，人生复利增长」「格局打开，把时间投在值得的事上」「祝理性决策、长期主义，早日自由」`,
    };
    const personaHint = PERSONA_MAP[persona] || PERSONA_MAP.default;

    const hasCustomBlessing = currentBlessing?.trim().length > 0;
    const baseTask = hasCustomBlessing
      ? `用户写了一句祝福：「${currentBlessing}」。请用 ${personaHint} 进行轻量润色，必须保留大部分原句的用词和句式，只做微小调整（如措辞更顺、略增文采），禁止大幅改写或重写。`
      : `请撰写一条新年祝福语，风格：${personaHint}。`;

    const prompt = `你是新年贺卡祝福语撰稿人。${baseTask}

补充约束：
1. 收件人：${recipientName || "亲友"}；寄件人：${senderName ? senderName : "匿名"}
2. 关系：${relHint}
3. 长度：1-2 句话，约 20-40 字，适合贺卡落款
4. 可自然融入马年元素，不硬凹

直接输出祝福语正文，不要引号、不要解释、不要换行。`;

    const baseUrl =
      process.env.DASHSCOPE_BASE_URL?.trim() || DEFAULT_BASE;
    const apiUrl = `${baseUrl.replace(/\/$/, "")}/chat/completions`;

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "qwen-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 150,
      }),
    });

    if (!res.ok) {
      const raw = await res.text();
      let errMsg = `千问 API 调用失败 (${res.status})`;
      try {
        const errBody = JSON.parse(raw) as { error?: { message?: string }; message?: string };
        const msg = errBody?.error?.message ?? errBody?.message;
        if (msg) errMsg = msg;
      } catch {
        if (raw) console.error("DashScope raw error:", raw);
      }
      console.error("DashScope error:", errMsg);
      return NextResponse.json({ error: errMsg }, { status: 502 });
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message?: string };
    };
    if (data?.error?.message) {
      return NextResponse.json({ error: data.error.message }, { status: 502 });
    }
    const blessing =
      data?.choices?.[0]?.message?.content?.trim().replace(/^["']|["']$/g, "") ||
      "";
    if (!blessing) {
      return NextResponse.json(
        { error: "千问返回内容为空，请重试" },
        { status: 502 }
      );
    }
    return NextResponse.json({ blessing });
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    console.error("AI blessing error:", err.message, err);
    const isNetwork = /fetch|network|ECONNREFUSED|ETIMEDOUT|ENOTFOUND/i.test(err.message);
    const isAuth = /401|403|invalid.*key|unauthorized/i.test(err.message);
    let msg = "服务暂不可用，请稍后重试";
    if (isNetwork)
      msg =
        "无法连接千问服务。请确认：1) 已在 .env.local 配置 DASHSCOPE_API_KEY 并已开通阿里云 DashScope；2) 网络可访问外网。海外可添加 DASHSCOPE_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1";
    else if (isAuth) msg = "API 认证失败，请检查 DASHSCOPE_API_KEY 是否有效";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
