# 新春贺卡生成器 | Lunar New Year Greeting Card Maker

制作专属农历新年贺卡，送上最温暖的祝福。

## 功能特点

- **多种贺卡风格**：落款风、极简现代、水墨版画、艺术家海报、经典红福等
- **千问 AI 优化**：接入通义千问，智能优化祝福语与风格建议
- **预设祝福语**：多风格词库（经典/网络/俏皮/文艺）
- **一键导出**：下载高清 PNG 图片

## 快速开始

```bash
npm install
npm run dev
```

访问 http://localhost:3000 即可使用。

## 贺卡背景图

贺卡采用「背景图 + 文字叠层」，您只需将选好的图片放入 `public/card-bg/` 并按风格命名：

| 文件名 | 风格 |
|--------|------|
| inkWash.png | 传统水墨 |
| minimal.png | 极简 |
| modern.png | 现代东方 |
| festive.png | 喜庆卷轴 |

**可选**：运行 `npm run generate-bg` 可用万相 API 自动生成 4 张背景（需配置 DASHSCOPE_API_KEY）。

## 千问 AI 配置（可选）

如需使用「千问优化」祝福语功能：

1. 复制 `.env.local.example` 为 `.env.local`
2. 前往 [阿里云 DashScope](https://dashscope.console.aliyun.com/) 获取 API Key
3. 在 `.env.local` 中填入 `DASHSCOPE_API_KEY=sk-xxx`

## 技术栈

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- 通义千问 (DashScope)
