import BackButton from './BackButton'

interface PageHeaderProps {
  title: string
  subtitle?: string
  backTo?: string
  backLabel?: string
  showBack?: boolean
}

export default function PageHeader({
  title,
  subtitle,
  backTo = '/dashboard',
  backLabel = 'Volver',
  showBack = true,
}: PageHeaderProps) {
  return (
    <div className="mb-6">
      {showBack && (
        <div className="mb-3">
          <BackButton to={backTo} label={backLabel} />
        </div>
      )}
      <h1 className="text-2xl font-serif font-semibold text-text leading-tight">{title}</h1>
      {subtitle && (
        <p className="mt-1 text-text-muted font-sans text-sm">{subtitle}</p>
      )}
    </div>
  )
}
