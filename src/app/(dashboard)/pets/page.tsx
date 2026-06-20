'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePets } from '@/hooks/use-pets'
import { PetCard } from '@/components/pets/pet-card'
import { EmptyState } from '@/components/shared/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus } from 'lucide-react'

/**
 * 宠物列表页 /pets
 */
export default function PetsPage() {
  const { pets, isLoading, fetchPets } = usePets()

  useEffect(() => {
    fetchPets()
  }, [fetchPets])

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl p-4">
        <Skeleton className="mb-4 h-7 w-32" />
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-44 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">🐶 我的宠物</h1>
        <Link
          href="/pets/new"
          className="btn-primary h-9 text-xs"
        >
          <Plus className="h-4 w-4" />
          新增
        </Link>
      </div>

      {pets.length === 0 ? (
        <EmptyState
          pet="dog"
          title="还没有宠物"
          description="添加你的第一只宠物，开始记录成长吧"
          actionLabel="新增宠物"
          actionHref="/pets/new"
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  )
}
