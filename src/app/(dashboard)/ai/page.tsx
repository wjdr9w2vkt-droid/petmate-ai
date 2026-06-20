'use client'

import { useEffect, useRef } from 'react'
import { useAiChat } from '@/hooks/use-ai-chat'
import { ChatMessages } from '@/components/ai/chat-messages'
import { ChatInput } from '@/components/ai/chat-input'
import { AiSuggestions } from '@/components/ai/ai-suggestions'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

/**
 * AI 助手页 /ai
 * iOS 键盘弹出时自动上移输入框。
 */
export default function AiPage() {
  const { messages, isStreaming, sendMessage, clearMessages } = useAiChat()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return
    const onResize = () => {
      const vv = window.visualViewport!
      if (containerRef.current) {
        containerRef.current.style.paddingBottom = `${window.innerHeight - vv.height + 16}px`
      }
    }
    window.visualViewport.addEventListener('resize', onResize)
    return () => window.visualViewport?.removeEventListener('resize', onResize)
  }, [])

  return (
    <div ref={containerRef} className="container mx-auto flex max-w-2xl flex-col p-4" style={{ minHeight: '100dvh' }}>
      {/* 顶栏 */}
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">🤖 AI 养宠助手</h1>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearMessages}>
            <Trash2 className="mr-1 h-3 w-3" />
            清空
          </Button>
        )}
      </div>

      {/* 推荐问题（无对话时显示） */}
      {messages.length === 0 && (
        <div className="mb-4">
          <AiSuggestions onSelect={sendMessage} />
        </div>
      )}

      {/* 消息区域 */}
      <ChatMessages messages={messages} />

      {/* 输入框 */}
      <div className="mt-3 border-t pt-3">
        <ChatInput onSend={sendMessage} isStreaming={isStreaming} />
      </div>
    </div>
  )
}
