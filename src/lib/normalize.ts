import { deriveTotals } from '@/lib/calculations'
import { uid } from '@/lib/id'
import type { ProfitRecord, Transaction } from '@/types'

function normalizeTransactions(value: unknown): Transaction[] {
  if (!Array.isArray(value)) return []
  return value
    .map((raw) => {
      const item = (raw ?? {}) as Record<string, unknown>
      const amount = Number(item.amount)
      return {
        id: typeof item.id === 'string' ? item.id : uid(),
        description: String(item.description ?? '').trim(),
        amount: Number.isFinite(amount) ? amount : 0,
      }
    })
    .filter((t) => t.description !== '' || t.amount !== 0)
}

/**
 * Coerce arbitrary parsed data into valid ProfitRecords. Totals are always
 * recomputed from the transactions so imported files can't carry stale numbers.
 * Returns only records that have at least a title or some transactions.
 */
export function normalizeRecords(value: unknown): ProfitRecord[] {
  if (!Array.isArray(value)) return []
  const now = new Date().toISOString()

  return value
    .map((raw): ProfitRecord | null => {
      if (!raw || typeof raw !== 'object') return null
      const item = raw as Record<string, unknown>

      const income = normalizeTransactions(item.income)
      const expenses = normalizeTransactions(item.expenses)
      const title = String(item.title ?? '').trim()

      if (!title && income.length === 0 && expenses.length === 0) return null

      const totals = deriveTotals({ income, expenses })
      const date =
        typeof item.date === 'string' && item.date ? item.date : now.slice(0, 10)

      return {
        id: typeof item.id === 'string' && item.id ? item.id : uid(),
        title: title || 'Untitled record',
        description:
          typeof item.description === 'string' && item.description.trim()
            ? item.description.trim()
            : undefined,
        date,
        income,
        expenses,
        ...totals,
        createdAt:
          typeof item.createdAt === 'string' && item.createdAt
            ? item.createdAt
            : now,
        updatedAt:
          typeof item.updatedAt === 'string' && item.updatedAt
            ? item.updatedAt
            : now,
      }
    })
    .filter((record): record is ProfitRecord => record !== null)
}
