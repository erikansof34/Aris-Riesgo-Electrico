export function init() {
    // iframes existentes...
    loadIframe({
        id: 'Slide11Web',
        src: 'https://iframe.mediadelivery.net/embed/488325/df56025a-8879-4c81-9de7-7f6349bdde0f?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
        className: 'iframe-video-vertical-web',
        style: 'width: 20vw; height: 70vh; min-height: 300px;',
    });

    loadIframe({
        id: 'Slide11Mobile',
        src: 'https://iframe.mediadelivery.net/embed/488325/df56025a-8879-4c81-9de7-7f6349bdde0f?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
        className: 'iframe-video-vertical-mobil',
        style: 'width: 20vw; height: 70vh; min-height: 300px;',
    });
    const options = document.querySelectorAll('.activity-option');
    const validateBtn = document.getElementById('validateBtn');
    const resetBtn = document.getElementById('resetBtn');
    const successMessage = document.getElementById('successMessage');
    const partialMessage = document.getElementById('partialMessage');
    const failMessage = document.getElementById('failMessage');
    const errorMessage = document.getElementById('errorMessage');
    const buttonsGroup = document.getElementById('activityButtons');
    const modal = document.getElementById('sld14_modal');

    modal.addEventListener('show.bs.modal', () => {
      // Ocultar mensajes y mostrar botones
      successMessage.classList.add('d-none');
      partialMessage.classList.add('d-none');
      failMessage.classList.add('d-none');
      errorMessage.classList.add('d-none');
      buttonsGroup.classList.remove('d-none');

      // Limpiar opciones
      options.forEach(opt => {
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

            const wasSelected = opt.classList.contains('selected');
            
            if (wasSelected) {
                opt.classList.remove('selected');
            } else {
                const selectedCount = document.querySelectorAll('.activity-option.selected').length;
                if (selectedCount < 2) {
                    opt.classList.add('selected');
                }
            }

            // Limpiar estados de error/correcto al hacer nueva selección
            options.forEach(o => o.classList.remove('correct', 'incorrect'));
            errorMessage.classList.add('d-none');
            partialMessage.classList.add('d-none');
            failMessage.classList.add('d-none');

            // Habilitar/deshabilitar botones según selección
            const currentSelected = document.querySelectorAll('.activity-option.selected').length;
            validateBtn.disabled = currentSelected === 0;
            resetBtn.disabled = currentSelected === 0;
        });
    });

    validateBtn.addEventListener('click', () => {
        const selectedOptions = document.querySelectorAll('.activity-option.selected');
        
        // Verificar que se hayan seleccionado exactamente 2 opciones
        if (selectedOptions.length !== 2) {
            errorMessage.classList.remove('d-none');
            return;
        }

        errorMessage.classList.add('d-none');
        let selectedCorrectCount = 0;

        options.forEach((opt) => {
            opt.classList.remove('correct', 'incorrect');
            const isSelected = opt.classList.contains('selected');
            const isCorrect = opt.getAttribute('data-correct') === 'true';

            if (isSelected && isCorrect) {
                selectedCorrectCount++;
            }
        });

        // Aplicar estilos visuales
        options.forEach((opt) => {
            const isSelected = opt.classList.contains('selected');
            const isCorrect = opt.getAttribute('data-correct') === 'true';

            if (isSelected) {
                opt.classList.add(isCorrect ? 'correct' : 'incorrect');
            }
        });

        // Mostrar feedback según resultado
        if (selectedCorrectCount === 2) {
            document.getElementById('successScore').textContent = '2 de 2';
            buttonsGroup.classList.add('d-none');
            successMessage.classList.remove('d-none');
        } else if (selectedCorrectCount === 1) {
            document.getElementById('partialScore').textContent = '1 de 2';
            partialMessage.classList.remove('d-none');
            validateBtn.disabled = true;
            resetBtn.disabled = false;
        } else {
            document.getElementById('failScore').textContent = '0 de 2';
            failMessage.classList.remove('d-none');
            validateBtn.disabled = true;
            resetBtn.disabled = false;
        }
    });

    resetBtn.addEventListener('click', () => {
        options.forEach((opt) => {
            opt.classList.remove('selected', 'correct', 'incorrect');
        });

        validateBtn.disabled = true;
        resetBtn.disabled = true;

        successMessage.classList.add('d-none');
        partialMessage.classList.add('d-none');
        failMessage.classList.add('d-none');
        errorMessage.classList.add('d-none');
        buttonsGroup.classList.remove('d-none');
    });
}