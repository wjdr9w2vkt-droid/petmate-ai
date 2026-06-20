'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PetSelector } from '@/components/shared/pet-selector'
import { Loader2, ArrowLeft } from 'lucide-react'
import { recordSchema, type RecordInput } from '@/lib/validators/record'
import { todayISO } from '@/lib/utils/date'

type FieldErrors = Partial<Record<keyof RecordInput, string>>

interface RecordFormProps {
  initialData?: Partial<RecordInput>
  onSubmit: (input: RecordInput, photoUrl?: string) => Promise<{ id: string } | null>
  isSubmitting: boolean
  title: string
}

/**
 * 成长记录表单（新增/编辑共用）。
 */
export function RecordForm({ initialData, onSubmit, isSubmitting, title }: RecordFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    petId: initialData?.petId ?? '',
    recordedAt: initialData?.recordedAt ?? todayISO(),
    weight: initialData?.weight ?? '',
    foodNote: initialData?.foodNote ?? '',
    waterNote: initialData?.waterNote ?? '',
    exerciseNote: initialData?.exerciseNote ?? '',
    remark: initialData?.remark ?? '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (errors[field as keyof FieldErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = recordSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: FieldErrors = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RecordInput
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    const record = await onSubmit(result.data)
    if (record) {
      router.push('/records')
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
            {/* 宠物选择 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">选择宠物 *</label>
              <PetSelector
                selectedId={form.petId}
                onChange={(id) => setForm((prev) => ({ ...prev, petId: id }))}
                disabled={isSubmitting}
              />
              {errors.petId && <p className="text-sm text-destructive">{errors.petId}</p>}
            </div>

            {/* 日期 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">记录日期 *</label>
              <Input
                type="date"
                value={form.recordedAt}
                onChange={handleChange('recordedAt')}
                max={todayISO()}
                disabled={isSubmitting}
              />
              {errors.recordedAt && (
                <p className="text-sm text-destructive">{errors.recordedAt}</p>
              )}
            </div>

            {/* 体重 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">体重 (kg)</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="200"
                placeholder="如 28.5"
                value={form.weight}
                onChange={handleChange('weight')}
                disabled={isSubmitting}
              />
              {errors.weight && <p className="text-sm text-destructive">{errors.weight}</p>}
            </div>

            {/* 饮食 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">饮食记录</label>
              <textarea
                className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[60px] resize-y placeholder:text-muted-foreground/60 dark:placeholder:text-muted-foreground/40"
                placeholder="如早餐：100g狗粮 + 蛋黄"
                value={form.foodNote}
                onChange={handleChange('foodNote')}
                disabled={isSubmitting}
                maxLength={1000}
                rows={2}
              />
            </div>

            {/* 饮水 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">饮水记录</label>
              <Input
                placeholder="如正常饮水，约500ml"
                value={form.waterNote}
                onChange={handleChange('waterNote')}
                disabled={isSubmitting}
              />
            </div>

            {/* 运动 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">运动记录</label>
              <Input
                placeholder="如散步40分钟"
                value={form.exerciseNote}
                onChange={handleChange('exerciseNote')}
                disabled={isSubmitting}
              />
            </div>

            {/* 备注 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">备注</label>
              <textarea
                className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[60px] resize-y placeholder:text-muted-foreground/60 dark:placeholder:text-muted-foreground/40"
                placeholder="精神状态、大便情况等"
                value={form.remark}
                onChange={handleChange('remark')}
                disabled={isSubmitting}
                maxLength={1000}
                rows={2}
              />
            </div>

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
