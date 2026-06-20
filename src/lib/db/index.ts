import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

/**
 * Drizzle ORM Client。
 * 仅在服务端使用（Server Component / API Route）。
 * 客户端查询请使用 Supabase Browser Client。
 */

const connectionString = process.env.DATABASE_URL!

// 单例模式：避免开发时热重载创建过多连接
const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof drizzle> | undefined
  client: ReturnType<typeof postgres> | undefined
}

const client =
  globalForDb.client ??
  postgres(connectionString, {
    max: 1, // Serverless 友好：限制连接池大小
    idle_timeout: 20,
  })

export const db =
  globalForDb.db ?? drizzle(client, { schema })

if (process.env.NODE_ENV !== 'production') {
  globalForDb.client = client
  globalForDb.db = db
}
