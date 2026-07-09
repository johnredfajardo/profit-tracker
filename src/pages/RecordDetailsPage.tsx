import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecordStore } from '@/store/useRecordStore'
import { toast } from '@/hooks/useToast'
import type { ProfitRecord, Transaction } from '@/types'
import { formatDate } from '@/lib/format'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { IconButton } from '@/components/ui/IconButton'
import { Money } from '@/components/ui/Money'
import { CopyIcon, EditIcon, TrashIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'

export function RecordDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const record = useRecordStore((s) => (id ? s.getRecord(id) : undefined))
  const deleteRecord = useRecordStore((s) => s.deleteRecord)
  const duplicateRecord = useRecordStore((s) => s.duplicateRecord)
  const [confirming, setConfirming] = useState(false)

  if (!record) {
    return (
      <div>
        <PageHeader title="Record" onBack={() => navigate('/')} />
        <EmptyState
          title="Record not found"
          description="This record may have been deleted."
          action={<Button onClick={() => navigate('/')}>Back to records</Button>}
        />
      </div>
    )
  }

  const handleDuplicate = () => {
    const copy = duplicateRecord(record.id)
    toast.success('Record duplicated')
    if (copy) navigate(`/record/${copy.id}`)
  }

  const handleDelete = () => {
    deleteRecord(record.id)
    toast.success('Record deleted')
    navigate('/')
  }

  return (
    <div>
      <PageHeader
        title={record.title}
        onBack={() => navigate('/')}
        actions={
          <>
            <IconButton
              label="Edit record"
              onClick={() => navigate(`/record/${record.id}/edit`)}
            >
              <EditIcon />
            </IconButton>
            <IconButton label="Duplicate record" onClick={handleDuplicate}>
              <CopyIcon />
            </IconButton>
            <IconButton
              label="Delete record"
              tone="danger"
              onClick={() => setConfirming(true)}
            >
              <TrashIcon />
            </IconButton>
          </>
        }
      />

      <div className="space-y-5">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {formatDate(record.date)}
          </p>
          {record.description && (
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {record.description}
            </p>
          )}
        </div>

        <ProfitBanner record={record} />

        <Ledger
          title="Income"
          tone="income"
          items={record.income}
          total={record.totalIncome}
          totalLabel="Total income"
        />

        <Ledger
          title="Expenses"
          tone="expense"
          items={record.expenses}
          total={record.totalExpenses}
          totalLabel="Total expenses"
        />

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => navigate(`/record/${record.id}/edit`)}
          >
            <EditIcon />
            Edit
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={() => setConfirming(true)}
          >
            <TrashIcon />
            Delete
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Delete record?"
        message={`"${record.title}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setConfirming(false)}
      />
    </div>
  )
}

function ProfitBanner({ record }: { record: ProfitRecord }) {
  return (
    <div className="rounded-2xl bg-slate-900 p-5 text-white dark:bg-slate-800">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        Net profit
      </p>
      <Money
        amount={record.profit}
        tone="profit"
        signed
        className="mt-1 block text-3xl font-semibold"
      />
      <div className="mt-4 flex gap-6 text-sm">
        <span className="text-slate-300">
          Income{' '}
          <Money
            amount={record.totalIncome}
            className="font-semibold text-income-dark"
          />
        </span>
        <span className="text-slate-300">
          Expenses{' '}
          <Money
            amount={record.totalExpenses}
            className="font-semibold text-expense-dark"
          />
        </span>
      </div>
    </div>
  )
}

function Ledger({
  title,
  tone,
  items,
  total,
  totalLabel,
}: {
  title: string
  tone: 'income' | 'expense'
  items: Transaction[]
  total: number
  totalLabel: string
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <span
          className={cn(
            'h-2.5 w-2.5 rounded-full',
            tone === 'income' ? 'bg-income' : 'bg-expense',
          )}
        />
        <h2 className="font-display text-sm font-semibold">{title}</h2>
      </div>

      {items.length === 0 ? (
        <p className="px-4 py-5 text-sm text-slate-400 dark:text-slate-500">
          No {title.toLowerCase()} entries.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 px-4 py-2.5"
            >
              <span className="min-w-0 truncate text-sm text-slate-700 dark:text-slate-200">
                {item.description || (
                  <span className="italic text-slate-400">No description</span>
                )}
              </span>
              <Money amount={item.amount} tone={tone} className="text-sm" />
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/40">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {totalLabel}
        </span>
        <Money amount={total} tone={tone} className="text-sm font-semibold" />
      </div>
    </section>
  )
}
