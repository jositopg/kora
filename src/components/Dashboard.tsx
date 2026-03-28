import { useNavigate } from 'react-router-dom'

interface ModuleCard {
  icon: string
  title: string
  description: string
  path: string
  color: string
}

const modules: ModuleCard[] = [
  {
    icon: '🌿',
    title: 'Parcelas de la Vida',
    description: 'Equilibra tu energía vital',
    path: '/parcelas',
    color: '#6b8c6e',
  },
  {
    icon: '🌸',
    title: 'Rueda de Emociones',
    description: 'Amplía tu vocabulario emocional',
    path: '/emociones',
    color: '#c4956a',
  },
  {
    icon: '💭',
    title: 'Laboratorio de Pensamientos',
    description: 'Reestructura tus pensamientos',
    path: '/pensamientos',
    color: '#8b7355',
  },
  {
    icon: '🌱',
    title: 'Rastreo de Necesidades',
    description: 'Monitoriza tu autocuidado',
    path: '/necesidades',
    color: '#7a9e7e',
  },
  {
    icon: '🧭',
    title: 'Brújula de Valores',
    description: 'Alinéate con tus valores',
    path: '/valores',
    color: '#8a6b8c',
  },
  {
    icon: '🔍',
    title: 'Voces Internas',
    description: 'Descubre de dónde vienen tus mensajes',
    path: '/voces',
    color: '#a0633a',
  },
]

function formatDate(): string {
  const now = new Date()
  return now.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function Dashboard() {
  const navigate = useNavigate()
  const dateStr = formatDate()

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <header
        className="px-6 pt-10 pb-8"
        style={{ background: 'var(--color-surface)', boxShadow: '0 2px 12px rgba(61,50,40,0.06)' }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="mb-4">
            <svg viewBox="0 0 240 130" fill="none" xmlns="http://www.w3.org/2000/svg" width="160">
              <path d="M 22,95 L 22,43 A 28,28 0 0,1 78,43 L 78,95" stroke="#A0633A" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="12" y1="100" x2="88" y2="100" stroke="#A0633A" strokeWidth="3.5" strokeLinecap="round"/>
              <text x="106" y="82" fontFamily="'Manrope', sans-serif" fontSize="34" fontWeight="300" letterSpacing="10" fill="#111111">KORA</text>
            </svg>
          </div>
          <p className="font-sans text-sm text-text-muted capitalize">{dateStr}</p>
          <p className="font-sans text-sm text-text mt-2">
            ¿Cómo te encuentras hoy? Elige un espacio de reflexión.
          </p>
        </div>
      </header>

      {/* Module grid */}
      <main className="px-6 py-8 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <button
              key={mod.path}
              onClick={() => navigate(mod.path)}
              className="rounded-2xl p-5 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              style={{
                background: 'var(--color-surface)',
                boxShadow: '0 2px 12px rgba(61,50,40,0.08)',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(61,50,40,0.14)'
                ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--color-primary-container)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 12px rgba(61,50,40,0.08)'
                ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--color-surface)'
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-3"
                style={{ background: `${mod.color}22` }}
              >
                {mod.icon}
              </div>
              <h2 className="font-serif font-semibold text-text text-base leading-snug mb-1">
                {mod.title}
              </h2>
              <p className="font-sans text-xs text-text-muted leading-snug">{mod.description}</p>
            </button>
          ))}
        </div>

        <p className="mt-10 text-center font-sans text-xs text-text-muted">
          Todo tu progreso se guarda localmente en este dispositivo
        </p>
      </main>
    </div>
  )
}
