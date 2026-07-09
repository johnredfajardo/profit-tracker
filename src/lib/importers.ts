import { deriveTotals } from '@/lib/calculations'
import { uid } from '@/lib/id'
import { normalizeRecords } from '@/lib/normalize'
import type { ProfitRecord, Transaction } from '@/types'

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('Could not read the file.'))
    reader.readAsText(file)
  })
}

function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = () => reject(new Error('Could not read the file.'))
    reader.readAsArrayBuffer(file)
  })
}

export async function parseJSONFile(file: File): Promise<ProfitRecord[]> {
  const text = await readFileAsText(file)
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('That file is not valid JSON.')
  }
  // Accept either a bare array of records or our export wrapper { records }.
  const source =
    Array.isArray(parsed) ? parsed : (parsed as { records?: unknown })?.records
  const records = normalizeRecords(source)
  if (records.length === 0) {
    throw new Error('No records were found in that file.')
  }
  return records
}

type RawRow = Record<string, unknown>

function pick(row: RawRow, ...keys: string[]): string {
  for (const key of keys) {
    const value = row[key]
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value).trim()
    }
  }
  return ''
}

/** Rebuild records from the flat rows produced by exportSpreadsheet. */
export async function parseSpreadsheetFile(file: File): Promise<ProfitRecord[]> {
  const XLSX = await import('xlsx')
  const buffer = await readFileAsArrayBuffer(file)
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) throw new Error('That spreadsheet has no sheets.')
  const rows = XLSX.utils.sheet_to_json<RawRow>(workbook.Sheets[sheetName], {
    defval: '',
  })
  if (rows.length === 0) throw new Error('That spreadsheet is empty.')

  const grouped = new Map<
    string,
    {
      record: Omit<ProfitRecord, 'income' | 'expenses' | keyof ReturnType<typeof deriveTotals>>
      income: Transaction[]
      expenses: Transaction[]
    }
  >()

  for (const row of rows) {
    const recordId = pick(row, 'Record ID', 'recordId', 'id') || uid()
    const title = pick(row, 'Title', 'title') || 'Untitled record'
    const date =
      pick(row, 'Date', 'date') || new Date().toISOString().slice(0, 10)

    if (!grouped.has(recordId)) {
      const now = new Date().toISOString()
      grouped.set(recordId, {
        record: {
          id: recordId,
          title,
          description: pick(row, 'Record Description', 'description') || undefined,
          date,
          createdAt: pick(row, 'Created At', 'createdAt') || now,
          updatedAt: pick(row, 'Updated At', 'updatedAt') || now,
        },
        income: [],
        expenses: [],
      })
    }

    const group = grouped.get(recordId)!
    const type = pick(row, 'Type', 'type').toLowerCase()
    const description = pick(row, 'Entry Description', 'entryDescription')
    const amountRaw = pick(row, 'Amount', 'amount')
    const amount = Number(amountRaw.replace(/[^0-9.-]/g, ''))

    if (description === '' && (!Number.isFinite(amount) || amount === 0)) {
      continue // spacer row for an empty record
    }

    const transaction: Transaction = {
      id: uid(),
      description,
      amount: Number.isFinite(amount) ? amount : 0,
    }
    if (type === 'expense') group.expenses.push(transaction)
    else group.income.push(transaction)
  }

  const records: ProfitRecord[] = [...grouped.values()].map((group) => ({
    ...group.record,
    income: group.income,
    expenses: group.expenses,
    ...deriveTotals({ income: group.income, expenses: group.expenses }),
  }))

  if (records.length === 0) {
    throw new Error('No records could be read from that spreadsheet.')
  }
  return records
}

/** Detect format by extension and parse accordingly. */
export async function parseImportFile(file: File): Promise<ProfitRecord[]> {
  const name = file.name.toLowerCase()
  if (name.endsWith('.json')) return parseJSONFile(file)
  if (name.endsWith('.csv') || name.endsWith('.xlsx') || name.endsWith('.xls')) {
    return parseSpreadsheetFile(file)
  }
  // Fall back to sniffing content: try JSON first, then spreadsheet.
  try {
    return await parseJSONFile(file)
  } catch {
    return parseSpreadsheetFile(file)
  }
}
