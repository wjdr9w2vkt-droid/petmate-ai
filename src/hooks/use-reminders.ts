'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export interface Reminder {
  id: string
  userId: string
  petId: string
  type: string
  title: string
  description: string | null
  dueDate: string
  repeatType: string | null
  isCompleted: boolean
  completedAt: string | null
  notifyBefore: number
  createdAt: string
}

export interface ReminderInput {
  petId: string
  type: string
  title: string
  description?: string
  dueDate: string
  repeatType?: string
  notifyBefore?: number
}

export function useReminders(petId?: string) {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const fetchReminders = useCallback(async () => {
    setIsLoading(true)
    let q = supabase.from('reminders').select('*').order('due_date', { ascending: true })
    if (petId) q = q.eq('pet_id', petId)
    const { data, error } = await q
    if (!error && data) setReminders(data as Reminder[])
    setIsLoading(false)
  }, [petId, supabase])

  const createReminder = useCallback(
    async (input: ReminderInput) => {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) return null
      const { data, error } = await supabase
        .from('reminders')
        .insert({
          user_id: auth.user.id,
          pet_id: input.petId,
          type: input.type,
          title: input.title,
          description: input.description || null,
          due_date: input.dueDate,
          repeat_type: input.repeatType || null,
          notify_before: input.notifyBefore ?? 1,
        })
        .select().single()
      if (error) { toast.error('创建提醒失败'); return null }
      setReminders((prev) => [...prev, data as Reminder].sort((a, b) => a.dueDate.localeCompare(b.dueDate)))
      toast.success('提醒已创建')
      return data as Reminder
    },
    [supabase]
  )

  const toggleComplete = useCallback(
    async (id: string, current: boolean) => {
      const { error } = await supabase
        .from('reminders')
        .update({ is_completed: !current, completed_at: !current ? new Date().toISOString() : null })
        .eq('id', id)
      if (error) { toast.error('操作失败'); return }
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isCompleted: !current, completedAt: !current ? new Date().toISOString() : null } : r))
      )
    },
    [supabase]
  )

  const deleteReminder = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('reminders').delete().eq('id', id)
      if (error) { toast.error('删除失败'); return false }
      setReminders((prev) => prev.filter((r) => r.id !== id))
      toast.success('已删除')
      return true
    },
    [supabase]
  )

  return { reminders, isLoading, fetchReminders, createReminder, toggleComplete, deleteReminder }
}
