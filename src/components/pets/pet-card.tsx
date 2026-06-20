import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Pet } from '@/types'
import { calcPetAge } from '@/lib/utils/pet-age'

interface PetCardProps {
  pet: Pet
  latestWeight?: string | null
  daysUntilVaccine?: number | null
  lastRecordDate?: string | null
}

/**
 * 宠物卡片 — Dashboard 首页和宠物列表使用。
 */
export function PetCard({ pet, latestWeight, daysUntilVaccine, lastRecordDate }: PetCardProps) {
  const age = pet.birthday ? calcPetAge(pet.birthday) : null
  const initials = pet.name.slice(0, 2).toUpperCase()

  const vaccineColor =
    daysUntilVaccine == null
      ? 'text-muted-foreground'
      : daysUntilVaccine < 7
        ? 'text-red-500'
        : daysUntilVaccine < 30
          ? 'text-amber-500'
          : 'text-green-500'

  const vaccineLabel =
    daysUntilVaccine == null
      ? '无疫苗记录'
      : daysUntilVaccine < 0
        ? '已过期'
        : `${daysUntilVaccine}天后`

  return (
    <Link href={`/pets/${pet.id}`}>
      <Card className="cursor-pointer rounded-2xl border border-border shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <CardContent className="flex flex-col items-center gap-2 p-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={(pet as any).avatar_url ?? pet.avatarUrl ?? undefined} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <p className="font-semibold">{pet.name}</p>
          <p className="text-sm text-muted-foreground">
            {pet.breed || pet.species === 'dog' ? '🐶' : pet.species === 'cat' ? '🐱' : '🐾'}{' '}
            {age ?? '年龄未知'}
          </p>
          {latestWeight && (
            <p className="text-sm">
              体重: <span className="font-medium">{latestWeight}kg</span>
            </p>
          )}
          <p className={`text-xs ${vaccineColor}`}>💉 疫苗: {vaccineLabel}</p>
          {lastRecordDate && (
            <p className="text-xs text-muted-foreground">📝 最近记录: {lastRecordDate}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
