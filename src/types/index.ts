// ============================================================
// PetMate AI — 共享类型定义
// ============================================================

import type { Species, Gender } from '@/lib/constants'

// --- 用户 ---
export interface Profile {
  id: string
  displayName: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

// --- 宠物 ---
export interface Pet {
  id: string
  userId: string
  name: string
  species: Species
  breed: string | null
  gender: Gender
  birthday: string | null
  avatarUrl: string | null
  isNeutered: boolean
  createdAt: string
  updatedAt: string
}

// --- 成长记录 ---
export interface GrowthRecord {
  id: string
  petId: string
  recordedAt: string
  weight: string | null
  foodNote: string | null
  waterNote: string | null
  exerciseNote: string | null
  remark: string | null
  photoUrl: string | null
  createdAt: string
  updatedAt: string
}

// --- 疫苗 ---
export interface Vaccination {
  id: string
  petId: string
  vaccineName: string
  vaccinatedAt: string
  nextDueDate: string | null
  remark: string | null
  createdAt: string
  updatedAt: string
}

// --- AI 对话 ---
export interface AiConversation {
  id: string
  userId: string
  petId: string | null
  question: string
  answer: string
  model: string | null
  tokensUsed: number | null
  createdAt: string
}

// --- AI 聊天消息（前端用） ---
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

// --- Dashboard 聚合数据 ---
export interface PetDashboard {
  petId: string
  petName: string
  species: Species
  birthday: string | null
  avatarUrl: string | null
  ageYears: number | null
  latestWeight: string | null
  lastRecordDate: string | null
  nextVaccineDue: string | null
  daysUntilVaccine: number | null
}
