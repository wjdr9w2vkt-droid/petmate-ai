import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PetMate AI - 数字养宠管家',
    short_name: 'PetMate',
    description: '记录宠物成长，AI 解答养宠问题，疫苗到期提醒',
    start_url: '/',
    display: 'standalone',
    background_color: '#fef9f5',
    theme_color: '#F4A460',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
    screenshots: [],
    categories: ['lifestyle', 'health', 'utilities'],
    lang: 'zh-CN',
  }
}
