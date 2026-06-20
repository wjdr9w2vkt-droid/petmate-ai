import { CuteCat } from '@/components/shared/pet-decoration'

/**
 * 认证页面布局（登录/注册）
 * 居中卡片式，暖色渐变背景 + 卡通猫
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-[#FFF8F0] via-[#FFF5EC] to-[#FFECD5] p-4 overflow-hidden">
      {/* 背景装饰 */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        {['🐾','🐶','🐱','🦴','🐟','🐾','💊','🐕','🐈','🐾'].map((e, i) => (
          <span
            key={i}
            className="absolute text-4xl"
            style={{
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 23 + 7) % 100}%`,
              transform: `rotate(${i * 45}deg)`,
            }}
          >
            {e}
          </span>
        ))}
      </div>
      {/* 卡通猫 */}
      <div className="absolute bottom-8 right-8 hidden lg:block opacity-20">
        <CuteCat size={140} />
      </div>
      {children}
    </main>
  )
}
