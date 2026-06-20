'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

type Range = 'week' | 'month' | 'year'

interface ChartDataPoint {
  date: string
  weight: number
}

interface WeightChartProps {
  petId: string
}

/**
 * 体重趋势图 — Recharts 折线图，支持周/月/年切换。
 */
export function WeightChart({ petId }: WeightChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [range, setRange] = useState<Range>('month')

  useEffect(() => {
    const supabase = createClient()

    const now = new Date()
    let startDate: Date
    switch (range) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default: // month
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    const startStr = startDate.toISOString().split('T')[0]

    setIsLoading(true)
    supabase
      .from('growth_records')
      .select('recorded_at, weight')
      .eq('pet_id', petId)
      .gte('recorded_at', startStr)
      .order('recorded_at', { ascending: true })
      .then(({ data: records }) => {
        if (records) {
          const currentYear = new Date().getFullYear().toString()
          const points: ChartDataPoint[] = records
            .filter((r: any) => r.weight)
            .map((r: any) => {
              const fullDate = r.recorded_at as string // "2026-06-19"
              const [y, m, d] = fullDate.split('-')
              // 当年显示月-日，跨年显示年-月-日
              const label = y === currentYear ? `${m}-${d}` : `${y.slice(2)}-${m}-${d}`
              return {
                date: label,
                weight: parseFloat(r.weight as string),
              }
            })
          setData(points)
        }
        setIsLoading(false)
      })
  }, [petId, range])

  const ranges: { key: Range; label: string }[] = [
    { key: 'week', label: '周' },
    { key: 'month', label: '月' },
    { key: 'year', label: '年' },
  ]

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />
  }

  if (data.length < 2) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        {data.length === 0
          ? '暂无体重数据'
          : '需要至少 2 条记录才能显示趋势'}
      </div>
    )
  }

  const weights = data.map((d) => d.weight)
  const minW = Math.floor(Math.min(...weights) - 1)
  const maxW = Math.ceil(Math.max(...weights) + 1)

  return (
    <div className="space-y-2">
      {/* 范围切换 */}
      <div className="flex gap-1">
        {ranges.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setRange(key)}
            className={`rounded-full px-3 py-0.5 text-xs font-medium transition-colors ${
              range === key
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 图表 */}
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[minW, maxW]}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(1)} kg`, '体重']}
              labelFormatter={(label) => `日期: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ r: 3, fill: '#f97316' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
