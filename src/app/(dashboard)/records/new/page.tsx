'use client'

import { useRecords } from '@/hooks/use-records'
import { RecordForm } from '@/components/records/record-form'
import type { RecordInput } from '@/lib/validators/record'

/**
 * 新增记录页 /records/new
 */
export default function NewRecordPage() {
  const { createRecord, isSubmitting } = useRecords()

  const handleCreate = async (input: RecordInput) => {
    return await createRecord(input)
  }

  return (
    <RecordForm title="📝 新增记录" onSubmit={handleCreate} isSubmitting={isSubmitting} />
  )
}
