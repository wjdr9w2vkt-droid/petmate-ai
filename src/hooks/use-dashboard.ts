'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { PetDashboard } from '@/types'

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
    const { data, error } = await supabase
      .from('pet_dashboard')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[useDashboard] error:', error)
    } else if (data) {
      setData(data as PetDashboard[])
    }
    setIsLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return { data, isLoading, refetch: fetchDashboard }
}
