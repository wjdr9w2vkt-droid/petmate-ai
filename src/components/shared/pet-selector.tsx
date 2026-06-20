'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Pet } from '@/types'
import { Loader2 } from 'lucide-react'

interface PetSelectorProps {
  selectedId: string
  onChange: (petId: string) => void
  disabled?: boolean
}

/**
 * 宠物选择器 — 下拉选择当前用户的宠物。
 */
export function PetSelector({ selectedId, onChange, disabled }: PetSelectorProps) {
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('pets')
      .select('id, name, species, breed')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setPets(data as Pet[])
        }
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        加载宠物列表...
      </div>
    )
  }

  if (pets.length === 0) {
    return <p className="text-sm text-muted-foreground">暂无宠物，请先创建宠物</p>
  }

  return (
    <select
      value={selectedId}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
    >
      <option value="" disabled>
        选择宠物
      </option>
      {pets.map((pet) => (
        <option key={pet.id} value={pet.id}>
          {pet.species === 'dog' ? '🐶' : pet.species === 'cat' ? '🐱' : '🐾'}{' '}
          {pet.name}
          {pet.breed ? ` (${pet.breed})` : ''}
        </option>
      ))}
    </select>
  )
}
