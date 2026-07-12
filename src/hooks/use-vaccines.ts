'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Vaccination } from '@/types'
import type { VaccineInput } from '@/lib/validators/vaccine'
import { toast } from 'sonner'

/**
 * 疫苗记录 CRUD Hook。
 */
export function useVaccines() {
  const [vaccines, setVaccines] = useState<Vaccination[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  /** 获取某宠物的所有疫苗记录 */
  const fetchVaccines = useCallback(
    async (petId: string) => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('vaccinations')
          .select('*')
          .eq('pet_id', petId)
          .order('vaccinated_at', { ascending: false })

        if (error) {
          console.error('[useVaccines] fetchVaccines error:', error)
          toast.error('加载疫苗记录失败')
        } else {
          setVaccines(data as Vaccination[])
        }
      } catch (err) {
        console.error('[useVaccines] fetchVaccines network error:', err)
        toast.error('网络异常，请检查网络连接')
      } finally {
        setIsLoading(false)
      }
    },
    [supabase]
  )

  /** 创建疫苗记录 */
  const createVaccine = useCallback(
    async (input: VaccineInput) => {
      setIsSubmitting(true)
      const { data, error } = await supabase
        .from('vaccinations')
        .insert({
          pet_id: input.petId,
          vaccine_name: input.vaccineName,
          vaccinated_at: input.vaccinatedAt,
          next_due_date: input.nextDueDate || null,
          remark: input.remark || null,
        })
        .select()
        .single()

      if (error) {
        console.error('[useVaccines] createVaccine error:', error)
        toast.error('添加疫苗失败')
        setIsSubmitting(false)
        return null
      }

      setVaccines((prev) => [data as Vaccination, ...prev])
      toast.success('疫苗记录已添加')
      setIsSubmitting(false)
      return data as Vaccination
    },
    [supabase]
  )

  /** 删除疫苗记录 */
  const deleteVaccine = useCallback(
    async (id: string) => {
      const { error } = await supabase
        .from('vaccinations')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('[useVaccines] deleteVaccine error:', error)
        toast.error('删除失败')
        return false
      }

      setVaccines((prev) => prev.filter((v) => v.id !== id))
      toast.success('疫苗记录已删除')
      return true
    },
    [supabase]
  )

  return {
    vaccines,
    isLoading,
    isSubmitting,
    fetchVaccines,
    createVaccine,
    deleteVaccine,
  }
}
