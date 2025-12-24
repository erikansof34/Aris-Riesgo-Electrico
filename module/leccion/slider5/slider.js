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


  const palabras_sld2_bienvenida = [
    "sufrido una quemadura",
    "sufrido un choque eléctrico",
    "sufrido un atrapamiento"
  ];

  const textoElemento_sld2_bienvenida =
    document.getElementById("typing_sld2_bienvenida");

  let palabraIndex_sld2_bienvenida = 0;
  let letraIndex_sld2_bienvenida = 0;
  let escribiendo_sld2_bienvenida = true;

  function efectoTeclado_sld2_bienvenida(){
    const palabraActual =
      palabras_sld2_bienvenida[palabraIndex_sld2_bienvenida];

    if(escribiendo_sld2_bienvenida){
      textoElemento_sld2_bienvenida.textContent =
        palabraActual.substring(0, letraIndex_sld2_bienvenida + 1);
      letraIndex_sld2_bienvenida++;

      if(letraIndex_sld2_bienvenida === palabraActual.length){
        escribiendo_sld2_bienvenida = false;
        setTimeout(efectoTeclado_sld2_bienvenida, 1200);
        return;
      }
    } else {
      textoElemento_sld2_bienvenida.textContent =
        palabraActual.substring(0, letraIndex_sld2_bienvenida - 1);
      letraIndex_sld2_bienvenida--;

      if(letraIndex_sld2_bienvenida === 0){
        escribiendo_sld2_bienvenida = true;
        palabraIndex_sld2_bienvenida++;
        if(palabraIndex_sld2_bienvenida >= palabras_sld2_bienvenida.length){
          palabraIndex_sld2_bienvenida = 0;
        }
      }
    }

    setTimeout(efectoTeclado_sld2_bienvenida, 90);
  }

  efectoTeclado_sld2_bienvenida();

