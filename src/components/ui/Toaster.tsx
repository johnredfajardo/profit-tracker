import { useToastStore } from '@/hooks/useToast'
import type { ToastVariant } from '@/hooks/useToast'
import { cn } from '@/lib/cn'
import { AlertIcon, CheckIcon, CloseIcon } from './icons'

const config: Record<
  ToastVariant,
  { icon: typeof CheckIcon; accent: string }
> = {
  success: { icon: CheckIcon, accent: 'text-income' },
  error: { icon: AlertIcon, accent: 'text-expense' },
  info: { icon: AlertIcon, accent: 'text-brand-600 dark:text-brand-400' },
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-6">
      {toasts.map((t) => {
        const { icon: Icon, accent } = config[t.variant]
        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              'pointer-events-auto flex w-full max-w-sm animate-toast-in items-center gap-3 rounded-2xl',
              'border border-slate-200/80 bg-white/95 px-4 py-3 shadow-pop backdrop-blur',
              'dark:border-slate-700 dark:bg-slate-800/95',
            )}
          >
            <span className={cn('text-lg', accent)}>
              <Icon />
            </span>
            <p className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-100">
              {t.message}
            </p>
            <button
              aria-label="Dismiss"
              onClick={() => dismiss(t.id)}
              className="text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-slate-200"
            >
              <CloseIcon />
            </button>
          </div>
        )
      })}
    </div>
  )
}
