import type { ReactNode } from 'react'

import { cn } from '../utils/cn'

type CardProps = {
  title?: string
  description?: string
  footer?: ReactNode
  actions?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}

const Card = ({
  title,
  description,
  actions,
  footer,
  children,
  className,
  bodyClassName,
}: CardProps) => {
  return (
    <section className={cn('overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm', className)}>
      {(title || actions) && (
        <header className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            {title ? <h2 className="text-lg font-semibold text-slate-900">{title}</h2> : null}
            {description ? <p className="text-xs text-slate-500">{description}</p> : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
      )}
      <div className={cn('px-5 py-5', bodyClassName)}>{children}</div>
      {footer ? <footer className="border-t border-slate-100 px-5 py-4">{footer}</footer> : null}
    </section>
  )
}

export default Card

