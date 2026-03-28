import { useState } from 'react'
import PageHeader from './ui/PageHeader'
import ProfesionalLink from './ui/ProfesionalLink'
import ModuleIntro from './ui/ModuleIntro'
import { EMOTIONS } from '../data/emotions'
import type { TertiaryEmotion } from '../types'

type Level = 'primary' | 'secondary' | 'tertiary' | 'confirmed'

export default function Emociones() {
  const [level, setLevel] = useState<Level>('primary')
  const [primaryIdx, setPrimaryIdx] = useState<number | null>(null)
  const [secondaryIdx, setSecondaryIdx] = useState<number | null>(null)
  const [selectedTertiary, setSelectedTertiary] = useState<TertiaryEmotion | null>(null)
  const [reflexionCausa, setReflexionCausa] = useState('')
  const [reflexionPasado, setReflexionPasado] = useState('')
  const [reflexionMensaje, setReflexionMensaje] = useState('')

  const selectedPrimary = primaryIdx !== null ? EMOTIONS[primaryIdx] : null
  const selectedSecondary =
    selectedPrimary && secondaryIdx !== null
      ? selectedPrimary.secondary[secondaryIdx]
      : null

  const goToPrimary = () => {
    setLevel('primary')
    setPrimaryIdx(null)
    setSecondaryIdx(null)
    setSelectedTertiary(null)
    setReflexionCausa('')
    setReflexionPasado('')
    setReflexionMensaje('')
  }

  const selectPrimary = (idx: number) => {
    setPrimaryIdx(idx)
    setSecondaryIdx(null)
    setSelectedTertiary(null)
    setLevel('secondary')
  }

  const selectSecondary = (idx: number) => {
    setSecondaryIdx(idx)
    setSelectedTertiary(null)
    setLevel('tertiary')
  }

  const selectTertiary = (t: TertiaryEmotion) => {
    setSelectedTertiary(t)
  }

  const confirmTertiary = () => {
    setLevel('confirmed')
  }

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto px-6 pt-8">
        <PageHeader
          title="Rueda de Emociones"
          subtitle="Explora y nombra lo que sientes"
        />

        <ModuleIntro
          que="Un mapa de emociones organizado en tres niveles: de lo más general (alegría, tristeza, miedo...) a lo más preciso (nostalgia, decepción, aprensión...). Vas eligiendo capas hasta dar con la emoción que mejor describe lo que sientes."
          para="Poner nombre exacto a una emoción reduce su intensidad y te da más capacidad de gestionarla. Cuanto más amplio es tu vocabulario emocional, mejor puedes entender qué te está pasando y comunicarlo."
          pasos={[
            'Elige la emoción primaria que más se acerca a lo que sientes ahora mismo: alegría, tristeza, miedo, ira, sorpresa o asco.',
            'Dentro de ella, selecciona la emoción secundaria que la matiza mejor.',
            'Por último, elige la emoción terciaria más específica. Verás su definición justo debajo para ayudarte a decidir.',
            'Cuando hayas encontrado la que te representa, confírmala. Quedará registrada con la fecha de hoy.',
          ]}
        />

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-sans text-xs text-text-muted mb-6 flex-wrap">
          <button
            onClick={goToPrimary}
            className="hover:text-primary transition-colors"
          >
            Emociones
          </button>
          {selectedPrimary && (
            <>
              <span>›</span>
              <button
                onClick={() => { setLevel('secondary'); setSecondaryIdx(null); setSelectedTertiary(null) }}
                className="hover:text-primary transition-colors"
                style={{ color: primaryIdx !== null ? selectedPrimary.color : undefined }}
              >
                {selectedPrimary.name}
              </button>
            </>
          )}
          {selectedSecondary && (
            <>
              <span>›</span>
              <button
                onClick={() => { setLevel('tertiary'); setSelectedTertiary(null) }}
                className="hover:text-primary transition-colors"
              >
                {selectedSecondary.name}
              </button>
            </>
          )}
          {selectedTertiary && (
            <>
              <span>›</span>
              <span className="text-text">{selectedTertiary.name}</span>
            </>
          )}
        </div>

        {/* Primary emotions grid */}
        {level === 'primary' && (
          <div>
            <p className="font-sans text-sm text-text-muted mb-4">
              ¿Qué emoción primaria resuena más contigo ahora?
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {EMOTIONS.map((emotion, idx) => (
                <button
                  key={emotion.name}
                  onClick={() => selectPrimary(idx)}
                  className="flex flex-col items-center gap-2 py-5 px-3 rounded-2xl transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]"
                  style={{
                    background: `${emotion.color}18`,
                    border: `2px solid ${emotion.color}44`,
                  }}
                >
                  <span
                    className="w-12 h-12 rounded-full flex items-center justify-center font-serif font-bold text-sm"
                    style={{ background: emotion.color, color: '#fff' }}
                  >
                    {emotion.name.charAt(0)}
                  </span>
                  <span className="font-sans text-sm font-semibold" style={{ color: emotion.color }}>
                    {emotion.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Secondary emotions */}
        {level === 'secondary' && selectedPrimary && (
          <div
            className="opacity-0 animate-[fadeIn_0.25s_ease_forwards]"
            style={{ '--tw-enter-opacity': '0' } as React.CSSProperties}
          >
            <style>{`@keyframes fadeIn { to { opacity: 1; transform: translateY(0); } from { opacity: 0; transform: translateY(8px); } }`}</style>
            <p className="font-sans text-sm text-text-muted mb-4">
              ¿Cuál de estas describe mejor tu{' '}
              <span className="font-semibold" style={{ color: selectedPrimary.color }}>
                {selectedPrimary.name.toLowerCase()}
              </span>
              ?
            </p>
            <div className="flex flex-col gap-3">
              {selectedPrimary.secondary.map((sec, idx) => (
                <button
                  key={sec.name}
                  onClick={() => selectSecondary(idx)}
                  className="flex items-center gap-3 p-4 rounded-2xl text-left transition-all duration-150 hover:scale-[1.01]"
                  style={{
                    background: 'var(--color-surface)',
                    boxShadow: '0 2px 8px rgba(61,50,40,0.07)',
                    borderLeft: `4px solid ${selectedPrimary.color}`,
                  }}
                >
                  <span
                    className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-serif font-bold text-xs"
                    style={{ background: selectedPrimary.color, color: '#fff' }}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-sans font-semibold text-text text-sm">{sec.name}</p>
                    <p className="font-sans text-xs text-text-muted mt-0.5">
                      {sec.tertiary.length} emociones relacionadas
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tertiary emotions */}
        {level === 'tertiary' && selectedPrimary && selectedSecondary && (
          <div>
            <p className="font-sans text-sm text-text-muted mb-4">
              Toca cada emoción para ver su definición. Cuando encuentres la tuya, confírmala.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {selectedSecondary.tertiary.map((t) => (
                <button
                  key={t.name}
                  onClick={() => selectTertiary(t)}
                  className="p-4 rounded-2xl text-left transition-all duration-150 hover:scale-[1.02]"
                  style={{
                    background: selectedTertiary?.name === t.name ? `${selectedPrimary.color}28` : `${selectedPrimary.color}10`,
                    border: selectedTertiary?.name === t.name ? `2px solid ${selectedPrimary.color}` : `1.5px solid ${selectedPrimary.color}33`,
                  }}
                >
                  <p className="font-sans font-semibold text-sm" style={{ color: selectedPrimary.color }}>
                    {t.name}
                  </p>
                </button>
              ))}
            </div>

            {/* Definition panel — shown inline when a tertiary is selected */}
            {selectedTertiary && (
              <div>
                <div
                  className="rounded-2xl p-5 mb-4"
                  style={{
                    background: `${selectedPrimary.color}10`,
                    border: `1.5px solid ${selectedPrimary.color}30`,
                  }}
                >
                  <h2 className="font-serif text-lg font-semibold mb-1" style={{ color: selectedPrimary.color }}>
                    {selectedTertiary.name}
                  </h2>
                  <p className="font-sans text-xs text-text-muted mb-3 uppercase tracking-wide">
                    {selectedPrimary.name} › {selectedSecondary.name}
                  </p>
                  <p className="font-sans text-sm text-text leading-relaxed">{selectedTertiary.definition}</p>
                </div>

                <button
                  onClick={confirmTertiary}
                  className="w-full py-4 rounded-full font-sans text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background: selectedPrimary.color, color: '#fff' }}
                >
                  Sí, esto es lo que siento
                </button>
              </div>
            )}
          </div>
        )}

        {/* Confirmed */}
        {level === 'confirmed' && selectedTertiary && selectedPrimary && (
          <div>
            <div
              className="rounded-2xl p-6 mb-5"
              style={{
                background: `${selectedPrimary.color}10`,
                border: `1.5px solid ${selectedPrimary.color}30`,
              }}
            >
              <h2 className="font-serif text-xl font-semibold mb-1" style={{ color: selectedPrimary.color }}>
                {selectedTertiary.name}
              </h2>
              <p className="font-sans text-xs text-text-muted mb-4 uppercase tracking-wide">
                {selectedPrimary.name} › {selectedSecondary?.name}
              </p>
              <p className="font-sans text-sm text-text leading-relaxed">{selectedTertiary.definition}</p>
            </div>

            {/* Pregunta 1: causa */}
            <div className="rounded-2xl p-5 mb-4" style={{ background: 'var(--color-surface)', boxShadow: '0 2px 12px rgba(61,50,40,0.07)' }}>
              <label className="block font-sans text-sm font-semibold text-text mb-2">
                ¿A qué crees que se debe esta emoción?
              </label>
              <p className="font-sans text-xs text-text-muted mb-3 leading-relaxed">
                ¿Qué situación, pensamiento o contexto crees que la ha desencadenado?
              </p>
              <textarea
                value={reflexionCausa}
                onChange={e => setReflexionCausa(e.target.value)}
                rows={3}
                placeholder="Escribe lo que se te venga..."
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

            {/* Pregunta 2: pasado */}
            <div className="rounded-2xl p-5 mb-5" style={{ background: 'var(--color-surface)', boxShadow: '0 2px 12px rgba(61,50,40,0.07)' }}>
              <label className="block font-sans text-sm font-semibold text-text mb-2">
                ¿Recuerdas alguna otra vez en tu vida que te sentiste así?
              </label>
              <p className="font-sans text-xs text-text-muted mb-3 leading-relaxed">
                Puede ser un momento reciente o algo de hace mucho tiempo.
              </p>
              <textarea
                value={reflexionPasado}
                onChange={e => setReflexionPasado(e.target.value)}
                rows={3}
                placeholder="Escribe lo que recuerdes..."
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

            {/* Pregunta 3: mensaje */}
            <div className="rounded-2xl p-5 mb-5" style={{ background: 'var(--color-surface)', boxShadow: '0 2px 12px rgba(61,50,40,0.07)' }}>
              <label className="block font-sans text-sm font-semibold text-text mb-2">
                ¿Qué crees que te está intentando decir esta emoción?
              </label>
              <p className="font-sans text-xs text-text-muted mb-3 leading-relaxed">
                Las emociones no aparecen sin razón. Suelen señalar una necesidad, un límite o algo importante para ti. ¿Qué podría ser en este caso?
              </p>
              <textarea
                value={reflexionMensaje}
                onChange={e => setReflexionMensaje(e.target.value)}
                rows={3}
                placeholder="Escribe lo que se te ocurra, aunque no estés segura/o..."
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

            {/* Mensaje de cierre */}
            <div
              className="rounded-2xl p-5 mb-5"
              style={{ background: 'var(--color-primary-container)', borderLeft: '4px solid var(--color-primary)' }}
            >
              <p className="font-sans text-sm font-semibold text-text mb-3">
                ¿Por qué estas preguntas?
              </p>
              <p className="font-sans text-sm text-text leading-relaxed mb-3">
                Identificar una emoción es solo el primer paso. Las preguntas que acabas de responder tienen un propósito concreto: ayudarte a entender no solo qué sientes, sino de dónde viene y qué significa para ti.
              </p>
              <p className="font-sans text-sm text-text leading-relaxed mb-3">
                A veces una situación del presente nos genera una respuesta emocional que, si nos fijamos bien, tiene más que ver con algo que ya vivimos antes. El presente activa el pasado. Y esa reacción, aunque pueda parecer desproporcionada o confusa, tiene sentido dentro de nuestra historia.
              </p>
              <p className="font-sans text-sm text-text leading-relaxed">
                Hacer este trabajo —conectar la emoción con la situación, con el recuerdo y con el mensaje que trae— es una de las formas más poderosas de conocerse. No para analizarse sin fin, sino para relacionarse con uno mismo con más comprensión y menos juicio.
              </p>
            </div>

            <button
              onClick={goToPrimary}
              className="w-full py-3 rounded-full font-sans text-sm font-semibold transition-colors"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Explorar otra emoción
            </button>
          </div>
        )}
        <ProfesionalLink modulo="emociones" />
      </div>
    </div>
  )
}
