'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { PetDashboard } from '@/types'
import { toast } from 'sonner'

/**
 * Dashboard 数据 Hook。
 * 查询 pet_dashboard VIEW 获取聚合数据。
 */
export function useDashboard() {
  const [data, setData] = useState<PetDashboard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('pet_dashboard')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[useDashboard] error:', error)
        toast.error('加载首页数据失败')
      } else if (data) {
        setData(data as PetDashboard[])
      }
    } catch (err) {
      console.error('[useDashboard] network error:', err)
      toast.error('网络异常，请检查网络连接')
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return { data, isLoading, refetch: fetchDashboard }
}
