import { VACCINE_URGENCY } from '@/lib/constants'

interface VaccineCountdownProps {
  nextDueDate: string | null
}

/**
 * 疫苗倒计时标签。
 * <7 天 → 红色  |  <30 天 → 黄色  |  ≥30 天 → 绿色
 */
export function VaccineCountdown({ nextDueDate }: VaccineCountdownProps) {
  if (!nextDueDate) return <span className="text-xs text-muted-foreground">无需再次接种</span>

  const due = new Date(nextDueDate)
  const now = new Date()
  const daysLeft = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  let color: string
  let label: string

  if (daysLeft < 0) {
    color = 'text-red-500 bg-red-50'
    label = '已过期'
  } else if (daysLeft <= VACCINE_URGENCY.DANGER) {
    color = 'text-red-500 bg-red-50'
    label = `${daysLeft}天后到期`
  } else if (daysLeft <= VACCINE_URGENCY.WARNING) {
    color = 'text-amber-500 bg-amber-50'
    label = `${daysLeft}天后到期`
  } else {
    color = 'text-green-500 bg-green-50'
    label = `${daysLeft}天后到期`
  }

  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
      {label}
    </span>
  )
}
