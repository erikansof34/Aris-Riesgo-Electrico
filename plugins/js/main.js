// Configuración del curso - Momentos simplificados
const momentosCurso = {
  1: '1° Salud Mental',
  2: '2° Nuestras Responsabilidades frente al riesgo psicosocial​',
  3: '3° Protocolos de Atencion y Recomendaciones'
};

// Estado actual del curso
let currentIndex = 0;
let slideActualEnMomento = 1;

const sliders = [
  { router: 'slider1', momento: 1 },
  { router: 'slider10', momento: 1 },
  { router: 'slider2', momento: 1 },
  { router: 'slider3', momento: 1 },
  { router: 'slider4', momento: 1 },
  { router: 'slider5', momento: 1 },
  { router: 'slider6', momento: 1 },
  { router: 'slider7', momento: 1 },
  { router: 'slider8', momento: 1 },
  { router: 'slider9', momento: 1 },
  // { router: 'slider10', momento: 1 },
  { router: 'slider11', momento: 1 },
  { router: 'slider12', momento: 1 },
  { router: 'slider13', momento: 1 },
  { router: 'slider14', momento: 1 },
  { router: 'slider15', momento: 1 },
  { router: 'slider16', momento: 2 },
  { router: 'slider17', momento: 2 },
  { router: 'slider18', momento: 2 },
  { router: 'slider19', momento: 3 },
  { router: 'slider20', momento: 3 },
  { router: 'slider22', momento: 3 },
  { router: 'slider21', momento: 3 },
  { router: 'slider23', momento: 3 },
  { router: 'slider24', momento: 3 }

];

// Configuración de navegación entre páginas
const configuracionNavegacion = {
  paginaAnterior: '../../index.html',  // Página anterior
  paginaSiguiente: '../evaluacion/quiz.html',         // Página siguiente
  mostrarConfirmacion: false                      // Mostrar confirmación antes de navegar
};

function obtenerNombreMomento(momentoId) {
  const nombre = momentosCurso[momentoId]; // versión escritorio
  const nombreMobile = `Sección ${momentoId}`; // versión móvil

  return { nombre, nombreMobile };
}

// Función para obtener el momento actual
function obtenerMomentoActual() {
  if (currentIndex >= 0 && currentIndex < sliders.length) {
    const momentoId = sliders[currentIndex].momento;
    const { nombre, nombreMobile } = obtenerNombreMomento(momentoId);

    // Calcular slide actual en el momento
    const indexEnMomento = sliders
      .slice(0, currentIndex + 1)
      .filter(s => s.momento === momentoId).length;
    slideActualEnMomento = indexEnMomento;

    return { id: momentoId, nombre, nombreMobile };
  }
  return {
    id: 1,
    ...obtenerNombreMomento(1)
  };
}

// Función para detectar cambio de momento
function detectarCambioMomento(indexAnterior, indexActual) {
  const momentoAnterior = obtenerMomentoEnIndex(indexAnterior);
  const momentoActual = obtenerMomentoEnIndex(indexActual);

  return momentoAnterior && momentoActual && momentoAnterior.id !== momentoActual.id;
}

// Función auxiliar para obtener momento en un índice específico
function obtenerMomentoEnIndex(index) {
  if (index >= 0 && index < sliders.length) {
    const momentoId = sliders[index].momento;
    const nombreMomento = momentosCurso[momentoId];
    return { id: momentoId, nombre: nombreMomento };
  }
  return null;
}


// Función para calcular el progreso total del curso
function calcularProgresoTotal() {
  const progreso = JSON.parse(localStorage.getItem('cursoProgreso') || '{}');
  let slidesCompletados = 0;

  // Calcular total de slides del curso
  const totalSlides = sliders.length;

  // Contar slides completados por momento
  for (const momentoId in momentosCurso) {
    const slidesDelMomento = sliders.filter(s => s.momento == momentoId).length;
    const slideAlcanzado = progreso[momentoId] || 0;
    slidesCompletados += Math.min(slideAlcanzado, slidesDelMomento);
  }

  // Calcular porcentaje
  return Math.round((slidesCompletados / totalSlides) * 100);
}

// Función para actualizar la interfaz de progreso
function actualizarInterfazProgreso(slideActual) {
  const momentoActual = obtenerMomentoActual();
  if (!momentoActual) return;

  const slideNumero = slideActual || (currentIndex + 1);

  // Actualizar contadores
  updateElement('textProg', slideNumero);
  updateElement('nSlider', sliders.length);

  // Guardar progreso
  guardarProgreso(momentoActual.id, slideActualEnMomento);

  // Calcular y actualizar progreso total
  const progresoTotal = calcularProgresoTotal();
  updateElement('porcentajeProgreso', progresoTotal);

  // Actualizar barra de progreso
  const progBar = document.querySelector(".progBar > div");
  if (progBar) progBar.style.width = progresoTotal + "%";

  // Actualizar círculos y breadcrumb
  actualizarCirculosProgreso();
  actualizarDropdownSliderMenuActivo();
  actualizarBreadcrumb(momentoActual.nombre, momentoActual.nombreMobile);
}

// Función auxiliar para actualizar elementos
function updateElement(id, content) {
  const element = document.getElementById(id);
  if (element) element.textContent = content;
}

// Función para actualizar el breadcrumb
function actualizarBreadcrumb(nombre, nombreMobile) {
  const breadcrumb = document.getElementById('breadcrumb');
  const breadcrumbMovil = document.getElementById('breadcrumb_movil');

  if (breadcrumb) {
    breadcrumb.textContent = nombre;
  }
  if (breadcrumbMovil) {
    breadcrumbMovil.textContent = nombreMobile;
  }
}

// Función para guardar progreso en localStorage
function guardarProgreso(momentoId, slide) {
  const progreso = JSON.parse(localStorage.getItem('cursoProgreso') || '{}');

  // Actualizar el progreso del momento actual
  progreso[momentoId] = Math.max(progreso[momentoId] || 0, slide);
  progreso.currentIndex = currentIndex;
  // Guardar el índice máximo alcanzado para restricciones de navegación
  progreso.maxIndexAlcanzado = Math.max(progreso.maxIndexAlcanzado || 0, currentIndex);
  progreso.timestamp = new Date().toISOString();

  localStorage.setItem('cursoProgreso', JSON.stringify(progreso));
}

// Función para verificar si el usuario puede acceder a un slide específico
function puedeAccederASlide(targetIndex) {
  const progreso = JSON.parse(localStorage.getItem('cursoProgreso') || '{}');
  const maxIndexAlcanzado = progreso.maxIndexAlcanzado || 0;
  
  // Puede acceder a cualquier slide hasta el máximo alcanzado
  return targetIndex <= maxIndexAlcanzado;
}

// Función para cargar progreso guardado
function cargarProgresoGuardado() {
  try {
    const progreso = JSON.parse(localStorage.getItem('cursoProgreso') || '{}');
    currentIndex = Math.min(progreso.currentIndex || 0, sliders.length - 1);
    // Asegurar que maxIndexAlcanzado esté inicializado
    if (!progreso.maxIndexAlcanzado && progreso.maxIndexAlcanzado !== 0) {
      progreso.maxIndexAlcanzado = currentIndex;
      localStorage.setItem('cursoProgreso', JSON.stringify(progreso));
    }
    return currentIndex > 0;
  } catch (error) {
    currentIndex = 0;
    return false;
  }
}

async function loadSlider(index) {
  const slider = sliders[index];
  const router = slider.router;
  const container = document.getElementById('slider-container');
  container.innerHTML = '';

  try {
    // Limpiar CSS y JS anteriores
    limpiarRecursosAnteriores();

    const html = await fetch(`../../module/leccion/${router}/index.html`).then(res => res.text());
    container.innerHTML = html;

    // Cargar nuevo CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = `../../module/leccion/${router}/slider.css`;
    cssLink.setAttribute('data-slider-css', router); // Marcador para identificación
    document.head.appendChild(cssLink);

    // Cargar nuevo JS con timestamp para evitar cache
    const timestamp = Date.now();
    const module = await import(`../../module/leccion/${router}/slider.js?v=${timestamp}`);
    module.init?.();

    window.initTranscripciones?.(document.getElementById('slider-container'));

    // Actualizar interfaz de progreso después de cargar el slider
    actualizarInterfazProgreso();
    actualizarPosicionNavegacion();

  } catch (error) {
    container.innerHTML = '<div class="error">Error al cargar el contenido</div>';
  }
}

// Función para limpiar recursos anteriores
function limpiarRecursosAnteriores() {
  // Eliminar CSS anteriores de sliders
  const cssAnteriores = document.querySelectorAll('link[data-slider-css]');
  cssAnteriores.forEach(link => {
    link.remove();
  });

  // Cerrar cualquier modal abierto
  const modalActivo = document.querySelector('.modal-common');
  if (modalActivo) {
    modalActivo.remove();
    // Restaurar navegación
    const navContainer = document.querySelector('.btn-navigation-container-2');
    if (navContainer) {
      navContainer.style.display = 'flex';
    }
    document.body.classList.remove('modal-active');
  }

  // Limpiar atributos de inicialización de modales
  document.querySelectorAll('[data-modal-initialized]').forEach(element => {
    element.removeAttribute('data-modal-initialized');
  });

  // Limpiar módulos JS del cache (para navegadores que lo soporten)
  if ('serviceWorker' in navigator) {
    // Los módulos ES6 se cachean automáticamente, el timestamp ayuda
  }

  // Pausar cualquier elemento multimedia activo
  pausarElementosMultimedia();

  // Limpiar cualquier interval o timeout que pueda estar corriendo
  limpiarTimersActivos();
}

// Función para limpiar timers activos
function limpiarTimersActivos() {
  // Si hay algún timer global, lo limpiamos aquí
  // Esto dependerá de cómo estén implementados los sliders individuales

  // Ejemplo de limpieza de timers comunes:
  const highestTimeoutId = setTimeout(() => { }, 0);
  for (let i = 0; i < highestTimeoutId; i++) {
    clearTimeout(i);
  }

  const highestIntervalId = setInterval(() => { }, 9999);
  for (let i = 0; i < highestIntervalId; i++) {
    clearInterval(i);
  }
}

window.prevSlide = () => {
  if (currentIndex > 0) {
    const indexAnterior = currentIndex;
    currentIndex--;

    // Detectar cambio de momento
    detectarCambioMomento(indexAnterior, currentIndex);

    loadSlider(currentIndex);
  } else {
    // Estamos en el primer slide, ir a página anterior
    navegarAPaginaAnterior();
  }
};

window.nextSlide = () => {
  if (currentIndex < sliders.length - 1) {
    const indexAnterior = currentIndex;
    currentIndex++;

    // Detectar cambio de momento
    detectarCambioMomento(indexAnterior, currentIndex);

    loadSlider(currentIndex);
  } else {
    // Estamos en el último slide, ir a página siguiente
    navegarAPaginaSiguiente();
  }
};

// Función auxiliar para verificar si el slide actual es de sección 1, 2 o 3
function isDisabledEvaluationSection(index) {
  if (index < 0 || index >= sliders.length) return false;
  
  const slider = sliders[index];
  const momento = slider.momento;
  
  // Secciones 1, 2 y 3 corresponden a momentos 1, 2 y 3
  return momento === 1 || momento === 2 || momento === 3;
}

// Función para pausar elementos multimedia
function pausarElementosMultimedia() {
  document.querySelectorAll('audio, video').forEach(element => {
    if (!element.paused) element.pause();
  });
}

// Función para ir al inicio (botón home) y navegación por círculos
window.progCircle = (slideNumber, plataforma = 0) => {
  pausarElementosMultimedia();
  const targetIndex = slideNumber - 1;
  
  // Verificar si el usuario puede acceder a este slide
  if (!puedeAccederASlide(targetIndex)) {
    return; // No permitir navegación
  }
  
  if (targetIndex >= 0 && targetIndex < sliders.length) {
    currentIndex = targetIndex;
    loadSlider(currentIndex);
    actualizarCirculosProgreso();
    actualizarDropdownSliderMenuActivo();
  }
};

// Función para generar círculos de progreso
function createProgCircle() {
  const contCircleBar = document.querySelector('.contCircleBar');
  const contCircleBarMovil = document.querySelector('.contCircleBarMovil');

  // Limpiar contenedores
  if (contCircleBar) contCircleBar.innerHTML = '';
  if (contCircleBarMovil) contCircleBarMovil.innerHTML = '';

  for (let i = 1; i <= sliders.length; i++) {
    // Crear círculo para desktop
    if (contCircleBar) {
      const span = document.createElement('span');
      span.style.cursor = 'pointer';
      span.addEventListener('click', () => progCircle(i, 0));
      if (i === 1) span.classList.add('current');
      contCircleBar.appendChild(span);
    }

    // Crear círculo para móvil
    if (contCircleBarMovil) {
      const spanMovil = document.createElement('span');
      spanMovil.style.cursor = 'pointer';
      spanMovil.addEventListener('click', () => progCircle(i, 1));
      if (i === 1) spanMovil.classList.add('current');
      contCircleBarMovil.appendChild(spanMovil);
    }
  }
}

// Función para actualizar círculos de progreso
function actualizarCirculosProgreso() {
  const slideNumber = currentIndex + 1;
  const allCircles = document.querySelectorAll('.contCircleBar span, .contCircleBarMovil span');

  allCircles.forEach((span, index) => {
    span.classList.remove('current', 'current2');
    const circleNumber = index < sliders.length ? index + 1 : (index - sliders.length) + 1;
    const targetIndex = circleNumber - 1;

    // Actualizar accesibilidad dinámicamente
    if (puedeAccederASlide(targetIndex)) {
      span.style.cursor = 'pointer';
      span.style.opacity = '1';
    } else {
      span.style.cursor = 'not-allowed';
      span.style.opacity = '0.5';
    }

    if (circleNumber < slideNumber) {
      span.classList.add('current2');
    } else if (circleNumber === slideNumber) {
      span.classList.add('current');
    }
  });
}

function actualizarDropdownSliderMenuActivo() {
  const slideNumber = currentIndex + 1;
  const dots = document.querySelectorAll('#dropdownSliderMenu .dropdown-oval-dot');
  const listItems = document.querySelectorAll('#dropdownSliderMenu li');

  dots.forEach((dot, index) => {
    dot.classList.remove('current', 'current2', 'active');
    const li = listItems[index];
    
    // Actualizar accesibilidad dinámicamente
    if (puedeAccederASlide(index)) {
      if (li) {
        li.style.cursor = 'pointer';
        li.onclick = () => {
          document.getElementById('dropdownSliderMenu').style.display = 'none';
          progCircle(index + 1, 1);
        };
      }
      dot.style.opacity = '1';
    } else {
      if (li) {
        li.style.cursor = 'not-allowed';
        li.onclick = null;
      }
      dot.style.opacity = '0.5';
    }

    const circleNumber = index < sliders.length ? index + 1 : (index - sliders.length) + 1;

    if (circleNumber < slideNumber) {
      dot.classList.add('current2');
    } else if (circleNumber === slideNumber) {
      dot.classList.add('active');
    }
  });
}

// Dropdown para sliders en móvil
function crearDropdownSliderMovil() {
  const dropdown = document.getElementById('dropdownSliderMenu');
  if (!dropdown) return;

  // Limpiar menú
  dropdown.innerHTML = '';
  // Crear lista de sliders
  const ul = document.createElement('ul');
  ul.className = 'list-group d-flex flex-row flex-wrap justify-content-start px-2 py-2';
  sliders.forEach((slider, idx) => {
    const li = document.createElement('li');
    li.className = 'list-group-item border-0 bg-transparent p-0 m-0';
    li.style.cursor = 'pointer';
    
    // Punto ovalado
    const punto = document.createElement('span');
    punto.className = 'dropdown-oval-dot';
    if (idx === currentIndex) punto.classList.add('active');
    
    li.appendChild(punto);
    ul.appendChild(li);
  });
  dropdown.appendChild(ul);
}

// Llama a la función después de inicializar la app
function initializeApp() {
  // Asignar evento al gripBtn SOLO UNA VEZ
  const gripBtn = document.getElementById('dropdownGripBtn');
  const dropdown = document.getElementById('dropdownSliderMenu');
  if (gripBtn && dropdown) {
    gripBtn.onclick = (e) => {
      e.stopPropagation();
      crearDropdownSliderMovil();
      actualizarDropdownSliderMenuActivo();
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    };
    // Ocultar menú al hacer click fuera
    document.addEventListener('click', function hideDropdown(e) {
      if (!dropdown.contains(e.target) && e.target !== gripBtn) {
        dropdown.style.display = 'none';
      }
    });
  }

  createProgCircle();
  cargarProgresoGuardado();
  loadSlider(currentIndex);
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Función para navegar a página anterior
function navegarAPaginaAnterior() {
  if (configuracionNavegacion.mostrarConfirmacion) {
    const confirmar = confirm('Has llegado al inicio del contenido. ¿Deseas ir a la página anterior?');
    if (confirmar) {
      window.location.href = configuracionNavegacion.paginaAnterior;
    }
  } else {
    window.location.href = configuracionNavegacion.paginaAnterior;
  }
}

// Función para navegar a página siguiente
function navegarAPaginaSiguiente() {
  if (configuracionNavegacion.mostrarConfirmacion) {
    const confirmar = confirm('¡Has completado todo el contenido! ¿Deseas continuar a la siguiente sección?');
    if (confirmar) {
      window.location.href = configuracionNavegacion.paginaSiguiente;
    }
  } else {
    window.location.href = configuracionNavegacion.paginaSiguiente;
  }
}

function loadIframe({ id, src, srcMobile, className = '', style = '', styleMobile = '' }) {
  const container = document.getElementById(id);
  if (!container) return;

  const isMobile = window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const finalSrc = isMobile && srcMobile ? srcMobile : src;
  const finalStyle = isMobile && styleMobile ? styleMobile : style;

  const loader = container.querySelector(".loader");
  const existingIframe = container.querySelector("iframe");

  if (loader) loader.style.display = "block";

  function adjustIframeHeight(iframe) {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      if (iframeDoc) {
        const contentHeight = iframeDoc.documentElement.scrollHeight;
        const minHeight = 350;
        const maxHeight = 680;
        const finalHeight = Math.max(minHeight, Math.min(contentHeight, maxHeight));
        iframe.style.height = finalHeight + 'px';
      }
    } catch (e) {
      iframe.style.height = '600px auto';
    }
  }

  if (existingIframe) {
    existingIframe.style.opacity = "0";
    existingIframe.src = finalSrc;
    existingIframe.addEventListener("load", function () {
      if (loader) loader.style.display = "none";
      existingIframe.style.opacity = "1";
      setTimeout(() => adjustIframeHeight(existingIframe), 500);
    }, { once: true });
  } else {
    const iframe = document.createElement("iframe");
    iframe.src = finalSrc;
    iframe.className = className;
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowfullscreen", "allowfullscreen");
    iframe.setAttribute("allow", "geolocation *; microphone *; camera *; midi *; encrypted-media *");
    iframe.setAttribute("scrolling", "no");
    iframe.loading = "lazy";
    iframe.style = `opacity: 0; transition: opacity 0.5s; min-width: 300px; ${finalStyle}`;
    iframe.addEventListener("load", function () {
      if (loader) loader.style.display = "none";
      iframe.style.opacity = "1";
      setTimeout(() => adjustIframeHeight(iframe), 500);
    });
    container.appendChild(iframe);
  }
}

// ========================= SISTEMA DE MODALES DINÁMICOS =========================

/**
 * Detecta si el dispositivo es móvil basado en el ancho de pantalla y user agent
 * @returns {boolean} true si es dispositivo móvil
 */
function isMobile() {
  return (
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
}

/**
 * Crea el elemento modal dinámicamente (función interna)
 * @param {string} slideId - ID del slide
 * @param {Object} config - Configuración del modal
 * @returns {HTMLElement|null} El modal creado o null si hay error
 */
function createModal(slideId, config) {
  const modalContainer = document.getElementById(
    `modalContainer${slideId.charAt(0).toUpperCase() + slideId.slice(1)}`
  );

  if (!modalContainer) {
    return null;
  }

  const modal = document.createElement("div");
  modal.className = `modal-common modal-${config.modalSize}`;

  modal.innerHTML = `
        <div class="modal-content-common">
            <div class="modal-content-header sf-bg-dark">
                <div class="modal-title">
                    <h2 class="sf-text-white"></h2>
                </div>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="loader spinner-pulse"></div>
                <div class="iframe-container"></div>
            </div>
        </div>
    `;

  modalContainer.appendChild(modal);
  return modal;
}

/**
 * Abre un modal configurado previamente (función interna)
 * @param {string} slideId - ID del slide
 * @param {Object} config - Configuración del modal
 */
function openModal(slideId, config) {
  // Ocultar navegación inmediatamente
  const navContainer = document.querySelector('.btn-navigation-container-2');
  if (navContainer) {
    navContainer.style.display = 'none';
  }

  // Agregar clase al body
  document.body.classList.add('modal-active');

  const modal = createModal(slideId, config);
  if (!modal) return;

  const title = modal.querySelector(".modal-title h2");
  const loader = modal.querySelector(".loader");
  const iframeContainer = modal.querySelector(".iframe-container");
  const closeBtn = modal.querySelector(".close");

  // Configurar título según dispositivo
  title.textContent = isMobile() && config.titleMobile ? config.titleMobile : config.title;

  // Mostrar loader
  loader.classList.remove('hidden');

  // Crear iframe
  const iframe = document.createElement("iframe");
  iframe.style.width = "100%";
  iframe.style.height = isMobile() ? config.mobileHeight : config.desktopHeight;
  iframe.style.border = "none";
  iframe.style.opacity = "0";
  iframe.style.transition = "opacity 0.3s";
  iframe.setAttribute("allowfullscreen", "true");
  iframe.setAttribute("scrolling", "no");
  iframe.setAttribute("frameborder", "0");

  // Variable para controlar el estado del loader
  let loaderHidden = false;

  // Función para ocultar loader (solo una vez)
  const hideLoader = () => {
    if (!loaderHidden) {
      loaderHidden = true;
      loader.classList.add('hidden');
      iframe.style.opacity = "1";
    }
  };

  // Agregar iframe al contenedor PRIMERO
  iframeContainer.appendChild(iframe);

  // DESPUÉS configurar el evento load y el src
  iframe.addEventListener("load", function () {
    hideLoader();
  });

  // También escuchar cuando el iframe esté completamente listo
  iframe.addEventListener("DOMContentLoaded", function () {
    hideLoader();
  });

  // Delay de 8 segundos antes de empezar a cargar el iframe
  setTimeout(() => {
    // Configurar src después del delay para que se dispare el load
    iframe.src = isMobile() ? config.mobileSrc : config.desktopSrc;
  }, 3000); // Delay de 8 segundos

  // Timeout de seguridad (pero que no interfiera con el evento load normal)
  setTimeout(() => {
    if (!loaderHidden) {
      loaderHidden = true;
      loader.classList.add('hidden');
      // Solo mostrar mensaje de error si realmente no se cargó
      if (iframe.style.opacity === "0") {
        iframeContainer.innerHTML = "<p>El contenido está tardando demasiado en cargar...</p>";
      }
    }
  }, 23000); // Aumentado a 23 segundos (8 segundos de delay + 15 segundos de timeout)

  // Función de cierre mejorada
  const customCloseModal = () => {
    closeModal(modal);
    // Mostrar navegación al cerrar
    if (navContainer) {
      navContainer.style.display = 'flex';
    }
    // Remover clase del body
    document.body.classList.remove('modal-active');
  };

  // Eventos de cierre (sin duplicados)
  closeBtn.addEventListener("click", customCloseModal, { once: true });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) customCloseModal();
  }, { once: true });

  // Animación de entrada
  modal.classList.add("fade-in");
}

/**
 * Cierra un modal con animación (función interna)
 * @param {HTMLElement} modal - El elemento modal a cerrar
 */
function closeModal(modal) {
  modal.classList.remove("fade-in");
  modal.classList.add("fade-out");
  setTimeout(() => {
    modal.remove();
  }, 300);
}

// Función similar a loadIframe pero para modales
/**
 * Función principal para crear modales dinámicos con iframes
 * Se usa en los sliders para cargar actividades interactivas
 * Ejemplo de uso:
 * loadModalIframe({
 *   id: "Slide25WebActivity",
 *   src: "../../actividades/actividad_dragandrop_ordenar_nom035/index.html",
 *   title: "Protocolo de Atención ATS",
 *   titleMobile: "Protocolo ATS",
 *   mobileHeight: '69vh',
 *   desktopHeight: '76vh',
 *   modalSize: 'large'
 * });
 */
function loadModalIframe({ id, src, title, titleMobile, mobileHeight = '69vh', desktopHeight = '76vh', modalSize = 'large', buttonId, mobileSrc, desktopSrc }) {
  // Usar src para ambos si no se especifican mobileSrc/desktopSrc
  const finalMobileSrc = mobileSrc || src;
  const finalDesktopSrc = desktopSrc || src;
  const finalTitle = title || 'Actividad Interactiva';
  const finalButtonId = buttonId || `modalButton_${id}`;

  // Configuración del modal (local, no global)
  const config = {
    buttonId: finalButtonId,
    title: finalTitle,
    titleMobile: titleMobile || finalTitle,
    mobileSrc: finalMobileSrc,
    desktopSrc: finalDesktopSrc,
    mobileHeight,
    desktopHeight,
    modalSize
  };

  // Buscar el contenedor donde debería estar el botón
  const container = document.getElementById(id);
  if (!container) {
    return;
  }

  // Crear botón si no existe
  let button = document.getElementById(finalButtonId);
  if (!button) {
    button = document.createElement('button');
    button.id = finalButtonId;
    button.className = 'btn btn-primary btn-lg sf-btn-primary';
    button.innerHTML = `<i class="fas fa-play-circle me-2"></i>${finalTitle}`;

    // Limpiar contenedor y agregar botón
    container.innerHTML = '';
    container.appendChild(button);

    // Crear contenedor del modal
    const modalContainer = document.createElement('div');
    modalContainer.id = `modalContainer${id.charAt(0).toUpperCase() + id.slice(1)}`;
    container.appendChild(modalContainer);
  }

  // Asignar evento al botón solo si no lo tiene ya
  if (!button.hasAttribute('data-modal-initialized')) {
    button.addEventListener("click", () => openModal(id, config));
    button.setAttribute('data-modal-initialized', 'true');
    console.log(`🎯 Modal ${id} configurado con loadModalIframe`);
  } else {
    console.log(`⚠️ Modal ${id} ya estaba inicializado`);
  }
}

// Exportar función principal globalmente para uso en sliders
window.loadModalIframe = loadModalIframe;

function actualizarPosicionNavegacion() {
  // Solo ejecutar en pantallas menores a 992px de ancho

  const nav = document.querySelector('.btn-navigation-container');
  const divider = document.querySelector('.dividerImg');
  const btnAbajo = document.getElementById('btnParallaxMobile');
  const header = document.querySelector('.contentHeader');
  if (header) header.classList.remove('sf-bg-transparent');
  if (!nav) return;

  if (!divider) {
    // Si no existe dividerImg, quita la clase
    nav.classList.remove('btn-navigation-fixed-bottom');
    header.classList.remove('sf-bg-transparent');
    btnAbajo.classList.remove('ocultar');
    return;
  }

  setTimeout(() => {
    btnAbajo.classList.add('ocultar');
  }, 7);

  const rect = divider.getBoundingClientRect();
  const visible = rect.top < window.innerHeight && rect.bottom > 0;

  if (visible) {
    nav.classList.add('btn-navigation-fixed-bottom');
    header.classList.add('sf-bg-transparent');
    console.log("🎯 Header y navegación actualizados");
  } else {
    nav.classList.remove('btn-navigation-fixed-bottom');
    header.classList.remove('sf-bg-transparent');
    console.log("🎯 Header y navegación actualizado s");
  }
  if (window.innerWidth >= 992) {
    const nav = document.querySelector('.btn-navigation-container');
    if (nav) nav.classList.remove('btn-navigation-fixed-bottom');
    return;
  }
}

// Ejecuta al hacer scroll, resize y cuando se cargue el contenido dinámico
window.addEventListener('scroll', actualizarPosicionNavegacion);
window.addEventListener('resize', actualizarPosicionNavegacion);
document.addEventListener('DOMContentLoaded', actualizarPosicionNavegacion);

// === CONTROL DINÁMICO DE VISIBILIDAD DEL BOTÓN FINAL ===
function sliderActualTieneScroll() {
  const container = document.getElementById('slider-container');
  if (!container) return false;
  // Si el contenido del slider es más alto que el área visible, hay scroll
  return container.scrollHeight > container.clientHeight;
}

function controlarVisibilidadBotonesNavegacion() {
  const btnPrev = document.getElementById('pagIndex');
  const btnNext = document.getElementById('next');

  const btnAbajo = document.getElementById('btnParallaxMobile');

  const container = document.getElementById('slider-container');
  if (!btnPrev || !btnNext || !container || !btnAbajo) return;

  if (!sliderActualTieneScroll()) {
    btnPrev.classList.remove('ocultar');
    btnNext.classList.remove('ocultar');
    btnAbajo.classList.remove('ocultar');
    return;
  }

  // Si hay scroll, mostrar solo al llegar al final del slider-container
  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 2) {
    btnPrev.classList.remove('ocultar');
    btnNext.classList.remove('ocultar');
    btnAbajo.classList.add('ocultar');
  } else {
    btnPrev.classList.add('ocultar');
    btnNext.classList.add('ocultar');
    btnAbajo.classList.remove('ocultar');
  }
}

function actualizarBotonesNavegacion() {
  controlarVisibilidadBotonesNavegacion();

  const container = document.getElementById('slider-container');
  // Scroll en contenedor (escritorio)
  if (container) {
    container.removeEventListener('scroll', controlarVisibilidadBotonesNavegacion);
    container.addEventListener('scroll', controlarVisibilidadBotonesNavegacion);
  }
  // Scroll global (móvil)
  window.removeEventListener('scroll', controlarVisibilidadHaciaAbajo);
  window.addEventListener('scroll', controlarVisibilidadHaciaAbajo);

  // También actualizar al cambiar el tamaño de la ventana
  window.removeEventListener('resize', controlarVisibilidadBotonesNavegacion);
  window.addEventListener('resize', controlarVisibilidadBotonesNavegacion);
}

const originalLoadSlider = loadSlider;
window.loadSlider = async function (index) {
  await originalLoadSlider(index);
  const btnPrev = document.getElementById('pagIndex');
  const btnNext = document.getElementById('next');
  if (btnPrev) btnPrev.classList.add('ocultar');
  if (btnNext) btnNext.classList.add('ocultar');
  setTimeout(actualizarBotonesNavegacion, 5);
};

// boton hacia abajo 
function controlarVisibilidadHaciaAbajo() {
  const btnAbajo = document.getElementById('btnParallaxMobile');
  if (!btnAbajo) return;

  let scrollTop = document.documentElement.scrollTop;
  let clientHeight = window.innerHeight;
  let scrollHeight = document.documentElement.scrollHeight;

  // Distancia al final
  let distanciaFinal = scrollHeight - (scrollTop + clientHeight);

  // No hay scroll (contenido <= alto de la ventana)
  const sinScroll = scrollHeight <= clientHeight;

  // Ocultar si:
  // - No hay scroll
  // - O está al final
  // - O está a menos de 50px del final
  if (sinScroll || distanciaFinal <= 30) {
    btnAbajo.classList.add('ocultar');
  } else {
    btnAbajo.classList.remove('ocultar');
  }
}

document.getElementById('btnParallaxMobile')?.addEventListener('click', function () {
  const section = document.querySelector('section');
  if (!section) return;
  const btnAbajo = document.getElementById('btnParallaxMobile');
  if (!btnAbajo) return;


  // Busca todos los divs con clase que contiene "col-" dentro del section
  const divsCol = Array.from(section.querySelectorAll('div[class*="col-"]'));

  // Encuentra el primer div "col-" que está más abajo del viewport
  const nextDiv = divsCol.find(div => {
    const rect = div.getBoundingClientRect();
    return rect.top > 10;
  });

  if (nextDiv) {
    const rect = nextDiv.getBoundingClientRect();

    // Condicional para cuando está muy cerca (menos de 50px)
    if (rect.top <= 30) {
      btnAbajo.classList.add('ocultar');
      return;
    }

    // Scroll hasta el siguiente div "col-"
    const top = rect.top + window.scrollY;
    window.scrollTo({
      top: top,
      behavior: 'smooth'
    });
  } else {
    // Si no hay más divs "col-", baja hasta el final de la página
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }
});