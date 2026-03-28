import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function Disclaimer() {
  const navigate = useNavigate()
  const [, setSeenDisclaimer] = useLocalStorage<boolean>('santuario_seen_disclaimer', false)

  const handleEnter = () => {
    setSeenDisclaimer(true)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12" style={{ background: 'linear-gradient(160deg, #f5e2db 0%, #eedac8 60%, #e8d0be 100%)' }}>
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <svg viewBox="0 0 240 130" fill="none" xmlns="http://www.w3.org/2000/svg" width="220">
            <path d="M 22,95 L 22,43 A 28,28 0 0,1 78,43 L 78,95" stroke="#A0633A" strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="12" y1="100" x2="88" y2="100" stroke="#A0633A" strokeWidth="3.5" strokeLinecap="round"/>
            <text x="106" y="82" fontFamily="'Manrope', sans-serif" fontSize="34" fontWeight="300" letterSpacing="10" fill="#111111">KORA</text>
          </svg>
        </div>

        <p className="text-text-muted font-sans text-sm mb-8 tracking-wide uppercase">
          Herramientas de autoconocimiento
        </p>

        {/* Welcome text */}
        <div
          className="rounded-2xl p-6 mb-4 text-left"
          style={{ background: 'rgba(255,248,244,0.75)', boxShadow: '0 2px 12px rgba(61,50,40,0.10)', backdropFilter: 'blur(4px)' }}
        >
          <p className="font-sans text-text leading-relaxed mb-3">
            Bienvenida/o a tu espacio de reflexión personal. Aquí encontrarás herramientas para explorar tus emociones,
            pensamientos y necesidades del día a día con mayor claridad y compasión.
          </p>
          <p className="font-sans text-text leading-relaxed">
            Todo lo que registres se guarda únicamente en tu dispositivo. Es un espacio tuyo, privado y seguro.
          </p>
        </div>

        {/* Disclaimer */}
        <div
          className="rounded-2xl p-5 mb-8 text-left"
          style={{
            background: 'rgba(232,216,200,0.85)',
            border: '1.5px solid rgba(160,99,58,0.25)',
          }}
        >
          <p className="font-sans text-sm font-semibold text-text mb-2">Antes de entrar, ten en cuenta:</p>
          <ul className="font-sans text-sm text-text-muted leading-relaxed space-y-2">
            <li className="flex gap-2">
              <span className="flex-shrink-0 mt-0.5">·</span>
              <span>KORA es una herramienta de <strong className="text-text">gestión del día a día</strong>, no un sustituto de la terapia.</span>
            </li>
            <li className="flex gap-2">
              <span className="flex-shrink-0 mt-0.5">·</span>
              <span>Si algo te está generando un <strong className="text-text">malestar significativo</strong>, este no es el espacio adecuado para gestionarlo. Para eso está la terapia.</span>
            </li>
            <li className="flex gap-2">
              <span className="flex-shrink-0 mt-0.5">·</span>
              <span>Nada de lo que encuentres aquí reemplaza la relación con un <strong className="text-text">profesional de la salud mental</strong>.</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <button
          onClick={handleEnter}
          className="w-full py-4 px-8 rounded-full font-sans font-semibold text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'var(--color-primary)',
            color: '#fff',
            boxShadow: '0 4px 16px rgba(139,115,85,0.35)',
          }}
        >
          Entrar con conciencia
        </button>

        <p className="mt-4 font-sans text-xs text-text-muted">
          Al entrar, aceptas los términos descritos anteriormente
        </p>
      </div>
    </div>
  )
}
