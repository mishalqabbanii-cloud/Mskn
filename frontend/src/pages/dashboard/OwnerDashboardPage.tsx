import { useEffect, useMemo, useState } from 'react'

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
  type OwnerDashboardData,
  getDashboardDataByRole,
} from '../../mock/mockDb'

const OwnerDashboardPage = () => {
  const { t } = useI18n()
  const { user } = useAuth()
  const { properties, tenants, owners, contracts, maintenanceRequests } = useMockData()

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [data, setData] = useState<OwnerDashboardData | null>(null)

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-SA', {
        style: 'currency',
        currency: 'SAR',
        maximumFractionDigits: 0,
      }),
    [],
  )

  const propertyLookup = useMemo(
    () => Object.fromEntries(properties.map((property) => [property.id, property.name])),
    [properties],
  )

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
        const dashboard = await getDashboardDataByRole('owner', user?.profileId, sources)
        if (isMounted) {
          setData(dashboard as OwnerDashboardData)
          setStatus('ready')
        }
      } catch (error) {
        console.warn('Failed to load owner dashboard mock data', error)
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

  return (
    <div className="space-y-6">
      <PageHeader title={t('dashboard.owner.title')} subtitle={t('dashboard.owner.subtitle')} />

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
            <KpiCard
              label={t('dashboard.owner.revenue')}
              value={currencyFormatter.format(data.revenueSummary.totalAnnualRent)}
              accent="brand"
              helperText={t('dashboard.owner.activeContractsLabel', undefined, {
                count: data.revenueSummary.activeContracts,
              })}
            />
          </div>

          <Card title={t('dashboard.owner.properties')}>
            {data.properties.length === 0 ? (
              <EmptyState title={t('dashboard.owner.propertiesEmptyTitle')} description={t('dashboard.owner.propertiesEmptyDescription')} />
            ) : (
              <Table
                headers={[
                  { label: t('properties.table.headers.property') },
                  { label: t('properties.table.headers.status') },
                  { label: t('properties.table.headers.rent'), align: 'end' },
                ]}
              >
                {data.properties.map((property) => (
                  <tr key={property.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{property.name}</div>
                      <div className="text-xs text-slate-500">{property.address}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {property.status === 'occupied'
                        ? t('properties.status.occupied')
                        : property.status === 'available'
                        ? t('properties.status.available')
                        : t('properties.status.maintenance')}
                    </td>
                    <td className="px-4 py-3 text-end text-sm text-slate-600">
                      {property.rentAmount ? currencyFormatter.format(property.rentAmount) : '—'}
                    </td>
                  </tr>
                ))}
              </Table>
            )}
          </Card>

          <Card title={t('dashboard.owner.contracts')}>
            {data.contracts.length === 0 ? (
              <EmptyState
                title={t('dashboard.owner.contractsEmptyTitle')}
                description={t('dashboard.owner.contractsEmptyDescription')}
              />
            ) : (
              <Table
                headers={[
                  { label: t('contracts.table.headers.property') },
                  { label: t('contracts.table.headers.tenant') },
                  { label: t('contracts.table.headers.status') },
                  { label: t('contracts.table.headers.rent'), align: 'end' },
                ]}
              >
                {data.contracts.map((contract) => {
                  const tenant = tenants.find((candidate) => candidate.id === contract.tenantId)
                  return (
                    <tr key={contract.id}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">
                          {propertyLookup[contract.propertyId] ?? contract.id}
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
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {tenant?.name ?? t('contracts.form.tenantPlaceholder')}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {contract.status === 'active'
                          ? t('contracts.status.active')
                          : contract.status === 'pending'
                          ? t('contracts.status.pending')
                          : t('contracts.status.closed')}
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
        </>
      ) : null}
    </div>
  )
}

export default OwnerDashboardPage

