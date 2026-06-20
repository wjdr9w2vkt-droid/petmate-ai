'use client'

import { usePets } from '@/hooks/use-pets'
import { PetForm } from '@/components/pets/pet-form'
import type { PetInput } from '@/lib/validators/pet'

/**
 * 新增宠物页 /pets/new
 */
export default function NewPetPage() {
  const { createPet, isSubmitting } = usePets()

  const handleCreate = async (input: PetInput, avatarUrl?: string) => {
    return await createPet(input, avatarUrl)
  }

  return (
    <PetForm
      title="➕ 新增宠物"
      onSubmit={handleCreate}
      isSubmitting={isSubmitting}
    />
  )
}
