export function init() {
  loadIframe({
    id: 'Slide1Web',
    src: 'https://iframe.mediadelivery.net/embed/393414/d0989841-862e-44cc-a98e-f8c6600eb14b?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
    className: 'iframe-video-vertical-web',
    style: 'width: 20vw; height: 70vh; min-height: 300px;',
  });

  loadIframe({
    id: 'Slide1Mobile',
    src: 'https://iframe.mediadelivery.net/embed/393414/d0989841-862e-44cc-a98e-f8c6600eb14b?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
    className: 'iframe-video-vertical-mobil',
    style: 'width: 20vw; height: 70vh; min-height: 300px;',
  });

}