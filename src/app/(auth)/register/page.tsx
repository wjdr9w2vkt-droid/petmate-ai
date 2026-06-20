'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { registerSchema, type RegisterInput } from '@/lib/validators/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Eye, EyeOff, Loader2, MailCheck } from 'lucide-react'

type FieldErrors = Partial<Record<keyof RegisterInput, string>>

export default function RegisterPage() {
  const { signUp, isSubmitting } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState<RegisterInput>({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [needConfirm, setNeedConfirm] = useState(false)

  const handleChange =
    (field: keyof RegisterInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = registerSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: FieldErrors = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RegisterInput
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    const res = await signUp(form.email, form.password)
    if (res.success && res.needConfirm) {
      setNeedConfirm(true)
    }
  }

  // 等待邮箱验证的状态
  if (needConfirm) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="py-12 text-center">
          <MailCheck className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-xl font-semibold">请验证邮箱</h2>
          <p className="mt-2 text-muted-foreground">
            我们已向 <strong>{form.email}</strong> 发送了一封验证邮件，
            请点击邮件中的链接完成注册。
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            没收到邮件？检查垃圾箱或{' '}
            <button
              onClick={() => setNeedConfirm(false)}
              className="font-medium text-primary hover:underline"
            >
              返回重试
            </button>
          </p>
          <Button
            variant="outline"
            className="mt-6 w-full"
            onClick={() => router.push('/login')}
          >
            返回登录
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">🐾 注册 PetMate</CardTitle>
        <CardDescription>开始你的数字养宠之旅</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 邮箱 */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              邮箱
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange('email')}
              disabled={isSubmitting}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* 密码 */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              密码
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="至少 6 位"
                value={form.password}
                onChange={handleChange('password')}
                disabled={isSubmitting}
                autoComplete="new-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          {/* 确认密码 */}
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              确认密码
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="再次输入密码"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              disabled={isSubmitting}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          {/* 提交 */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                注册中...
              </>
            ) : (
              '注 册'
            )}
          </Button>

          {/* 底部链接 */}
          <p className="text-center text-sm text-muted-foreground">
            已有账号？{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              立即登录
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
