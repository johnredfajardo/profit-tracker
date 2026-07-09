import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { HomeIcon, SettingsIcon, WalletIcon } from '@/components/ui/icons'

const navItems = [
  { to: '/', label: 'Records', icon: HomeIcon, end: true },
  { to: '/settings', label: 'Settings', icon: SettingsIcon, end: false },
]

export function AppLayout() {
  const { pathname } = useLocation()
  // Hide chrome on full-screen form/detail routes for a focused view.
  const immersive =
    pathname.startsWith('/record/') ||
    pathname === '/new' ||
    pathname.includes('/edit')

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {!immersive && (
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-slate-50/80 backdrop-blur-lg dark:border-slate-800/70 dark:bg-slate-950/80">
          <div className="mx-auto flex h-14 max-w-2xl items-center gap-2 px-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <WalletIcon className="text-lg" />
            </span>
            <span className="font-display text-base font-semibold tracking-tight">
              Profit Tracker
            </span>
          </div>
        </header>
      )}

      <main
        className={cn(
          'mx-auto max-w-2xl px-4',
          immersive ? 'pb-8 pt-4' : 'pb-28 pt-5',
        )}
      >
        <Outlet />
      </main>

      {!immersive && (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/70 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg dark:border-slate-800/70 dark:bg-slate-900/90">
          <div className="mx-auto flex max-w-2xl items-stretch">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors',
                    isActive
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300',
                  )
                }
              >
                <Icon className="text-xl" />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
