"use client";

/**
 * 分享按钮 - 通过系统分享（微信、小红书等）或备选下载/复制链接
 * 移动端使用 Web Share API 唤起系统分享面板，可直接分享到微信、朋友圈等
 */

import { useCallback, useRef, useState } from "react";
import { captureCardAsBlob } from "@/lib/export-card";

interface ShareButtonProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export default function ShareButton({ cardRef }: ShareButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const [copied, setCopied] = useState(false);
  const lastBlobRef = useRef<Blob | null>(null);

  const triggerDownload = useCallback(async (blob: Blob | null) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `新年贺卡_${Date.now()}.png`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    setShowFallback(false);
  }, []);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(
        typeof window !== "undefined" ? window.location.href : ""
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("复制失败，请手动复制地址栏链接");
    }
  }, []);

  // 复制图片到剪贴板，可在微信等应用中直接粘贴
  const copyImage = useCallback(async () => {
    const blob = lastBlobRef.current;
    if (!blob || !navigator.clipboard?.write) return;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("复制图片失败，请使用下载后手动分享");
    }
  }, []);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;
    setLoading(true);
    setError(null);
    lastBlobRef.current = null;
    try {
      const blob = await captureCardAsBlob(cardRef.current);
      lastBlobRef.current = blob;
      const file = new File([blob], `新年贺卡_${Date.now()}.png`, {
        type: "image/png",
      });

      // Web Share API：移动端可唤起系统分享（微信、朋友圈、小红书等）
      if (typeof navigator !== "undefined" && navigator.share) {
        const canShare =
          "canShare" in navigator
            ? navigator.canShare({ files: [file], title: "新年贺卡", text: "送你一张新春贺卡" })
            : true;
        if (canShare) {
          await navigator.share({
            files: [file],
            title: "新年贺卡",
            text: "送你一张新春贺卡，马年大吉！",
          });
          return;
        }
      }

      // 不支持分享文件时，显示备选菜单
      setShowFallback(true);
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        // 用户取消分享（如未找到微信/小红书），展示备选方案
        setShowFallback(true);
        return;
      }
      console.error("Share failed:", err);
      setError(err instanceof Error ? err.message : "分享失败");
      setShowFallback(true);
    } finally {
      setLoading(false);
    }
  }, [cardRef]);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={handleShare}
        disabled={loading}
        className="w-full rounded-lg border border-[#6B1E1E] bg-white px-6 py-3 text-sm font-medium text-[#6B1E1E] transition hover:bg-[#6B1E1E]/5 disabled:opacity-60"
      >
        {loading ? "生成中…" : "分享贺卡"}
      </button>

      {/* 备选：系统分享无微信/小红书时（尤其 Mac），提供下载与复制图片 */}
      {showFallback && lastBlobRef.current && (
        <div className="mt-2 space-y-1.5 rounded-lg border border-[#E8E2DB] bg-[#FAF8F5] p-2 text-xs">
          <p className="text-center text-[#5C4033]">
            分享面板由系统决定，Mac 端通常无微信/小红书。可：
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => triggerDownload(lastBlobRef.current)}
              className="rounded px-2 py-1 text-[#6B1E1E] underline hover:no-underline"
            >
              下载图片
            </button>
            <span className="text-[#9B8378]">·</span>
            <button
              type="button"
              onClick={copyImage}
              className="rounded px-2 py-1 text-[#6B1E1E] underline hover:no-underline disabled:opacity-70"
              disabled={copied}
            >
              {copied ? "已复制" : "复制图片"}
            </button>
            <span className="text-[#9B8378]">·</span>
            <button
              type="button"
              onClick={copyLink}
              className="rounded px-2 py-1 text-[#6B1E1E] underline hover:no-underline disabled:opacity-70"
              disabled={copied}
            >
              复制链接
            </button>
          </div>
          <p className="text-center text-[10px] text-[#9B8378]">
            下载或复制图片后，在微信/小红书中粘贴或发送即可
          </p>
          <button
            type="button"
            onClick={() => setShowFallback(false)}
            className="mx-auto block rounded px-2 py-1 text-[#9B8378] hover:text-[#5C4033]"
          >
            收起
          </button>
        </div>
      )}

      {error && !showFallback && (
        <p className="mt-2 text-center text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
