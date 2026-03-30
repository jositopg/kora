import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { BackButton } from '../components/ui/BackButton'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { LifeCategory } from '../types'

const DEFAULT_CATEGORIES: LifeCategory[] = [
  { id: 'trabajo', name: 'Trabajo', active: true, current: 30, ideal: 25 },
  { id: 'familia', name: 'Familia', active: true, current: 20, ideal: 25 },
  { id: 'pareja', name: 'Pareja', active: true, current: 15, ideal: 20 },
  { id: 'ocio', name: 'Ocio / Social', active: true, current: 10, ideal: 15 },
  { id: 'ejercicio', name: 'Ejercicio', active: true, current: 10, ideal: 10 },
  { id: 'autocuidado', name: 'Autocuidado', active: false, current: 5, ideal: 5 },
  { id: 'estudios', name: 'Estudios', active: false, current: 10, ideal: 0 },
]

const PALETTE = [
  '#9a7e5f', '#a3b89a', '#c4a0a0', '#a0b4c4', '#c4b8a0',
  '#b8a0c4', '#a0c4b8', '#c4c0a0',
]

interface Props {
  onBack: () => void
}

// SVG Pie Chart
function PieChart({ categories, size = 160 }: { categories: LifeCategory[]; size?: number }) {
  const active = categories.filter((c) => c.active)
  if (active.length === 0) return <div className="w-40 h-40 rounded-full bg-sand-100 flex items-center justify-center"><p className="text-xs text-sand-400">Sin datos</p></div>

  let currentAngle = -90
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 4

  function polarToXY(angleDeg: number, radius: number) {
    const rad = (angleDeg * Math.PI) / 180
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
  }

  const slices = active.map((cat, i) => {
    const percentage = cat.current
    const angleDeg = (percentage / 100) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angleDeg
    currentAngle = endAngle

    const start = polarToXY(startAngle, r)
    const end = polarToXY(endAngle, r)
    const largeArc = angleDeg > 180 ? 1 : 0
    const d = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`

    return <path key={cat.id} d={d} fill={PALETTE[i % PALETTE.length]} opacity="0.85" />
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="#f4f0e8" />
      {slices}
      <circle cx={cx} cy={cy} r={r * 0.35} fill="white" />
    </svg>
  )
}

// Ideal version — uses ideal values
function IdealPieChart({ categories, size = 160 }: { categories: LifeCategory[]; size?: number }) {
  const ideal = categories
    .filter((c) => c.active)
    .map((c) => ({ ...c, current: c.ideal }))
  return <PieChart categories={ideal} size={size} />
}

export function LifePlots({ onBack }: Props) {
  const [categories, setCategories] = useLocalStorage<LifeCategory[]>('life-plots', DEFAULT_CATEGORIES)
  const [reflection1, setReflection1] = useLocalStorage('life-plots-r1', '')
  const [reflection2, setReflection2] = useLocalStorage('life-plots-r2', '')
  const [reflection3, setReflection3] = useLocalStorage('life-plots-r3', '')
  const [newName, setNewName] = useState('')
  const [mode, setMode] = useState<'current' | 'ideal'>('current')

  function toggleCategory(id: string) {
    setCategories(categories.map((c) => (c.id === id ? { ...c, active: !c.active } : c)))
  }

  function updateSlider(id: string, field: 'current' | 'ideal', value: number) {
    setCategories(categories.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  function addCategory() {
    if (!newName.trim()) return
    setCategories([
      ...categories,
      { id: Date.now().toString(), name: newName.trim(), active: true, current: 5, ideal: 5 },
    ])
    setNewName('')
  }

  function removeCategory(id: string) {
    setCategories(categories.filter((c) => c.id !== id))
  }

  const active = categories.filter((c) => c.active)
  const currentTotal = active.reduce((s, c) => s + c.current, 0)
  const idealTotal = active.reduce((s, c) => s + c.ideal, 0)

  return (
    <div className="min-h-dvh bg-sand-50 pb-10">
      <div className="px-6 pt-8 pb-4">
        <BackButton onBack={onBack} />
        <h1 className="section-title mt-4 mb-1">Parcelas de la vida</h1>
        <p className="text-sand-500 text-sm">¿Cómo distribuyes tu energía vital?</p>
      </div>

      {/* Category toggles */}
      <div className="px-6 mb-5">
        <p className="label">Categorías activas</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((c, i) => (
            <button
              key={c.id}
              onClick={() => toggleCategory(c.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                c.active ? 'text-white' : 'bg-sand-100 text-sand-500'
              }`}
              style={c.active ? { backgroundColor: PALETTE[i % PALETTE.length] } : {}}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Add custom */}
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
            placeholder="Añadir categoría..."
            className="input-field flex-1 py-2 text-sm"
          />
          <button onClick={addCategory} className="btn-secondary px-3 py-2">
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Visual comparison */}
      <div className="px-6 mb-6">
        <div className="card">
          <div className="flex items-center gap-6 justify-center mb-4">
            <div className="text-center">
              <PieChart categories={categories} />
              <p className="text-xs font-medium text-sand-600 mt-2">Estado actual</p>
              <p className={`text-xs mt-0.5 ${currentTotal === 100 ? 'text-sage-600' : 'text-blush-500'}`}>
                {currentTotal}% {currentTotal !== 100 && '≠ 100%'}
              </p>
            </div>
            <div className="text-center">
              <IdealPieChart categories={categories} />
              <p className="text-xs font-medium text-sand-600 mt-2">Estado ideal</p>
              <p className={`text-xs mt-0.5 ${idealTotal === 100 ? 'text-sage-600' : 'text-blush-500'}`}>
                {idealTotal}% {idealTotal !== 100 && '≠ 100%'}
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-1.5">
            {active.map((c, i) => (
              <div key={c.id} className="flex items-center gap-2 text-xs text-sand-600">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PALETTE[i % PALETTE.length] }} />
                <span className="flex-1">{c.name}</span>
                <span className="text-sand-400">{c.current}% → {c.ideal}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mode toggle for sliders */}
      <div className="px-6 mb-4">
        <div className="flex bg-sand-100 rounded-2xl p-1 gap-1">
          <button
            onClick={() => setMode('current')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              mode === 'current' ? 'bg-white text-sand-800 shadow-soft' : 'text-sand-500'
            }`}
          >
            Actual
          </button>
          <button
            onClick={() => setMode('ideal')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              mode === 'ideal' ? 'bg-white text-sand-800 shadow-soft' : 'text-sand-500'
            }`}
          >
            Ideal
          </button>
        </div>
      </div>

      {/* Sliders */}
      <div className="px-6 mb-6 space-y-4">
        {active.map((c, i) => (
          <div key={c.id} className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PALETTE[i % PALETTE.length] }} />
                <span className="text-sm font-medium text-sand-700">{c.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-sand-700">
                  {mode === 'current' ? c.current : c.ideal}%
                </span>
                <button onClick={() => removeCategory(c.id)} className="text-sand-300 hover:text-blush-400 transition-colors">
                  <X size={13} strokeWidth={2} />
                </button>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={mode === 'current' ? c.current : c.ideal}
              onChange={(e) => updateSlider(c.id, mode, Number(e.target.value))}
              className="w-full"
            />
          </div>
        ))}
      </div>

      {/* Reflection questions */}
      <div className="px-6 space-y-4">
        <p className="label">Reflexiones</p>
        {[
          { value: reflection1, setter: setReflection1, q: '¿Qué piensas o sientes al ver la diferencia entre los dos dibujos?' },
          { value: reflection2, setter: setReflection2, q: '¿Cómo podrías acercar el dibujo actual al ideal?' },
          { value: reflection3, setter: setReflection3, q: '¿Cuáles son las primeras acciones concretas y qué limitantes existen?' },
        ].map(({ value, setter, q }, i) => (
          <div key={i} className="card">
            <p className="text-sm text-sand-600 leading-relaxed mb-3">{q}</p>
            <textarea
              value={value}
              onChange={(e) => setter(e.target.value)}
              placeholder="Escribe aquí tu reflexión..."
              rows={3}
              className="textarea-field"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
