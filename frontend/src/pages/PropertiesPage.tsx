import { type FormEvent, useMemo, useState } from 'react'

import Card from '../components/Card'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import FormField from '../components/FormField'
import PageHeader from '../components/PageHeader'
import Table from '../components/Table'
import { useToast } from '../components/ToastProvider'
import {
  useMockData,
  type Property,
  type PropertyInput,
  type PropertyStatus,
} from '../context/MockDataContext'
import { useI18n } from '../i18n'

type FormState = {
  name: string
  address: string
  type: string
  imageUrl: string
  ownerId: string
  tenantId: string
  rentAmount: string
  status: PropertyStatus
  notes: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const emptyState: FormState = {
  name: '',
  address: '',
  type: '',
  imageUrl: '',
  ownerId: '',
  tenantId: '',
  rentAmount: '',
  status: 'available',
  notes: '',
}

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30'

const PropertiesPage = () => {
  const { t } = useI18n()
  const { owners, tenants, properties, addProperty, updateProperty, deleteProperty } = useMockData()
  const { showToast } = useToast()
  const [formState, setFormState] = useState<FormState>(emptyState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null)

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-SA', {
        style: 'currency',
        currency: 'SAR',
        maximumFractionDigits: 0,
      }),
    [],
  )

  const ownersOptions = useMemo(() => owners.map((owner) => ({ value: owner.id, label: owner.name })), [owners])
  const tenantsOptions = useMemo(() => tenants.map((tenant) => ({ value: tenant.id, label: tenant.name })), [tenants])

  const ownerLookup = useMemo(() => Object.fromEntries(owners.map((owner) => [owner.id, owner.name])), [owners])
  const tenantLookup = useMemo(() => Object.fromEntries(tenants.map((tenant) => [tenant.id, tenant.name])), [tenants])

  const statusLabels: Record<PropertyStatus, string> = {
    available: t('properties.status.available'),
    occupied: t('properties.status.occupied'),
    maintenance: t('properties.status.maintenance'),
  }

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

    if (!formState.address.trim()) {
      validationErrors.address = t('forms.required')
    }

    if (formState.imageUrl.trim()) {
      try {
        const parsed = new URL(formState.imageUrl.trim())
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          validationErrors.imageUrl = t('forms.invalidUrl')
        }
      } catch {
        validationErrors.imageUrl = t('forms.invalidUrl')
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const payload: PropertyInput = {
      name: formState.name,
      address: formState.address,
      type: formState.type || undefined,
      imageUrl: formState.imageUrl || undefined,
      ownerId: formState.ownerId || undefined,
      tenantId: formState.tenantId || undefined,
      rentAmount: formState.rentAmount ? Number.parseFloat(formState.rentAmount) : undefined,
      status: formState.status,
      notes: formState.notes || undefined,
    }

    if (editingId) {
      updateProperty(editingId, payload)
      showToast(t('messages.successSave'))
    } else {
      addProperty(payload)
      showToast(`${t('messages.successSave')} ${t('messages.newDataNotice')}`)
    }

    resetForm()
  }

  const handleEdit = (property: Property) => {
    setEditingId(property.id)
    setFormState({
      name: property.name,
      address: property.address,
      type: property.type ?? '',
      imageUrl: property.imageUrl ?? '',
      ownerId: property.ownerId ?? '',
      tenantId: property.tenantId ?? '',
      rentAmount: property.rentAmount ? String(property.rentAmount) : '',
      status: property.status ?? 'available',
      notes: property.notes ?? '',
    })
  }

  const confirmDeletion = (property: Property) => {
    setPropertyToDelete(property)
  }

  const handleDeleteConfirmed = () => {
    if (!propertyToDelete) {
      return
    }
    deleteProperty(propertyToDelete.id)
    showToast(t('messages.deletedProperty'))
    if (editingId === propertyToDelete.id) {
      resetForm()
    }
    setPropertyToDelete(null)
  }

  return (
    <section className="space-y-6">
      <PageHeader title={t('nav.properties')} subtitle={t('properties.subtitle')} />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card
          title={editingId ? t('properties.form.titleEdit') : t('properties.form.titleCreate')}
          description={t('properties.form.description')}
        >
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <FormField id="property-name" label={t('properties.form.name')} required error={errors.name}>
              <input
                id="property-name"
                className={inputClass}
                value={formState.name}
                onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                placeholder={t('properties.placeholders.name')}
              />
            </FormField>

            <FormField id="property-address" label={t('properties.form.address')} required error={errors.address}>
              <textarea
                id="property-address"
                className={`${inputClass} min-h-[88px]`}
                value={formState.address}
                onChange={(event) => setFormState((prev) => ({ ...prev, address: event.target.value }))}
                placeholder={t('properties.placeholders.address')}
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="property-type" label={t('properties.form.type')}>
                <input
                  id="property-type"
                  className={inputClass}
                  value={formState.type}
                  onChange={(event) => setFormState((prev) => ({ ...prev, type: event.target.value }))}
                  placeholder={t('properties.placeholders.type')}
                />
              </FormField>
              <FormField
                id="property-image"
                label={t('properties.form.image')}
                hint={t('properties.form.imageHint')}
                error={errors.imageUrl}
              >
                <input
                  id="property-image"
                  className={inputClass}
                  value={formState.imageUrl}
                  onChange={(event) => setFormState((prev) => ({ ...prev, imageUrl: event.target.value }))}
                  placeholder={t('properties.placeholders.image')}
                  inputMode="url"
                  type="url"
                  pattern="https?://.*"
                />
              </FormField>
              <FormField id="property-status" label={t('properties.form.status')}>
                <select
                  id="property-status"
                  className={inputClass}
                  value={formState.status}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, status: event.target.value as PropertyStatus }))
                  }
                >
                  {(Object.keys(statusLabels) as PropertyStatus[]).map((value) => (
                    <option key={value} value={value}>
                      {statusLabels[value]}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="property-owner" label={t('properties.form.owner')}>
                <select
                  id="property-owner"
                  className={inputClass}
                  value={formState.ownerId}
                  onChange={(event) => setFormState((prev) => ({ ...prev, ownerId: event.target.value }))}
                >
                  <option value="">{t('properties.placeholders.owner')}</option>
                  {ownersOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField id="property-tenant" label={t('properties.form.tenant')}>
                <select
                  id="property-tenant"
                  className={inputClass}
                  value={formState.tenantId}
                  onChange={(event) => setFormState((prev) => ({ ...prev, tenantId: event.target.value }))}
                >
                  <option value="">{t('properties.placeholders.tenant')}</option>
                  {tenantsOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField id="property-rent" label={t('properties.form.rent')}>
              <input
                id="property-rent"
                className={inputClass}
                value={formState.rentAmount}
                onChange={(event) => setFormState((prev) => ({ ...prev, rentAmount: event.target.value }))}
                placeholder={t('properties.placeholders.rent')}
                inputMode="numeric"
              />
            </FormField>

            <FormField id="property-notes" label={t('properties.form.notes')}>
              <textarea
                id="property-notes"
                className={`${inputClass} min-h-[88px]`}
                value={formState.notes}
                onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
                placeholder={t('properties.placeholders.notes')}
              />
            </FormField>

            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-slate-500">{t('properties.form.requiredNote')}</div>
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
          title={t('properties.table.title')}
          description={
            properties.length > 0
              ? t('properties.table.descriptionWithCount', undefined, { count: properties.length })
              : t('properties.table.descriptionEmpty')
          }
        >
          {properties.length === 0 ? (
            <EmptyState title={t('messages.emptyState')} />
          ) : (
            <Table
              headers={[
                { label: t('properties.table.headers.property') },
                { label: t('properties.table.headers.type') },
                { label: t('properties.table.headers.owner') },
                { label: t('properties.table.headers.tenant') },
                { label: t('properties.table.headers.rent'), align: 'end' },
                { label: t('properties.table.headers.status') },
                { label: t('properties.table.headers.actions') },
              ]}
            >
              {properties.map((property) => (
                <tr key={property.id} className="border-b border-slate-100">
                  <td className="px-4 py-3">
                    {property.imageUrl ? (
                      <img
                        src={property.imageUrl}
                        alt={property.name}
                        className="mb-2 h-16 w-16 rounded-md object-cover shadow-sm"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : null}
                    <div className="font-medium text-slate-900">{property.name}</div>
                    <div className="text-xs text-slate-500">{property.address}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{property.type ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {property.ownerId ? ownerLookup[property.ownerId] : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {property.tenantId ? tenantLookup[property.tenantId] : '—'}
                  </td>
                  <td className="px-4 py-3 text-end text-sm text-slate-600">
                    {property.rentAmount ? currencyFormatter.format(property.rentAmount) : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        property.status === 'available'
                          ? 'bg-emerald-50 text-emerald-600'
                          : property.status === 'occupied'
                          ? 'bg-sky-50 text-sky-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {statusLabels[property.status ?? 'available']}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(property)}
                        className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-brand hover:text-brand"
                      >
                        {t('actions.edit')}
                      </button>
                      <button
                        type="button"
                        onClick={() => confirmDeletion(property)}
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
        open={Boolean(propertyToDelete)}
        title={t('properties.confirm.title')}
        description={
          propertyToDelete
            ? t('properties.confirm.message', undefined, { name: propertyToDelete.name })
            : ''
        }
        cancelLabel={t('actions.cancel')}
        confirmLabel={t('actions.delete')}
        onCancel={() => setPropertyToDelete(null)}
        onConfirm={handleDeleteConfirmed}
      />
    </section>
  )
}

export default PropertiesPage

