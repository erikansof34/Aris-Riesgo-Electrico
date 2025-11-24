export function init() {
  // Funcionalidad existente de iframes
  initLotoActivity();
}

function initLotoActivity() {
  const correctOrder = ['L', 'O', 'T', 'O'];
  let isMobile = window.innerWidth <= 768;
  let isValidated = false;
  let availableLetters = { L: 1, O: 2, T: 1 };
  let mobileGuess = ['', '', '', ''];
  let droppedItems = new Set();
  let dropSuccessful = false;
  let currentDraggedElement = null;
  
  // Elementos del DOM
  const validateBtn = document.querySelector('.loto-validate');
  const resetBtn = document.querySelector('.loto-reset');
  const resultDiv = document.querySelector('.loto-result');
  
  // Detectar cambio de tamaño de pantalla
  window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
  });
  
  // Funcionalidad Desktop - Drag and Drop
  function initDesktopDragDrop() {
    const draggableItems = document.querySelectorAll('.loto-item');
    const dropZones = document.querySelectorAll('.loto-drop-zone');
    
    draggableItems.forEach(item => {
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragend', handleDragEnd);
    });
    
    dropZones.forEach(zone => {
      zone.addEventListener('dragover', handleDragOver);
      zone.addEventListener('drop', handleDrop);
      zone.addEventListener('dragenter', handleDragEnter);
      zone.addEventListener('dragleave', handleDragLeave);
      

    });
  }
  
  function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.value);
    e.dataTransfer.setData('element-id', e.target.src);
    e.target.classList.add('dragging');
    
    // Ocultar inmediatamente
    e.target.classList.add('hidden');
    dropSuccessful = false;
    currentDraggedElement = e.target;
  }
  
  function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    
    // Si no fue exitoso, restaurar
    if (!dropSuccessful) {
      e.target.classList.remove('hidden');
    }
    
    // Reset variables
    currentDraggedElement = null;
    dropSuccessful = false;
  }
  
  function handleDragOver(e) {
    const dropZone = e.target.closest('.loto-drop-zone');
    if (dropZone) {
      // Solo permitir si está vacía
      if (!dropZone.querySelector('img')) {
        e.preventDefault();
      }
    }
  }
  
  function handleDragEnter(e) {
    const dropZone = e.target.closest('.loto-drop-zone');
    if (dropZone && !dropZone.querySelector('img')) {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    }
  }
  
  function handleDragLeave(e) {
    e.target.classList.remove('drag-over');
  }
  
  function handleDrop(e) {
    const dropZone = e.target.closest('.loto-drop-zone');
    
    if (!dropZone || dropZone.querySelector('img')) {
      // Drop inválido - no hacer nada, dragEnd se encarga
      return;
    }
    
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    const value = e.dataTransfer.getData('text/plain');
    const elementSrc = e.dataTransfer.getData('element-id');
    
    // Crear imagen en la zona de drop
    const img = document.createElement('img');
    img.src = elementSrc;
    img.alt = `Letra ${value}`;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    img.dataset.value = value;
    img.dataset.originalSrc = elementSrc;
    
    // Limpiar placeholder y agregar imagen
    dropZone.innerHTML = '';
    dropZone.appendChild(img);
    
    // Marcar como exitoso
    dropSuccessful = true;
    droppedItems.add(elementSrc);
    
    // Ocultar completamente el original
    if (currentDraggedElement) {
      setTimeout(() => {
        currentDraggedElement.style.display = 'none';
      }, 300);
    }
    
    // Hacer la imagen clickeable para devolverla
    img.addEventListener('click', () => {
      if (!isValidated) {
        returnImageToOrigin(img, dropZone);
      }
    });
  }
  
  // Funcionalidad Mobile - Selects
  function initMobileSelects() {
    const selects = document.querySelectorAll('.loto-select');
    const letterBoxes = document.querySelectorAll('.letter-box');
    
    selects.forEach(select => {
      select.addEventListener('change', handleSelectChange);
    });
  }
  
  function handleSelectChange(e) {
    const index = parseInt(e.target.dataset.index);
    const newValue = e.target.value;
    const oldValue = mobileGuess[index];
    const letterBox = document.querySelector(`.letter-box[data-index="${index}"]`);
    
    mobileGuess[index] = newValue;
    letterBox.textContent = newValue || '_';
    
    updateAvailableOptions();
  }
  
  function updateAvailableOptions() {
    const selects = document.querySelectorAll('.loto-select');
    const usedLetters = { L: 0, O: 0, T: 0 };
    
    // Contar letras usadas
    mobileGuess.forEach(letter => {
      if (letter) usedLetters[letter]++;
    });
    
    // Actualizar cada select
    selects.forEach((select, selectIndex) => {
      const currentValue = select.value;
      
      // Recrear opciones
      select.innerHTML = '<option value="">Seleccione</option>';
      
      // Agregar solo opciones disponibles
      Object.keys(availableLetters).forEach(letter => {
        const maxCount = availableLetters[letter];
        const usedCount = usedLetters[letter];
        const availableCount = maxCount - usedCount;
        const currentSelectHasThis = currentValue === letter;
        
        // Solo agregar opciones si hay disponibles O si es el valor actual
        const optionsToAdd = currentSelectHasThis ? 1 : availableCount;
        
        for (let i = 0; i < optionsToAdd; i++) {
          const option = document.createElement('option');
          option.value = letter;
          option.textContent = letter;
          select.appendChild(option);
        }
      });
      
      // Restaurar valor seleccionado
      select.value = currentValue;
    });
  }
  
  // Validación
  function validateOrder() {
    let correct = 0;
    const answers = [];
    
    if (isMobile) {
      // Validación móvil
      const letterBoxes = document.querySelectorAll('.letter-box');
      const selects = document.querySelectorAll('.loto-select');
      
      mobileGuess.forEach((letter, index) => {
        const isCorrect = letter === correctOrder[index];
        answers.push(letter);
        
        if (isCorrect) {
          correct++;
          letterBoxes[index].classList.add('correct');
          selects[index].classList.add('correct');
        } else {
          letterBoxes[index].classList.add('incorrect');
          selects[index].classList.add('incorrect');
        }
        
        selects[index].disabled = true;
      });
    } else {
      // Validación desktop
      const dropZones = document.querySelectorAll('.loto-drop-zone');
      
      dropZones.forEach((zone, index) => {
        const img = zone.querySelector('img');
        const value = img ? img.dataset.value : '';
        const isCorrect = value === correctOrder[index];
        answers.push(value);
        
        if (isCorrect) correct++;
        
        // Agregar icono de verificación
        const icon = document.createElement('div');
        icon.className = `verification-icon ${isCorrect ? 'correct' : 'incorrect'}`;
        icon.innerHTML = isCorrect ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
        zone.appendChild(icon);
      });
    }
    
    // Mostrar resultado
    const percentage = Math.round((correct / 4) * 100);
    resultDiv.textContent = `Respuestas correctas: ${correct} de 4. (${percentage}%)`;
    resultDiv.classList.remove('hidden');
    
    isValidated = true;
    validateBtn.disabled = true;
  }
  
  // Función para devolver imagen al origen
  function returnImageToOrigin(img, dropZone) {
    const originalSrc = img.dataset.originalSrc;
    const originalElement = document.querySelector(`.loto-draggable-items [src="${originalSrc}"]`);
    
    if (originalElement) {
      originalElement.style.display = 'block';
      originalElement.classList.remove('hidden');
      droppedItems.delete(originalSrc);
    }
    
    dropZone.innerHTML = '<span class="drop-placeholder">Arrastre aquí</span>';
  }
  
  // Reiniciar actividad
  function resetActivity() {
    isValidated = false;
    mobileGuess = ['', '', '', ''];
    availableLetters = { L: 1, O: 2, T: 1 };
    droppedItems.clear();
    
    // Reset desktop
    const dropZones = document.querySelectorAll('.loto-drop-zone');
    const draggableItems = document.querySelectorAll('.loto-item');
    
    dropZones.forEach((zone, index) => {
      zone.innerHTML = '<span class="drop-placeholder">Arrastre aquí</span>';
    });
    
    draggableItems.forEach(item => {
      item.style.display = 'block';
      item.classList.remove('dropped', 'hidden');
    });
    
    // Reset mobile
    const letterBoxes = document.querySelectorAll('.letter-box');
    const selects = document.querySelectorAll('.loto-select');
    
    letterBoxes.forEach((box, index) => {
      box.textContent = '_';
      box.classList.remove('correct', 'incorrect');
    });
    
    selects.forEach(select => {
      select.value = '';
      select.disabled = false;
      select.classList.remove('correct', 'incorrect');
    });
    
    updateAvailableOptions();
    
    // Reset UI
    resultDiv.classList.add('hidden');
    resultDiv.textContent = '';
    validateBtn.disabled = false;
  }
  
  // Event listeners
  validateBtn.addEventListener('click', validateOrder);
  resetBtn.addEventListener('click', resetActivity);
  
  // Manejar drop fuera de zonas válidas
  document.addEventListener('dragover', (e) => {
    if (!e.target.closest('.loto-drop-zone')) {
      e.preventDefault();
    }
  });
  
  document.addEventListener('drop', (e) => {
    if (!e.target.closest('.loto-drop-zone')) {
      e.preventDefault();
      // Restaurar imagen si se suelta fuera de zona válida
      const elementSrc = e.dataTransfer.getData('element-id');
      const originalElement = document.querySelector(`.loto-draggable-items [src="${elementSrc}"]`);
      if (originalElement && !droppedItems.has(elementSrc)) {
        originalElement.classList.remove('hidden');
      }
    }
  });
  
  // Inicializar funcionalidades
  initDesktopDragDrop();
  initMobileSelects();
}