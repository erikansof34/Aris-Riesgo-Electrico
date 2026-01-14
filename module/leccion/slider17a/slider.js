export function init() {
    window.toggleDescription = function(id) {
        const desc = document.getElementById(`desc-${id}`);
        const btn = event.target.closest('.btn-ver-mas');
        
        if (desc.classList.contains('collapsed')) {
            desc.classList.remove('collapsed');
            desc.classList.add('expanded');
            btn.innerHTML = 'Ver menos <i class="fas fa-chevron-up"></i>';
            btn.classList.add('expanded');
        } else {
            desc.classList.add('collapsed');
            desc.classList.remove('expanded');
            btn.innerHTML = 'Ver más <i class="fas fa-chevron-down"></i>';
            btn.classList.remove('expanded');
        }
    };
}
