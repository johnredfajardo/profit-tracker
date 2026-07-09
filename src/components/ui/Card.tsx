import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean
  as?: 'div' | 'button'
}

export function Card({ interactive, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white shadow-card',
        'dark:border-slate-800 dark:bg-slate-900',
        interactive &&
          'cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-pop focus-within:-translate-y-0.5',
        className,
      )}
      {...props}
    />
  )
}
