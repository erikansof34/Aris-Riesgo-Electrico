export function init() {
  // Actividad inline (copiada de slider14, sin modal)
  const options = document.querySelectorAll('.activity-option');
  const validateBtn = document.getElementById('validateBtn');
  const resetBtn = document.getElementById('resetBtn');
  const successMessage = document.getElementById('successMessage');
  const errorMessage = document.getElementById('errorMessage');
  const buttonsGroup = document.getElementById('activityButtons');

  // Estado inicial
  if (successMessage) successMessage.classList.add('d-none');
  if (errorMessage) errorMessage.classList.add('d-none');
  if (validateBtn) validateBtn.disabled = true;
  if (resetBtn) resetBtn.disabled = true;

  if (options.length && validateBtn && resetBtn && successMessage && buttonsGroup) {
    options.forEach((opt) => {
      opt.addEventListener('click', () => {
        // Si ya está mostrada la respuesta correcta (ocultamos botones), no permitir cambios
        if (buttonsGroup.classList.contains('d-none')) return;

        const wasSelected = opt.classList.contains('selected');

        // Limpia selección y estados previos
        options.forEach((o) => o.classList.remove('selected', 'correct', 'incorrect'));
        if (errorMessage) errorMessage.classList.add('d-none');

        if (!wasSelected) {
          opt.classList.add('selected');
          validateBtn.disabled = false;
          resetBtn.disabled = false;
        } else {
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

        if (isSelected && isCorrect) selectedCorrectCount++;
        if (isSelected && !isCorrect) selectedIncorrect = true;
      });

      if (selectedCorrectCount === 1 && !selectedIncorrect) {
        options.forEach((opt) => {
          if (opt.classList.contains('selected')) opt.classList.add('correct');
        });

        buttonsGroup.classList.add('d-none');
        successMessage.classList.remove('d-none');
        if (errorMessage) errorMessage.classList.add('d-none');
      } else {
        options.forEach((opt) => {
          const isSelected = opt.classList.contains('selected');
          const isCorrect = opt.getAttribute('data-correct') === 'true';
          if (isSelected) opt.classList.add(isCorrect ? 'correct' : 'incorrect');
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
      if (validateBtn) validateBtn.disabled = true;
      if (resetBtn) resetBtn.disabled = true;
      if (successMessage) successMessage.classList.add('d-none');
      if (errorMessage) errorMessage.classList.add('d-none');
      if (buttonsGroup) buttonsGroup.classList.remove('d-none');
    });
  }

  loadIframe({
    id: 'Slide23Web',
    src: 'https://iframe.mediadelivery.net/embed/488325/eba36e43-ea68-4a16-83d7-a3b552156545?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
    className: 'iframe-video-vertical-web',
    style: 'width: 20vw; height: 70vh; min-height: 300px;',
  });

  loadIframe({
    id: 'Slide23Mobile',
    src: 'https://iframe.mediadelivery.net/embed/488325/eba36e43-ea68-4a16-83d7-a3b552156545?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
    className: 'iframe-video-vertical-mobil',
    style: 'width: 20vw; height: 70vh; min-height: 300px;',
  });
}
