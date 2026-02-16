/**
 * 贺卡导出工具 - 将 DOM 贺卡转为 PNG Blob
 * 抽取自 ExportButton，供下载与分享共用
 */

import html2canvas from "html2canvas-objectfit-fix";

/**
 * 将贺卡 DOM 元素转为 PNG 图片的 Blob
 * @param cardEl 带 data-card-export 的贺卡根元素
 * @returns PNG Blob，可直接用于下载或 navigator.share
 */
export async function captureCardAsBlob(cardEl: HTMLElement): Promise<Blob> {
  const el = cardEl;

  // 等待背景图加载完成（超时 3 秒，避免卡住）
  const imgs = el.querySelectorAll("img");
  await Promise.all(
    Array.from(imgs).map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          const done = () => {
            img.removeEventListener("load", done);
            img.removeEventListener("error", done);
            resolve();
          };
          img.addEventListener("load", done);
          img.addEventListener("error", done);
          setTimeout(done, 3000);
        })
    )
  );

  // 等待两帧，确保布局稳定
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  const w = el.offsetWidth;
  const h = el.offsetHeight;

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    logging: false,
    width: w,
    height: h,
    onclone: (doc) => {
      const clone = doc.querySelector<HTMLElement>("[data-card-export]");
      if (clone) {
        clone.style.width = `${w}px`;
        clone.style.height = `${h}px`;
        clone.style.minWidth = `${w}px`;
        clone.style.maxWidth = `${w}px`;
      }
    },
  });

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
      "image/png",
      1.0
    );
  });
}
