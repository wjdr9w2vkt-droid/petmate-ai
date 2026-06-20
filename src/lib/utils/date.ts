/**
 * 日期工具函数
 */

/** 格式化日期为中文格式：2026年6月19日 */
export function formatDateShort(dateStr: string): string {
  if (!dateStr) return '未知日期'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '未知日期'
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

/** 格式化日期为 ISO 短格式：2026-06-19 */
export function formatDateISO(dateStr: string): string {
  return new Date(dateStr).toISOString().split('T')[0]
}

/** 获取今天的 ISO 字符串 */
export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}
