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
  type Contract,
  type ContractInput,
  type ContractStatus,
  type PaymentCycle,
} from '../context/MockDataContext'
import { useI18n } from '../i18n'

type FormState = {
  propertyId: string
  tenantId: string
  startDate: string
  endDate: string
  rentAmount: string
  paymentCycle: PaymentCycle
  status: ContractStatus
  notes: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const emptyState: FormState = {
  propertyId: '',
  tenantId: '',
  startDate: '',
  endDate: '',
  rentAmount: '',
  paymentCycle: 'monthly',
  status: 'active',
  notes: '',
}

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30'

const ContractsPage = () => {
  const { t } = useI18n()
  const { contracts, properties, tenants, addContract, updateContract, deleteContract } = useMockData()
  const { showToast } = useToast()

  const [formState, setFormState] = useState<FormState>(emptyState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null)

  const propertyOptions = useMemo(
    () => properties.map((property) => ({ value: property.id, label: property.name })),
    [properties],
  )
  const tenantOptions = useMemo(
    () => tenants.map((tenant) => ({ value: tenant.id, label: tenant.name })),
    [tenants],
  )
  const propertyLookup = useMemo(
    () => Object.fromEntries(properties.map((property) => [property.id, property.name])),
    [properties],
  )
  const tenantLookup = useMemo(
    () => Object.fromEntries(tenants.map((tenant) => [tenant.id, tenant.name])),
    [tenants],
  )

  const contractStatusLabels: Record<ContractStatus, string> = {
    active: t('contracts.status.active'),
    pending: t('contracts.status.pending'),
    closed: t('contracts.status.closed'),
  }

  const paymentCycleLabels: Record<PaymentCycle, string> = {
    monthly: t('contracts.cycle.monthly'),
    quarterly: t('contracts.cycle.quarterly'),
    yearly: t('contracts.cycle.yearly'),
  }

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-SA', {
        style: 'currency',
        currency: 'SAR',
        maximumFractionDigits: 0,
      }),
    [],
  )

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
    if (!formState.tenantId) {
      validationErrors.tenantId = t('forms.required')
    }
    if (!formState.startDate) {
      validationErrors.startDate = t('forms.required')
    }
    if (!formState.rentAmount.trim()) {
      validationErrors.rentAmount = t('forms.required')
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const payload: ContractInput = {
      propertyId: formState.propertyId,
      tenantId: formState.tenantId,
      startDate: formState.startDate,
      endDate: formState.endDate || undefined,
      rentAmount: Number.parseFloat(formState.rentAmount),
      paymentCycle: formState.paymentCycle,
      status: formState.status,
      notes: formState.notes || undefined,
    }

    if (editingId) {
      updateContract(editingId, payload)
      showToast(t('messages.successSave'))
    } else {
      addContract(payload)
      showToast(`${t('messages.successSave')} ${t('messages.newDataNotice')}`)
    }

    resetForm()
  }

  const handleEdit = (contract: Contract) => {
    setEditingId(contract.id)
    setFormState({
      propertyId: contract.propertyId,
      tenantId: contract.tenantId,
      startDate: contract.startDate,
      endDate: contract.endDate ?? '',
      rentAmount: String(contract.rentAmount),
      paymentCycle: contract.paymentCycle ?? 'monthly',
      status: contract.status,
      notes: contract.notes ?? '',
    })
  }

  const confirmDeletion = (contract: Contract) => {
    setContractToDelete(contract)
  }

  const handleDeleteConfirmed = () => {
    if (!contractToDelete) {
      return
    }
    deleteContract(contractToDelete.id)
    showToast(t('messages.deletedContract'))
    if (editingId === contractToDelete.id) {
      resetForm()
    }
    setContractToDelete(null)
  }

  const renderPeriod = (contract: Contract) => {
    if (contract.endDate) {
      return t('contracts.table.period.fromTo', undefined, {
        start: contract.startDate,
        end: contract.endDate,
      })
    }
    return t('contracts.table.period.fromOpen', undefined, { start: contract.startDate })
  }

  return (
    <section className="space-y-6">
      <PageHeader title={t('nav.contracts')} subtitle={t('contracts.subtitle')} />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card
          title={editingId ? t('contracts.form.titleEdit') : t('contracts.form.titleCreate')}
          description={t('contracts.form.description')}
        >
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <FormField id="contract-property" label={t('contracts.form.property')} required error={errors.propertyId}>
              <select
                id="contract-property"
                className={inputClass}
                value={formState.propertyId}
                onChange={(event) => setFormState((prev) => ({ ...prev, propertyId: event.target.value }))}
              >
                <option value="">{t('contracts.form.propertyPlaceholder')}</option>
                {propertyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField id="contract-tenant" label={t('contracts.form.tenant')} required error={errors.tenantId}>
              <select
                id="contract-tenant"
                className={inputClass}
                value={formState.tenantId}
                onChange={(event) => setFormState((prev) => ({ ...prev, tenantId: event.target.value }))}
              >
                <option value="">{t('contracts.form.tenantPlaceholder')}</option>
                {tenantOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="contract-start" label={t('contracts.form.startDate')} required error={errors.startDate}>
                <input
                  type="date"
                  id="contract-start"
                  className={inputClass}
                  value={formState.startDate}
                  onChange={(event) => setFormState((prev) => ({ ...prev, startDate: event.target.value }))}
                />
              </FormField>
              <FormField id="contract-end" label={t('contracts.form.endDate')}>
                <input
                  type="date"
                  id="contract-end"
                  className={inputClass}
                  value={formState.endDate}
                  onChange={(event) => setFormState((prev) => ({ ...prev, endDate: event.target.value }))}
                />
              </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="contract-rent" label={t('contracts.form.rentAmount')} required error={errors.rentAmount}>
                <input
                  id="contract-rent"
                  className={inputClass}
                  value={formState.rentAmount}
                  onChange={(event) => setFormState((prev) => ({ ...prev, rentAmount: event.target.value }))}
                  inputMode="numeric"
                  placeholder={t('contracts.placeholders.rentAmount')}
                />
              </FormField>
              <FormField id="contract-cycle" label={t('contracts.form.paymentCycle')}>
                <select
                  id="contract-cycle"
                  className={inputClass}
                  value={formState.paymentCycle}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, paymentCycle: event.target.value as PaymentCycle }))
                  }
                >
                  {(Object.keys(paymentCycleLabels) as PaymentCycle[]).map((cycle) => (
                    <option key={cycle} value={cycle}>
                      {paymentCycleLabels[cycle]}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField id="contract-status" label={t('contracts.form.status')}>
              <select
                id="contract-status"
                className={inputClass}
                value={formState.status}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, status: event.target.value as ContractStatus }))
                }
              >
                {(Object.keys(contractStatusLabels) as ContractStatus[]).map((status) => (
                  <option key={status} value={status}>
                    {contractStatusLabels[status]}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField id="contract-notes" label={t('contracts.form.notes')}>
              <textarea
                id="contract-notes"
                className={`${inputClass} min-h-[88px]`}
                value={formState.notes}
                onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
                placeholder={t('contracts.placeholders.notes')}
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
          title={t('contracts.table.title')}
          description={
            contracts.length > 0
              ? t('contracts.table.descriptionWithCount', undefined, { count: contracts.length })
              : t('contracts.table.descriptionEmpty')
          }
        >
          {contracts.length === 0 ? (
            <EmptyState title={t('messages.emptyState')} />
          ) : (
            <Table
              headers={[
                { label: t('contracts.table.headers.property') },
                { label: t('contracts.table.headers.tenant') },
                { label: t('contracts.table.headers.period') },
                { label: t('contracts.table.headers.rent'), align: 'end' },
                { label: t('contracts.table.headers.status') },
                { label: t('contracts.table.headers.actions') },
              ]}
            >
              {contracts.map((contract) => (
                <tr key={contract.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">
                      {propertyLookup[contract.propertyId] ?? t('contracts.form.propertyPlaceholder')}
                    </div>
                    <div className="text-xs text-slate-500">#{contract.propertyId}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {tenantLookup[contract.tenantId] ?? t('contracts.form.tenantPlaceholder')}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <div>{renderPeriod(contract)}</div>
                    <div className="text-xs text-slate-500">
                      {paymentCycleLabels[contract.paymentCycle ?? 'monthly']}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-end text-sm text-slate-600">
                    {currencyFormatter.format(contract.rentAmount)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        contract.status === 'active'
                          ? 'bg-emerald-50 text-emerald-600'
                          : contract.status === 'pending'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {contractStatusLabels[contract.status ?? 'active']}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(contract)}
                        className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-brand hover:text-brand"
                      >
                        {t('actions.edit')}
                      </button>
                      <button
                        type="button"
                        onClick={() => confirmDeletion(contract)}
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
        open={Boolean(contractToDelete)}
        title={t('contracts.confirm.title')}
        description={
          contractToDelete ? t('contracts.confirm.message') : ''
        }
        cancelLabel={t('actions.cancel')}
        confirmLabel={t('actions.delete')}
        onCancel={() => setContractToDelete(null)}
        onConfirm={handleDeleteConfirmed}
      />
    </section>
  )
}

export default ContractsPage

