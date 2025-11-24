(function(){
    const mainImg = document.getElementById('mainImg');
    const mainTitle = document.getElementById('mainTitle');
    const mainError = document.getElementById('mainError');
    const grid = document.getElementById('gridOpciones');

    if (!mainImg || !mainTitle || !grid) {
      console.error('Elementos principales no encontrados', {mainImg, mainTitle, grid});
      return;
    }

    // Delegación de eventos: escucha clicks en el grid para mayor robustez
    grid.addEventListener('click', function(e){
      const target = e.target.closest('.opcion-cuadrado');
      if (!target) return;
      handleSelection(target);
    });

    // teclado
    grid.addEventListener('keydown', function(e){
      const target = e.target.closest('.opcion-cuadrado');
      if (!target) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelection(target);
      }
    });

    // función central
    function handleSelection(item) {
      const src = item.dataset.src;
      const title = item.dataset.title || '';

      if (!src) {
        console.warn('Tarjeta sin data-src', item);
        return;
      }

      // marcar seleccionado (visual)
      grid.querySelectorAll('.opcion-cuadrado').forEach(el => el.classList.remove('selected'));
      item.classList.add('selected');

      // animación fade out
      mainError.style.display = 'none';
      mainImg.classList.remove('fade-in');
      mainImg.classList.add('fade-out');

      // Preload image para detectar errores antes de asignar al DOM
      const imgPreload = new Image();
      imgPreload.onload = () => {
        // pequeña espera para que el fade-out sea visible
        setTimeout(() => {
          mainImg.src = src;
          mainImg.alt = title;
          mainTitle.textContent = title;

          mainImg.classList.remove('fade-out');
          mainImg.classList.add('fade-in');
        }, 120);
      };
      imgPreload.onerror = () => {
        console.error('Error cargando imagen:', src);
        mainError.style.display = 'flex';
        mainTitle.textContent = '';
        // restaurar opacidad visible aunque haya error
        mainImg.classList.remove('fade-out');
        mainImg.classList.add('fade-in');
      };

      // Inicia la carga real
      imgPreload.src = src;
      console.log('Cargando imagen:', src);
    }

    // Mostrar la primera por defecto si existe
    const first = grid.querySelector('.opcion-cuadrado');
    if (first) {
      // usa setTimeout 0 para asegurarse que la UI esté lista
      setTimeout(() => first.click(), 0);
    }
  })();