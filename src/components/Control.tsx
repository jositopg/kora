import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PageHeader from './ui/PageHeader'
import ProfesionalLink from './ui/ProfesionalLink'
import CuriosidadBlock from './ui/CuriosidadBlock'
import ModuleIntro from './ui/ModuleIntro'
import type { ControlEntry, ControlVariable } from '../types'

type Step = 'desahogo' | 'bloques' | 'clasificacion' | 'visual' | 'guardado'
type Zona = 'total' | 'influencia' | 'fuera'

interface Bloque {
  id: string
  titulo: string
  subtitulo: string
  placeholder: string
  preguntaReflexion: string
}

const BLOQUES: Bloque[] = [
  {
    id: 'hecho',
    titulo: 'El Hecho (Objetivo)',
    subtitulo: 'Lo que ocurrió, tal como ocurrió, sin interpretaciones.',
    placeholder: 'Ej: El proyecto fue rechazado en la reunión de ayer...',
    preguntaReflexion: '¿Es algo que ya ocurrió y está cerrado, o hay aspectos que todavía están abiertos y pueden cambiar?',
  },
  {
    id: 'acciones',
    titulo: 'Mis Acciones',
    subtitulo: 'Lo que hiciste, dijiste o decidiste. Lo que podrías hacer.',
    placeholder: 'Ej: Presenté el informe, respondí de cierta manera, no dije lo que pensaba...',
    preguntaReflexion: '¿Hay algo que puedas hacer diferente a partir de ahora, aunque sea pequeño?',
  },
  {
    id: 'entorno',
    titulo: 'El Entorno / Los Otros',
    subtitulo: 'Lo que depende de otras personas o de circunstancias externas.',
    placeholder: 'Ej: La actitud de mi jefe, la decisión del equipo, el contexto económico...',
    preguntaReflexion: '¿Puedes influir de alguna manera en esto, o depende completamente de otros o de las circunstancias?',
  },
  {
    id: 'interno',
    titulo: 'Mis Pensamientos / Emociones',
    subtitulo: 'Cómo te sientes y qué te estás diciendo a ti mismo/a.',
    placeholder: 'Ej: Siento que no soy suficiente, me da miedo que se repita, estoy agotado/a...',
    preguntaReflexion: '¿Puedes trabajar en cómo te estás hablando a ti mismo/a o en cómo estás gestionando lo que sientes?',
  },
]

const ZONA_INFO: Record<Zona, { label: string; descripcion: string; color: string; bg: string }> = {
  total: {
    label: 'Control Total',
    descripcion: 'Depende directamente de ti. Puedes actuar hoy.',
    color: '#A0633A',
    bg: '#A0633A18',
  },
  influencia: {
    label: 'Puedo Influir',
    descripcion: 'No lo controlas del todo, pero puedes tener algún efecto.',
    color: '#b5906a',
    bg: '#b5906a18',
  },
  fuera: {
    label: 'Fuera de mi Control',
    descripcion: 'No depende de ti. Necesita aceptación, no más energía.',
    color: '#9e9285',
    bg: '#9e928518',
  },
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

      {(['total', 'influencia', 'fuera'] as const).map(zona => {
        const items = byZona[zona]
        if (items.length === 0) return null
        const info = ZONA_INFO[zona]
        return (
          <div key={zona} className="mb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: info.color }}/>
              <span className="font-sans text-xs font-semibold uppercase tracking-wide" style={{ color: info.color }}>
                {info.label}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pl-4">
              {items.map((v, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full font-sans text-xs font-medium"
                  style={{ background: info.bg, color: 'var(--color-text)', border: `1px solid ${info.color}40` }}
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
  const [bloquesTexto, setBloquesTexto] = useState<Record<string, string>>({
    hecho: '', acciones: '', entorno: '', interno: '',
  })
  const [zonas, setZonas] = useState<Record<string, Zona | null>>({
    hecho: null, acciones: null, entorno: null, interno: null,
  })
  const [accion, setAccion] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const bloquesConTexto = BLOQUES.filter(b => bloquesTexto[b.id].trim().length > 0)
  const todasClasificadas = bloquesConTexto.every(b => zonas[b.id] !== null)

  const variables: ControlVariable[] = bloquesConTexto
    .filter(b => zonas[b.id] !== null)
    .map(b => ({ texto: bloquesTexto[b.id].trim(), zona: zonas[b.id] as Zona }))

  const cardStyle = {
    background: 'var(--color-surface)',
    boxShadow: '0 2px 12px rgba(61,50,40,0.08)',
  }

  const inputStyle = {
    background: 'var(--color-bg)',
    color: 'var(--color-text)',
    border: '1.5px solid var(--color-border)',
  }

  const onFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'var(--color-primary)'
  }
  const onBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'var(--color-border)'
  }

  const handleSave = () => {
    const entry: ControlEntry = {
      id: `ctrl_${Date.now()}`,
      preocupacion: desahogo,
      variables,
      reflexiones: { accion },
      createdAt: new Date().toISOString(),
    }
    setEntries(prev => [entry, ...prev])
    setStep('guardado')
  }

  const handleReset = () => {
    setDesahogo('')
    setBloquesTexto({ hecho: '', acciones: '', entorno: '', interno: '' })
    setZonas({ hecho: null, acciones: null, entorno: null, interno: null })
    setAccion('')
    setStep('desahogo')
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
          que="Un ejercicio para poner orden en lo que te preocupa: separas la situación en sus partes naturales, reflexionas sobre cada una y ves con claridad qué puedes controlar y qué necesitas soltar."
          para="Cuando nos preocupamos, mezclamos hechos, emociones, acciones y lo que depende de otros como si fueran una sola cosa. Separarlos ayuda a dirigir tu energía donde sí puedes actuar."
          pasos={[
            'Cuéntalo todo libremente, sin filtros.',
            'Divide la situación en cuatro bloques: el hecho, tus acciones, el entorno y tus emociones.',
            'Reflexiona sobre cada bloque y clasifícalo en su zona.',
            'Observa el resultado visual y anota qué puedes hacer.',
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
                Escribe todo lo que tienes en la cabeza: qué pasó, cómo te sientes, qué te preocupa. Sin estructura, sin filtros. Es solo para ti.
              </p>
              <textarea
                value={desahogo}
                onChange={e => setDesahogo(e.target.value)}
                rows={10}
                placeholder="Escribe aquí todo lo que tienes en la cabeza sobre esta situación..."
                className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none"
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            <button
              onClick={() => setStep('bloques')}
              disabled={desahogo.trim().length < 20}
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
                            <span key={z} className="font-sans text-xs" style={{ color: ZONA_INFO[z].color }}>
                              {ZONA_INFO[z].label}
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

        {/* PASO 2: Cuatro bloques */}
        {step === 'bloques' && (
          <div>
            {/* Desahogo visible como referencia */}
            <div
              className="rounded-2xl p-4 mb-5"
              style={{ background: 'rgba(255,248,244,0.85)', border: '1px solid var(--color-border)' }}
            >
              <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Lo que has escrito</p>
              <p className="font-sans text-sm text-text leading-relaxed line-clamp-4 whitespace-pre-wrap">
                {desahogo}
              </p>
            </div>

            <p className="font-sans text-sm text-text-muted mb-5 leading-relaxed text-center">
              Ahora separa lo que has escrito en estos cuatro bloques. Rellena solo los que apliquen.
            </p>

            <div className="flex flex-col gap-4 mb-5">
              {BLOQUES.map(bloque => (
                <div key={bloque.id} className="rounded-2xl p-5" style={cardStyle}>
                  <p className="font-sans text-sm font-semibold text-text mb-1">{bloque.titulo}</p>
                  <p className="font-sans text-xs text-text-muted mb-3 leading-relaxed">{bloque.subtitulo}</p>
                  <textarea
                    value={bloquesTexto[bloque.id]}
                    onChange={e => setBloquesTexto(prev => ({ ...prev, [bloque.id]: e.target.value }))}
                    rows={3}
                    placeholder={bloque.placeholder}
                    className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none"
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep('clasificacion')}
              disabled={bloquesConTexto.length === 0}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Reflexionar y clasificar →
            </button>
          </div>
        )}

        {/* PASO 3: Reflexión y clasificación por bloque */}
        {step === 'clasificacion' && (
          <div>
            {/* Leyenda de zonas */}
            <div className="rounded-2xl p-4 mb-5" style={{ background: 'rgba(255,248,244,0.85)', border: '1px solid var(--color-border)' }}>
              <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Qué significa cada zona</p>
              <div className="flex flex-col gap-2">
                {(['total', 'influencia', 'fuera'] as Zona[]).map(z => (
                  <div key={z} className="flex items-start gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1" style={{ background: ZONA_INFO[z].color }}/>
                    <div>
                      <span className="font-sans text-xs font-semibold" style={{ color: ZONA_INFO[z].color }}>{ZONA_INFO[z].label} — </span>
                      <span className="font-sans text-xs text-text-muted">{ZONA_INFO[z].descripcion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-5">
              {bloquesConTexto.map(bloque => {
                const zona = zonas[bloque.id]
                return (
                  <div
                    key={bloque.id}
                    className="rounded-2xl p-5"
                    style={{
                      ...cardStyle,
                      borderLeft: zona ? `3px solid ${ZONA_INFO[zona].color}` : '3px solid transparent',
                    }}
                  >
                    {/* Título + lo que escribió */}
                    <p className="font-sans text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-muted)' }}>
                      {bloque.titulo}
                    </p>
                    <p className="font-sans text-sm text-text leading-relaxed mb-4 italic">
                      "{bloquesTexto[bloque.id].trim()}"
                    </p>

                    {/* Pregunta de reflexión */}
                    <p className="font-sans text-sm font-medium text-text mb-4 leading-relaxed">
                      {bloque.preguntaReflexion}
                    </p>

                    {/* Botones de zona */}
                    <div className="flex gap-2 flex-wrap">
                      {(['total', 'influencia', 'fuera'] as Zona[]).map(z => (
                        <button
                          key={z}
                          onClick={() => setZonas(prev => ({ ...prev, [bloque.id]: z }))}
                          className="flex-1 py-2.5 rounded-full font-sans text-xs font-semibold transition-all min-w-[90px]"
                          style={{
                            background: zona === z ? ZONA_INFO[z].color : 'var(--color-surface-low)',
                            color: zona === z ? '#fff' : 'var(--color-text-muted)',
                          }}
                        >
                          {ZONA_INFO[z].label}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              onClick={() => setStep('visual')}
              disabled={!todasClasificadas}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Ver el resultado →
            </button>
          </div>
        )}

        {/* PASO 4: Visual + qué puedo hacer */}
        {step === 'visual' && (
          <div>
            <div className="rounded-2xl p-6 mb-5" style={cardStyle}>
              <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-4 text-center">
                Tu situación, organizada
              </p>
              <TresCirculos variables={variables} />
            </div>

            {/* Qué puedo hacer */}
            <div className="rounded-2xl p-5 mb-5" style={cardStyle}>
              <p className="font-sans text-sm font-semibold text-text mb-1">
                ¿Qué puedes hacer a partir de aquí?
              </p>
              <p className="font-sans text-xs text-text-muted mb-3 leading-relaxed">
                Mirando lo que está en tu control o en tu zona de influencia, ¿cuál sería tu primer paso?
              </p>
              <textarea
                value={accion}
                onChange={e => setAccion(e.target.value)}
                rows={3}
                placeholder="Escribe aquí... (opcional)"
                className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none"
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            {/* Mensaje sobre lo que está fuera de control */}
            {variables.some(v => v.zona === 'fuera') && (
              <div
                className="rounded-2xl p-4 mb-5"
                style={{ background: 'rgba(255,248,244,0.85)', border: '1px solid var(--color-border)' }}
              >
                <p className="font-sans text-sm text-text leading-relaxed italic">
                  Lo que has identificado como fuera de tu control no necesita más energía tuya — necesita aceptación. Eso también es un acto de cuidado hacia ti mismo/a.
                </p>
              </div>
            )}

            <button
              onClick={handleSave}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Guardar →
            </button>
          </div>
        )}

        {/* PASO 5: Guardado */}
        {step === 'guardado' && (
          <div className="text-center">
            <div className="rounded-2xl p-8 mb-5" style={cardStyle}>
              <div className="mb-4">
                <TresCirculos variables={variables} />
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
