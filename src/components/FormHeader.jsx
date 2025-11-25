import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const FormHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="btn p-3 rounded-xl">
        <Plus size={24} />
      </div>
      <div>
        <h2 className="text font-bold text-2xl">{t('createWifiQrCode')}</h2>
        <p className="text">{t('generateBeautifulQrCode')}</p>
      </div>
    </div>
  )
}

export default FormHeader
