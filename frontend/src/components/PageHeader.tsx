import type { ReactNode } from 'react'

import { cn } from '../utils/cn'

type PageHeaderProps = {
  title: string
  subtitle?: string
  actions?: ReactNode
  className?: string
}

const PageHeader = ({ title, subtitle, actions, className }: PageHeaderProps) => {
  return (
    <div className={cn('flex flex-col gap-3 md:flex-row md:items-center md:justify-between', className)}>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export default PageHeader

