import { useSettingsStore } from '@/store/useSettingsStore'
import { formatCurrency, formatSignedCurrency } from '@/lib/format'
import { cn } from '@/lib/cn'

type Tone = 'income' | 'expense' | 'profit' | 'neutral'

type MoneyProps = {
  amount: number
  tone?: Tone
  signed?: boolean
  className?: string
}

/**
 * Renders a currency figure with tabular numerals so columns align like a
 * ledger. Profit tone flips green/red based on the sign.
 */
export function Money({ amount, tone = 'neutral', signed, className }: MoneyProps) {
  const currency = useSettingsStore((s) => s.currency)
  const text = signed
    ? formatSignedCurrency(amount, currency)
    : formatCurrency(amount, currency)

  const color =
    tone === 'income'
      ? 'text-income dark:text-income-dark'
      : tone === 'expense'
        ? 'text-expense dark:text-expense-dark'
        : tone === 'profit'
          ? amount >= 0
            ? 'text-income dark:text-income-dark'
            : 'text-expense dark:text-expense-dark'
          : 'text-slate-900 dark:text-slate-100'

  return (
    <span className={cn('font-mono tabular-nums tracking-tight', color, className)}>
      {text}
    </span>
  )
}
