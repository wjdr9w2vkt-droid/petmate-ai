import type { ChatMessage } from '@/types'

interface ChatBubbleProps {
  message: ChatMessage
}

/**
 * 聊天气泡 — 用户右侧蓝色，AI 左侧灰色。
 */
export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-2 text-sm ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        {/* AI 回答中的结构化内容用 whitespace-pre-wrap 保留换行 */}
        <div className="whitespace-pre-wrap">{message.content}</div>
        {!isUser && !message.content && (
          <span className="inline-flex gap-1">
            <span className="animate-bounce">●</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>●</span>
          </span>
        )}
      </div>
    </div>
  )
}
