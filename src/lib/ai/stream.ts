/**
 * SSE 流式响应工具。
 */

export interface StreamChunk {
  content: string
  done: boolean
}

/**
 * 将 OpenAI stream 转为 ReadableStream，发送 SSE 事件。
 */
export function createSSEStream(
  stream: AsyncIterable<{ choices: { delta: { content?: string } }[] }>
): ReadableStream {
  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices?.[0]?.delta?.content
          if (content) {
            const data = `data: ${JSON.stringify({ content })}\n\n`
            controller.enqueue(encoder.encode(data))
          }
        }
        // 结束信号
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (err) {
        console.error('[SSE] Stream error:', err)
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: 'AI 响应中断' })}\n\n`)
        )
        controller.close()
      }
    },
  })
}
