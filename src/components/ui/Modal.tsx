import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { IconButton } from './IconButton'
import { CloseIcon } from './icons'

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative z-10 w-full max-w-md animate-slide-up rounded-t-3xl bg-white p-5 shadow-pop',
          'sm:rounded-3xl dark:bg-slate-900',
          className,
        )}
      >
        {title && (
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </h2>
            <IconButton label="Close" onClick={onClose} className="-mr-1 -mt-1">
              <CloseIcon />
            </IconButton>
          </div>
        )}
        <div>{children}</div>
        {footer && <div className="mt-6 flex gap-3">{footer}</div>}
      </div>
    </div>
  )
}
