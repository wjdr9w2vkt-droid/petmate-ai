'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { PetForm } from '@/components/pets/pet-form'
import { usePets } from '@/hooks/use-pets'
import { Loader2 } from 'lucide-react'
import type { Pet } from '@/types'
import type { PetInput } from '@/lib/validators/pet'

/**
 * 编辑宠物页 /pets/[id]/edit
 */
export default function EditPetPage() {
  const params = useParams()
  const id = params.id as string
  const { fetchPet, updatePet, isSubmitting } = usePets()

  const [pet, setPet] = useState<Pet | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPet(id).then((data) => {
      setPet(data)
      setIsLoading(false)
    })
  }, [id, fetchPet])

  const handleUpdate = async (input: PetInput, avatarUrl?: string) => {
    const result = await updatePet(id, input, avatarUrl)
    return result ? { id: result.id } : null
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="container mx-auto max-w-lg p-4 text-center">
        <p className="text-muted-foreground">宠物不存在</p>
      </div>
    )
  }

  return (
    <PetForm
      title="✏️ 编辑宠物"
      initialData={{
        name: pet.name,
        species: pet.species,
        breed: pet.breed ?? '',
        gender: pet.gender,
        birthday: pet.birthday ?? '',
        isNeutered: pet.isNeutered,
        avatarUrl: (pet as any).avatar_url ?? pet.avatarUrl ?? null,
      }}
      onSubmit={handleUpdate}
      isSubmitting={isSubmitting}
    />
  )
}
