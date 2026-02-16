"use client";

/**
 * 导出按钮 - 将贺卡转为 PNG 并下载
 */

import { useCallback, useState } from "react";
import { captureCardAsBlob } from "@/lib/export-card";

interface ExportButtonProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export default function ExportButton({ cardRef }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = useCallback(async () => {
    if (!cardRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const blob = await captureCardAsBlob(cardRef.current);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `新年贺卡_${Date.now()}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
      setError(err instanceof Error ? err.message : "导出失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, [cardRef]);

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleExport}
        disabled={loading}
        className="w-full rounded-lg bg-[#6B1E1E] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#5a1919] disabled:opacity-60"
      >
        {loading ? "生成中…" : "下载贺卡"}
      </button>
      {error && (
        <p className="mt-2 flex flex-wrap items-center justify-center gap-1 text-xs text-red-600">
          {error}
          <button
            type="button"
            onClick={handleExport}
            disabled={loading}
            className="underline hover:no-underline disabled:opacity-50"
          >
            重试
          </button>
          <span className="text-[#9B8378]">·</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="underline hover:no-underline"
          >
            关闭
          </button>
        </p>
      )}
    </div>
  );
}
