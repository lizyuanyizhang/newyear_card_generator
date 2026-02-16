"use client";

/**
 * 新年贺卡生成器 - 主页面
 * 整合预览、自定义面板、导出功能
 */

import { useRef, useState } from "react";
import AICardPreview from "@/components/AICardPreview";
import CustomizationPanel from "@/components/CustomizationPanel";
import ExportButton from "@/components/ExportButton";
import ShareButton from "@/components/ShareButton";
import type { CardData } from "@/types/card";
import { BLESSINGS } from "@/data/blessings";

// 默认贺卡数据 - 2026 丙午马年
const defaultData: CardData = {
  recipientName: "亲爱的朋友",
  senderName: "",
  blessing: BLESSINGS.find((b) => b.id === "p4")?.text ?? "愿新年胜旧年，想要的都有！",
  template: "minimal",
  cardFont: "maShanZheng",
  year: "丙午",
};

export default function Home() {
  const [data, setData] = useState<CardData>(defaultData);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-[#F5EDE4]">
      {/* 顶部标题区 - 克制、雅致 */}
      <header className="border-b-2 border-[#1A1A1A]/10 bg-[#F5EDE4] py-4 text-center">
        <h1 className="text-2xl font-bold tracking-[0.5em] text-[#C41E3A]">
          新春贺卡
        </h1>
        <p className="mt-2 text-xs tracking-[0.4em] text-[#5C4033]">
          丙午马年 · 先锋中式
        </p>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-5">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* 左侧：贺卡预览 + 导出 */}
          <div className="flex flex-col items-center gap-6">
            <AICardPreview data={data} ref={cardRef} />
            <div className="flex w-full gap-3">
              <div className="min-w-0 flex-1">
                <ExportButton cardRef={cardRef} />
              </div>
              <div className="min-w-0 flex-1">
                <ShareButton cardRef={cardRef} />
              </div>
            </div>
          </div>

          {/* 右侧：自定义面板 */}
          <div className="min-w-0 lg:max-w-md">
            <CustomizationPanel data={data} onChange={setData} />
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="mt-12 border-t border-[#E8E2DB] py-6 text-center text-xs tracking-widest text-[#5C4033]/70">
        马年大吉 · 新春快乐 · 阖家幸福
      </footer>
    </div>
  );
}
