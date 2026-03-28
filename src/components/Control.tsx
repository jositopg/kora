import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PageHeader from './ui/PageHeader'
import type { ControlEntry } from '../types'

type Step = 'ejemplo' | 'situacion' | 'clasificar' | 'reflexion' | 'guardado'

const EJEMPLO = {
  situacion: 'Tengo que dar una presentación importante en el trabajo',
  controlo: [
    'Prepararme con tiempo',
    'Practicar en voz alta',
    'Descansar bien la noche anterior',
    'Mi actitud y lenguaje corporal',
    'Llegar puntual',
    'Pedir ayuda si la necesito',
  ],
  noControlo: [
    'Las preguntas que me hagan',
    'La opinión de los demás',
    'Que la tecnología funcione',
    'Los nervios en el momento',
    'Cómo interpretan mis palabras',
    'El resultado final',
  ],
}

function CirculosConcentricos({
  controlCount,
  noControlCount,
  small = false,
}: {
  controlCount: number
  noControlCount: number
  small?: boolean
}) {
  const size = small ? 200 : 260
  const cx = size / 2
  const cy = size / 2
  const outerR = small ? 88 : 115
  const innerR = small ? 40 : 52

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Outer circle — no controlo */}
      <circle
        cx={cx} cy={cy} r={outerR}
        fill="#ede6db"
        stroke="#c4b8a8"
        strokeWidth="1.5"
      />

      {/* Inner circle — controlo */}
      <circle
        cx={cx} cy={cy} r={innerR}
        fill="#A0633A"
        opacity="0.85"
      />

      {/* Label outer */}
      <text
        x={cx} y={cy - outerR + 18}
        textAnchor="middle"
        fontSize={small ? 9 : 10}
        fill="#7a6b5a"
        fontFamily="Manrope, sans-serif"
      >
        No controlo
      </text>

      {/* Count outer */}
      {noControlCount > 0 && (
        <text
          x={cx} y={cy + outerR - 14}
          textAnchor="middle"
          fontSize={small ? 11 : 13}
          fontWeight="600"
          fill="#7a6b5a"
          fontFamily="Manrope, sans-serif"
        >
          {noControlCount} {noControlCount === 1 ? 'aspecto' : 'aspectos'}
        </text>
      )}

      {/* Label inner */}
      <text
        x={cx} y={cy - 6}
        textAnchor="middle"
        fontSize={small ? 8 : 9}
        fill="#fff"
        fontFamily="Manrope, sans-serif"
      >
        Controlo
      </text>

      {/* Count inner */}
      <text
        x={cx} y={cy + 10}
        textAnchor="middle"
        fontSize={small ? 14 : 18}
        fontWeight="700"
        fill="#fff"
        fontFamily="Manrope, sans-serif"
      >
        {controlCount}
      </text>
    </svg>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function Control() {
  const [entries, setEntries] = useLocalStorage<ControlEntry[]>('kora_control', [])

  const [step, setStep] = useState<Step>('ejemplo')
  const [situacion, setSituacion] = useState('')
  const [itemInput, setItemInput] = useState('')
  const [controlo, setControlo] = useState<string[]>([])
  const [noControlo, setNoControlo] = useState<string[]>([])
  const [reflexion, setReflexion] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const cardStyle = {
    background: 'var(--color-surface)',
    boxShadow: '0 2px 12px rgba(61,50,40,0.08)',
  }

  const textareaStyle = {
    background: 'var(--color-bg)',
    color: 'var(--color-text)',
    border: '1.5px solid var(--color-border)',
  }

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--color-primary)'
  }
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--color-border)'
  }

  const addItem = (zona: 'controlo' | 'noControlo') => {
    if (!itemInput.trim()) return
    if (zona === 'controlo') setControlo(prev => [...prev, itemInput.trim()])
    else setNoControlo(prev => [...prev, itemInput.trim()])
    setItemInput('')
  }

  const removeItem = (zona: 'controlo' | 'noControlo', idx: number) => {
    if (zona === 'controlo') setControlo(prev => prev.filter((_, i) => i !== idx))
    else setNoControlo(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSave = () => {
    const entry: ControlEntry = {
      id: `ctrl_${Date.now()}`,
      situacion,
      controlo,
      noControlo,
      reflexion,
      createdAt: new Date().toISOString(),
    }
    setEntries(prev => [entry, ...prev])
    setStep('guardado')
  }

  const handleReset = () => {
    setSituacion('')
    setItemInput('')
    setControlo([])
    setNoControlo([])
    setReflexion('')
    setStep('ejemplo')
    setShowHistory(false)
  }

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto px-6 pt-8">
        <PageHeader
          title="Círculo de Control"
          subtitle="Enfoca tu energía en lo que sí puedes cambiar"
        />

        {/* Paso 1: Ejemplo ilustrado */}
        {step === 'ejemplo' && (
          <div>
            <div className="rounded-2xl p-5 mb-5" style={cardStyle}>
              <p className="font-sans text-sm text-text-muted leading-relaxed mb-4">
                Ante cualquier situación difícil hay cosas que <strong className="text-text">puedes controlar</strong> y cosas que <strong className="text-text">no puedes controlar</strong>.
                Gastar energía en lo que no controlas genera ansiedad. Enfocarte en lo que sí controlas genera acción.
              </p>
              <p className="font-sans text-xs text-text-muted uppercase tracking-wide font-semibold mb-3">
                Ejemplo
              </p>
              <div
                className="rounded-xl p-3 mb-4"
                style={{ background: 'var(--color-primary-container)' }}
              >
                <p className="font-sans text-sm font-semibold text-text">"{EJEMPLO.situacion}"</p>
              </div>

              {/* Visual */}
              <div className="flex justify-center mb-4">
                <CirculosConcentricos
                  controlCount={EJEMPLO.controlo.length}
                  noControlCount={EJEMPLO.noControlo.length}
                />
              </div>

              {/* Listas del ejemplo */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p
                    className="font-sans text-xs font-semibold uppercase tracking-wide mb-2"
                    style={{ color: '#A0633A' }}
                  >
                    ● Controlo
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {EJEMPLO.controlo.map(item => (
                      <div
                        key={item}
                        className="rounded-lg px-3 py-1.5"
                        style={{ background: '#A0633A18' }}
                      >
                        <p className="font-sans text-xs text-text">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-sans text-xs font-semibold uppercase tracking-wide mb-2 text-text-muted">
                    ○ No controlo
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {EJEMPLO.noControlo.map(item => (
                      <div
                        key={item}
                        className="rounded-lg px-3 py-1.5"
                        style={{ background: 'var(--color-surface-low)' }}
                      >
                        <p className="font-sans text-xs text-text-muted">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('situacion')}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Explorar mi situación →
            </button>

            {entries.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full mt-3 py-3 rounded-full font-sans text-sm font-medium transition-colors"
                style={{ background: 'var(--color-surface-low)', color: 'var(--color-text-muted)' }}
              >
                {showHistory ? 'Ocultar' : 'Ver'} historial ({entries.length})
              </button>
            )}

            {showHistory && (
              <div className="mt-4 flex flex-col gap-3">
                {entries.map(entry => (
                  <div key={entry.id} className="rounded-2xl overflow-hidden" style={cardStyle}>
                    <button
                      className="w-full text-left p-4"
                      onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                    >
                      <p className="font-sans text-xs text-text-muted mb-1">{formatDate(entry.createdAt)}</p>
                      <p className="font-sans text-sm text-text line-clamp-1">{entry.situacion}</p>
                      <div className="flex gap-3 mt-2">
                        <span className="font-sans text-xs" style={{ color: '#A0633A' }}>
                          ● {entry.controlo.length} controlo
                        </span>
                        <span className="font-sans text-xs text-text-muted">
                          ○ {entry.noControlo.length} no controlo
                        </span>
                      </div>
                    </button>
                    {expandedId === entry.id && entry.reflexion && (
                      <div className="px-4 pb-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                        <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mt-3 mb-1">
                          Reflexión
                        </p>
                        <p className="font-sans text-sm text-text">{entry.reflexion}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Paso 2: Situación */}
        {step === 'situacion' && (
          <div>
            <div className="rounded-2xl p-5 mb-5" style={cardStyle}>
              <label className="block font-sans text-sm font-semibold text-text mb-2">
                ¿Qué situación quieres explorar?
              </label>
              <p className="font-sans text-xs text-text-muted mb-3">
                Puede ser algo que te preocupa, una decisión pendiente o un conflicto que estás viviendo.
              </p>
              <textarea
                value={situacion}
                onChange={e => setSituacion(e.target.value)}
                rows={3}
                placeholder="Ej: Estoy esperando una respuesta importante, Tengo un conflicto con alguien..."
                className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none"
                style={textareaStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <button
              onClick={() => setStep('clasificar')}
              disabled={!situacion.trim()}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Clasificar aspectos →
            </button>
          </div>
        )}

        {/* Paso 3: Clasificar */}
        {step === 'clasificar' && (
          <div>
            <div
              className="rounded-2xl p-4 mb-5"
              style={{ background: 'var(--color-primary-container)' }}
            >
              <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                Tu situación
              </p>
              <p className="font-sans text-sm font-semibold text-text">"{situacion}"</p>
            </div>

            {/* Visual en tiempo real */}
            <div className="flex justify-center mb-5">
              <CirculosConcentricos
                controlCount={controlo.length}
                noControlCount={noControlo.length}
              />
            </div>

            {/* Input + botones */}
            <div className="rounded-2xl p-5 mb-4" style={cardStyle}>
              <label className="block font-sans text-sm font-semibold text-text mb-2">
                Añade un aspecto de esta situación
              </label>
              <input
                type="text"
                value={itemInput}
                onChange={e => setItemInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') e.preventDefault() }}
                placeholder="Ej: Mi actitud, lo que digan de mí, el resultado..."
                className="w-full px-4 py-2.5 rounded-xl font-sans text-sm outline-none mb-3"
                style={textareaStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => addItem('controlo')}
                  disabled={!itemInput.trim()}
                  className="flex-1 py-2.5 rounded-full font-sans text-sm font-semibold transition-all disabled:opacity-40"
                  style={{ background: '#A0633A', color: '#fff' }}
                >
                  ● Lo controlo
                </button>
                <button
                  onClick={() => addItem('noControlo')}
                  disabled={!itemInput.trim()}
                  className="flex-1 py-2.5 rounded-full font-sans text-sm font-semibold transition-all disabled:opacity-40"
                  style={{ background: 'var(--color-surface-low)', color: 'var(--color-text-muted)' }}
                >
                  ○ No lo controlo
                </button>
              </div>
            </div>

            {/* Listas */}
            {(controlo.length > 0 || noControlo.length > 0) && (
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div>
                  <p className="font-sans text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#A0633A' }}>
                    ● Controlo
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {controlo.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg px-3 py-1.5 flex items-center justify-between gap-2"
                        style={{ background: '#A0633A18' }}
                      >
                        <p className="font-sans text-xs text-text">{item}</p>
                        <button
                          onClick={() => removeItem('controlo', idx)}
                          className="text-text-muted hover:text-text shrink-0 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-sans text-xs font-semibold uppercase tracking-wide mb-2 text-text-muted">
                    ○ No controlo
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {noControlo.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg px-3 py-1.5 flex items-center justify-between gap-2"
                        style={{ background: 'var(--color-surface-low)' }}
                      >
                        <p className="font-sans text-xs text-text-muted">{item}</p>
                        <button
                          onClick={() => removeItem('noControlo', idx)}
                          className="text-text-muted hover:text-text shrink-0 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setStep('reflexion')}
              disabled={controlo.length === 0 && noControlo.length === 0}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Ver mi mapa completo →
            </button>
          </div>
        )}

        {/* Paso 4: Reflexión + visual final */}
        {step === 'reflexion' && (
          <div>
            <div
              className="rounded-2xl p-4 mb-5"
              style={{ background: 'var(--color-primary-container)' }}
            >
              <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                Tu situación
              </p>
              <p className="font-sans text-sm font-semibold text-text">"{situacion}"</p>
            </div>

            {/* Visual final */}
            <div className="flex justify-center mb-5">
              <CirculosConcentricos
                controlCount={controlo.length}
                noControlCount={noControlo.length}
              />
            </div>

            {/* Listas finales */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#A0633A' }}>
                  ● Controlo
                </p>
                <div className="flex flex-col gap-1.5">
                  {controlo.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg px-3 py-1.5"
                      style={{ background: '#A0633A18' }}
                    >
                      <p className="font-sans text-xs text-text">{item}</p>
                    </div>
                  ))}
                  {controlo.length === 0 && (
                    <p className="font-sans text-xs text-text-muted italic">Ninguno añadido</p>
                  )}
                </div>
              </div>
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-wide mb-2 text-text-muted">
                  ○ No controlo
                </p>
                <div className="flex flex-col gap-1.5">
                  {noControlo.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg px-3 py-1.5"
                      style={{ background: 'var(--color-surface-low)' }}
                    >
                      <p className="font-sans text-xs text-text-muted">{item}</p>
                    </div>
                  ))}
                  {noControlo.length === 0 && (
                    <p className="font-sans text-xs text-text-muted italic">Ninguno añadido</p>
                  )}
                </div>
              </div>
            </div>

            {/* Mensaje integrador */}
            <div
              className="rounded-2xl p-5 mb-5"
              style={{ ...cardStyle, borderLeft: '4px solid #A0633A' }}
            >
              <p className="font-sans text-sm text-text leading-relaxed">
                Tu energía vale más cuando se dirige hacia el círculo interior.
                Lo que está fuera de él no es tuyo para resolverlo — solo para aceptarlo o soltarlo.
              </p>
            </div>

            {/* Reflexión */}
            <div className="rounded-2xl p-5 mb-5" style={cardStyle}>
              <label className="block font-sans text-sm font-semibold text-text mb-2">
                ¿Qué puedes hacer hoy con lo que sí controlas?
              </label>
              <textarea
                value={reflexion}
                onChange={e => setReflexion(e.target.value)}
                rows={3}
                placeholder="Una acción concreta, aunque sea pequeña..."
                className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none"
                style={textareaStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Guardar →
            </button>
          </div>
        )}

        {/* Paso 5: Guardado */}
        {step === 'guardado' && (
          <div className="text-center">
            <div className="rounded-2xl p-8 mb-5" style={cardStyle}>
              <div className="flex justify-center mb-4">
                <CirculosConcentricos
                  controlCount={controlo.length}
                  noControlCount={noControlo.length}
                  small
                />
              </div>
              <h2 className="font-serif text-xl font-semibold text-text mb-3">
                Guardado
              </h2>
              <p className="font-sans text-sm text-text-muted leading-relaxed">
                Reconocer lo que no controlas no es rendirse — es liberar energía para lo que sí está en tus manos.
              </p>
              {reflexion && (
                <div
                  className="mt-4 rounded-xl p-4 text-left"
                  style={{ background: 'var(--color-primary-container)' }}
                >
                  <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                    Tu acción
                  </p>
                  <p className="font-sans text-sm text-text">{reflexion}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleReset}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Explorar otra situación
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
