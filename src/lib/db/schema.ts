import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  boolean,
  numeric,
  integer,
  timestamp,
  uniqueIndex,
  index,
  pgView,
} from 'drizzle-orm/pg-core'

// ============================================================
// 1. 用户扩展表 (profiles)
//    关联 auth.users (Supabase Auth 自动管理)
// ============================================================
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  displayName: varchar('display_name', { length: 50 }),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// ============================================================
// 2. 宠物表 (pets)
// ============================================================
export const pets = pgTable(
  'pets',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull(),
    name: varchar('name', { length: 50 }).notNull(),
    species: varchar('species', { length: 20 }).notNull(), // 'dog' | 'cat' | 'other'
    breed: varchar('breed', { length: 100 }),
    gender: varchar('gender', { length: 10 }).notNull(), // 'male' | 'female'
    birthday: date('birthday'),
    avatarUrl: text('avatar_url'),
    isNeutered: boolean('is_neutered').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_pets_user_id').on(table.userId),
    speciesIdx: index('idx_pets_species').on(table.species),
  })
)

// ============================================================
// 3. 成长记录表 (growth_records)
// ============================================================
export const growthRecords = pgTable(
  'growth_records',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    petId: uuid('pet_id').notNull(),
    recordedAt: date('recorded_at').defaultNow().notNull(),
    weight: numeric('weight', { precision: 5, scale: 2 }),
    foodNote: text('food_note'),
    waterNote: text('water_note'),
    exerciseNote: text('exercise_note'),
    remark: text('remark'),
    photoUrl: text('photo_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    petIdIdx: index('idx_growth_records_pet_id').on(table.petId),
    recordedAtIdx: index('idx_growth_records_recorded_at').on(table.recordedAt),
    petDateUnique: uniqueIndex('idx_growth_records_pet_date').on(
      table.petId,
      table.recordedAt
    ),
  })
)

// ============================================================
// 4. 疫苗记录表 (vaccinations)
// ============================================================
export const vaccinations = pgTable(
  'vaccinations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    petId: uuid('pet_id').notNull(),
    vaccineName: varchar('vaccine_name', { length: 200 }).notNull(),
    vaccinatedAt: date('vaccinated_at').notNull(),
    nextDueDate: date('next_due_date'),
    remark: text('remark'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    petIdIdx: index('idx_vaccinations_pet_id').on(table.petId),
    nextDueIdx: index('idx_vaccinations_next_due_date').on(table.nextDueDate),
  })
)

// ============================================================
// 5. AI 对话记录表 (ai_conversations)
// ============================================================
export const aiConversations = pgTable(
  'ai_conversations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull(),
    petId: uuid('pet_id'),
    question: text('question').notNull(),
    answer: text('answer').notNull(),
    model: varchar('model', { length: 30 }).default('gpt-4o-mini'),
    tokensUsed: integer('tokens_used'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_ai_conversations_user_id').on(table.userId),
    createdAtIdx: index('idx_ai_conversations_created_at').on(table.createdAt),
    userDateIdx: index('idx_ai_conv_user_date').on(table.userId, table.createdAt),
  })
)

// ============================================================
// 6. 成长时间轴事件 (timeline_events)
// ============================================================
export const timelineEvents = pgTable(
  'timeline_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    petId: uuid('pet_id').notNull(),
    userId: uuid('user_id').notNull(),
    eventType: varchar('event_type', { length: 30 }).notNull(),
    title: varchar('title', { length: 200 }).notNull(),
    description: text('description'),
    photoUrl: text('photo_url'),
    eventDate: date('event_date').notNull(),
    isMilestone: boolean('is_milestone').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    petIdIdx: index('idx_timeline_pet_id').on(table.petId),
    eventDateIdx: index('idx_timeline_event_date').on(table.eventDate),
    petDateIdx: index('idx_timeline_pet_date').on(table.petId, table.eventDate.desc()),
  })
)
