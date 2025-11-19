export function init() {
  // Funcionalidad existente de iframes
  loadIframe({
    id: "Slide5WebActivity",
    src: "https://app.lumi.education/api/v1/run/vKKQPT/embed",
    className: "iframe-actividad-lumi"
  });

  loadIframe({
    id: "Slide5Web",
    src: "https://iframe.mediadelivery.net/embed/393414/d0989841-862e-44cc-a98e-f8c6600eb14b?autoplay=false&loop=false&muted=false&preload=true&responsive=true",
    className: "iframe-video-vertical-web",
    style: "width: 18vw; height: 68vh; min-height: 300px;"
  });

  loadIframe({
    id: "Slide5Mobile",
    src: "https://iframe.mediadelivery.net/embed/393414/d0989841-862e-44cc-a98e-f8c6600eb14b?autoplay=false&loop=false&muted=false&preload=true&responsive=true",
    className: "iframe-video-vertical-mobil",
    style: "width: 20vw; height: 70vh; min-height: 300px;"
  });

  // Inicializar slideshow automático
  initSlideshow();
}

function initSlideshow() {
  // Array con las imágenes disponibles (excluyendo el logo)
  const images = [
    './slider9/img/fondo-sld1.webp',
    './slider9/img/fondo-sld2.webp',
    './slider9/img/fondo-sld3.webp',
    './slider9/img/fondo-sld4.webp',
    './slider9/img/fondo-sld5.webp',
    './slider9/img/fondo-sld6.webp',
    './slider9/img/fondo-sld7.webp',
    './slider9/img/fondo-sld8.webp',
    './slider9/img/fondo-sld9.webp',
    './slider9/img/fondo-sld10.webp'
  ];

  let currentIndex = 0;
  const slideshowContainer = document.getElementById('slideshow_anim');
  
  if (!slideshowContainer) return;

  // Crear el elemento img si no existe
  let slideImg = document.getElementById('slide_anim');
  if (!slideImg) {
    slideImg = document.createElement('img');
    slideImg.id = 'slide_anim';
    slideImg.alt = 'Slideshow Image';
    slideshowContainer.appendChild(slideImg);
  }

  // Función para cambiar la imagen
  function changeImage() {
    slideImg.style.opacity = '0';
    
    setTimeout(() => {
      slideImg.src = images[currentIndex];
      slideImg.style.opacity = '1';
      currentIndex = (currentIndex + 1) % images.length;
    }, 1000); // Medio segundo para la transición
  }

  // Cargar la primera imagen
  slideImg.src = images[currentIndex];
  slideImg.style.opacity = '1';
  currentIndex = (currentIndex + 1) % images.length;

  // Cambiar imagen cada 30 segundos
  setInterval(changeImage, 15000);
}
