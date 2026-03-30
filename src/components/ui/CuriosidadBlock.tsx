import { useState } from 'react'

interface Props {
  texto: string
}

export default function CuriosidadBlock({ texto }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="rounded-2xl mb-5 overflow-hidden"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left"
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>✦</span>
        <span className="flex-1 font-sans text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>
          Curiosidad
        </span>
        <span className="font-sans text-base text-text-muted" style={{ lineHeight: 1 }}>
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1">
          <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            {texto}
          </p>
        </div>
      )}
    </div>
  )
}
