"use client";

/**
 * 自定义面板 - 支持 AI 优化祝福语与风格建议
 */

import { useState, useRef, useEffect } from "react";
import type { CardData, CardFont } from "@/types/card";
import { BG_CARD_CONFIG } from "@/data/bg-cards";
import { OVERLAY_CONFIG } from "@/data/overlay-styles";
import {
  BLESSINGS,
  BLESSING_CATEGORIES,
} from "@/data/blessings";
import { AI_PROVIDERS, getProvider } from "@/data/ai-providers";
import type { AIProviderId } from "@/data/ai-providers";

const AI_KEYS = "ai_provider";
const AI_KEY = "ai_api_key";
const AI_ENDPOINT = "ai_endpoint_id";

function loadStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return (v ?? fallback) as T;
  } catch {
    return fallback;
  }
}

type CategoryId = (typeof BLESSING_CATEGORIES)[number]["id"];

interface CustomizationPanelProps {
  data: CardData;
  onChange: (data: CardData) => void;
}

export default function CustomizationPanel({
  data,
  onChange,
}: CustomizationPanelProps) {
  const [blessCategory, setBlessCategory] = useState<CategoryId>("family");
  const [aiPersona, setAiPersona] = useState<"default" | "philosopher" | "literary" | "poet" | "capitalist">("default");
  const blessTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [aiBlessLoading, setAiBlessLoading] = useState(false);

  // 自定义祝福框随内容自动增高，保证长文案完整展示并可编辑
  useEffect(() => {
    const el = blessTextareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 300)}px`;
  }, [data.blessing]);
  const [aiBlessError, setAiBlessError] = useState("");
  const [showApiConfig, setShowApiConfig] = useState(true);
  const [aiProvider, setAiProvider] = useState<AIProviderId>("qwen");
  const [aiApiKey, setAiApiKey] = useState("");
  const [aiEndpointId, setAiEndpointId] = useState("");
  const [hasLoadedApi, setHasLoadedApi] = useState(false);

  useEffect(() => {
    setAiProvider(loadStored(AI_KEYS, "qwen"));
    setAiApiKey(loadStored(AI_KEY, ""));
    setAiEndpointId(loadStored(AI_ENDPOINT, ""));
    setHasLoadedApi(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedApi) return;
    try {
      localStorage.setItem(AI_KEYS, aiProvider);
      localStorage.setItem(AI_KEY, aiApiKey);
      localStorage.setItem(AI_ENDPOINT, aiEndpointId);
    } catch {}
  }, [hasLoadedApi, aiProvider, aiApiKey, aiEndpointId]);

  const AI_PERSONAS = [
    { id: "default" as const, name: "通用" },
    { id: "philosopher" as const, name: "哲学家" },
    { id: "literary" as const, name: "文学家" },
    { id: "poet" as const, name: "诗人" },
    { id: "capitalist" as const, name: "资本家" },
  ];

  const update = (partial: Partial<CardData>) => {
    onChange({ ...data, ...partial });
  };

  const filteredBlessings = BLESSINGS.filter((b) =>
    b.relationships.includes(blessCategory as typeof b.relationships[number])
  );

  const handleRandom = () => {
    const list = filteredBlessings;
    if (list.length > 0) {
      const picked = list[Math.floor(Math.random() * list.length)];
      update({ blessing: picked.text });
    }
  };

  const handleAiBlessing = async () => {
    setAiBlessError("");
    setAiBlessLoading(true);
    try {
      const res = await fetch("/api/ai/blessing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName: data.recipientName,
          senderName: data.senderName,
          currentBlessing: data.blessing,
          relationship: blessCategory,
          persona: aiPersona,
          provider: aiProvider,
          apiKey: aiApiKey || undefined,
          endpointId: (getProvider(aiProvider) as { needEndpoint?: boolean } | undefined)?.needEndpoint ? aiEndpointId || undefined : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setAiBlessError(json.error || "请求失败");
        return;
      }
      if (json.blessing) update({ blessing: json.blessing });
    } catch {
      setAiBlessError("网络错误");
    } finally {
      setAiBlessLoading(false);
    }
  };

  const needEndpoint = (getProvider(aiProvider) as { needEndpoint?: boolean } | undefined)?.needEndpoint;

  return (
    <div className="flex min-w-0 flex-col gap-5 rounded-xl border border-[#E8E2DB] bg-white p-6 shadow-sm">
      {/* API Key 配置 - 与下方表单项风格一致 */}
      <div>
        <button
          type="button"
          onClick={() => setShowApiConfig(!showApiConfig)}
          className="mb-1 flex w-full items-center justify-between text-left"
        >
          <label className="block text-xs font-medium tracking-wide text-[#5C4033]">
            API 配置（填 Key 即可使用 AI 优化）
          </label>
          <span className="text-[10px] text-[#9B8378]">{showApiConfig ? "收起" : "展开"}</span>
        </button>
        {showApiConfig && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium tracking-wide text-[#5C4033]">选择模型</label>
              <select
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value as AIProviderId)}
                className="w-full rounded-md border border-[#E8E2DB] bg-[#FAF8F5] px-3 py-2 text-sm text-[#2C1810] focus:border-[#C99E56] focus:outline-none focus:ring-1 focus:ring-[#C99E56]/30"
              >
                {AI_PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium tracking-wide text-[#5C4033]">API Key</label>
              <input
                type="password"
                value={aiApiKey}
                onChange={(e) => setAiApiKey(e.target.value)}
                placeholder={getProvider(aiProvider)?.placeholder ?? "sk-xxx"}
                className="w-full rounded-md border border-[#E8E2DB] bg-[#FAF8F5] px-3 py-2 text-sm text-[#2C1810] placeholder:text-[#9B8378] focus:border-[#C99E56] focus:outline-none focus:ring-1 focus:ring-[#C99E56]/30"
                autoComplete="off"
              />
            </div>
            {needEndpoint && (
              <div>
                <label className="mb-1 block text-xs font-medium tracking-wide text-[#5C4033]">豆包接入点 ID</label>
                <input
                  type="text"
                  value={aiEndpointId}
                  onChange={(e) => setAiEndpointId(e.target.value)}
                  placeholder="如：ep-xxxxxxxx"
                  className="w-full rounded-md border border-[#E8E2DB] bg-[#FAF8F5] px-3 py-2 text-sm text-[#2C1810] placeholder:text-[#9B8378] focus:border-[#C99E56] focus:outline-none focus:ring-1 focus:ring-[#C99E56]/30"
                  autoComplete="off"
                />
              </div>
            )}
            <p className="text-[10px] text-[#9B8378]">密钥仅存于本地，不会上传。未填写时千问可读环境变量。</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium tracking-wide text-[#5C4033]">
            收件人
          </label>
          <input
            type="text"
            placeholder="如：张三"
            value={data.recipientName}
            onChange={(e) => update({ recipientName: e.target.value })}
            className="w-full rounded-md border border-[#E8E2DB] bg-[#FAF8F5] px-3 py-2 text-sm text-[#2C1810] placeholder:text-[#9B8378] focus:border-[#C99E56] focus:outline-none focus:ring-1 focus:ring-[#C99E56]/30"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium tracking-wide text-[#5C4033]">
            落款人（可选）
          </label>
          <input
            type="text"
            placeholder="如：李四"
            value={data.senderName}
            onChange={(e) => update({ senderName: e.target.value })}
            className="w-full rounded-md border border-[#E8E2DB] bg-[#FAF8F5] px-3 py-2 text-sm text-[#2C1810] placeholder:text-[#9B8378] focus:border-[#C99E56] focus:outline-none focus:ring-1 focus:ring-[#C99E56]/30"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium tracking-wide text-[#5C4033]">
          祝福语
        </label>

        {/* ① 先选目标对象 */}
        <p className="mb-1 text-[10px] text-[#9B8378]">① 选择目标对象</p>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {BLESSING_CATEGORIES.map((c) => {
            const isSelected = blessCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setBlessCategory(c.id)}
                className={`rounded px-2 py-1 text-xs transition ${
                  isSelected
                    ? "bg-[#C99E56]/25 text-[#6B1E1E] ring-1 ring-[#C99E56]/40"
                    : "bg-[#F5F0E8] text-[#5C4033] hover:bg-[#E8E2DB]"
                }`}
                aria-pressed={isSelected}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        {/* ② 再选预设或自定义 */}
        <p className="mb-1 text-[10px] text-[#9B8378]">② 选择基础祝福或自定义</p>
        <div className="mb-3 flex min-w-0 gap-2">
          <select
            value={
              filteredBlessings.some((b) => b.text === data.blessing)
                ? BLESSINGS.find((b) => b.text === data.blessing)?.id ?? "custom"
                : "custom"
            }
            onChange={(e) => {
              if (e.target.value === "custom") return;
              const bless = BLESSINGS.find((b) => b.id === e.target.value);
              if (bless) update({ blessing: bless.text });
            }}
            className="min-w-0 flex-1 rounded-md border border-[#E8E2DB] bg-[#FAF8F5] px-3 py-2 text-sm text-[#2C1810] focus:border-[#C99E56] focus:outline-none focus:ring-1 focus:ring-[#C99E56]/30"
          >
            <option value="custom">
              {data.blessing ? "自定义" : "选择预设..."}
            </option>
            {filteredBlessings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.text}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleRandom}
            className="rounded bg-[#6B1E1E]/10 px-3 py-2 text-xs text-[#6B1E1E] hover:bg-[#6B1E1E]/20 shrink-0"
          >
            随机
          </button>
        </div>
        <textarea
          ref={blessTextareaRef}
          placeholder="或在此输入自定义祝福"
          value={data.blessing}
          onChange={(e) => update({ blessing: e.target.value })}
          rows={2}
          className="mb-3 min-h-[2.5rem] w-full resize-none overflow-y-auto rounded-md border border-[#E8E2DB] bg-[#FAF8F5] px-3 py-2 text-sm text-[#2C1810] placeholder:text-[#9B8378] focus:border-[#C99E56] focus:outline-none focus:ring-1 focus:ring-[#C99E56]/30"
        />

        {/* ③ 选择文案风格（千问画风） */}
        <p className="mb-1 text-[10px] text-[#9B8378]">③ 选择文案风格</p>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {AI_PERSONAS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setAiPersona(p.id)}
              className={`rounded px-2 py-1 text-xs transition ${
                aiPersona === p.id
                  ? "bg-[#616da2]/25 text-[#616da2] ring-1 ring-[#616da2]/40"
                  : "bg-[#F5F0E8] text-[#5C4033] hover:bg-[#E8E2DB]"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* ④ AI 优化 */}
        <p className="mb-1 text-[10px] text-[#9B8378]">④ AI 优化</p>
        <button
          type="button"
          onClick={handleAiBlessing}
          disabled={aiBlessLoading}
          className="w-full rounded-md bg-[#616da2]/15 py-2 text-xs font-medium text-[#616da2] hover:bg-[#616da2]/25 disabled:opacity-50"
        >
          {aiBlessLoading ? "AI 优化中…" : "AI 优化"}
        </button>
        {aiBlessError && (
          <p className="mt-1 flex flex-wrap items-center gap-1 text-xs text-red-500">
            {aiBlessError}
            <button
              type="button"
              onClick={handleAiBlessing}
              disabled={aiBlessLoading}
              className="rounded px-1.5 py-0.5 text-red-600 underline hover:no-underline disabled:opacity-50"
            >
              重试
            </button>
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium tracking-wide text-[#5C4033]">
          卡片风格
        </label>
        <div className="flex flex-wrap gap-2">
          {BG_CARD_CONFIG.map((t) => {
            const isSelected = (data.template ?? "minimal") === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => update({ template: t.id })}
                className={`rounded px-2 py-1 text-xs transition ${
                  isSelected
                    ? "bg-[#C99E56]/25 text-[#6B1E1E] ring-1 ring-[#C99E56]/40"
                    : "bg-[#F5F0E8] text-[#5C4033] hover:bg-[#E8E2DB]"
                }`}
              >
                {t.name}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium tracking-wide text-[#5C4033]">
          字体
        </label>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "maShanZheng" as CardFont, name: "楷书" },
              { id: "liuJianMaoCao" as CardFont, name: "毛草" },
              { id: "longCang" as CardFont, name: "行书" },
              { id: "zcoolKuaiLe" as CardFont, name: "站酷" },
              { id: "zcoolXiaoWei" as CardFont, name: "小薇" },
              { id: "notoSerif" as CardFont, name: "宋体" },
            ] as const
          ).map((f) => {
            const isSelected = (data.cardFont ?? "maShanZheng") === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => update({ cardFont: f.id })}
                className={`rounded px-2 py-1 text-xs transition ${
                  isSelected
                    ? "bg-[#C99E56]/25 text-[#6B1E1E] ring-1 ring-[#C99E56]/40"
                    : "bg-[#F5F0E8] text-[#5C4033] hover:bg-[#E8E2DB]"
                }`}
              >
                {f.name}
              </button>
            );
          })}
        </div>
        {(() => {
          const hint = OVERLAY_CONFIG[data.template ?? "minimal"]?.fontHint;
          const FONT_NAMES: Record<string, string> = {
            maShanZheng: "楷书",
            liuJianMaoCao: "毛草",
            longCang: "行书",
            zcoolKuaiLe: "站酷",
            zcoolXiaoWei: "小薇",
            notoSerif: "宋体",
          };
          return (
            <p className="mt-2 text-[10px] text-[#9B8378]">
              {hint && FONT_NAMES[hint]
                ? `该风格推荐：${FONT_NAMES[hint]}`
                : "可选 6 款免费商用字体"}
            </p>
          );
        })()}
      </div>
    </div>
  );
}
