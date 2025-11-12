export function init() {
  // Controlar reproducción de audios y cambiar imágenes
  const audioElements = document.querySelectorAll('audio');
  const audioImage = document.getElementById('audioImage');
  let currentlyPlaying = null;

  // Mapeo de audios a imágenes (usa solo el nombre del archivo como clave)
  const audioImageMap = {
    'Carga-de-trabajo-m1-slide-13.mp3': '../../assets/img/carga_trabajo.webp',
    'falta-de-control-sobre-m1-slide-13.mp3': '../../assets/img/falta_control_trabajo.webp',
    'jornadas-laborales-m1-slide-13.mp3': '../../assets/img/jornada_laboral_extensa.webp'
  };

  audioElements.forEach(audio => {
    audio.addEventListener('play', function () {
      // Pausar cualquier audio que esté reproduciéndose
      if (currentlyPlaying && currentlyPlaying !== this) {
        currentlyPlaying.pause();
      }
      currentlyPlaying = this;

      // Obtener solo el nombre del archivo de audio
      const audioSrc = this.querySelector('source').getAttribute('src');
      const audioFileName = audioSrc.split('/').pop();

      // Cambiar la imagen según el audio que se reproduce
      if (audioImageMap[audioFileName]) {
        audioImage.src = audioImageMap[audioFileName];
      }
    });

    audio.addEventListener('pause', function () {
      if (currentlyPlaying === this) {
        currentlyPlaying = null;
      }
    });

    audio.addEventListener('ended', function () {
      if (currentlyPlaying === this) {
        currentlyPlaying = null;
      }
    });
  });
}