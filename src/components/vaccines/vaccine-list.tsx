'use client'

import type { Vaccination } from '@/types'
import { VaccineCountdown } from './vaccine-countdown'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { formatDateShort } from '@/lib/utils/date'

interface VaccineListProps {
  vaccines: Vaccination[]
  onDelete: (id: string) => Promise<boolean>
}

/**
 * 疫苗列表 — 显示接种日期 + 到期倒计时。
 */
export function VaccineList({ vaccines, onDelete }: VaccineListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deletingId) return
    setIsDeleting(true)
    await onDelete(deletingId)
    setIsDeleting(false)
    setDeletingId(null)
  }

  if (vaccines.length === 0) {
    return <p className="py-4 text-center text-sm text-muted-foreground">暂无疫苗记录</p>
  }

  return (
    <div className="space-y-2">
      {vaccines.map((v) => {
        const vaxName = (v as any).vaccine_name ?? v.vaccineName
        const vaxAt = (v as any).vaccinated_at ?? v.vaccinatedAt
        const nextDue = (v as any).next_due_date ?? v.nextDueDate

        return (
          <div
            key={v.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate">{vaxName}</p>
              <p className="text-xs text-muted-foreground">
                接种于 {formatDateShort(vaxAt)}
              </p>
              <div className="mt-1">
                <VaccineCountdown nextDueDate={nextDue} />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive shrink-0"
              onClick={() => setDeletingId(v.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      })}
      <ConfirmDialog
        open={!!deletingId}
        title="删除疫苗记录"
        description="确定要删除这条疫苗记录吗？"
        confirmLabel="确认删除"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  )
}
