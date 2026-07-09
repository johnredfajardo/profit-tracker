import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '@/components/ui/IconButton'
import { ChevronLeftIcon } from '@/components/ui/icons'

export function PageHeader({
  title,
  actions,
  onBack,
}: {
  title: string
  actions?: ReactNode
  onBack?: () => void
}) {
  const navigate = useNavigate()
  const back = onBack ?? (() => navigate(-1))

  return (
    <div className="mb-5 flex items-center gap-2">
      <IconButton
        label="Go back"
        onClick={back}
        className="-ml-1.5 border border-slate-200 dark:border-slate-700"
      >
        <ChevronLeftIcon />
      </IconButton>
      <h1 className="flex-1 truncate font-display text-lg font-semibold">
        {title}
      </h1>
      {actions && <div className="flex items-center gap-1">{actions}</div>}
    </div>
  )
}
