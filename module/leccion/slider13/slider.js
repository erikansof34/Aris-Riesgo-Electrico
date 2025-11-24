export function init() {
  // Configuración de las pestañas con sus slides
  const tabsData = {
    bloqueo: {
      currentSlide: 0,
      totalSlides: 4
    },
    candados: {
      currentSlide: 0,
      totalSlides: 5
    },
    etiquetas: {
      currentSlide: 0,
      totalSlides: 2
    }
  };

  let activeTab = 'bloqueo';
  let slideIntervals = {};

  // Inicializar las pestañas
  initTabs();
  
  // Inicializar los sliders para cada pestaña
  initSliders();

  function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // Remover active de todos los botones y panes
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Activar el botón y pane clickeado
        this.classList.add('active');
        document.querySelector(`[data-tab-content="${tabId}"]`).classList.add('active');
        
        // Detener el slider anterior
        if (slideIntervals[activeTab]) {
          clearInterval(slideIntervals[activeTab]);
        }
        
        // Actualizar pestaña activa
        activeTab = tabId;
        
        // Reiniciar el slider de la nueva pestaña
        tabsData[tabId].currentSlide = 0;
        showSlide(tabId, 0);
        startAutoSlide(tabId);
      });
    });
  }

  function initSliders() {
    // Iniciar el slider de la pestaña activa por defecto
    showSlide('bloqueo', 0);
    startAutoSlide('bloqueo');
  }

  function showSlide(tabId, index) {
    const tabPane = document.querySelector(`[data-tab-content="${tabId}"]`);
    if (!tabPane) return;

    const slides = tabPane.querySelectorAll('.swiper-slide-kit');
    const totalSlides = slides.length;

    // Ocultar todos los slides
    slides.forEach(slide => {
      slide.style.display = 'none';
    });

    // Mostrar el slide actual con animación
    if (slides[index]) {
      slides[index].style.display = 'block';
      slides[index].style.opacity = '0';
      
      // Pequeño delay para la animación
      setTimeout(() => {
        slides[index].style.opacity = '1';
      }, 50);
    }

    // Actualizar el índice actual
    tabsData[tabId].currentSlide = index;
  }

  function nextSlide(tabId) {
    const data = tabsData[tabId];
    const nextIndex = (data.currentSlide + 1) % data.totalSlides;
    showSlide(tabId, nextIndex);
  }

  function startAutoSlide(tabId) {
    // Limpiar intervalo previo si existe
    if (slideIntervals[tabId]) {
      clearInterval(slideIntervals[tabId]);
    }

    // Crear nuevo intervalo
    slideIntervals[tabId] = setInterval(() => {
      // Solo avanzar si esta pestaña está activa
      if (activeTab === tabId) {
        nextSlide(tabId);
      }
    }, 3500); // 3.5 segundos como en el componente React
  }

  // Limpiar intervalos cuando se sale de la página
  window.addEventListener('beforeunload', () => {
    Object.keys(slideIntervals).forEach(key => {
      if (slideIntervals[key]) {
        clearInterval(slideIntervals[key]);
      }
    });
  });
}
