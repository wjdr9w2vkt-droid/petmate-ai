'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { GrowthRecord } from '@/types'
import { formatDateShort } from '@/lib/utils/date'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Pencil, Trash2 } from 'lucide-react'

interface RecordCardProps {
  record: GrowthRecord
  onDelete: (id: string) => Promise<boolean>
}

/**
 * 成长记录卡片 — 点击编辑，右上角删除。
 */
export function RecordCard({ record, onDelete }: RecordCardProps) {
  const hasNotes = record.foodNote || record.exerciseNote || record.remark
  const id = (record as any).id
  const [showDelete, setShowDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await onDelete(id)
    setIsDeleting(false)
    setShowDelete(false)
  }

  return (
    <>
      <div className="group relative rounded-lg border p-4 transition-colors hover:bg-muted/50">
        {/* 操作按钮 - 右上角 */}
        <div className="absolute right-2 top-2 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/records/${id}/edit`}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="编辑"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault()
              setShowDelete(true)
            }}
            className="rounded p-1 text-muted-foreground hover:bg-red-50 hover:text-red-500"
            title="删除"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 主体内容 - 点击跳编辑 */}
        <Link href={`/records/${id}/edit`} className="block">
          <div className="flex items-center justify-between pr-12">
            <span className="font-medium">
              {formatDateShort((record as any).recorded_at ?? record.recordedAt)}
            </span>
            {record.weight && (
              <span className="text-lg font-semibold">{record.weight} kg</span>
            )}
          </div>
          {hasNotes && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {[record.foodNote, record.exerciseNote, record.remark]
                .filter(Boolean)
                .join(' · ')}
            </p>
          )}
        </Link>
      </div>

      <ConfirmDialog
        open={showDelete}
        title="删除记录"
        description={`确定删除 ${formatDateShort((record as any).recorded_at ?? record.recordedAt)} 的记录吗？此操作不可撤销。`}
        confirmLabel="确认删除"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </>
  )
}
