/** Currencies offered in Settings. Symbol is used for compact display. */
export const CURRENCIES: Record<string, { label: string; locale: string }> = {
  PHP: { label: 'Philippine Peso (₱)', locale: 'en-PH' },
  USD: { label: 'US Dollar ($)', locale: 'en-US' },
  EUR: { label: 'Euro (€)', locale: 'en-IE' },
  GBP: { label: 'British Pound (£)', locale: 'en-GB' },
  JPY: { label: 'Japanese Yen (¥)', locale: 'ja-JP' },
  AUD: { label: 'Australian Dollar (A$)', locale: 'en-AU' },
  CAD: { label: 'Canadian Dollar (C$)', locale: 'en-CA' },
  SGD: { label: 'Singapore Dollar (S$)', locale: 'en-SG' },
  INR: { label: 'Indian Rupee (₹)', locale: 'en-IN' },
}

export function formatCurrency(amount: number, currency = 'PHP'): string {
  const config = CURRENCIES[currency] ?? CURRENCIES.PHP
  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(Number.isFinite(amount) ? amount : 0)
  } catch {
    return `${amount.toFixed(2)}`
  }
}

/** Signed currency, e.g. "+₱1,200.00" / "−₱300.00". Used for profit figures. */
export function formatSignedCurrency(amount: number, currency = 'PHP'): string {
  const formatted = formatCurrency(Math.abs(amount), currency)
  if (amount > 0) return `+${formatted}`
  if (amount < 0) return `−${formatted}`
  return formatted
}

export function formatDate(iso: string): string {
  const date = new Date(iso.length <= 10 ? `${iso}T00:00:00` : iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatShortDate(iso: string): string {
  const date = new Date(iso.length <= 10 ? `${iso}T00:00:00` : iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Today's date as YYYY-MM-DD in the local timezone. */
export function todayISO(): string {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}
