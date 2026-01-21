export function init() {
  // Datos de las verificaciones
  const verifications = {
    apagadas: {
      title: 'Apagadas',
      description: 'Asegúrate de que todos los interruptores y fuentes de energía estén en posición de apagado.',
    },
    aisladas: {
      title: 'Aisladas',
      description: 'Verifica que el equipo esté completamente aislado de cualquier fuente de energía externa.',
    },
    desconectadas: {
      title: 'Desconectadas',
      description: 'Desconecta físicamente el equipo de todas las fuentes de energía posibles.',
    },
    purgadas: {
      title: 'Purgadas',
      description: 'Libera cualquier energía residual almacenada en el sistema, como presión hidráulica o neumática.',
    },
    encerradas: {
      title: 'Encerradas',
      description: 'Asegura que todas las partes móviles estén completamente detenidas y no puedan moverse.',
    },
    inmovilizadas: {
      title: 'Inmovilizadas',
      description: 'Fija cualquier parte que pueda moverse por gravedad u otras fuerzas.',
    },
    bloqueadas: {
      title: 'Bloqueadas',
      description: 'Aplica dispositivos de bloqueo en todos los puntos de desconexión de energía.',
    },
    obstruidas: {
      title: 'Obstruidas',
      description: 'Coloca barreras físicas para prevenir el acceso a áreas peligrosas o energizadas.',
    },
  };

  // Variable para rastrear el botón activo
  let activeButton = null;

  // Inicializar el slider automático
  const swiperContainer = document.querySelector('.swiper-container');
  const slides = document.querySelectorAll('.swiper-slide');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? 'block' : 'none';
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  // Iniciar el slider
  showSlide(currentSlide);
  slideInterval = setInterval(nextSlide, 2500);

  // Botones de navegación
  const prevButton = document.querySelector('.swiper-button-prev');
  const nextButton = document.querySelector('.swiper-button-next');

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      clearInterval(slideInterval);
      prevSlide();
      slideInterval = setInterval(nextSlide, 2500);
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      clearInterval(slideInterval);
      nextSlide();
      slideInterval = setInterval(nextSlide, 2500);
    });
  }

  // Manejar los botones de verificación
  const verificationButtons = document.querySelectorAll('.verification-btn');
  const descriptionContainer = document.getElementById('verification-description');
  const titleElement = document.getElementById('verification-title');
  const textElement = document.getElementById('verification-text');
  const visited = new Set();
  const validateBtn = document.getElementById('validate-btn');
  const validationMessage = document.getElementById('validation-message');

  verificationButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const verificationType = this.getAttribute('data-verification');
      const verificationData = verifications[verificationType];

      // Si se clickea el mismo botón, cerrar la descripción
      if (activeButton === this) {
        descriptionContainer.style.display = 'none';
        descriptionContainer.classList.remove('show');
        this.classList.remove('active');
        activeButton = null;
        return;
      }

      // Remover active de todos los botones
      verificationButtons.forEach((btn) => btn.classList.remove('active'));

      // Activar el botón clickeado
      this.classList.add('active');
      activeButton = this;

      // Actualizar y mostrar la descripción con animación
      titleElement.textContent = verificationData.title;
      textElement.textContent = verificationData.description;

      descriptionContainer.style.display = 'block';
      // Forzar reflow para que la animación funcione
      void descriptionContainer.offsetWidth;
      descriptionContainer.classList.add('show');

      visited.add(verificationType);
      if (visited.size === Object.keys(verifications).length) {
        // Verificar si ya existe el mensaje para no duplicarlo
        if (!descriptionContainer.querySelector('.completion-message')) {
          const doneMsg = document.createElement('div');
          doneMsg.className = 'mt-3 completion-message';
          doneMsg.textContent = 'Has revisado todos los pasos.';
          descriptionContainer.appendChild(doneMsg);
        }
      }
    });
  });

  if (validateBtn) {
    validateBtn.addEventListener('click', function () {
      const total = Object.keys(verifications).length;
      const count = visited.size;
      if (count < total) {
        if (validationMessage) {
          validationMessage.textContent = `Te faltan ${total - count} paso(s) por revisar.`;
          validationMessage.classList.remove('select-correct');
          validationMessage.classList.add('select-incorrect');
        }
        return;
      }
      if (validationMessage) {
        validationMessage.textContent = 'Has revisado todos los pasos.';
        validationMessage.classList.remove('select-incorrect');
        validationMessage.classList.add('select-correct');
      }
    });
  }
}
