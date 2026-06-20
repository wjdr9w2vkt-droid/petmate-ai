'use client'

import { useState, useCallback } from 'react'
import type { ChatMessage } from '@/types'
import { useApiSettingsStore } from '@/stores/api-settings-store'
import { toast } from 'sonner'

/**
 * AI 聊天 Hook。
 */
export function useAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const { apiKey, model, baseUrl } = useApiSettingsStore()

  /** 发送消息 */
  const sendMessage = useCallback(
    async (question: string, petId?: string) => {
      if (!question.trim()) return

      if (!apiKey) {
        toast.error('请先在个人中心配置 API Key')
        return
      }

      // 添加用户消息
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: question.trim(),
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, userMsg])
      setIsStreaming(true)

      // 添加 AI 消息占位
      const aiMsgId = (Date.now() + 1).toString()
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        role: 'assistant',
        content: '',
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, aiMsg])

      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: question.trim(),
            petId,
            apiKey,
            model,
            baseUrl,
          }),
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || '请求失败')
        }

        if (!res.body) throw new Error('不支持流式响应')

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6)

            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              if (parsed.error) {
                toast.error(parsed.error)
              } else if (parsed.content) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiMsgId
                      ? { ...m, content: m.content + parsed.content }
                      : m
                  )
                )
              }
            } catch {
              // 忽略 JSON 解析错误
            }
          }
        }
      } catch (err) {
        console.error('[useAiChat] sendMessage error:', err)
        toast.error(err instanceof Error ? err.message : 'AI 请求失败')
        setMessages((prev) => prev.filter((m) => m.id !== aiMsgId))
      } finally {
        setIsStreaming(false)
      }
    },
    [apiKey, model, baseUrl]
  )

  /** 清空对话 */
  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isStreaming,
    sendMessage,
    clearMessages,
  }
}
