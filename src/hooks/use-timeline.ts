'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export interface TimelineEvent {
  id: string
  petId: string
  userId: string
  eventType: string
  title: string
  description: string | null
  photoUrl: string | null
  eventDate: string
  isMilestone: boolean
  createdAt: string
}

export interface TimelineInput {
  petId: string
  eventType: string
  title: string
  description?: string
  photoUrl?: string
  eventDate: string
  isMilestone?: boolean
}

export function useTimeline(petId: string) {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const fetchEvents = useCallback(async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .eq('pet_id', petId)
      .order('event_date', { ascending: false })

    if (error) {
      console.error('[useTimeline] fetchEvents error:', error)
    } else {
      setEvents(data as TimelineEvent[])
    }
    setIsLoading(false)
  }, [petId, supabase])

  const createEvent = useCallback(
    async (input: TimelineInput) => {
      const { data: authData } = await supabase.auth.getUser()
      if (!authData.user) return null

      const { data, error } = await supabase
        .from('timeline_events')
        .insert({
          pet_id: input.petId,
          user_id: authData.user.id,
          event_type: input.eventType,
          title: input.title,
          description: input.description || null,
          photo_url: input.photoUrl || null,
          event_date: input.eventDate,
          is_milestone: input.isMilestone || false,
        })
        .select()
        .single()

      if (error) {
        console.error('[useTimeline] createEvent error:', error)
        toast.error('添加事件失败')
        return null
      }

      setEvents((prev) => {
        const next = [data as TimelineEvent, ...prev]
        return next.sort(
          (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
        )
      })
      toast.success('事件已添加')
      return data as TimelineEvent
    },
    [petId, supabase]
  )

  const updateEvent = useCallback(
    async (id: string, input: Partial<TimelineInput>) => {
      const updateData: Record<string, unknown> = {}
      if (input.title !== undefined) updateData.title = input.title
      if (input.description !== undefined) updateData.description = input.description || null
      if (input.eventDate !== undefined) updateData.event_date = input.eventDate
      if (input.eventType !== undefined) updateData.event_type = input.eventType
      if (input.isMilestone !== undefined) updateData.is_milestone = input.isMilestone
      if (input.photoUrl !== undefined) updateData.photo_url = input.photoUrl || null

      const { data, error } = await supabase
        .from('timeline_events')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        toast.error('更新失败')
        return null
      }

      setEvents((prev) =>
        prev
          .map((e) => (e.id === id ? (data as TimelineEvent) : e))
          .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
      )
      toast.success('事件已更新')
      return data as TimelineEvent
    },
    [supabase]
  )

  const deleteEvent = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('timeline_events').delete().eq('id', id)
      if (error) {
        toast.error('删除失败')
        return false
      }
      setEvents((prev) => prev.filter((e) => e.id !== id))
      toast.success('事件已删除')
      return true
    },
    [supabase]
  )

  return { events, isLoading, fetchEvents, createEvent, updateEvent, deleteEvent }
}
