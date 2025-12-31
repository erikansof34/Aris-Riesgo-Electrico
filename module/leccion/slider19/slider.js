export function init() {
    const wavePoints = document.querySelectorAll('.wave-point');
    const isMobile = window.innerWidth <= 576;

    // Activar el primer punto inicialmente
    if (wavePoints.length > 0) {
        wavePoints[0].classList.add('active');
    }

    wavePoints.forEach((point, index) => {
        point.addEventListener('click', () => {
            // En móvil, permitir múltiples activos para mejor UX
            if (isMobile) {
                point.classList.toggle('active');
            } else {
                // En escritorio, mantener comportamiento original
                wavePoints.forEach(p => p.classList.remove('active'));
                point.classList.add('active');
            }
        });

        // Mejorar accesibilidad
        point.setAttribute('role', 'button');
        point.setAttribute('tabindex', '0');
        point.setAttribute('aria-label', `Paso ${index + 1} del procedimiento`);

        // Soporte para teclado
        point.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                point.click();
            }
        });
    });

    // Actualizar comportamiento en resize
    window.addEventListener('resize', () => {
        const newIsMobile = window.innerWidth <= 576;
        if (newIsMobile !== isMobile) {
            location.reload(); // Recargar para aplicar nuevos estilos
        }
    });
}