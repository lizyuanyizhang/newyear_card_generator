import type { Metadata } from "next";
import "./globals.css";

// 免费商用字体：马善政楷书、钟齐流江毛草、龙藏体、站酷快乐体、站酷小薇体、思源宋体
const FONT_LINKS =
  "https://fonts.googleapis.com/css2?family=Liu+Jian+Mao+Cao&family=Long+Cang&family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@400;500;600;700&family=ZCOOL+KuaiLe&family=ZCOOL+XiaoWei&display=swap";

export const metadata: Metadata = {
  title: "新春贺卡生成器 | 农历新年祝福",
  description: "制作专属农历新年贺卡，送上最温暖的祝福",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link href={FONT_LINKS} rel="stylesheet" />
      </head>
      <body className="font-serif antialiased">
        {children}
      </body>
    </html>
  );
}
