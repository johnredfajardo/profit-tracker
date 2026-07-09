import type { ProfitRecord, SortDirection, SortKey } from '@/types'

export type Stats = {
  totalIncome: number
  totalExpenses: number
  totalProfit: number
  count: number
}

/** Aggregate totals across every record for the dashboard summary. */
export function computeStats(records: ProfitRecord[]): Stats {
  return records.reduce<Stats>(
    (acc, record) => ({
      totalIncome: acc.totalIncome + record.totalIncome,
      totalExpenses: acc.totalExpenses + record.totalExpenses,
      totalProfit: acc.totalProfit + record.profit,
      count: acc.count + 1,
    }),
    { totalIncome: 0, totalExpenses: 0, totalProfit: 0, count: 0 },
  )
}

const SORT_VALUE: Record<SortKey, (r: ProfitRecord) => number | string> = {
  date: (r) => r.date,
  profit: (r) => r.profit,
  income: (r) => r.totalIncome,
  expenses: (r) => r.totalExpenses,
  title: (r) => r.title.toLowerCase(),
}

export type DateRange = { from: string; to: string }

/** Filter by free-text query and an optional inclusive date range. */
export function filterRecords(
  records: ProfitRecord[],
  query: string,
  range?: Partial<DateRange>,
): ProfitRecord[] {
  const q = query.trim().toLowerCase()
  return records.filter((record) => {
    const recordDate = record.date.slice(0, 10)
    if (range?.from && recordDate < range.from) return false
    if (range?.to && recordDate > range.to) return false
    if (!q) return true
    const haystack = [
      record.title,
      record.description ?? '',
      ...record.income.map((t) => t.description),
      ...record.expenses.map((t) => t.description),
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}

export function sortRecords(
  records: ProfitRecord[],
  key: SortKey,
  direction: SortDirection,
): ProfitRecord[] {
  const getValue = SORT_VALUE[key]
  const factor = direction === 'asc' ? 1 : -1
  return [...records].sort((a, b) => {
    const av = getValue(a)
    const bv = getValue(b)
    if (av < bv) return -1 * factor
    if (av > bv) return 1 * factor
    // Stable tiebreaker so equal values keep a predictable order.
    return a.createdAt < b.createdAt ? 1 : -1
  })
}
