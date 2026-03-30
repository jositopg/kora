import { useState, useRef } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PageHeader from './ui/PageHeader'
import ProfesionalLink from './ui/ProfesionalLink'
import ModuleIntro from './ui/ModuleIntro'

// ─── Types ────────────────────────────────────────────────────────────────────

type Fase = 'vaciado' | 'swipe' | 'radar' | 'integracion'

interface RadarParte {
  id: string
  etiqueta: string
  fuente: 'inicial' | 'descubierta'
  angulo: number    // degrees 0–360
  distancia: number // 0 (center) → 1 (edge)
}

interface RadarEntry {
  id: string
  etiquetasIniciales: string[]
  partes: RadarParte[]
  createdAt: string
  updatedAt: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TARJETAS = [
  'Creativo/a', 'Curioso/a', 'Empático/a', 'Resiliente', 'Protector/a',
  'Valiente', 'Sensible', 'Reflexivo/a', 'Apasionado/a', 'Tranquilo/a',
  'Divertido/a', 'Honesto/a', 'Generoso/a', 'Adaptable', 'Intuitivo/a',
  'Soñador/a', 'Cuidador/a', 'Auténtico/a', 'Independiente', 'Leal',
  'Cuando ayudo a alguien', 'Cuando aprendo algo nuevo',
  'Cuando cuido a quien quiero', 'Cuando defiendo lo que es justo',
  'Cuando estoy en silencio', 'Cuando me río con otros',
  'Cuando supero un miedo', 'Cuando confío en mi instinto',
  'Cuando creo algo con mis manos', 'Cuando estoy en la naturaleza',
  'Cuando tomo decisiones difíciles', 'Cuando escucho de verdad a alguien',
  'Cuando pido ayuda sin culpa', 'Cuando me permito descansar',
  'Cuando defiendo mis límites',
]

const COLORS = [
  '#b07068', '#9e7850', '#c4956a', '#8b7355', '#a87070',
  '#7a9e8e', '#6b8f7a', '#8aaa96', '#5e8a75', '#7b9a8a',
  '#b06040', '#7a6b5a', '#c49a80', '#9e8060', '#a06858',
  '#8a7a9e', '#9e7a8a', '#7a8a9e', '#9e9a7a', '#7a9e9e',
]

// ─── Radar geometry constants (virtual 300×300 space) ─────────────────────────

const V = 300
const VCX = V / 2
const VCY = V / 2
const VMAX_R = 128

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function distribuirPartes(partes: RadarParte[]): RadarParte[] {
  return partes.map((p, i) => ({
    ...p,
    angulo: (i / partes.length) * 360 - 90,
    distancia: p.fuente === 'inicial' ? 0.70 : 0.88,
  }))
}

function parteToPercent(p: RadarParte) {
  const rad = (p.angulo * Math.PI) / 180
  return {
    left: ((VCX + p.distancia * VMAX_R * Math.cos(rad)) / V) * 100,
    top:  ((VCY + p.distancia * VMAX_R * Math.sin(rad)) / V) * 100,
  }
}

// ─── RadarDisplay: non-interactive, used for history ─────────────────────────

function RadarDisplay({ partes, size = 220 }: { partes: RadarParte[]; size?: number }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg
        viewBox={`0 0 ${V} ${V}`}
        width={size}
        height={size}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        {[1, 0.667, 0.333].map((r, i) => (
          <circle
            key={i}
            cx={VCX} cy={VCY}
            r={VMAX_R * r}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={i === 0 ? 1.5 : 1}
            strokeDasharray={i > 0 ? '5 5' : undefined}
            opacity={i === 0 ? 1 : 0.6}
          />
        ))}
        <circle cx={VCX} cy={VCY} r={18} fill="var(--color-primary)" opacity={0.1} />
        <circle cx={VCX} cy={VCY} r={5}  fill="var(--color-primary)" />
      </svg>
      {partes.map((p, i) => {
        const { left, top } = parteToPercent(p)
        const color = COLORS[i % COLORS.length]
        const scale = size / V
        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: `${top}%`,
              transform: 'translate(-50%, -50%)',
              background: `${color}22`,
              border: `1.5px solid ${color}77`,
              color,
              borderRadius: 99,
              padding: `${Math.max(2, 3 * scale)}px ${Math.max(5, 8 * scale)}px`,
              fontSize: Math.max(8, 10 * scale),
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              lineHeight: 1.2,
            }}
          >
            {p.etiqueta}
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Identidad() {
  const [entries, setEntries] = useLocalStorage<RadarEntry[]>('kora_radar', [])
  const latestEntry = entries[0] ?? null

  const [fase, setFase] = useState<Fase>(latestEntry ? 'radar' : 'vaciado')

  // Phase 1
  const [etiquetasIniciales, setEtiquetasIniciales] = useState<string[]>(
    latestEntry?.etiquetasIniciales ?? []
  )
  const [inputEtiqueta, setInputEtiqueta] = useState('')

  // Phase 2
  const [swipeIndex, setSwipeIndex]               = useState(0)
  const [swipeOffset, setSwipeOffset]             = useState(0)
  const [swipeStartX, setSwipeStartX]             = useState<number | null>(null)
  const [swipeExiting, setSwipeExiting]           = useState<'left' | 'right' | null>(null)

  // Shared: parts
  const [partes, setPartes] = useState<RadarParte[]>(latestEntry?.partes ?? [])

  // Phase 3: drag
  const [dragId, setDragId]           = useState<string | null>(null)
  const [savedFeedback, setSavedFeedback] = useState(false)
  const radarRef = useRef<HTMLDivElement>(null)

  // History
  const [showHistory, setShowHistory] = useState(false)
  const [expandedId, setExpandedId]   = useState<string | null>(null)

  const isUpdateMode = !!latestEntry && fase === 'radar'

  const cardStyle = {
    background: 'var(--color-surface)',
    boxShadow: '0 2px 12px rgba(61,50,40,0.08)',
  }
  const inputStyle = {
    background: 'var(--color-bg)',
    color: 'var(--color-text)',
    border: '1.5px solid var(--color-border)',
  }

  // ── Phase 1 ──────────────────────────────────────────────────────────────

  const addEtiqueta = () => {
    const t = inputEtiqueta.trim()
    if (!t) return
    setEtiquetasIniciales(prev => [...prev, t])
    setInputEtiqueta('')
  }

  const goToSwipe = () => {
    const iniciales: RadarParte[] = etiquetasIniciales.map((e, i) => ({
      id: `ini_${Date.now()}_${i}`,
      etiqueta: e,
      fuente: 'inicial',
      angulo: 0,
      distancia: 0.70,
    }))
    setPartes(iniciales)
    setSwipeIndex(0)
    setSwipeOffset(0)
    setSwipeStartX(null)
    setFase('swipe')
  }

  // ── Phase 2 ──────────────────────────────────────────────────────────────

  const SWIPE_THRESHOLD = 70

  const handleSwipePtrDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setSwipeStartX(e.clientX)
  }
  const handleSwipePtrMove = (e: React.PointerEvent) => {
    if (swipeStartX === null) return
    setSwipeOffset(e.clientX - swipeStartX)
  }
  const handleSwipePtrUp = (e: React.PointerEvent) => {
    if (swipeStartX === null) return
    const dx = e.clientX - swipeStartX
    if (dx > SWIPE_THRESHOLD)       triggerSwipe('right')
    else if (dx < -SWIPE_THRESHOLD) triggerSwipe('left')
    else { setSwipeOffset(0); setSwipeStartX(null) }
  }

  const triggerSwipe = (dir: 'left' | 'right') => {
    setSwipeExiting(dir)
    setSwipeStartX(null)
    if (dir === 'right') {
      const parte: RadarParte = {
        id: `disc_${Date.now()}_${swipeIndex}`,
        etiqueta: TARJETAS[swipeIndex],
        fuente: 'descubierta',
        angulo: 0,
        distancia: 0.88,
      }
      setPartes(prev => [...prev, parte])
    }
    setTimeout(() => {
      setSwipeExiting(null)
      setSwipeOffset(0)
      if (swipeIndex >= TARJETAS.length - 1) {
        setPartes(prev => distribuirPartes(prev))
        setFase('radar')
      } else {
        setSwipeIndex(i => i + 1)
      }
    }, 280)
  }

  const skipToRadar = () => {
    setPartes(prev => distribuirPartes(prev))
    setFase('radar')
  }

  // ── Phase 3: radar drag ───────────────────────────────────────────────────

  const makeDragHandlers = (parteId: string) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault()
      e.currentTarget.setPointerCapture(e.pointerId)
      setDragId(parteId)
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (dragId !== parteId || !radarRef.current) return
      e.preventDefault()
      const rect = radarRef.current.getBoundingClientRect()
      const xRel = (e.clientX - rect.left) / rect.width
      const yRel = (e.clientY - rect.top)  / rect.height
      const vx = xRel * V - VCX
      const vy = yRel * V - VCY
      const dist = Math.sqrt(vx * vx + vy * vy)
      const angulo   = Math.atan2(vy, vx) * (180 / Math.PI)
      const distancia = Math.max(0.02, Math.min(1, dist / VMAX_R))
      setPartes(prev => prev.map(p => p.id === parteId ? { ...p, angulo, distancia } : p))
    },
    onPointerUp: () => setDragId(null),
  })

  // ── Save ──────────────────────────────────────────────────────────────────

  const saveEntry = (goToIntegracion: boolean) => {
    const now = new Date().toISOString()
    const entry: RadarEntry = {
      id: `radar_${Date.now()}`,
      etiquetasIniciales,
      partes,
      createdAt: latestEntry?.createdAt ?? now,
      updatedAt: now,
    }
    setEntries(prev => [entry, ...prev])
    if (goToIntegracion) {
      setFase('integracion')
    } else {
      setSavedFeedback(true)
      setTimeout(() => setSavedFeedback(false), 2000)
    }
  }

  const handleReset = () => {
    setEtiquetasIniciales([])
    setPartes([])
    setSwipeIndex(0)
    setSwipeOffset(0)
    setSwipeStartX(null)
    setShowHistory(false)
    setFase('vaciado')
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto px-6 pt-8">

        <PageHeader
          title="Tu Radar de Identidad"
          subtitle="Eres más de lo que crees"
        />

        <ModuleIntro
          que="Un mapa visual e interactivo de todas las partes que te forman. Explorarás tanto las etiquetas que sientes que te limitan como facetas tuyas que quizá no sueles reconocer."
          para="Solemos identificarnos con una versión rígida de nosotros mismos. Este ejercicio demuestra visualmente que eres el contenedor de múltiples estados y partes. Puedes volver cuando quieras y reposicionar tu radar según cómo te encuentres en ese momento."
          pasos={[
            'Escribe las etiquetas con las que te describes habitualmente, especialmente las que sientes que te definen de forma limitante.',
            'Explora un mazo de tarjetas: desliza a la derecha las partes que también viven en ti, a la izquierda las que no resuenen.',
            'Coloca cada parte en tu radar: arrastra las más activas hoy hacia el centro, y aleja las que estén en segundo plano.',
            'Guarda tu radar. Podrás volver a reposicionarlo según cómo te encuentres en cada momento de tu vida.',
          ]}
          enfoques={['Terapia de Aceptación y Compromiso (ACT)', 'Psicología de la identidad', 'Teoría de la Autocomplejidad']}
        />

        {/* ── FASE 1: Vaciado inicial ─────────────────────────────────────── */}
        {fase === 'vaciado' && (
          <div>
            <div className="rounded-2xl p-5 mb-5" style={cardStyle}>
              <p className="font-sans text-sm text-text-muted leading-relaxed mb-4">
                ¿Cómo te describes a ti mismo/a? Escribe las etiquetas que sientes que te definen —
                especialmente aquellas que percibas como limitantes o muy dominantes.
              </p>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={inputEtiqueta}
                  onChange={e => setInputEtiqueta(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addEtiqueta() } }}
                  placeholder="Ej: ansiosa, perfeccionista, insegura..."
                  className="flex-1 px-4 py-2.5 rounded-xl font-sans text-sm outline-none"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                  onBlur={e =>  (e.target.style.borderColor = 'var(--color-border)')}
                />
                <button
                  onClick={addEtiqueta}
                  disabled={!inputEtiqueta.trim()}
                  className="px-5 py-2.5 rounded-xl font-sans text-sm font-semibold transition-all disabled:opacity-40"
                  style={{ background: 'var(--color-primary)', color: '#fff' }}
                >+</button>
              </div>

              {etiquetasIniciales.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {etiquetasIniciales.map((e, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-sm"
                      style={{ background: '#b0706822', border: '1.5px solid #b0706855', color: '#b07068' }}
                    >
                      <span>{e}</span>
                      <button
                        onClick={() => setEtiquetasIniciales(prev => prev.filter((_, j) => j !== i))}
                        className="opacity-60 hover:opacity-100 text-base leading-none"
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={goToSwipe}
              disabled={etiquetasIniciales.length < 1}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              {etiquetasIniciales.length < 1
                ? 'Añade al menos una etiqueta'
                : 'Descubrir más partes →'}
            </button>

            {entries.length > 0 && (
              <>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full mt-3 py-3 rounded-full font-sans text-sm font-medium"
                  style={{ background: 'var(--color-surface-low)', color: 'var(--color-text-muted)' }}
                >
                  {showHistory ? 'Ocultar' : 'Ver'} historial ({entries.length})
                </button>

                {showHistory && (
                  <div className="mt-4 flex flex-col gap-3">
                    {entries.map(entry => (
                      <div key={entry.id} className="rounded-2xl overflow-hidden" style={cardStyle}>
                        <button
                          className="w-full text-left p-4"
                          onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                        >
                          <p className="font-sans text-xs text-text-muted mb-2">{formatDate(entry.updatedAt)}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {entry.partes.slice(0, 5).map((p, i) => (
                              <span
                                key={p.id}
                                className="px-2.5 py-1 rounded-full font-sans text-xs"
                                style={{ background: `${COLORS[i % COLORS.length]}22`, color: COLORS[i % COLORS.length] }}
                              >{p.etiqueta}</span>
                            ))}
                            {entry.partes.length > 5 && (
                              <span className="px-2.5 py-1 rounded-full font-sans text-xs text-text-muted"
                                style={{ background: 'var(--color-surface-low)' }}>
                                +{entry.partes.length - 5} más
                              </span>
                            )}
                          </div>
                        </button>
                        {expandedId === entry.id && (
                          <div className="px-4 pb-4 pt-2 border-t flex flex-col items-center gap-3" style={{ borderColor: 'var(--color-border)' }}>
                            <RadarDisplay partes={entry.partes} size={220} />
                            {entry.etiquetasIniciales.length > 0 && (
                              <div className="text-center">
                                <p className="font-sans text-xs text-text-muted mb-1.5">Empezaste definiéndote como:</p>
                                <div className="flex flex-wrap gap-1.5 justify-center">
                                  {entry.etiquetasIniciales.map((e, i) => (
                                    <span key={i} className="px-2.5 py-1 rounded-full font-sans text-xs"
                                      style={{ background: '#b0706822', color: '#b07068' }}>{e}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── FASE 2: Swipe de tarjetas ───────────────────────────────────── */}
        {fase === 'swipe' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-sans text-sm text-text-muted">
                {swipeIndex + 1} <span className="opacity-50">/ {TARJETAS.length}</span>
              </p>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ width: 140, background: 'var(--color-border)' }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${(swipeIndex / TARJETAS.length) * 100}%`, background: 'var(--color-primary)' }}
                />
              </div>
            </div>

            <p className="font-sans text-xs text-text-muted text-center mb-4 opacity-70">
              → Vive en mí &nbsp;·&nbsp; ← No resuena
            </p>

            {/* Card stack */}
            <div className="relative flex justify-center mb-6" style={{ height: 220 }}>
              {/* Card behind */}
              {swipeIndex + 1 < TARJETAS.length && (
                <div
                  className="absolute rounded-3xl flex items-center justify-center px-8"
                  style={{
                    ...cardStyle,
                    width: '86%',
                    height: 200,
                    top: 14,
                    transform: 'scale(0.93)',
                    opacity: 0.55,
                    pointerEvents: 'none',
                  }}
                >
                  <p className="font-sans text-sm text-text-muted text-center">{TARJETAS[swipeIndex + 1]}</p>
                </div>
              )}

              {/* Current card */}
              <div
                className="absolute rounded-3xl flex items-center justify-center px-8 select-none overflow-hidden"
                style={{
                  ...cardStyle,
                  width: '90%',
                  height: 200,
                  top: 0,
                  cursor: swipeStartX !== null ? 'grabbing' : 'grab',
                  transform: swipeExiting === 'right'
                    ? 'translateX(130%) rotate(22deg)'
                    : swipeExiting === 'left'
                    ? 'translateX(-130%) rotate(-22deg)'
                    : `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.04}deg)`,
                  transition: swipeStartX !== null ? 'none' : 'transform 0.28s cubic-bezier(0.25,0.46,0.45,0.94)',
                  userSelect: 'none',
                  touchAction: 'none',
                }}
                onPointerDown={handleSwipePtrDown}
                onPointerMove={handleSwipePtrMove}
                onPointerUp={handleSwipePtrUp}
              >
                {/* Accept tint */}
                {swipeOffset > 30 && (
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: 'inherit',
                    background: 'rgba(122,158,142,0.10)', pointerEvents: 'none',
                  }} />
                )}
                {/* Reject tint */}
                {swipeOffset < -30 && (
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: 'inherit',
                    background: 'rgba(176,112,104,0.10)', pointerEvents: 'none',
                  }} />
                )}

                {/* Accept badge */}
                {swipeOffset > 45 && (
                  <div className="absolute top-5 left-5 px-3 py-1 rounded-full font-sans text-xs font-bold"
                    style={{
                      border: '2px solid #7a9e8e', color: '#7a9e8e',
                      opacity: Math.min(1, (swipeOffset - 45) / 55),
                    }}>EN MÍ ✓</div>
                )}
                {/* Reject badge */}
                {swipeOffset < -45 && (
                  <div className="absolute top-5 right-5 px-3 py-1 rounded-full font-sans text-xs font-bold"
                    style={{
                      border: '2px solid #b07068', color: '#b07068',
                      opacity: Math.min(1, (-swipeOffset - 45) / 55),
                    }}>NO ✕</div>
                )}

                <p className="font-serif text-xl font-semibold text-text text-center leading-snug">
                  {TARJETAS[swipeIndex]}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => triggerSwipe('left')}
                className="flex-1 py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-80 active:scale-95"
                style={{ background: '#b0706818', color: '#b07068', border: '1.5px solid #b0706850' }}
              >
                No resuena
              </button>
              <button
                onClick={() => triggerSwipe('right')}
                className="flex-1 py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-80 active:scale-95"
                style={{ background: '#7a9e8e18', color: '#7a9e8e', border: '1.5px solid #7a9e8e50' }}
              >
                Vive en mí ✓
              </button>
            </div>

            {partes.filter(p => p.fuente === 'descubierta').length > 0 && (
              <p className="font-sans text-xs text-text-muted text-center mb-3 opacity-70">
                {partes.filter(p => p.fuente === 'descubierta').length} parte
                {partes.filter(p => p.fuente === 'descubierta').length !== 1 ? 's' : ''} aceptada
                {partes.filter(p => p.fuente === 'descubierta').length !== 1 ? 's' : ''}
              </p>
            )}

            <button
              onClick={skipToRadar}
              className="w-full py-3 rounded-full font-sans text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Saltar al radar →
            </button>
          </div>
        )}

        {/* ── FASE 3: Radar interactivo ───────────────────────────────────── */}
        {fase === 'radar' && (
          <div>
            {isUpdateMode && latestEntry && (
              <div
                className="rounded-2xl p-4 mb-4 flex items-center justify-between"
                style={{ background: 'var(--color-surface-low)', border: '1px solid var(--color-border)' }}
              >
                <p className="font-sans text-xs text-text-muted">
                  Última actualización: <strong>{formatDate(latestEntry.updatedAt)}</strong>
                </p>
              </div>
            )}

            <p className="font-sans text-sm text-text-muted text-center mb-5 leading-relaxed">
              Arrastra cada parte hacia el <strong>centro</strong> si está muy activa hoy,
              o hacia el <strong>borde</strong> si está más en segundo plano.
            </p>

            {/* Radar container */}
            <div
              ref={radarRef}
              className="relative mx-auto mb-2"
              style={{ width: '100%', maxWidth: 300, aspectRatio: '1', touchAction: 'none' }}
            >
              {/* SVG rings */}
              <svg
                viewBox={`0 0 ${V} ${V}`}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
              >
                {[1, 0.667, 0.333].map((r, i) => (
                  <circle
                    key={i}
                    cx={VCX} cy={VCY}
                    r={VMAX_R * r}
                    fill="none"
                    stroke="var(--color-border)"
                    strokeWidth={i === 0 ? 1.5 : 1}
                    strokeDasharray={i > 0 ? '5 5' : undefined}
                    opacity={i === 0 ? 0.8 : 0.45}
                  />
                ))}
                <circle cx={VCX} cy={VCY} r={22} fill="var(--color-primary)" opacity={0.12} />
                <circle cx={VCX} cy={VCY} r={5}  fill="var(--color-primary)" />
              </svg>

              {/* Center "YO" label */}
              <div style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, calc(-50% + 14px))',
                fontFamily: 'Manrope, sans-serif',
                fontSize: 9,
                fontWeight: 800,
                color: 'var(--color-primary)',
                letterSpacing: '0.08em',
                pointerEvents: 'none',
                opacity: 0.85,
              }}>YO</div>

              {/* Ring label: inner */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: `${((VCY - VMAX_R * 0.333) / V) * 100 - 3}%`,
                transform: 'translateX(-50%)',
                fontFamily: 'Manrope, sans-serif',
                fontSize: 8,
                color: 'var(--color-text-muted)',
                opacity: 0.5,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}>Muy activo</div>

              {/* Ring label: outer */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: `${((VCY - VMAX_R * 0.98) / V) * 100 - 2.5}%`,
                transform: 'translateX(-50%)',
                fontFamily: 'Manrope, sans-serif',
                fontSize: 8,
                color: 'var(--color-text-muted)',
                opacity: 0.5,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}>En pausa</div>

              {/* Satellites */}
              {partes.map((p, i) => {
                const { left, top } = parteToPercent(p)
                const color = COLORS[i % COLORS.length]
                const isDragging = dragId === p.id
                const handlers = makeDragHandlers(p.id)
                return (
                  <div
                    key={p.id}
                    {...handlers}
                    style={{
                      position: 'absolute',
                      left: `${left}%`,
                      top: `${top}%`,
                      transform: 'translate(-50%, -50%)',
                      background: isDragging ? color : `${color}22`,
                      border: `1.5px solid ${color}${isDragging ? 'ff' : '88'}`,
                      color: isDragging ? '#fff' : color,
                      borderRadius: 99,
                      padding: '3px 9px',
                      fontSize: 11,
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      cursor: isDragging ? 'grabbing' : 'grab',
                      userSelect: 'none',
                      touchAction: 'none',
                      zIndex: isDragging ? 10 : 1,
                      transition: isDragging
                        ? 'none'
                        : 'background 0.15s, border-color 0.15s, color 0.15s, box-shadow 0.15s',
                      boxShadow: isDragging ? `0 4px 14px ${color}55` : 'none',
                    }}
                  >
                    {p.etiqueta}
                    {p.fuente === 'inicial' && (
                      <span style={{
                        display: 'inline-block',
                        width: 5, height: 5,
                        borderRadius: '50%',
                        background: 'currentColor',
                        marginLeft: 5,
                        verticalAlign: 'middle',
                        opacity: 0.7,
                      }} />
                    )}
                  </div>
                )
              })}
            </div>

            <p className="font-sans text-xs text-text-muted text-center mb-6 opacity-55">
              • Las partes marcadas son las que escribiste al inicio
            </p>

            <button
              onClick={() => saveEntry(!isUpdateMode)}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
              style={{ background: savedFeedback ? '#7a9e8e' : 'var(--color-primary)', color: '#fff' }}
            >
              {savedFeedback ? '✓ Guardado' : isUpdateMode ? 'Guardar posición actual' : 'Guardar mi radar →'}
            </button>

            {isUpdateMode && (
              <button
                onClick={handleReset}
                className="w-full mt-3 py-3 rounded-full font-sans text-sm"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Nueva exploración desde cero
              </button>
            )}

            {entries.length > 0 && (
              <>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full mt-3 py-3 rounded-full font-sans text-sm font-medium"
                  style={{ background: 'var(--color-surface-low)', color: 'var(--color-text-muted)' }}
                >
                  {showHistory ? 'Ocultar' : 'Ver'} historial ({entries.length})
                </button>

                {showHistory && (
                  <div className="mt-4 flex flex-col gap-3">
                    {entries.map(entry => (
                      <div key={entry.id} className="rounded-2xl overflow-hidden" style={cardStyle}>
                        <button
                          className="w-full text-left p-4"
                          onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                        >
                          <p className="font-sans text-xs text-text-muted">{formatDate(entry.updatedAt)}</p>
                        </button>
                        {expandedId === entry.id && (
                          <div className="px-4 pb-4 border-t flex flex-col items-center gap-4" style={{ borderColor: 'var(--color-border)' }}>
                            <div className="mt-3">
                              <RadarDisplay partes={entry.partes} size={220} />
                            </div>
                            {entry.etiquetasIniciales.length > 0 && (
                              <div className="text-center w-full">
                                <p className="font-sans text-xs text-text-muted mb-1.5">Empezaste definiéndote como:</p>
                                <div className="flex flex-wrap gap-1.5 justify-center">
                                  {entry.etiquetasIniciales.map((e, i) => (
                                    <span key={i} className="px-2.5 py-1 rounded-full font-sans text-xs"
                                      style={{ background: '#b0706822', color: '#b07068' }}>{e}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── FASE 4: Integración ─────────────────────────────────────────── */}
        {fase === 'integracion' && (
          <div>
            <div className="rounded-2xl p-6 mb-5" style={cardStyle}>
              <p className="font-serif text-lg font-semibold text-text mb-5 text-center">
                Fíjate en tu radar
              </p>

              <div className="flex justify-center mb-5">
                <RadarDisplay partes={partes} size={260} />
              </div>

              {etiquetasIniciales.length > 0 && (
                <div className="mb-5 p-4 rounded-xl" style={{ background: 'var(--color-surface-low)' }}>
                  <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                    Empezaste definiéndote como
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {etiquetasIniciales.map((e, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full font-sans text-sm"
                        style={{ background: '#b0706822', color: '#b07068', border: '1px solid #b0706855' }}
                      >{e}</span>
                    ))}
                  </div>
                </div>
              )}

              <p className="font-sans text-sm text-text leading-relaxed text-center"
                style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
                "Fíjate en tu radar. Tu definición no es estable ni única; es amplia. Eres el espacio donde coexisten todas estas partes. En determinadas situaciones unas se acercan a ti, y en otras dejan paso a las demás."
              </p>
            </div>

            <button
              onClick={() => setFase('radar')}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Volver a mi radar
            </button>

            <button
              onClick={handleReset}
              className="w-full mt-3 py-3 rounded-full font-sans text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Nueva exploración
            </button>
          </div>
        )}

        <ProfesionalLink modulo="identidad" />
      </div>
    </div>
  )
}
