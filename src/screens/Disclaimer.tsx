import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'

interface Props {
  onAccept: () => void
}

export function Disclaimer({ onAccept }: Props) {
  const [checked, setChecked] = useState(false)

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-sand-50">
      <div className="w-full max-w-md">
        {/* Logo / Identity */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <svg viewBox="0 0 240 130" fill="none" xmlns="http://www.w3.org/2000/svg" width="220">
              <path d="M 22,95 L 22,43 A 28,28 0 0,1 78,43 L 78,95" stroke="#A0633A" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="12" y1="100" x2="88" y2="100" stroke="#A0633A" strokeWidth="3.5" strokeLinecap="round"/>
              <text x="106" y="82" fontFamily="'Manrope', sans-serif" fontSize="34" fontWeight="300" letterSpacing="10" fill="#111111">KORA</text>
            </svg>
          </div>
          <p className="text-sand-500 text-sm">Herramientas de autogestión psicológica</p>
        </div>

        {/* Disclaimer card */}
        <div className="card mb-6">
          <div className="flex items-start gap-3 mb-4">
            <ShieldCheck size={20} className="text-sage-600 mt-0.5 shrink-0" strokeWidth={1.5} />
            <h2 className="font-serif text-lg text-sand-800 leading-snug">Aviso importante</h2>
          </div>

          <p className="text-sand-700 text-sm leading-relaxed mb-4">
            Esta plataforma ofrece herramientas de gestión básica. Los resultados son una
            <strong className="text-sand-800"> guía de autoconocimiento</strong> y no sustituyen
            la evaluación, diagnóstico o tratamiento de un profesional de la salud mental ante
            situaciones complejas, persistentes o traumáticas.
          </p>

          <div className="bg-sand-50 rounded-2xl p-4 space-y-2 text-sm text-sand-600">
            <p className="flex items-start gap-2">
              <span className="text-sage-500 font-bold mt-0.5">✓</span>
              100% anónimo. Tus datos nunca salen de tu dispositivo.
            </p>
            <p className="flex items-start gap-2">
              <span className="text-sage-500 font-bold mt-0.5">✓</span>
              Sin registro, sin cuenta, sin seguimiento.
            </p>
            <p className="flex items-start gap-2">
              <span className="text-sage-500 font-bold mt-0.5">✓</span>
              Todo se guarda localmente en tu navegador.
            </p>
          </div>
        </div>

        {/* Consent checkbox */}
        <label className="flex items-start gap-3 cursor-pointer mb-6 group">
          <div
            className={`mt-0.5 w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-all duration-200 ${
              checked
                ? 'bg-sand-700 border-sand-700'
                : 'border-sand-300 bg-white group-hover:border-sand-400'
            }`}
            onClick={() => setChecked(!checked)}
          >
            {checked && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="text-sm text-sand-600 leading-relaxed select-none">
            He leído y entiendo que esta herramienta complementa pero no sustituye la atención profesional de salud mental.
          </span>
        </label>

        <button
          onClick={onAccept}
          disabled={!checked}
          className={`w-full btn-primary text-center transition-all duration-200 ${
            !checked ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          Entrar al santuario
        </button>
      </div>
    </div>
  )
}
