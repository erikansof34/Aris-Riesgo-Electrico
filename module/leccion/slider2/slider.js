const slides_sld2_bienvenida = document.querySelectorAll('.slide_sld2_bienvenida');
  let index_sld2_bienvenida = 0;

  function cambiarSlide_sld2_bienvenida(){
    slides_sld2_bienvenida.forEach(slide => {
      slide.classList.remove('active_sld2_bienvenida');
    });

    slides_sld2_bienvenida[index_sld2_bienvenida]
      .classList.add('active_sld2_bienvenida');

    index_sld2_bienvenida++;
    if(index_sld2_bienvenida >= slides_sld2_bienvenida.length){
      index_sld2_bienvenida = 0;
    }
  }

  setInterval(cambiarSlide_sld2_bienvenida, 3000);

