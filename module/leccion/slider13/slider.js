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

  const audioImage = document.getElementById('audioImage');
  const audios = document.querySelectorAll('audio');
  
  const imageMap = {
    'interferencia-en-la-relacion-m1-slide-16.mp3': './slider13/img/interferencia_trabajo_relacion_familia.webp',
    'liderazgo-negativo-m1-slide-16.mp3': './slider13/img/liderazgo_negativo.webp',
    'violencia-laboral-m1-slide-16.mp3': './slider13/img/violencia_laboral.webp'
  };

  audios.forEach((audio) => {
    audio.addEventListener('play', (e) => {
      // Pausar otros audios
      audios.forEach((other) => {
        if (other !== e.target) {
          other.pause();
          other.currentTime = 0;
        }
      });
      
      // Cambiar imagen según el audio
      const sourceElement = e.target.querySelector('source');
      if (sourceElement) {
        const audioSrc = sourceElement.src;
        const audioFileName = audioSrc.split('/').pop();
        
        if (imageMap[audioFileName] && audioImage) {
          audioImage.src = imageMap[audioFileName];
        }
      }
    });
  });
}

