import { NextRequest, NextResponse } from 'next/server'
import { createClient as createUserClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

/**
 * POST /api/upload
 * 接收前端压缩后的图片，上传到 Supabase Storage。
 */
export async function POST(request: NextRequest) {
  try {
    const userSupabase = await createUserClient()

    // 验证用户身份
    const {
      data: { user },
    } = await userSupabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ message: '未登录' }, { status: 401 })
    }

    // 解析 FormData
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const bucket = (formData.get('bucket') as string) || 'photos'

    if (!file) {
      return NextResponse.json({ message: '未提供文件' }, { status: 400 })
    }

    if (!['avatars', 'photos'].includes(bucket)) {
      return NextResponse.json({ message: '无效的存储桶' }, { status: 400 })
    }

    const MAX_SIZE = 5 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ message: '文件大小超过 5MB 限制' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ message: '仅支持图片文件' }, { status: 400 })
    }

    // 用 service_role 创建的 admin client 上传（绕过 RLS）
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const filePath = `${user.id}/${Date.now()}.webp`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error } = await adminClient.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type || 'image/webp',
        upsert: false,
      })

    if (error) {
      console.error('[Upload] Storage error:', error)
      return NextResponse.json({ message: error.message || '上传失败' }, { status: 500 })
    }

    const {
      data: { publicUrl },
    } = adminClient.storage.from(bucket).getPublicUrl(filePath)

    return NextResponse.json({ url: publicUrl })
  } catch (err) {
    console.error('[Upload] Unexpected error:', err)
    return NextResponse.json({ message: '服务器异常' }, { status: 500 })
  }
}
