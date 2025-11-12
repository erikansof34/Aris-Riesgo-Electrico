export function init() {
    loadIframe({
        id: 'Slide11Web',
        src: 'https://iframe.mediadelivery.net/embed/488325/cb55224d-e3cf-4818-a330-04ca34758857?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
        className: 'iframe-video-vertical-web',
        style: 'width: 37vw; height: 52vh; min-height: 300px;',
    });

    loadIframe({
        id: 'Slide11Mobile',
        src: 'https://iframe.mediadelivery.net/embed/488325/cb55224d-e3cf-4818-a330-04ca34758857?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
        className: 'iframe-video-vertical-mobil',
        style: 'width: 20vw; height: 70vh; min-height: 300px;',
    });

    loadIframe({
        id: 'Slide11WebActivity',
        src: 'https://app.lumi.education/api/v1/run/UYy73D/embed',
        className: 'iframe-actividad-lumi',
    });
}
