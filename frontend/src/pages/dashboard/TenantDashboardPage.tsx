import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Card from '../../components/Card'
import EmptyState from '../../components/EmptyState'
import KpiCard from '../../components/KpiCard'
import PageHeader from '../../components/PageHeader'
import Table from '../../components/Table'
import { useAuth } from '../../context/AuthContext'
import { useMockData } from '../../context/MockDataContext'
import { useI18n } from '../../i18n'
import {
  type DashboardSources,
  type TenantDashboardData,
  getDashboardDataByRole,
} from '../../mock/mockDb'

const TenantDashboardPage = () => {
  const { t } = useI18n()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { properties, tenants, owners, contracts, maintenanceRequests } = useMockData()

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [data, setData] = useState<TenantDashboardData | null>(null)

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-SA', {
        style: 'currency',
        currency: 'SAR',
        maximumFractionDigits: 0,
      }),
    [],
  )

  const contractStatusLabels = {
    active: t('contracts.status.active'),
    pending: t('contracts.status.pending'),
    closed: t('contracts.status.closed'),
  }

  const maintenanceStatusLabels = {
    open: t('maintenance.status.open'),
    in_progress: t('maintenance.status.in_progress'),
    closed: t('maintenance.status.closed'),
  }

  const maintenancePriorityLabels = {
    low: t('maintenance.priority.low'),
    medium: t('maintenance.priority.medium'),
    high: t('maintenance.priority.high'),
  }

  useEffect(() => {
    let isMounted = true
    const sources: DashboardSources = {
      properties,
      tenants,
      owners,
      contracts,
      maintenanceRequests,
    }

    const load = async () => {
      setStatus('loading')
      try {
        const dashboard = await getDashboardDataByRole('tenant', user?.profileId, sources)
        if (isMounted) {
          setData(dashboard as TenantDashboardData)
          setStatus('ready')
        }
      } catch (error) {
        console.warn('Failed to load tenant dashboard mock data', error)
        if (isMounted) {
          setStatus('error')
        }
      }
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [contracts, maintenanceRequests, owners, properties, tenants, user?.profileId])

  const handleCreateRequest = () => {
    navigate('/maintenance')
  }

  const tenantProfile = user?.profileId
    ? tenants.find((candidate) => candidate.id === user.profileId)
    : undefined

  return (
    <div className="space-y-6">
      <PageHeader title={t('dashboard.tenant.title')} subtitle={t('dashboard.tenant.subtitle')} />

      {status === 'loading' ? (
        <Card>
          <div className="text-sm text-slate-500">{t('dashboard.state.loading')}</div>
        </Card>
      ) : null}

      {status === 'error' ? (
        <Card>
          <div className="text-sm text-rose-500">{t('dashboard.state.error')}</div>
        </Card>
      ) : null}

      {status === 'ready' && data ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {data.nextPayment ? (
              <KpiCard
                label={t('dashboard.tenant.nextPayment')}
                value={currencyFormatter.format(data.nextPayment.amount)}
                helperText={t('dashboard.tenant.nextPaymentHelper', undefined, {
                  property: data.nextPayment.propertyName,
                  due: data.nextPayment.dueDate,
                })}
                accent="brand"
              />
            ) : (
              <KpiCard
                label={t('dashboard.tenant.nextPayment')}
                value="—"
                helperText={t('dashboard.tenant.noUpcomingPayments')}
                accent="neutral"
              />
            )}
            <KpiCard
              label={t('dashboard.tenant.contractsCount')}
              value={data.contracts.length}
              helperText={
                tenantProfile
                  ? t('dashboard.tenant.contractHelper', undefined, { name: tenantProfile.name })
                  : undefined
              }
              accent="success"
            />
          </div>

          <Card title={t('dashboard.tenant.contracts')}>
            {data.contracts.length === 0 ? (
              <EmptyState
                title={t('dashboard.tenant.contractsEmptyTitle')}
                description={t('dashboard.tenant.contractsEmptyDescription')}
              />
            ) : (
              <Table
                headers={[
                  { label: t('properties.table.headers.property') },
                  { label: t('owners.table.headers.owner') },
                  { label: t('contracts.table.headers.status') },
                  { label: t('contracts.table.headers.rent'), align: 'end' },
                ]}
              >
                {data.contracts.map((contract) => {
                  const property = properties.find((candidate) => candidate.id === contract.propertyId)
                  const owner = owners.find((candidate) => candidate.id === property?.ownerId)
                  return (
                    <tr key={contract.id}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">
                          {property?.name ?? t('maintenance.table.unknownProperty')}
                        </div>
                        <div className="text-xs text-slate-500">
                          {contract.endDate
                            ? t('contracts.table.period.fromTo', undefined, {
                                start: contract.startDate,
                                end: contract.endDate,
                              })
                            : t('contracts.table.period.fromOpen', undefined, { start: contract.startDate })}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{owner?.name ?? t('owners.unknown')}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {contractStatusLabels[contract.status ?? 'active']}
                      </td>
                      <td className="px-4 py-3 text-end text-sm text-slate-600">
                        {currencyFormatter.format(contract.rentAmount)}
                      </td>
                    </tr>
                  )
                })}
              </Table>
            )}
          </Card>

          <Card
            title={t('dashboard.tenant.maintenance')}
            actions={
              <button
                type="button"
                onClick={handleCreateRequest}
                className="rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand/90"
              >
                {t('dashboard.tenant.createRequest')}
              </button>
            }
          >
            {data.maintenanceRequests.length === 0 ? (
              <EmptyState
                title={t('dashboard.tenant.maintenanceEmptyTitle')}
                description={t('dashboard.tenant.maintenanceEmptyDescription')}
              />
            ) : (
              <Table
                headers={[
                  { label: t('maintenance.table.headers.request') },
                  { label: t('maintenance.table.headers.status') },
                  { label: t('maintenance.table.headers.priority') },
                  { label: t('maintenance.form.reportedAt') },
                ]}
              >
                {data.maintenanceRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{request.title}</div>
                      <div className="text-xs text-slate-500">{request.description ?? '—'}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {maintenanceStatusLabels[request.status]}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {maintenancePriorityLabels[request.priority ?? 'medium']}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{request.reportedAt ?? '—'}</td>
                  </tr>
                ))}
              </Table>
            )}
          </Card>
        </>
      ) : null}
    </div>
  )
}

export default TenantDashboardPage

