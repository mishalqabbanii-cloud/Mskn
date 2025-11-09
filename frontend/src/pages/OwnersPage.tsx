import { type FormEvent, useMemo, useState } from 'react'

import Card from '../components/Card'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import FormField from '../components/FormField'
import PageHeader from '../components/PageHeader'
import Table from '../components/Table'
import { useToast } from '../components/ToastProvider'
import { useMockData, type Owner, type OwnerInput } from '../context/MockDataContext'
import { useI18n } from '../i18n'

type FormState = {
  name: string
  phone: string
  email: string
  notes: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const emptyState: FormState = {
  name: '',
  phone: '',
  email: '',
  notes: '',
}

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30'

const OwnersPage = () => {
  const { t } = useI18n()
  const { owners, properties, addOwner, updateOwner, deleteOwner } = useMockData()
  const { showToast } = useToast()
  const [formState, setFormState] = useState<FormState>(emptyState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [ownerToDelete, setOwnerToDelete] = useState<Owner | null>(null)

  const ownerPropertiesLookup = useMemo(() => {
    return owners.reduce<Record<string, string[]>>((acc, owner) => {
      acc[owner.id] = properties.filter((property) => property.ownerId === owner.id).map((property) => property.name)
      return acc
    }, {})
  }, [owners, properties])

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

    const payload: OwnerInput = {
      name: formState.name,
      phone: formState.phone,
      email: formState.email || undefined,
      notes: formState.notes || undefined,
    }

    if (editingId) {
      updateOwner(editingId, payload)
      showToast(t('messages.successSave'))
    } else {
      addOwner(payload)
      showToast(`${t('messages.successSave')} ${t('messages.newDataNotice')}`)
    }

    resetForm()
  }

  const handleEdit = (owner: Owner) => {
    setEditingId(owner.id)
    setFormState({
      name: owner.name,
      phone: owner.phone,
      email: owner.email ?? '',
      notes: owner.notes ?? '',
    })
  }

  const confirmDeletion = (owner: Owner) => {
    setOwnerToDelete(owner)
  }

  const handleDeleteConfirmed = () => {
    if (!ownerToDelete) {
      return
    }
    deleteOwner(ownerToDelete.id)
    showToast(t('messages.deletedOwner'))
    if (editingId === ownerToDelete.id) {
      resetForm()
    }
    setOwnerToDelete(null)
  }

  return (
    <section className="space-y-6">
      <PageHeader title={t('nav.owners')} subtitle={t('owners.subtitle')} />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Card
          title={editingId ? t('owners.form.titleEdit') : t('owners.form.titleCreate')}
          description={t('owners.form.description')}
        >
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <FormField id="owner-name" label={t('owners.form.name')} required error={errors.name}>
              <input
                id="owner-name"
                className={inputClass}
                value={formState.name}
                onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                placeholder={t('owners.placeholders.name')}
              />
            </FormField>

            <FormField id="owner-phone" label={t('owners.form.phone')} required error={errors.phone}>
              <input
                id="owner-phone"
                className={inputClass}
                value={formState.phone}
                onChange={(event) => setFormState((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder={t('owners.placeholders.phone')}
              />
            </FormField>

            <FormField id="owner-email" label={t('owners.form.email')}>
              <input
                id="owner-email"
                className={inputClass}
                value={formState.email}
                onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
                placeholder={t('owners.placeholders.email')}
              />
            </FormField>

            <FormField id="owner-notes" label={t('owners.form.notes')}>
              <textarea
                id="owner-notes"
                className={`${inputClass} min-h-[88px]`}
                value={formState.notes}
                onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
                placeholder={t('owners.placeholders.notes')}
              />
            </FormField>

            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-slate-500">{t('owners.form.requiredNote')}</div>
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
          title={t('owners.table.title')}
          description={
            owners.length > 0
              ? t('owners.table.descriptionWithCount', undefined, { count: owners.length })
              : t('owners.table.descriptionEmpty')
          }
        >
          {owners.length === 0 ? (
            <EmptyState title={t('messages.emptyState')} />
          ) : (
            <Table
              headers={[
                { label: t('owners.table.headers.owner') },
                { label: t('owners.table.headers.contact') },
                { label: t('owners.table.headers.properties') },
                { label: t('owners.table.headers.actions') },
              ]}
            >
              {owners.map((owner) => (
                <tr key={owner.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{owner.name}</div>
                    <div className="text-xs text-slate-500">{owner.email ?? '—'}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <div>{owner.phone}</div>
                    <div className="text-xs text-slate-500">{owner.notes ?? '—'}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {ownerPropertiesLookup[owner.id]?.length
                      ? ownerPropertiesLookup[owner.id].join(', ')
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(owner)}
                        className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-brand hover:text-brand"
                      >
                        {t('actions.edit')}
                      </button>
                      <button
                        type="button"
                        onClick={() => confirmDeletion(owner)}
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
        open={Boolean(ownerToDelete)}
        title={t('owners.confirm.title')}
        description={
          ownerToDelete ? t('owners.confirm.message', undefined, { name: ownerToDelete.name }) : ''
        }
        cancelLabel={t('actions.cancel')}
        confirmLabel={t('actions.delete')}
        onCancel={() => setOwnerToDelete(null)}
        onConfirm={handleDeleteConfirmed}
      />
    </section>
  )
}

export default OwnersPage

