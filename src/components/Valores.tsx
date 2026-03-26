import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PageHeader from './ui/PageHeader'
import type { ValoresData, ValorEntry } from '../types'

const DEFAULT_VALORES: ValorEntry[] = [
  { id: 'familia', label: 'Familia', score: 5 },
  { id: 'pareja', label: 'Pareja/Amor', score: 5 },
  { id: 'amistades', label: 'Amistades', score: 5 },
  { id: 'trabajo', label: 'Trabajo/Carrera', score: 5 },
  { id: 'salud_fisica', label: 'Salud física', score: 5 },
  { id: 'salud_mental', label: 'Salud mental', score: 5 },
  { id: 'crecimiento', label: 'Crecimiento personal', score: 5 },
  { id: 'creatividad', label: 'Creatividad', score: 5 },
  { id: 'espiritualidad', label: 'Espiritualidad', score: 5 },
  { id: 'comunidad', label: 'Comunidad/Sociedad', score: 5 },
  { id: 'ocio', label: 'Ocio/Diversión', score: 5 },
  { id: 'dinero', label: 'Dinero/Seguridad', score: 5 },
]

const INITIAL_DATA: ValoresData = {
  valores: DEFAULT_VALORES,
  reflexion: '',
  updatedAt: '',
}

interface RadarChartProps {
  valores: ValorEntry[]
}

function RadarChart({ valores: vals }: RadarChartProps) {
  const size = 260
  const cx = size / 2
  const cy = size / 2
  const maxR = 100
  const n = vals.length

  const getPoint = (index: number, radius: number) => {
    const angle = (2 * Math.PI * index) / n - Math.PI / 2
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    }
  }

  // Grid circles
  const gridLevels = [2, 4, 6, 8, 10]

  // Axes
  const axes = vals.map((v, i) => ({
    ...getPoint(i, maxR),
    label: v.label,
    labelPoint: getPoint(i, maxR + 18),
  }))

  // Data polygon
  const dataPoints = vals.map((v, i) => getPoint(i, (v.score / 10) * maxR))
  const polygonPoints = dataPoints.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="w-full max-w-[280px]"
    >
      {/* Grid */}
      {gridLevels.map(level => {
        const points = vals.map((_, i) => {
          const p = getPoint(i, (level / 10) * maxR)
          return `${p.x},${p.y}`
        }).join(' ')
        return (
          <polygon
            key={level}
            points={points}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="1"
            opacity="0.7"
          />
        )
      })}

      {/* Axis lines */}
      {axes.map((axis, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={axis.x}
          y2={axis.y}
          stroke="var(--color-border)"
          strokeWidth="1"
          opacity="0.7"
        />
      ))}

      {/* Data polygon */}
      <polygon
        points={polygonPoints}
        fill="rgba(139,115,85,0.18)"
        stroke="var(--color-primary)"
        strokeWidth="2"
      />

      {/* Data dots */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="var(--color-primary)" />
      ))}

      {/* Labels */}
      {axes.map((axis, i) => {
        const p = axis.labelPoint
        const v = vals[i]
        const anchor = p.x < cx - 5 ? 'end' : p.x > cx + 5 ? 'start' : 'middle'
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor={anchor}
            dominantBaseline="middle"
            fontSize="8"
            fill="var(--color-text-muted)"
            fontFamily="Manrope, sans-serif"
          >
            {v.label.length > 12 ? v.label.substring(0, 11) + '…' : v.label}
          </text>
        )
      })}
    </svg>
  )
}

export default function Valores() {
  const [saved, setSaved] = useLocalStorage<ValoresData>('santuario_valores', INITIAL_DATA)
  const [valores, setValores] = useState<ValorEntry[]>(
    saved.valores.length > 0 ? saved.valores : DEFAULT_VALORES
  )
  const [reflexion, setReflexion] = useState(saved.reflexion)
  const [saveMsg, setSaveMsg] = useState('')

  const handleScore = (id: string, score: number) => {
    setValores(prev => prev.map(v => v.id === id ? { ...v, score } : v))
  }

  const handleSave = () => {
    setSaved({ valores, reflexion, updatedAt: new Date().toISOString() })
    setSaveMsg('¡Guardado!')
    setTimeout(() => setSaveMsg(''), 2500)
  }

  const lowestValor = [...valores].sort((a, b) => a.score - b.score)[0]

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto px-6 pt-8">
        <PageHeader
          title="Brújula de Valores"
          subtitle="¿Cuánto alineamiento sientes con cada valor?"
        />

        {/* Radar chart */}
        <section
          className="rounded-2xl p-5 mb-6 flex flex-col items-center"
          style={{ background: 'var(--color-surface)', boxShadow: '0 2px 12px rgba(61,50,40,0.08)' }}
        >
          <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-4">
            Radar de alineamiento
          </p>
          <RadarChart valores={valores} />
        </section>

        {/* Sliders */}
        <section
          className="rounded-2xl p-5 mb-6"
          style={{ background: 'var(--color-surface)', boxShadow: '0 2px 12px rgba(61,50,40,0.08)' }}
        >
          <p className="font-sans text-sm font-semibold text-text mb-4">
            Puntuación por valor (1–10)
          </p>
          <div className="flex flex-col gap-4">
            {valores.map(v => (
              <div key={v.id}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-sans text-sm text-text">{v.label}</span>
                  <span
                    className="font-sans text-sm font-bold min-w-[2rem] text-right"
                    style={{ color: v.score <= 3 ? '#9e4a2c' : v.score >= 8 ? '#6b8c6e' : 'var(--color-primary)' }}
                  >
                    {v.score}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={v.score}
                  onChange={e => handleScore(v.id, Number(e.target.value))}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Insight */}
        {lowestValor && (
          <div
            className="rounded-2xl p-4 mb-5"
            style={{ background: 'var(--color-primary-container)' }}
          >
            <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Valor con menor alineamiento</p>
            <p className="font-sans text-sm text-text">
              <span className="font-semibold text-primary">{lowestValor.label}</span> tiene una puntuación de{' '}
              <span className="font-semibold">{lowestValor.score}/10</span>. ¿Qué podría ayudarte a fortalecer este área?
            </p>
          </div>
        )}

        {/* Reflexión */}
        <section className="mb-6">
          <label className="block font-sans text-sm font-semibold text-text mb-2">
            ¿Qué valor sientes que más necesita atención ahora mismo?
          </label>
          <textarea
            value={reflexion}
            onChange={e => setReflexion(e.target.value)}
            rows={4}
            placeholder="Reflexiona sobre el valor que más resuena contigo en este momento..."
            className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none"
            style={{
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              border: '1.5px solid var(--color-border)',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--color-primary)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--color-border)' }}
          />
        </section>

        <button
          onClick={handleSave}
          className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: 'var(--color-primary)', color: '#fff' }}
        >
          {saveMsg || 'Guardar brújula'}
        </button>

        {saved.updatedAt && (
          <p className="mt-3 text-center font-sans text-xs text-text-muted">
            Última actualización: {new Date(saved.updatedAt).toLocaleDateString('es-ES', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}
          </p>
        )}
      </div>
    </div>
  )
}
