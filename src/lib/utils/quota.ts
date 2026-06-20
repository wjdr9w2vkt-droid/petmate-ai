import { FREE_AI_QUOTA_DAILY } from '@/lib/constants'

/**
 * 配额计算工具
 */

/** 计算今日剩余 AI 配额 */
export function calcRemainingQuota(todayUsageCount: number, dailyLimit?: number): number {
  const limit = dailyLimit ?? FREE_AI_QUOTA_DAILY
  return Math.max(0, limit - todayUsageCount)
}

/** 是否还有配额 */
export function hasQuota(todayUsageCount: number, dailyLimit?: number): boolean {
  return calcRemainingQuota(todayUsageCount, dailyLimit) > 0
}
