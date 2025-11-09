import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Card from '../../components/Card'
import KpiCard from '../../components/KpiCard'
import PageHeader from '../../components/PageHeader'
import { useAuth } from '../../context/AuthContext'
import { useMockData } from '../../context/MockDataContext'
import { useI18n } from '../../i18n'
import {
  type DashboardSources,
  type ManagerDashboardData,
  getDashboardDataByRole,
} from '../../mock/mockDb'

const ManagerDashboardPage = () => {
  const { t } = useI18n()
  const { user } = useAuth()
  const { properties, tenants, owners, contracts, maintenanceRequests } = useMockData()

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [data, setData] = useState<ManagerDashboardData | null>(null)

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
        const dashboard = await getDashboardDataByRole('manager', user?.profileId, sources)
        if (isMounted) {
          setData(dashboard as ManagerDashboardData)
          setStatus('ready')
        }
      } catch (error) {
        console.warn('Failed to load manager dashboard mock data', error)
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
      <PageHeader title={t('dashboard.manager.title')} subtitle={t('dashboard.manager.subtitle')} />

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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <KpiCard
              label={t('dashboard.manager.kpis.properties')}
              value={data.metrics.totalProperties}
              accent="brand"
            />
            <KpiCard
              label={t('dashboard.manager.kpis.occupied')}
              value={data.metrics.occupiedProperties}
              accent="success"
            />
            <KpiCard
              label={t('dashboard.manager.kpis.vacant')}
              value={data.metrics.vacantProperties}
              accent="warning"
            />
            <KpiCard
              label={t('dashboard.manager.kpis.tenants')}
              value={data.metrics.tenantCount}
              accent="neutral"
            />
            <KpiCard
              label={t('dashboard.manager.kpis.maintenance')}
              value={data.metrics.openMaintenanceCount}
              accent="warning"
            />
          </div>

          <Card title={t('dashboard.manager.quickLinks.title')}>
            <div className="flex flex-wrap gap-3">
              {data.quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="rounded-lg border border-brand/30 bg-brand-muted px-3 py-2 text-sm font-medium text-brand hover:bg-brand/10"
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </div>
          </Card>
        </>
      ) : null}
    </div>
  )
}

export default ManagerDashboardPage

