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

  mostrarModalInicioCurso();
}

function mostrarModalInicioCurso() {
  if (localStorage.getItem('modalInicioCursoMostrado') === 'true') return;

  const modalHtml = `
    <div class="modal fade" id="modalInicioCurso" tabindex="-1" aria-hidden="true" data-modal-initialized="true">
      <div class="modal-dialog modal-dialog-centered modal-lg-650">
        <div class="modal-content">
          <div class="modal-header sf-bg-primary">
            <h5 class="modal-title sf-text-white">¡Atención!</h5>
          </div>
          <div class="modal-body text-center">
            <img src="../../assets/img/botones/atencion_modal.webp" alt="alerta" style="width:90px;height:90px;object-fit:contain;" class="mb-3"/>
            <p class="text-justify mb-3">
              Para poder avanzar en el proceso, es necesario que completes todas las actividades en el orden establecido.
              No podrás adelantar la barra de progreso sin haber visualizado primero todos los slides.
              Asegúrate de revisar cada uno de ellos para garantizar una experiencia completa y sin inconvenientes.
              ¿Estás listo(a)?
            </p>
            <div class="d-flex justify-content-center gap-3">
              <button type="button" class="btn sf-btn sf-btn-success sf-btn-gray" id="modalInicioRechazar">
                <i class="fa fa-times-circle"></i> Rechazar
              </button>
              <button type="button" class="btn sf-btn sf-btn-success" id="modalInicioContinuar">
                <i class="fa fa-check-circle"></i> Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const modalEl = document.getElementById('modalInicioCurso');
  const bsModal = new bootstrap.Modal(modalEl, { backdrop: true, keyboard: false });

  document.getElementById('modalInicioRechazar')?.addEventListener('click', () => {
    bsModal.hide();
    window.location.href = '../../index.html';
  });

  document.getElementById('modalInicioContinuar')?.addEventListener('click', () => {
    localStorage.setItem('modalInicioCursoMostrado', 'true');
    bsModal.hide();
  });

  bsModal.show();
}
