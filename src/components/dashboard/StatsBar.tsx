import type { Stats } from '@/lib/stats'
import { Money } from '@/components/ui/Money'
import { cn } from '@/lib/cn'

export function StatsBar({ stats }: { stats: Stats }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Net profit
          </p>
          <Money
            amount={stats.totalProfit}
            tone="profit"
            signed
            className="mt-0.5 block text-3xl font-semibold"
          />
        </div>
        <p className="text-right text-xs text-slate-400 dark:text-slate-500">
          {stats.count} {stats.count === 1 ? 'record' : 'records'}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Metric label="Income" amount={stats.totalIncome} tone="income" />
        <Metric label="Expenses" amount={stats.totalExpenses} tone="expense" />
      </div>
    </div>
  )
}

function Metric({
  label,
  amount,
  tone,
}: {
  label: string
  amount: number
  tone: 'income' | 'expense'
}) {
  return (
    <div
      className={cn(
        'rounded-xl px-3 py-2.5',
        tone === 'income'
          ? 'bg-income-light dark:bg-income/10'
          : 'bg-expense-light dark:bg-expense/10',
      )}
    >
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <Money amount={amount} tone={tone} className="mt-0.5 block text-lg font-semibold" />
    </div>
  )
}
