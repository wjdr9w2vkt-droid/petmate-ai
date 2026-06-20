import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/auth/auth-provider'
import { SwRegister } from '@/components/shared/sw-register'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const viewport: Viewport = {
  themeColor: '#F4A460',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: {
    default: 'PetMate AI - 你的数字养宠管家',
    template: '%s | PetMate AI',
  },
  description:
    '智能宠物健康管理助手。记录宠物成长、追踪体重变化、管理疫苗提醒，AI 解答养宠问题。',
  keywords: ['宠物', '宠物管理', '宠物健康', 'AI养宠', '疫苗提醒', '体重追踪'],
  authors: [{ name: 'PetMate' }],
  robots: 'index, follow',
  openGraph: {
    title: 'PetMate AI - 你的数字养宠管家',
    description: '记录宠物成长，AI 解答养宠问题，疫苗到期提醒',
    type: 'website',
    locale: 'zh_CN',
  },
  icons: {
    icon: '/icon-192.svg',
    apple: '/icon-192.svg',
  },
  appleWebApp: {
    capable: true,
    title: 'PetMate AI',
    statusBarStyle: 'black-translucent',
    startupImage: [
      { url: '/splash-430-932.svg', media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)' },
      { url: '/splash-430-932.svg', media: '(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3)' },
      { url: '/splash-430-932.svg', media: '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)' },
      { url: '/splash-430-932.svg', media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)' },
      { url: '/splash-430-932.svg', media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)' },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
      style={
        {
          '--font-sans': `var(--font-geist-sans)`,
        } as React.CSSProperties
      }
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="top-center" richColors />
        <SwRegister />
      </body>
    </html>
  )
}
