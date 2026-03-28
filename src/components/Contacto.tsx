import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PageHeader from './ui/PageHeader'

// ─── Configura aquí el endpoint de Formspree ──────────────────────────────────
// 1. Crea una cuenta en https://formspree.io
// 2. Crea un nuevo formulario con el email de Andrea
// 3. Sustituye el valor de abajo por tu Form ID (ej: "xpwzgkqr")
const FORMSPREE_ID = 'TU_FORMSPREE_ID'
// ─────────────────────────────────────────────────────────────────────────────

const MODULOS: Record<string, string> = {
  emociones: 'Rueda de Emociones',
  pensamientos: 'Laboratorio de Pensamientos',
  necesidades: 'Rastreo de Necesidades',
  parcelas: 'Parcelas de la Vida',
  voces: 'Voces Internas',
  identidad: '¿Qué te define?',
  control: 'Círculo de Control',
}

type Estado = 'form' | 'enviando' | 'enviado' | 'error'

export default function Contacto() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const moduloKey = searchParams.get('desde') ?? ''
  const moduloNombre = MODULOS[moduloKey] ?? ''

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [consentimiento, setConsentimiento] = useState(false)
  const [estado, setEstado] = useState<Estado>('form')

  const cardStyle = {
    background: 'var(--color-surface)',
    boxShadow: '0 2px 12px rgba(61,50,40,0.08)',
  }

  const inputStyle = {
    background: 'var(--color-bg)',
    color: 'var(--color-text)',
    border: '1.5px solid var(--color-border)',
  }

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--color-primary)'
  }
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--color-border)'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consentimiento || !email.trim() || !mensaje.trim()) return

    setEstado('enviando')

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          nombre,
          email,
          modulo: moduloNombre || 'Sin módulo específico',
          mensaje,
          _subject: `Consulta KORA${moduloNombre ? ` — ${moduloNombre}` : ''}`,
        }),
      })

      if (res.ok) {
        setEstado('enviado')
      } else {
        setEstado('error')
      }
    } catch {
      setEstado('error')
    }
  }

  const canSubmit = consentimiento && email.trim() && mensaje.trim() && estado !== 'enviando'

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto px-6 pt-8">
        <PageHeader
          title="Habla con un profesional"
          subtitle="Tu consulta llegará directamente a Andrea"
        />

        {estado === 'enviado' ? (
          <div className="text-center">
            <div className="rounded-2xl p-8 mb-5" style={cardStyle}>
              <div className="text-4xl mb-4">✉️</div>
              <h2 className="font-serif text-xl font-semibold text-text mb-3">
                Mensaje enviado
              </h2>
              <p className="font-sans text-sm text-text-muted leading-relaxed">
                Andrea recibirá tu consulta y se pondrá en contacto contigo.
                Gracias por dar este paso.
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              Volver al inicio
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Contexto del módulo */}
            {moduloNombre && (
              <div
                className="rounded-2xl p-4 mb-5"
                style={{ background: 'var(--color-primary-container)' }}
              >
                <p className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                  Módulo de origen
                </p>
                <p className="font-sans text-sm text-text">{moduloNombre}</p>
              </div>
            )}

            <div className="rounded-2xl p-5 mb-5" style={cardStyle}>
              {/* Nombre */}
              <div className="mb-4">
                <label className="block font-sans text-sm font-semibold text-text mb-2">
                  Nombre <span className="text-text-muted font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="¿Cómo te llamas?"
                  className="w-full px-4 py-2.5 rounded-xl font-sans text-sm outline-none"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block font-sans text-sm font-semibold text-text mb-2">
                  Correo electrónico <span className="text-[#9e4a2c]">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl font-sans text-sm outline-none"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Mensaje */}
              <div>
                <label className="block font-sans text-sm font-semibold text-text mb-2">
                  ¿Qué te gustaría consultar o profundizar? <span className="text-[#9e4a2c]">*</span>
                </label>
                <textarea
                  value={mensaje}
                  onChange={e => setMensaje(e.target.value)}
                  rows={5}
                  required
                  placeholder="Cuéntale a Andrea lo que has sentido, lo que te ha surgido o lo que te gustaría explorar con más profundidad..."
                  className="w-full px-4 py-3 rounded-xl font-sans text-sm resize-none outline-none"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* Consentimiento GDPR */}
            <div className="rounded-2xl p-5 mb-5" style={cardStyle}>
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  className="mt-0.5 w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-all duration-200"
                  style={{
                    background: consentimiento ? 'var(--color-primary)' : 'var(--color-bg)',
                    borderColor: consentimiento ? 'var(--color-primary)' : 'var(--color-border)',
                  }}
                  onClick={() => setConsentimiento(v => !v)}
                >
                  {consentimiento && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="font-sans text-sm text-text-muted leading-relaxed select-none">
                  Acepto que mi correo electrónico sea utilizado exclusivamente para responder a esta consulta.
                  Los datos no serán compartidos con terceros ni utilizados para otros fines.{' '}
                  <span className="text-[#9e4a2c]">*</span>
                </span>
              </label>
            </div>

            {estado === 'error' && (
              <div
                className="rounded-2xl p-4 mb-4"
                style={{ background: '#9e4a2c18', border: '1.5px solid #9e4a2c44' }}
              >
                <p className="font-sans text-sm text-[#9e4a2c]">
                  Hubo un problema al enviar el mensaje. Por favor, inténtalo de nuevo.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full py-4 rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              {estado === 'enviando' ? 'Enviando...' : 'Enviar consulta'}
            </button>

            <p className="mt-3 text-center font-sans text-xs text-text-muted">
              Solo se usará tu correo para responderte. Nada más.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
