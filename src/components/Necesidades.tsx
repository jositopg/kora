import { useState, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PageHeader from './ui/PageHeader'
import ProfesionalLink from './ui/ProfesionalLink'
import ModuleIntro from './ui/ModuleIntro'
import type { NecesidadEntry } from '../types'

const PRIORITY_OPTIONS: Array<{ value: 'Alta' | 'Media' | 'Baja'; color: string }> = [
  { value: 'Alta', color: '#9e4a2c' },
  { value: 'Media', color: '#c4956a' },
  { value: 'Baja', color: '#6b8c6e' },
]

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0]
}

function formatDateLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}

function getLast14Days(): string[] {
  const days: string[] = []
  for (let i = 0; i < 14; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

function detectRecurringNeed(entries: NecesidadEntry[]): string | null {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 7)
  const last7 = entries.filter(e => new Date(e.date) >= cutoff)
  if (last7.length < 3) return null

  const wordCounts: Record<string, { total: number; unsatisfied: number }> = {}
  last7.forEach(entry => {
    const words = entry.necesidad.toLowerCase().split(/\s+/).filter(w => w.length > 3)
    const unique = [...new Set(words)]
    unique.forEach(word => {
      if (!wordCounts[word]) wordCounts[word] = { total: 0, unsatisfied: 0 }
      wordCounts[word].total++
      if (!entry.satisfecha) wordCounts[word].unsatisfied++
    })
  })
  for (const [word, counts] of Object.entries(wordCounts)) {
    if (counts.total >= 3 && counts.unsatisfied >= 2) return word
  }
  return null
}

export default function Necesidades() {
  const [entries, setEntries] = useLocalStorage<NecesidadEntry[]>('santuario_necesidades', [])
  const today = getTodayStr()
  const todayEntry = entries.find(e => e.date === today)

  const [necesidad, setNecesidad] = useState(todayEntry?.necesidad ?? '')
  const [mantuvo, setMantuvo] = useState<boolean>(todayEntry?.mantuvo ?? true)
  const [prioridad, setPrioridad] = useState<'Alta' | 'Media' | 'Baja'>(todayEntry?.prioridad ?? 'Media')
  const [satisfecha, setSatisfecha] = useState<boolean>(todayEntry?.satisfecha ?? false)
  const [detalle, setDetalle] = useState(todayEntry?.detalle ?? '')
  const [editMode, setEditMode] = useState(!todayEntry)
  const [saveMsg, setSaveMsg] = useState('')

  const last14 = getLast14Days()
  const recurringNeed = useMemo(() => detectRecurringNeed(entries), [entries])

  const handleSave = () => {
    if (!necesidad.trim()) return
    const entry: NecesidadEntry = {
      id: todayEntry?.id ?? `nec_${Date.now()}`,
      date: today,
      necesidad,
      mantuvo,
      prioridad,
      satisfecha,
      detalle,
    }
    setEntries(prev => {
      const without = prev.filter(e => e.date !== today)
      return [entry, ...without].sort((a, b) => b.date.localeCompare(a.date))
    })
    setEditMode(false)
    setSaveMsg('¡Guardado!')
    setTimeout(() => setSaveMsg(''), 2500)
  }

  const savedEntry = entries.find(e => e.date === today)

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto px-6 pt-8">
        <PageHeader
          title="Rastreo de Necesidades"
          subtitle="Observa tus necesidades día a día"
        />

        <ModuleIntro
          que="Un registro diario para tomar conciencia de tus necesidades básicas: descanso, movimiento, conexión, tiempo propio, alimentación... Anotas si esa necesidad estuvo presente, qué prioridad le diste y si pudiste atenderla."
          para="Muchas veces el malestar no viene de grandes problemas, sino de necesidades sistemáticamente ignoradas. Llevar este registro durante unos días te ayuda a detectar patrones: qué necesitas y qué te cuesta darte, para poder cuidarte de forma más consciente."
          pasos={[
            'Escribe una necesidad que tengas presente hoy o que hayas notado durante el día.',
            'Indica si esa necesidad estuvo presente: ¿la sentiste, la reconociste?',
            'Señala qué prioridad le diste: alta, media o baja.',
            '¿Pudiste atender a esa necesidad? Responde y añade cualquier detalle o reflexión que quieras guardar.',
            'Repite el proceso con tantas necesidades como quieras. Con el tiempo, el historial te mostrará qué patrones se repiten.',
          ]}
        />

        {/* Alert */}
        {recurringNeed && (
          <div
            className="rounded-2xl p-4 mb-5 flex items-start gap-3"
            style={{ background: '#fef3c7', border: '1.5px solid #f59e0b' }}
          >
            <span className="text-lg flex-shrink-0">⚠️</span>
            <p className="font-sans text-sm text-text">
              Hemos notado que <span className="font-semibold">"{recurringNeed}"</span> es una necesidad
              recurrente que no siempre se satisface. Reflexiona sobre el impacto que esto puede tener en tu bienestar.
            </p>
          </div>
        )}

        {/* Today */}
        <section
          className="rounded-2xl p-5 mb-6"
          style={{ background: 'var(--color-surface)', boxShadow: '0 2px 12px rgba(61,50,40,0.08)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-sans text-xs text-text-muted uppercase tracking-wide">Hoy</p>
              <p className="font-sans text-sm font-semibold text-text capitalize">{formatDateLabel(today)}</p>
            </div>
            {!editMode && savedEntry && (
              <button onClick={() => setEditMode(true)} className="font-sans text-xs text-primary underline">
                Editar
              </button>
            )}
          </div>

          {!editMode && savedEntry ? (
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-sans text-xs text-text-muted mb-1">Necesidad principal</p>
                <p className="font-sans text-sm text-text font-medium">{savedEntry.necesidad}</p>
              </div>
              <div className="flex gap-4 flex-wrap">
                <div>
                  <p className="font-sans text-xs text-text-muted mb-1">¿Se mantuvo?</p>
                  <span className="font-sans text-sm text-text">{savedEntry.mantuvo ? 'Sí' : 'No'}</span>
                </div>
                <div>
                  <p className="font-sans text-xs text-text-muted mb-1">Prioridad</p>
                  <span
                    className="px-2 py-0.5 rounded-full font-sans text-xs font-semibold"
                    style={{
                      background: (PRIORITY_OPTIONS.find(p => p.value === savedEntry.prioridad)?.color ?? '#888') + '22',
                      color: PRIORITY_OPTIONS.find(p => p.value === savedEntry.prioridad)?.color,
                    }}
                  >
                    {savedEntry.prioridad}
                  </span>
                </div>
                <div>
                  <p className="font-sans text-xs text-text-muted mb-1">¿Satisfecha?</p>
                  <span className="font-sans text-sm text-text">{savedEntry.satisfecha ? 'Sí' : 'No'}</span>
                </div>
              </div>
              {savedEntry.detalle && (
                <div>
                  <p className="font-sans text-xs text-text-muted mb-1">
                    {savedEntry.satisfecha ? '¿De qué manera?' : '¿Por qué no?'}
                  </p>
                  <p className="font-sans text-sm text-text">{savedEntry.detalle}</p>
                </div>
              )}
              {saveMsg && <p className="font-sans text-xs text-accent font-semibold">{saveMsg}</p>}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Q1 */}
              <div>
                <label className="block font-sans text-sm font-semibold text-text mb-2">
                  ¿Qué necesidad principal tuviste hoy al levantarte?
                </label>
                <input
                  type="text"
                  value={necesidad}
                  onChange={e => setNecesidad(e.target.value)}
                  placeholder="Ej: descanso, conexión, claridad..."
                  className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none transition-colors"
                  style={{
                    background: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    border: '1.5px solid var(--color-border)',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--color-primary)' }}
                  onBlur={e => { e.target.style.borderColor = 'var(--color-border)' }}
                />
              </div>

              {/* Q2 */}
              <div>
                <p className="font-sans text-sm font-semibold text-text mb-2">
                  ¿Esta necesidad se mantuvo a lo largo del día?
                </p>
                <div className="flex gap-2">
                  {([true, false] as const).map(val => (
                    <button
                      key={String(val)}
                      onClick={() => setMantuvo(val)}
                      className="flex-1 py-2.5 rounded-full font-sans text-sm font-medium transition-all"
                      style={{
                        background: mantuvo === val ? 'var(--color-primary)' : 'var(--color-surface-low)',
                        color: mantuvo === val ? '#fff' : 'var(--color-text-muted)',
                      }}
                    >
                      {val ? 'Sí' : 'No'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3 */}
              <div>
                <p className="font-sans text-sm font-semibold text-text mb-2">
                  ¿Qué posición/prioridad ocupó al finalizar tu día?
                </p>
                <div className="flex gap-2">
                  {PRIORITY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setPrioridad(opt.value)}
                      className="flex-1 py-2.5 rounded-full font-sans text-sm font-medium transition-all"
                      style={{
                        background: prioridad === opt.value ? opt.color : 'var(--color-surface-low)',
                        color: prioridad === opt.value ? '#fff' : 'var(--color-text-muted)',
                      }}
                    >
                      {opt.value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q4 */}
              <div>
                <p className="font-sans text-sm font-semibold text-text mb-2">¿Atendiste a esa necesidad?</p>
                <div className="flex gap-2 mb-3">
                  {([true, false] as const).map(val => (
                    <button
                      key={String(val)}
                      onClick={() => setSatisfecha(val)}
                      className="flex-1 py-2.5 rounded-full font-sans text-sm font-medium transition-all"
                      style={{
                        background: satisfecha === val
                          ? val ? 'var(--color-accent)' : '#9e4a2c'
                          : 'var(--color-surface-low)',
                        color: satisfecha === val ? '#fff' : 'var(--color-text-muted)',
                      }}
                    >
                      {val ? 'Sí' : 'No'}
                    </button>
                  ))}
                </div>
                <textarea
                  value={detalle}
                  onChange={e => setDetalle(e.target.value)}
                  rows={2}
                  placeholder={satisfecha ? '¿De qué manera la atendiste?' : '¿Por qué no pudiste atenderla?'}
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
                disabled={!necesidad.trim()}
                className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                style={{ background: 'var(--color-primary)', color: '#fff' }}
              >
                {saveMsg || 'Guardar entrada de hoy'}
              </button>
            </div>
          )}
        </section>

        {/* Calendar / History */}
        <section>
          <p className="font-sans text-sm font-semibold text-text mb-3">Últimos 14 días</p>
          <div className="flex flex-col gap-2">
            {last14.map(dateStr => {
              const entry = entries.find(e => e.date === dateStr)
              const isToday = dateStr === today
              const priorityColor = entry
                ? PRIORITY_OPTIONS.find(p => p.value === entry.prioridad)?.color ?? '#888'
                : '#888'
              return (
                <div
                  key={dateStr}
                  className="rounded-2xl p-3 flex items-center gap-3"
                  style={{
                    background: isToday ? 'var(--color-primary-container)' : 'var(--color-surface)',
                    opacity: entry ? 1 : 0.55,
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      background: entry
                        ? entry.satisfecha ? '#6b8c6e' : '#9e4a2c'
                        : 'var(--color-border)',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide">
                      {formatDateLabel(dateStr)}{isToday ? ' — hoy' : ''}
                    </p>
                    {entry ? (
                      <p className="font-sans text-sm text-text truncate">{entry.necesidad}</p>
                    ) : (
                      <p className="font-sans text-xs text-text-muted italic">Sin registro</p>
                    )}
                  </div>
                  {entry && (
                    <span
                      className="px-2 py-0.5 rounded-full font-sans text-xs font-semibold flex-shrink-0"
                      style={{
                        background: priorityColor + '22',
                        color: priorityColor,
                      }}
                    >
                      {entry.prioridad}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </section>
        <ProfesionalLink modulo="necesidades" />
      </div>
    </div>
  )
}
