export function init() {
    loadIframe({
        id: "Slide2Web",
        src: "https://iframe.mediadelivery.net/embed/488325/0b909488-c736-4730-9c34-46acc63059d7?autoplay=false&loop=false&muted=false&preload=true&responsive=true",
        className: "iframe-video-vertical-web",
        style: "width: 20vw; height: 70vh; min-height: 300px;"
    });

    loadIframe({
        id: "Slide2Mobile",
        src: "https://iframe.mediadelivery.net/embed/488325/0b909488-c736-4730-9c34-46acc63059d7?autoplay=false&loop=false&muted=false&preload=true&responsive=true",
        className: "iframe-video-vertical-mobil",
        style: "width: 20vw; height: 70vh; min-height: 300px;"
    });
}