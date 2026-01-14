// Configuración del curso - Momentos simplificados
const momentosCurso = {
  1: '1-La Energía en nuestro trabajo',
  2: '2-Principios del bloqueo y etiquetado (LOTO)',
  3: '3-Procedimiento de bloqueo y etiquetado (LOTO)'
};

// Estado actual del curso
let currentIndex = 0;
let slideActualEnMomento = 1;

const sliders = [
  { router: 'slider1', momento: 1 },
  { router: 'slider2', momento: 1 },
  { router: 'slider3', momento: 1 },
  { router: 'slider4-momento', momento: 1 },
  { router: 'slider5', momento: 1 },
  { router: 'slider18', momento: 1 },
  { router: 'slider6', momento: 1 },
  { router: 'slider9', momento: 2 },
  { router: 'slider10', momento: 2 },
  { router: 'slider11', momento: 2 },
  { router: 'slider12', momento: 2 },
  { router: 'slider13', momento: 2 },
  { router: 'slider14', momento: 2 },
  { router: 'slider15', momento: 3 },
  { router: 'slider19', momento: 3 },
  { router: 'slider17a', momento: 3 },
  { router: 'slider17', momento: 3 },
];

// ================== PARÁMETRO GLOBAL DE RESTRICCIONES ==================
const RESTRICCIONES = true;

// ================== ACTIVIDADES REQUERIDAS ==================
const actividadesRequeridas = new Set(['slider6', 'slider12', 'slider14', 'slider17']);

function getEstadoActividades() {
  try {
    return JSON.parse(localStorage.getItem('actividadesCompletadas') || '{}');
  } catch (e) {
    return {};
  }
}

function setActividadCompletada(router) {
  const estado = getEstadoActividades();
  estado[router] = true;
  localStorage.setItem('actividadesCompletadas', JSON.stringify(estado));
}

function actividadPendienteEnRouter(router) {
  if (!actividadesRequeridas.has(router)) return false;
  const estado = getEstadoActividades();
  return !estado[router];
}

function mostrarModalAdvertenciaAvance(mensajePersonalizado) {
  const existing = document.getElementById('modalAdvertenciaAvance');
  if (!existing) {
    const html = `
      <div class="modal fade" id="modalAdvertenciaAvance" tabindex="-1" aria-hidden="true" data-modal-initialized="true">
        <div class="modal-dialog modal-dialog-centered modal-lg-650">
          <div class="modal-content">
            <div class="modal-header sf-bg-primary">
              <h5 class="modal-title sf-text-white">¡Atención!</h5>
            </div>
            <div class="modal-body text-center">
              <img src="../../assets/img/botones/pregunta_icono.webp" alt="alerta" style="width:90px;height:90px;object-fit:contain;" class="mb-3"/>
              <p id="modalAdvertenciaTexto" class="text-justify mb-3">
                Debes completar la actividad de este slide al 100% para poder avanzar. Puedes navegar hacia atrás libremente para revisar contenido previo.
              </p>
              <div class="d-flex justify-content-center gap-3">
                <button type="button" class="btn sf-btn sf-btn-success sf-btn-gray" data-bs-dismiss="modal">
                  <i class="fa fa-times-circle"></i> Entendido
                </button>
                <button type="button" class="btn sf-btn sf-btn-success" id="btnIrAtrasAdvertencia">
                  <i class="fa fa-arrow-left"></i> Ir al anterior
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    document.getElementById('btnIrAtrasAdvertencia')?.addEventListener('click', () => {
      const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalAdvertenciaAvance'));
      modal.hide();
      prevSlide();
    });
  }
  const modalEl = document.getElementById('modalAdvertenciaAvance');
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  const textoEl = document.getElementById('modalAdvertenciaTexto');
  if (mensajePersonalizado && textoEl) {
    textoEl.textContent = mensajePersonalizado;
  }
  modal.show();
}

// Exponer utilidades a otros módulos
window.setActividadCompletada = setActividadCompletada;
window.getEstadoActividades = getEstadoActividades;
window.actividadPendienteEnRouter = actividadPendienteEnRouter;

// const course_code = localStorage.getItem('COURSE_CODE');
// // Configuración de navegación entre páginas
// const configuracionNavegacion = {
//   paginaAnterior: '../../index.php?course_code=' + course_code,  // Página anterior
//   paginaSiguiente: '../evaluacion/quiz.php?course_code=' + course_code,         // Página siguiente
//   mostrarConfirmacion: false                      // Mostrar confirmación antes de navegar
// };

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
  progreso.timestamp = new Date().toISOString();
  progreso.maxUnlockedIndex = Math.max(progreso.maxUnlockedIndex || 0, currentIndex);

  localStorage.setItem('cursoProgreso', JSON.stringify(progreso));
}

// Función para cargar progreso guardado
function cargarProgresoGuardado() {
  try {
    const progreso = JSON.parse(localStorage.getItem('cursoProgreso') || '{}');
    currentIndex = Math.min(progreso.currentIndex || 0, sliders.length - 1);
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

    // Sincronizar idioma de audios y transcripciones después de cargar el slider
    setTimeout(function () {
      if (typeof setTranscripcionIdioma === 'function') setTranscripcionIdioma();
      if (typeof setAudioSourcesIdioma === 'function') setAudioSourcesIdioma();
    }, 100);

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

// ================== ANTERIOR SLIDER ==================
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

// ================== SIGUIENTE SLIDER  ==================
window.nextSlide = () => {
  const routerActual = sliders[currentIndex]?.router;
  if (RESTRICCIONES && actividadesRequeridas.has(routerActual) && actividadPendienteEnRouter(routerActual)) {
    mostrarModalAdvertenciaAvance();
    return;
  }
  if (currentIndex < sliders.length - 1) {
    const indexAnterior = currentIndex;
    currentIndex++;
    detectarCambioMomento(indexAnterior, currentIndex);
    loadSlider(currentIndex);
  } else {
    navegarAPaginaSiguiente();
  }
};

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
  if (targetIndex >= 0 && targetIndex < sliders.length) {
    if (RESTRICCIONES) {
      const progreso = JSON.parse(localStorage.getItem('cursoProgreso') || '{}');
      const maxUnlocked = Number.isInteger(progreso.maxUnlockedIndex) ? progreso.maxUnlockedIndex : currentIndex;
      if (targetIndex > currentIndex) {
        if (targetIndex > maxUnlocked + 1) {
          mostrarModalAdvertenciaAvance('Debes avanzar en orden. Completa los slides previos para desbloquear este contenido.');
          return;
        }
        const routerActual = sliders[currentIndex]?.router;
        if (actividadesRequeridas.has(routerActual) && actividadPendienteEnRouter(routerActual)) {
          mostrarModalAdvertenciaAvance();
          return;
        }
      }
    }
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

// ================== FUNCIÓN BOTONES DE PANTALLA GRANDES PARA PASAR SLIDER  ==================
function actualizarCirculosProgreso() {
  const slideNumber = currentIndex + 1;
  const allCircles = document.querySelectorAll('.contCircleBar span, .contCircleBarMovil span');

  allCircles.forEach((span, index) => {
    span.classList.remove('current', 'current2');
    const circleNumber = index < sliders.length ? index + 1 : (index - sliders.length) + 1;

    if (circleNumber < slideNumber) {
      span.classList.add('current2');
    } else if (circleNumber === slideNumber) {
      span.classList.add('current');
    }
  });
}

// ================== FUNCIÓN BOTONES DE MOVILES PARA PASAR SLIDER  ==================
function actualizarDropdownSliderMenuActivo() {
  const slideNumber = currentIndex + 1;
  const dots = document.querySelectorAll('#dropdownSliderMenu .dropdown-oval-dot');

  dots.forEach((dot, index) => {
    dot.classList.remove('current', 'current2', 'active');

    const circleNumber = index < sliders.length ? index + 1 : (index - sliders.length) + 1;

    if (circleNumber < slideNumber) {
      dot.classList.add('current2');
    } else if (circleNumber === slideNumber) {
      dot.classList.add('active');
    }

    // if (index === currentIndex) {
    //   dot.classList.add('active');
    // }
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
    // Punto ovalado
    const punto = document.createElement('span');
    punto.className = 'dropdown-oval-dot';
    if (idx === currentIndex) punto.classList.add('active');
    li.appendChild(punto);
    li.onclick = () => {
      dropdown.style.display = 'none';
      progCircle(idx + 1, 1);
    };
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

  const loader = container.querySelector(".c-loader");
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
      setTimeout(() => adjustIframeHeight(existingIframe), 800);
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
      iframe.style = `opacity: 1; transition: opacity 0.5s; min-width: 300px; ${finalStyle}`;
      setTimeout(() => adjustIframeHeight(iframe), 800);
    });
    container.appendChild(iframe);
  }
}

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
  } else {
    nav.classList.remove('btn-navigation-fixed-bottom');
    header.classList.remove('sf-bg-transparent');
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
  return false;
}

function controlarVisibilidadBotonesNavegacion() {
  const btnPrev = document.getElementById('pagIndex');
  const btnNext = document.getElementById('next');

  const btnAbajo = document.getElementById('btnParallaxMobile');

  const container = document.getElementById('slider-container');
  if (!btnPrev || !btnNext) return;
  btnPrev.classList.remove('ocultar');
  btnNext.classList.remove('ocultar');
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
  if (btnPrev) btnPrev.classList.remove('ocultar');
  if (btnNext) btnNext.classList.remove('ocultar');
  setTimeout(actualizarBotonesNavegacion, 5);
};

function ejecutarPruebasNavegacion() {
  const prev = document.getElementById('pagIndex');
  const next = document.getElementById('next');
  const container = document.getElementById('slider-container');
  const visibleAlCargar = prev && next && !prev.classList.contains('ocultar') && !next.classList.contains('ocultar');
  console.log('Prueba flechas visibles al cargar:', visibleAlCargar);
  if (container) {
    const inicial = !prev.classList.contains('ocultar') && !next.classList.contains('ocultar');
    container.scrollTop = 0;
    const inicioScroll = !prev.classList.contains('ocultar') && !next.classList.contains('ocultar');
    container.scrollTop = container.scrollHeight;
    const finScroll = !prev.classList.contains('ocultar') && !next.classList.contains('ocultar');
    console.log('Prueba flechas activas durante scroll (inicio):', inicial && inicioScroll);
    console.log('Prueba flechas activas durante scroll (final):', finScroll);
  }
}

function ejecutarPruebasBarraProgreso() {
  const inicio = currentIndex;
  const progreso = JSON.parse(localStorage.getItem('cursoProgreso') || '{}');
  const maxUnlocked = Number.isInteger(progreso.maxUnlockedIndex) ? progreso.maxUnlockedIndex : inicio;
  const destino = Math.min(inicio + 3, sliders.length - 1);
  const bloqueoCorrecto = destino > maxUnlocked + 1;
  console.log('Prueba barra de progreso no permite saltos grandes:', bloqueoCorrecto);
}

document.addEventListener('DOMContentLoaded', () => {
  const runTests = localStorage.getItem('RUN_NAV_TESTS') === 'true' || window.__runNavTests === true;
  if (runTests) {
    setTimeout(ejecutarPruebasNavegacion, 100);
    setTimeout(ejecutarPruebasBarraProgreso, 200);
  }
});

// ================== FUNCIÓN BOTON HACIA ABAJO  ==================
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

// ================== MÉTODOS DE IDIOMA PARA AUDIOS Y TRANSCRIPCIONES ==================
function setTranscripcionIdioma() {
  var idioma = localStorage.getItem('audioIdioma') || 'es';
  var audios = document.querySelectorAll('audio.audio-con-transcripcion');
  audios.forEach(function (audio) {
    var transcripcion = audio.getAttribute('data-transcripcion-' + idioma);
    if (transcripcion) {
      audio.setAttribute('data-transcripcion', transcripcion);
    }
  });
}

function setAudioSourcesIdioma() {
  var idioma = localStorage.getItem('audioIdioma') || 'es';
  var audios = document.querySelectorAll('audio.lang-audio');
  audios.forEach(function (audio) {
    var source = audio.querySelector('source');
    if (source) {
      var srcBase = source.getAttribute('data-base') || source.src;
      if (!source.getAttribute('data-base')) {
        var parts = srcBase.split('/');
        var fileName = parts[parts.length - 1];
        source.setAttribute('data-base', fileName);
        srcBase = fileName;
      }
      // Regex más flexible para cualquier carpeta
      var pathMatch = source.src.match(/(.+\/audio\/)(es|en)\//);
      var newSrc = '';
      if (pathMatch) {
        newSrc = pathMatch[1] + idioma + '/' + source.getAttribute('data-base');
      } else {
        newSrc = '../../assets/audio/' + idioma + '/' + source.getAttribute('data-base');
      }
      source.src = newSrc;
      audio.load();
    }
  });
}

// Eventos para sincronizar idioma
document.addEventListener('DOMContentLoaded', function () {
  const toggleSwitch = document.getElementById('toggleSwitch');
  if (!toggleSwitch) return;
  const label = document.querySelector('.toggle-label.english-miga-2');
  const label2 = document.querySelector('.toggle-label.english-miga-1');
  let idioma = localStorage.getItem('audioIdioma');
  if (!idioma) idioma = localStorage.getItem('audioIdioma');
  toggleSwitch.checked = (idioma === 'en');
  label.textContent = (idioma === 'en') ? 'English Hints' : 'English Hints';
  toggleSwitch.addEventListener('change', function () {
    if (toggleSwitch.checked) {
      localStorage.setItem('audioIdioma', 'en');
      label.textContent = 'English Hints';
      label2.textContent = 'EN';
    } else {
      localStorage.setItem('audioIdioma', 'es');
      label.textContent = 'English Hints';
      label2.textContent = 'ES';
    }
    setAudioSourcesIdioma();
    setTranscripcionIdioma();
  });
  setAudioSourcesIdioma();
  setTranscripcionIdioma();
});
