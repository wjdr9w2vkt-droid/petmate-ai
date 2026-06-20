import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ApiSettings {
  apiKey: string
  model: string
  baseUrl: string
}

interface ApiSettingsState extends ApiSettings {
  setApiKey: (key: string) => void
  setModel: (model: string) => void
  setBaseUrl: (url: string) => void
  setAll: (settings: ApiSettings) => void
  isConfigured: () => boolean
}

const DEFAULT_MODEL = 'deepseek-chat'
const DEFAULT_BASE_URL = 'https://api.deepseek.com'

export const useApiSettingsStore = create<ApiSettingsState>()(
  persist(
    (set, get) => ({
      apiKey: '',
      model: DEFAULT_MODEL,
      baseUrl: DEFAULT_BASE_URL,
      setApiKey: (apiKey) => set({ apiKey }),
      setModel: (model) => set({ model }),
      setBaseUrl: (baseUrl) => set({ baseUrl }),
      setAll: (settings) => set(settings),
      isConfigured: () => {
        const { apiKey } = get()
        return apiKey.length > 0
      },
    }),
    {
      name: 'petmate-api-settings',
    }
  )
)
