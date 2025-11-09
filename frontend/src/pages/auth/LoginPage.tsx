import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import Card from '../../components/Card'
import FormField from '../../components/FormField'
import { useToast } from '../../components/ToastProvider'
import { getRoleDashboardPath, useAuth } from '../../context/AuthContext'
import { useI18n } from '../../i18n'
import logo from '../../assets/mskn-logo.svg'

type FormState = {
  email: string
  password: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const inputClass =
  'w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3.5 text-base font-medium text-slate-700 shadow-sm transition focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20 placeholder:text-slate-400'

const emailRegex = /\S+@\S+\.\S+/

const LoginPage = () => {
  const { t } = useI18n()
  const { login, status } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation() as { state?: { registered?: boolean } }

  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [formError, setFormError] = useState<string | null>(null)

  const validate = () => {
    const validationErrors: FormErrors = {}
    if (!formState.email.trim()) {
      validationErrors.email = t('forms.required')
    } else if (!emailRegex.test(formState.email)) {
      validationErrors.email = t('forms.invalidEmail')
    }

    if (!formState.password.trim()) {
      validationErrors.password = t('forms.required')
    }

    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    if (!validate()) {
      return
    }

    try {
      const user = await login({
        email: formState.email,
        password: formState.password,
      })
      showToast(t('messages.successLogin'))
      navigate(getRoleDashboardPath(user.role), { replace: true })
    } catch (error) {
      console.warn('Mock login failed', error)
      setFormError(t('messages.loginFailed'))
    }
  }

  const registeredSuccessfully = location.state?.registered

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-slate-100 to-slate-200 px-4 py-12">
      <div className="relative w-full max-w-lg">
        <div className="absolute -top-12 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-b from-[#0EA5E9] to-[#0B74DE] shadow-2xl shadow-sky-200/50">
            <img src={logo} alt={t('app.name')} className="h-14 w-14" />
          </div>
        </div>
        <Card className="pt-16 shadow-xl" bodyClassName="px-10 pb-12">
          <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold text-slate-900">{t('auth.login.title')}</h1>
          <p className="mt-2 text-sm text-slate-500">
            {registeredSuccessfully ? t('messages.successRegister') : t('auth.login.subtitle')}
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {formError ? (
            <div className="rounded-2xl border border-[#F87171] bg-[#FEE2E2] px-5 py-4 text-sm font-medium text-[#B91C1C] shadow-sm">
              {formError}
            </div>
          ) : null}

          <FormField id="email" label={t('auth.login.email')} required error={errors.email}>
            <input
              id="email"
              className={inputClass}
              type="email"
              autoComplete="email"
              value={formState.email}
              onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
            />
          </FormField>

          <FormField id="password" label={t('auth.login.password')} required error={errors.password}>
            <input
              id="password"
              className={inputClass}
              type="password"
              autoComplete="current-password"
              value={formState.password}
              onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
            />
          </FormField>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-[#0B74DE] px-4 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[#095bb2] focus:outline-none focus:ring-4 focus:ring-[#0B74DE]/30 disabled:opacity-60"
          >
            {status === 'loading' ? t('auth.login.processing') : t('actions.login')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          {t('auth.login.noAccount')}{' '}
          <Link to="/auth/register" className="font-semibold text-brand hover:underline">
            {t('auth.login.registerLink')}
          </Link>
        </div>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage

