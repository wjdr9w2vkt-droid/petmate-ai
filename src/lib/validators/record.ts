import { z } from 'zod'

// ============================================================
// 成长记录表单
// ============================================================
export const recordSchema = z.object({
  petId: z.string().uuid('请选择宠物'),
  recordedAt: z.string().min(1, '请选择记录日期'),
  weight: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === '') return true
        const num = Number(val)
        return !isNaN(num) && num > 0 && num < 200
      },
      { message: '体重需在 0-200 kg 之间' }
    ),
  foodNote: z.string().max(1000).optional(),
  waterNote: z.string().max(1000).optional(),
  exerciseNote: z.string().max(1000).optional(),
  remark: z.string().max(1000).optional(),
})

export type RecordInput = z.infer<typeof recordSchema>
