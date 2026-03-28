import { useNavigate } from 'react-router-dom'

interface Props {
  modulo: string
}

export default function ProfesionalLink({ modulo }: Props) {
  const navigate = useNavigate()

  return (
    <div
      className="mt-8 rounded-2xl p-5 text-center"
      style={{ background: 'var(--color-surface)', boxShadow: '0 2px 12px rgba(61,50,40,0.06)' }}
    >
      <p className="font-sans text-sm text-text-muted leading-relaxed mb-3">
        ¿Sientes que algo de lo que ha surgido aquí merece más atención?
      </p>
      <button
        onClick={() => navigate(`/contacto?desde=${encodeURIComponent(modulo)}`)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-sans text-sm font-semibold transition-all hover:opacity-80"
        style={{ background: 'var(--color-primary-container)', color: 'var(--color-primary)' }}
      >
        Llevar esto a un profesional
      </button>
    </div>
  )
}
