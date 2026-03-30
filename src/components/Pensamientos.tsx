import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PageHeader from './ui/PageHeader'
import ProfesionalLink from './ui/ProfesionalLink'
import CuriosidadBlock from './ui/CuriosidadBlock'
import ModuleIntro from './ui/ModuleIntro'
import type { PensamientoEntry } from '../types'

interface Question {
  id: string
  text: string
  distortion: string
  definition: string
}

const QUESTIONS: Question[] = [
  {
    id: 'absoluto',
    text: '¿Estás usando palabras absolutas como "siempre" o "nunca"?',
    distortion: 'Pensamiento todo-o-nada',
    definition: 'Tendencia a ver las situaciones en extremos, sin términos medios.',
  },
  {
    id: 'asumir_pensamiento',
    text: '¿Estás asumiendo lo que otros piensan o sienten?',
    distortion: 'Lectura del pensamiento',
    definition: 'Creer saber lo que otros piensan sin evidencia objetiva.',
  },
  {
    id: 'futuro',
    text: '¿Estás prediciendo el futuro negativamente?',
    distortion: 'Adivinación',
    definition: 'Anticipar resultados negativos como si fueran un hecho.',
  },
  {
    id: 'magnificar',
    text: '¿Estás magnificando lo negativo y minimizando lo positivo?',
    distortion: 'Magnificación/Minimización',
    definition: 'Amplificar los aspectos negativos y reducir los positivos.',
  },
  {
    id: 'responsabilidad',
    text: '¿Estás asumiendo responsabilidad por algo que no controlas?',
    distortion: 'Personalización',
    definition: 'Atribuirse responsabilidad excesiva sobre eventos externos.',
  },
  {
    id: 'evidencia',
    text: '¿Estás sacando conclusiones con poca evidencia?',
    distortion: 'Conclusiones precipitadas',
    definition: 'Llegar a conclusiones negativas sin suficiente base racional.',
  },
  {
    id: 'etiqueta',
    text: '¿Estás etiquetándote negativamente a ti mismo/a?',
    distortion: 'Etiquetación',
    definition: 'Asignar etiquetas negativas y permanentes a uno mismo basadas en errores.',
  },
  {
    id: 'filtro',
    text: '¿Estás filtrando solo la información negativa?',
    distortion: 'Filtro mental',
    definition: 'Centrarse exclusivamente en los aspectos negativos ignorando los positivos.',
  },
]

type Step = 'input' | 'questions' | 'results' | 'reframe' | 'saved'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const DISTORSIONES_INFO = [
  {
    nombre: 'Pensamiento todo-o-nada',
    descripcion: 'Ves las situaciones en blanco o negro, sin matices. Si algo no es perfecto, lo consideras un fracaso total. Las palabras "siempre", "nunca", "todo" o "nada" son señales habituales.',
  },
  {
    nombre: 'Lectura del pensamiento',
    descripcion: 'Crees saber lo que los demás están pensando sobre ti, normalmente algo negativo, sin tener evidencia real de ello. Es como intentar leer la mente ajena sin datos objetivos.',
  },
  {
    nombre: 'Adivinación',
    descripcion: 'Anticipas que las cosas van a salir mal y actúas como si esa predicción fuera un hecho. El futuro se convierte en una amenaza antes de que ocurra.',
  },
  {
    nombre: 'Magnificación / Minimización',
    descripcion: 'Amplías la importancia de los errores, problemas o defectos propios, y reduces o ignoras los logros o aspectos positivos. También puede funcionar al revés: exagerar los logros ajenos y minimizar los propios.',
  },
  {
    nombre: 'Personalización',
    descripcion: 'Te atribuyes la responsabilidad de cosas que no dependen de ti o que solo son parcialmente tuyas. Cuando algo sale mal, automáticamente te señalas a ti mismo/a como causa.',
  },
  {
    nombre: 'Conclusiones precipitadas',
    descripcion: 'Llegas a conclusiones negativas sin evidencia suficiente para sostenerlas. Un pequeño dato se convierte en una certeza, saltando pasos lógicos.',
  },
  {
    nombre: 'Etiquetación',
    descripcion: 'En lugar de describir un error concreto, te defines globalmente de forma negativa: "soy un fracasado", "soy tonta", "soy mala persona". Una etiqueta rígida sustituye a una valoración más matizada.',
  },
  {
    nombre: 'Filtro mental',
    descripcion: 'Te centras exclusivamente en un detalle negativo y lo rumiás tanto que toda tu visión de la realidad se vuelve oscura, ignorando el resto de información disponible.',
  },
]

function DistorsionesCognitivas() {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--color-surface)', boxShadow: '0 2px 12px rgba(61,50,40,0.07)' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-sans text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-primary)' }}>
          ¿Qué son las distorsiones cognitivas?
        </span>
        <span className="font-sans text-base text-text-muted" style={{ lineHeight: 1 }}>
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5">
          <p className="font-sans text-sm text-text leading-relaxed mb-4">
            Las distorsiones cognitivas son patrones de pensamiento que se alejan de la realidad de forma sistemática. No son mentiras que nos decimos conscientemente — son formas automáticas en las que nuestra mente interpreta las situaciones, a menudo aprendidas a lo largo de la vida.
          </p>
          <p className="font-sans text-sm text-text leading-relaxed mb-5">
            Todos las tenemos en mayor o menor medida. Identificarlas no significa que el pensamiento sea falso del todo, sino que puede estar distorsionado. Reconocerlas es el primer paso para poder relacionarnos con nuestros pensamientos de forma más flexible y menos automática.
          </p>
          <div className="flex flex-col gap-3">
            {DISTORSIONES_INFO.map((d, i) => (
              <div
                key={i}
                className="rounded-xl p-4"
                style={{ background: 'var(--color-bg)', borderLeft: '3px solid var(--color-primary-light)' }}
              >
                <p className="font-sans text-sm font-semibold text-text mb-1">{d.nombre}</p>
                <p className="font-sans text-xs text-text-muted leading-relaxed">{d.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Pensamientos() {
  const [entries, setEntries] = useLocalStorage<PensamientoEntry[]>('santuario_reflexiones', [])
  const [step, setStep] = useState<Step>('input')
  const [pensamiento, setPensamiento] = useState('')
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({})
  const [reframe, setReframe] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const detectedDistortions = QUESTIONS.filter(q => answers[q.id] === true)

  const handleStartQuestions = () => {
    if (!pensamiento.trim()) return
    setStep('questions')
  }

  const handleAnswer = (id: string, val: boolean | null) => {
    setAnswers(prev => ({ ...prev, [id]: val }))
  }

  const handleFinishQuestions = () => {
    setStep('results')
  }

  const handleGoReframe = () => {
    setStep('reframe')
  }

  const handleSave = () => {
    const entry: PensamientoEntry = {
      id: `pens_${Date.now()}`,
      pensamiento,
      answers,
      distortions: detectedDistortions.map(d => d.distortion),
      reframe,
      createdAt: new Date().toISOString(),
    }
    setEntries(prev => [entry, ...prev])
    setStep('saved')
  }

  const handleReset = () => {
    setPensamiento('')
    setAnswers({})
    setReframe('')
    setStep('input')
    setShowHistory(false)
  }

  const answeredCount = Object.keys(answers).length

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto px-6 pt-8">
        <PageHeader
          title="Laboratorio de Pensamientos"
          subtitle="Examina y transforma los pensamientos que te limitan"
        />

        <ModuleIntro
          que="Un cuestionario guiado para examinar un pensamiento que te genera malestar. A través de preguntas sencillas, explorarás si ese pensamiento es tan cierto y útil como parece, y terminarás construyendo una perspectiva alternativa más equilibrada."
          para="Los pensamientos automáticos negativos influyen directamente en cómo te sientes. Aprender a cuestionarlos no es negar la realidad, sino ver la situación con más matices. Con práctica, este proceso se vuelve más natural e interno."
          pasos={[
            'Escribe el pensamiento que te está generando malestar, tal y como aparece en tu cabeza.',
            'Responde las preguntas de examen con Sí, No o No sé. No hay respuestas correctas, solo honestas.',
            'El sistema identificará qué distorsiones cognitivas pueden estar presentes en ese pensamiento.',
            'Escribe un pensamiento alternativo más equilibrado, que tenga en cuenta todo lo que has explorado.',
            'Guarda el registro. Puedes consultarlo más adelante para ver cómo evolucionan tus patrones.',
          ]}
        />

        {/* Step: Input */}
        {step === 'input' && (
          <div>
            <div
              className="rounded-2xl p-5 mb-5"
              style={{ background: 'var(--color-surface)', boxShadow: '0 2px 12px rgba(61,50,40,0.08)' }}
            >
              <label className="block font-sans text-sm font-semibold text-text mb-3">
                ¿Cuál es el pensamiento que te limita?
              </label>
              <textarea
                value={pensamiento}
                onChange={e => setPensamiento(e.target.value)}
                rows={4}
                placeholder="Escribe aquí el pensamiento que quieres examinar..."
                className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none transition-colors"
                style={{
                  background: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  border: '1.5px solid var(--color-border)',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--color-primary)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--color-border)' }}
              />
            </div>
            <button
              onClick={handleStartQuestions}
              disabled={!pensamiento.trim()}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Examinar pensamiento →
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
                  <div
                    key={entry.id}
                    className="rounded-2xl overflow-hidden"
                    style={{ background: 'var(--color-surface)', boxShadow: '0 2px 8px rgba(61,50,40,0.07)' }}
                  >
                    <button
                      className="w-full text-left p-4"
                      onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                    >
                      <p className="font-sans text-xs text-text-muted mb-1">{formatDate(entry.createdAt)}</p>
                      <p className="font-sans text-sm text-text line-clamp-2">{entry.pensamiento}</p>
                      {entry.distortions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {entry.distortions.map(d => (
                            <span
                              key={d}
                              className="px-2 py-0.5 rounded-full font-sans text-xs"
                              style={{ background: 'var(--color-primary-container)', color: 'var(--color-primary)' }}
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                    {expandedId === entry.id && (
                      <div
                        className="px-4 pb-4 border-t"
                        style={{ borderColor: 'var(--color-border)' }}
                      >
                        {entry.reframe && (
                          <div className="mt-3">
                            <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Pensamiento ajustado</p>
                            <p className="font-sans text-sm text-text">{entry.reframe}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step: Questions */}
        {step === 'questions' && (
          <div>
            <div
              className="rounded-2xl p-4 mb-5"
              style={{ background: 'var(--color-primary-container)' }}
            >
              <p className="font-sans text-xs text-text-muted mb-1 font-semibold uppercase tracking-wide">Pensamiento a examinar</p>
              <p className="font-sans text-sm text-text italic">"{pensamiento}"</p>
            </div>
            <p className="font-sans text-sm text-text-muted mb-4">
              Responde honestamente a estas preguntas ({answeredCount}/{QUESTIONS.length} respondidas):
            </p>

            <div className="flex flex-col gap-3 mb-6">
              {QUESTIONS.map(q => (
                <div
                  key={q.id}
                  className="rounded-2xl p-4"
                  style={{ background: 'var(--color-surface)', boxShadow: '0 2px 8px rgba(61,50,40,0.06)' }}
                >
                  <p className="font-sans text-sm text-text mb-3">{q.text}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAnswer(q.id, true)}
                      className="flex-1 py-2 rounded-full font-sans text-sm font-medium transition-all"
                      style={{
                        background: answers[q.id] === true ? '#A0633A' : 'var(--color-surface-low)',
                        color: answers[q.id] === true ? '#fff' : 'var(--color-text-muted)',
                      }}
                    >
                      Sí
                    </button>
                    <button
                      onClick={() => handleAnswer(q.id, false)}
                      className="flex-1 py-2 rounded-full font-sans text-sm font-medium transition-all"
                      style={{
                        background: answers[q.id] === false ? '#7a6152' : 'var(--color-surface-low)',
                        color: answers[q.id] === false ? '#fff' : 'var(--color-text-muted)',
                      }}
                    >
                      No
                    </button>
                    <button
                      onClick={() => handleAnswer(q.id, null)}
                      className="flex-1 py-2 rounded-full font-sans text-sm font-medium transition-all"
                      style={{
                        background: answers[q.id] === null ? '#c4a882' : 'var(--color-surface-low)',
                        color: answers[q.id] === null ? '#fff' : 'var(--color-text-muted)',
                      }}
                    >
                      No sé
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleFinishQuestions}
              disabled={answeredCount < QUESTIONS.length}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Ver resultado →
            </button>
          </div>
        )}

        {/* Step: Results */}
        {step === 'results' && (
          <div>
            <div
              className="rounded-2xl p-4 mb-5"
              style={{ background: 'var(--color-primary-container)' }}
            >
              <p className="font-sans text-xs text-text-muted mb-1 font-semibold uppercase tracking-wide">Tu pensamiento</p>
              <p className="font-sans text-sm text-text italic">"{pensamiento}"</p>
            </div>

            <DistorsionesCognitivas />

            {detectedDistortions.length === 0 ? (
              <div
                className="rounded-2xl p-5 mb-5"
                style={{ background: 'var(--color-surface)', boxShadow: '0 2px 12px rgba(61,50,40,0.08)' }}
              >
                <p className="font-serif text-lg font-semibold text-accent mb-2">¡Buen trabajo!</p>
                <p className="font-sans text-sm text-text-muted">
                  No hemos detectado distorsiones cognitivas claras en este pensamiento.
                  Eso no significa que no existan, pero es un buen indicio de que tu pensamiento
                  está relativamente ajustado a la realidad.
                </p>
              </div>
            ) : (
              <div className="mb-5">
                <p className="font-sans text-sm text-text-muted mb-3">
                  Hemos identificado {detectedDistortions.length} posible{detectedDistortions.length > 1 ? 's' : ''} distorsión{detectedDistortions.length > 1 ? 'es' : ''} cognitiva{detectedDistortions.length > 1 ? 's' : ''}:
                </p>
                <div className="flex flex-col gap-3">
                  {detectedDistortions.map(d => (
                    <div
                      key={d.id}
                      className="rounded-2xl p-4"
                      style={{ background: 'var(--color-surface)', borderLeft: '4px solid #9e4a2c' }}
                    >
                      <p className="font-sans font-semibold text-sm text-text mb-1">{d.distortion}</p>
                      <p className="font-sans text-xs text-text-muted">{d.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleGoReframe}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Reformular pensamiento →
            </button>
          </div>
        )}

        {/* Step: Reframe */}
        {step === 'reframe' && (
          <div>
            <div
              className="rounded-2xl p-5 mb-5"
              style={{ background: 'var(--color-surface)', boxShadow: '0 2px 12px rgba(61,50,40,0.08)' }}
            >
              <label className="block font-sans text-sm font-semibold text-text mb-2">
                Si tuvieras que explicar esta misma situación a una buena amiga que está pasando por lo mismo,
                ¿qué pensamiento más ajustado a la realidad le dirías?
              </label>
              <p className="font-sans text-xs text-text-muted mb-3 italic">"{pensamiento}"</p>
              <textarea
                value={reframe}
                onChange={e => setReframe(e.target.value)}
                rows={4}
                placeholder="Escribe aquí el pensamiento más compasivo y ajustado a la realidad..."
                className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none"
                style={{
                  background: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  border: '1.5px solid var(--color-border)',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--color-primary)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--color-border)' }}
              />
            </div>
            <button
              onClick={handleSave}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Guardar entrada →
            </button>
          </div>
        )}

        {/* Step: Saved */}
        {step === 'saved' && (
          <div>
            <div
              className="rounded-2xl p-8 mb-5 text-center"
              style={{ background: 'var(--color-surface)', boxShadow: '0 2px 12px rgba(61,50,40,0.08)' }}
            >
              <h2 className="font-serif text-xl font-semibold text-text mb-2">Entrada guardada</h2>
              <p className="font-sans text-sm text-text-muted">
                Has completado un ciclo de reestructuración cognitiva. Este proceso, practicado con regularidad,
                ayuda a flexibilizar los patrones de pensamiento rígidos.
              </p>
              {reframe && (
                <div
                  className="mt-4 rounded-xl p-4 text-left"
                  style={{ background: 'var(--color-primary-container)' }}
                >
                  <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Tu pensamiento ajustado</p>
                  <p className="font-sans text-sm text-text">{reframe}</p>
                </div>
              )}
            </div>

            <button
              onClick={handleReset}
              className="w-full mt-5 py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Examinar otro pensamiento
            </button>
          </div>
        )}
        <CuriosidadBlock texto="Esta dinámica está inspirada en la Terapia Cognitivo-Conductual (TCC), uno de los enfoques con más evidencia en psicología clínica. La idea central es que no son los hechos en sí los que generan malestar, sino la interpretación que hacemos de ellos." />
        <ProfesionalLink modulo="pensamientos" />
      </div>
    </div>
  )
}
