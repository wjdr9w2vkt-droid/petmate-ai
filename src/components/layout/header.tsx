'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/auth-store'
import { createClient } from '@/lib/supabase/client'

/**
 * 顶部导航栏。
 * 显示 Logo + 用户头像入口。
 */
export function Header() {
  const user = useAuthStore((s) => s.user)
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? '?'
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) setAvatarUrl((data as any).avatar_url)
      })
  }, [user])

  return (
    <header
      className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold text-lg">
            🐾 PetMate
          </Link>
          <Link href="/pets" className="text-sm text-muted-foreground hover:text-foreground">
            宠物
          </Link>
        </div>

        <Link href="/profile">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl ?? undefined} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  )
}
