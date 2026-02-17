/**
 * AI 祝福语优化 - 支持的模型提供商
 * 用户可在页面对话框填入 API Key，无需配置环境变量
 */

export const AI_PROVIDERS = [
  { id: "qwen", name: "通义千问", placeholder: "sk-xxx（阿里云 DashScope）", url: "https://dashscope.aliyuncs.com/compatible-mode/v1", model: "qwen-turbo", needEndpoint: false },
  { id: "deepseek", name: "DeepSeek", placeholder: "sk-xxx", url: "https://api.deepseek.com", model: "deepseek-chat", needEndpoint: false },
  { id: "kimi", name: "Kimi", placeholder: "sk-xxx（月之暗面）", url: "https://api.moonshot.cn/v1", model: "moonshot-v1-8k", needEndpoint: false },
  { id: "zhipu", name: "智谱 GLM", placeholder: "xxx.api_key（智谱开放平台）", url: "https://open.bigmodel.cn/api/paas/v4", model: "glm-4-flash", needEndpoint: false },
  { id: "doubao", name: "豆包", placeholder: "API Key", url: "https://ark.cn-beijing.volces.com/api/v3", model: "", needEndpoint: true },
] as const;

export type AIProviderId = (typeof AI_PROVIDERS)[number]["id"];

export function getProvider(id: AIProviderId) {
  return AI_PROVIDERS.find((p) => p.id === id);
}
