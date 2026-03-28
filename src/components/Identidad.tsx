import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PageHeader from './ui/PageHeader'
import ProfesionalLink from './ui/ProfesionalLink'
import ModuleIntro from './ui/ModuleIntro'
import type { IdentidadEntry, Parte } from '../types'

type Step = 'partes' | 'peso' | 'complementarias' | 'integracion' | 'guardado'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function PesoVisual({ peso }: { peso: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all"
          style={{
            width: 8,
            height: 8,
            background: i < peso ? '#A0633A' : 'var(--color-border)',
            opacity: i < peso ? 1 - i * 0.05 : 1,
          }}
        />
      ))}
      <span className="font-sans text-xs text-text-muted ml-1">{peso}/10</span>
    </div>
  )
}

export default function Identidad() {
  const [entries, setEntries] = useLocalStorage<IdentidadEntry[]>('kora_identidad', [])

  const [step, setStep] = useState<Step>('partes')
  const [inputParte, setInputParte] = useState('')
  const [partes, setPartes] = useState<Parte[]>([])
  const [complementariaIdx, setComplementariaIdx] = useState(0)
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

  const addParte = () => {
    if (!inputParte.trim()) return
    const nueva: Parte = {
      id: `p_${Date.now()}`,
      etiqueta: inputParte.trim(),
      peso: 5,
      situacion: '',
      complementaria: undefined,
    }
    setPartes(prev => [...prev, nueva])
    setInputParte('')
  }

  const updateParte = (id: string, changes: Partial<Parte>) => {
    setPartes(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p))
  }

  const updateComplementaria = (id: string, etiqueta: string, situacion: string) => {
    setPartes(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, complementaria: { etiqueta, situacion } }
          : p
      )
    )
  }

  const removeParte = (id: string) => {
    setPartes(prev => prev.filter(p => p.id !== id))
  }

  const todasLasPartes = [
    ...partes.map(p => ({ etiqueta: p.etiqueta, peso: p.peso, situacion: p.situacion, esOriginal: true })),
    ...partes
      .filter(p => p.complementaria?.etiqueta)
      .map(p => ({ etiqueta: p.complementaria!.etiqueta, peso: Math.max(1, 10 - p.peso), situacion: p.complementaria!.situacion, esOriginal: false })),
  ]

  const handleSave = () => {
    const entry: IdentidadEntry = {
      id: `id_${Date.now()}`,
      partes,
      createdAt: new Date().toISOString(),
    }
    setEntries(prev => [entry, ...prev])
    setStep('guardado')
  }

  const handleReset = () => {
    setPartes([])
    setInputParte('')
    setComplementariaIdx(0)
    setStep('partes')
    setShowHistory(false)
  }

  const canAdvanceFromPeso = partes.every(p => p.situacion.trim().length > 0)
  const parteActual = partes[complementariaIdx]

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto px-6 pt-8">
        <PageHeader
          title="¿Qué te define?"
          subtitle="Todas tus partes tienen su lugar"
        />

        <ModuleIntro
          que="Un ejercicio para explorar cómo te describes a ti mismo/a. Escribes los adjetivos o roles que sientes que te definen, les asignas un peso según cuánto espacio ocupan en tu vida, y reflexionas sobre cuándo y por qué aparece cada parte."
          para="Solemos identificarnos con una versión muy rígida de nosotros mismos ('soy así'). Este ejercicio ayuda a ver que somos mucho más que cualquier etiqueta: que tenemos partes distintas que conviven, y que ninguna nos define por completo. Esa flexibilidad es la base de un autoconcepto más sano y compasivo."
        />

        {/* Paso 1: Añadir partes */}
        {step === 'partes' && (
          <div>
            <div className="rounded-2xl p-5 mb-5" style={cardStyle}>
              <p className="font-sans text-sm text-text-muted leading-relaxed mb-4">
                Somos personas complejas y múltiples. Describe todas las partes que sientes que te definen —
                sin filtros, sin juzgar. Pueden ser adjetivos, roles, estados...
              </p>
              <label className="block font-sans text-sm font-semibold text-text mb-3">
                ¿Cómo te describes? Añade todas las partes que se te ocurran.
              </label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={inputParte}
                  onChange={e => setInputParte(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addParte() } }}
                  placeholder="Ej: ansiosa, creativa, perfeccionista..."
                  className="flex-1 px-4 py-2.5 rounded-xl font-sans text-sm outline-none"
                  style={textareaStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <button
                  onClick={addParte}
                  disabled={!inputParte.trim()}
                  className="px-5 py-2.5 rounded-xl font-sans text-sm font-semibold transition-all disabled:opacity-40"
                  style={{ background: 'var(--color-primary)', color: '#fff' }}
                >
                  +
                </button>
              </div>

              {partes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {partes.map(p => (
                    <div
                      key={p.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-sm"
                      style={{ background: '#A0633A18', border: '1.5px solid #A0633A44', color: '#A0633A' }}
                    >
                      <span>{p.etiqueta}</span>
                      <button
                        onClick={() => removeParte(p.id)}
                        className="text-sm leading-none opacity-60 hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setStep('peso')}
              disabled={partes.length < 2}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              {partes.length < 2
                ? `Añade al menos ${2 - partes.length} parte${partes.length === 1 ? ' más' : 's'}`
                : `Explorar mis ${partes.length} partes →`}
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
                      <p className="font-sans text-xs text-text-muted mb-2">{formatDate(entry.createdAt)}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {entry.partes.map(p => (
                          <span
                            key={p.id}
                            className="px-2.5 py-1 rounded-full font-sans text-xs"
                            style={{ background: '#A0633A18', color: '#A0633A' }}
                          >
                            {p.etiqueta}
                          </span>
                        ))}
                      </div>
                    </button>
                    {expandedId === entry.id && (
                      <div className="px-4 pb-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="mt-3 flex flex-col gap-3">
                          {entry.partes.map(p => (
                            <div key={p.id}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-sans text-sm font-semibold text-text">{p.etiqueta}</span>
                                <PesoVisual peso={p.peso} />
                              </div>
                              {p.situacion && (
                                <p className="font-sans text-xs text-text-muted">{p.situacion}</p>
                              )}
                              {p.complementaria?.etiqueta && (
                                <div
                                  className="mt-2 rounded-lg px-3 py-2"
                                  style={{ background: 'var(--color-surface-low)' }}
                                >
                                  <p className="font-sans text-xs text-text-muted">
                                    También: <strong className="text-text">{p.complementaria.etiqueta}</strong>
                                    {p.complementaria.situacion && ` — ${p.complementaria.situacion}`}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Paso 2: Peso y situaciones */}
        {step === 'peso' && (
          <div>
            <p className="font-sans text-sm text-text-muted mb-5 leading-relaxed">
              Para cada parte, indica cuánto espacio ocupa en tu vida (peso) y en qué situaciones o momentos aparece.
            </p>

            <div className="flex flex-col gap-4 mb-6">
              {partes.map(p => (
                <div key={p.id} className="rounded-2xl p-5" style={cardStyle}>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="px-3 py-1 rounded-full font-sans text-sm font-semibold"
                      style={{ background: '#A0633A18', color: '#A0633A' }}
                    >
                      {p.etiqueta}
                    </span>
                  </div>

                  {/* Slider de peso */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide">
                        ¿Cuánto espacio ocupa esta parte en ti?
                      </label>
                      <span className="font-sans text-xs font-bold" style={{ color: '#A0633A' }}>
                        {p.peso}/10
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={p.peso}
                      onChange={e => updateParte(p.id, { peso: Number(e.target.value) })}
                      className="w-full"
                      style={{ accentColor: '#A0633A' }}
                    />
                    <PesoVisual peso={p.peso} />
                  </div>

                  {/* Situación */}
                  <div>
                    <label className="block font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                      ¿En qué momentos o situaciones aparece esta parte?
                    </label>
                    <textarea
                      value={p.situacion}
                      onChange={e => updateParte(p.id, { situacion: e.target.value })}
                      rows={2}
                      placeholder="Cuando tengo que tomar decisiones, cuando estoy con desconocidos..."
                      className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none"
                      style={textareaStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => { setComplementariaIdx(0); setStep('complementarias') }}
              disabled={!canAdvanceFromPeso}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Descubrir partes complementarias →
            </button>
          </div>
        )}

        {/* Paso 3: Partes complementarias */}
        {step === 'complementarias' && parteActual && (
          <div>
            {/* Progreso */}
            <div className="flex gap-1.5 mb-6">
              {partes.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-1.5 rounded-full transition-all"
                  style={{
                    background: i <= complementariaIdx ? '#A0633A' : 'var(--color-border)',
                  }}
                />
              ))}
            </div>

            <div
              className="rounded-2xl p-4 mb-5"
              style={{ background: 'var(--color-primary-container)' }}
            >
              <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                Explorando tu parte
              </p>
              <p className="font-serif text-lg font-semibold text-text mb-1">"{parteActual.etiqueta}"</p>
              <PesoVisual peso={parteActual.peso} />
              {parteActual.situacion && (
                <p className="font-sans text-xs text-text-muted mt-2">
                  Aparece cuando: {parteActual.situacion}
                </p>
              )}
            </div>

            <div className="rounded-2xl p-5 mb-5" style={cardStyle}>
              <p className="font-sans text-sm text-text leading-relaxed mb-4">
                A veces creemos que una parte nos define completamente. Pero casi siempre existe una parte
                aparentemente opuesta que también aparece — en otros contextos, con otras personas,
                en otros momentos. No se contradicen: se complementan.
              </p>

              <p className="font-sans text-sm font-semibold text-text mb-4">
                ¿Puedes identificar una parte tuya que parece opuesta a{' '}
                <span style={{ color: '#A0633A' }}>"{parteActual.etiqueta}"</span>,
                pero que también aparece en tu vida?
              </p>

              <div className="mb-4">
                <label className="block font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                  Esa otra parte es...
                </label>
                <input
                  type="text"
                  value={parteActual.complementaria?.etiqueta ?? ''}
                  onChange={e =>
                    updateComplementaria(
                      parteActual.id,
                      e.target.value,
                      parteActual.complementaria?.situacion ?? ''
                    )
                  }
                  placeholder="Ej: tranquila, valiente, despreocupada..."
                  className="w-full px-4 py-2.5 rounded-xl font-sans text-sm outline-none"
                  style={textareaStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {parteActual.complementaria?.etiqueta && (
                <div>
                  <label className="block font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                    ¿En qué momentos aparece esa parte?
                  </label>
                  <textarea
                    value={parteActual.complementaria?.situacion ?? ''}
                    onChange={e =>
                      updateComplementaria(
                        parteActual.id,
                        parteActual.complementaria?.etiqueta ?? '',
                        e.target.value
                      )
                    }
                    rows={2}
                    placeholder="Cuando estoy con personas de confianza, cuando hago algo que disfruto..."
                    className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none"
                    style={textareaStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
              )}
            </div>

            {/* Visualización de complementariedad */}
            {parteActual.complementaria?.etiqueta && (
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="flex-1 rounded-2xl p-3 text-center"
                  style={{ background: '#A0633A18', border: '1.5px solid #A0633A44' }}
                >
                  <p className="font-sans text-sm font-semibold" style={{ color: '#A0633A' }}>
                    {parteActual.etiqueta}
                  </p>
                </div>
                <span className="font-sans text-lg text-text-muted">+</span>
                <div
                  className="flex-1 rounded-2xl p-3 text-center"
                  style={{ background: 'var(--color-surface-low)', border: '1.5px solid var(--color-border)' }}
                >
                  <p className="font-sans text-sm font-semibold text-text">
                    {parteActual.complementaria.etiqueta}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (complementariaIdx < partes.length - 1) {
                    setComplementariaIdx(i => i + 1)
                  } else {
                    setStep('integracion')
                  }
                }}
                className="flex-1 py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: 'var(--color-primary)', color: '#fff' }}
              >
                {complementariaIdx < partes.length - 1 ? 'Siguiente parte →' : 'Ver mi mapa completo →'}
              </button>
            </div>

            <button
              onClick={() => {
                if (complementariaIdx < partes.length - 1) {
                  setComplementariaIdx(i => i + 1)
                } else {
                  setStep('integracion')
                }
              }}
              className="w-full mt-2 py-3 rounded-full font-sans text-sm transition-colors"
              style={{ background: 'transparent', color: 'var(--color-text-muted)' }}
            >
              Saltar esta parte
            </button>
          </div>
        )}

        {/* Paso 4: Integración */}
        {step === 'integracion' && (
          <div>
            <div
              className="rounded-2xl p-5 mb-5 text-center"
              style={cardStyle}
            >
              <p className="font-serif text-lg font-semibold text-text mb-2">
                Este eres tú
              </p>
              <p className="font-sans text-sm text-text-muted leading-relaxed">
                Todas estas partes coexisten en ti. No se excluyen — se complementan.
                Ninguna te define por completo. Todas tienen su espacio y su momento.
              </p>
            </div>

            {/* Partes originales con sus pesos y complementarias */}
            <div className="flex flex-col gap-4 mb-6">
              {partes.map(p => (
                <div key={p.id} className="rounded-2xl overflow-hidden" style={cardStyle}>
                  <div className="p-4" style={{ borderLeft: '4px solid #A0633A' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-sm font-semibold text-text">{p.etiqueta}</span>
                      <PesoVisual peso={p.peso} />
                    </div>
                    {p.situacion && (
                      <p className="font-sans text-xs text-text-muted">
                        Aparece cuando: {p.situacion}
                      </p>
                    )}
                  </div>

                  {p.complementaria?.etiqueta && (
                    <div
                      className="px-4 py-3"
                      style={{ background: 'var(--color-surface-low)', borderLeft: '4px solid var(--color-border)' }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-sans text-xs text-text-muted">También:</span>
                        <span className="font-sans text-sm font-semibold text-text">{p.complementaria.etiqueta}</span>
                      </div>
                      {p.complementaria.situacion && (
                        <p className="font-sans text-xs text-text-muted">
                          Aparece cuando: {p.complementaria.situacion}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Nube de partes */}
            {todasLasPartes.length > 0 && (
              <div
                className="rounded-2xl p-5 mb-5"
                style={{ background: 'var(--color-primary-container)' }}
              >
                <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">
                  Todas tus partes
                </p>
                <div className="flex flex-wrap gap-2">
                  {todasLasPartes.map((p, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full font-sans text-sm font-medium transition-all"
                      style={{
                        background: p.esOriginal ? '#A0633A' : 'var(--color-surface)',
                        color: p.esOriginal ? '#fff' : 'var(--color-text)',
                        fontSize: `${0.7 + p.peso * 0.04}rem`,
                      }}
                    >
                      {p.etiqueta}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleSave}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Guardar mi mapa →
            </button>
          </div>
        )}

        {/* Paso 5: Guardado */}
        {step === 'guardado' && (
          <div className="text-center">
            <div className="rounded-2xl p-8 mb-5" style={cardStyle}>
              <div className="text-4xl mb-4">🌿</div>
              <h2 className="font-serif text-xl font-semibold text-text mb-3">
                Mapa guardado
              </h2>
              <p className="font-sans text-sm text-text-muted leading-relaxed mb-5">
                Reconocer tu multiplicidad es un acto de honestidad y compasión.
                Eres todo esto, y más.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {todasLasPartes.map((p, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full font-sans text-sm"
                    style={{
                      background: p.esOriginal ? '#A0633A' : 'var(--color-surface-low)',
                      color: p.esOriginal ? '#fff' : 'var(--color-text-muted)',
                    }}
                  >
                    {p.etiqueta}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={handleReset}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Crear otro mapa
            </button>
          </div>
        )}
        <ProfesionalLink modulo="identidad" />
      </div>
    </div>
  )
}
