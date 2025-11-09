type KpiCardProps = {
  label: string
  value: string | number
  helperText?: string
  accent?: 'brand' | 'success' | 'warning' | 'neutral'
}

const accentClasses: Record<NonNullable<KpiCardProps['accent']>, string> = {
  brand: 'border-brand/20 bg-brand-muted text-brand',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-600',
  warning: 'border-amber-200 bg-amber-50 text-amber-600',
  neutral: 'border-slate-200 bg-slate-50 text-slate-600',
}

const KpiCard = ({ label, value, helperText, accent = 'brand' }: KpiCardProps) => {
  const classes = accentClasses[accent] ?? accentClasses.brand
  return (
    <div className={`rounded-xl border px-4 py-5 shadow-sm ${classes}`}>
      <div className="text-xs font-medium">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {helperText ? <div className="mt-1 text-xs text-slate-600">{helperText}</div> : null}
    </div>
  )
}

export default KpiCard

