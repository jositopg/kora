import { useState } from 'react'

interface Props {
  que: string
  para: string
}

export default function ModuleIntro({ que, para }: Props) {
  const [open, setOpen] = useState(true)

  return (
    <div
      className="rounded-2xl mb-6 overflow-hidden"
      style={{ background: 'var(--color-surface)', boxShadow: '0 2px 12px rgba(61,50,40,0.07)' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-sans text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-primary)' }}>
          ¿En qué consiste este espacio?
        </span>
        <span className="font-sans text-base text-text-muted" style={{ lineHeight: 1 }}>
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5">
          <div className="mb-3">
            <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Qué es</p>
            <p className="font-sans text-sm text-text leading-relaxed">{que}</p>
          </div>
          <div
            className="rounded-xl p-4"
            style={{ background: 'var(--color-primary-container)' }}
          >
            <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Para qué sirve</p>
            <p className="font-sans text-sm text-text leading-relaxed">{para}</p>
          </div>
        </div>
      )}
    </div>
  )
}
