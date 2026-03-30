import { useState } from 'react'

interface Props {
  que?: string
  para?: string
  pasos?: string[]
  enfoques?: string[]
}

export default function ModuleIntro({ que, para, pasos, enfoques }: Props) {
  const [open, setOpen] = useState(true)

  const hasContent = que || para || (pasos && pasos.length > 0)

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
          {que && (
            <div className="mb-3">
              <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Qué es</p>
              <p className="font-sans text-sm text-text leading-relaxed">{que}</p>
            </div>
          )}

          {para && (
            <div className="rounded-xl p-4 mb-3" style={{ background: 'var(--color-primary-container)' }}>
              <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Para qué sirve</p>
              <p className="font-sans text-sm text-text leading-relaxed">{para}</p>
            </div>
          )}

          {pasos && pasos.length > 0 && (
            <div className={enfoques && enfoques.length > 0 ? 'mb-4' : ''}>
              <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Cómo funciona</p>
              <ol className="flex flex-col gap-2.5">
                {pasos.map((paso, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-sans text-xs font-semibold mt-0.5"
                      style={{ background: 'var(--color-surface-high)', color: 'var(--color-primary)' }}
                    >
                      {idx + 1}
                    </span>
                    <p className="font-sans text-sm text-text leading-relaxed">{paso}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {enfoques && enfoques.length > 0 && (
            <div className={hasContent ? 'pt-4 border-t' : ''} style={hasContent ? { borderColor: 'var(--color-border)' } : {}}>
              <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                Enfoque terapéutico
              </p>
              <div className="flex flex-wrap gap-1.5">
                {enfoques.map((e, i) => (
                  <span
                    key={i}
                    className="font-sans text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: 'var(--color-surface-low)',
                      color: 'var(--color-text-muted)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
