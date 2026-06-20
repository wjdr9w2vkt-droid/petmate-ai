'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PetSelector } from '@/components/shared/pet-selector'
import { Loader2 } from 'lucide-react'
import { vaccineSchema, type VaccineInput } from '@/lib/validators/vaccine'
import { todayISO } from '@/lib/utils/date'

type FieldErrors = Partial<Record<keyof VaccineInput, string>>

interface VaccineFormProps {
  petId?: string
  onSubmit: (input: VaccineInput) => Promise<{ id: string } | null>
  isSubmitting: boolean
  onCancel: () => void
}

/**
 * 疫苗表单 — 在弹窗/区域内联使用。
 */
export function VaccineForm({ petId, onSubmit, isSubmitting, onCancel }: VaccineFormProps) {
  const [form, setForm] = useState({
    petId: petId ?? '',
    vaccineName: '',
    vaccinatedAt: todayISO(),
    nextDueDate: '',
    remark: '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (errors[field as keyof FieldErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = vaccineSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: FieldErrors = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof VaccineInput
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    await onSubmit(result.data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
      {!petId && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium">选择宠物 *</label>
          <PetSelector
            selectedId={form.petId}
            onChange={(id) => setForm((prev) => ({ ...prev, petId: id }))}
            disabled={isSubmitting}
          />
          {errors.petId && <p className="text-sm text-destructive">{errors.petId}</p>}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-medium">疫苗名称 *</label>
        <Input
          placeholder="如狂犬疫苗、犬六联"
          value={form.vaccineName}
          onChange={handleChange('vaccineName')}
          maxLength={200}
          disabled={isSubmitting}
        />
        {errors.vaccineName && <p className="text-sm text-destructive">{errors.vaccineName}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">接种日期 *</label>
          <Input
            type="date"
            value={form.vaccinatedAt}
            onChange={handleChange('vaccinatedAt')}
            max={todayISO()}
            disabled={isSubmitting}
          />
          {errors.vaccinatedAt && (
            <p className="text-sm text-destructive">{errors.vaccinatedAt}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">下次接种</label>
          <Input
            type="date"
            value={form.nextDueDate}
            onChange={handleChange('nextDueDate')}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          添加疫苗
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          取消
        </Button>
      </div>
    </form>
  )
}
