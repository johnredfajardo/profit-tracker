import type { ProfitRecord } from '@/types'

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  // Give the browser a tick to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function stamp(): string {
  return new Date().toISOString().slice(0, 10)
}

export function exportJSON(records: ProfitRecord[]): void {
  const payload = {
    app: 'profit-tracker',
    version: 1,
    exportedAt: new Date().toISOString(),
    records,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  triggerDownload(blob, `profit-tracker-${stamp()}.json`)
}

type FlatRow = {
  'Record ID': string
  Title: string
  'Record Description': string
  Date: string
  Type: 'income' | 'expense'
  'Entry Description': string
  Amount: number
  'Created At': string
  'Updated At': string
}

/** Flatten records so every income/expense entry is its own spreadsheet row. */
export function flattenRecords(records: ProfitRecord[]): FlatRow[] {
  const rows: FlatRow[] = []
  for (const record of records) {
    const base = {
      'Record ID': record.id,
      Title: record.title,
      'Record Description': record.description ?? '',
      Date: record.date,
      'Created At': record.createdAt,
      'Updated At': record.updatedAt,
    }
    const entries = [
      ...record.income.map((t) => ({ type: 'income' as const, t })),
      ...record.expenses.map((t) => ({ type: 'expense' as const, t })),
    ]
    if (entries.length === 0) {
      // Preserve empty records so they survive a round-trip.
      rows.push({
        ...base,
        Type: 'income',
        'Entry Description': '',
        Amount: 0,
      })
      continue
    }
    for (const entry of entries) {
      rows.push({
        ...base,
        Type: entry.type,
        'Entry Description': entry.t.description,
        Amount: entry.t.amount,
      })
    }
  }
  return rows
}

export async function exportSpreadsheet(
  records: ProfitRecord[],
  format: 'csv' | 'xlsx',
): Promise<void> {
  // Load the spreadsheet library on demand so it stays out of the main bundle.
  const XLSX = await import('xlsx')
  const rows = flattenRecords(records)
  const worksheet = XLSX.utils.json_to_sheet(rows)

  if (format === 'csv') {
    const csv = XLSX.utils.sheet_to_csv(worksheet)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    triggerDownload(blob, `profit-tracker-${stamp()}.csv`)
    return
  }

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions')
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  triggerDownload(blob, `profit-tracker-${stamp()}.xlsx`)
}
