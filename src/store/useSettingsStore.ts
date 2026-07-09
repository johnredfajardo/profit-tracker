import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SortDirection, SortKey, Theme } from '@/types'

type SettingsState = {
  theme: Theme
  currency: string
  sortKey: SortKey
  sortDirection: SortDirection
  setTheme: (theme: Theme) => void
  setCurrency: (currency: string) => void
  setSort: (key: SortKey, direction: SortDirection) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      currency: 'PHP',
      sortKey: 'date',
      sortDirection: 'desc',
      setTheme: (theme) => set({ theme }),
      setCurrency: (currency) => set({ currency }),
      setSort: (sortKey, sortDirection) => set({ sortKey, sortDirection }),
    }),
    {
      // Key must match the inline theme bootstrap in index.html.
      name: 'profit-tracker-settings',
      version: 1,
    },
  ),
)
