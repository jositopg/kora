import { useState, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PageHeader from './ui/PageHeader'
import ProfesionalLink from './ui/ProfesionalLink'
import CuriosidadBlock from './ui/CuriosidadBlock'
import ModuleIntro from './ui/ModuleIntro'
import type { ControlEntry, ControlVariable } from '../types'

type Step = 'desahogo' | 'clasificar' | 'cierre' | 'guardado'
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

function fragmentarTexto(texto: string): string[] {
  const limpiar = (arr: string[]) =>
    arr.map(s => s.trim()).filter(s => s.length > 10)

  // 1. Intentar por saltos de línea y signos de puntuación
  let partes = limpiar(texto.split(/[.!?]+\s*\n*|\n{2,}/))
  if (partes.length >= 3) return partes

  // 2. Intentar también por comas + conjunciones/transiciones frecuentes en español
  partes = limpiar(
    texto.split(
      /[.!?]+|,\s*(?=(?:pero|aunque|sin embargo|además|también|por otro lado|porque|y encima|y además|y también|lo que|me preocupa|no sé|siento|creo|tengo miedo))/i
    )
  )
  if (partes.length >= 2) return partes

  // 3. Fallback: cortar por bloques de ~25 palabras en límites naturales
  const palabras = texto.split(/\s+/)
  const bloques: string[] = []
  for (let i = 0; i < palabras.length; i += 25) {
    bloques.push(palabras.slice(i, i + 25).join(' '))
  }
  return limpiar(bloques)
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
      <div className="flex justify-center mb-4">
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
          <circle cx={cx} cy={cy} r={r3} fill="#ede6db" stroke="#c4b8a8" strokeWidth="1.5"/>
          <circle cx={cx} cy={cy} r={r2} fill="#d4b89a" opacity="0.7"/>
          <circle cx={cx} cy={cy} r={r1} fill="#A0633A" opacity="0.9"/>
          <text x={cx} y={cy - r2 - 14} textAnchor="middle" fontSize="9" fill="#7a6b5a" fontFamily="Manrope, sans-serif" fontWeight="600">FUERA DE CONTROL</text>
          <text x={cx} y={cy - r1 - 10} textAnchor="middle" fontSize="8.5" fill="#7a4a28" fontFamily="Manrope, sans-serif" fontWeight="600">INFLUENCIA</text>
          <text x={cx} y={cy + 5} textAnchor="middle" fontSize="8" fill="#fff" fontFamily="Manrope, sans-serif" fontWeight="700">CONTROL</text>
        </svg>
      </div>

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

  const [step, setStep] = useState<Step>('desahogo')
  const [desahogo, setDesahogo] = useState('')
  const [descartadas, setDescartadas] = useState<Set<number>>(new Set())
  const [clasificadas, setClasificadas] = useState<Map<number, Zona>>(new Map())
  const [cierreAccion, setCierreAccion] = useState('')
  const [cierreSoltar, setCierreSoltar] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fragmentos = useMemo(() => fragmentarTexto(desahogo), [desahogo])

  const fragmentosActivos = fragmentos.filter((_, i) => !descartadas.has(i))
  const clasificadasCount = [...clasificadas.entries()].filter(([i]) => !descartadas.has(i)).length
  const atLeastOne = clasificadasCount > 0

  const variablesFromClasificadas: ControlVariable[] = fragmentos
    .map((texto, i) => ({ texto, zona: clasificadas.get(i) }))
    .filter((v, i) => !descartadas.has(i) && v.zona !== undefined) as ControlVariable[]

  const cardStyle = {
    background: 'var(--color-surface)',
    boxShadow: '0 2px 12px rgba(61,50,40,0.08)',
  }

  const inputStyle = {
    background: 'var(--color-bg)',
    color: 'var(--color-text)',
    border: '1.5px solid var(--color-border)',
  }

  const onFocusTA = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'var(--color-primary)'
  }
  const onBlurTA = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'var(--color-border)'
  }

  const setZona = (idx: number, zona: Zona) => {
    setClasificadas(prev => {
      const next = new Map(prev)
      next.set(idx, zona)
      return next
    })
  }

  const descartar = (idx: number) => {
    setDescartadas(prev => new Set([...prev, idx]))
    setClasificadas(prev => {
      const next = new Map(prev)
      next.delete(idx)
      return next
    })
  }

  const handleSave = () => {
    const entry: ControlEntry = {
      id: `ctrl_${Date.now()}`,
      preocupacion: desahogo,
      variables: variablesFromClasificadas,
      reflexiones: {
        accion: cierreAccion,
        soltar: cierreSoltar,
      },
      createdAt: new Date().toISOString(),
    }
    setEntries(prev => [entry, ...prev])
    setStep('guardado')
  }

  const handleReset = () => {
    setDesahogo('')
    setDescartadas(new Set())
    setClasificadas(new Map())
    setCierreAccion('')
    setCierreSoltar('')
    setStep('desahogo')
    setShowHistory(false)
  }

  const handleContinuarDesahogo = () => {
    setDescartadas(new Set())
    setClasificadas(new Map())
    setStep('clasificar')
  }

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto px-6 pt-8">
        <PageHeader
          title="Círculos de Influencia"
          subtitle="Protege tu energía. Actúa donde importa."
        />

        <ModuleIntro
          que="Un espacio para poner en orden lo que te preocupa: primero lo cuentas todo libremente, y después clasificas cada idea según si depende de ti o no."
          para="Cuando nos preocupamos, solemos mezclar en la misma bolsa cosas que podemos cambiar con cosas que no. Separar esas partes con claridad ayuda a dirigir tu energía donde sí puedes actuar, y a practicar la aceptación en lo que no depende de ti."
          pasos={[
            'Cuéntalo todo: escribe tu situación con el máximo detalle, sin filtros.',
            'El texto se fragmenta automáticamente. Para cada idea, elige si tienes control total, puedes influir, o está fuera de tu alcance. Descarta las que no sean relevantes.',
            'Observa el resultado visual y responde dos preguntas de cierre.',
          ]}
        />

        {/* PASO 1: Desahogo */}
        {step === 'desahogo' && (
          <div>
            <div className="rounded-2xl p-5 mb-5" style={cardStyle}>
              <label className="block font-sans text-sm font-semibold text-text mb-2">
                Cuéntalo todo
              </label>
              <p className="font-sans text-xs text-text-muted mb-4 leading-relaxed">
                Escribe con detalle qué está pasando, cómo te sientes, qué pensamientos tienes. No hay estructura, no hay formato correcto. Cuanto más detalle, mejor.
              </p>
              <textarea
                value={desahogo}
                onChange={e => setDesahogo(e.target.value)}
                rows={10}
                placeholder="Escribe aquí todo lo que tienes en la cabeza sobre esta situación..."
                className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none"
                style={inputStyle}
                onFocus={onFocusTA}
                onBlur={onBlurTA}
              />
              {desahogo.trim().length > 0 && (
                <p className="font-sans text-xs text-text-muted mt-2 text-right">
                  {fragmentarTexto(desahogo).length} ideas detectadas
                </p>
              )}
            </div>

            <button
              onClick={handleContinuarDesahogo}
              disabled={fragmentarTexto(desahogo).length < 1}
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
                        <div className="my-3">
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

        {/* PASO 2: Clasificación de fragmentos */}
        {step === 'clasificar' && (
          <div>
            {/* Progreso */}
            <div className="rounded-2xl p-4 mb-4" style={{ background: 'var(--color-primary-container)' }}>
              <div className="flex justify-between items-center mb-1.5">
                <p className="font-sans text-xs text-text-muted">
                  {clasificadasCount} de {fragmentosActivos.length} ideas clasificadas
                </p>
                <p className="font-sans text-xs text-text-muted">
                  {descartadas.size > 0 ? `${descartadas.size} descartadas` : ''}
                </p>
              </div>
              <div className="w-full rounded-full h-1.5" style={{ background: 'var(--color-border)' }}>
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    background: 'var(--color-primary)',
                    width: fragmentosActivos.length > 0
                      ? `${(clasificadasCount / fragmentosActivos.length) * 100}%`
                      : '0%'
                  }}
                />
              </div>
            </div>

            {/* Vista previa del círculo */}
            {variablesFromClasificadas.length > 0 && (
              <div className="rounded-2xl p-4 mb-4" style={cardStyle}>
                <TresCirculos variables={variablesFromClasificadas} />
              </div>
            )}

            {/* Instrucción */}
            <p className="font-sans text-sm text-text-muted mb-4 leading-relaxed text-center">
              Para cada idea, elige su zona. Si no es relevante, descártala.
            </p>

            <div className="flex flex-col gap-3 mb-5">
              {fragmentos.map((texto, idx) => {
                if (descartadas.has(idx)) return null
                const zona = clasificadas.get(idx) ?? null
                return (
                  <div
                    key={idx}
                    className="rounded-2xl p-4 transition-all"
                    style={{
                      ...cardStyle,
                      opacity: zona ? 1 : 1,
                      borderLeft: zona ? `3px solid ${ZONA_COLORS[zona]}` : '3px solid transparent',
                    }}
                  >
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <p className="font-sans text-sm text-text leading-relaxed">"{texto}"</p>
                      <button
                        onClick={() => descartar(idx)}
                        className="font-sans text-xs text-text-muted hover:text-text flex-shrink-0 mt-0.5"
                        title="Descartar esta idea"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {(['total', 'influencia', 'fuera'] as Zona[]).map(z => (
                        <button
                          key={z}
                          onClick={() => setZona(idx, z)}
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
              onClick={() => setStep('cierre')}
              disabled={!atLeastOne}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Ver resultado →
            </button>
          </div>
        )}

        {/* PASO 3: Cierre */}
        {step === 'cierre' && (
          <div>
            <div className="rounded-2xl p-6 mb-5" style={cardStyle}>
              <TresCirculos variables={variablesFromClasificadas} />
            </div>

            <div className="flex flex-col gap-4 mb-5">
              <div className="rounded-2xl p-5" style={cardStyle}>
                <p className="font-sans text-sm font-semibold text-text mb-1">
                  ¿Cuál es la primera acción concreta que puedes dar?
                </p>
                <p className="font-sans text-xs text-text-muted mb-3 leading-relaxed">
                  Aunque sea pequeña. Algo que esté en tu mano hoy.
                </p>
                <textarea
                  value={cierreAccion}
                  onChange={e => setCierreAccion(e.target.value)}
                  rows={3}
                  placeholder="Escribe aquí... (opcional)"
                  className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none"
                  style={inputStyle}
                  onFocus={onFocusTA}
                  onBlur={onBlurTA}
                />
              </div>

              <div className="rounded-2xl p-5" style={cardStyle}>
                <p className="font-sans text-sm font-semibold text-text mb-1">
                  ¿Qué necesitas aprender a soltar?
                </p>
                <p className="font-sans text-xs text-text-muted mb-3 leading-relaxed">
                  De todo lo que está fuera de tu control, ¿qué es lo que más energía te sigue costando dejar ir?
                </p>
                <textarea
                  value={cierreSoltar}
                  onChange={e => setCierreSoltar(e.target.value)}
                  rows={3}
                  placeholder="Escribe aquí... (opcional)"
                  className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none"
                  style={inputStyle}
                  onFocus={onFocusTA}
                  onBlur={onBlurTA}
                />
              </div>
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

        {/* PASO 4: Guardado */}
        {step === 'guardado' && (
          <div className="text-center">
            <div className="rounded-2xl p-8 mb-5" style={cardStyle}>
              <div className="mb-4">
                <TresCirculos variables={variablesFromClasificadas} />
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
