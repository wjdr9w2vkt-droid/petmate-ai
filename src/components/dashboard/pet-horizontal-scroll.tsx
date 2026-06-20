'use client'

import type { PetDashboard } from '@/types'
import { PetCard } from '@/components/pets/pet-card'
import Link from 'next/link'
import { CuteDog } from '@/components/shared/pet-decoration'
import { Plus } from 'lucide-react'

interface PetHorizontalScrollProps {
  pets: PetDashboard[]
}

/**
 * 宠物卡片列表 — Dashboard 用。
 */
export function PetHorizontalScroll({ pets }: PetHorizontalScrollProps) {
  if (pets.length === 0) {
    return (
      <Link
        href="/pets/new"
        className="flex items-center justify-center rounded-lg border border-dashed p-8 text-muted-foreground hover:bg-muted/30 transition-colors"
      >
        <div className="text-center">
          <CuteDog size={70} />
          <p className="mt-2 text-sm font-medium">添加你的第一只宠物</p>
        </div>
      </Link>
    )
  }

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {pets.map((p) => {
          const petId = (p as any).pet_id ?? p.petId
          return (
            <PetCard
              key={petId}
              pet={{
                id: petId,
                userId: (p as any).user_id ?? '',
                name: (p as any).pet_name ?? p.petName,
                species: p.species as any,
                breed: null,
                gender: 'male' as any,
                birthday: p.birthday,
                avatarUrl: (p as any).avatar_url ?? p.avatarUrl ?? null,
                isNeutered: false,
                createdAt: (p as any).created_at ?? '',
                updatedAt: '',
              }}
              latestWeight={(p as any).latest_weight ?? p.latestWeight}
              daysUntilVaccine={(p as any).days_until_vaccine ?? p.daysUntilVaccine}
              lastRecordDate={(p as any).last_record_date ?? p.lastRecordDate}
            />
          )
        })}
      </div>
      <Link
        href="/pets/new"
        className="mt-3 flex items-center justify-center rounded-lg border border-dashed p-4 text-muted-foreground hover:bg-muted/30 transition-colors"
      >
        <Plus className="mr-1 h-4 w-4" />
        <span className="text-sm">新增宠物</span>
      </Link>
    </div>
  )
}
