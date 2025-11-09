import Card from '../components/Card'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import { useI18n } from '../i18n'

const SettingsPage = () => {
  const { t } = useI18n()

  return (
    <div className="space-y-6">
      <PageHeader title={t('settings.title')} subtitle={t('settings.subtitle')} />
      <Card>
        <EmptyState title={t('settings.emptyTitle')} description={t('settings.emptyDescription')} />
      </Card>
    </div>
  )
}

export default SettingsPage

