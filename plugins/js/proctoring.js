
/**
 * Sistema de Proctoring de Fotos
 * Funcionalidad extraíble para captura de fotos con cámara web
 */
class PhotoProctoring {
    constructor(videoElementId, canvasElementId, courseData) {
        this.videoElement = document.getElementById(videoElementId);
        this.canvasElement = document.getElementById(canvasElementId);
        this.ctx = this.canvasElement.getContext('2d');
        this.courseData = courseData;
        this.stream = null;
        this.capturedPhoto = null;

        // Face Detection Properties
        this.modelsLoaded = false;
        this.faceDetectionInterval = null;
        this.isFaceValid = false;

        this.initializeElements();
        this.bindEvents();

        // Cargar modelos de detección facial si faceapi está disponible
        if (typeof faceapi !== 'undefined') {
            this.loadModels();
        } else {
            console.warn('face-api.js no está cargado. La detección estricta de rostro no funcionará.');
        }
    }

    initializeElements() {
        this.btnStartCamera = document.getElementById('btn-start-camera');
        this.btnCapture = document.getElementById('btn-capture');
        this.btnRetake = document.getElementById('btn-retake');
        this.btnSend = document.getElementById('btn-send');
        this.cameraContainer = document.getElementById('camera-container');
        this.photoContainer = document.getElementById('photo-container');
        this.loadingElement = document.querySelector('.loading');

        // Elementos adicionales para feedback
        this.overlayText = document.querySelector('.overlay-text');
        this.faceOverlay = document.querySelector('.face-overlay');
        this.btnMain = document.getElementById('btn-action-main');
    }

    bindEvents() {
        if (this.btnStartCamera) this.btnStartCamera.addEventListener('click', () => this.startCamera());
        if (this.btnCapture) this.btnCapture.addEventListener('click', () => this.takePhoto());
        if (this.btnRetake) this.btnRetake.addEventListener('click', () => this.retakePhoto());
        if (this.btnSend) this.btnSend.addEventListener('click', () => this.sendPhoto());
    }

    async loadModels() {
        // URL pública de modelos (se recomienda tenerlos locales en producción)
        const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
        try {
            if (this.overlayText) this.overlayText.innerText = 'Cargando modelos...';

            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            // await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);

            this.modelsLoaded = true;
            console.log('Modelos de detección facial cargados');
            if (this.overlayText) this.overlayText.innerText = 'ALINEA TU ROSTRO';

            // Si la cámara ya está activa, iniciar detección
            if (this.stream) {
                this.startFaceDetection();
            }
        } catch (e) {
            console.error('Error cargando modelos:', e);
            if (this.overlayText) this.overlayText.innerText = 'Error de carga';
        }
    }

    async startCamera() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                }
            });

            this.videoElement.srcObject = this.stream;
            // Asegurar que el video se reproduzca (necesario en algunos navegadores)
            this.videoElement.play();

            this.videoElement.onloadedmetadata = () => {
                if (this.btnStartCamera) this.btnStartCamera.style.display = 'none';
                if (this.btnCapture) this.btnCapture.style.display = 'inline-block';

                // Iniciar detección de rostro si los modelos están listos
                if (this.modelsLoaded) {
                    this.startFaceDetection();
                }
            };

        } catch (error) {
            console.error('Error al acceder a la cámara:', error);
            this.showError('No se pudo acceder a la cámara. Verifique los permisos y que no esté siendo usada por otra aplicación.');
        }
    }

    startFaceDetection() {
        if (this.faceDetectionInterval) clearInterval(this.faceDetectionInterval);
        if (!this.videoElement || this.videoElement.paused || this.videoElement.ended) return;

        console.log('Iniciando detección de rostros...');

        // Configuración de TinyFaceDetector
        const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });

        this.faceDetectionInterval = setInterval(async () => {
            if (this.videoElement.paused || this.videoElement.ended) return;

            try {
                // Detectar rostro
                const detections = await faceapi.detectAllFaces(this.videoElement, options);

                // Validar detección
                this.validateFace(detections);

            } catch (err) {
                console.error('Error en detección facial:', err);
            }
        }, 200); // Verificar cada 200ms
    }

    validateFace(detections) {
        const displaySize = {
            width: this.videoElement.videoWidth || 640,
            height: this.videoElement.videoHeight || 480
        };

        // Resetear estado si no hay detecciones
        if (!detections || detections.length === 0) {
            this.updateFeedback('No se detecta rostro', 'red');
            this.isFaceValid = false;
            return;
        }

        if (detections.length > 1) {
            this.updateFeedback('Solo una persona permitida', 'red');
            this.isFaceValid = false;
            return;
        }

        const face = detections[0];
        const box = face.box;
        const score = face.score;

        // 1. Validar Confianza (Score)
        if (score < 0.6) {
            this.updateFeedback('Rostro no claro', 'orange');
            this.isFaceValid = false;
            return;
        }

        // 2. Validar Posición (Centrado)
        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;

        // Asumiendo que el video está espejado (scaleX(-1)), las coordenadas X son invertidas visualmente
        // pero face-api trabaja sobre el elemento de video original.

        const videoCenterX = displaySize.width / 2;
        const videoCenterY = displaySize.height / 2;

        const toleranceX = displaySize.width * 0.20; // 20% tolerancia horizontal
        const toleranceY = displaySize.height * 0.25; // 25% tolerancia vertical

        const isCenteredX = Math.abs(centerX - videoCenterX) < toleranceX;
        const isCenteredY = Math.abs(centerY - videoCenterY) < toleranceY;

        if (!isCenteredX || !isCenteredY) {
            this.updateFeedback('Centra tu rostro', 'orange');
            this.isFaceValid = false;
            return;
        }

        // 3. Validar Tamaño (Distancia)
        // Porcentaje del área del video que ocupa el rostro
        const faceArea = box.width * box.height;
        const videoArea = displaySize.width * displaySize.height;
        const coverage = faceArea / videoArea;

        if (coverage < 0.04) { // Muy lejos (< 4%)
            this.updateFeedback('Acércate más', 'orange');
            this.isFaceValid = false;
            return;
        }

        if (coverage > 0.6) { // Muy cerca (> 60%)
            this.updateFeedback('Aléjate un poco', 'orange');
            this.isFaceValid = false;
            return;
        }

        // Todo correcto
        this.updateFeedback('Rostro detectado', '#1e3a8a'); // Azul original
        this.isFaceValid = true;
    }

    updateFeedback(message, color) {
        // Actualizar texto
        if (this.overlayText) {
            this.overlayText.innerText = message;
            this.overlayText.style.color = color === '#1e3a8a' ? '#1e3a8a' : color;
        }

        // Actualizar borde del overlay
        if (this.faceOverlay) {
            this.faceOverlay.style.borderColor = color === '#1e3a8a' ? 'rgba(255,255,255,0.5)' : color;
            this.faceOverlay.style.boxShadow = `0 0 0 9999px ${color === '#1e3a8a' ? 'rgba(30, 58, 138, 0.5)' : color.replace(')', ', 0.5)').replace('rgb', 'rgba')}`;
            if (color !== '#1e3a8a' && !color.startsWith('#')) {
                // Simple hack para colores nombrados, idealmente usar rgba
                this.faceOverlay.style.boxShadow = `0 0 0 9999px ${color === 'red' ? 'rgba(255, 0, 0, 0.3)' : 'rgba(255, 165, 0, 0.3)'}`;
            }
        }

        // Controlar botón principal
        if (this.btnMain) {
            const checkbox = document.getElementById('consentCheckbox');
            const isChecked = checkbox ? checkbox.checked : true;

            if (this.isFaceValid && isChecked) {
                this.btnMain.disabled = false;
                this.btnMain.style.opacity = '1';
                this.btnMain.style.cursor = 'pointer';
            } else {
                this.btnMain.disabled = true;
                this.btnMain.style.opacity = '0.6';
                this.btnMain.style.cursor = 'not-allowed';
            }
        }
    }

    takePhoto() {
        if (!this.videoElement.videoWidth || !this.videoElement.videoHeight) {
            this.showError('La cámara no está lista. Intente nuevamente.');
            return;
        }

        // Validación estricta antes de tomar la foto
        if (this.modelsLoaded && !this.isFaceValid) {
            this.showError('Por favor, asegúrese de que su rostro esté centrado y bien iluminado antes de continuar.');
            return;
        }

        // Ajustar dimensiones del canvas para coincidir con el video
        this.canvasElement.width = this.videoElement.videoWidth;
        this.canvasElement.height = this.videoElement.videoHeight;

        // Capturar imagen
        this.ctx.drawImage(
            this.videoElement,
            0, 0,
            this.canvasElement.width,
            this.canvasElement.height
        );

        this.capturedPhoto = this.canvasElement.toDataURL('image/png');

        // Mostrar preview y ocultar cámara (si existen los contenedores antiguos)
        if (this.cameraContainer) this.cameraContainer.style.display = 'none';
        if (this.photoContainer) this.photoContainer.style.display = 'block';

        // Detener detección y cámara
        if (this.faceDetectionInterval) clearInterval(this.faceDetectionInterval);
        this.stopCamera();
    }

    retakePhoto() {
        if (this.photoContainer) this.photoContainer.style.display = 'none';
        if (this.cameraContainer) this.cameraContainer.style.display = 'block';
        if (this.btnStartCamera) this.btnStartCamera.style.display = 'inline-block';
        if (this.btnCapture) this.btnCapture.style.display = 'none';
        this.capturedPhoto = null;
        this.isFaceValid = false;
        this.startCamera();
    }

    sendPhoto() {
        if (!this.capturedPhoto) {
            this.showError('No hay foto para enviar.');
            return;
        }

        if (this.loadingElement) this.loadingElement.style.display = 'block';
        if (this.btnSend) this.btnSend.disabled = true;
        if (this.btnRetake) this.btnRetake.disabled = true;

        // Convertir canvas a Blob
        this.canvasElement.toBlob((blob) => {
            if (!blob) {
                this.showError('Error al procesar la imagen.');
                this.resetSendButtons();
                return;
            }

            // Crear FormData
            const formData = new FormData();
            formData.append('photo', blob, this.courseData.emp_unique_id + '.png');
            formData.append('course_code', this.courseData.course_code);
            formData.append('module_id', this.courseData.module_id);
            formData.append('unique_course_id', this.courseData.unique_course_id);
            formData.append('emp_unique_id', this.courseData.emp_unique_id);

            // Agregar datos adicionales de proctoring
            formData.append('client_ip', 'IP_PLACEHOLDER'); // Se llenará en backend si es necesario
            formData.append('timestamp', new Date().toISOString());
            formData.append('user_agent', navigator.userAgent);

            // Intentar obtener geolocalización, pero enviar de todos modos
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        formData.append('latitude', position.coords.latitude);
                        formData.append('longitude', position.coords.longitude);
                        this.uploadPhoto(formData);
                    },
                    (error) => {
                        console.log('Geolocalización no disponible:', error);
                        this.uploadPhoto(formData);
                    },
                    { timeout: 3000, enableHighAccuracy: false }
                );
            } else {
                this.uploadPhoto(formData);
            }

        }, 'image/png', 0.8);
    }

    uploadPhoto(formData) {
        fetch('../../upload_simple.php', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor: ' + response.statusText);
                }
                return response.text(); // Primero obtener texto para depurar si no es JSON válido
            })
            .then(text => {
                try {
                    return JSON.parse(text);
                } catch (e) {
                    console.error('Respuesta no válida del servidor:', text);
                    throw new Error('El servidor devolvió una respuesta no válida.');
                }
            })
            .then(data => {
                if (data.success) {
                    // Mostrar modal de éxito si existe
                    const successModalEl = document.getElementById('successModal');
                    if (successModalEl && typeof bootstrap !== 'undefined') {
                        const modal = new bootstrap.Modal(successModalEl);
                        modal.show();

                        // Redirigir después de unos segundos para que el usuario vea el mensaje
                        setTimeout(() => {
                            window.location.href = `module/leccion/index.php?course_code=${this.courseData.course_code}`;
                        }, 3000);
                    } else {
                        // Fallback si no hay modal
                        this.showSuccess('Foto guardada correctamente. Redirigiendo...');
                        setTimeout(() => {
                            window.location.href = `module/leccion/index.php?course_code=${this.courseData.course_code}`;
                        }, 1000);
                    }
                } else {
                    throw new Error(data.message || 'Error al subir la foto');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                this.showError(error.message);
                this.resetSendButtons();
            });
    }

    resetSendButtons() {
        if (this.loadingElement) this.loadingElement.style.display = 'none';
        if (this.btnSend) this.btnSend.disabled = false;
        if (this.btnRetake) this.btnRetake.disabled = false;

        // Resetear botón de la interfaz personalizada (foto.php)
        if (typeof $ !== 'undefined') {
            const btnMain = $('#btn-action-main');
            if (btnMain.length) {
                btnMain.prop('disabled', false).html('<i class="fas fa-camera me-2"></i> Reintentar');
            }
        }
    }

    showError(message) {
        alert('Error: ' + message);
        this.resetSendButtons();
    }

    showSuccess(message) {
        console.log('Éxito: ' + message);
    }

    stopCamera() {
        if (this.faceDetectionInterval) {
            clearInterval(this.faceDetectionInterval);
            this.faceDetectionInterval = null;
        }

        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }

    // Método para limpiar recursos al destruir la instancia
    destroy() {
        this.stopCamera();
        // liberar referencias
        this.videoElement = null;
        this.canvasElement = null;
        this.ctx = null;
        this.overlayText = null;
        this.faceOverlay = null;
        this.btnMain = null;
    }
}
