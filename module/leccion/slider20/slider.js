export function init() {
    // Cargar dinámicamente la librería si no existe
    if (typeof SignaturePad === 'undefined') {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/signature_pad@4.1.7/dist/signature_pad.umd.min.js";
        script.onload = () => initSignature();
        document.head.appendChild(script);
    } else {
        initSignature();
    }

    function initSignature() {
        var canvas = document.getElementById('signature-pad');
        if (!canvas) return;

        // Prevenir doble inicialización si ya tiene el evento
        if (canvas.getAttribute('data-initialized') === 'true') return;
        canvas.setAttribute('data-initialized', 'true');

        var signaturePad = new SignaturePad(canvas, {
            backgroundColor: 'rgb(255, 255, 255)',
            penColor: 'rgb(0, 0, 0)'
        });

        // Ajustar tamaño del canvas
        function resizeCanvas() {
            var ratio = Math.max(window.devicePixelRatio || 1, 1);
            var data = signaturePad.toData();
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext("2d").scale(ratio, ratio);
            signaturePad.clear();
            signaturePad.fromData(data);
        }

        // Llamada inicial para ajustar tamaño
        // setTimeout(resizeCanvas, 100);

        // Botón Limpiar
        var btnClear = document.getElementById('btn-clear-signature');
        if (btnClear) {
            btnClear.addEventListener('click', function () {
                signaturePad.clear();
                document.getElementById('signature-message').innerHTML = '';
            });
        }

        // Botón Enviar
        var btnSave = document.getElementById('btn-save-signature');
        if (btnSave) {
            btnSave.addEventListener('click', function () {
                if (signaturePad.isEmpty()) {
                    alert('Por favor firme antes de enviar.');
                    return;
                }

                var btn = this;
                var originalText = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

                var dataUrl = signaturePad.toDataURL('image/png');

                // Obtener IDs desde los inputs hidden del layout principal
                var unique_course_id = $('#unique_course_id').val();

                $.ajax({
                    type: "POST",
                    url: "../../save_signature.php",
                    data: {
                        unique_course_id: unique_course_id,
                        signature_data: dataUrl
                    },
                    success: function (response) {
                        if (response.success) {
                            $('#signature-message').html('<span class="text-white bg-success p-1 rounded">' + response.message + '</span>');
                            signaturePad.off(); // Deshabilitar edición
                            btn.innerHTML = '<i class="fas fa-check"></i> Enviado';
                            // Marcar la actividad como completada en el estado del curso
                            if (typeof setActividadCompletada === 'function') {
                                setActividadCompletada('slider20');
                            }
                        } else {
                            $('#signature-message').html('<span class="text-white bg-danger p-1 rounded">' + response.message + '</span>');
                            btn.disabled = false;
                            btn.innerHTML = originalText;
                        }
                    },
                    error: function () {
                        $('#signature-message').html('<span class="text-white bg-danger p-1 rounded">Error de conexión</span>');
                        btn.disabled = false;
                        btn.innerHTML = originalText;
                    }
                });
            });
        }
    }
}