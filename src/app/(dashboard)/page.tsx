'use client'

import { useDashboard } from '@/hooks/use-dashboard'
import { useAuthStore } from '@/stores/auth-store'
import { Greeting } from '@/components/dashboard/greeting'
import { PetHorizontalScroll } from '@/components/dashboard/pet-horizontal-scroll'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { PetCareTip } from '@/components/dashboard/pet-care-tip'
import { CuteDog } from '@/components/shared/pet-decoration'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

/**
 * Dashboard 首页 /
 */
export default function DashboardPage() {
  const { data, isLoading } = useDashboard()
  const user = useAuthStore((s) => s.user)

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl space-y-6 p-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-36 w-full" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-6 p-4">
      {/* 问候语 + 卡通狗 */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Greeting />
        </div>
        <CuteDog size={60} />
      </div>

      {/* 宠物卡片横滚 */}
      <PetHorizontalScroll pets={data} />

      {/* 快捷操作 */}
      <QuickActions />

      {/* 养宠小贴士 */}
      <PetCareTip />

      {/* AI 快捷入口 */}
      <Link
        href="/ai"
        className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4 transition-colors hover:bg-muted"
      >
        <MessageCircle className="h-5 w-5 text-primary" />
        <div className="flex-1">
          <p className="text-sm font-medium">🤖 问问 AI</p>
          <p className="text-xs text-muted-foreground">输入你的养宠问题…</p>
        </div>
      </Link>
    </div>
  )
}
