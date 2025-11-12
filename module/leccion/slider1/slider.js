export function init() {
  loadIframe({
    id: 'Slide1Web',
    src: 'https://iframe.mediadelivery.net/embed/488325/188ef122-27cf-483f-bade-bf51d8144a0f?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
    className: 'iframe-video-vertical-web',
    style: 'width: 20vw; height: 70vh; min-height: 300px;',
  });

  loadIframe({
    id: 'Slide1Mobile',
    src: 'https://iframe.mediadelivery.net/embed/488325/188ef122-27cf-483f-bade-bf51d8144a0f?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
    className: 'iframe-video-vertical-mobil',
    style: 'width: 20vw; height: 70vh; min-height: 300px;',
  });

  loadIframe({
    id: "Slide1WebActivity",
    src: "https://app.lumi.education/api/v1/run/Dn1hv9/embed",
    className: "iframe-actividad-lumi",
    style: "height: 37vh;"
  });

  const options = document.querySelectorAll('.activity-option');
  const validateBtn = document.getElementById('validateBtn');
  const resetBtn = document.getElementById('resetBtn');
  const successMessage = document.getElementById('successMessage');
  const errorMessage = document.getElementById('errorMessage');
  const buttonsGroup = document.getElementById('activityButtons');
  const modal = document.getElementById('sld1_modal');

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
      // No permitir nuevas selecciones si ya se validó correctamente
      if (buttonsGroup.classList.contains('d-none')) return;

      // Contar opciones seleccionadas
      const selectedCount = document.querySelectorAll('.activity-option.selected').length;

      // Si ya hay 2 opciones seleccionadas y esta no está seleccionada, no permitir más selecciones
      if (selectedCount >= 2 && !opt.classList.contains('selected')) {
        return;
      }

      // Alternar selección
      opt.classList.toggle('selected');

      // Actualizar estado de botones
      const newSelectedCount = document.querySelectorAll('.activity-option.selected').length;
      validateBtn.disabled = newSelectedCount === 0;
      resetBtn.disabled = newSelectedCount === 0;

      // Ocultar mensaje de error si hay selección
      if (errorMessage && newSelectedCount > 0) errorMessage.classList.add('d-none');
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

    // Verificar si se seleccionaron exactamente las 2 opciones correctas y ninguna incorrecta
    if (selectedCorrectCount === 2 && !selectedIncorrect) {
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
    resetBtn.disabled = true;

    successMessage.classList.add('d-none');
    if (errorMessage) errorMessage.classList.add('d-none');
    buttonsGroup.classList.remove('d-none');
  });
}