export function init() {
  const options = [
    { value: '3', label: 'Candado de Seguridad Personal' },
    { value: '1', label: 'Candado Oficial de Bloqueo' },
    { value: '2', label: 'Candado Coordinador de Aislamiento' },
  ];

  const correctOrder = ['1', '2', '3']; // Amarillo→Oficial, Azul→Coordinador, Rojo→Seguridad
  let selectedValues = ['', '', ''];

  const dropdowns = document.querySelectorAll('.candado-dropdown');
  const validateBtn = document.getElementById('validate-btn');
  const resetBtn = document.getElementById('reset-btn');
  const validationMessage = document.getElementById('validation-message');

  function updateDropdownOptions() {
    dropdowns.forEach((dropdown, index) => {
      const currentValue = dropdown.value;
      dropdown.innerHTML = '<option value="">Seleccione...</option>';

      options.forEach((option) => {
        if (!selectedValues.includes(option.value) || option.value === currentValue) {
          const optionElement = document.createElement('option');
          optionElement.value = option.value;
          optionElement.textContent = option.label;
          dropdown.appendChild(optionElement);
        }
      });

      dropdown.value = currentValue;
    });
  }

  function handleDropdownChange(event) {
    const index = parseInt(event.target.dataset.index);
    const oldValue = selectedValues[index];
    const newValue = event.target.value;

    selectedValues[index] = newValue;

    // Limpiar iconos de validación
    const candadoItem = event.target.closest('.candado-item');
    const existingIcon = candadoItem.querySelector('.verification-icon');
    if (existingIcon) {
      existingIcon.remove();
    }

    updateDropdownOptions();
    updateResetButtonState();

    // Limpiar mensaje de validación
    validationMessage.textContent = '';
    validationMessage.className = 'validation-message';
  }

  function validateAnswers() {
    // Verificar si todas las opciones están seleccionadas
    const allSelected = selectedValues.every((value) => value !== '');

    if (!allSelected) {
      validationMessage.textContent = 'Debe seleccionar todas las opciones antes de validar.';
      validationMessage.className = 'validation-message error';
      return;
    }

    let correctCount = 0;

    dropdowns.forEach((dropdown, index) => {
      const candadoItem = dropdown.closest('.candado-item');
      const isCorrect = selectedValues[index] === correctOrder[index];

      // Remover iconos existentes
      const existingIcon = candadoItem.querySelector('.verification-icon');
      if (existingIcon) {
        existingIcon.remove();
      }

      const icon = document.createElement('div');
      icon.className = 'verification-icon';

      if (isCorrect) {
        icon.classList.add('correct');
        icon.innerHTML = '<i class="fa fa-check"></i>';
        correctCount++;
      } else {
        icon.classList.add('incorrect');
        icon.innerHTML = '<i class="fa fa-times"></i>';
      }

      candadoItem.appendChild(icon);
    });

    const percentage = ((correctCount / correctOrder.length) * 100).toFixed(0);
    validationMessage.textContent = `Respuestas correctas ${correctCount} de 3. (${percentage}%)`;
    validationMessage.className = 'validation-message';

    if (Number(percentage) === 100) {
      window.setActividadCompletada?.('slider14');
      validateBtn.disabled = true;
      dropdowns.forEach((d) => (d.disabled = true));
      validationMessage.classList.add('select-correct');
    } else {
      validationMessage.classList.add('select-incorrect');
    }
  }

  function updateResetButtonState() {
    const hasSelections = selectedValues.some((value) => value !== '');
    resetBtn.disabled = !hasSelections;
  }

  function resetActivity() {
    selectedValues = ['', '', ''];

    dropdowns.forEach((dropdown) => {
      dropdown.value = '';
      const candadoItem = dropdown.closest('.candado-item');
      const existingIcon = candadoItem.querySelector('.verification-icon');
      if (existingIcon) {
        existingIcon.remove();
      }
    });

    updateDropdownOptions();
    updateResetButtonState();
    validationMessage.textContent = '';
    validationMessage.className = 'validation-message';
  }

  // Event listeners
  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener('change', handleDropdownChange);
  });

  validateBtn.addEventListener('click', validateAnswers);
  resetBtn.addEventListener('click', resetActivity);

  // Inicializar
  updateDropdownOptions();
  updateResetButtonState();
}
