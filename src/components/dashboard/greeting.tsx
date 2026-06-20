'use client'

import { GREETINGS } from '@/lib/constants'
import { useAuthStore } from '@/stores/auth-store'

/**
 * 问候语组件 — 根据时间段显示不同问候。
 */
export function Greeting() {
  const user = useAuthStore((s) => s.user)
  const displayName = user?.email?.split('@')[0] ?? '宠友'

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? GREETINGS.morning : hour < 18 ? GREETINGS.afternoon : GREETINGS.evening

  return (
    <div className="py-2">
      <p className="text-lg">
        {greeting}，<span className="font-semibold">{displayName}</span>
      </p>
    </div>
  )
}
