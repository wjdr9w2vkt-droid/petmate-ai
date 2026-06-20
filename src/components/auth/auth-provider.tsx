'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/auth-store'

/**
 * 认证状态 Provider。
 * 挂载在根 layout，监听 Supabase Auth 状态变化并同步到 Zustand Store。
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth)
  const clearAuth = useAuthStore((s) => s.clearAuth)

  useEffect(() => {
    const supabase = createClient()

    // 1. 首次加载：获取当前 session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setAuth(data.session.user, data.session)
      } else {
        clearAuth()
      }
    })

    // 2. 监听后续 auth 事件（登录/登出/token刷新）
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(session.user, session)
      } else {
        clearAuth()
      }
    })

    return () => subscription.unsubscribe()
  }, [setAuth, clearAuth])

  return <>{children}</>
}
