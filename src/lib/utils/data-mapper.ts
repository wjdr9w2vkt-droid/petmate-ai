/**
 * Supabase 数据映射工具。
 * Supabase 返回 snake_case 字段名，通过此工具统一转换为 camelCase。
 */

type SnakeCaseRecord = Record<string, unknown>
type CamelCaseRecord = Record<string, unknown>

/** snake_case → camelCase 单字段转换 */
function toCamel(key: string): string {
  return key.replace(/_([a-z])/g, (_, c) => (c as string).toUpperCase())
}

/** 单条记录映射 */
export function mapRecord<T = CamelCaseRecord>(record: SnakeCaseRecord | null): T | null {
  if (!record) return null
  const mapped: CamelCaseRecord = {}
  for (const key of Object.keys(record)) {
    mapped[toCamel(key)] = record[key]
  }
  return mapped as T
}

/** 多条记录映射 */
export function mapRecords<T = CamelCaseRecord>(records: SnakeCaseRecord[]): T[] {
  return records.map((r) => mapRecord<T>(r)!).filter(Boolean)
}
