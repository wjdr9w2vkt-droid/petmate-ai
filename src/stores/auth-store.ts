import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  setAuth: (user: User | null, session: Session | null) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isLoading: true,
      setAuth: (user, session) => set({ user, session, isLoading: false }),
      clearAuth: () => set({ user: null, session: null, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'petmate-auth',
      // 只持久化 user 基本信息，session 通过 Supabase Cookie 管理
      partialize: (state) => ({
        user: state.user
          ? {
              id: state.user.id,
              email: state.user.email,
            }
          : null,
      }),
    }
  )
)
