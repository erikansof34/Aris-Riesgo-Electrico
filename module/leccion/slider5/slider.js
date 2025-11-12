export function init() {
  loadIframe({
    id: "Slide5Web",
    src: "https://iframe.mediadelivery.net/embed/488325/27d4c9e2-f005-479d-b567-e17fd787bc7d?autoplay=false&loop=false&muted=false&preload=true&responsive=true",
    className: "iframe-video-vertical-web",
    style: "width: 20vw; height: 70vh; min-height: 300px;"
  });

  loadIframe({
    id: "Slide5Mobile",
    src: "https://iframe.mediadelivery.net/embed/488325/27d4c9e2-f005-479d-b567-e17fd787bc7d?autoplay=false&loop=false&muted=false&preload=true&responsive=true",
    className: "iframe-video-vertical-mobil",
    style: "width: 20vw; height: 70vh; min-height: 300px;"
  });
}
