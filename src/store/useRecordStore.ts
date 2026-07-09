import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { buildRecord } from '@/lib/calculations'
import { uid } from '@/lib/id'
import type { ImportMode, ProfitRecord, RecordDraft } from '@/types'

type RecordState = {
  records: ProfitRecord[]
  createRecord: (draft: RecordDraft) => ProfitRecord
  updateRecord: (id: string, draft: RecordDraft) => void
  deleteRecord: (id: string) => void
  duplicateRecord: (id: string) => ProfitRecord | undefined
  getRecord: (id: string) => ProfitRecord | undefined
  importRecords: (incoming: ProfitRecord[], mode: ImportMode) => number
  clearAll: () => void
}

export const useRecordStore = create<RecordState>()(
  persist(
    (set, get) => ({
      records: [],

      createRecord: (draft) => {
        const record = buildRecord(draft)
        set((state) => ({ records: [record, ...state.records] }))
        return record
      },

      updateRecord: (id, draft) => {
        set((state) => ({
          records: state.records.map((record) =>
            record.id === id
              ? buildRecord(draft, { id: record.id, createdAt: record.createdAt })
              : record,
          ),
        }))
      },

      deleteRecord: (id) => {
        set((state) => ({
          records: state.records.filter((record) => record.id !== id),
        }))
      },

      duplicateRecord: (id) => {
        const original = get().records.find((record) => record.id === id)
        if (!original) return undefined
        const now = new Date().toISOString()
        const copy: ProfitRecord = {
          ...original,
          id: uid(),
          title: `${original.title} (copy)`,
          income: original.income.map((t) => ({ ...t, id: uid() })),
          expenses: original.expenses.map((t) => ({ ...t, id: uid() })),
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({ records: [copy, ...state.records] }))
        return copy
      },

      getRecord: (id) => get().records.find((record) => record.id === id),

      importRecords: (incoming, mode) => {
        if (mode === 'replace') {
          set({ records: incoming })
          return incoming.length
        }
        // Merge: imported records override existing ones with the same id.
        const map = new Map<string, ProfitRecord>()
        for (const record of get().records) map.set(record.id, record)
        for (const record of incoming) map.set(record.id, record)
        const merged = [...map.values()].sort(
          (a, b) => b.date.localeCompare(a.date),
        )
        set({ records: merged })
        return incoming.length
      },

      clearAll: () => set({ records: [] }),
    }),
    {
      name: 'profit-tracker-records',
      version: 1,
    },
  ),
)
