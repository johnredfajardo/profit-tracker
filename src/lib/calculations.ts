import { uid } from '@/lib/id'
import type { ProfitRecord, RecordDraft, Transaction } from '@/types'

/** Sum the amounts of a list of transactions, ignoring NaN values. */
export function sumTransactions(items: Transaction[]): number {
  return items.reduce((total, item) => {
    const amount = Number(item.amount)
    return total + (Number.isFinite(amount) ? amount : 0)
  }, 0)
}

export type RecordTotals = {
  totalIncome: number
  totalExpenses: number
  profit: number
}

/** Derive income/expense totals and net profit from a draft or record. */
export function deriveTotals(input: {
  income: Transaction[]
  expenses: Transaction[]
}): RecordTotals {
  const totalIncome = sumTransactions(input.income)
  const totalExpenses = sumTransactions(input.expenses)
  return {
    totalIncome,
    totalExpenses,
    profit: totalIncome - totalExpenses,
  }
}

/** Clean a draft's transactions: keep only rows that have a description or amount. */
function cleanTransactions(items: Transaction[]): Transaction[] {
  return items
    .map((item) => ({
      ...item,
      description: item.description.trim(),
      amount: Number.isFinite(Number(item.amount)) ? Number(item.amount) : 0,
    }))
    .filter((item) => item.description !== '' || item.amount !== 0)
}

/** Build a full ProfitRecord from a draft, computing totals and timestamps. */
export function buildRecord(
  draft: RecordDraft,
  base?: Pick<ProfitRecord, 'id' | 'createdAt'>,
): ProfitRecord {
  const now = new Date().toISOString()
  const income = cleanTransactions(draft.income)
  const expenses = cleanTransactions(draft.expenses)
  const totals = deriveTotals({ income, expenses })

  return {
    id: base?.id ?? uid(),
    title: draft.title.trim() || 'Untitled record',
    description: draft.description.trim() || undefined,
    date: draft.date,
    income,
    expenses,
    ...totals,
    createdAt: base?.createdAt ?? now,
    updatedAt: now,
  }
}
