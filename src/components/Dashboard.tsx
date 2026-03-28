import { useNavigate } from 'react-router-dom'

interface ModuleCard {
  icon: (color: string) => React.ReactNode
  title: string
  description: string
  path: string
  color: string
  bg: string
}

// Parcelas: pie chart with 3 equal slices (120° each)
// Center (12,12), r=9 → top:(12,3) 120°:(19.79,16.5) 240°:(4.21,16.5)
const IconParcelas = (color: string) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 12 L12 3 A9 9 0 0 1 19.79 16.5 Z" fill={color + '35'} stroke={color} strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M12 12 L19.79 16.5 A9 9 0 0 1 4.21 16.5 Z" fill={color + '22'} stroke={color} strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M12 12 L4.21 16.5 A9 9 0 0 1 12 3 Z" fill={color + '18'} stroke={color} strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>
)

// Emociones: center circle + 6 petal circles (flower / emotion wheel)
const IconEmociones = (color: string) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="2.8" fill={color + '55'} stroke={color} strokeWidth="1.4"/>
    <circle cx="12" cy="5" r="1.8" fill={color + '30'} stroke={color} strokeWidth="1.2"/>
    <circle cx="18.1" cy="8.5" r="1.8" fill={color + '30'} stroke={color} strokeWidth="1.2"/>
    <circle cx="18.1" cy="15.5" r="1.8" fill={color + '30'} stroke={color} strokeWidth="1.2"/>
    <circle cx="12" cy="19" r="1.8" fill={color + '30'} stroke={color} strokeWidth="1.2"/>
    <circle cx="5.9" cy="15.5" r="1.8" fill={color + '30'} stroke={color} strokeWidth="1.2"/>
    <circle cx="5.9" cy="8.5" r="1.8" fill={color + '30'} stroke={color} strokeWidth="1.2"/>
  </svg>
)

// Pensamientos: speech bubble with 3 dots
const IconPensamientos = (color: string) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M4 4 H19 Q20.5 4 20.5 5.5 V14 Q20.5 15.5 19 15.5 H13 L9.5 19.5 V15.5 H4 Q2.5 15.5 2.5 14 V5.5 Q2.5 4 4 4 Z"
      fill={color + '22'} stroke={color} strokeWidth="1.4" strokeLinejoin="round"/>
    <circle cx="8" cy="9.75" r="1.2" fill={color}/>
    <circle cx="11.75" cy="9.75" r="1.2" fill={color}/>
    <circle cx="15.5" cy="9.75" r="1.2" fill={color}/>
  </svg>
)

// Necesidades: two-leaf seedling sprout
const IconNecesidades = (color: string) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <line x1="12" y1="21" x2="12" y2="7" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M12 15 C12 15 5 13 4.5 7 C8 6.5 12 10 12 15 Z"
      fill={color + '35'} stroke={color} strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M12 11 C12 11 19 9 19.5 3 C16 2.5 12 6 12 11 Z"
      fill={color + '25'} stroke={color} strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
)


// Identidad: two overlapping circles (Venn / multiple selves)
const IconIdentidad = (color: string) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="12" r="6.5" fill={color + '20'} stroke={color} strokeWidth="1.4"/>
    <circle cx="15" cy="12" r="6.5" fill={color + '20'} stroke={color} strokeWidth="1.4"/>
  </svg>
)

// Control: concentric circles (bullseye)
const IconControl = (color: string) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.4" fill="none"/>
    <circle cx="12" cy="12" r="5.5" stroke={color} strokeWidth="1.4" fill={color + '18'}/>
    <circle cx="12" cy="12" r="2.2" fill={color} stroke="none"/>
  </svg>
)

const modules: ModuleCard[] = [
  {
    icon: IconParcelas,
    title: 'Parcelas de la Vida',
    description: 'Equilibra tu energía vital',
    path: '/parcelas',
    color: '#b07068',
    bg: '#f0d8d0',
  },
  {
    icon: IconEmociones,
    title: 'Rueda de Emociones',
    description: 'Amplía tu vocabulario emocional',
    path: '/emociones',
    color: '#c06060',
    bg: '#f5dbd8',
  },
  {
    icon: IconPensamientos,
    title: 'Laboratorio de Pensamientos',
    description: 'Reestructura tus pensamientos',
    path: '/pensamientos',
    color: '#9e7850',
    bg: '#e8d0c0',
  },
  {
    icon: IconNecesidades,
    title: 'Rastreo de Necesidades',
    description: 'Monitoriza tu autocuidado',
    path: '/necesidades',
    color: '#b07850',
    bg: '#f0e0d0',
  },
  {
    icon: IconIdentidad,
    title: 'Flexibilidad de Identidad',
    description: 'Eres más que cualquier etiqueta',
    path: '/identidad',
    color: '#a87070',
    bg: '#ecdad5',
  },
  {
    icon: IconControl,
    title: 'Círculo de Control',
    description: 'Enfoca tu energía donde importa',
    path: '/control',
    color: '#9e7050',
    bg: '#e0ccb8',
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
        style={{ background: 'linear-gradient(160deg, #fdf5f0 0%, #faf0eb 100%)', boxShadow: '0 2px 16px rgba(61,50,40,0.07)' }}
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
                background: mod.bg,
                boxShadow: '0 2px 12px rgba(61,50,40,0.08)',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(61,50,40,0.16)'
                ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 12px rgba(61,50,40,0.08)'
                ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${mod.color}28` }}
              >
                {mod.icon(mod.color)}
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
