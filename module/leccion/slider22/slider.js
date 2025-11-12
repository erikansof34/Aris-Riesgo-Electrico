export function init() {
  console.log("slider21 cargado - inicializando sistema de animaciones del protocolo");
  
  // Variables de control
  let animationsStarted = false;
  let allResourcesLoaded = false;
  
  // Función principal para inicializar las animaciones del protocolo
  function initProtocolAnimations() {
    const protocolList = document.querySelector('.sf-protocol-list');
    const protocolItems = document.querySelectorAll('.sf-protocol-item');
    
    if (!protocolList || protocolItems.length === 0) {
      console.log('No se encontraron elementos del protocolo');
      return;
    }
    
    console.log(`Inicializando ${protocolItems.length} items del protocolo`);
    
    // Función para verificar si todos los recursos están cargados
    function checkAllResourcesLoaded() {
      return new Promise((resolve) => {
        const images = document.querySelectorAll('.sf-protocol-item img');
        const totalImages = images.length;
        let loadedImages = 0;
        
        console.log(`Verificando carga de ${totalImages} imágenes`);
        
        if (totalImages === 0) {
          console.log('No hay imágenes que cargar');
          resolve();
          return;
        }
        
        function imageLoadHandler() {
          loadedImages++;
          console.log(`Imagen cargada: ${loadedImages}/${totalImages}`);
          
          if (loadedImages === totalImages) {
            console.log('Todas las imágenes han sido cargadas');
            resolve();
          }
        }
        
        images.forEach((img, index) => {
          if (img.complete && img.naturalHeight !== 0) {
            imageLoadHandler();
          } else {
            img.addEventListener('load', imageLoadHandler, { once: true });
            img.addEventListener('error', () => {
              console.warn(`Error cargando imagen ${index + 1}`);
              imageLoadHandler();
            }, { once: true });
          }
        });
        
        // Timeout de seguridad
        setTimeout(() => {
          if (loadedImages < totalImages) {
            console.log(`Timeout alcanzado. Imágenes cargadas: ${loadedImages}/${totalImages}`);
            resolve();
          }
        }, 4000);
      });
    }
    
    // Función para iniciar las animaciones
    function startAnimations() {
      if (animationsStarted) {
        console.log('Las animaciones ya se iniciaron');
        return;
      }
      
      animationsStarted = true;
      console.log('🎬 Iniciando animaciones del protocolo');
      
      // Mostrar la lista
      protocolList.classList.add('ready');
      
      // Iniciar animaciones con un pequeño delay
      setTimeout(() => {
        protocolItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('animate');
            console.log(`Animando item ${index + 1}`);
          }, index * 100); // Un pequeño stagger adicional
        });
      }, 300);
    }
    
    // Función principal que coordina todo
    async function coordinateAnimations() {
      try {
        console.log('🔄 Esperando que todos los recursos estén cargados...');
        
        // Esperar a que todos los recursos estén cargados
        await checkAllResourcesLoaded();
        
        // Esperar un frame adicional para asegurar que el rendering esté completo
        await new Promise(resolve => requestAnimationFrame(resolve));
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        console.log('✅ Todos los recursos están listos');
        allResourcesLoaded = true;
        
        // Iniciar animaciones
        startAnimations();
        
      } catch (error) {
        console.error('Error en la coordinación de animaciones:', error);
        // Intentar iniciar de todas formas
        startAnimations();
      }
    }
    
    // Iniciar el proceso
    coordinateAnimations();
  }
  
  // Función para manejar la entrada al viewport
  function setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
      console.log('IntersectionObserver no disponible');
      return;
    }
    
    const protocolList = document.querySelector('.sf-protocol-list');
    if (!protocolList) {
      console.log('Lista de protocolo no encontrada para observer');
      return;
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          console.log('🔍 Protocolo entró en viewport');
          
          // Si los recursos están cargados pero las animaciones no han comenzado
          if (allResourcesLoaded && !animationsStarted) {
            const protocolItems = document.querySelectorAll('.sf-protocol-item');
            protocolList.classList.add('ready');
            
            setTimeout(() => {
              protocolItems.forEach((item, index) => {
                setTimeout(() => {
                  item.classList.add('animate');
                }, index * 150);
              });
            }, 200);
            
            animationsStarted = true;
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: [0.3],
      rootMargin: '0px 0px -50px 0px'
    });
    
    observer.observe(protocolList);
  }
  
  // Ejecutar cuando el DOM esté listo
  function executeWhenReady() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM cargado, inicializando protocolo');
        initProtocolAnimations();
        setupIntersectionObserver();
      });
    } else {
      console.log('DOM ya está listo, inicializando inmediatamente');
      // Dar un tick para asegurar que todo esté renderizado
      setTimeout(() => {
        initProtocolAnimations();
        setupIntersectionObserver();
      }, 0);
    }
  }
  
  executeWhenReady();
}
