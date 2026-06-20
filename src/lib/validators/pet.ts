import { z } from 'zod'
import { SPECIES, GENDERS } from '@/lib/constants'

// ============================================================
// 宠物表单
// ============================================================
export const petSchema = z.object({
  name: z
    .string()
    .min(1, '请输入宠物名称')
    .max(50, '名称最多 50 个字符'),
  species: z.enum(SPECIES, {
    required_error: '请选择宠物种类',
  }),
  breed: z.string().max(100, '品种最多 100 个字符').optional().or(z.literal('')),
  gender: z.enum(GENDERS, {
    required_error: '请选择性别',
  }),
  birthday: z.string().optional().or(z.literal('')),
  isNeutered: z.boolean().default(false),
})

export type PetInput = z.infer<typeof petSchema>
