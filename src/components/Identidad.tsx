import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PageHeader from './ui/PageHeader'
import type { IdentidadEntry } from '../types'

type Step = 'input' | 'balanza' | 'integracion' | 'guardado'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function Identidad() {
  const [entries, setEntries] = useLocalStorage<IdentidadEntry[]>('kora_identidad', [])

  const [step, setStep] = useState<Step>('input')
  const [etiqueta, setEtiqueta] = useState('')
  const [desencadenante, setDesencadenante] = useState('')
  const [opuesto, setOpuesto] = useState('')
  const [situacionDistinta, setSituacionDistinta] = useState('')
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

  const handleSave = () => {
    const entry: IdentidadEntry = {
      id: `id_${Date.now()}`,
      etiqueta,
      desencadenante,
      opuesto,
      situacionDistinta,
      createdAt: new Date().toISOString(),
    }
    setEntries(prev => [entry, ...prev])
    setStep('guardado')
  }

  const handleReset = () => {
    setEtiqueta('')
    setDesencadenante('')
    setOpuesto('')
    setSituacionDistinta('')
    setStep('input')
    setShowHistory(false)
  }

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto px-6 pt-8">
        <PageHeader
          title="Flexibilidad de Identidad"
          subtitle="Tú eres más que cualquier etiqueta"
        />

        {/* Paso 1: Registro de la etiqueta */}
        {step === 'input' && (
          <div>
            <div className="rounded-2xl p-5 mb-5" style={cardStyle}>
              <p className="font-sans text-sm text-text-muted leading-relaxed mb-5">
                A veces nos definimos con etiquetas absolutas — <em>"Soy ansiosa"</em>, <em>"Soy un desastre"</em>, <em>"Soy insegura"</em>.
                Estas etiquetas nos achican. Este ejercicio te ayuda a ver que eres mucho más que eso.
              </p>
              <label className="block font-sans text-sm font-semibold text-text mb-3">
                ¿Con qué etiqueta te defines o te han definido?
              </label>
              <div className="flex items-center gap-2">
                <span
                  className="font-serif text-base font-semibold shrink-0"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Yo soy...
                </span>
                <input
                  type="text"
                  value={etiqueta}
                  onChange={e => setEtiqueta(e.target.value)}
                  placeholder="ansiosa, un fracaso, torpe..."
                  className="flex-1 px-4 py-2.5 rounded-xl font-sans text-sm outline-none"
                  style={textareaStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            <button
              onClick={() => setStep('balanza')}
              disabled={!etiqueta.trim()}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Explorar esta etiqueta →
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
                      <p className="font-sans text-sm text-text">
                        <span className="text-text-muted">Yo soy... </span>
                        <span className="font-semibold">{entry.etiqueta}</span>
                      </p>
                    </button>
                    {expandedId === entry.id && (
                      <div className="px-4 pb-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <div
                            className="rounded-xl p-3"
                            style={{ background: 'var(--color-primary-container)' }}
                          >
                            <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Parte A</p>
                            <p className="font-sans text-xs text-text">
                              Me siento <strong>{entry.etiqueta}</strong> cuando {entry.desencadenante}
                            </p>
                          </div>
                          <div
                            className="rounded-xl p-3"
                            style={{ background: 'var(--color-surface-low)' }}
                          >
                            <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Parte B</p>
                            <p className="font-sans text-xs text-text">
                              También soy <strong>{entry.opuesto}</strong> cuando {entry.situacionDistinta}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Paso 2: Balanza */}
        {step === 'balanza' && (
          <div>
            <div
              className="rounded-2xl p-4 mb-6"
              style={{ background: 'var(--color-primary-container)' }}
            >
              <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                La etiqueta que exploramos
              </p>
              <p className="font-serif text-base font-semibold text-text">
                "Yo soy {etiqueta}"
              </p>
            </div>

            <p className="font-sans text-sm text-text-muted mb-5 leading-relaxed">
              Ahora vamos a ver los dos lados. Esta etiqueta puede ser cierta en algunos momentos,
              pero no define quién eres en todos ellos.
            </p>

            <div className="flex flex-col gap-4 mb-6">
              {/* Lado A */}
              <div
                className="rounded-2xl p-5"
                style={{
                  ...cardStyle,
                  borderLeft: '4px solid #A0633A',
                }}
              >
                <p className="font-sans text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#A0633A' }}>
                  Parte A
                </p>
                <p className="font-sans text-sm text-text mb-3">
                  Tengo una parte que se siente{' '}
                  <span className="font-semibold" style={{ color: '#A0633A' }}>{etiqueta}</span>{' '}
                  cuando...
                </p>
                <textarea
                  value={desencadenante}
                  onChange={e => setDesencadenante(e.target.value)}
                  rows={2}
                  placeholder="me enfrento a una situación nueva, me critican, estoy sola..."
                  className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none"
                  style={textareaStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Separador visual */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
                <span className="font-sans text-xs text-text-muted">y también</span>
                <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
              </div>

              {/* Lado B */}
              <div
                className="rounded-2xl p-5"
                style={{
                  ...cardStyle,
                  borderLeft: '4px solid #7a9e7e',
                }}
              >
                <p className="font-sans text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#7a9e7e' }}>
                  Parte B
                </p>
                <p className="font-sans text-sm text-text mb-3">
                  También tengo una parte que es...
                </p>
                <input
                  type="text"
                  value={opuesto}
                  onChange={e => setOpuesto(e.target.value)}
                  placeholder="tranquila, capaz, segura..."
                  className="w-full px-4 py-2.5 rounded-xl font-sans text-sm outline-none mb-3"
                  style={textareaStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <p className="font-sans text-sm text-text mb-2">cuando...</p>
                <textarea
                  value={situacionDistinta}
                  onChange={e => setSituacionDistinta(e.target.value)}
                  rows={2}
                  placeholder="estoy en un entorno familiar, hago algo que domino, tengo tiempo..."
                  className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none"
                  style={textareaStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            <button
              onClick={() => setStep('integracion')}
              disabled={!desencadenante.trim() || !opuesto.trim() || !situacionDistinta.trim()}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Ver la imagen completa →
            </button>
          </div>
        )}

        {/* Paso 3: Integración */}
        {step === 'integracion' && (
          <div>
            {/* Las dos partes lado a lado */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div
                className="rounded-2xl p-4"
                style={{ background: '#A0633A18', border: '1.5px solid #A0633A44' }}
              >
                <p className="font-sans text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#A0633A' }}>
                  Parte A
                </p>
                <p className="font-sans text-xs text-text leading-relaxed">
                  Me siento <strong>{etiqueta}</strong> cuando {desencadenante}
                </p>
              </div>
              <div
                className="rounded-2xl p-4"
                style={{ background: '#7a9e7e18', border: '1.5px solid #7a9e7e44' }}
              >
                <p className="font-sans text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#7a9e7e' }}>
                  Parte B
                </p>
                <p className="font-sans text-xs text-text leading-relaxed">
                  También soy <strong>{opuesto}</strong> cuando {situacionDistinta}
                </p>
              </div>
            </div>

            {/* Mensaje de integración */}
            <div
              className="rounded-2xl p-6 mb-5 text-center"
              style={cardStyle}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto mb-4"
                style={{ background: 'var(--color-primary-container)' }}
              >
                ◎
              </div>
              <p className="font-serif text-lg font-semibold text-text leading-snug mb-3">
                Tú eres la persona en la que ocurren ambas cosas, dependiendo del momento.
              </p>
              <p className="font-sans text-sm text-text-muted leading-relaxed">
                No eres una etiqueta fija. Eres un ser que siente, cambia y responde al contexto.
                <strong className="text-text"> "{etiqueta}"</strong> es un estado que a veces aparece,
                no una sentencia sobre quién eres.
              </p>
            </div>

            <button
              onClick={handleSave}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Guardar este ejercicio →
            </button>
          </div>
        )}

        {/* Paso 4: Guardado */}
        {step === 'guardado' && (
          <div className="text-center">
            <div className="rounded-2xl p-8 mb-5" style={cardStyle}>
              <div className="text-4xl mb-4">🌿</div>
              <h2 className="font-serif text-xl font-semibold text-text mb-3">
                Guardado
              </h2>
              <p className="font-sans text-sm text-text-muted leading-relaxed mb-5">
                Reconocer que somos múltiples y contradictorios es un acto de honestidad y de compasión hacia uno mismo.
              </p>
              <div
                className="rounded-xl p-4 text-left"
                style={{ background: 'var(--color-primary-container)' }}
              >
                <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                  Lo que has descubierto
                </p>
                <p className="font-sans text-sm text-text leading-relaxed">
                  Tengo una parte que se siente <strong>{etiqueta}</strong> cuando {desencadenante},
                  y también tengo una parte que es <strong>{opuesto}</strong> cuando {situacionDistinta}.
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Explorar otra etiqueta
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
