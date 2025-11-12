export function init() {

  const caseButtons = document.querySelectorAll('.case-btn');

  caseButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
          const selectedCase = btn.getAttribute('data-case');
          
          // Activar botón
          caseButtons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');

          // Ocultar todos los casos
          document.getElementById('caseDanilo').classList.add('d-none');
          document.getElementById('caseAna').classList.add('d-none');
          document.getElementById('caseJuan').classList.add('d-none');
          
          // Mostrar caso seleccionado
          if (selectedCase === 'danilo') {
              document.getElementById('caseDanilo').classList.remove('d-none');
          } else if (selectedCase === 'ana') {
              document.getElementById('caseAna').classList.remove('d-none');
          } else if (selectedCase === 'juan') {
              document.getElementById('caseJuan').classList.remove('d-none');
          }
      });
  });

  // Pausar otros audios cuando se reproduce uno
  document.querySelectorAll('audio').forEach(audio => {
    audio.addEventListener('play', (e) => {
      document.querySelectorAll('audio').forEach(other => {
        if (other !== e.target) {
          other.pause();
        }
      });
    });
  });
}