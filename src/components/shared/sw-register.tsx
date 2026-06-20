'use client'

import { useEffect } from 'react'

/**
 * Service Worker 注册组件。
 * 在生产环境中注册 sw.js。
 */
export function SwRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if ('serviceWorker' in navigator) {
      // 仅在非开发环境注册（开发时 SW 缓存会干扰 HMR）
      if (process.env.NODE_ENV === 'production') {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('[SW] Registered:', reg.scope)
          })
          .catch((err) => {
            console.error('[SW] Registration failed:', err)
          })
      }
    }
  }, [])

  return null
}
