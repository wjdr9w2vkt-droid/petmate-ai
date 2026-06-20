'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/auth-store'
import { toast } from 'sonner'

/**
 * 认证操作 Hook。
 * 封装登录、注册、登出逻辑 + 错误/成功提示。
 */
export function useAuth() {
  const router = useRouter()
  const supabase = createClient()
  const { user, isLoading, setAuth, clearAuth } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  /** 邮箱密码登录 */
  const signIn = async (email: string, password: string) => {
    setIsSubmitting(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // 翻译常见错误信息
        const msg =
          error.code === 'invalid_credentials'
            ? '邮箱或密码错误，请重试'
            : error.message
        toast.error(msg)
        return { success: false, error: msg }
      }

      setAuth(data.user, data.session)
      toast.success('登录成功')
      router.push('/')
      router.refresh()
      return { success: true }
    } catch (err) {
      console.error('[useAuth] signIn error:', err)
      toast.error('网络异常，请稍后重试')
      return { success: false, error: '网络异常' }
    } finally {
      setIsSubmitting(false)
    }
  }

  /** 邮箱注册 */
  const signUp = async (email: string, password: string) => {
    setIsSubmitting(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
        return { success: false, error: error.message }
      }

      // 判断是否需要邮箱验证
      if (data.session) {
        // 无需验证，直接登录
        setAuth(data.user, data.session)
        toast.success('注册成功！')
        router.push('/')
        router.refresh()
        return { success: true, needConfirm: false }
      } else {
        // 需要邮箱验证
        toast.success('注册成功！请查看邮箱完成验证')
        return { success: true, needConfirm: true }
      }
    } catch (err) {
      console.error('[useAuth] signUp error:', err)
      toast.error('网络异常，请稍后重试')
      return { success: false, error: '网络异常' }
    } finally {
      setIsSubmitting(false)
    }
  }

  /** 登出 */
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      clearAuth()
      router.push('/login')
      router.refresh()
      toast.success('已退出登录')
    } catch (err) {
      console.error('[useAuth] signOut error:', err)
      // 即使 API 调用失败，也清除本地状态
      clearAuth()
      router.push('/login')
    }
  }

  return {
    user,
    isLoading,
    isSubmitting,
    signIn,
    signUp,
    signOut,
  }
}
