import { z } from 'zod'

// ============================================================
// 疫苗记录表单
// ============================================================
export const vaccineSchema = z.object({
  petId: z.string().uuid('请选择宠物'),
  vaccineName: z
    .string()
    .min(1, '请输入疫苗名称')
    .max(200, '疫苗名称最多 200 个字符'),
  vaccinatedAt: z.string().min(1, '请选择接种日期'),
  nextDueDate: z.string().optional().or(z.literal('')),
  remark: z.string().max(500).optional(),
})

export type VaccineInput = z.infer<typeof vaccineSchema>
