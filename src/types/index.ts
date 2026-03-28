// Parcelas de la Vida
export interface Parcela {
  id: string
  label: string
  active: boolean
}

export interface ParcelasData {
  parcelas: Parcela[]
  actual: Record<string, number>
  ideal: Record<string, number>
  reflexion1: string
  reflexion2: string
  reflexion3: string
  updatedAt: string
}

// Laboratorio de Pensamientos
export interface PensamientoEntry {
  id: string
  pensamiento: string
  answers: Record<string, boolean | null>
  distortions: string[]
  reframe: string
  createdAt: string
}

// Rastreo de Necesidades
export interface NecesidadEntry {
  id: string
  date: string // YYYY-MM-DD
  necesidad: string
  mantuvo: boolean
  prioridad: 'Alta' | 'Media' | 'Baja'
  satisfecha: boolean
  detalle: string
}

// Brújula de Valores
export interface ValorEntry {
  id: string
  label: string
  score: number
}

export interface ValoresData {
  valores: ValorEntry[]
  reflexion: string
  updatedAt: string
}

// Voces Internas
export interface VozEntry {
  id: string
  voz: string
  origen: {
    primeraVez: string
    hayPersona: boolean | null
    quien: string
    protege: string
  }
  tipo: 'externa' | 'interna' | 'mixta'
  redialogo: string
  createdAt: string
}

// Emotions
export interface TertiaryEmotion {
  name: string
  definition: string
}

export interface SecondaryEmotion {
  name: string
  tertiary: TertiaryEmotion[]
}

export interface PrimaryEmotion {
  name: string
  color: string
  secondary: SecondaryEmotion[]
}
