export interface SocraticQuestion {
  id: string
  question: string
  distortionId: string
}

export interface CognitiveDistortion {
  id: string
  name: string
  definition: string
}

export const DISTORTIONS: CognitiveDistortion[] = [
  {
    id: 'todo-o-nada',
    name: 'Pensamiento todo-o-nada',
    definition: 'Ver las situaciones en términos absolutos, sin matices ni términos medios. Las cosas son perfectas o un desastre total.',
  },
  {
    id: 'sobregeneralizacion',
    name: 'Sobregeneralización',
    definition: 'Extraer una conclusión general negativa a partir de un único evento aislado, usando palabras como "siempre" o "nunca".',
  },
  {
    id: 'filtracion',
    name: 'Filtración mental',
    definition: 'Centrar toda la atención en un detalle negativo mientras se ignoran los aspectos positivos de la situación.',
  },
  {
    id: 'descalificar-positivo',
    name: 'Descalificar lo positivo',
    definition: 'Rechazar las experiencias positivas insistiendo en que "no cuentan" por algún motivo.',
  },
  {
    id: 'lectura-mente',
    name: 'Lectura de mente',
    definition: 'Creer saber lo que piensan los demás sin evidencia suficiente, generalmente asumiendo que piensan algo negativo.',
  },
  {
    id: 'prediccion',
    name: 'Predicción negativa del futuro',
    definition: 'Anticipar que las cosas saldrán mal y tratarlo como un hecho ya establecido.',
  },
  {
    id: 'magnificacion',
    name: 'Magnificación o minimización',
    definition: 'Exagerar la importancia de los errores propios o minimizar los logros. También llamado "efecto binocular".',
  },
  {
    id: 'razonamiento-emocional',
    name: 'Razonamiento emocional',
    definition: 'Asumir que algo es verdad porque así lo sientes, ignorando la evidencia contraria. "Me siento mal, luego algo malo está pasando".',
  },
  {
    id: 'deberia',
    name: 'Imperativo del "debería"',
    definition: 'Tener expectativas rígidas sobre cómo deberían comportarse tú o los demás, generando culpa o resentimiento cuando no se cumplen.',
  },
  {
    id: 'etiquetado',
    name: 'Etiquetado',
    definition: 'Asignarse a uno mismo u otros una etiqueta negativa global en lugar de describir el comportamiento concreto.',
  },
  {
    id: 'personalizacion',
    name: 'Personalización',
    definition: 'Asumir la responsabilidad de eventos externos negativos que no están bajo tu control total.',
  },
]

export const SOCRATIC_QUESTIONS: SocraticQuestion[] = [
  {
    id: 'q1',
    question: '¿Estás usando palabras absolutas como "siempre", "nunca", "todo" o "nada"?',
    distortionId: 'sobregeneralizacion',
  },
  {
    id: 'q2',
    question: '¿Estás viendo la situación como un éxito total o un fracaso total, sin términos medios?',
    distortionId: 'todo-o-nada',
  },
  {
    id: 'q3',
    question: '¿Estás ignorando o restando importancia a aspectos positivos de la situación?',
    distortionId: 'filtracion',
  },
  {
    id: 'q4',
    question: '¿Estás asumiendo que sabes lo que piensan o sienten los demás sin que te lo hayan dicho?',
    distortionId: 'lectura-mente',
  },
  {
    id: 'q5',
    question: '¿Estás prediciendo que algo malo va a ocurrir como si fuera un hecho seguro?',
    distortionId: 'prediccion',
  },
  {
    id: 'q6',
    question: '¿Estás magnificando el error o el problema más allá de su impacto real?',
    distortionId: 'magnificacion',
  },
  {
    id: 'q7',
    question: '¿Estás tomando como verdad algo únicamente porque lo sientes así?',
    distortionId: 'razonamiento-emocional',
  },
  {
    id: 'q8',
    question: '¿Estás usando la palabra "debería" sobre ti mismo o sobre los demás?',
    distortionId: 'deberia',
  },
  {
    id: 'q9',
    question: '¿Estás etiquetándote con un adjetivo global ("soy un fracaso") en lugar de describir lo ocurrido?',
    distortionId: 'etiquetado',
  },
  {
    id: 'q10',
    question: '¿Estás asumiendo la culpa de algo que no está completamente bajo tu control?',
    distortionId: 'personalizacion',
  },
]
