import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Card from '../../components/Card'
import FormField from '../../components/FormField'
import { useToast } from '../../components/ToastProvider'
import { useAuth } from '../../context/AuthContext'
import { useMockData } from '../../context/MockDataContext'
import { useI18n } from '../../i18n'
import { linkUserProfile, type RegisterUserInput, type UserRole } from '../../mock/mockDb'

type FormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: UserRole
  password: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30'

const emailRegex = /\S+@\S+\.\S+/

const RegisterPage = () => {
  const { t } = useI18n()
  const { register } = useAuth()
  const { addOwner, addTenant } = useMockData()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [formState, setFormState] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'tenant',
    password: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const validationErrors: FormErrors = {}

    if (!formState.firstName.trim()) {
      validationErrors.firstName = t('forms.required')
    }
    if (!formState.lastName.trim()) {
      validationErrors.lastName = t('forms.required')
    }
    if (!formState.email.trim()) {
      validationErrors.email = t('forms.required')
    } else if (!emailRegex.test(formState.email)) {
      validationErrors.email = t('forms.invalidEmail')
    }
    const sanitizedPhone = formState.phone.replace(/\D/g, '')
    if (!sanitizedPhone) {
      validationErrors.phone = t('forms.required')
    } else if (sanitizedPhone.length < 9 || sanitizedPhone.length > 12) {
      validationErrors.phone = t('forms.invalidPhone')
    }

    if (!formState.role) {
      validationErrors.role = t('forms.required')
    }

    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    const payload: RegisterUserInput = {
      firstName: formState.firstName,
      lastName: formState.lastName,
      email: formState.email,
      phone: formState.phone,
      role: formState.role,
      password: formState.password || '123456',
    }

    try {
      const registeredUser = await register(payload)
      if (formState.role === 'owner') {
        const owner = addOwner({
          name: `${formState.firstName} ${formState.lastName}`,
          phone: formState.phone,
          email: formState.email,
          notes: 'Owner created from the mock registration form.',
        })
        linkUserProfile(registeredUser.id, owner.id)
      }

      if (formState.role === 'tenant') {
        const tenant = addTenant({
          name: `${formState.firstName} ${formState.lastName}`,
          phone: formState.phone,
          email: formState.email,
          workplace: undefined,
          notes: 'Tenant created from the mock registration form.',
        })
        linkUserProfile(registeredUser.id, tenant.id)
      }

      showToast(t('messages.successRegister'))
      navigate('/auth/login', { replace: true, state: { registered: true } })
    } catch (error) {
      console.warn('Mock register failed', error)
      showToast(t('messages.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4 py-12">
      <Card className="w-full max-w-2xl" title={t('auth.register.title')} description={t('auth.register.subtitle')}>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <FormField id="firstName" label={t('auth.register.firstName')} required error={errors.firstName}>
            <input
              id="firstName"
              className={inputClass}
              value={formState.firstName}
              onChange={(event) => setFormState((prev) => ({ ...prev, firstName: event.target.value }))}
            />
          </FormField>

          <FormField id="lastName" label={t('auth.register.lastName')} required error={errors.lastName}>
            <input
              id="lastName"
              className={inputClass}
              value={formState.lastName}
              onChange={(event) => setFormState((prev) => ({ ...prev, lastName: event.target.value }))}
            />
          </FormField>

          <FormField
            id="email"
            label={t('auth.register.email')}
            required
            error={errors.email}
            className="md:col-span-2"
          >
            <input
              id="email"
              className={inputClass}
              type="email"
              autoComplete="email"
              value={formState.email}
              onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
            />
          </FormField>

          <FormField id="phone" label={t('auth.register.phone')} required error={errors.phone}>
            <input
              id="phone"
              className={inputClass}
              value={formState.phone}
              onChange={(event) => setFormState((prev) => ({ ...prev, phone: event.target.value }))}
              placeholder="+9665xxxxxxx"
            />
          </FormField>

          <FormField id="role" label={t('auth.register.role')} required error={errors.role}>
            <select
              id="role"
              className={inputClass}
              value={formState.role}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, role: event.target.value as UserRole }))
              }
            >
              <option value="tenant">{t('roles.tenant')}</option>
              <option value="owner">{t('roles.owner')}</option>
              <option value="manager">{t('roles.manager')}</option>
            </select>
          </FormField>

          <FormField
            id="password"
            label={t('auth.register.password')}
            hint={t('forms.passwordHint')}
            error={errors.password}
          >
            <input
              id="password"
              className={inputClass}
              type="password"
              autoComplete="new-password"
              value={formState.password}
              onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
              placeholder="123456"
            />
          </FormField>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand/90 disabled:opacity-60"
            >
              {isSubmitting ? 'جارٍ المعالجة...' : t('actions.register')}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {t('auth.register.hasAccount')}{' '}
          <Link to="/auth/login" className="font-semibold text-brand hover:underline">
            {t('auth.register.loginLink')}
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default RegisterPage

