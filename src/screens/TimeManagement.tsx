import { useState } from 'react'
import { Plus, Trash2, Battery, BatteryMedium, BatteryLow, Heart } from 'lucide-react'
import { BackButton } from '../components/ui/BackButton'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { TimeBlock } from '../types'

interface Props {
  onBack: () => void
}

const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00', '22:00',
]

const ENERGY_CONFIG = {
  alta: { label: 'Energía alta', icon: Battery, color: 'text-sage-600', bg: 'bg-sage-100' },
  media: { label: 'Energía media', icon: BatteryMedium, color: 'text-[#c4a000]', bg: 'bg-[#fdf6e3]' },
  baja: { label: 'Energía baja', icon: BatteryLow, color: 'text-blush-500', bg: 'bg-blush-50' },
} as const

export function TimeManagement({ onBack }: Props) {
  const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  const todayKey = new Date().toISOString().split('T')[0]
  const [blocks, setBlocks] = useLocalStorage<TimeBlock[]>(`time-blocks-${todayKey}`, [])
  const [showAdd, setShowAdd] = useState(false)
  const [slot, setSlot] = useState(TIME_SLOTS[2] ?? '09:00')
  const [energy, setEnergy] = useState<TimeBlock['energyLevel']>('alta')
  const [task, setTask] = useState('')
  const [selfCare, setSelfCare] = useState(false)

  function addBlock() {
    const newBlock: TimeBlock = {
      id: Date.now().toString(),
      label: slot,
      energyLevel: energy,
      task,
      selfCare,
    }
    setBlocks([...blocks, newBlock].sort((a, b) => a.label.localeCompare(b.label)))
    setTask('')
    setSelfCare(false)
    setShowAdd(false)
  }

  function deleteBlock(id: string) {
    setBlocks(blocks.filter((b) => b.id !== id))
  }

  return (
    <div className="min-h-dvh bg-sand-50 pb-10">
      <div className="px-6 pt-8 pb-4">
        <BackButton onBack={onBack} />
        <h1 className="section-title mt-4 mb-1">Gestión del tiempo</h1>
        <p className="text-sand-500 text-sm capitalize">{today}</p>
      </div>

      {/* Energy legend */}
      <div className="px-6 mb-5">
        <div className="card flex items-center justify-around py-3">
          {(Object.entries(ENERGY_CONFIG) as [TimeBlock['energyLevel'], typeof ENERGY_CONFIG[keyof typeof ENERGY_CONFIG]][]).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <cfg.icon size={16} className={cfg.color} strokeWidth={1.5} />
              <span className="text-xs text-sand-600">{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="px-6 mb-4 space-y-2">
        {blocks.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-sand-400 text-sm">Planifica tu día añadiendo bloques.</p>
            <p className="text-sand-300 text-xs mt-1">Asigna tareas según tu nivel de energía.</p>
          </div>
        ) : (
          blocks.map((block) => {
            const cfg = ENERGY_CONFIG[block.energyLevel]
            return (
              <div key={block.id} className="card flex items-start gap-3">
                <div className="text-center shrink-0 w-12">
                  <p className="text-xs font-semibold text-sand-500">{block.label}</p>
                  <div className={`mt-1 w-8 h-1 rounded-full mx-auto ${cfg.bg}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <cfg.icon size={13} className={cfg.color} strokeWidth={1.5} />
                    <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                    {block.selfCare && (
                      <span className="flex items-center gap-0.5 text-xs text-blush-400">
                        <Heart size={11} strokeWidth={2} />
                        autocuidado
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-sand-700">{block.task}</p>
                </div>
                <button onClick={() => deleteBlock(block.id)} className="text-sand-300 hover:text-blush-400 transition-colors shrink-0">
                  <Trash2 size={14} strokeWidth={1.5} />
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* Add block form */}
      {showAdd ? (
        <div className="px-6 space-y-4">
          <div className="card space-y-4">
            <h3 className="font-serif text-lg text-sand-800">Nuevo bloque</h3>

            <div>
              <label className="label">Hora</label>
              <select
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                className="input-field"
              >
                {TIME_SLOTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Nivel de energía</label>
              <div className="flex gap-2">
                {(Object.entries(ENERGY_CONFIG) as [TimeBlock['energyLevel'], typeof ENERGY_CONFIG[keyof typeof ENERGY_CONFIG]][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setEnergy(key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      energy === key ? `${cfg.bg} ${cfg.color} ring-1 ring-current` : 'bg-sand-100 text-sand-500'
                    }`}
                  >
                    <cfg.icon size={14} strokeWidth={1.5} />
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Tarea o actividad</label>
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="¿Qué harás en este bloque?"
                className="input-field"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  selfCare ? 'bg-blush-400 border-blush-400' : 'border-sand-300'
                }`}
                onClick={() => setSelfCare(!selfCare)}
              >
                {selfCare && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-sand-600 flex items-center gap-1.5">
                <Heart size={13} className="text-blush-400" strokeWidth={2} />
                Bloque de autocuidado
              </span>
            </label>

            <div className="flex gap-2">
              <button onClick={() => setShowAdd(false)} className="flex-1 btn-secondary">Cancelar</button>
              <button
                onClick={addBlock}
                disabled={!task.trim()}
                className={`flex-1 btn-primary ${!task.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6">
          <button
            onClick={() => setShowAdd(true)}
            className="w-full card flex items-center gap-3 hover:shadow-float active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#fdf6e3] flex items-center justify-center">
              <Plus size={20} className="text-[#c4a000]" strokeWidth={2} />
            </div>
            <span className="font-medium text-sand-700">Añadir bloque</span>
          </button>
        </div>
      )}
    </div>
  )
}
