/**
 * Sistema de Quiz/Evaluación Reutilizable
 * Gestiona modales de evaluación que bloquean la navegación hasta completarse
 */

// Agregar estilos CSS para el modal de evaluación requerida
const evaluationModalStyles = `
<style>
.evaluation-required-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease-out;
}

.evaluation-required-modal {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;
}

.evaluation-required-modal .modal-icon {
  font-size: 3rem;
  color: #f39c12;
  margin-bottom: 1rem;
}

.evaluation-required-modal h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-weight: 600;
}

.evaluation-required-modal p {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.evaluation-required-modal .modal-buttons {
  display: flex;
  justify-content: center;
}

.evaluation-required-modal .btn {
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.evaluation-required-modal .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

body.evaluation-modal-active {
  overflow: hidden;
}
</style>
`;

// Inyectar estilos
if (!document.querySelector('#evaluation-modal-styles')) {
  const styleElement = document.createElement('div');
  styleElement.id = 'evaluation-modal-styles';
  styleElement.innerHTML = evaluationModalStyles;
  document.head.appendChild(styleElement);
}

class QuizManager {
  constructor() {
    this.currentQuiz = null;
    this.isQuizCompleted = false;
    this.originalNextSlide = null;
  }

  /**
   * Inicializa un quiz para un slider específico
   * @param {Object} config - Configuración del quiz
   */
  initQuiz(config) {
    const {
      sliderId,
      questions,
      title = 'Evaluación',
      buttonText = 'Abrir evaluación',
      completionMessage = '¡Evaluación completada correctamente!'
    } = config;

    // Lista de sliders donde NO se deben mostrar evaluaciones (secciones 1, 2 y 3)
    const disabledSections = [
      'slider3', 'slider15', 'slider16', 'slider18', 'slider19', 'slider24', // Sliders con evaluaciones
      'section1', 'section2', 'section3', // Por si usan estos IDs
      'momento1', 'momento2', 'momento3'  // Por si usan estos IDs
    ];

    // Si el sliderId está en la lista de secciones deshabilitadas, no hacer nada
    if (disabledSections.includes(sliderId)) {
      console.log(`Evaluación deshabilitada para ${sliderId}`);
      return;
    }

    // Verificar si ya se completó este quiz
    const quizKey = `quiz_completed_${sliderId}`;
    if (localStorage.getItem(quizKey) === 'true') {
      return; // Quiz ya completado, no hacer nada
    }

    // Bloquear navegación hacia adelante
    this.blockNextNavigation();

    // Crear botón de evaluación
    this.createQuizButton(sliderId, buttonText, () => {
      this.openQuizModal({
        sliderId,
        questions,
        title,
        completionMessage,
        onComplete: () => {
          localStorage.setItem(quizKey, 'true');
          this.unblockNextNavigation();
        }
      });
    });
  }

  /**
   * Crea el botón para abrir la evaluación
   */
  createQuizButton(sliderId, buttonText, onClick) {
    const container = document.querySelector('.sf-mx-p10-p10');
    if (!container) return;

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'mt-4 d-flex justify-content-center';
    buttonContainer.innerHTML = `
      <button id="quiz-btn-${sliderId}" class="btn btn-lg sf-btn-secondary px-5 py-3">
        <i class="fas fa-clipboard-check me-2"></i>
        ${buttonText}
      </button>
    `;

    container.appendChild(buttonContainer);

    const button = document.getElementById(`quiz-btn-${sliderId}`);
    button.addEventListener('click', onClick);
  }

  /**
   * Abre el modal del quiz
   */
  openQuizModal(config) {
    const { sliderId, questions, title, completionMessage, onComplete } = config;

    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'quiz-modal-overlay';
    modal.innerHTML = `
      <div class="quiz-modal">
        <div class="quiz-header">
          <h2>${title}</h2>
        </div>
        <div class="quiz-body">
          <div id="quiz-content-${sliderId}"></div>
          <div class="quiz-navigation">
            <button id="quiz-prev-${sliderId}" class="btn btn-outline-secondary" disabled>
              <i class="fas fa-arrow-left me-2"></i>Anterior
            </button>
            <button id="quiz-next-${sliderId}" class="btn sf-btn-primary">
              Siguiente<i class="fas fa-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.classList.add('quiz-modal-active');

    // Inicializar quiz
    this.currentQuiz = new Quiz(sliderId, questions, completionMessage, onComplete);
    this.currentQuiz.render();

    // Ocultar navegación principal
    const navContainer = document.querySelector('.btn-navigation-container');
    if (navContainer) {
      navContainer.style.display = 'none';
    }
  }

  /**
   * Cierra el modal del quiz
   */
  closeQuizModal() {
    const modal = document.querySelector('.quiz-modal-overlay');
    if (modal) {
      modal.remove();
      document.body.classList.remove('quiz-modal-active');
    }

    // Mostrar navegación principal
    const navContainer = document.querySelector('.btn-navigation-container');
    if (navContainer) {
      navContainer.style.display = 'flex';
    }
  }

  /**
   * Bloquea la navegación hacia adelante
   */
  blockNextNavigation() {
    // No bloquear navegación para secciones 1, 2 y 3
    const currentSlider = this.getCurrentSliderInfo();
    const disabledSections = ['slider3', 'slider15', 'slider16', 'slider18', 'slider19', 'slider24', 'section1', 'section2', 'section3', 'momento1', 'momento2', 'momento3'];
    
    if (disabledSections.some(section => currentSlider.includes(section))) {
      console.log(`Navegación NO bloqueada para ${currentSlider}`);
      return;
    }

    if (!this.originalNextSlide) {
      this.originalNextSlide = window.nextSlide;
    }

    window.nextSlide = () => {
      this.showEvaluationRequiredModal();
    };
  }

  /**
   * Obtiene información del slider actual
   */
  getCurrentSliderInfo() {
    // Intentar obtener información del slider actual desde diferentes fuentes
    const currentIndex = window.currentIndex || 0;
    const sliders = window.sliders || [];
    
    if (sliders[currentIndex]) {
      return sliders[currentIndex].router || `slider${currentIndex + 1}`;
    }
    
    return `slider${currentIndex + 1}`;
  }

  /**
   * Muestra modal interactivo cuando se requiere completar evaluación
   */
  showEvaluationRequiredModal() {
    const modal = document.createElement('div');
    modal.className = 'evaluation-required-modal-overlay';
    modal.innerHTML = `
      <div class="evaluation-required-modal">
        <div class="modal-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3>Evaluación Requerida</h3>
        <p>Debes completar la evaluación antes de continuar con el siguiente contenido.</p>
        <div class="modal-buttons">
          <button id="close-eval-modal" class="btn sf-btn-primary">
            <i class="fas fa-check me-2"></i>Entendido
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.classList.add('evaluation-modal-active');

    // Cerrar modal
    const closeBtn = document.getElementById('close-eval-modal');
    closeBtn.addEventListener('click', () => {
      modal.remove();
      document.body.classList.remove('evaluation-modal-active');
    });

    // Cerrar al hacer click fuera del modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
        document.body.classList.remove('evaluation-modal-active');
      }
    });

    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
      if (document.body.contains(modal)) {
        modal.remove();
        document.body.classList.remove('evaluation-modal-active');
      }
    }, 5000);
  }

  /**
   * Desbloquea la navegación hacia adelante
   */
  unblockNextNavigation() {
    if (this.originalNextSlide) {
      window.nextSlide = this.originalNextSlide;
    }
  }
}

class Quiz {
  constructor(sliderId, questions, completionMessage, onComplete) {
    this.sliderId = sliderId;
    this.questions = questions;
    this.completionMessage = completionMessage;
    this.onComplete = onComplete;
    this.currentQuestion = 0;
    this.answers = {};
    this.isCompleted = false;
  }

  render() {
    const container = document.getElementById(`quiz-content-${this.sliderId}`);
    const prevBtn = document.getElementById(`quiz-prev-${this.sliderId}`);
    const nextBtn = document.getElementById(`quiz-next-${this.sliderId}`);

    if (this.currentQuestion < this.questions.length) {
      this.renderQuestion(container);
      this.updateNavigationButtons(prevBtn, nextBtn);
    } else {
      this.renderCompletion(container);
    }
  }

  renderQuestion(container) {
    const question = this.questions[this.currentQuestion];
    const questionNumber = this.currentQuestion + 1;
    const totalQuestions = this.questions.length;

    container.innerHTML = `
      <div class="quiz-question">
        <div class="quiz-progress">
          <div class="progress mb-4">
            <div class="progress-bar sf-bg-primary" style="width: ${(questionNumber / totalQuestions) * 100}%"></div>
          </div>
          <p class="text-muted mb-3">Pregunta ${questionNumber} de ${totalQuestions}</p>
        </div>
        
        <h3 class="question-title mb-4">${question.question}</h3>
        
        <div class="quiz-options">
          ${question.options.map((option, index) => `
            <div class="quiz-option">
              <input type="radio" 
                     id="option-${this.currentQuestion}-${index}" 
                     name="question-${this.currentQuestion}" 
                     value="${index}"
                     ${this.answers[this.currentQuestion] == index ? 'checked' : ''}>
              <label for="option-${this.currentQuestion}-${index}" class="quiz-option-label">
                ${option}
              </label>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Agregar event listeners para las opciones
    const options = container.querySelectorAll('input[type="radio"]');
    options.forEach(option => {
      option.addEventListener('change', (e) => {
        this.answers[this.currentQuestion] = parseInt(e.target.value);
        this.updateNavigationButtons();
      });
    });
  }

  renderCompletion(container) {
    container.innerHTML = `
      <div class="quiz-completion text-center">
        <div class="completion-icon mb-4">
          <i class="fas fa-check-circle text-success" style="font-size: 4rem;"></i>
        </div>
        <h3 class="mb-3">${this.completionMessage}</h3>
        <p class="text-muted mb-4">Has completado todas las preguntas correctamente.</p>
        <button id="quiz-finish-${this.sliderId}" class="btn sf-btn-primary btn-lg px-5">
          <i class="fas fa-check me-2"></i>Finalizar
        </button>
      </div>
    `;

    const finishBtn = document.getElementById(`quiz-finish-${this.sliderId}`);
    finishBtn.addEventListener('click', () => {
      this.complete();
    });
  }

  updateNavigationButtons() {
    const prevBtn = document.getElementById(`quiz-prev-${this.sliderId}`);
    const nextBtn = document.getElementById(`quiz-next-${this.sliderId}`);

    if (!prevBtn || !nextBtn) return;

    // Botón anterior
    prevBtn.disabled = this.currentQuestion === 0;
    prevBtn.onclick = () => {
      if (this.currentQuestion > 0) {
        this.currentQuestion--;
        this.render();
      }
    };

    // Botón siguiente
    const hasAnswer = this.answers.hasOwnProperty(this.currentQuestion);
    nextBtn.disabled = !hasAnswer;
    nextBtn.onclick = () => {
      if (hasAnswer) {
        this.currentQuestion++;
        this.render();
      }
    };

    // Ocultar navegación en la pantalla de finalización
    if (this.currentQuestion >= this.questions.length) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    }
  }

  complete() {
    this.isCompleted = true;
    this.onComplete();
    window.quizManager.closeQuizModal();
  }
}

// Crear instancia global
window.quizManager = new QuizManager();

// Función de conveniencia para inicializar quiz desde HTML
window.initQuiz = (config) => {
  window.quizManager.initQuiz(config);
};

// Función para deshabilitar completamente las evaluaciones de secciones específicas
window.disableEvaluationsForSections = () => {
  const disabledSections = ['slider3', 'slider15', 'slider16', 'slider18', 'slider19', 'slider24', 'section1', 'section2', 'section3', 'momento1', 'momento2', 'momento3'];
  
  // Marcar como completadas en localStorage para evitar que aparezcan
  disabledSections.forEach(sectionId => {
    localStorage.setItem(`quiz_completed_${sectionId}`, 'true');
  });
  
  console.log('Evaluaciones deshabilitadas para secciones 1, 2 y 3');
};

// Auto-ejecutar la deshabilitación al cargar el script
window.disableEvaluationsForSections();