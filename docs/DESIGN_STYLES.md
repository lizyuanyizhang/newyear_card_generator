# 四种贺卡风格说明与设计参考

## 1. 马意象（红底金马）

**设计思路**：传统春联/年画风格，红底 + 金色马剪影 +「马」字装饰。

### 免费马图案方案（可商用）

| 来源 | 说明 | 链接 |
|------|------|------|
| **Public Domain Vectors** | 27+ 马矢量，CC0 公共领域，无需署名 | [publicdomainvectors.org](https://publicdomainvectors.org) 搜索 "horse" |
| **FreeSVG** | Horse Silhouette #146487，Public Domain | [freesvg.org](https://freesvg.org/horse-silhouette-2) |
| **易点 SVG 编辑器** | 免费可商用马图案（动物/小马/可爱） | [svg.wxeditor.com](https://svg.wxeditor.com) 搜索「马」 |

**替换方式**：下载 SVG 后，复制 `<path d="...">` 的 `d` 值，替换 `src/components/card-assets/HorseSilhouette.tsx` 中的 path 即可。

---

## 2. 梅花意象（红底梅花）

**设计思路**：红底金字 + 五瓣梅花点缀四角及顶部，象征坚毅与新春希望。

- 梅花 SVG 为自绘五瓣形，可调整 `size`、`fill`、`stroke`
- 布局：四角 + 顶部梅花枝，保持平衡不抢主文案

---

## 3. 卡通风格

**设计思路**：圆角、柔和粉红背景、表情符号点缀、活泼字体。

- **配色**：粉白渐变 `#FFE5E5` → `#FFF0F0`，主色 `#E63946`，点缀色 `#FFB703`
- **装饰**：🐴 ✨ 🧧 表情符号（系统自带，无版权问题）
- **字体建议**：站酷快乐体、站酷小薇体更适配

---

## 4. 极简风格

**设计思路**：留白、克制的排版，参考日式简约、Muji、苹果贺卡。

### 设计参考要点

- **留白**：核心信息居中，周围保留 30%–40% 空白
- **色彩**：主色不超过 2 种，低饱和度（如 `#FAFAF9` 背景 + `#1C1917` 正文）
- **排版**：标题 36–48px，正文 24–30px，落款 18–22px；行距 1.5–2 倍
- **装饰**：细线、几何图形，少即是多

### 参考方向

- 日本和纸贺卡：素雅、留白、细线
- Muji：简约、中性灰、无多余装饰
- 苹果节日贺卡：大留白、克制的红色点缀

---

## 技术实现

- `CardTemplate` 类型：`horse` | `plum` | `cartoon` | `minimal`
- 模板组件：`HorseTemplate`、`PlumTemplate`、`CartoonTemplate`、`MinimalTemplate`
- 风格选择器位于定制面板顶部
