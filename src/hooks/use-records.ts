'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { GrowthRecord } from '@/types'
import type { RecordInput } from '@/lib/validators/record'
import { toast } from 'sonner'

/**
 * 成长记录 CRUD Hook。
 */
export function useRecords() {
  const [records, setRecords] = useState<GrowthRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  /** 获取记录列表（可按宠物筛选） */
  const fetchRecords = useCallback(
    async (petId?: string) => {
      setIsLoading(true)
      try {
        let query = supabase
          .from('growth_records')
          .select('*')
          .order('recorded_at', { ascending: false })

        if (petId) {
          query = query.eq('pet_id', petId)
        }

        const { data, error } = await query

        if (error) {
          console.error('[useRecords] fetchRecords error:', error)
          toast.error('加载记录失败')
        } else {
          setRecords(data as GrowthRecord[])
        }
      } catch (err) {
        console.error('[useRecords] fetchRecords network error:', err)
        toast.error('网络异常，请检查网络连接')
      } finally {
        setIsLoading(false)
      }
    },
    [supabase]
  )

  /** 创建记录 */
  const createRecord = useCallback(
    async (input: RecordInput, photoUrl?: string) => {
      setIsSubmitting(true)

      const { data, error } = await supabase
        .from('growth_records')
        .insert({
          pet_id: input.petId,
          recorded_at: input.recordedAt,
          weight: input.weight || null,
          food_note: input.foodNote || null,
          water_note: input.waterNote || null,
          exercise_note: input.exerciseNote || null,
          remark: input.remark || null,
          photo_url: photoUrl || null,
        })
        .select()
        .single()

      if (error) {
        console.error('[useRecords] createRecord error:', {
          code: error.code,
          message: error.message,
          details: error.details,
        })
        // UNIQUE 约束冲突
        if (error.code === '23505') {
          toast.error('该宠物当天已有记录，请选择其他日期')
        } else {
          toast.error(error.message || '创建记录失败')
        }
        setIsSubmitting(false)
        return null
      }

      setRecords((prev) => [data as GrowthRecord, ...prev])
      toast.success('记录已保存')
      setIsSubmitting(false)
      return data as GrowthRecord
    },
    [supabase]
  )

  /** 更新记录 */
  const updateRecord = useCallback(
    async (id: string, input: RecordInput, photoUrl?: string) => {
      setIsSubmitting(true)

      const updateData: Record<string, unknown> = {
        pet_id: input.petId,
        recorded_at: input.recordedAt,
        weight: input.weight || null,
        food_note: input.foodNote || null,
        water_note: input.waterNote || null,
        exercise_note: input.exerciseNote || null,
        remark: input.remark || null,
      }
      if (photoUrl !== undefined) {
        updateData.photo_url = photoUrl
      }

      const { data, error } = await supabase
        .from('growth_records')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('[useRecords] updateRecord error:', error)
        if (error.code === '23505') {
          toast.error('该宠物当天已有记录')
        } else {
          toast.error('更新记录失败')
        }
        setIsSubmitting(false)
        return null
      }

      setRecords((prev) =>
        prev.map((r) => (r.id === id ? (data as GrowthRecord) : r))
      )
      toast.success('记录已更新')
      setIsSubmitting(false)
      return data as GrowthRecord
    },
    [supabase]
  )

  /** 删除记录 */
  const deleteRecord = useCallback(
    async (id: string) => {
      const { error } = await supabase
        .from('growth_records')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('[useRecords] deleteRecord error:', error)
        toast.error('删除失败')
        return false
      }

      setRecords((prev) => prev.filter((r) => r.id !== id))
      toast.success('记录已删除')
      return true
    },
    [supabase]
  )

  return {
    records,
    isLoading,
    isSubmitting,
    fetchRecords,
    createRecord,
    updateRecord,
    deleteRecord,
  }
}
