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
  type MaintenancePriority,
  type MaintenanceRequest,
  type MaintenanceRequestInput,
  type MaintenanceStatus,
} from '../context/MockDataContext'
import { useI18n } from '../i18n'

type FormState = {
  propertyId: string
  title: string
  reportedBy: string
  status: MaintenanceStatus
  priority: MaintenancePriority
  description: string
  assignedTo: string
  reportedAt: string
  notes: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const today = new Date().toISOString().slice(0, 10)

const emptyState: FormState = {
  propertyId: '',
  title: '',
  reportedBy: '',
  status: 'open',
  priority: 'medium',
  description: '',
  assignedTo: '',
  reportedAt: today,
  notes: '',
}

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30'

const MaintenanceRequestsPage = () => {
  const { t } = useI18n()
  const { maintenanceRequests, properties, addMaintenanceRequest, updateMaintenanceRequest, deleteMaintenanceRequest } =
    useMockData()
  const { showToast } = useToast()

  const [formState, setFormState] = useState<FormState>(emptyState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [requestToDelete, setRequestToDelete] = useState<MaintenanceRequest | null>(null)

  const propertyOptions = useMemo(
    () => properties.map((property) => ({ value: property.id, label: property.name })),
    [properties],
  )

  const statusLabels: Record<MaintenanceStatus, string> = {
    open: t('maintenance.status.open'),
    in_progress: t('maintenance.status.in_progress'),
    closed: t('maintenance.status.closed'),
  }

  const priorityLabels: Record<MaintenancePriority, string> = {
    low: t('maintenance.priority.low'),
    medium: t('maintenance.priority.medium'),
    high: t('maintenance.priority.high'),
  }

  const resetForm = () => {
    setFormState(emptyState)
    setErrors({})
    setEditingId(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validationErrors: FormErrors = {}

    if (!formState.propertyId) {
      validationErrors.propertyId = t('forms.required')
    }
    if (!formState.title.trim()) {
      validationErrors.title = t('forms.required')
    }
    if (!formState.reportedBy.trim()) {
      validationErrors.reportedBy = t('forms.required')
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const payload: MaintenanceRequestInput = {
      propertyId: formState.propertyId,
      title: formState.title,
      reportedBy: formState.reportedBy,
      status: formState.status,
      priority: formState.priority,
      description: formState.description || undefined,
      assignedTo: formState.assignedTo || undefined,
      reportedAt: formState.reportedAt || today,
      notes: formState.notes || undefined,
    }

    if (editingId) {
      updateMaintenanceRequest(editingId, payload)
      showToast(t('messages.successSave'))
    } else {
      addMaintenanceRequest(payload)
      showToast(`${t('messages.successSave')} ${t('messages.newDataNotice')}`)
    }

    resetForm()
  }

  const handleEdit = (request: MaintenanceRequest) => {
    setEditingId(request.id)
    setFormState({
      propertyId: request.propertyId,
      title: request.title,
      reportedBy: request.reportedBy,
      status: request.status,
      priority: request.priority ?? 'medium',
      description: request.description ?? '',
      assignedTo: request.assignedTo ?? '',
      reportedAt: request.reportedAt ?? today,
      notes: request.notes ?? '',
    })
  }

  const confirmDeletion = (request: MaintenanceRequest) => {
    setRequestToDelete(request)
  }

  const handleDeleteConfirmed = () => {
    if (!requestToDelete) {
      return
    }
    deleteMaintenanceRequest(requestToDelete.id)
    showToast(t('messages.deletedRequest'))
    if (editingId === requestToDelete.id) {
      resetForm()
    }
    setRequestToDelete(null)
  }

  return (
    <section className="space-y-6">
      <PageHeader title={t('nav.maintenance')} subtitle={t('maintenance.subtitle')} />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card
          title={editingId ? t('maintenance.form.titleEdit') : t('maintenance.form.titleCreate')}
          description={t('maintenance.form.description')}
        >
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <FormField
              id="maintenance-property"
              label={t('maintenance.form.property')}
              required
              error={errors.propertyId}
            >
              <select
                id="maintenance-property"
                className={inputClass}
                value={formState.propertyId}
                onChange={(event) => setFormState((prev) => ({ ...prev, propertyId: event.target.value }))}
              >
                <option value="">{t('maintenance.form.propertyPlaceholder')}</option>
                {propertyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField id="maintenance-title" label={t('maintenance.form.title')} required error={errors.title}>
              <input
                id="maintenance-title"
                className={inputClass}
                value={formState.title}
                onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
                placeholder={t('maintenance.placeholders.title')}
              />
            </FormField>

            <FormField id="maintenance-reported-by" label={t('maintenance.form.reportedBy')} required error={errors.reportedBy}>
              <input
                id="maintenance-reported-by"
                className={inputClass}
                value={formState.reportedBy}
                onChange={(event) => setFormState((prev) => ({ ...prev, reportedBy: event.target.value }))}
                placeholder={t('maintenance.placeholders.reportedBy')}
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="maintenance-status" label={t('maintenance.form.status')}>
                <select
                  id="maintenance-status"
                  className={inputClass}
                  value={formState.status}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, status: event.target.value as MaintenanceStatus }))
                  }
                >
                  {(Object.keys(statusLabels) as MaintenanceStatus[]).map((status) => (
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField id="maintenance-priority" label={t('maintenance.form.priority')}>
                <select
                  id="maintenance-priority"
                  className={inputClass}
                  value={formState.priority}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, priority: event.target.value as MaintenancePriority }))
                  }
                >
                  {(Object.keys(priorityLabels) as MaintenancePriority[]).map((priority) => (
                    <option key={priority} value={priority}>
                      {priorityLabels[priority]}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField id="maintenance-assigned" label={t('maintenance.form.assignedTo')}>
              <input
                id="maintenance-assigned"
                className={inputClass}
                value={formState.assignedTo}
                onChange={(event) => setFormState((prev) => ({ ...prev, assignedTo: event.target.value }))}
                placeholder={t('maintenance.placeholders.assignedTo')}
              />
            </FormField>

            <FormField id="maintenance-date" label={t('maintenance.form.reportedAt')}>
              <input
                type="date"
                id="maintenance-date"
                className={inputClass}
                value={formState.reportedAt}
                onChange={(event) => setFormState((prev) => ({ ...prev, reportedAt: event.target.value }))}
              />
            </FormField>

            <FormField id="maintenance-description" label={t('maintenance.form.description')}>
              <textarea
                id="maintenance-description"
                className={`${inputClass} min-h-[88px]`}
                value={formState.description}
                onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
                placeholder={t('maintenance.placeholders.description')}
              />
            </FormField>

            <FormField id="maintenance-notes" label={t('maintenance.form.notes')}>
              <textarea
                id="maintenance-notes"
                className={`${inputClass} min-h-[72px]`}
                value={formState.notes}
                onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
                placeholder={t('maintenance.placeholders.notes')}
              />
            </FormField>

            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-slate-500">{t('forms.requiredHint')}</div>
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
          title={t('maintenance.table.title')}
          description={
            maintenanceRequests.length > 0
              ? t('maintenance.table.descriptionWithCount', undefined, { count: maintenanceRequests.length })
              : t('maintenance.table.descriptionEmpty')
          }
        >
          {maintenanceRequests.length === 0 ? (
            <EmptyState title={t('maintenance.table.descriptionEmpty')} />
          ) : (
            <Table
              headers={[
                { label: t('maintenance.table.headers.request') },
                { label: t('maintenance.table.headers.status') },
                { label: t('maintenance.table.headers.priority') },
                { label: t('maintenance.table.headers.details') },
                { label: t('maintenance.table.headers.actions') },
              ]}
            >
              {maintenanceRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{request.title}</div>
                    <div className="text-xs text-slate-500">
                      {properties.find((property) => property.id === request.propertyId)?.name ??
                        t('maintenance.table.unknownProperty')}
                      {' • '}
                      {request.reportedBy}
                    </div>
                    <div className="text-xs text-slate-400">{request.reportedAt}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        request.status === 'open'
                          ? 'bg-amber-50 text-amber-600'
                          : request.status === 'in_progress'
                          ? 'bg-sky-50 text-sky-600'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {statusLabels[request.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{priorityLabels[request.priority ?? 'medium']}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <div>{request.description ?? '—'}</div>
                    <div className="text-xs text-slate-500">
                      {request.assignedTo
                        ? t('maintenance.table.assignedTo', undefined, { assignee: request.assignedTo })
                        : t('maintenance.table.noAssignee')}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(request)}
                        className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-brand hover:text-brand"
                      >
                        {t('actions.edit')}
                      </button>
                      <button
                        type="button"
                        onClick={() => confirmDeletion(request)}
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
        open={Boolean(requestToDelete)}
        title={t('maintenance.confirm.title')}
        description={
          requestToDelete ? t('maintenance.confirm.message', undefined, { title: requestToDelete.title }) : ''
        }
        cancelLabel={t('actions.cancel')}
        confirmLabel={t('actions.delete')}
        onCancel={() => setRequestToDelete(null)}
        onConfirm={handleDeleteConfirmed}
      />
    </section>
  )
}

export default MaintenanceRequestsPage

