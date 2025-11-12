export function init() {
  loadIframe({
    id: "Slide11Web",
    src: "https://iframe.mediadelivery.net/embed/393414/d0989841-862e-44cc-a98e-f8c6600eb14b?autoplay=false&loop=false&muted=false&preload=true&responsive=true",
    className: "iframe-video-vertical-web",
    style: "width: 20vw; height: 70vh; min-height: 300px;"
  });

  loadIframe({
    id: "Slide11Mobile",
    src: "https://iframe.mediadelivery.net/embed/393414/d0989841-862e-44cc-a98e-f8c6600eb14b?autoplay=false&loop=false&muted=false&preload=true&responsive=true",
    className: "iframe-video-vertical-mobil",
    style: "width: 20vw; height: 70vh; min-height: 300px;"
  });

   loadIframe({
    id: "Slide11WebActivity",
    src: "https://app.lumi.education/api/v1/run/UYy73D/embed",
    className: "iframe-actividad-lumi"
  });

  const responsabilidades = [
    { text: "Observar las medidas de prevención para el control de los factores de riesgo psicosocial, colaborar para contar con un entorno organizacional favorable y prevenir actos de violencia laboral.", category: "colaboradores", icon: "fas fa-eye" },
    { text: "Abstenerse de realizar prácticas contrarias al entorno organizacional favorable y actos de violencia laboral.", category: "colaboradores", icon: "fas fa-ban" },
    { text: "Participar en la identificación de los factores de riesgo psicosocial y entorno organizacional.", category: "colaboradores", icon: "fas fa-users" },
    { text: "Establecer por escrito y difundir en el centro de trabajo la política de prevención de riesgos psicosociales.", category: "patron", icon: "fas fa-file-alt" },
    { text: "Identificar y analizar los factores de riesgo psicosocial y evaluar el entorno organizacional.", category: "patron", icon: "fas fa-search" },
    { text: "Adoptar las medidas para prevenir y/o mitigar los factores de riesgo, promover un entorno organizacional favorable y atender las prácticas opuestas al entorno favorable y los actos de violencia laboral.", category: "patron", icon: "fas fa-shield-alt" }
  ];

  let currentIndex = 0;
  let correctAnswers = 0;
  const draggableText = document.getElementById('draggableText');
  const colaboradoresBtn = document.getElementById('colaboradoresBtn');
  const patronBtn = document.getElementById('patronBtn');
  const feedback = document.getElementById('feedback');
  const progress = document.getElementById('progress');
  const correctCount = document.getElementById('correctCount');
  const resetBtn = document.getElementById('resetBtn');

  function showNextText() {
    if (currentIndex < responsabilidades.length) {
      const current = responsabilidades[currentIndex];
      
      // Solo aplicar animación de entrada en el primer elemento
      if (currentIndex === 0) {
        draggableText.classList.add('first-load');
      } else {
        draggableText.classList.remove('first-load');
      }
      
      draggableText.innerHTML = `<i class="${current.icon} me-2"></i>${current.text}`;
      draggableText.style.display = 'block';
      
      if (colaboradoresBtn) {
        colaboradoresBtn.disabled = false;
        patronBtn.disabled = false;
      }
    } else {
      draggableText.style.display = 'none';
      if (colaboradoresBtn) {
        colaboradoresBtn.disabled = true;
        patronBtn.disabled = true;
      }
      showFinalMessage();
    }
    updateProgress();
  }

  function updateProgress() {
    if (currentIndex < responsabilidades.length) {
      progress.textContent = `${currentIndex + 1}/6`;
    } else {
      progress.textContent = `6/6`;
    }
    correctCount.textContent = correctAnswers;
  }

  function showFeedback(isCorrect) {
    feedback.className = `alert ${isCorrect ? 'alert-success' : 'alert-danger'} mb-3`;
    feedback.textContent = isCorrect ? '¡Correcto!' : 'Incorrecto.';
    feedback.classList.remove('d-none');
    setTimeout(() => feedback.classList.add('d-none'), 2000);
  }

  function showFinalMessage() {
    feedback.className = 'alert alert-info mb-3';
    feedback.textContent = `Actividad completada. Resultado: ${correctAnswers}/${responsabilidades.length} correctas`;
    feedback.classList.remove('d-none');
  }

  function addToDroppedItems(item, category, isCorrect) {
    const container = document.getElementById(`${category}-items`);
    const itemDiv = document.createElement('div');
    itemDiv.className = `dropped-item p-2 mb-2 rounded ${isCorrect ? 'bg-success text-white' : 'bg-danger text-white'}`;
    itemDiv.innerHTML = `<i class="${item.icon} me-2"></i>${item.text}`;
    container.appendChild(itemDiv);
  }

  function handleAnswer(selectedCategory) {
    const currentItem = responsabilidades[currentIndex];
    const isCorrect = selectedCategory === currentItem.category;
    
    if (isCorrect) {
      correctAnswers++;
    }
    
    showFeedback(isCorrect);
    addToDroppedItems(currentItem, selectedCategory, isCorrect);
    
    if (colaboradoresBtn) {
      colaboradoresBtn.disabled = true;
      patronBtn.disabled = true;
    }
    
    currentIndex++;
    showNextText();
  }

  function resetActivity() {
    currentIndex = 0;
    correctAnswers = 0;
    feedback.classList.add('d-none');
    document.getElementById('colaboradores-items').innerHTML = '';
    document.getElementById('patron-items').innerHTML = '';
    showNextText();
  }

  // Drag and drop events
  draggableText.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', currentIndex);
    draggableText.classList.add('dragging');
  });

  draggableText.addEventListener('dragend', () => {
    draggableText.classList.remove('dragging');
    // Limpiar todos los efectos de hover
    document.querySelectorAll('.drop-area').forEach(area => {
      area.classList.remove('drag-over-colaboradores', 'drag-over-patron');
    });
  });

  document.querySelectorAll('.drop-zone').forEach(zone => {
    const category = zone.getAttribute('data-category');
    const dropArea = zone.querySelector('.drop-area');

    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      // Limpiar otros efectos
      document.querySelectorAll('.drop-area').forEach(area => {
        area.classList.remove('drag-over-colaboradores', 'drag-over-patron');
      });
      // Aplicar efecto específico
      dropArea.classList.add(`drag-over-${category}`);
    });

    zone.addEventListener('dragleave', (e) => {
      // Solo remover si realmente salimos de la zona
      if (!zone.contains(e.relatedTarget)) {
        dropArea.classList.remove(`drag-over-${category}`);
      }
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropArea.classList.remove(`drag-over-${category}`);
      
      const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
      const dropCategory = zone.getAttribute('data-category');
      
      if (draggedIndex === currentIndex) {
        handleAnswer(dropCategory);
      }
    });
  });

  // Event listeners para botones (móvil)
  if (colaboradoresBtn) {
    colaboradoresBtn.addEventListener('click', () => handleAnswer('colaboradores'));
    patronBtn.addEventListener('click', () => handleAnswer('patron'));
  }
  
  resetBtn.addEventListener('click', resetActivity);

  // Inicializar actividad
  showNextText();
}