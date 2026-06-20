import { FREE_AI_QUOTA_DAILY } from '@/lib/constants'

interface QuotaIndicatorProps {
  used: number
}

/**
 * 配额指示器。
 */
export function QuotaIndicator({ used }: QuotaIndicatorProps) {
  const remaining = FREE_AI_QUOTA_DAILY - used
  const percent = (used / FREE_AI_QUOTA_DAILY) * 100

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span>
        今日剩余：{remaining}/{FREE_AI_QUOTA_DAILY} 次
      </span>
      <div className="h-1.5 w-16 rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  )
}
