import type { PrimaryEmotion } from '../types'

export const EMOTIONS: PrimaryEmotion[] = [
  {
    name: 'Miedo',
    color: '#8b7355',
    secondary: [
      {
        name: 'Ansiedad',
        tertiary: [
          { name: 'Preocupación', definition: 'Estado cognitivo de anticipación de amenazas futuras que genera pensamiento rumiativo. Se caracteriza por la dificultad para controlar el flujo de pensamientos negativos sobre eventos venideros.' },
          { name: 'Angustia', definition: 'Sensación intensa de malestar emocional acompañada de tensión física y cognitiva. Refleja una percepción de amenaza difusa o un conflicto interno sin resolución clara.' },
          { name: 'Pánico', definition: 'Episodio agudo de terror intenso acompañado de síntomas físicos como taquicardia, sudoración y sensación de pérdida de control. Surge de forma repentina y suele alcanzar su pico en minutos.' },
          { name: 'Fobia', definition: 'Miedo persistente, excesivo e irracional hacia un objeto, situación o actividad específica que lleva a conductas de evitación. La persona reconoce su naturaleza desproporcionada pero no puede suprimirlo.' },
        ],
      },
      {
        name: 'Terror',
        tertiary: [
          { name: 'Horror', definition: 'Reacción emocional extrema ante algo percibido como profundamente perturbador o amenazante. Implica una combinación de miedo intenso y repulsión que paraliza la respuesta habitual.' },
          { name: 'Pavor', definition: 'Miedo intenso y paralizante que surge ante la percepción de un peligro inminente y grave. Genera respuestas de congelamiento o huida automáticas en el sistema nervioso.' },
        ],
      },
      {
        name: 'Inseguridad',
        tertiary: [
          { name: 'Duda', definition: 'Estado de incertidumbre sobre las propias capacidades, decisiones o percepciones. Puede manifestarse como vacilación ante elecciones o como cuestionamiento de la validez del juicio propio.' },
          { name: 'Vergüenza', definition: 'Emoción dolorosa que surge de la percepción de haber fallado ante los propios estándares o los de los demás, afectando la autoimagen global. Tiende a generar deseos de ocultarse o desaparecer.' },
          { name: 'Inferioridad', definition: 'Sentimiento persistente de ser menos valioso, capaz o digno en comparación con los demás. Influye negativamente en la autoestima y puede desencadenar conductas compensatorias o de evitación social.' },
        ],
      },
      {
        name: 'Soledad',
        tertiary: [
          { name: 'Abandono', definition: 'Sensación de haber sido dejado o rechazado por personas significativas, generando un vacío emocional profundo. Puede activar esquemas tempranos de desamparo o inestabilidad en los vínculos.' },
          { name: 'Aislamiento', definition: 'Estado de desconexión social y emocional, ya sea autoimpuesto o percibido. Se asocia con la sensación de ser incomprendido o de no pertenecer a ningún grupo o comunidad.' },
        ],
      },
    ],
  },
  {
    name: 'Ira',
    color: '#9e4a2c',
    secondary: [
      {
        name: 'Frustración',
        tertiary: [
          { name: 'Impaciencia', definition: 'Dificultad para tolerar demoras, obstáculos o el ritmo ajeno sin experimentar malestar o irritabilidad. Refleja una baja tolerancia a la frustración y necesidad de resolución inmediata.' },
          { name: 'Irritabilidad', definition: 'Tendencia a reaccionar con mayor intensidad o negatividad ante estímulos que habitualmente no generarían respuesta. Suele ser señal de tensión acumulada, fatiga o sobrecarga emocional.' },
          { name: 'Decepción', definition: 'Respuesta emocional al incumplimiento de expectativas propias o ajenas. Combina tristeza y descontento cuando la realidad no coincide con lo que se esperaba o deseaba.' },
        ],
      },
      {
        name: 'Enojo',
        tertiary: [
          { name: 'Rabia', definition: 'Emoción de ira intensa que surge ante la percepción de injusticia, amenaza o bloqueo de metas importantes. Genera activación fisiológica alta y puede dificultar el razonamiento equilibrado.' },
          { name: 'Furia', definition: 'Estado de ira extrema que puede desbordar los mecanismos de autorregulación emocional. Implica una activación muy intensa del sistema nervioso y puede derivar en conductas impulsivas.' },
          { name: 'Hostilidad', definition: 'Actitud negativa, de desconfianza y antagonismo hacia los demás, que predispone a la percepción de amenaza en las interacciones. Se diferencia de la rabia por ser más estable y persistente.' },
        ],
      },
      {
        name: 'Disgusto',
        tertiary: [
          { name: 'Desprecio', definition: 'Evaluación negativa intensa de una persona o grupo, percibiendo que carece de valor o merece ser ignorado. En las relaciones, se asocia con deterioro grave del vínculo afectivo.' },
          { name: 'Rencor', definition: 'Ira crónica y persistente hacia alguien que se percibe como responsable de un daño. Implica rumiación sobre la ofensa y dificultad para soltar el agravio aunque el tiempo haya pasado.' },
          { name: 'Resentimiento', definition: 'Sensación de amargura prolongada ante algo percibido como injusto o hiriente. A diferencia del rencor, puede ser más difuso y abarcar situaciones o circunstancias más allá de una persona concreta.' },
        ],
      },
    ],
  },
  {
    name: 'Asco',
    color: '#6b7a3e',
    secondary: [
      {
        name: 'Repulsión',
        tertiary: [
          { name: 'Aversión', definition: 'Respuesta emocional de rechazo intenso hacia un estímulo que se percibe como desagradable, amenazante o moralmente inaceptable. Motiva la evitación del objeto o situación.' },
          { name: 'Rechazo', definition: 'Experiencia de no aceptación activa hacia algo o alguien, ya sea como emisor o receptor. Puede manifestarse como indiferencia fría o como distanciamiento activo y deliberado.' },
          { name: 'Repugnancia', definition: 'Forma intensa de asco que combina malestar físico y moral ante algo considerado impuro, degradante o profundamente ofensivo. Activa respuestas viscerales de alejamiento.' },
        ],
      },
      {
        name: 'Desprecio',
        tertiary: [
          { name: 'Desdén', definition: 'Actitud de indiferencia o menosprecio hacia algo o alguien, considerándolo sin interés o valor. Se expresa frecuentemente a través del lenguaje no verbal y el distanciamiento social.' },
          { name: 'Condescendencia', definition: 'Actitud de superioridad percibida que lleva a tratar a los demás con benevolencia condescendiente, como si fueran inferiores. Puede ser inconsciente y resultar hiriente para quien la recibe.' },
        ],
      },
    ],
  },
  {
    name: 'Tristeza',
    color: '#5a6e8a',
    secondary: [
      {
        name: 'Pena',
        tertiary: [
          { name: 'Lástima', definition: 'Emoción de compasión mezclada con cierta distancia afectiva hacia el sufrimiento ajeno. A diferencia de la empatía, puede implicar una posición de superioridad implícita hacia quien sufre.' },
          { name: 'Pesar', definition: 'Sentimiento de dolor emocional ante una pérdida, error cometido o circunstancia desafortunada. Tiene un componente retrospectivo de lamento por lo que ocurrió o dejó de ocurrir.' },
          { name: 'Melancolía', definition: 'Estado afectivo de tristeza suave pero persistente, frecuentemente sin causa externa clara. Se asocia a una sensación de vacío, nostalgia o pérdida de sentido que puede colorear la percepción de la realidad.' },
        ],
      },
      {
        name: 'Soledad',
        tertiary: [
          { name: 'Añoranza', definition: 'Deseo intenso de recuperar algo o alguien que se ha perdido o que está lejos. Mezcla tristeza con el recuerdo positivo, generando una tensión entre el presente y un pasado valorado.' },
          { name: 'Nostalgia', definition: 'Emoción agridulce que surge al recordar el pasado con una valoración positiva idealizada. Implica un anhelo por tiempos o situaciones irrecuperables combinado con calidez afectiva.' },
        ],
      },
      {
        name: 'Desesperanza',
        tertiary: [
          { name: 'Impotencia', definition: 'Sensación de carecer de recursos o capacidad para cambiar una situación difícil. Se asocia con indefensión aprendida y puede paralizar la motivación para la acción.' },
          { name: 'Resignación', definition: 'Aceptación pasiva de circunstancias negativas percibidas como inevitables o inmutables. Puede ser adaptativa en situaciones genuinamente incontrolables, pero problemática cuando bloquea la acción posible.' },
          { name: 'Desesperación', definition: 'Estado emocional de pérdida total de esperanza ante la posibilidad de mejoría o solución. Implica sufrimiento intenso y puede ser un marcador de estados depresivos severos que requieren atención profesional.' },
        ],
      },
    ],
  },
  {
    name: 'Calma',
    color: '#6b8c6e',
    secondary: [
      {
        name: 'Serenidad',
        tertiary: [
          { name: 'Paz', definition: 'Estado interno de ausencia de conflicto, tensión o perturbación emocional. Refleja armonía con el entorno y consigo mismo, frecuentemente asociado a la aceptación del momento presente.' },
          { name: 'Tranquilidad', definition: 'Estado de quietud emocional y mental en el que los estímulos externos no generan activación significativa. Permite la reflexión clara y el procesamiento pausado de la experiencia.' },
          { name: 'Ecuanimidad', definition: 'Capacidad de mantener el equilibrio emocional ante circunstancias adversas o cambiantes. Implica una actitud estable que no se ve fácilmente sacudida por los altibajos de la vida.' },
        ],
      },
      {
        name: 'Satisfacción',
        tertiary: [
          { name: 'Plenitud', definition: 'Sensación de completitud y bienestar profundo que surge cuando las necesidades fundamentales están cubiertas y la vida tiene sentido. Va más allá del placer momentáneo.' },
          { name: 'Contentamiento', definition: 'Estado de satisfacción moderada y estable con las circunstancias actuales. Refleja una apreciación serena de lo que se tiene, sin necesidad de buscar más.' },
        ],
      },
      {
        name: 'Seguridad',
        tertiary: [
          { name: 'Confianza', definition: 'Creencia firme en las propias capacidades o en la fiabilidad de los demás y del entorno. Permite actuar con menor inhibición y afrontar desafíos con mayor apertura.' },
          { name: 'Estabilidad', definition: 'Sensación de firmeza y consistencia en el estado emocional y en las circunstancias vitales. Proporciona una base segura desde la que explorar y afrontar la vida cotidiana.' },
        ],
      },
    ],
  },
  {
    name: 'Alegría',
    color: '#c4956a',
    secondary: [
      {
        name: 'Felicidad',
        tertiary: [
          { name: 'Euforia', definition: 'Estado de alegría intensa y exaltación anímica que puede llegar a ser desbordante. Se caracteriza por alta energía, pensamiento acelerado y sensación de omnipotencia o bienestar extremo.' },
          { name: 'Entusiasmo', definition: 'Energía emocional positiva dirigida hacia una meta, persona o actividad que se valora especialmente. Motiva la acción y genera implicación activa y apasionada.' },
          { name: 'Optimismo', definition: 'Tendencia cognitiva y emocional a esperar y valorar los resultados positivos de las situaciones. Se asocia con mayor resiliencia, bienestar psicológico y persistencia ante los obstáculos.' },
        ],
      },
      {
        name: 'Amor',
        tertiary: [
          { name: 'Ternura', definition: 'Emoción cálida y suave que surge en relación con algo o alguien percibido como delicado o vulnerable. Activa comportamientos de cuidado, protección y proximidad afectiva.' },
          { name: 'Gratitud', definition: 'Reconocimiento emocional del valor de lo recibido de los demás o de la vida. Se asocia con bienestar subjetivo elevado, fortalecimiento de vínculos y actitud prosocial.' },
          { name: 'Afecto', definition: 'Vínculo emocional positivo y cálido hacia personas, lugares o experiencias significativas. Constituye la base de las relaciones cercanas y el sentido de pertenencia.' },
        ],
      },
      {
        name: 'Orgullo',
        tertiary: [
          { name: 'Logro', definition: 'Satisfacción emocional derivada de haber alcanzado una meta significativa mediante esfuerzo propio. Refuerza la autoeficacia y motiva la búsqueda de nuevos desafíos.' },
          { name: 'Autoconfianza', definition: 'Creencia positiva en las propias capacidades y juicio, basada en la experiencia y el autoconocimiento. Permite actuar con decisión y recuperarse con mayor facilidad de los fracasos.' },
        ],
      },
    ],
  },
  {
    name: 'Sorpresa',
    color: '#8a6b8c',
    secondary: [
      {
        name: 'Asombro',
        tertiary: [
          { name: 'Admiración', definition: 'Respuesta emocional positiva ante algo que se percibe como extraordinario, valioso o superior a lo esperado. Genera disposición a aprender, imitar o acercarse a la fuente de admiración.' },
          { name: 'Perplejidad', definition: 'Estado de confusión y asombro simultáneos ante algo difícil de comprender o integrar en los esquemas existentes. Puede generar inmovilidad temporal mientras se procesa la información.' },
          { name: 'Maravilla', definition: 'Emoción de asombro profundo y reverente ante algo percibido como grandioso, misterioso o de belleza excepcional. Puede tener efectos expansivos sobre la perspectiva personal.' },
        ],
      },
      {
        name: 'Confusión',
        tertiary: [
          { name: 'Desconcierto', definition: 'Estado emocional y cognitivo de desorientación ante una situación ambigua o inesperada. Genera la necesidad de buscar información adicional para restablecer la coherencia interna.' },
          { name: 'Incertidumbre', definition: 'Sensación de falta de claridad o previsibilidad sobre el curso de los eventos. Puede activar ansiedad anticipatoria o, en personas con alta tolerancia a la ambigüedad, curiosidad y apertura.' },
        ],
      },
    ],
  },
]
