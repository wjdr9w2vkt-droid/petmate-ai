import { createBrowserClient } from '@supabase/ssr'

/**
 * 浏览器端 Supabase Client。
 * 用于 Client Component 中的数据库查询。
 * RLS 会自动根据登录用户的 JWT 过滤数据。
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
