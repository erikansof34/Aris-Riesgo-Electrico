export function init() {
  // Inicializar la actividad directamente
  initActivity();

  // Implementación de la actividad
  function initActivity() {
    // Datos para la actividad
    const risks = [
      {
        image: "../../assets/img/espacio_laboral_inseguro.webp",
        audio: "../../assets/audio/espacios-laborales-m1-slide-10.mp3",
        dropId: "drop1"
      },
      {
        image: "../../assets/img/deficiencia_iluminacion.webp",
        audio: "../../assets/audio/deficiencias-en-iluminación-m1-slide-10.mp3",
        dropId: "drop2"
      },
      {
        image: "../../assets/img/deficiencia_seguridad_higiene.webp",
        audio: "../../assets/audio/deficiencias-en-seguridad-m1-slide-10.mp3",
        dropId: "drop3"
      },
      {
        image: "../../assets/img/exposicion_ruidos.webp",
        audio: "../../assets/audio/exposicion-a-ruidos-m1-slide-10.mp3",
        dropId: "drop4"
      }
    ];

    const options = [
      { value: "option1", label: "Deficiencias en Seguridad e Higiene" },
      { value: "option2", label: "Espacios laborales inseguros o insalubres" },
      { value: "option3", label: "Exposición a ruidos, temperaturas extremas o sustancias peligrosas." },
      { value: "option4", label: "Deficiencias en iluminación, ventilación" }
    ];

    const correctItems = {
      drop1: "option2",
      drop2: "option4",
      drop3: "option1",
      drop4: "option3"
    };

    const imgVerdadero = "../../assets/img/checkAct.png";
    const imgFalso = "../../assets/img/xmarkAct.png";

    // Elementos del DOM
    const cardsContainer = document.getElementById('cardsContainer');
    const validationMessage = document.getElementById('validationMessage');
    const feedbackContainer = document.getElementById('feedbackContainer');
    const feedbackText = document.getElementById('feedbackText');
    const correctCountElement = document.getElementById('correctCount');
    const totalQuestionsElement = document.getElementById('totalQuestions');
    const percentageElement = document.getElementById('percentage');
    const resetButton = document.getElementById('resetButton');

    // Estado de la aplicación
    const state = {
      selections: {
        drop1: "",
        drop2: "",
        drop3: "",
        drop4: ""
      },
      isVerified: {
        drop1: false,
        drop2: false,
        drop3: false,
        drop4: false
      },
      isResetEnabled: false,
      correctCount: 0,
      showValidationMessage: false,
      audioRefs: {},
      currentlyPlaying: null // Para controlar qué audio se está reproduciendo
    };

    // Renderizar las tarjetas
    function renderCards() {
      cardsContainer.innerHTML = '';

      risks.forEach((risk, index) => {
        const card = document.createElement('div');
        card.className = `card-container-ppt15 ${state.selections[risk.dropId] ? (state.isVerified[risk.dropId] ? "correct" : "incorrect") : ""}`;

        card.innerHTML = `
          <div class="image-audio-select-container-ppt15">
            ${state.selections[risk.dropId] ? `
              <div class="validation-icon-container-ppt15">
                <img src="${state.isVerified[risk.dropId] ? imgVerdadero : imgFalso}" alt="Validation Icon" class="validation-icon-ppt15">
              </div>
            ` : ''}
            <div class="image-container-ppt15">
              <img src="${risk.image}" alt="Imagen ${index + 1}" class="circular-image-ppt15">
            </div>

            <div class="audio-container-ppt15">
              <audio id="audio-${risk.dropId}" controls>
                <source src="${risk.audio}" type="audio/mpeg">
                Tu navegador no soporta el elemento de audio.
              </audio>
            </div>

            <div class="select-container-ppt15">
              <select id="select-${risk.dropId}" ${state.isVerified[risk.dropId] ? "disabled" : ""}>
                <option value="">Seleccione...</option>
                ${generateOptions(risk.dropId)}
              </select>
            </div>
          </div>
        `;

        cardsContainer.appendChild(card);
        state.audioRefs[risk.dropId] = document.getElementById(`audio-${risk.dropId}`);
      });
    }

    // Generar opciones para los select
    function generateOptions(dropId) {
      return options
        .filter(option =>
          !Object.values(state.selections).includes(option.value) ||
          state.selections[dropId] === option.value
        )
        .map(option => `
          <option value="${option.value}" ${state.selections[dropId] === option.value ? "selected" : ""}>
            ${option.label}
          </option>
        `)
        .join('');
    }

    // Configurar event listeners
    function setupEventListeners() {
      risks.forEach(risk => {
        const select = document.getElementById(`select-${risk.dropId}`);
        if (select) {
          select.addEventListener('change', (e) => handleChange(risk.dropId, e.target.value));
        }

        // Controlar reproducción de audio (solo uno a la vez)
        const audio = state.audioRefs[risk.dropId];
        if (audio) {
          audio.addEventListener('play', () => handleAudioPlay(risk.dropId));
          audio.addEventListener('pause', () => handleAudioPause(risk.dropId));
          audio.addEventListener('ended', () => handleAudioEnded(risk.dropId));
        }
      });

      resetButton.addEventListener('click', handleReset);
    }

    // Manejar reproducción de audio (solo permitir uno a la vez)
    function handleAudioPlay(dropId) {
      if (state.currentlyPlaying && state.currentlyPlaying !== dropId) {
        // Pausar cualquier otro audio que se esté reproduciendo
        const otherAudio = state.audioRefs[state.currentlyPlaying];
        if (otherAudio && !otherAudio.paused) {
          otherAudio.pause();
          otherAudio.currentTime = 0;
        }
      }
      state.currentlyPlaying = dropId;
    }

    function handleAudioPause(dropId) {
      if (state.currentlyPlaying === dropId) {
        state.currentlyPlaying = null;
      }
    }

    function handleAudioEnded(dropId) {
      if (state.currentlyPlaying === dropId) {
        state.currentlyPlaying = null;
      }
    }

    // Manejar cambios en los select
    function handleChange(dropId, value) {
      // Detener todos los audios
      Object.values(state.audioRefs).forEach(audio => {
        if (audio && !audio.paused) {
          audio.pause();
          audio.currentTime = 0;
        }
      });

      // Actualizar estado
      state.selections[dropId] = value;
      state.isVerified[dropId] = value === correctItems[dropId];
      state.isResetEnabled = true;

      // Contar respuestas correctas
      const correctAnswers = Object.keys(state.selections).filter(
        key => state.selections[key] === correctItems[key]
      ).length;
      state.correctCount = correctAnswers;

      // Mostrar feedback si todas las preguntas han sido respondidas
      state.showValidationMessage = Object.values(state.selections).every(val => val !== "");

      // Actualizar UI
      updateUI();
    }

    // Manejar reinicio
    function handleReset() {
      // Resetear estado
      state.selections = {
        drop1: "",
        drop2: "",
        drop3: "",
        drop4: ""
      };
      state.isVerified = {
        drop1: false,
        drop2: false,
        drop3: false,
        drop4: false
      };
      state.isResetEnabled = false;
      state.correctCount = 0;
      state.showValidationMessage = false;
      state.currentlyPlaying = null;

      // Detener todos los audios
      Object.values(state.audioRefs).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });

      // Actualizar UI
      updateUI();
    }

    // Actualizar la interfaz de usuario
    function updateUI() {
      renderCards();
      setupEventListeners();

      // Actualizar mensaje de validación
      if (state.showValidationMessage) {
        validationMessage.style.display = 'block';
        correctCountElement.textContent = state.correctCount;
        totalQuestionsElement.textContent = Object.keys(correctItems).length;
        percentageElement.textContent = Math.round((state.correctCount / Object.keys(correctItems).length) * 100);

        feedbackContainer.style.display = 'block';
        if (state.correctCount === Object.keys(correctItems).length) {
          feedbackText.innerHTML = `
            <span class="text-green-personalizado-ppt15 font-bold">Respuesta correcta:</span>
            <span class="texto-gray-ppt15">¡Muy bien! Haz contestado todo correctamente.</span>
          `;
        } else if (state.correctCount >= Object.keys(correctItems).length - 2) {
          feedbackText.innerHTML = `
            <span class="text-orange-personalizado-ppt15 font-bold">Piénsalo bien:</span>
            <span class="texto-gray-ppt15">Algunas preguntas NO las has relacionado correctamente.</span>
          `;
        } else {
          feedbackText.innerHTML = `
            <span class="text-red-personalizado-ppt15 font-bold">Respuesta Incorrecta:</span>
            <span class="texto-gray-ppt15">¡Piénsalo bien! Mira nuevamente el vídeo e inténtalo de nuevo.</span>
          `;
        }
      } else {
        validationMessage.style.display = 'none';
        feedbackContainer.style.display = 'none';
      }

      // Actualizar botón de reinicio
      resetButton.disabled = !state.isResetEnabled;
    }

    // Inicializar la actividad
    renderCards();
    totalQuestionsElement.textContent = Object.keys(correctItems).length;
    setupEventListeners();
  }
}