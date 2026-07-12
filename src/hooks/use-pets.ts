'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Pet } from '@/types'
import type { PetInput } from '@/lib/validators/pet'
import { toast } from 'sonner'

/**
 * 宠物 CRUD Hook。
 * 通过 Supabase Client + RLS 直接操作 pets 表。
 */
export function usePets() {
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  /** 获取当前用户的所有宠物 */
  const fetchPets = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[usePets] fetchPets error:', error)
        toast.error('加载宠物列表失败')
      } else {
        setPets(data as Pet[])
      }
    } catch (err) {
      console.error('[usePets] fetchPets network error:', err)
      toast.error('网络异常，请检查网络连接')
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  /** 获取单只宠物 */
  const fetchPet = useCallback(
    async (id: string): Promise<Pet | null> => {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('[usePets] fetchPet error:', error)
        return null
      }
      return data as Pet
    },
    [supabase]
  )

  /** 创建宠物 */
  const createPet = useCallback(
    async (input: PetInput, avatarUrl?: string) => {
      setIsSubmitting(true)

      // 获取当前用户 ID（RLS 要求 user_id = auth.uid()）
      const { data: authData } = await supabase.auth.getUser()
      if (!authData.user) {
        toast.error('登录状态已过期，请重新登录')
        setIsSubmitting(false)
        return null
      }

      const { data, error } = await supabase
        .from('pets')
        .insert({
          user_id: authData.user.id,
          name: input.name,
          species: input.species,
          breed: input.breed || null,
          gender: input.gender,
          birthday: input.birthday || null,
          is_neutered: input.isNeutered,
          avatar_url: avatarUrl || null,
        })
        .select()
        .single()

      if (error) {
        console.error('[usePets] createPet error:', {
          code: error.code,
          message: error.message,
          details: error.details,
        })
        toast.error(error.message || '创建宠物失败')
        setIsSubmitting(false)
        return null
      }

      setPets((prev) => [data as Pet, ...prev])
      toast.success('宠物已创建')
      setIsSubmitting(false)
      return data as Pet
    },
    [supabase]
  )

  /** 更新宠物 */
  const updatePet = useCallback(
    async (id: string, input: PetInput, avatarUrl?: string) => {
      setIsSubmitting(true)
      const updateData: Record<string, unknown> = {
        name: input.name,
        species: input.species,
        breed: input.breed || null,
        gender: input.gender,
        birthday: input.birthday || null,
        is_neutered: input.isNeutered,
      }
      if (avatarUrl !== undefined) {
        updateData.avatar_url = avatarUrl
      }

      const { data, error } = await supabase
        .from('pets')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('[usePets] updatePet error:', error)
        toast.error('更新宠物失败')
        setIsSubmitting(false)
        return null
      }

      setPets((prev) => prev.map((p) => (p.id === id ? (data as Pet) : p)))
      toast.success('宠物信息已更新')
      setIsSubmitting(false)
      return data as Pet
    },
    [supabase]
  )

  /** 删除宠物 */
  const deletePet = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('pets').delete().eq('id', id)

      if (error) {
        console.error('[usePets] deletePet error:', error)
        toast.error('删除失败')
        return false
      }

      setPets((prev) => prev.filter((p) => p.id !== id))
      toast.success('宠物已删除')
      return true
    },
    [supabase]
  )

  return {
    pets,
    isLoading,
    isSubmitting,
    fetchPets,
    fetchPet,
    createPet,
    updatePet,
    deletePet,
  }
}
