
document.addEventListener('DOMContentLoaded', function () {
  const carouselImages = document.querySelectorAll('.carousel-img');
  
  if (carouselImages.length === 0) {
    console.warn('No carousel images found');
    return;
  }
  
  let currentIndex = 0;

  function showNextImage() {
    // Remover active de la imagen actual
    carouselImages[currentIndex].classList.remove('active');
    
    // Avanzar al siguiente índice (ciclo infinito)
    currentIndex = (currentIndex + 1) % carouselImages.length;
    
    // Agregar active a la nueva imagen
    carouselImages[currentIndex].classList.add('active');
    
    console.log('Mostrando imagen:', currentIndex + 1);
  }

  // Cambiar imagen cada 4 segundos
  setInterval(showNextImage, 4000);
});