'use client'

import { CuteDog } from '@/components/shared/pet-decoration'

/**
 * 离线回退页 /offline
 */
export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#fef9f5] p-4 text-center">
      <CuteDog size={100} />
      <h1 className="text-xl font-semibold">📡 当前处于离线状态</h1>
      <p className="max-w-sm text-muted-foreground">
        请检查网络连接后重试。部分已访问过的页面可能仍可浏览。
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"
      >
        重新连接
      </button>
    </div>
  )
}
