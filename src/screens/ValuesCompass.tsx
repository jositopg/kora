import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { BackButton } from '../components/ui/BackButton'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { ValueEntry } from '../types'

const DEFAULT_VALUES: ValueEntry[] = [
  { id: 'familia', name: 'Familia', importance: 9, alignment: 6 },
  { id: 'salud', name: 'Salud', importance: 8, alignment: 5 },
  { id: 'honestidad', name: 'Honestidad', importance: 9, alignment: 8 },
  { id: 'creatividad', name: 'Creatividad', importance: 7, alignment: 4 },
  { id: 'libertad', name: 'Libertad', importance: 8, alignment: 6 },
]

interface Props {
  onBack: () => void
}

function RadarChart({ values, size = 240 }: { values: ValueEntry[]; size?: number }) {
  if (values.length < 3) {
    return (
      <div
        className="rounded-full bg-sand-100 flex items-center justify-center text-sand-400 text-xs text-center px-6"
        style={{ width: size, height: size }}
      >
        Añade al menos 3 valores para ver el gráfico
      </div>
    )
  }

  const cx = size / 2
  const cy = size / 2
  const maxR = size / 2 - 32
  const n = values.length

  function polarPoint(index: number, value: number, max: number) {
    const angle = (index / n) * 2 * Math.PI - Math.PI / 2
    const r = (value / max) * maxR
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  }

  function labelPoint(index: number) {
    const angle = (index / n) * 2 * Math.PI - Math.PI / 2
    const r = maxR + 20
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  }

  function gridPolygon(level: number) {
    return Array.from({ length: n })
      .map((_, i) => {
        const p = polarPoint(i, level, 10)
        return `${p.x},${p.y}`
      })
      .join(' ')
  }

  const importancePoints = values.map((v, i) => polarPoint(i, v.importance, 10))
  const alignmentPoints = values.map((v, i) => polarPoint(i, v.alignment, 10))

  const importancePath = importancePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
  const alignmentPath = alignmentPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {[2, 4, 6, 8, 10].map((level) => (
        <polygon key={level} points={gridPolygon(level)} fill="none" stroke="#e8dfd0" strokeWidth="1" />
      ))}
      {Array.from({ length: n }).map((_, i) => {
        const outer = polarPoint(i, 10, 10)
        return <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="#e8dfd0" strokeWidth="1" />
      })}
      <path d={importancePath} fill="#9a7e5f" fillOpacity="0.15" stroke="#9a7e5f" strokeWidth="2" />
      <path d={alignmentPath} fill="#5a8a70" fillOpacity="0.2" stroke="#5a8a70" strokeWidth="2" strokeDasharray="4 3" />
      {values.map((v, i) => {
        const lp = labelPoint(i)
        return (
          <text
            key={v.id}
            x={lp.x}
            y={lp.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fill="#7d654c"
            fontFamily="Manrope, sans-serif"
            fontWeight="500"
          >
            {v.name.length > 10 ? v.name.slice(0, 9) + '…' : v.name}
          </text>
        )
      })}
    </svg>
  )
}

export function ValuesCompass({ onBack }: Props) {
  const [values, setValues] = useLocalStorage<ValueEntry[]>('values', DEFAULT_VALUES)
  const [newName, setNewName] = useState('')

  function updateValue(id: string, field: 'importance' | 'alignment', val: number) {
    setValues(values.map((v) => (v.id === id ? { ...v, [field]: val } : v)))
  }

  function addValue() {
    if (!newName.trim()) return
    setValues([
      ...values,
      { id: Date.now().toString(), name: newName.trim(), importance: 7, alignment: 5 },
    ])
    setNewName('')
  }

  function removeValue(id: string) {
    setValues(values.filter((v) => v.id !== id))
  }

  const avgImportance =
    values.length > 0
      ? Math.round((values.reduce((s, v) => s + v.importance, 0) / values.length) * 10) / 10
      : 0
  const avgAlignment =
    values.length > 0
      ? Math.round((values.reduce((s, v) => s + v.alignment, 0) / values.length) * 10) / 10
      : 0
  const gap = Math.round((avgImportance - avgAlignment) * 10) / 10

  return (
    <div className="min-h-dvh bg-sand-50 pb-10">
      <div className="px-6 pt-8 pb-4">
        <BackButton onBack={onBack} />
        <h1 className="section-title mt-4 mb-1">Brújula de valores</h1>
        <p className="text-sand-500 text-sm">¿Cuánto se alinean tus acciones con lo que valoras?</p>
      </div>

      {/* Radar */}
      <div className="px-6 mb-4">
        <div className="card flex flex-col items-center py-6">
          <RadarChart values={values} size={260} />
          <div className="flex items-center gap-5 mt-4 text-xs text-sand-600">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-0.5 bg-[#9a7e5f] rounded" />
              <span>Importancia</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-px border-t border-dashed border-[#5a8a70]" style={{ width: 24 }} />
              <span>Alineación</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 mb-5 grid grid-cols-3 gap-3">
        <div className="card text-center py-4">
          <p className="text-xs text-sand-400 mb-1">Importancia</p>
          <p className="font-serif text-2xl text-sand-800">{avgImportance}</p>
          <p className="text-xs text-sand-400">/10</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-xs text-sand-400 mb-1">Alineación</p>
          <p className="font-serif text-2xl text-sage-600">{avgAlignment}</p>
          <p className="text-xs text-sand-400">/10</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-xs text-sand-400 mb-1">Brecha</p>
          <p className={`font-serif text-2xl ${gap > 3 ? 'text-blush-500' : 'text-sand-800'}`}>{gap}</p>
          <p className="text-xs text-sand-400">puntos</p>
        </div>
      </div>

      {gap > 3 && (
        <div className="px-6 mb-5">
          <div className="bg-blush-50 border border-blush-100 rounded-3xl p-4 text-sm text-blush-700">
            Hay una brecha notable entre lo que valoras y cómo vives. Puede ser útil explorar qué obstáculos lo generan.
          </div>
        </div>
      )}

      {/* Value sliders */}
      <div className="px-6 space-y-4 mb-5">
        <p className="label">Mis valores</p>
        {values.map((v) => (
          <div key={v.id} className="card">
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium text-sand-800 text-sm">{v.name}</p>
              <button onClick={() => removeValue(v.id)} className="text-sand-300 hover:text-blush-400 transition-colors">
                <Trash2 size={14} strokeWidth={1.5} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-sand-500 mb-1">
                  <span>Importancia</span>
                  <span className="font-medium text-sand-700">{v.importance}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={v.importance}
                  onChange={(e) => updateValue(v.id, 'importance', Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-sand-500 mb-1">
                  <span>Alineación actual</span>
                  <span className="font-medium text-sage-600">{v.alignment}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={v.alignment}
                  onChange={(e) => updateValue(v.id, 'alignment', Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add value */}
      <div className="px-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addValue()}
            placeholder="Nuevo valor..."
            className="input-field flex-1"
          />
          <button onClick={addValue} className="btn-secondary px-3">
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
