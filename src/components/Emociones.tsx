import { useState } from 'react'
import PageHeader from './ui/PageHeader'
import { EMOTIONS } from '../data/emotions'
import type { TertiaryEmotion } from '../types'

type Level = 'primary' | 'secondary' | 'tertiary' | 'definition'

export default function Emociones() {
  const [level, setLevel] = useState<Level>('primary')
  const [primaryIdx, setPrimaryIdx] = useState<number | null>(null)
  const [secondaryIdx, setSecondaryIdx] = useState<number | null>(null)
  const [selectedTertiary, setSelectedTertiary] = useState<TertiaryEmotion | null>(null)

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
    setLevel('definition')
  }

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto px-6 pt-8">
        <PageHeader
          title="Rueda de Emociones"
          subtitle="Explora y nombra lo que sientes"
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
              ¿Con cuál te identificas más?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {selectedSecondary.tertiary.map((t) => (
                <button
                  key={t.name}
                  onClick={() => selectTertiary(t)}
                  className="p-4 rounded-2xl text-left transition-all duration-150 hover:scale-[1.02]"
                  style={{
                    background: `${selectedPrimary.color}14`,
                    border: `1.5px solid ${selectedPrimary.color}33`,
                  }}
                >
                  <p className="font-sans font-semibold text-sm" style={{ color: selectedPrimary.color }}>
                    {t.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Definition */}
        {level === 'definition' && selectedTertiary && selectedPrimary && (
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

            <div
              className="rounded-2xl p-4 mb-5"
              style={{ background: 'var(--color-primary-container)' }}
            >
              <p className="font-sans text-xs text-text-muted mb-1 font-semibold uppercase tracking-wide">Reflexión</p>
              <p className="font-sans text-sm text-text">
                Reconocer y nombrar lo que sientes es el primer paso hacia la regulación emocional.
                Observa esta emoción sin juzgarla.
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
      </div>
    </div>
  )
}
