import { type FormEvent, useMemo, useState } from 'react'

import Card from '../components/Card'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import FormField from '../components/FormField'
import PageHeader from '../components/PageHeader'
import Table from '../components/Table'
import { useToast } from '../components/ToastProvider'
import { useMockData, type Tenant, type TenantInput } from '../context/MockDataContext'
import { useI18n } from '../i18n'

type FormState = {
  name: string
  phone: string
  email: string
  workplace: string
  notes: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const emptyState: FormState = {
  name: '',
  phone: '',
  email: '',
  workplace: '',
  notes: '',
}

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30'

const TenantsPage = () => {
  const { t } = useI18n()
  const { tenants, properties, addTenant, updateTenant, deleteTenant } = useMockData()
  const { showToast } = useToast()
  const [formState, setFormState] = useState<FormState>(emptyState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [tenantToDelete, setTenantToDelete] = useState<Tenant | null>(null)

  const tenantPropertiesLookup = useMemo(() => {
    return tenants.reduce<Record<string, string[]>>((acc, tenant) => {
      acc[tenant.id] = properties
        .filter((property) => property.tenantId === tenant.id)
        .map((property) => property.name)
      return acc
    }, {})
  }, [tenants, properties])

  const resetForm = () => {
    setFormState(emptyState)
    setErrors({})
    setEditingId(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationErrors: FormErrors = {}
    if (!formState.name.trim()) {
      validationErrors.name = t('forms.required')
    }
    if (!formState.phone.trim()) {
      validationErrors.phone = t('forms.required')
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const payload: TenantInput = {
      name: formState.name,
      phone: formState.phone,
      email: formState.email || undefined,
      workplace: formState.workplace || undefined,
      notes: formState.notes || undefined,
    }

    if (editingId) {
      updateTenant(editingId, payload)
      showToast(t('messages.successSave'))
    } else {
      addTenant(payload)
      showToast(`${t('messages.successSave')} ${t('messages.newDataNotice')}`)
    }
    resetForm()
  }

  const handleEdit = (tenant: Tenant) => {
    setEditingId(tenant.id)
    setFormState({
      name: tenant.name,
      phone: tenant.phone,
      email: tenant.email ?? '',
      workplace: tenant.workplace ?? '',
      notes: tenant.notes ?? '',
    })
  }

  const confirmDeletion = (tenant: Tenant) => {
    setTenantToDelete(tenant)
  }

  const handleDeleteConfirmed = () => {
    if (!tenantToDelete) {
      return
    }
    deleteTenant(tenantToDelete.id)
    showToast(t('messages.deletedTenant'))
    if (editingId === tenantToDelete.id) {
      resetForm()
    }
    setTenantToDelete(null)
  }

  return (
    <section className="space-y-6">
      <PageHeader title={t('nav.tenants')} subtitle={t('tenants.subtitle')} />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Card
          title={editingId ? t('tenants.form.titleEdit') : t('tenants.form.titleCreate')}
          description={t('tenants.form.description')}
        >
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <FormField id="tenant-name" label={t('tenants.form.name')} required error={errors.name}>
              <input
                id="tenant-name"
                className={inputClass}
                value={formState.name}
                onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                placeholder={t('tenants.placeholders.name')}
              />
            </FormField>

            <FormField id="tenant-phone" label={t('tenants.form.phone')} required error={errors.phone}>
              <input
                id="tenant-phone"
                className={inputClass}
                value={formState.phone}
                onChange={(event) => setFormState((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder={t('tenants.placeholders.phone')}
              />
            </FormField>

            <FormField id="tenant-email" label={t('tenants.form.email')}>
              <input
                id="tenant-email"
                className={inputClass}
                value={formState.email}
                onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
                placeholder={t('tenants.placeholders.email')}
              />
            </FormField>

            <FormField id="tenant-workplace" label={t('tenants.form.workplace')}>
              <input
                id="tenant-workplace"
                className={inputClass}
                value={formState.workplace}
                onChange={(event) => setFormState((prev) => ({ ...prev, workplace: event.target.value }))}
                placeholder={t('tenants.placeholders.workplace')}
              />
            </FormField>

            <FormField id="tenant-notes" label={t('tenants.form.notes')}>
              <textarea
                id="tenant-notes"
                className={`${inputClass} min-h-[88px]`}
                value={formState.notes}
                onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
                placeholder={t('tenants.placeholders.notes')}
              />
            </FormField>

            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-slate-500">{t('tenants.form.requiredNote')}</div>
              <div className="flex items-center gap-2">
                {editingId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:border-slate-300"
                  >
                    {t('actions.cancel')}
                  </button>
                ) : null}
                <button
                  type="submit"
                  className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand/90"
                >
                  {editingId ? t('actions.update') : t('actions.save')}
                </button>
              </div>
            </div>
          </form>
        </Card>

        <Card
          title={t('tenants.table.title')}
          description={
            tenants.length > 0
              ? t('tenants.table.descriptionWithCount', undefined, { count: tenants.length })
              : t('tenants.table.descriptionEmpty')
          }
        >
          {tenants.length === 0 ? (
            <EmptyState title={t('messages.emptyState')} />
          ) : (
            <Table
              headers={[
                { label: t('tenants.table.headers.tenant') },
                { label: t('tenants.table.headers.contact') },
                { label: t('tenants.table.headers.properties') },
                { label: t('tenants.table.headers.actions') },
              ]}
            >
              {tenants.map((tenant) => (
                <tr key={tenant.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{tenant.name}</div>
                    <div className="text-xs text-slate-500">{tenant.workplace ?? '—'}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <div>{tenant.phone}</div>
                    <div className="text-xs text-slate-500">{tenant.email ?? '—'}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {tenantPropertiesLookup[tenant.id]?.length
                      ? tenantPropertiesLookup[tenant.id].join(', ')
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(tenant)}
                        className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-brand hover:text-brand"
                      >
                        {t('actions.edit')}
                      </button>
                      <button
                        type="button"
                        onClick={() => confirmDeletion(tenant)}
                        className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        {t('actions.delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(tenantToDelete)}
        title={t('tenants.confirm.title')}
        description={
          tenantToDelete ? t('tenants.confirm.message', undefined, { name: tenantToDelete.name }) : ''
        }
        cancelLabel={t('actions.cancel')}
        confirmLabel={t('actions.delete')}
        onCancel={() => setTenantToDelete(null)}
        onConfirm={handleDeleteConfirmed}
      />
    </section>
  )
}

export default TenantsPage

