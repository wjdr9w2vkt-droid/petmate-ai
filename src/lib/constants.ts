// ============================================================
// PetMate AI — 全局常量
// ============================================================

/** 支持的宠物种类 */
export const SPECIES = ['dog', 'cat', 'other'] as const
export type Species = (typeof SPECIES)[number]

/** 宠物性别 */
export const GENDERS = ['male', 'female'] as const
export type Gender = (typeof GENDERS)[number]

/** 免费用户每日 AI 配额 */
export const FREE_AI_QUOTA_DAILY = 10

/** 免费用户宠物数量上限 */
export const FREE_PETS_LIMIT = 1

/** 疫苗倒计时颜色阈值（天数） */
export const VACCINE_URGENCY = {
  DANGER: 7,   // <7 天 → 红色
  WARNING: 30, // <30 天 → 黄色
  // >=30 天 → 绿色
} as const

/** 图片上传限制 */
export const UPLOAD_LIMIT = {
  MAX_FILE_SIZE_MB: 5,
  MAX_WIDTH_PX: 800,
  TARGET_QUALITY: 0.8,
} as const

/** 时间段问候语映射 */
export const GREETINGS = {
  morning: '☀️ 早上好',
  afternoon: '👋 下午好',
  evening: '🌙 晚上好',
} as const
