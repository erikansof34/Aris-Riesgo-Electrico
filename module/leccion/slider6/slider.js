export function init() {
  // Actividad Select
  const correctAnswers = ['1', '4', '2', '3', '5', '6'];
  let selectedValues = {};

  const selects = document.querySelectorAll('.select');
  const validateBtn = document.querySelector('.select-validate');
  const resetBtn = document.querySelector('.select-reset');
  const feedbackDiv = document.querySelector('.select-feedback');
  const errorContainer = document.querySelector('.select-error-container');

  selects.forEach((select) => {
    selectedValues[select.dataset.index] = '0';
  });

  function updateSelectOptions() {
    selects.forEach((select) => {
      Array.from(select.options).forEach((option) => {
        if (option.value !== '0') option.hidden = false;
      });
    });

    selects.forEach((currentSelect) => {
      const currentValue = currentSelect.value;
      if (currentValue !== '0') {
        selects.forEach((otherSelect) => {
          if (otherSelect !== currentSelect) {
            const optionToHide = otherSelect.querySelector(`option[value="${currentValue}"]`);
            if (optionToHide) optionToHide.hidden = true;
          }
        });
      }
    });

    selects.forEach((select) => {
      if (select.value !== '0') {
        select.classList.add('select-selected');
      } else {
        select.classList.remove('select-selected');
      }
    });
  }

  selects.forEach((select) => {
    select.addEventListener('change', function () {
      selectedValues[select.dataset.index] = select.value;
      updateSelectOptions();
    });
  });

  validateBtn.addEventListener('click', function () {
    let allSelected = true;
    selects.forEach((select) => {
      if (select.value === '0') allSelected = false;
    });

    if (!allSelected) {
      errorContainer.innerHTML = '<div class="select-error">Debe seleccionar todas las opciones antes de validar.</div>';
      return;
    }

    errorContainer.innerHTML = '';

    let correctCount = 0;
    selects.forEach((select, index) => {
      if (select.value === correctAnswers[index]) {
        select.classList.add('select-correct-answer');
        select.classList.remove('select-incorrect-answer');
        correctCount++;
      } else {
        select.classList.add('select-incorrect-answer');
        select.classList.remove('select-correct-answer');
      }
      select.classList.remove('select-selected');
    });

    const percentage = Math.round((correctCount / correctAnswers.length) * 100);
    if (correctCount === correctAnswers.length) {
      feedbackDiv.textContent = '¡Muy bien! Has completado correctamente la actividad.';
      feedbackDiv.classList.remove('hidden', 'select-incorrect');
      feedbackDiv.classList.add('select-correct');
      window.setActividadCompletada?.('slider6');
    } else {
      feedbackDiv.textContent = '¡Piénsalo bien! Algunas respuestas no son correctas.';
      feedbackDiv.classList.remove('hidden', 'select-correct');
      feedbackDiv.classList.add('select-incorrect');
    }

    feedbackDiv.insertAdjacentHTML('beforeend', `<div class="select-results">Tus respuestas correctas son: ${correctCount} de ${correctAnswers.length} (${percentage}%)</div>`);

    resetBtn.classList.remove('hidden');
    resetBtn.disabled = false;

    selects.forEach((select) => {
      select.disabled = true;
    });

    validateBtn.disabled = true;
  });

  resetBtn.addEventListener('click', function () {
    selects.forEach((select) => {
      select.value = '0';
      select.classList.remove('select-correct-answer', 'select-incorrect-answer', 'select-selected');
      select.disabled = false;
      Array.from(select.options).forEach((option) => {
        option.hidden = false;
      });
    });

    selects.forEach((select) => {
      selectedValues[select.dataset.index] = '0';
    });

    feedbackDiv.innerHTML = '';
    feedbackDiv.classList.add('hidden');
    feedbackDiv.classList.remove('select-correct', 'select-incorrect');

    resetBtn.classList.add('hidden');
    resetBtn.disabled = true;
    validateBtn.disabled = false;

    errorContainer.innerHTML = '';
  });

  updateSelectOptions();

  // Si ya se completó previamente, deshabilitar y mostrar mensaje
  if (window.getEstadoActividades?.()['slider6']) {
    selects.forEach((select) => (select.disabled = true));
    validateBtn.disabled = true;
    resetBtn.classList.add('hidden');
    feedbackDiv.textContent = 'Actividad completada previamente.';
    feedbackDiv.classList.remove('hidden');
    feedbackDiv.classList.add('select-correct');
  }
}
