import { useState } from 'react'
import { BackButton } from '../components/ui/BackButton'
import { EMOTIONS } from '../data/emotions'
import type { EmotionPrimary, EmotionSecondary, EmotionTertiary } from '../types'

interface Props {
  onBack: () => void
}

export function EmotionsWheel({ onBack }: Props) {
  const [selectedPrimary, setSelectedPrimary] = useState<EmotionPrimary | null>(null)
  const [selectedSecondary, setSelectedSecondary] = useState<EmotionSecondary | null>(null)
  const [selectedTertiary, setSelectedTertiary] = useState<EmotionTertiary | null>(null)

  function selectPrimary(emotion: EmotionPrimary) {
    setSelectedPrimary(emotion)
    setSelectedSecondary(null)
    setSelectedTertiary(null)
  }

  function selectSecondary(emotion: EmotionSecondary) {
    setSelectedSecondary(emotion)
    setSelectedTertiary(null)
  }

  return (
    <div className="min-h-dvh bg-sand-50 pb-10">
      <div className="px-6 pt-8 pb-4">
        <BackButton onBack={onBack} />
        <h1 className="section-title mt-4 mb-1">Rueda de emociones</h1>
        <p className="text-sand-500 text-sm">Explora y afina lo que estás sintiendo</p>
      </div>

      {/* Step 1: Primary emotions */}
      <div className="px-6 mb-6">
        <p className="label">1. ¿Cuál es la emoción central?</p>
        <div className="grid grid-cols-2 gap-2.5">
          {EMOTIONS.map((e) => (
            <button
              key={e.id}
              onClick={() => selectPrimary(e)}
              style={{ backgroundColor: selectedPrimary?.id === e.id ? e.color : e.bgColor }}
              className={`rounded-2xl px-4 py-3 text-left transition-all duration-200 active:scale-95 ${
                selectedPrimary?.id === e.id ? 'text-white shadow-card' : 'text-sand-700'
              }`}
            >
              <span className="font-medium text-sm">{e.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Secondary */}
      {selectedPrimary && (
        <div className="px-6 mb-6 animate-[fadeIn_0.25s_ease]">
          <p className="label">2. ¿Qué matiz?</p>
          <div className="space-y-2">
            {selectedPrimary.secondary.map((s) => (
              <button
                key={s.id}
                onClick={() => selectSecondary(s)}
                style={{
                  borderColor:
                    selectedSecondary?.id === s.id ? selectedPrimary.color : 'transparent',
                  backgroundColor:
                    selectedSecondary?.id === s.id ? selectedPrimary.bgColor : '#fff',
                }}
                className="w-full card border-2 text-left py-3 px-4 transition-all duration-200 active:scale-[0.98]"
              >
                <span className="font-medium text-sand-800 text-sm">{s.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Tertiary */}
      {selectedSecondary && (
        <div className="px-6 mb-6 animate-[fadeIn_0.25s_ease]">
          <p className="label">3. ¿Puedes afinarlo más?</p>
          <div className="space-y-2">
            {selectedSecondary.tertiary.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTertiary(t)}
                style={{
                  borderColor:
                    selectedTertiary?.id === t.id ? selectedPrimary?.color ?? '#9a7e5f' : 'transparent',
                  backgroundColor:
                    selectedTertiary?.id === t.id ? selectedPrimary?.bgColor ?? '#f4f0e8' : '#fff',
                }}
                className="w-full card border-2 text-left py-3 px-4 transition-all duration-200 active:scale-[0.98]"
              >
                <span className="font-medium text-sand-800 text-sm">{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Definition card */}
      {selectedTertiary && (
        <div className="px-6 animate-[fadeIn_0.25s_ease]">
          <div
            className="rounded-3xl p-5 border-l-4"
            style={{
              backgroundColor: selectedPrimary?.bgColor ?? '#f4f0e8',
              borderLeftColor: selectedPrimary?.color ?? '#9a7e5f',
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: selectedPrimary?.color }}>
              Definición clínica
            </p>
            <h3 className="font-serif text-lg text-sand-900 mb-2">{selectedTertiary.name}</h3>
            <p className="text-sand-700 text-sm leading-relaxed">{selectedTertiary.definition}</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
