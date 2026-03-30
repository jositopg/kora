import { useState } from 'react'
import { Plus, Wind, PenLine, Trash2 } from 'lucide-react'
import { BackButton } from '../components/ui/BackButton'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { EMOTIONS } from '../data/emotions'
import type { EmotionLog } from '../types'

interface Props {
  onBack: () => void
}

type View = 'log' | 'new' | 'breathing'

export function EmotionalJournal({ onBack }: Props) {
  const [logs, setLogs] = useLocalStorage<EmotionLog[]>('emotion-logs', [])
  const [view, setView] = useState<View>('log')
  const [emotionId, setEmotionId] = useState('')
  const [intensity, setIntensity] = useState(5)
  const [note, setNote] = useState('')
  const [breathPhase, setBreathPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle')
  const [breathCount, setBreathCount] = useState(0)

  function saveEntry() {
    const emotion = EMOTIONS.find((e) => e.id === emotionId)
    if (!emotion) return
    const entry: EmotionLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-ES'),
      emotionId,
      emotionName: emotion.name,
      intensity,
      note,
    }
    setLogs([entry, ...logs])
    setEmotionId('')
    setIntensity(5)
    setNote('')
    setView('log')
  }

  function deleteEntry(id: string) {
    setLogs(logs.filter((l) => l.id !== id))
  }

  function startBreathing() {
    setBreathPhase('inhale')
    setBreathCount(0)
    runBreathCycle()
  }

  function runBreathCycle() {
    let count = 0
    function cycle() {
      if (count >= 4) {
        setBreathPhase('idle')
        setBreathCount(4)
        return
      }
      setBreathPhase('inhale')
      setTimeout(() => {
        setBreathPhase('hold')
        setTimeout(() => {
          setBreathPhase('exhale')
          setTimeout(() => {
            count++
            setBreathCount(count)
            cycle()
          }, 6000)
        }, 4000)
      }, 4000)
    }
    cycle()
  }

  const breathLabels = {
    idle: breathCount >= 4 ? '¡Bien hecho! 🌿' : 'Pulsa para comenzar',
    inhale: 'Inhala...',
    hold: 'Retén...',
    exhale: 'Exhala...',
  }

  const breathColors = {
    idle: 'bg-sand-100',
    inhale: 'bg-sage-100',
    hold: 'bg-[#ede9fb]',
    exhale: 'bg-blush-50',
  }

  if (view === 'breathing') {
    return (
      <div className="min-h-dvh bg-sand-50 pb-10">
        <div className="px-6 pt-8 pb-4">
          <BackButton onBack={() => setView('log')} />
          <h1 className="section-title mt-4 mb-1">Respiración 4-4-6</h1>
          <p className="text-sand-500 text-sm">4 ciclos para activar tu sistema nervioso parasimpático</p>
        </div>

        <div className="px-6 flex flex-col items-center mt-6">
          <div
            className={`w-52 h-52 rounded-full flex items-center justify-center transition-all duration-1000 ${breathColors[breathPhase]}`}
            style={{
              transform:
                breathPhase === 'inhale'
                  ? 'scale(1.15)'
                  : breathPhase === 'exhale'
                  ? 'scale(0.9)'
                  : 'scale(1)',
            }}
          >
            <div className="text-center">
              <Wind size={32} className="text-sand-400 mx-auto mb-2" strokeWidth={1.5} />
              <p className="font-serif text-lg text-sand-700">{breathLabels[breathPhase]}</p>
              {breathPhase !== 'idle' && (
                <p className="text-sand-400 text-xs mt-1">Ciclo {breathCount + 1} de 4</p>
              )}
            </div>
          </div>

          {breathPhase === 'idle' && breathCount < 4 && (
            <button onClick={startBreathing} className="btn-primary mt-10">
              Comenzar
            </button>
          )}

          {breathPhase === 'idle' && breathCount >= 4 && (
            <div className="mt-8 text-center">
              <p className="text-sand-600 text-sm mb-4">Tómate un momento para notar cómo te sientes ahora.</p>
              <button onClick={() => { setBreathCount(0); setBreathPhase('idle') }} className="btn-secondary">
                Repetir
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (view === 'new') {
    return (
      <div className="min-h-dvh bg-sand-50 pb-10">
        <div className="px-6 pt-8 pb-4">
          <BackButton onBack={() => setView('log')} />
          <h1 className="section-title mt-4 mb-1">Nuevo registro</h1>
        </div>

        <div className="px-6 space-y-5">
          <div>
            <label className="label">¿Qué emoción estás sintiendo?</label>
            <select
              value={emotionId}
              onChange={(e) => setEmotionId(e.target.value)}
              className="input-field"
            >
              <option value="">Selecciona una emoción</option>
              {EMOTIONS.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Intensidad: {intensity}/10</label>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-sand-400 mt-1">
              <span>Leve</span>
              <span>Intensa</span>
            </div>
          </div>

          <div>
            <label className="label">Nota libre (opcional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="¿Qué está pasando? ¿Qué lo ha desencadenado?"
              rows={4}
              className="textarea-field"
            />
          </div>

          <button
            onClick={saveEntry}
            disabled={!emotionId}
            className={`w-full btn-primary ${!emotionId ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            Guardar registro
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-sand-50 pb-10">
      <div className="px-6 pt-8 pb-4">
        <BackButton onBack={onBack} />
        <h1 className="section-title mt-4 mb-1">Gestión emocional</h1>
        <p className="text-sand-500 text-sm">Diario visual y herramientas de regulación</p>
      </div>

      {/* Quick actions */}
      <div className="px-6 mb-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => setView('new')}
          className="card flex flex-col items-center gap-2 py-5 hover:shadow-float active:scale-95 transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-2xl bg-blush-100 flex items-center justify-center">
            <Plus size={20} className="text-blush-600" strokeWidth={2} />
          </div>
          <span className="text-sm font-medium text-sand-700">Registrar emoción</span>
        </button>

        <button
          onClick={() => setView('breathing')}
          className="card flex flex-col items-center gap-2 py-5 hover:shadow-float active:scale-95 transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-2xl bg-sage-100 flex items-center justify-center">
            <Wind size={20} className="text-sage-600" strokeWidth={1.5} />
          </div>
          <span className="text-sm font-medium text-sand-700">Respiración guiada</span>
        </button>
      </div>

      {/* Log */}
      <div className="px-6">
        <div className="flex items-center gap-2 mb-3">
          <PenLine size={16} className="text-sand-400" strokeWidth={1.5} />
          <p className="label mb-0">Historial emocional</p>
        </div>

        {logs.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-sand-400 text-sm">Aún no hay registros.</p>
            <p className="text-sand-300 text-xs mt-1">Empieza registrando lo que sientes hoy.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => {
              const emotion = EMOTIONS.find((e) => e.id === log.emotionId)
              return (
                <div key={log.id} className="card flex items-start gap-3">
                  <div
                    className="w-3 h-3 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: emotion?.color ?? '#c7b396' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sand-800 text-sm">{log.emotionName}</span>
                      <span className="text-xs text-sand-400">{log.date}</span>
                    </div>
                    <p className="text-xs text-sand-500 mt-0.5">Intensidad: {log.intensity}/10</p>
                    {log.note && (
                      <p className="text-sm text-sand-600 mt-1.5 leading-relaxed">{log.note}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteEntry(log.id)}
                    className="text-sand-300 hover:text-blush-400 transition-colors shrink-0"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
