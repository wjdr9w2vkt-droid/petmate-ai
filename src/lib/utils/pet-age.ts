/**
 * 宠物年龄计算
 */

/**
 * 根据生日计算年龄描述
 * @returns 如 "2岁3个月" / "5个月" / "刚出生"
 */
export function calcPetAge(birthday: string): string {
  const birth = new Date(birthday)
  const now = new Date()

  let years = now.getFullYear() - birth.getFullYear()
  let months = now.getMonth() - birth.getMonth()

  if (months < 0) {
    years--
    months += 12
  }

  if (years > 0 && months > 0) {
    return `${years}岁${months}个月`
  }
  if (years > 0) {
    return `${years}岁`
  }
  if (months > 0) {
    return `${months}个月`
  }
  return '刚出生'
}

/** 计算宠物年龄(年，浮点数)，用于体重标准判断等 */
export function calcPetAgeInYears(birthday: string): number {
  const birth = new Date(birthday)
  const now = new Date()
  const diffMs = now.getTime() - birth.getTime()
  return diffMs / (365.25 * 24 * 60 * 60 * 1000)
}
