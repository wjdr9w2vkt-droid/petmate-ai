import Link from 'next/link'
import { CuteDog, CuteCat } from '@/components/shared/pet-decoration'

interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  pet?: 'dog' | 'cat'
}

/**
 * 空状态占位组件 — 含卡通宠物插图。
 */
export function EmptyState({
  icon = '📭',
  title,
  description,
  actionLabel,
  actionHref,
  pet,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {pet === 'dog' ? (
        <CuteDog size={90} />
      ) : pet === 'cat' ? (
        <CuteCat size={90} />
      ) : (
        <span className="text-5xl">{icon}</span>
      )}
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-muted-foreground">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
