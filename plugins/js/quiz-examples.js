/**
 * EJEMPLOS DE CONFIGURACIÓN PARA EL SISTEMA DE QUIZ
 * 
 * Este archivo contiene ejemplos de diferentes configuraciones
 * que puedes usar como referencia para implementar quiz en tus sliders.
 * 
 * NO incluyas este archivo en tu HTML principal, es solo para referencia.
 */

// ============================================================================
// EJEMPLO 1: Quiz Básico (Mínima configuración)
// ============================================================================
const quizBasico = {
  sliderId: 'slider_ejemplo_1',
  questions: [
    {
      question: '¿Cuál es la definición correcta de factor de riesgo psicosocial?',
      options: [
        'Elementos físicos del ambiente de trabajo',
        'Condiciones organizacionales que pueden afectar la salud mental',
        'Herramientas de trabajo defectuosas',
        'Políticas de recursos humanos'
      ]
    }
  ]
};

// ============================================================================
// EJEMPLO 2: Quiz Completo (Todas las opciones personalizadas)
// ============================================================================
const quizCompleto = {
  sliderId: 'slider_ejemplo_2',
  title: 'Evaluación Integral: Riesgos Psicosociales',
  buttonText: 'Comenzar Evaluación Integral',
  completionMessage: '¡Excelente trabajo! Has demostrado un sólido entendimiento de los riesgos psicosociales.',
  questions: [
    {
      question: '¿Cuáles son los principales factores de riesgo psicosocial en el ambiente laboral?',
      options: [
        'Solo la carga de trabajo excesiva',
        'Carga de trabajo, falta de control, relaciones interpersonales y ambiente organizacional',
        'Únicamente los problemas de comunicación',
        'Solo los horarios de trabajo'
      ]
    },
    {
      question: '¿Qué efectos pueden tener los factores de riesgo psicosocial no controlados?',
      options: [
        'No tienen efectos significativos',
        'Solo afectan la productividad',
        'Pueden causar estrés, burnout, ansiedad y problemas de salud física',
        'Solo generan ausentismo laboral'
      ]
    },
    {
      question: '¿Cuál es la mejor estrategia para prevenir riesgos psicosociales?',
      options: [
        'Ignorar los síntomas hasta que se vuelvan graves',
        'Implementar un enfoque integral de identificación, evaluación y control',
        'Solo proporcionar capacitación ocasional',
        'Delegar toda la responsabilidad a los trabajadores'
      ]
    }
  ]
};

// ============================================================================
// EJEMPLO 3: Quiz de Evaluación de Conocimientos Específicos
// ============================================================================
const quizConocimientosEspecificos = {
  sliderId: 'slider_ejemplo_3',
  title: 'Verificación de Conocimientos: NOM-035',
  buttonText: 'Verificar Conocimientos',
  completionMessage: '¡Perfecto! Tienes un buen dominio de la NOM-035.',
  questions: [
    {
      question: '¿Qué establece la NOM-035-STPS-2018?',
      options: [
        'Normas de seguridad física en el trabajo',
        'Factores de riesgo psicosocial en el trabajo - Identificación, análisis y prevención',
        'Procedimientos de contratación de personal',
        'Normas de higiene en el lugar de trabajo'
      ]
    },
    {
      question: '¿A qué tipo de centros de trabajo aplica la NOM-035?',
      options: [
        'Solo a empresas grandes con más de 1000 empleados',
        'Únicamente a empresas del sector industrial',
        'A todos los centros de trabajo, con diferentes obligaciones según su tamaño',
        'Solo a empresas del sector servicios'
      ]
    }
  ]
};

// ============================================================================
// EJEMPLO 4: Quiz de Casos Prácticos
// ============================================================================
const quizCasosPracticos = {
  sliderId: 'slider_ejemplo_4',
  title: 'Análisis de Casos: Situaciones Reales',
  buttonText: 'Analizar Casos Prácticos',
  completionMessage: '¡Excelente análisis! Sabes cómo aplicar los conceptos en situaciones reales.',
  questions: [
    {
      question: 'María trabaja 12 horas diarias, tiene múltiples tareas urgentes y su jefe le grita constantemente. ¿Qué factores de riesgo psicosocial están presentes?',
      options: [
        'Solo carga de trabajo excesiva',
        'Carga de trabajo excesiva y liderazgo negativo',
        'Solo problemas de comunicación',
        'No hay factores de riesgo evidentes'
      ]
    },
    {
      question: 'En una empresa, los empleados reportan sentirse desmotivados, hay alta rotación y frecuentes conflictos. ¿Cuál sería la primera acción recomendada?',
      options: [
        'Despedir a los empleados problemáticos',
        'Realizar una evaluación integral de factores de riesgo psicosocial',
        'Aumentar los salarios inmediatamente',
        'Ignorar la situación hasta que mejore'
      ]
    }
  ]
};

// ============================================================================
// EJEMPLO 5: Quiz de Responsabilidades
// ============================================================================
const quizResponsabilidades = {
  sliderId: 'slider_ejemplo_5',
  title: 'Evaluación: Roles y Responsabilidades',
  buttonText: 'Evaluar Responsabilidades',
  completionMessage: '¡Muy bien! Comprendes claramente las responsabilidades de cada actor.',
  questions: [
    {
      question: '¿Cuál es la principal responsabilidad del empleador según la NOM-035?',
      options: [
        'Solo cumplir con los requisitos mínimos legales',
        'Establecer por escrito, implantar, mantener y difundir una política de prevención de riesgos psicosociales',
        'Delegar toda la responsabilidad al área de recursos humanos',
        'Únicamente capacitar a los supervisores'
      ]
    },
    {
      question: '¿Qué deben hacer los trabajadores para contribuir a la prevención?',
      options: [
        'No tienen ninguna responsabilidad',
        'Solo reportar problemas graves',
        'Observar las medidas de prevención, participar en la identificación de factores de riesgo y someterse a evaluaciones',
        'Esperar instrucciones específicas para cada situación'
      ]
    }
  ]
};

// ============================================================================
// EJEMPLO 6: Quiz de Protocolos y Procedimientos
// ============================================================================
const quizProtocolos = {
  sliderId: 'slider_ejemplo_6',
  title: 'Evaluación: Protocolos de Atención',
  buttonText: 'Revisar Protocolos',
  completionMessage: '¡Excelente! Dominas los protocolos de atención y seguimiento.',
  questions: [
    {
      question: '¿Qué debe incluir un protocolo de atención para casos de violencia laboral?',
      options: [
        'Solo procedimientos disciplinarios',
        'Procedimientos de recepción de quejas, investigación, resolución y seguimiento',
        'Únicamente medidas correctivas',
        'Solo recomendaciones generales'
      ]
    },
    {
      question: '¿Con qué frecuencia se debe revisar y actualizar el protocolo de atención?',
      options: [
        'Una vez al año como mínimo',
        'Solo cuando ocurra un incidente grave',
        'Cada cinco años',
        'No es necesario actualizarlo'
      ]
    },
    {
      question: '¿Qué características debe tener el personal encargado de aplicar el protocolo?',
      options: [
        'Solo experiencia administrativa',
        'Capacitación específica en factores de riesgo psicosocial y manejo de conflictos',
        'Únicamente conocimientos legales',
        'No requiere capacitación especial'
      ]
    }
  ]
};

// ============================================================================
// PLANTILLA VACÍA PARA COPIAR Y PERSONALIZAR
// ============================================================================
const plantillaQuiz = {
  sliderId: 'tu_slider_id', // Cambia por el ID de tu slider
  title: 'Título de tu evaluación',
  buttonText: 'Texto del botón',
  completionMessage: 'Mensaje de felicitación al completar',
  questions: [
    {
      question: 'Tu pregunta aquí',
      options: [
        'Opción A',
        'Opción B',
        'Opción C',
        'Opción D'
      ]
    }
    // Agrega más preguntas copiando la estructura anterior
  ]
};

// ============================================================================
// INSTRUCCIONES DE USO
// ============================================================================

/*
CÓMO USAR ESTOS EJEMPLOS:

1. Copia el ejemplo que más se adapte a tus necesidades
2. Modifica el 'sliderId' para que coincida con tu slider
3. Personaliza el título, botón y mensaje de completación
4. Cambia las preguntas y opciones por tu contenido
5. Pega el código al final del archivo index.html de tu slider
6. Agrega la llamada a initQuiz:

if (typeof window.initQuiz === 'function') {
  window.initQuiz(tuConfiguracion);
}

CONSEJOS:
- Usa entre 2-5 preguntas por quiz para mantener la atención
- Haz preguntas específicas y claras
- Asegúrate de que las opciones sean distintivas
- Usa mensajes motivadores en completionMessage
- Siempre prueba en diferentes dispositivos
*/