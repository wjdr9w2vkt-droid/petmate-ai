import { z } from 'zod'
import { SPECIES, GENDERS } from '@/lib/constants'

// ============================================================
// 登录
// ============================================================
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '请输入邮箱地址')
    .email('邮箱格式不正确'),
  password: z
    .string()
    .min(1, '请输入密码')
    .min(6, '密码至少 6 位'),
})

// ============================================================
// 注册
// ============================================================
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, '请输入邮箱地址')
      .email('邮箱格式不正确'),
    password: z
      .string()
      .min(6, '密码至少 6 位')
      .max(64, '密码最多 64 位'),
    confirmPassword: z.string().min(1, '请确认密码'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
