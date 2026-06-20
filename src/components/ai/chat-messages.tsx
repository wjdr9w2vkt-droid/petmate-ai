'use client'

import { useEffect, useRef } from 'react'
import type { ChatMessage } from '@/types'
import { ChatBubble } from './chat-bubble'

interface ChatMessagesProps {
  messages: ChatMessage[]
}

/**
 * 聊天消息列表 — 自动滚动到底部。
 */
export function ChatMessages({ messages }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) return null

  return (
    <div className="flex-1 space-y-3 overflow-y-auto">
      {messages.map((msg) => (
        <ChatBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
