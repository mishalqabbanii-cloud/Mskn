import type { ReactNode } from 'react'

import { cn } from '../utils/cn'

type FormFieldProps = {
  id: string
  label: string
  children: ReactNode
  required?: boolean
  error?: string
  hint?: string
  className?: string
}

const FormField = ({ id, label, children, required, error, hint, className }: FormFieldProps) => {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-xs font-medium text-slate-600" htmlFor={id}>
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-slate-400">{hint}</p> : null}
      {error ? <p className="text-xs text-rose-500">{error}</p> : null}
    </div>
  )
}

export default FormField

