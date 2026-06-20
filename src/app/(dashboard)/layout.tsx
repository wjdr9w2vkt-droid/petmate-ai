/**
 * Dashboard 布局（需登录）
 * Header + 内容区 + BottomNav
 */
import { Shell } from '@/components/layout/shell'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Shell>{children}</Shell>
}
