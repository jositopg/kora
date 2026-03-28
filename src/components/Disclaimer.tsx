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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12" style={{ background: 'var(--color-bg)' }}>
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
          className="rounded-2xl p-6 mb-6 text-left"
          style={{ background: 'var(--color-surface)', boxShadow: '0 2px 12px rgba(61,50,40,0.08)' }}
        >
          <p className="font-sans text-text leading-relaxed mb-4">
            Bienvenida/o a tu espacio de reflexión personal. Aquí encontrarás herramientas para explorar tus emociones,
            pensamientos y necesidades con mayor claridad y compasión.
          </p>
          <p className="font-sans text-text leading-relaxed">
            Este es un lugar tuyo, privado y seguro. Todo lo que registres se guarda únicamente en tu dispositivo.
          </p>
        </div>

        {/* Disclaimer */}
        <div
          className="rounded-2xl p-5 mb-8 border-l-4 text-left"
          style={{
            background: 'var(--color-primary-container)',
            borderLeftColor: 'var(--color-primary)',
          }}
        >
          <p className="font-sans text-sm text-text-muted leading-relaxed">
            <span className="font-semibold text-text">Aviso importante: </span>
            Esta plataforma ofrece herramientas de gestión básica. Los resultados son una guía de autoconocimiento
            y no sustituyen la evaluación, diagnóstico o tratamiento de un profesional de la salud mental ante
            situaciones complejas, persistentes o traumáticas.
          </p>
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
