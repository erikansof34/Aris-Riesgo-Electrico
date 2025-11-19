export function init() {
  // Datos de la actividad con imágenes
  const letters = [
    { id: "N", letter: "N", image: "letra_n_sld8.webp" },
    { id: "O", letter: "O", image: "letra_o_sld8.webp" },
    { id: "M", letter: "M", image: "letra_m_sld8.webp" },
    { id: "0", letter: "0", image: "num_0_sld8.webp" },
    { id: "3", letter: "3", image: "num_3_sld8.webp" },
    { id: "5", letter: "5", image: "num_5_sld8.webp" }
  ];

  const correctOrder = ["N", "O", "M", "0", "3", "5"];
  const initialOrder = ["M", "0", "5", "O", "N", "3"];

  // Elementos del DOM
  const desktopContainer = document.getElementById('desktopContainer');
  const mobileContainer = document.getElementById('mobileContainer');
  const imagesContainer = mobileContainer.querySelector('.images-container-nom035');
  const wordContainer = mobileContainer.querySelector('.word-container-nom035');
  const selectsContainer = mobileContainer.querySelector('.selects-container-nom035');
  const audioContainer = document.getElementById('audioContainer');
  const audioElement = document.getElementById('nomAudio');
  const validationMessage = document.getElementById('validationMessage');
  const validateBtn = document.getElementById('validateBtn');
  const resetBtn = document.getElementById('resetBtn');

  // Variables de estado
  let currentItems = [];
  let isMobile = false;
  let hasInteraction = false;
  let isValidated = false;
  let selectedPositions = {};
  let draggedItem = null;

  // Inicializar la actividad
  function initActivity() {
    checkIfMobile();
    currentItems = initialOrder.map(id => letters.find(letter => letter.id === id));

    if (isMobile) {
      initMobileActivity();
    } else {
      initDesktopActivity();
    }

    window.addEventListener('resize', handleResize);
  }

  // Verificar si es móvil
  function checkIfMobile() {
    isMobile = window.innerWidth <= 768;
    desktopContainer.style.display = isMobile ? 'none' : 'flex';
    mobileContainer.style.display = isMobile ? 'block' : 'none';
  }

  // Inicializar versión desktop
  function initDesktopActivity() {
    desktopContainer.innerHTML = '';

    currentItems.forEach(item => {
      createDraggableItem(item, desktopContainer);
    });

    setupDragAndDrop();
  }

  // Crear elemento arrastrable
  function createDraggableItem(item, container) {
    const itemElement = document.createElement('div');
    itemElement.className = 'sortable-item-nom035';
    itemElement.dataset.id = item.id;
    itemElement.draggable = true;

    const letterContainer = document.createElement('div');
    letterContainer.className = 'letter-container-nom035';

    const letterImage = document.createElement('img');
    letterImage.className = 'letter-image-nom035';
    letterImage.src = `./slider4/img/${item.image}`;
    letterImage.alt = `Letra ${item.letter}`;

    letterContainer.appendChild(letterImage);
    itemElement.appendChild(letterContainer);

    container.appendChild(itemElement);
  }

  // Configurar drag and drop
  function setupDragAndDrop() {
    const items = desktopContainer.querySelectorAll('.sortable-item-nom035');

    items.forEach(item => {
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragover', handleDragOver);
      item.addEventListener('drop', handleDrop);
      item.addEventListener('dragend', handleDragEnd);
      item.addEventListener('dragleave', handleDragLeave);
    });
  }

  // Eventos de drag and drop
  function handleDragStart(e) {
    draggedItem = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    setTimeout(() => this.classList.add('dragging'), 0);
    hasInteraction = true;
    validateBtn.disabled = false;
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.style.border = '2px dashed #ccc';
  }

  function handleDragLeave() {
    this.style.border = '2px solid #ddd';
  }

  function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();

    const items = desktopContainer.querySelectorAll('.sortable-item-nom035');
    items.forEach(item => {
      item.style.border = '2px solid #ddd';
    });

    if (draggedItem !== this) {
      desktopContainer.insertBefore(draggedItem, this);
      updateCurrentItems();
    }

    return false;
  }

  function handleDragEnd() {
    this.classList.remove('dragging');
    draggedItem = null;

    const items = desktopContainer.querySelectorAll('.sortable-item-nom035');
    items.forEach(item => {
      item.style.border = '2px solid #ddd';
    });
  }

  // Actualizar currentItems
  function updateCurrentItems() {
    const domItems = Array.from(desktopContainer.children)
      .filter(el => el.classList.contains('sortable-item-nom035'));

    currentItems = domItems.map(el => letters.find(l => l.id === el.dataset.id));
  }

  // Inicializar versión móvil
  function initMobileActivity() {
    imagesContainer.innerHTML = '';
    wordContainer.innerHTML = '';
    selectsContainer.innerHTML = '';
    selectedPositions = {};

    // Crear imágenes de letras en 2 filas de 3
    currentItems.forEach((item, index) => {
      const imageItem = document.createElement('div');
      imageItem.className = 'image-item-nom035';

      const letterImage = document.createElement('img');
      letterImage.className = 'letter-image-nom035';
      letterImage.src = `./slider4/img/${item.image}`;
      letterImage.alt = `Letra ${item.letter}`;

      imageItem.appendChild(letterImage);
      imagesContainer.appendChild(imageItem);
    });

    // Crear slots para la palabra en 2 filas de 3
    for (let i = 1; i <= 6; i++) {
      const slot = document.createElement('div');
      slot.className = 'letter-slot-nom035';
      slot.dataset.position = i;
      wordContainer.appendChild(slot);
    }

    // Crear selects en 2 columnas
    currentItems.forEach((item, index) => {
      const selectWrapper = document.createElement('div');
      selectWrapper.className = 'select-wrapper-nom035';

      const label = document.createElement('label');
      label.textContent = `${item.letter}:`;
      selectWrapper.appendChild(label);

      const select = document.createElement('select');
      select.className = 'letter-select-nom035';
      select.dataset.id = item.id;
      select.addEventListener('change', handleSelectChange);

      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Posición...';
      select.appendChild(defaultOption);

      // Agregar opciones de posición disponibles
      for (let pos = 1; pos <= 6; pos++) {
        const option = document.createElement('option');
        option.value = pos;
        option.textContent = pos;
        select.appendChild(option);
      }

      selectWrapper.appendChild(select);
      selectsContainer.appendChild(selectWrapper);
    });
  }

  // Manejar cambio de selección en móvil
  function handleSelectChange(e) {
    const id = this.dataset.id;
    const position = this.value ? parseInt(this.value) : null;

    // Limpiar selecciones previas para esta posición
    Object.keys(selectedPositions).forEach(key => {
      if (selectedPositions[key] === position) {
        delete selectedPositions[key];
        const selectToReset = document.querySelector(`.letter-select-nom035[data-id="${key}"]`);
        if (selectToReset) selectToReset.value = '';
      }
    });

    if (position) {
      selectedPositions[id] = position;
    } else {
      delete selectedPositions[id];
    }

    updateSlotsView();
    hasInteraction = true;
    validateBtn.disabled = Object.keys(selectedPositions).length !== letters.length;
    isValidated = false;
    validationMessage.style.display = 'none';
  }

  // Actualizar vista de slots en móvil
  function updateSlotsView() {
    const slots = wordContainer.querySelectorAll('.letter-slot-nom035');
    slots.forEach(slot => {
      slot.innerHTML = '';
      slot.classList.remove('correct-slot-nom035', 'incorrect-slot-nom035');
    });

    Object.entries(selectedPositions).forEach(([id, position]) => {
      const slot = wordContainer.querySelector(`.letter-slot-nom035[data-position="${position}"]`);
      if (slot) {
        const letter = letters.find(l => l.id === id);
        if (letter) {
          const img = document.createElement('img');
          img.className = 'slot-image-nom035';
          img.src = `./slider4/img/${letter.image}`;
          img.alt = `Letra ${letter.letter}`;
          slot.appendChild(img);
        }
      }
    });
  }

  // Validar la actividad
  function validateActivity() {
    let results = [];
    let correctCount = 0;

    if (isMobile) {
      results = letters.map(letter => {
        const isCorrect = selectedPositions[letter.id] === correctOrder.indexOf(letter.id) + 1;
        if (isCorrect) correctCount++;
        return { id: letter.id, isCorrect };
      });

      // Mostrar resultados en los slots
      results.forEach(result => {
        const position = selectedPositions[result.id];
        if (position) {
          const slot = wordContainer.querySelector(`.letter-slot-nom035[data-position="${position}"]`);
          if (slot) {
            slot.classList.add(result.isCorrect ? 'correct-slot-nom035' : 'incorrect-slot-nom035');

            const icon = document.createElement('div');
            icon.className = 'validation-icon-nom035';

            const img = document.createElement('img');
            img.src = result.isCorrect ? '../../assets/img/checkAct.png' : '../../assets/img/xmarkAct.png';
            img.alt = result.isCorrect ? 'Correcto' : 'Incorrecto';

            icon.appendChild(img);
            slot.appendChild(icon);
          }
        }

        // Deshabilitar selects
        const select = document.querySelector(`.letter-select-nom035[data-id="${result.id}"]`);
        if (select) select.disabled = true;
      });
    } else {
      const currentOrder = Array.from(desktopContainer.children)
        .filter(el => el.classList.contains('sortable-item-nom035'))
        .map(el => letters.find(l => l.id === el.dataset.id).id);

      results = correctOrder.map((id, index) => {
        const isCorrect = currentOrder[index] === id;
        if (isCorrect) correctCount++;
        return { id, isCorrect };
      });

      results.forEach((result, index) => {
        const itemElement = desktopContainer.children[index];
        if (itemElement && itemElement.classList.contains('sortable-item-nom035')) {
          itemElement.classList.add(result.isCorrect ? 'correct-item-nom035' : 'incorrect-item-nom035');

          let icon = itemElement.querySelector('.validation-icon-nom035');
          if (!icon) {
            icon = document.createElement('div');
            icon.className = 'validation-icon-nom035';
            itemElement.appendChild(icon);
          }

          const img = document.createElement('img');
          img.src = result.isCorrect ? '../../assets/img/checkAct.png' : '../../assets/img/xmarkAct.png';
          img.alt = result.isCorrect ? 'Correcto' : 'Incorrecto';

          icon.innerHTML = '';
          icon.appendChild(img);

          itemElement.draggable = false;
        }
      });
    }

    showValidationMessage(correctCount, results.length);

    if (correctCount === results.length) {
      audioContainer.style.display = 'flex';
      audioElement.play().catch(error => {
        console.error("Error al reproducir audio:", error);
      });
    }

    isValidated = true;
    resetBtn.disabled = false;
  }

  // Mostrar mensaje de validación
  function showValidationMessage(correctCount, totalCount) {
    validationMessage.style.display = 'block';

    if (correctCount === totalCount) {
      validationMessage.innerHTML = `
        <p class="validation-text-nom035">
          <strong>¡Correcto! Has formado la frase NOM 035.</strong>
        </p>
        <p class="validation-score-nom035">
          <strong>Tus respuestas correctas son: ${correctCount} de ${totalCount} (${Math.round((correctCount / totalCount) * 100)}%)</strong>
        </p>
      `;
    } else {
      validationMessage.innerHTML = `
        <p class="validation-text-nom035">
          <strong>¡Incorrecto! El orden correcto es N-O-M-0-3-5.</strong>
        </p>
        <p class="validation-score-nom035">
          <strong>Tus respuestas correctas son: ${correctCount} de ${totalCount} (${Math.round((correctCount / totalCount) * 100)}%)</strong>
        </p>
      `;
    }
  }

  // Reiniciar la actividad
  function resetActivity() {
    currentItems = initialOrder.map(id => letters.find(letter => letter.id === id));
    selectedPositions = {};
    isValidated = false;
    hasInteraction = false;

    if (isMobile) {
      initMobileActivity();
    } else {
      desktopContainer.innerHTML = '';
      currentItems.forEach(item => {
        createDraggableItem(item, desktopContainer);
      });
      setupDragAndDrop();
    }

    audioContainer.style.display = 'none';
    validationMessage.style.display = 'none';
    validateBtn.disabled = true;
    resetBtn.disabled = true;
    audioElement.pause();
    audioElement.currentTime = 0;
  }

  // Manejar redimensionamiento
  function handleResize() {
    const wasMobile = isMobile;
    checkIfMobile();

    if (wasMobile !== isMobile) {
      resetActivity();
    }
  }

  // Configurar eventos de los botones
  validateBtn.addEventListener('click', validateActivity);
  resetBtn.addEventListener('click', resetActivity);

  // Iniciar la actividad
  initActivity();
}