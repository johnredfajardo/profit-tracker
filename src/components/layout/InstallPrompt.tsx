import { useState } from 'react'
import { useInstallPrompt } from '@/hooks/useInstallPrompt'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { CloseIcon, DownloadIcon } from '@/components/ui/icons'

export function InstallPrompt() {
  const { canInstall, promptInstall } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(false)

  if (!canInstall || dismissed) return null

  return (
    <div className="mb-4 flex items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-3 dark:border-brand-500/30 dark:bg-brand-500/10">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-lg text-white">
        <DownloadIcon />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          Install Profit Tracker
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Add it to your home screen for offline access.
        </p>
      </div>
      <Button size="sm" onClick={promptInstall}>
        Install
      </Button>
      <IconButton
        label="Dismiss"
        onClick={() => setDismissed(true)}
        className="shrink-0"
      >
        <CloseIcon />
      </IconButton>
    </div>
  )
}
