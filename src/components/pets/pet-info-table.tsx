import type { Pet } from '@/types'
import { calcPetAge } from '@/lib/utils/pet-age'

interface PetInfoTableProps {
  pet: Pet
}

/**
 * 宠物信息表格 — 详情页使用。
 */
export function PetInfoTable({ pet }: PetInfoTableProps) {
  const rows = [
    { label: '品种', value: pet.breed || '未填写' },
    {
      label: '性别',
      value: pet.gender === 'male' ? '♂ 公' : '♀ 母',
    },
    {
      label: '年龄',
      value: pet.birthday ? calcPetAge(pet.birthday) : '未填写',
    },
    {
      label: '出生日期',
      value: pet.birthday || '未填写',
    },
    {
      label: '绝育状态',
      value: pet.isNeutered ? '已绝育' : '未绝育',
    },
    {
      label: '种类',
      value:
        pet.species === 'dog' ? '🐶 狗狗' : pet.species === 'cat' ? '🐱 猫咪' : '🐾 其他',
    },
  ]

  return (
    <div className="divide-y rounded-lg border">
      {rows.map(({ label, value }) => (
        <div key={label} className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-sm font-medium">{value}</span>
        </div>
      ))}
    </div>
  )
}
