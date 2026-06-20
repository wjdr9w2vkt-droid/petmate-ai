'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { RecordForm } from '@/components/records/record-form'
import { useRecords } from '@/hooks/use-records'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import type { GrowthRecord } from '@/types'
import type { RecordInput } from '@/lib/validators/record'

/**
 * 编辑记录页 /records/[id]/edit
 */
export default function EditRecordPage() {
  const params = useParams()
  const id = params.id as string
  const { updateRecord, isSubmitting } = useRecords()

  const [record, setRecord] = useState<GrowthRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('growth_records')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setRecord(data as GrowthRecord)
        setIsLoading(false)
      })
  }, [id])

  const handleUpdate = async (input: RecordInput) => {
    const result = await updateRecord(id, input)
    return result ? { id: result.id } : null
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!record) {
    return (
      <div className="container mx-auto max-w-lg p-4 text-center">
        <p className="text-muted-foreground">记录不存在</p>
      </div>
    )
  }

  return (
    <RecordForm
      title="✏️ 编辑记录"
      initialData={{
        petId: (record as any).pet_id ?? record.petId,
        recordedAt: (record as any).recorded_at ?? record.recordedAt,
        weight: record.weight ?? '',
        foodNote: (record as any).food_note ?? record.foodNote ?? '',
        waterNote: (record as any).water_note ?? record.waterNote ?? '',
        exerciseNote: (record as any).exercise_note ?? record.exerciseNote ?? '',
        remark: record.remark ?? '',
      }}
      onSubmit={handleUpdate}
      isSubmitting={isSubmitting}
    />
  )
}
