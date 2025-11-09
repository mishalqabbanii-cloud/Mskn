import { useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { useI18n } from '../../i18n'
import { cn } from '../../utils/cn'

type NavItem = {
  to: string
  labelKey: string
}

const AppLayout = () => {
  const { t } = useI18n()
  const { user, logout } = useAuth()
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navItems: NavItem[] = useMemo(
    () => [
      { to: '/dashboard', labelKey: 'nav.dashboard' },
      { to: '/properties', labelKey: 'nav.properties' },
      { to: '/tenants', labelKey: 'nav.tenants' },
      { to: '/owners', labelKey: 'nav.owners' },
      { to: '/contracts', labelKey: 'nav.contracts' },
      { to: '/maintenance', labelKey: 'nav.maintenance' },
      { to: '/settings', labelKey: 'nav.settings' },
    ],
    [],
  )

  const handleLogout = () => {
    logout()
    navigate('/auth/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-72 border-s border-slate-200 bg-white px-6 py-8 transition md:static md:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-brand">{t('app.name')}</div>
            <div className="text-xs text-slate-500">{t('app.tagline')}</div>
          </div>
          <button
            type="button"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label={t('app.closeMenu')}
          >
            ✕
          </button>
        </div>
        <nav className="mt-8 flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-brand-muted hover:text-brand',
                  isActive ? 'bg-brand text-white hover:text-white' : 'text-slate-600',
                )
              }
              onClick={() => setSidebarOpen(false)}
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col md:pl-0">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 md:hidden"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              {t('app.menu')}
            </button>
            <div>
              <p className="text-xs text-slate-500">
                {location.pathname === '/dashboard' ? t('app.description') : t('app.tagline')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <div className="text-xs text-slate-500">
                  {user.firstName} {user.lastName} • {t(`roles.${user.role}`)}
                </div>
              ) : null}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-rose-300 hover:text-rose-600"
              >
                {t('nav.logout')}
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout

