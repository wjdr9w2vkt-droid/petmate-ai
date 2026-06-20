import Link from 'next/link'
import { ClipboardPen, Bot } from 'lucide-react'

const ACTIONS = [
  { href: '/records/new', label: '记体重', icon: ClipboardPen, emoji: '📝' },
  { href: '/ai', label: '问 AI', icon: Bot, emoji: '🤖' },
]

/**
 * 快捷操作 — 2 宫格。
 */
export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {ACTIONS.map(({ href, label, emoji }) => (
        <Link
          key={href}
          href={href}
          className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <span className="text-2xl">{emoji}</span>
          <span className="text-sm font-medium">{label}</span>
        </Link>
      ))}
    </div>
  )
}
