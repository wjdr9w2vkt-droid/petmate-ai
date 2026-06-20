'use client'

import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <span className="text-4xl">😿</span>
      <h2 className="text-lg font-semibold">页面加载出错</h2>
      <p className="text-sm text-muted-foreground">{error.message || '未知错误'}</p>
      <Button onClick={reset}>重试</Button>
    </div>
  )
}
