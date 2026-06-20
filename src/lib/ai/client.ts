import OpenAI from 'openai'

/**
 * AI Client 单例。
 * 兼容 OpenAI / DeepSeek 等 OpenAI 格式的 API。
 * 仅在服务端使用（API Route）。
 */
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
})

export const AI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'
