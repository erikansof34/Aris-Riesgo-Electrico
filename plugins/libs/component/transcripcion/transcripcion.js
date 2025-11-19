function initTranscripciones(container = document) {
  const audios = container.querySelectorAll('.audio-con-transcripcion');
  const transcripcionGlobal = container.querySelector('#transcripcion-global') || document.querySelector('#transcripcion-global');

  if (!transcripcionGlobal || audios.length === 0) {
    return;
  }

  function updateTranscripcion(audio, toggleBtn) {
    // Leer idioma actual y transcripción cada vez
    let idioma = localStorage.getItem('audioIdioma') || 'es';
    let transAttr = 'data-transcripcion-' + idioma;
    let transcripcion = audio.getAttribute(transAttr) || audio.getAttribute('data-transcripcion');
    let textos = [];
    try {
      textos = JSON.parse(transcripcion);
    } catch (e) {
      textos = [];
    }
    const tiempoActual = audio.currentTime;
    const textoActual = textos.find(item => tiempoActual >= item.start && tiempoActual <= item.end);

    if (toggleBtn?.classList.contains('active')) {
      if (textoActual) {
        transcripcionGlobal.textContent = textoActual.text;
        transcripcionGlobal.style.display = 'block';
      } else {
        transcripcionGlobal.style.display = 'none';
      }
    } else {
      transcripcionGlobal.style.display = 'none';
    }

    if (!audio.paused && !audio.ended) {
      requestAnimationFrame(() => updateTranscripcion(audio, toggleBtn));
    }
  }

  audios.forEach((audio, index) => {
    const toggleBtn = audio.parentElement.querySelector('.transcription-toggle');
    // Ya no se inicializa textos ni transcripcion aquí

    if (toggleBtn) {
      toggleBtn.setAttribute('title', 'Activar subtítulos');

      toggleBtn.addEventListener('click', function () {
        this.classList.toggle('active');
        this.style.color = this.classList.contains('active') ? '#2a7fba' : '#666';

        if (this.classList.contains('active') && !audio.paused) {
          updateTranscripcion(audio, toggleBtn);
        } else {
          transcripcionGlobal.style.display = 'none';
        }
      });
    }

    // Actualizar transcripción si cambia el idioma
    window.addEventListener('storage', function(e) {
      if (e.key === 'audioIdioma') {
        // Si el botón está activo y el audio está reproduciéndose, forzar actualización visual
        if (toggleBtn?.classList.contains('active') && !audio.paused) {
          updateTranscripcion(audio, toggleBtn);
        }
      }
    });

    audio.addEventListener('play', () => {
      audios.forEach(a => { if (a !== audio && !a.paused) { a.pause(); } });

      if (toggleBtn?.classList.contains('active')) {
        updateTranscripcion(audio, toggleBtn);
      }
    });

    audio.addEventListener('pause', () => {
      transcripcionGlobal.style.display = 'none';
      if (toggleBtn) {
        toggleBtn.classList.remove('active');
        toggleBtn.style.color = '#666';
        toggleBtn.setAttribute('title', 'Activar subtítulos');
      }
    });

    audio.addEventListener('ended', () => {
      transcripcionGlobal.style.display = 'none';
      if (toggleBtn) {
        toggleBtn.classList.remove('active');
        toggleBtn.style.color = '#666';
        toggleBtn.setAttribute('title', 'Activar subtítulos');
      }
    });
  });
}

// 🔹 Exponer globalmente para poder usarlo desde main.js
window.initTranscripciones = initTranscripciones;