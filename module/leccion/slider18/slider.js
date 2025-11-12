export function init() {
	const cards = Array.from(document.querySelectorAll('.case-card'));
  const selects = Array.from(document.querySelectorAll('.case-card select'));
  const validateBtn = document.getElementById('validateBtn');
  const resetBtn = document.getElementById('resetBtn');
  const successMessage = document.getElementById('successMessage');
  const errorMessage = document.getElementById('errorMessage');

  if (!cards.length || selects.length !== 3 || !validateBtn || !resetBtn || !successMessage || !errorMessage) {
    return;
  }

  // Mapeo correcto: índice de card -> valor correcto del select
  const correctMap = ['juan', 'ana', 'danilo'];

  // Inicializa estados
  function resetActivity() {
    // Reiniciar selects
    selects.forEach((sel) => {
      // Seleccionar placeholder (primer option)
      sel.selectedIndex = 0;
      sel.classList.remove('is-valid', 'is-invalid');
    });

    // Habilitar todas las opciones en todos los selects
    updateOptionsAvailability();

    // Ocultar feedback
    successMessage.classList.add('d-none');
    errorMessage.classList.add('d-none');

    // Botones inactivos hasta tener 3 selecciones
    validateBtn.disabled = true;
    resetBtn.disabled = true;

    // Limpiar estados visuales y mensajes por tarjeta
    cards.forEach((card) => {
      card.classList.remove('correct', 'incorrect', 'border-success', 'border-danger');
      const msg = card.querySelector('.validation-msg');
      if (msg) msg.remove();
    });
  }

  function getSelectedValues() {
    return selects.map((s) => s.value).filter((v) => v && v !== 'Seleccione...');
  }

  // Deshabilita en cada select las opciones ya escogidas en otros selects (no repetir)
  function updateOptionsAvailability() {
    const chosen = new Set(getSelectedValues());

    selects.forEach((sel) => {
      const options = Array.from(sel.querySelectorAll('option'));

      options.forEach((opt, idx) => {
        // Mantener visible el placeholder (primer option), dejarlo deshabilitado
        if (idx === 0) {
          opt.hidden = false;
          opt.disabled = true;
          return;
        }

        const val = opt.value;
        const isSelectedHere = sel.value === val;
        const shouldHide = !isSelectedHere && chosen.has(val);
        opt.hidden = shouldHide;
        opt.disabled = shouldHide;
      });
    });
  }

  function updateButtonsState() {
    const complete = getSelectedValues().length === selects.length;
    validateBtn.disabled = !complete;
    // Permite reiniciar si hay al menos un valor elegido
    resetBtn.disabled = getSelectedValues().length === 0;
  }

  // Eventos de cambio en selects
  selects.forEach((sel, idx) => {
    sel.addEventListener('change', () => {
      // Oculta error cuando el usuario ajusta selecciones
      errorMessage.classList.add('d-none');
      successMessage.classList.add('d-none');

      // Actualiza disponibilidad de opciones y botones
      updateOptionsAvailability();
      updateButtonsState();

      // Limpiar estilos previos
      sel.classList.remove('is-valid', 'is-invalid');
      const card = cards[idx];
      card.classList.remove('correct', 'incorrect', 'border-success', 'border-danger');
      const msg = card.querySelector('.validation-msg');
      if (msg) msg.remove();
    });
  });

  // Validar
  validateBtn.addEventListener('click', () => {
    let allCorrect = true;
    let correctCount = 0;

    selects.forEach((sel, idx) => {
      const val = sel.value;
      const correct = correctMap[idx];
      const isCorrect = val === correct;
      allCorrect = allCorrect && isCorrect;

      sel.classList.remove('is-valid', 'is-invalid');
      const card = cards[idx];
      card.classList.remove('correct', 'incorrect', 'border-success', 'border-danger');

      if (isCorrect) {
        sel.classList.add('is-valid');
        card.classList.add('correct', 'border', 'border-success');
        upsertCardMsg(card, 'Correcto', true);
        correctCount += 1;
      } else {
        sel.classList.add('is-invalid');
        card.classList.add('incorrect', 'border', 'border-danger');
        upsertCardMsg(card, 'Incorrecto', false);
      }
    });

    const total = selects.length;
    const percent = Math.round((correctCount / total) * 100);

    if (allCorrect) {
      successMessage.textContent = `¡Muy bien! Has contestado ${correctCount} de ${total} preguntas correctamente (${percent}%).`;
      successMessage.classList.remove('d-none');
      errorMessage.classList.add('d-none');
      validateBtn.disabled = true;
    } else {
      errorMessage.textContent = `Puedes mejorar. Has contestado ${correctCount} de ${total} preguntas correctamente (${percent}%).`;
      successMessage.classList.add('d-none');
      errorMessage.classList.remove('d-none');
    }
  });

  // Reiniciar
  resetBtn.addEventListener('click', () => {
    resetActivity();
  });

  // Funcionalidad de cards activa/inactiva
  const activateButtons = document.querySelectorAll('.card-activate-btn');
  const cardCols = document.querySelectorAll('.card-col');
  let activeCardIndex = 0; // Primera card activa por defecto
  
  function setActiveCard(index, playAudio = true) {
    // Pausar todos los audios
    cards.forEach(card => {
      const audio = card.querySelector('audio');
      if (audio) audio.pause();
    });
    
    cardCols.forEach((col, i) => {
      const card = cards[i];
      card.classList.remove('active', 'inactive');
      
      if (i === index) {
        // Card activa: 5 columnas en web, 12 en móvil
        col.className = 'col-12 col-lg-custom-5 card-col';
        card.classList.add('active');
        
        // Reproducir audio automáticamente solo si playAudio es true
        if (playAudio) {
          const audio = card.querySelector('audio');
          if (audio) {
            setTimeout(() => audio.play(), 300); // Pequeño delay para la transición
          }
        }
      } else {
        // Cards inactivas: 3.5 columnas en web, 12 en móvil
        col.className = 'col-12 col-lg-custom-3-5 card-col';
        card.classList.add('inactive');
      }
    });
    activeCardIndex = index;
  }
  
  // Event listeners para botones de activación
  activateButtons.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      setActiveCard(index);
    });
  });
  
  // Event listeners para activar card al hacer clic solo en el card-body
  cards.forEach((card, index) => {
    const cardBody = card.querySelector('.card-body');
    if (cardBody) {
      cardBody.addEventListener('click', (e) => {
        // Solo activar si la card no está activa
        if (!card.classList.contains('active')) {
          setActiveCard(index);
        }
      });
    }
  });
  
  // Estado inicial
  setActiveCard(0, false); // Primera card activa sin reproducir audio
  resetActivity();

  // Crea o actualiza un pequeño mensaje debajo de la tarjeta
  function upsertCardMsg(card, text, ok) {
    let msg = card.querySelector('.validation-msg');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'validation-msg text-center';
      // Insertar al final del card (debajo del footer)
      card.appendChild(msg);
    }
    msg.textContent = text;
    msg.classList.toggle('success', ok);
    msg.classList.toggle('error', !ok);
  }
}

