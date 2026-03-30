import { useState } from 'react'
import { Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react'
import { BackButton } from '../components/ui/BackButton'
import { ProgressDots } from '../components/ui/ProgressDots'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { SOCRATIC_QUESTIONS, DISTORTIONS } from '../data/cognitiveDistortions'
import type { ThoughtEntry } from '../types'

interface Props {
  onBack: () => void
}

type Step = 0 | 1 | 2 | 3

export function ThoughtLab({ onBack }: Props) {
  const [entries, setEntries] = useLocalStorage<ThoughtEntry[]>('thought-entries', [])
  const [showNew, setShowNew] = useState(false)
  const [step, setStep] = useState<Step>(0)
  const [thought, setThought] = useState('')
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [reframe, setReframe] = useState('')

  function reset() {
    setShowNew(false)
    setStep(0)
    setThought('')
    setAnswers({})
    setReframe('')
  }

  function detectedDistortions() {
    return SOCRATIC_QUESTIONS.filter((q) => answers[q.id] === true)
      .map((q) => q.distortionId)
      .filter((v, i, a) => a.indexOf(v) === i)
  }

  function saveEntry() {
    const entry: ThoughtEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-ES'),
      thought,
      distortions: detectedDistortions(),
      reframe,
    }
    setEntries([entry, ...entries])
    reset()
  }

  if (showNew) {
    return (
      <div className="min-h-dvh bg-sand-50 pb-10">
        <div className="px-6 pt-8 pb-4">
          <BackButton onBack={reset} />
          <div className="flex items-center justify-between mt-4 mb-5">
            <h1 className="section-title">Laboratorio</h1>
            <ProgressDots total={4} current={step} />
          </div>
        </div>

        <div className="px-6">
          {/* Step 0: Thought input */}
          {step === 0 && (
            <div className="space-y-4 animate-[fadeIn_0.25s_ease]">
              <div className="card">
                <h2 className="font-serif text-xl text-sand-800 mb-2">El pensamiento limitante</h2>
                <p className="text-sand-500 text-sm mb-4">Escribe el pensamiento que te está generando malestar, tal como aparece en tu mente.</p>
                <textarea
                  value={thought}
                  onChange={(e) => setThought(e.target.value)}
                  placeholder="Ej: Siempre lo hago todo mal..."
                  rows={4}
                  className="textarea-field"
                />
              </div>
              <button
                onClick={() => setStep(1)}
                disabled={!thought.trim()}
                className={`w-full btn-primary ${!thought.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Continuar
              </button>
            </div>
          )}

          {/* Step 1: Socratic questions */}
          {step === 1 && (
            <div className="space-y-4 animate-[fadeIn_0.25s_ease]">
              <div className="card mb-2">
                <h2 className="font-serif text-xl text-sand-800 mb-1">Análisis socrático</h2>
                <p className="text-sand-500 text-sm">Responde con sinceridad. No hay respuestas correctas.</p>
              </div>

              <div className="space-y-3">
                {SOCRATIC_QUESTIONS.map((q) => (
                  <div key={q.id} className="card">
                    <p className="text-sand-700 text-sm mb-3 leading-relaxed">{q.question}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: true }))}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          answers[q.id] === true
                            ? 'bg-blush-100 text-blush-700 ring-1 ring-blush-300'
                            : 'bg-sand-100 text-sand-600 hover:bg-sand-200'
                        }`}
                      >
                        <CheckCircle2 size={14} strokeWidth={2} />
                        Sí
                      </button>
                      <button
                        onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: false }))}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          answers[q.id] === false
                            ? 'bg-sage-100 text-sage-700 ring-1 ring-sage-300'
                            : 'bg-sand-100 text-sand-600 hover:bg-sand-200'
                        }`}
                      >
                        <XCircle size={14} strokeWidth={2} />
                        No
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={Object.keys(answers).length < SOCRATIC_QUESTIONS.length}
                className={`w-full btn-primary ${Object.keys(answers).length < SOCRATIC_QUESTIONS.length ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Ver resultado
              </button>
            </div>
          )}

          {/* Step 2: Distortion detection */}
          {step === 2 && (
            <div className="space-y-4 animate-[fadeIn_0.25s_ease]">
              <div className="card">
                <h2 className="font-serif text-xl text-sand-800 mb-3">Distorsiones detectadas</h2>
                {detectedDistortions().length === 0 ? (
                  <div className="bg-sage-50 rounded-2xl p-4">
                    <p className="text-sage-700 text-sm">No se han detectado distorsiones cognitivas claras. Eso no significa que el pensamiento sea completamente realista, sino que puede ser una preocupación legítima.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {detectedDistortions().map((id) => {
                      const d = DISTORTIONS.find((d) => d.id === id)
                      return d ? (
                        <div key={id} className="bg-blush-50 rounded-2xl p-4 border border-blush-100">
                          <p className="font-medium text-blush-800 text-sm mb-1">{d.name}</p>
                          <p className="text-blush-700 text-xs leading-relaxed">{d.definition}</p>
                        </div>
                      ) : null
                    })}
                  </div>
                )}
              </div>

              <div className="card bg-sand-100">
                <p className="text-sand-600 text-sm italic leading-relaxed">"{thought}"</p>
              </div>

              <button onClick={() => setStep(3)} className="w-full btn-primary">
                Trabajar la desfusión
              </button>
            </div>
          )}

          {/* Step 3: Defusion / reframe */}
          {step === 3 && (
            <div className="space-y-4 animate-[fadeIn_0.25s_ease]">
              <div className="card">
                <h2 className="font-serif text-xl text-sand-800 mb-3">La buena amiga</h2>
                <div className="bg-sand-50 rounded-2xl p-4 mb-4">
                  <p className="text-sand-700 text-sm leading-relaxed italic">
                    "Si tuvieras que explicar esta misma situación a una buena amiga que está pasando por lo mismo,
                    ¿qué pensamiento más ajustado a la realidad le dirías?"
                  </p>
                </div>
                <textarea
                  value={reframe}
                  onChange={(e) => setReframe(e.target.value)}
                  placeholder="Escríbele a esa amiga con toda la compasión que te mereces..."
                  rows={5}
                  className="textarea-field"
                />
              </div>

              <button
                onClick={saveEntry}
                disabled={!reframe.trim()}
                className={`w-full btn-primary ${!reframe.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Guardar análisis
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
        <h1 className="section-title mt-4 mb-1">Laboratorio de pensamientos</h1>
        <p className="text-sand-500 text-sm">Reestructura tus creencias limitantes</p>
      </div>

      <div className="px-6">
        <button
          onClick={() => setShowNew(true)}
          className="w-full card flex items-center gap-3 mb-6 hover:shadow-float active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-sage-100 flex items-center justify-center">
            <Plus size={20} className="text-sage-600" strokeWidth={2} />
          </div>
          <span className="font-medium text-sand-700">Nuevo análisis</span>
        </button>

        {entries.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-sand-400 text-sm">Aún no hay análisis guardados.</p>
            <p className="text-sand-300 text-xs mt-1">Cuando tengas un pensamiento limitante, úsalo aquí.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="card">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs text-sand-400">{entry.date}</p>
                  <button
                    onClick={() => setEntries(entries.filter((e) => e.id !== entry.id))}
                    className="text-sand-300 hover:text-blush-400 transition-colors"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </div>
                <p className="text-sm text-sand-700 italic mb-2">"{entry.thought}"</p>
                {entry.distortions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {entry.distortions.map((id) => {
                      const d = DISTORTIONS.find((d) => d.id === id)
                      return d ? (
                        <span key={id} className="tag bg-blush-100 text-blush-700 text-xs">
                          {d.name}
                        </span>
                      ) : null
                    })}
                  </div>
                )}
                {entry.reframe && (
                  <div className="bg-sage-50 rounded-2xl p-3 mt-2">
                    <p className="text-xs text-sage-600 font-medium mb-1">Pensamiento alternativo</p>
                    <p className="text-sm text-sage-700">{entry.reframe}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
