import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PageHeader from './ui/PageHeader'
import ProfesionalLink from './ui/ProfesionalLink'
import CuriosidadBlock from './ui/CuriosidadBlock'
import ModuleIntro from './ui/ModuleIntro'
import type { ControlEntry, ControlVariable } from '../types'

type Step = 'preocupacion' | 'validacion' | 'clasificar' | 'reflexion' | 'guardado'
type Zona = 'total' | 'influencia' | 'fuera'

const ZONA_LABELS: Record<Zona, string> = {
  total: 'Control Total',
  influencia: 'Puedo Influir',
  fuera: 'Fuera de mi Control',
}

const ZONA_COLORS: Record<Zona, string> = {
  total: '#A0633A',
  influencia: '#b5906a',
  fuera: '#c4b8a8',
}

const SOCRATIC_Q: Record<Zona, (texto: string) => string> = {
  total: (t) => `Tienes control total sobre "${t}". ¿Qué acción concreta puedes tomar hoy, aunque sea pequeña?`,
  influencia: (t) => `Puedes influir en "${t}", aunque no controlarlo del todo. ¿Qué está en tu mano hacer para inclinarlo en la dirección que deseas?`,
  fuera: (t) => `"${t}" está fuera de tu control. ¿Qué necesitarías aceptar o soltar para no gastar más energía en ello?`,
}

function TresCirculos({ variables }: { variables: ControlVariable[] }) {
  const size = 260
  const cx = size / 2
  const cy = size / 2
  const r3 = 120
  const r2 = 78
  const r1 = 38

  const byZona = {
    total: variables.filter(v => v.zona === 'total'),
    influencia: variables.filter(v => v.zona === 'influencia'),
    fuera: variables.filter(v => v.zona === 'fuera'),
  }

  return (
    <div className="w-full">
      {/* SVG circles — clean, no text inside */}
      <div className="flex justify-center mb-4">
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
          <circle cx={cx} cy={cy} r={r3} fill="#ede6db" stroke="#c4b8a8" strokeWidth="1.5"/>
          <circle cx={cx} cy={cy} r={r2} fill="#d4b89a" opacity="0.7"/>
          <circle cx={cx} cy={cy} r={r1} fill="#A0633A" opacity="0.9"/>
          {/* Zone labels always visible inside rings */}
          <text x={cx} y={cy - r2 - 14} textAnchor="middle" fontSize="9" fill="#7a6b5a" fontFamily="Manrope, sans-serif" fontWeight="600">FUERA DE CONTROL</text>
          <text x={cx} y={cy - r1 - 10} textAnchor="middle" fontSize="8.5" fill="#7a4a28" fontFamily="Manrope, sans-serif" fontWeight="600">INFLUENCIA</text>
          <text x={cx} y={cy + 5} textAnchor="middle" fontSize="8" fill="#fff" fontFamily="Manrope, sans-serif" fontWeight="700">CONTROL</text>
        </svg>
      </div>

      {/* Legend outside the circles — fully readable */}
      {(['fuera', 'influencia', 'total'] as const).map(zona => {
        const items = byZona[zona]
        if (items.length === 0) return null
        return (
          <div key={zona} className="mb-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: ZONA_COLORS[zona] }}/>
              <span className="font-sans text-xs font-semibold uppercase tracking-wide" style={{ color: ZONA_COLORS[zona] }}>
                {ZONA_LABELS[zona]}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pl-4">
              {items.map((v, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full font-sans text-xs font-medium"
                  style={{ background: `${ZONA_COLORS[zona]}18`, color: 'var(--color-text)', border: `1px solid ${ZONA_COLORS[zona]}40` }}
                >
                  {v.texto}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function Control() {
  const [entries, setEntries] = useLocalStorage<ControlEntry[]>('kora_control_v2', [])

  const [step, setStep] = useState<Step>('preocupacion')
  const [preocupacion, setPreocupacion] = useState('')
  const [varInput, setVarInput] = useState('')
  const [variables, setVariables] = useState<string[]>([])
  const [clasificadas, setClasificadas] = useState<ControlVariable[]>([])
  const [reflexiones, setReflexiones] = useState<Record<string, string>>({})
  const [showHistory, setShowHistory] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const cardStyle = {
    background: 'var(--color-surface)',
    boxShadow: '0 2px 12px rgba(61,50,40,0.08)',
  }

  const inputStyle = {
    background: 'var(--color-bg)',
    color: 'var(--color-text)',
    border: '1.5px solid var(--color-border)',
  }

  const onFocus = (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--color-primary)'
  }
  const onBlur = (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--color-border)'
  }

  const addVariable = () => {
    if (!varInput.trim()) return
    setVariables(prev => [...prev, varInput.trim()])
    setVarInput('')
  }

  const removeVariable = (idx: number) => {
    setVariables(prev => prev.filter((_, i) => i !== idx))
  }

  const setZona = (texto: string, zona: Zona) => {
    setClasificadas(prev => {
      const existing = prev.find(v => v.texto === texto)
      if (existing) return prev.map(v => v.texto === texto ? { ...v, zona } : v)
      return [...prev, { texto, zona }]
    })
  }

  const getZona = (texto: string): Zona | null => {
    return clasificadas.find(v => v.texto === texto)?.zona ?? null
  }

  const allClasificadas = variables.every(v => getZona(v) !== null)

  const handleSave = () => {
    const entry: ControlEntry = {
      id: `ctrl_${Date.now()}`,
      preocupacion,
      variables: clasificadas,
      reflexiones,
      createdAt: new Date().toISOString(),
    }
    setEntries(prev => [entry, ...prev])
    setStep('guardado')
  }

  const handleReset = () => {
    setPreocupacion('')
    setVarInput('')
    setVariables([])
    setClasificadas([])
    setReflexiones({})
    setStep('preocupacion')
    setShowHistory(false)
  }

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto px-6 pt-8">
        <PageHeader
          title="Círculos de Influencia"
          subtitle="Protege tu energía. Actúa donde importa."
        />

        <ModuleIntro
          que="Un ejercicio visual para analizar una preocupación: la desglosas en partes concretas y clasificas cada una según si tienes control total, puedes influir parcialmente, o está completamente fuera de tu alcance."
          para="Cuando nos preocupamos, solemos mezclar en la misma bolsa cosas que podemos cambiar con cosas que no. Esto genera ansiedad e inacción. Separar esas variables con claridad ayuda a dirigir tu energía donde sí puedes actuar, y a practicar la aceptación en lo que no depende de ti."
          pasos={[
            'Escribe qué te quita la paz hoy: la situación o preocupación que tienes más presente.',
            'Desglosa esa preocupación en aspectos o variables concretas. Añádelas una a una.',
            'Lee el mensaje de pausa que aparecerá antes de continuar. Es parte del ejercicio.',
            'Clasifica cada variable en su círculo: ¿tienes control total, puedes influir en ella, o está completamente fuera de tu alcance?',
            'Responde las preguntas de cierre adaptadas a cada zona: en lo controlable, hacia la acción; en lo incontrolable, hacia la aceptación.',
          ]}
        />

        {/* Paso 1: Preocupación + variables */}
        {step === 'preocupacion' && (
          <div>
            <div className="rounded-2xl p-5 mb-5" style={cardStyle}>
              <label className="block font-sans text-sm font-semibold text-text mb-2">
                ¿Qué te quita la paz hoy?
              </label>
              <p className="font-sans text-xs text-text-muted mb-3 leading-relaxed">
                Describe brevemente la situación o preocupación que tienes presente.
              </p>
              <textarea
                value={preocupacion}
                onChange={e => setPreocupacion(e.target.value)}
                rows={3}
                placeholder="Ej: Estoy esperando noticias que no dependen de mí..."
                className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none"
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            {preocupacion.trim() && (
              <div className="rounded-2xl p-5 mb-5" style={cardStyle}>
                <label className="block font-sans text-sm font-semibold text-text mb-2">
                  Desglosa la preocupación en partes
                </label>
                <p className="font-sans text-xs text-text-muted mb-3 leading-relaxed">
                  ¿Qué aspectos concretos componen esta situación? Añade cada uno por separado.
                </p>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={varInput}
                    onChange={e => setVarInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addVariable()}
                    placeholder="Ej: La respuesta de la otra persona..."
                    className="flex-1 px-4 py-2.5 rounded-xl font-sans text-sm outline-none"
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                  <button
                    onClick={addVariable}
                    disabled={!varInput.trim()}
                    className="px-4 py-2.5 rounded-xl font-sans text-sm font-semibold disabled:opacity-40"
                    style={{ background: 'var(--color-primary-container)', color: 'var(--color-primary)' }}
                  >
                    + Añadir
                  </button>
                </div>
                {variables.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {variables.map((v, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl"
                        style={{ background: 'var(--color-surface-low)' }}
                      >
                        <span className="font-sans text-sm text-text">{v}</span>
                        <button
                          onClick={() => removeVariable(idx)}
                          className="font-sans text-text-muted hover:text-text text-base flex-shrink-0"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setStep('validacion')}
              disabled={!preocupacion.trim() || variables.length === 0}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Continuar →
            </button>

            {entries.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full mt-3 py-3 rounded-full font-sans text-sm font-medium"
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
                      <p className="font-sans text-sm text-text line-clamp-2">{entry.preocupacion}</p>
                      <div className="flex gap-3 mt-2 flex-wrap">
                        {(['total', 'influencia', 'fuera'] as Zona[]).map(z => {
                          const n = entry.variables?.filter(v => v.zona === z).length ?? 0
                          if (!n) return null
                          return (
                            <span key={z} className="font-sans text-xs" style={{ color: ZONA_COLORS[z] }}>
                              {n} {ZONA_LABELS[z].toLowerCase()}
                            </span>
                          )
                        })}
                      </div>
                    </button>
                    {expandedId === entry.id && (
                      <div className="px-4 pb-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="flex justify-center my-3">
                          <TresCirculos variables={entry.variables ?? []} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Paso 2: Pantalla de validación obligatoria */}
        {step === 'validacion' && (
          <div>
            <div
              className="rounded-2xl p-6 mb-5"
              style={{ background: 'rgba(255,248,244,0.9)', boxShadow: '0 2px 16px rgba(61,50,40,0.10)', border: '1.5px solid var(--color-border)' }}
            >
              <p className="font-serif text-lg font-semibold text-text mb-4 leading-snug">
                Antes de continuar
              </p>
              <p className="font-sans text-sm text-text leading-relaxed mb-4">
                Es completamente natural y válido sentir malestar ante lo que no podemos controlar. No tienes que dejar de sentirlo.
              </p>
              <p className="font-sans text-sm text-text leading-relaxed mb-4">
                El objetivo de este ejercicio no es eliminar la preocupación, sino <strong>ayudarte a proteger tu energía</strong>: dirigirla hacia donde sí puedes actuar y encontrar alivio en soltar lo que no te pertenece gestionar.
              </p>
              <p className="font-sans text-sm text-text-muted leading-relaxed italic">
                Si lo que estás sintiendo es un malestar intenso o sostenido, este espacio puede ser un punto de partida, pero no un sustituto de acompañamiento profesional.
              </p>
            </div>

            <button
              onClick={() => setStep('clasificar')}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Entendido, continuar
            </button>
          </div>
        )}

        {/* Paso 3: Clasificar */}
        {step === 'clasificar' && (
          <div>
            <div className="rounded-2xl p-4 mb-5" style={{ background: 'var(--color-primary-container)' }}>
              <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Tu preocupación</p>
              <p className="font-sans text-sm font-semibold text-text">"{preocupacion}"</p>
            </div>

            <div className="flex justify-center mb-5">
              <TresCirculos variables={clasificadas} />
            </div>

            {/* Leyenda */}
            <div className="flex justify-center gap-4 mb-5 flex-wrap">
              {(['total', 'influencia', 'fuera'] as Zona[]).map(z => (
                <div key={z} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: ZONA_COLORS[z] }}/>
                  <span className="font-sans text-xs text-text-muted">{ZONA_LABELS[z]}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 mb-5">
              {variables.map((v, idx) => {
                const zona = getZona(v)
                return (
                  <div key={idx} className="rounded-2xl p-4" style={cardStyle}>
                    <p className="font-sans text-sm text-text font-medium mb-3">"{v}"</p>
                    <div className="flex gap-2 flex-wrap">
                      {(['total', 'influencia', 'fuera'] as Zona[]).map(z => (
                        <button
                          key={z}
                          onClick={() => setZona(v, z)}
                          className="flex-1 py-2 rounded-full font-sans text-xs font-semibold transition-all min-w-[80px]"
                          style={{
                            background: zona === z ? ZONA_COLORS[z] : 'var(--color-surface-low)',
                            color: zona === z ? '#fff' : 'var(--color-text-muted)',
                          }}
                        >
                          {ZONA_LABELS[z]}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              onClick={() => setStep('reflexion')}
              disabled={!allClasificadas}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Ver reflexiones →
            </button>
          </div>
        )}

        {/* Paso 4: Reflexión socrática */}
        {step === 'reflexion' && (
          <div>
            <div className="rounded-2xl p-4 mb-5" style={{ background: 'var(--color-primary-container)' }}>
              <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Tu preocupación</p>
              <p className="font-sans text-sm font-semibold text-text">"{preocupacion}"</p>
            </div>

            <div className="flex justify-center mb-5">
              <TresCirculos variables={clasificadas} />
            </div>

            <div className="flex flex-col gap-4 mb-5">
              {clasificadas.map((v, idx) => (
                <div key={idx} className="rounded-2xl p-5" style={cardStyle}>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: ZONA_COLORS[v.zona] }}
                    />
                    <span className="font-sans text-xs font-semibold uppercase tracking-wide" style={{ color: ZONA_COLORS[v.zona] }}>
                      {ZONA_LABELS[v.zona]}
                    </span>
                  </div>
                  <p className="font-sans text-sm text-text leading-relaxed mb-3">
                    {SOCRATIC_Q[v.zona](v.texto)}
                  </p>
                  <textarea
                    value={reflexiones[v.texto] ?? ''}
                    onChange={e => setReflexiones(prev => ({ ...prev, [v.texto]: e.target.value }))}
                    rows={2}
                    placeholder="Escribe tu respuesta... (opcional)"
                    className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none"
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
              ))}
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
                <TresCirculos variables={clasificadas} />
              </div>
              <h2 className="font-serif text-xl font-semibold text-text mb-3">Guardado</h2>
              <p className="font-sans text-sm text-text-muted leading-relaxed">
                Reconocer lo que no puedes controlar no es rendirse — es recuperar energía para lo que sí está en tus manos.
              </p>
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

        <CuriosidadBlock texto="Este ejercicio recoge una idea que tiene siglos: la filosofía estoica ya proponía distinguir entre lo que depende de nosotros y lo que no. En psicología contemporánea, la Terapia de Aceptación y Compromiso (ACT) la ha convertido en una herramienta clínica. Dirigir energía hacia lo controlable y practicar la aceptación en lo que no lo es reduce significativamente la ansiedad." />
        <ProfesionalLink modulo="control" />
      </div>
    </div>
  )
}
