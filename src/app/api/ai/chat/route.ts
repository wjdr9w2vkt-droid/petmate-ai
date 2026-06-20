import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'
import { buildSystemPrompt } from '@/lib/ai/prompt'

export const runtime = 'edge'

/**
 * POST /api/ai/chat
 * AI 对话 SSE 流式响应。
 * 使用用户提供的 API 配置进行调用。
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. 验证登录
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: '未登录' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 2. 解析请求（包含用户 API 配置）
    const { question, petId, apiKey, model, baseUrl } = (await request.json()) as {
      question: string
      petId?: string
      apiKey: string
      model: string
      baseUrl: string
    }

    if (!question?.trim()) {
      return new Response(JSON.stringify({ error: '问题不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!apiKey) {
      return new Response(JSON.stringify({ error: '请先在个人中心配置 API Key' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 3. 宠物上下文
    let petContext: string | undefined
    if (petId) {
      const { data: pet } = await supabase
        .from('pets')
        .select('name, species, breed, gender, birthday, is_neutered')
        .eq('id', petId)
        .single()

      if (pet) {
        const name = (pet as any).name
        const species =
          (pet as any).species === 'dog' ? '狗' : (pet as any).species === 'cat' ? '猫' : '宠物'
        const breed = (pet as any).breed ? `，${(pet as any).breed}` : ''
        const gender = (pet as any).gender === 'male' ? '公' : '母'
        const birthday = (pet as any).birthday ?? '未知'
        const neutered = (pet as any).is_neutered ? '已绝育' : '未绝育'
        petContext = `名称：${name}，种类：${species}${breed}，性别：${gender}，生日：${birthday}，绝育：${neutered}`
      }
    }

    // 4. 构造 Prompt
    const systemPrompt = buildSystemPrompt(petContext)

    // 5. 创建用户配置的 OpenAI Client
    const client = new OpenAI({
      apiKey,
      baseURL: baseUrl || 'https://api.openai.com/v1',
    })

    // 6. 调用 AI
    const stream = await client.chat.completions.create({
      model: model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
      stream: true,
      max_tokens: 600,
      temperature: 0.7,
    })

    // 7. 收集完整回答并流式输出
    let fullAnswer = ''

    const sseStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          for await (const chunk of stream) {
            const content = chunk.choices?.[0]?.delta?.content
            if (content) {
              fullAnswer += content
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
            }
          }

          // 存储对话记录
          const { error: insertError } = await supabase
            .from('ai_conversations')
            .insert({
              user_id: user.id,
              pet_id: petId || null,
              question: question.trim(),
              answer: fullAnswer,
              model: model || 'unknown',
              tokens_used: null,
            })

          if (insertError) {
            console.error('[AI Chat] Failed to save conversation:', insertError)
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          console.error('[AI Chat] Stream error:', err)
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: 'AI 响应中断' })}\n\n`)
          )
          controller.close()
        }
      },
    })

    return new Response(sseStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    console.error('[AI Chat] Unexpected error:', err)
    return new Response(JSON.stringify({ error: '服务器异常' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
