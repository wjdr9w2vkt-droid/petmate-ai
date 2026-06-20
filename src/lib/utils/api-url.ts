/**
 * API 基础 URL。
 * Capacitor 静态导出时使用 Vercel 部署地址，开发时使用相对路径。
 */
export function getApiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || ''
  if (base && typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
    return `${base}${path}`
  }
  return path
}
