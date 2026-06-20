'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ArrowLeft } from 'lucide-react'
import { petSchema, type PetInput } from '@/lib/validators/pet'
import { SPECIES, GENDERS } from '@/lib/constants'
import { PetAvatarUpload } from './pet-avatar-upload'

type FieldErrors = Partial<Record<keyof PetInput | 'avatar', string>>

interface PetFormProps {
  /** 编辑模式：已有宠物数据 */
  initialData?: Partial<PetInput> & { avatarUrl?: string | null }
  /** 提交回调 */
  onSubmit: (input: PetInput, avatarUrl?: string) => Promise<{ id: string } | null>
  /** 是否正在提交 */
  isSubmitting: boolean
  /** 页面标题 */
  title: string
}

/**
 * 宠物表单（新增/编辑共用）。
 */
export function PetForm({ initialData, onSubmit, isSubmitting, title }: PetFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    species: initialData?.species ?? 'dog',
    breed: initialData?.breed ?? '',
    gender: initialData?.gender ?? 'male',
    birthday: initialData?.birthday ?? '',
    isNeutered: initialData?.isNeutered ?? false,
  })
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    initialData?.avatarUrl ?? null
  )
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
      setForm((prev) => ({ ...prev, [field]: value }))
      if (errors[field as keyof FieldErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Zod 校验
    const result = petSchema.safeParse({
      ...form,
      birthday: form.birthday || undefined,
      breed: form.breed || undefined,
    })
    if (!result.success) {
      const fieldErrors: FieldErrors = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof PetInput
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    const pet = await onSubmit(result.data, avatarUrl ?? undefined)
    if (pet) {
      router.push(`/pets/${pet.id}`)
    }
  }

  return (
    <div className="container mx-auto max-w-lg p-4">
      <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 头像 */}
            <div className="flex justify-center">
              <PetAvatarUpload
                currentUrl={avatarUrl}
                onUploaded={setAvatarUrl}
              />
            </div>

            {/* 名称 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">名称 *</label>
              <Input
                placeholder="宠物名称"
                value={form.name}
                onChange={handleChange('name')}
                maxLength={50}
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            {/* 种类 + 性别 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">种类 *</label>
                <select
                  value={form.species}
                  onChange={handleChange('species')}
                  disabled={isSubmitting}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  {SPECIES.map((s) => (
                    <option key={s} value={s}>
                      {s === 'dog' ? '🐶 狗狗' : s === 'cat' ? '🐱 猫咪' : '🐾 其他'}
                    </option>
                  ))}
                </select>
                {errors.species && <p className="text-sm text-destructive">{errors.species}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">性别 *</label>
                <select
                  value={form.gender}
                  onChange={handleChange('gender')}
                  disabled={isSubmitting}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>
                      {g === 'male' ? '♂ 公' : '♀ 母'}
                    </option>
                  ))}
                </select>
                {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
              </div>
            </div>

            {/* 品种 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">品种</label>
              <Input
                placeholder="如金毛、英短...（可选）"
                value={form.breed}
                onChange={handleChange('breed')}
                maxLength={100}
                disabled={isSubmitting}
              />
            </div>

            {/* 生日 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">出生日期</label>
              <Input
                type="date"
                value={form.birthday}
                onChange={handleChange('birthday')}
                disabled={isSubmitting}
              />
            </div>

            {/* 绝育 */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isNeutered}
                onChange={handleChange('isNeutered')}
                disabled={isSubmitting}
                className="rounded"
              />
              已绝育
            </label>

            {/* 提交 */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                '保 存'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
