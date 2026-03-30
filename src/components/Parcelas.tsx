import { useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PageHeader from './ui/PageHeader'
import ProfesionalLink from './ui/ProfesionalLink'
import CuriosidadBlock from './ui/CuriosidadBlock'
import ModuleIntro from './ui/ModuleIntro'
import type { ParcelasData, Parcela } from '../types'

const DEFAULT_PARCELAS: Parcela[] = [
  { id: 'trabajo', label: 'Trabajo', active: true },
  { id: 'familia', label: 'Familia', active: true },
  { id: 'pareja', label: 'Pareja', active: true },
  { id: 'estudios', label: 'Estudios', active: false },
  { id: 'ocio', label: 'Ocio/Social', active: true },
  { id: 'ejercicio', label: 'Ejercicio', active: true },
  { id: 'autocuidado', label: 'Autocuidado', active: true },
]

const SLICE_COLORS = [
  '#8b7355', '#6b8c6e', '#9e4a2c', '#5a6e8a', '#c4956a', '#8a6b8c', '#7a9e7e', '#a0856b', '#4a7a6e',
]

function normalizeValues(vals: Record<string, number>, activeIds: string[]): Record<string, number> {
  const total = activeIds.reduce((sum, id) => sum + (vals[id] ?? 0), 0)
  if (total === 0) {
    const even = 100 / activeIds.length
    return Object.fromEntries(activeIds.map(id => [id, even]))
  }
  const scale = 100 / total
  return Object.fromEntries(activeIds.map(id => [id, (vals[id] ?? 0) * scale]))
}

interface PieChartProps {
  data: { label: string; value: number; color: string }[]
  title: string
}

function PieChart({ data, title }: PieChartProps) {
  const cx = 80
  const cy = 80
  const r = 70

  const total = data.reduce((s, d) => s + d.value, 0)
  if (total === 0) return null

  let cumAngle = -Math.PI / 2
  const slices = data.map((d) => {
    const angle = (d.value / total) * 2 * Math.PI
    const startAngle = cumAngle
    cumAngle += angle
    const endAngle = cumAngle
    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const largeArc = angle > Math.PI ? 1 : 0
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
    return { ...d, path }
  })

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide">{title}</p>
      <svg width="160" height="160" viewBox="0 0 160 160">
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke="var(--color-bg)" strokeWidth="2" />
        ))}
      </svg>
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center max-w-[180px]">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span className="font-sans text-xs text-text-muted">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const INITIAL_DATA: ParcelasData = {
  parcelas: DEFAULT_PARCELAS,
  actual: {},
  ideal: {},
  reflexion1: '',
  reflexion2: '',
  reflexion3: '',
  updatedAt: '',
}

export default function Parcelas() {
  const [saved, setSaved] = useLocalStorage<ParcelasData>('santuario_parcelas', INITIAL_DATA)
  const [parcelas, setParcelas] = useState<Parcela[]>(saved.parcelas)
  const [actual, setActual] = useState<Record<string, number>>(saved.actual)
  const [ideal, setIdeal] = useState<Record<string, number>>(saved.ideal)
  const [reflexion1, setReflexion1] = useState(saved.reflexion1)
  const [reflexion2, setReflexion2] = useState(saved.reflexion2)
  const [reflexion3, setReflexion3] = useState(saved.reflexion3)
  const [newLabel, setNewLabel] = useState('')
  const [saveMsg, setSaveMsg] = useState('')

  const activeIds = parcelas.filter(p => p.active).map(p => p.id)

  useEffect(() => {
    // Initialize default values for active parcelas that have none
    const initActual = { ...actual }
    const initIdeal = { ...ideal }
    activeIds.forEach(id => {
      if (initActual[id] === undefined) initActual[id] = 0
      if (initIdeal[id] === undefined) initIdeal[id] = 0
    })
    setActual(initActual)
    setIdeal(initIdeal)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const normalActual = normalizeValues(actual, activeIds)
  const normalIdeal = normalizeValues(ideal, activeIds)

  const handleSlider = (
    id: string,
    val: number,
    group: 'actual' | 'ideal'
  ) => {
    if (group === 'actual') setActual(prev => ({ ...prev, [id]: val }))
    else setIdeal(prev => ({ ...prev, [id]: val }))
  }

  const toggleParcela = (id: string) => {
    setParcelas(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p))
  }

  const addParcela = () => {
    const label = newLabel.trim()
    if (!label) return
    const id = `custom_${Date.now()}`
    setParcelas(prev => [...prev, { id, label, active: true }])
    setActual(prev => ({ ...prev, [id]: 0 }))
    setIdeal(prev => ({ ...prev, [id]: 0 }))
    setNewLabel('')
  }

  const handleSave = () => {
    setSaved({
      parcelas,
      actual,
      ideal,
      reflexion1,
      reflexion2,
      reflexion3,
      updatedAt: new Date().toISOString(),
    })
    setSaveMsg('¡Guardado!')
    setTimeout(() => setSaveMsg(''), 2500)
  }

  const chartData = (vals: Record<string, number>) =>
    activeIds.map((id, i) => ({
      label: parcelas.find(p => p.id === id)?.label ?? id,
      value: vals[id] ?? 0,
      color: SLICE_COLORS[i % SLICE_COLORS.length],
    }))

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto px-6 pt-8">
        <PageHeader
          title="Parcelas de la Vida"
          subtitle="¿A qué dedicas tu tiempo?"
        />

        <ModuleIntro
          que="Una herramienta visual para ver cómo distribuyes tu tiempo y energía entre las distintas áreas de tu vida: trabajo, relaciones, salud, ocio, etc."
          para="Detectar desequilibrios entre lo que haces y lo que realmente importa. Ver de un vistazo qué áreas estás descuidando y cuáles están ocupando demasiado espacio, para poder tomar decisiones más conscientes."
          pasos={[
            'Selecciona las áreas de vida que quieres incluir clicando sobre cada una. Puedes activar o desactivar las que no te sean relevantes.',
            'Asigna un porcentaje a cada área usando el control deslizante. A medida que ajustas una, las demás se reequilibran automáticamente.',
            'Observa la distribución actual en el gráfico circular: eso refleja cómo estás viviendo ahora mismo.',
            'Haz lo mismo con la distribución ideal: ¿cómo te gustaría repartir tu tiempo y energía?',
            'Compara ambas distribuciones y responde las preguntas de reflexión. Ahí está el trabajo real.',
          ]}
        />

        {/* Toggle parcelas */}
        <section className="mb-6">
          <p className="font-sans text-sm font-semibold text-text mb-3">Áreas de vida</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {parcelas.map((p) => (
              <button
                key={p.id}
                onClick={() => toggleParcela(p.id)}
                className="px-4 py-2 rounded-full font-sans text-sm font-medium transition-all duration-150"
                style={{
                  background: p.active ? 'var(--color-primary)' : 'var(--color-surface-high)',
                  color: p.active ? '#fff' : 'var(--color-text-muted)',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addParcela()}
              placeholder="Añadir categoría..."
              className="flex-1 px-4 py-2 rounded-xl font-sans text-sm outline-none"
              style={{
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                border: '1.5px solid var(--color-border)',
              }}
            />
            <button
              onClick={addParcela}
              className="px-4 py-2 rounded-xl font-sans text-sm font-medium"
              style={{ background: 'var(--color-primary-container)', color: 'var(--color-primary)' }}
            >
              + Añadir
            </button>
          </div>
        </section>

        {/* Sliders */}
        {activeIds.length > 0 && (
          <section
            className="rounded-2xl p-5 mb-6"
            style={{ background: 'var(--color-surface)', boxShadow: '0 2px 12px rgba(61,50,40,0.08)' }}
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="font-sans text-sm font-semibold text-text mb-4">Estado Actual</p>
                {activeIds.map((id) => {
                  const label = parcelas.find(p => p.id === id)?.label ?? id
                  return (
                    <div key={id} className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-sans text-xs text-text-muted">{label}</span>
                        <span className="font-sans text-xs font-semibold text-primary">{Math.round(normalActual[id] ?? 0)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={actual[id] ?? 0}
                        onChange={e => handleSlider(id, Number(e.target.value), 'actual')}
                      />
                    </div>
                  )
                })}
              </div>
              <div>
                <p className="font-sans text-sm font-semibold text-text mb-4">Estado Ideal</p>
                {activeIds.map((id) => {
                  const label = parcelas.find(p => p.id === id)?.label ?? id
                  return (
                    <div key={id} className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-sans text-xs text-text-muted">{label}</span>
                        <span className="font-sans text-xs font-semibold text-accent">{Math.round(normalIdeal[id] ?? 0)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={ideal[id] ?? 0}
                        onChange={e => handleSlider(id, Number(e.target.value), 'ideal')}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Pie Charts */}
        {activeIds.length > 0 && (
          <section
            className="rounded-2xl p-5 mb-6 flex justify-around flex-wrap gap-6"
            style={{ background: 'var(--color-surface)', boxShadow: '0 2px 12px rgba(61,50,40,0.08)' }}
          >
            <PieChart data={chartData(normalActual)} title="Actual" />
            <PieChart data={chartData(normalIdeal)} title="Ideal" />
          </section>
        )}

        {/* Reflexiones */}
        <section className="mb-6">
          <p className="font-sans text-sm font-semibold text-text mb-4">Reflexiones</p>
          {[
            { label: '¿Qué piensas o sientes al ver la diferencia entre los dos dibujos?', value: reflexion1, onChange: setReflexion1 },
            { label: '¿Cómo podrías acercar el dibujo actual al ideal?', value: reflexion2, onChange: setReflexion2 },
            { label: '¿Cuáles son las primeras acciones concretas que podrías hacer y qué barreras existen?', value: reflexion3, onChange: setReflexion3 },
          ].map((r, i) => (
            <div key={i} className="mb-4">
              <label className="block font-sans text-sm text-text mb-2">{r.label}</label>
              <textarea
                value={r.value}
                onChange={e => r.onChange(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none transition-colors"
                style={{
                  background: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  border: '1.5px solid var(--color-border)',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--color-primary)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--color-border)' }}
              />
            </div>
          ))}
        </section>

        <button
          onClick={handleSave}
          className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          style={{ background: 'var(--color-primary)', color: '#fff' }}
        >
          {saveMsg || 'Guardar reflexión'}
        </button>
        <CuriosidadBlock texto="Esta dinámica se inspira en herramientas del coaching de vida y la activación conductual, y recoge ideas de la Terapia de Aceptación y Compromiso (ACT). Los tres coinciden en que observar cómo distribuimos el tiempo y la energía es el primer paso para tomar decisiones más alineadas con lo que realmente importa." />
        <ProfesionalLink modulo="parcelas" />
      </div>
    </div>
  )
}
