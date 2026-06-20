'use client'

import { Header } from './header'
import { BottomNav } from './bottom-nav'

/**
 * Dashboard 页面壳。
 * 移动端：Header 顶部 + 内容 + BottomNav 底部
 * 桌面端：Header 顶部 + 内容
 */
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  )
}
