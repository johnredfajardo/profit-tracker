export type Transaction = {
  id: string
  description: string
  amount: number
}

export type ProfitRecord = {
  id: string
  title: string
  description?: string
  date: string // ISO date string (YYYY-MM-DD)

  income: Transaction[]
  expenses: Transaction[]

  totalIncome: number
  totalExpenses: number
  profit: number

  createdAt: string // ISO datetime
  updatedAt: string // ISO datetime
}

export type Theme = 'light' | 'dark' | 'system'

export type SortKey = 'date' | 'profit' | 'income' | 'expenses' | 'title'
export type SortDirection = 'asc' | 'desc'

export type ImportMode = 'merge' | 'replace'

/** The editable shape used by the record form (before totals are derived). */
export type RecordDraft = {
  title: string
  description: string
  date: string
  income: Transaction[]
  expenses: Transaction[]
}
