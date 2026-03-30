import {
  Smile,
  BookOpen,
  Brain,
  PieChart,
  Clock,
  Leaf,
  Target,
  ChevronRight,
} from 'lucide-react'
import type { Screen } from '../types'

interface Module {
  id: Screen
  icon: React.ReactNode
  title: string
  subtitle: string
  color: string
}

const MODULES: Module[] = [
  {
    id: 'emotions-wheel',
    icon: <Smile size={22} strokeWidth={1.5} />,
    title: 'Rueda de emociones',
    subtitle: 'Identifica y afina lo que sientes',
    color: 'bg-[#ede9fb] text-[#7c6fcd]',
  },
  {
    id: 'emotional-journal',
    icon: <BookOpen size={22} strokeWidth={1.5} />,
    title: 'Gestión emocional',
    subtitle: 'Diario visual y ejercicios',
    color: 'bg-blush-100 text-blush-600',
  },
  {
    id: 'thought-lab',
    icon: <Brain size={22} strokeWidth={1.5} />,
    title: 'Laboratorio de pensamientos',
    subtitle: 'Reestructura tus creencias',
    color: 'bg-sage-100 text-sage-600',
  },
  {
    id: 'life-plots',
    icon: <PieChart size={22} strokeWidth={1.5} />,
    title: 'Parcelas de la vida',
    subtitle: 'Visualiza tu distribución vital',
    color: 'bg-sand-100 text-sand-600',
  },
  {
    id: 'time-management',
    icon: <Clock size={22} strokeWidth={1.5} />,
    title: 'Gestión del tiempo',
    subtitle: 'Planifica según tu energía',
    color: 'bg-[#fdf6e3] text-[#b8860b]',
  },
  {
    id: 'needs-tracking',
    icon: <Leaf size={22} strokeWidth={1.5} />,
    title: 'Rastreo de necesidades',
    subtitle: 'Monitoriza tu autocuidado diario',
    color: 'bg-[#eaf4ef] text-[#3d7a5a]',
  },
  {
    id: 'values-compass',
    icon: <Target size={22} strokeWidth={1.5} />,
    title: 'Brújula de valores',
    subtitle: 'Alinea acciones y valores',
    color: 'bg-[#f8edf7] text-[#a055a0]',
  },
]

interface Props {
  onNavigate: (screen: Screen) => void
}

export function Dashboard({ onNavigate }: Props) {
  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="min-h-dvh bg-sand-50 pb-8">
      {/* Header */}
      <div className="px-6 pt-10 pb-6">
        <p className="text-sand-400 text-sm capitalize mb-1">{today}</p>
        <h1 className="font-serif text-3xl text-sand-900 leading-tight">
          Tu santuario
        </h1>
        <p className="text-sand-500 text-sm mt-1">¿Con qué quieres trabajar hoy?</p>
      </div>

      {/* Modules grid */}
      <div className="px-6 space-y-3">
        {MODULES.map((mod) => (
          <button
            key={mod.id}
            onClick={() => onNavigate(mod.id)}
            className="w-full card flex items-center gap-4 text-left hover:shadow-float active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${mod.color}`}>
              {mod.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sand-800 text-sm">{mod.title}</p>
              <p className="text-sand-400 text-xs mt-0.5 truncate">{mod.subtitle}</p>
            </div>
            <ChevronRight size={16} className="text-sand-300 shrink-0" />
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 mt-8 text-center">
        <p className="text-xs text-sand-300">
          Todo se guarda en tu dispositivo · 100% privado
        </p>
      </div>
    </div>
  )
}
