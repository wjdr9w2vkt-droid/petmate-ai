'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRecords } from '@/hooks/use-records'
import { RecordCard } from '@/components/records/record-card'
import { EmptyState } from '@/components/shared/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, ArrowLeft } from 'lucide-react'

/**
 * 成长记录列表页 /records
 */
export default function RecordsPage() {
  const router = useRouter()
  const { records, isLoading, fetchRecords, deleteRecord } = useRecords()

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl p-4">
        <div className="relative mb-4 flex items-center">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="mx-auto h-7 w-32" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      {/* 标题栏：返回 + 标题居中 + 新增 */}
      <div className="relative mb-4 flex items-center">
        <button
          onClick={() => router.back()}
          className="absolute left-0 text-muted-foreground hover:text-foreground"
          title="返回"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="flex-1 text-center text-xl font-semibold">📋 成长记录</h1>
        <Link
          href="/records/new"
          className="absolute right-0 inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          <Plus className="h-4 w-4" />
          新增
        </Link>
      </div>

      {records.length === 0 ? (
        <EmptyState
          pet="cat"
          title="还没有成长记录"
          description="记录宠物的体重、饮食和运动，追踪成长变化"
          actionLabel="新增记录"
          actionHref="/records/new"
        />
      ) : (
        <div className="space-y-2">
          {records.map((record) => (
            <RecordCard key={record.id} record={record} onDelete={deleteRecord} />
          ))}
        </div>
      )}
    </div>
  )
}
