export function init() {
  loadIframe({
    id: 'Slide11Web',
    src: 'https://iframe.mediadelivery.net/embed/488325/a8359581-d8d0-4875-8c4d-58c3453b1455?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
    className: 'iframe-video-vertical-web',
    style: 'width: 20vw; height: 70vh; min-height: 300px;',
  });

  loadIframe({
    id: 'Slide11Mobile',
    src: 'https://iframe.mediadelivery.net/embed/488325/a8359581-d8d0-4875-8c4d-58c3453b1455?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
    className: 'iframe-video-vertical-mobil',
    style: 'width: 20vw; height: 70vh; min-height: 300px;',
  });

  loadIframe({
    id: 'Slide11WebActivity',
    src: 'https://app.lumi.education/api/v1/run/UYy73D/embed',
    className: 'iframe-actividad-lumi',
  });

  const options = document.querySelectorAll('.activity-option');
  const validateBtn = document.getElementById('validateBtn');
  const resetBtn = document.getElementById('resetBtn');
  const successMessage = document.getElementById('successMessage');
  const errorMessage = document.getElementById('errorMessage');
  const buttonsGroup = document.getElementById('activityButtons');
  const modal = document.getElementById('sld17_modal');

  modal.addEventListener('show.bs.modal', () => {
    // Ocultar mensajes y mostrar botones
    successMessage.classList.add('d-none');
    if (errorMessage) errorMessage.classList.add('d-none');
    buttonsGroup.classList.remove('d-none');

    // Limpiar opciones
    options.forEach((opt) => {
      opt.classList.remove('selected', 'correct', 'incorrect');
    });

    // Estado inicial de botones
    validateBtn.disabled = true;
    resetBtn.disabled = true;
  });

  if (!options.length || !validateBtn || !resetBtn || !successMessage || !buttonsGroup) return;

  options.forEach((opt) => {
    opt.addEventListener('click', () => {
      // No permitir nuevas selecciones si ya se validó correctamente (ocultamos botones al acertar)
      if (buttonsGroup.classList.contains('d-none')) return;

      const wasSelected = opt.classList.contains('selected');

      // Limpia selección y estados previos de todas las opciones
      options.forEach((o) => o.classList.remove('selected', 'correct', 'incorrect'));
      if (errorMessage) errorMessage.classList.add('d-none');

      if (!wasSelected) {
        opt.classList.add('selected');
        validateBtn.disabled = false;
        resetBtn.disabled = false;
      } else {
        // Si se des-selecciona, deshabilitar validar y reset si no hay nada seleccionado
        const anySelected = document.querySelectorAll('.activity-option.selected').length > 0;
        validateBtn.disabled = !anySelected;
        resetBtn.disabled = !anySelected;
      }
    });
  });

  validateBtn.addEventListener('click', () => {
    let selectedCorrectCount = 0;
    let selectedIncorrect = false;

    options.forEach((opt) => {
      opt.classList.remove('correct', 'incorrect');
      const isSelected = opt.classList.contains('selected');
      const isCorrect = opt.getAttribute('data-correct') === 'true';

      if (isSelected && isCorrect) {
        selectedCorrectCount++;
      }

      if (isSelected && !isCorrect) {
        selectedIncorrect = true;
      }
    });

    if (selectedCorrectCount === 1 && !selectedIncorrect) {
      options.forEach((opt) => {
        if (opt.classList.contains('selected')) {
          opt.classList.add('correct');
        }
      });

      buttonsGroup.classList.add('d-none');
      successMessage.classList.remove('d-none');
    } else {
      options.forEach((opt) => {
        const isSelected = opt.classList.contains('selected');
        const isCorrect = opt.getAttribute('data-correct') === 'true';

        if (isSelected) {
          opt.classList.add(isCorrect ? 'correct' : 'incorrect');
        }
      });

      validateBtn.disabled = true;
      resetBtn.disabled = false;
      if (errorMessage) errorMessage.classList.remove('d-none');
    }
  });

  resetBtn.addEventListener('click', () => {
    options.forEach((opt) => {
      opt.classList.remove('selected', 'correct', 'incorrect');
    });

    validateBtn.disabled = true;
    validateBtn.textContent = 'Validar';

    resetBtn.disabled = true;

    successMessage.classList.add('d-none');
    if (errorMessage) errorMessage.classList.add('d-none');
    buttonsGroup.classList.remove('d-none');
  });
}


