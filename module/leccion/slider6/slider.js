export function init() {
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
}
