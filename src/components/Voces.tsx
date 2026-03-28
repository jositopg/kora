import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PageHeader from './ui/PageHeader'
import ProfesionalLink from './ui/ProfesionalLink'
import type { VozEntry } from '../types'

type Step = 'input' | 'origen' | 'clasificacion' | 'distancia' | 'redialogo' | 'guardado'

interface OrigenAnswers {
  primeraVez: string
  hayPersona: boolean | null
  quien: string
  protege: string
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function clasificarVoz(answers: OrigenAnswers): 'externa' | 'interna' | 'mixta' {
  const tienePersona = answers.hayPersona === true && answers.quien.trim().length > 0
  const tieneContexto = answers.primeraVez.trim().length > 0
  if (tienePersona && tieneContexto) return 'externa'
  if (tienePersona || tieneContexto) return 'mixta'
  return 'interna'
}

const CLASIFICACION_TEXTO = {
  externa: {
    titulo: 'Esta voz viene de fuera',
    descripcion:
      'Parece que este mensaje no nació en ti. Alguien, en algún momento, te lo dijo o te lo hizo sentir, y con el tiempo lo has interiorizado como si fuera tuyo. Pero no lo es.',
    color: '#9e4a2c',
  },
  mixta: {
    titulo: 'Esta voz tiene raíces externas',
    descripcion:
      'Este mensaje tiene influencias del entorno que te han ido moldeando. Con el tiempo, lo has hecho parte de tu diálogo interno, aunque originalmente no era tuyo del todo.',
    color: '#b8860b',
  },
  interna: {
    titulo: 'Esta voz es una construcción propia',
    descripcion:
      'Parece que este mensaje ha emergido desde dentro de ti, quizás como una forma de protegerte o anticiparte a situaciones difíciles. Vale la pena preguntarte qué necesidad está cubriendo.',
    color: '#6b8c6e',
  },
}

export default function Voces() {
  const [entries, setEntries] = useLocalStorage<VozEntry[]>('kora_voces', [])

  const [step, setStep] = useState<Step>('input')
  const [voz, setVoz] = useState('')
  const [origen, setOrigen] = useState<OrigenAnswers>({
    primeraVez: '',
    hayPersona: null,
    quien: '',
    protege: '',
  })
  const [redialogo, setRedialogo] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const tipo = clasificarVoz(origen)
  const clasificacion = CLASIFICACION_TEXTO[tipo]

  const handleSave = () => {
    const entry: VozEntry = {
      id: `voz_${Date.now()}`,
      voz,
      origen,
      tipo,
      redialogo,
      createdAt: new Date().toISOString(),
    }
    setEntries(prev => [entry, ...prev])
    setStep('guardado')
  }

  const handleReset = () => {
    setVoz('')
    setOrigen({ primeraVez: '', hayPersona: null, quien: '', protege: '' })
    setRedialogo('')
    setStep('input')
    setShowHistory(false)
  }

  const cardStyle = {
    background: 'var(--color-surface)',
    boxShadow: '0 2px 12px rgba(61,50,40,0.08)',
  }

  const textareaStyle = {
    background: 'var(--color-bg)',
    color: 'var(--color-text)',
    border: '1.5px solid var(--color-border)',
  }

  const handleTextareaFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'var(--color-primary)'
  }
  const handleTextareaBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'var(--color-border)'
  }

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto px-6 pt-8">
        <PageHeader
          title="Voces Internas"
          subtitle="Explora de dónde vienen los mensajes que te dices"
        />

        {/* Paso 1: Registro de la voz */}
        {step === 'input' && (
          <div>
            <div className="rounded-2xl p-5 mb-5" style={cardStyle}>
              <label className="block font-sans text-sm font-semibold text-text mb-2">
                ¿Qué mensaje te dices a ti mismo/a con frecuencia?
              </label>
              <p className="font-sans text-xs text-text-muted mb-3">
                Puede ser una frase corta, algo que se repite en tu cabeza en momentos difíciles.
              </p>
              <textarea
                value={voz}
                onChange={e => setVoz(e.target.value)}
                rows={3}
                placeholder='Ej: "No soy suficiente", "Siempre meto la pata", "No merezco que me quieran"...'
                className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none transition-colors"
                style={textareaStyle}
                onFocus={handleTextareaFocus}
                onBlur={handleTextareaBlur}
              />
            </div>

            <button
              onClick={() => setStep('origen')}
              disabled={!voz.trim()}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Explorar su origen →
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
                    style={cardStyle}
                  >
                    <button
                      className="w-full text-left p-4"
                      onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                    >
                      <p className="font-sans text-xs text-text-muted mb-1">{formatDate(entry.createdAt)}</p>
                      <p className="font-sans text-sm text-text italic">"{entry.voz}"</p>
                      <span
                        className="inline-block mt-2 px-3 py-0.5 rounded-full font-sans text-xs"
                        style={{
                          background: `${CLASIFICACION_TEXTO[entry.tipo].color}22`,
                          color: CLASIFICACION_TEXTO[entry.tipo].color,
                        }}
                      >
                        {CLASIFICACION_TEXTO[entry.tipo].titulo}
                      </span>
                    </button>

                    {expandedId === entry.id && (
                      <div
                        className="px-4 pb-4 border-t"
                        style={{ borderColor: 'var(--color-border)' }}
                      >
                        {entry.redialogo && (
                          <div className="mt-3">
                            <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                              Tu nueva voz
                            </p>
                            <p className="font-sans text-sm text-text">"{entry.redialogo}"</p>
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

        {/* Paso 2: Exploración del origen */}
        {step === 'origen' && (
          <div>
            <div
              className="rounded-2xl p-4 mb-6"
              style={{ background: 'var(--color-primary-container)' }}
            >
              <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                La voz que exploramos
              </p>
              <p className="font-sans text-sm text-text italic">"{voz}"</p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Pregunta 1 */}
              <div className="rounded-2xl p-5" style={cardStyle}>
                <label className="block font-sans text-sm font-semibold text-text mb-2">
                  ¿Cuándo fue la primera vez que recuerdas sentir o escuchar algo así?
                </label>
                <p className="font-sans text-xs text-text-muted mb-3">
                  Puede ser un momento concreto, una etapa de tu vida, o una sensación difusa.
                </p>
                <textarea
                  value={origen.primeraVez}
                  onChange={e => setOrigen(prev => ({ ...prev, primeraVez: e.target.value }))}
                  rows={3}
                  placeholder="De pequeña/o, cuando..., En el trabajo..., No lo recuerdo con claridad pero..."
                  className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none"
                  style={textareaStyle}
                  onFocus={handleTextareaFocus}
                  onBlur={handleTextareaBlur}
                />
              </div>

              {/* Pregunta 2 */}
              <div className="rounded-2xl p-5" style={cardStyle}>
                <p className="font-sans text-sm font-semibold text-text mb-3">
                  ¿Hay alguien en tu vida que te haya dicho algo parecido, o que te lo haya hecho sentir?
                </p>
                <div className="flex gap-2 mb-3">
                  {[true, false].map(val => (
                    <button
                      key={String(val)}
                      onClick={() => setOrigen(prev => ({ ...prev, hayPersona: val }))}
                      className="flex-1 py-2.5 rounded-full font-sans text-sm font-medium transition-all"
                      style={{
                        background:
                          origen.hayPersona === val
                            ? 'var(--color-primary)'
                            : 'var(--color-surface-low)',
                        color: origen.hayPersona === val ? '#fff' : 'var(--color-text-muted)',
                      }}
                    >
                      {val ? 'Sí' : 'No'}
                    </button>
                  ))}
                </div>

                {origen.hayPersona === true && (
                  <textarea
                    value={origen.quien}
                    onChange={e => setOrigen(prev => ({ ...prev, quien: e.target.value }))}
                    rows={2}
                    placeholder="¿Quién? ¿En qué momento o situación?"
                    className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none"
                    style={textareaStyle}
                    onFocus={handleTextareaFocus}
                    onBlur={handleTextareaBlur}
                  />
                )}
              </div>

              {/* Pregunta 3 */}
              <div className="rounded-2xl p-5" style={cardStyle}>
                <label className="block font-sans text-sm font-semibold text-text mb-2">
                  ¿Crees que esta voz te protege de algo? ¿De qué?
                </label>
                <p className="font-sans text-xs text-text-muted mb-3">
                  A veces las voces críticas intentan protegernos de la decepción, del rechazo, o de arriesgarnos.
                </p>
                <textarea
                  value={origen.protege}
                  onChange={e => setOrigen(prev => ({ ...prev, protege: e.target.value }))}
                  rows={3}
                  placeholder="Me protege de..., Creo que intenta evitar que..., No lo sé con claridad..."
                  className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none"
                  style={textareaStyle}
                  onFocus={handleTextareaFocus}
                  onBlur={handleTextareaBlur}
                />
              </div>
            </div>

            <button
              onClick={() => setStep('clasificacion')}
              disabled={origen.hayPersona === null || !origen.primeraVez.trim()}
              className="w-full mt-6 py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Ver lo que hemos descubierto →
            </button>
          </div>
        )}

        {/* Paso 3: Clasificación */}
        {step === 'clasificacion' && (
          <div>
            <div
              className="rounded-2xl p-4 mb-5"
              style={{ background: 'var(--color-primary-container)' }}
            >
              <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                La voz que exploramos
              </p>
              <p className="font-sans text-sm text-text italic">"{voz}"</p>
            </div>

            <div
              className="rounded-2xl p-5 mb-5"
              style={{
                background: 'var(--color-surface)',
                borderLeft: `4px solid ${clasificacion.color}`,
                boxShadow: '0 2px 12px rgba(61,50,40,0.08)',
              }}
            >
              <p
                className="font-serif text-lg font-semibold mb-2"
                style={{ color: clasificacion.color }}
              >
                {clasificacion.titulo}
              </p>
              <p className="font-sans text-sm text-text-muted leading-relaxed">
                {clasificacion.descripcion}
              </p>
            </div>

            {origen.protege.trim() && (
              <div
                className="rounded-2xl p-5 mb-5"
                style={cardStyle}
              >
                <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                  Lo que esta voz intenta protegerte
                </p>
                <p className="font-sans text-sm text-text">{origen.protege}</p>
                <p className="font-sans text-xs text-text-muted mt-3 leading-relaxed">
                  Reconocer su intención no significa que su mensaje sea justo o verdadero.
                  Puedes agradecerle su cuidado y elegir una respuesta más amable hacia ti.
                </p>
              </div>
            )}

            <button
              onClick={() => setStep('distancia')}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Tomar distancia →
            </button>
          </div>
        )}

        {/* Paso 4: Toma de distancia */}
        {step === 'distancia' && (
          <div>
            <div
              className="rounded-2xl p-4 mb-5"
              style={{ background: 'var(--color-primary-container)' }}
            >
              <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                La voz que exploramos
              </p>
              <p className="font-sans text-sm text-text italic">"{voz}"</p>
            </div>

            <div className="flex flex-col gap-4 mb-6">
              <div
                className="rounded-2xl p-5"
                style={{ background: 'var(--color-surface)', boxShadow: '0 2px 12px rgba(61,50,40,0.08)' }}
              >
                <p className="font-sans text-sm leading-relaxed text-text">
                  {tipo === 'externa' || tipo === 'mixta' ? (
                    <>
                      Este mensaje no nació en ti.{' '}
                      {origen.quien
                        ? `Vino de ${origen.quien}, en un momento en el que quizás esa persona tampoco tenía las herramientas para tratarte con más cuidado.`
                        : 'Fue absorbido del entorno en un momento en que no tenías las herramientas para cuestionarlo.'}{' '}
                      Puedes reconocerlo como lo que es: una voz prestada.
                    </>
                  ) : (
                    <>
                      Esta voz que construiste probablemente surgió para protegerte.
                      Pero tú ya no eres la persona que necesitaba esa protección de esa manera.
                      Puedes reconocerla con compasión y elegir responderle de otra forma.
                    </>
                  )}
                </p>
              </div>

              <div
                className="rounded-2xl p-5"
                style={{ background: 'var(--color-surface)', boxShadow: '0 2px 12px rgba(61,50,40,0.08)' }}
              >
                <p className="font-sans text-sm font-semibold text-text mb-2">
                  ¿Qué necesitaba esa persona (o tú en ese momento) para no haberte dicho esto?
                </p>
                <p className="font-sans text-xs text-text-muted leading-relaxed">
                  Tómate un momento para reflexionar. No necesitas escribirlo, solo sentirlo.
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep('redialogo')}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Crear una nueva voz →
            </button>
          </div>
        )}

        {/* Paso 5: Rediálogo */}
        {step === 'redialogo' && (
          <div>
            <div className="flex flex-col gap-4 mb-5">
              <div
                className="rounded-2xl p-4"
                style={{ background: 'var(--color-surface-low)' }}
              >
                <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                  La voz antigua
                </p>
                <p className="font-sans text-sm text-text italic line-through opacity-60">"{voz}"</p>
              </div>

              <div
                className="rounded-2xl p-5"
                style={{ background: 'var(--color-surface)', boxShadow: '0 2px 12px rgba(61,50,40,0.08)' }}
              >
                <label className="block font-sans text-sm font-semibold text-text mb-2">
                  ¿Cómo podrías decirte esto mismo de una manera más justa y amable?
                </label>
                <p className="font-sans text-xs text-text-muted mb-3">
                  No tiene que ser perfecta. Solo más honesta y compasiva contigo.
                </p>
                <textarea
                  value={redialogo}
                  onChange={e => setRedialogo(e.target.value)}
                  rows={3}
                  placeholder='Ej: "A veces cometo errores, y eso me hace humano/a", "Estoy aprendiendo a mi ritmo"...'
                  className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none"
                  style={textareaStyle}
                  onFocus={handleTextareaFocus}
                  onBlur={handleTextareaBlur}
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

        {/* Paso 6: Guardado */}
        {step === 'guardado' && (
          <div className="text-center">
            <div
              className="rounded-2xl p-8 mb-5"
              style={{ background: 'var(--color-surface)', boxShadow: '0 2px 12px rgba(61,50,40,0.08)' }}
            >
              <div className="text-4xl mb-4">🌿</div>
              <h2 className="font-serif text-xl font-semibold text-text mb-3">
                Has dado un paso importante
              </h2>
              <p className="font-sans text-sm text-text-muted leading-relaxed mb-5">
                Identificar de dónde vienen las voces que cargamos es el primer paso para no dejarnos gobernar por ellas.
              </p>

              {redialogo && (
                <div
                  className="rounded-xl p-4 text-left"
                  style={{ background: 'var(--color-primary-container)' }}
                >
                  <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                    Tu nueva voz
                  </p>
                  <p className="font-sans text-sm text-text">"{redialogo}"</p>
                </div>
              )}
            </div>

            <button
              onClick={handleReset}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Explorar otra voz
            </button>
          </div>
        )}
        <ProfesionalLink modulo="voces" />
      </div>
    </div>
  )
}
