'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import { CuteDog } from '@/components/shared/pet-decoration'
import { ArrowLeft, X, ChevronLeft, ChevronRight, LayoutGrid, Clock, BarChart3 } from 'lucide-react'

interface PhotoItem {
  url: string
  date: string
  source: string
}

type ViewMode = 'waterfall' | 'timeline' | 'yearly'

export default function PhotosPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('waterfall')
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const [petName, setPetName] = useState('')

  useEffect(() => {
    const supabase = createClient()
    // 获取宠物名
    supabase.from('pets').select('name').eq('id', id).single().then(({ data }) => {
      if (data) setPetName((data as any).name)
    })
    // 聚合所有照片来源
    Promise.all([
      supabase.from('growth_records').select('photo_url, recorded_at').eq('pet_id', id).not('photo_url', 'is', null),
      supabase.from('timeline_events').select('photo_url, event_date').eq('pet_id', id).not('photo_url', 'is', null),
    ]).then(([recs, events]) => {
      const all: PhotoItem[] = []
      recs.data?.forEach((r: any) => {
        if (r.photo_url) all.push({ url: r.photo_url, date: r.recorded_at, source: 'record' })
      })
      events.data?.forEach((e: any) => {
        if (e.photo_url) all.push({ url: e.photo_url, date: e.event_date, source: 'timeline' })
      })
      all.sort((a, b) => b.date.localeCompare(a.date))
      setPhotos(all)
      setIsLoading(false)
    })
  }, [id])

  // 按年月分组
  const byMonth = photos.reduce((acc, p) => {
    const ym = p.date.slice(0, 7)
    if (!acc[ym]) acc[ym] = []
    acc[ym].push(p)
    return acc
  }, {} as Record<string, PhotoItem[]>)

  // 年度统计
  const byYear = photos.reduce((acc, p) => {
    const y = p.date.slice(0, 4)
    if (!acc[y]) acc[y] = { count: 0, months: new Set() }
    acc[y].count++
    acc[y].months.add(p.date.slice(5, 7))
    return acc
  }, {} as Record<string, { count: number; months: Set<string> }>)

  const viewerPhoto = viewerIndex !== null ? photos[viewerIndex] : null

  return (
    <div className="container mx-auto max-w-2xl p-4 pb-20 animate-fade-in-up">
      {/* 顶栏 */}
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold">📸 {petName}的相册</h1>
        <div className="flex gap-1 rounded-lg bg-muted p-0.5">
          {([
            ['waterfall', LayoutGrid],
            ['timeline', Clock],
            ['yearly', BarChart3],
          ] as const).map(([key, Icon]) => (
            <button
              key={key}
              onClick={() => setViewMode(key)}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === key ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      {/* 加载 */}
      {isLoading && (
        <div className="grid grid-cols-2 gap-2">
          {[1,2,3,4].map(i => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
        </div>
      )}

      {/* 空状态 */}
      {!isLoading && photos.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <CuteDog size={80} />
          <h3 className="mt-4 font-semibold">还没有照片</h3>
          <p className="mt-1 text-sm text-muted-foreground">在成长记录和时间轴中添加照片，它们会出现在这里</p>
        </div>
      )}

      {/* 瀑布流 */}
      {!isLoading && viewMode === 'waterfall' && (
        <div className="columns-2 gap-2">
          {photos.map((p, i) => (
            <img
              key={i}
              src={p.url}
              alt=""
              loading="lazy"
              onClick={() => setViewerIndex(i)}
              className="mb-2 w-full cursor-pointer rounded-2xl object-cover transition-transform hover:scale-[1.02]"
            />
          ))}
        </div>
      )}

      {/* 时间轴视图 */}
      {!isLoading && viewMode === 'timeline' && Object.entries(byMonth).map(([ym, items]) => (
        <div key={ym} className="mb-4">
          <p className="mb-2 text-sm font-medium text-muted-foreground">{ym.replace('-', '年')}月 · {items.length}张</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {items.map((p, i) => (
              <img key={i} src={p.url} alt="" onClick={() => setViewerIndex(photos.indexOf(p))}
                className="h-28 shrink-0 cursor-pointer rounded-2xl object-cover transition-transform hover:scale-105" />
            ))}
          </div>
        </div>
      ))}

      {/* 年度回顾 */}
      {!isLoading && viewMode === 'yearly' && (
        <div className="space-y-4">
          {Object.entries(byYear).sort(([a], [b]) => b.localeCompare(a)).map(([year, stats]) => (
            <div key={year} className="rounded-2xl border border-border bg-card p-5 shadow-sm text-center">
              <p className="text-2xl font-bold text-primary">{year}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div><p className="text-2xl font-semibold">{stats.count}</p><p className="text-xs text-muted-foreground">照片</p></div>
                <div><p className="text-2xl font-semibold">{stats.months.size}</p><p className="text-xs text-muted-foreground">月份</p></div>
                <div>
                  <p className="text-2xl font-semibold">
                    {photos.filter(p => p.date.startsWith(year)).find(p => true)?.date.slice(5) ?? '-'}
                  </p>
                  <p className="text-xs text-muted-foreground">最新</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 全屏查看器 */}
      {viewerPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 overscroll-contain" onClick={() => setViewerIndex(null)}>
          <button className="absolute left-4 top-4 text-white" onClick={() => setViewerIndex(null)}><X className="h-6 w-6" /></button>
          {viewerIndex! > 0 && (
            <button className="absolute left-4 top-1/2 text-white" onClick={(e) => { e.stopPropagation(); setViewerIndex(viewerIndex! - 1) }}>
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}
          <img src={viewerPhoto.url} alt="" className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain" onClick={(e) => e.stopPropagation()} />
          {viewerIndex! < photos.length - 1 && (
            <button className="absolute right-4 top-1/2 text-white" onClick={(e) => { e.stopPropagation(); setViewerIndex(viewerIndex! + 1) }}>
              <ChevronRight className="h-8 w-8" />
            </button>
          )}
          <p className="absolute bottom-8 text-sm text-white/70">{viewerPhoto.date}</p>
        </div>
      )}
    </div>
  )
}
