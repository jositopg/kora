import { useState } from 'react'
import { AlertCircle, Plus, Trash2, CheckCircle2 } from 'lucide-react'
import { BackButton } from '../components/ui/BackButton'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { ProgressDots } from '../components/ui/ProgressDots'
import type { NeedEntry } from '../types'

interface Props {
  onBack: () => void
}

const NEED_SUGGESTIONS = [
  'Descanso', 'Conexión', 'Reconocimiento', 'Autonomía', 'Seguridad',
  'Movimiento', 'Creatividad', 'Tranquilidad', 'Pertenencia', 'Alegría',
  'Propósito', 'Intimidad', 'Límites', 'Juego', 'Nutrición',
]

type Step = 0 | 1 | 2 | 3

export function NeedsTracking({ onBack }: Props) {
  const [entries, setEntries] = useLocalStorage<NeedEntry[]>('needs-entries', [])
  const [showNew, setShowNew] = useState(false)
  const [step, setStep] = useState<Step>(0)

  const [mainNeed, setMainNeed] = useState('')
  const [persisted, setPersisted] = useState<boolean | null>(null)
  const [priority, setPriority] = useState<NeedEntry['priority']>('media')
  const [satisfied, setSatisfied] = useState<boolean | null>(null)
  const [satisfiedHow, setSatisfiedHow] = useState('')
  const [notSatisfiedWhy, setNotSatisfiedWhy] = useState('')

  function reset() {
    setShowNew(false)
    setStep(0)
    setMainNeed('')
    setPersisted(null)
    setPriority('media')
    setSatisfied(null)
    setSatisfiedHow('')
    setNotSatisfiedWhy('')
  }

  function saveEntry() {
    const entry: NeedEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-ES'),
      mainNeed,
      persistedDuringDay: persisted ?? false,
      priority,
      satisfied: satisfied ?? false,
      satisfiedHow,
      notSatisfiedWhy,
    }
    setEntries([entry, ...entries])
    reset()
  }

  // Alert: detect repeated unsatisfied needs (3+ times in last 7 entries)
  function getAlerts() {
    const recent = entries.slice(0, 14)
    const unsatisfied = recent.filter((e) => !e.satisfied)
    const freq: Record<string, number> = {}
    unsatisfied.forEach((e) => {
      freq[e.mainNeed] = (freq[e.mainNeed] ?? 0) + 1
    })
    return Object.entries(freq)
      .filter(([, count]) => count >= 3)
      .map(([need]) => need)
  }

  const alerts = getAlerts()

  if (showNew) {
    return (
      <div className="min-h-dvh bg-sand-50 pb-10">
        <div className="px-6 pt-8 pb-4">
          <BackButton onBack={reset} />
          <div className="flex items-center justify-between mt-4 mb-5">
            <h1 className="section-title">Registro diario</h1>
            <ProgressDots total={4} current={step} />
          </div>
        </div>

        <div className="px-6">
          {step === 0 && (
            <div className="space-y-4 animate-[fadeIn_0.25s_ease]">
              <div className="card">
                <h2 className="font-serif text-xl text-sand-800 mb-2">¿Qué necesidad principal tuviste hoy al levantarte?</h2>
                <p className="text-sand-500 text-sm mb-4">Enfócate en necesidades emocionales o de autocuidado.</p>
                <input
                  type="text"
                  value={mainNeed}
                  onChange={(e) => setMainNeed(e.target.value)}
                  placeholder="Ej: Descanso, Conexión, Reconocimiento..."
                  className="input-field mb-3"
                />
                <div className="flex flex-wrap gap-2">
                  {NEED_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setMainNeed(s)}
                      className={`tag text-xs transition-all ${
                        mainNeed === s
                          ? 'bg-sand-600 text-white'
                          : 'bg-sand-100 text-sand-600 hover:bg-sand-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setStep(1)}
                disabled={!mainNeed.trim()}
                className={`w-full btn-primary ${!mainNeed.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Continuar
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 animate-[fadeIn_0.25s_ease]">
              <div className="card">
                <h2 className="font-serif text-xl text-sand-800 mb-4">¿Esta necesidad se mantuvo a lo largo del día?</h2>
                <div className="flex gap-3">
                  {[
                    { value: true, label: 'Sí, persistió' },
                    { value: false, label: 'No, cambió' },
                  ].map(({ value, label }) => (
                    <button
                      key={String(value)}
                      onClick={() => setPersisted(value)}
                      className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all ${
                        persisted === value
                          ? 'bg-sand-700 text-white shadow-soft'
                          : 'bg-sand-100 text-sand-600 hover:bg-sand-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="card">
                <h2 className="font-serif text-xl text-sand-800 mb-4">¿Qué posición ocupó al finalizar el día?</h2>
                <div className="flex gap-2">
                  {(['alta', 'media', 'baja'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-3 rounded-2xl text-sm font-medium capitalize transition-all ${
                        priority === p
                          ? 'bg-sand-700 text-white'
                          : 'bg-sand-100 text-sand-600 hover:bg-sand-200'
                      }`}
                    >
                      Prioridad {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={persisted === null}
                className={`w-full btn-primary ${persisted === null ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Continuar
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-[fadeIn_0.25s_ease]">
              <div className="card">
                <h2 className="font-serif text-xl text-sand-800 mb-4">¿Se satisfizo la necesidad?</h2>
                <div className="flex gap-3">
                  {[
                    { value: true, label: 'Sí' },
                    { value: false, label: 'No' },
                  ].map(({ value, label }) => (
                    <button
                      key={String(value)}
                      onClick={() => setSatisfied(value)}
                      className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all ${
                        satisfied === value
                          ? value
                            ? 'bg-sage-500 text-white'
                            : 'bg-blush-400 text-white'
                          : 'bg-sand-100 text-sand-600 hover:bg-sand-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {satisfied === true && (
                <div className="card animate-[fadeIn_0.25s_ease]">
                  <label className="label">¿De qué manera se satisfizo?</label>
                  <textarea
                    value={satisfiedHow}
                    onChange={(e) => setSatisfiedHow(e.target.value)}
                    placeholder="Describe cómo conseguiste satisfacer esa necesidad..."
                    rows={3}
                    className="textarea-field"
                  />
                </div>
              )}

              {satisfied === false && (
                <div className="card animate-[fadeIn_0.25s_ease]">
                  <label className="label">¿Por qué no se satisfizo?</label>
                  <textarea
                    value={notSatisfiedWhy}
                    onChange={(e) => setNotSatisfiedWhy(e.target.value)}
                    placeholder="¿Qué obstáculos hubo? ¿Qué pasó?"
                    rows={3}
                    className="textarea-field"
                  />
                </div>
              )}

              <button
                onClick={saveEntry}
                disabled={satisfied === null}
                className={`w-full btn-primary ${satisfied === null ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Guardar registro
              </button>
            </div>
          )}
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-sand-50 pb-10">
      <div className="px-6 pt-8 pb-4">
        <BackButton onBack={onBack} />
        <h1 className="section-title mt-4 mb-1">Rastreo de necesidades</h1>
        <p className="text-sand-500 text-sm">Monitoriza tu autocuidado diario</p>
      </div>

      {/* Smart alerts */}
      {alerts.length > 0 && (
        <div className="px-6 mb-5">
          {alerts.map((need) => (
            <div key={need} className="flex items-start gap-3 bg-blush-50 border border-blush-100 rounded-3xl p-4 mb-2">
              <AlertCircle size={18} className="text-blush-500 shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-blush-700">{need} sin satisfacer</p>
                <p className="text-xs text-blush-500 mt-0.5">
                  Has registrado esta necesidad insatisfecha varias veces recientemente. Puede merecer atención especial.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="px-6 mb-5">
        <button
          onClick={() => setShowNew(true)}
          className="w-full card flex items-center gap-3 hover:shadow-float active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#eaf4ef] flex items-center justify-center">
            <Plus size={20} className="text-[#3d7a5a]" strokeWidth={2} />
          </div>
          <span className="font-medium text-sand-700">Registro de hoy</span>
        </button>
      </div>

      {/* History */}
      <div className="px-6">
        <p className="label">Historial</p>
        {entries.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-sand-400 text-sm">Aún no hay registros.</p>
            <p className="text-sand-300 text-xs mt-1">Haz un registro diario para detectar patrones.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="card">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs text-sand-400">{entry.date}</p>
                    <p className="font-medium text-sand-800 text-sm mt-0.5">{entry.mainNeed}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.satisfied ? (
                      <CheckCircle2 size={16} className="text-sage-500" strokeWidth={2} />
                    ) : (
                      <AlertCircle size={16} className="text-blush-400" strokeWidth={1.5} />
                    )}
                    <button
                      onClick={() => setEntries(entries.filter((e) => e.id !== entry.id))}
                      className="text-sand-300 hover:text-blush-400 transition-colors"
                    >
                      <Trash2 size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-sand-500">
                  <span>Prioridad {entry.priority}</span>
                  <span>·</span>
                  <span>{entry.persistedDuringDay ? 'Persistió todo el día' : 'Cambió durante el día'}</span>
                </div>

                {(entry.satisfiedHow || entry.notSatisfiedWhy) && (
                  <p className="text-xs text-sand-600 mt-2 leading-relaxed">
                    {entry.satisfied ? entry.satisfiedHow : entry.notSatisfiedWhy}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
