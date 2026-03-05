<?php 
require('../../../functions_helpers.php');
require('../../../proctoring_helpers.php');
check_session();
$course_code = $_GET['course_code'];
$module_id = 51; // ID del módulo de foto
$unique_course_id = check_permission_employee_course($course_code);
$emp_unique_id = $CI->session->userdata('employee_data')['user_id'];

// Verificar si ya existe foto de perfil
if (check_proctoring_photo($emp_unique_id, $unique_course_id)) {
    header("Location: module/leccion/index.php?course_code=" . $course_code);
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificación de Identidad - Proctoring</title>
    <link rel="icon" type="image/x-icon" href="./assets/img/aris-favicon.ico">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.1/css/all.css">
    <style>
        body {
            background-color: #f4f6f8;
            min-height: 100vh;
            font-family: 'DM Sans', 'Arial', sans-serif;
        }
        
        /* Layout Principal */
        .verification-wrapper {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .header-bar {
            background: white;
            padding: 1rem 2rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .main-content {
            flex: 1;
            display: flex;
        }

        /* Panel Izquierdo - Instrucciones */
        .left-panel {
            flex: 0 0 40%;
            background: white;
            padding: 3rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        /* Panel Derecho - Cámara */
        .right-panel {
            flex: 1;
            background: #eef2f6;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            padding: 2rem;
        }

        /* Tarjetas de Instrucción */
        .instruction-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin: 2rem 0;
        }

        .instruction-card {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .instruction-icon {
            font-size: 1.2rem;
            color: #1e3a8a;
        }

        .instruction-title {
            font-weight: bold;
            font-size: 0.9rem;
            color: #1e3a8a;
        }

        .instruction-desc {
            font-size: 0.8rem;
            color: #64748b;
        }

        /* Contenedor de Cámara */
        .camera-container-wrapper {
            width: 100%;
            max-width: 640px;
            aspect-ratio: 4/3;
            background: #1e3a8a;
            border-radius: 20px;
            overflow: hidden;
            position: relative;
            box-shadow: 0 20px 50px rgba(0,0,0,0.1);
        }

        #camera-feed, #photo-preview {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transform: scaleX(-1); /* Espejo */
        }

        /* Overlay de Rostro */
        .face-overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 45%;
            height: 70%;
            border: 2px dashed rgba(255,255,255,0.5);
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            box-shadow: 0 0 0 9999px rgba(30, 58, 138, 0.5);
            pointer-events: none;
            z-index: 10;
        }

        .camera-inactive-message {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #64748b;
            text-align: center;
            font-size: 0.9rem;
            width: 80%;
            z-index: 5;
        }

        .camera-inactive-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            color: #94a3b8;
        }

        .overlay-text {
            position: absolute;
            top: 15%;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 0.5rem 1.5rem;
            border-radius: 20px;
            font-weight: bold;
            font-size: 0.8rem;
            color: #1e3a8a;
            z-index: 11;
        }

        /* Botones */
        .btn-primary-custom {
            background: #1e3a8a;
            color: white;
            border: none;
            padding: 1rem;
            border-radius: 10px;
            width: 100%;
            font-weight: bold;
            margin-bottom: 1rem;
            transition: all 0.3s;
        }

        .btn-primary-custom:hover:not(:disabled) {
            background: #172554;
            transform: translateY(-2px);
        }

        .btn-primary-custom:disabled {
            background: #94a3b8;
            cursor: not-allowed;
        }

        .btn-outline-custom {
            background: transparent;
            border: 2px solid #e2e8f0;
            color: #64748b;
            padding: 1rem;
            border-radius: 10px;
            width: 100%;
            font-weight: bold;
        }

        /* Responsive Mobile */
        @media (max-width: 992px) {
            .main-content {
                flex-direction: column;
            }
            
            .left-panel {
                padding: 1.5rem;
                order: 2; /* Instrucciones abajo en móvil si se prefiere, o arriba */
                order: 1; /* Instrucciones primero */
            }

            .right-panel {
                padding: 1rem;
                order: 2; /* Cámara después */
                min-height: 400px;
            }
        }

        /* Modal Política */
        .modal-policy .modal-content {
            border-radius: 15px;
            border: none;
        }
        .policy-highlight {
            font-weight: bold;
            color: #1e3a8a;
        }
        
        /* Ajuste de Checkbox */
        .form-check-input {
            width: 1.2em;
            height: 1.2em;
            margin-top: 0.2em;
            vertical-align: top;
            background-color: #fff;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            border: 1px solid rgba(0,0,0,.25);
            appearance: none;
            print-color-adjust: exact;
            margin-left: 0.1em !important;
        }
        .form-check-input:checked {
            background-color: #1e3a8a;
            border-color: #1e3a8a;
        }
    </style>
</head>
<body>

    <div class="verification-wrapper">
        <!-- Header -->
        <div class="header-bar">
            <div class="d-flex align-items-center gap-2">
            </div>
            <div class="badge bg-light text-dark border">
                <i class="fas fa-lock me-1"></i> CONEXIÓN SEGURA
            </div>
        </div>

        <div class="main-content">
            <!-- Panel Izquierdo: Instrucciones y Formulario -->
            <div class="left-panel">
                <h2 class="fw-bold mb-3" style="color: #0f172a;">Autorización para Captura de Imagen</h2>
                <p class="text-muted mb-4">
                    La fotografía será utilizada únicamente para verificación interna y validación de identidad en tiempo real.
                </p>

                <!-- Grid de Instrucciones -->
                <div class="instruction-grid">
                    <div class="instruction-card">
                        <i class="fas fa-sun instruction-icon"></i>
                        <div>
                            <div class="instruction-title">Buena iluminación</div>
                            <div class="instruction-desc">Evita sombras fuertes</div>
                        </div>
                    </div>
                    <div class="instruction-card">
                        <i class="fas fa-eye instruction-icon"></i>
                        <div>
                            <div class="instruction-title">Mira directamente</div>
                            <div class="instruction-desc">Hacia el lente</div>
                        </div>
                    </div>
                    <div class="instruction-card">
                        <i class="fas fa-user-circle instruction-icon"></i>
                        <div>
                            <div class="instruction-title">Rostro centrado</div>
                            <div class="instruction-desc">Dentro del recuadro</div>
                        </div>
                    </div>
                    <div class="instruction-card">
                        <i class="fas fa-ban instruction-icon"></i>
                        <div>
                            <div class="instruction-title">Sin accesorios</div>
                            <div class="instruction-desc">Gafas o sombreros</div>
                        </div>
                    </div>
                </div>

                <!-- Checkbox Consentimiento -->
                <div class="form-check mb-4 p-3 bg-light rounded border d-flex align-items-start">
                    <input class="form-check-input mt-1 flex-shrink-0" type="checkbox" id="consentCheckbox">
                    <label class="form-check-label ms-2" for="consentCheckbox" style="font-size: 0.9rem;">
                        <strong>Acepto los términos de Habeas Data para el tratamiento de mis datos personales.</strong>
                        <div class="text-muted mt-1" style="font-size: 0.8rem;">
                            La información es interna, confidencial y no tiene fines comerciales.
                        </div>
                        <a href="#" class="text-primary text-decoration-none fw-bold mt-1 d-block" data-bs-toggle="modal" data-bs-target="#policyModal">
                            Política de Tratamiento de Datos Personales <i class="fas fa-external-link-alt small"></i>
                        </a>
                    </label>
                </div>

                <!-- Botones de Acción -->
                <div id="initial-buttons">
                    <button id="btn-action-main" class="btn-primary-custom" disabled>
                        <i class="fas fa-camera me-2"></i> Continuar y tomar foto
                    </button>
                    <button onclick="window.history.back()" class="btn-outline-custom">
                        Cancelar proceso
                    </button>
                </div>

                <!-- Botones de Confirmación (Ocultos inicialmente) -->
                <div id="confirmation-buttons" style="display: none;">
                    <button id="btn-confirm-photo" class="btn-primary-custom mb-2" style="background-color: #10b981;">
                        <i class="fas fa-check me-2"></i> Confirmar y Enviar
                    </button>
                    <button id="btn-retake-photo" class="btn-outline-custom">
                        <i class="fas fa-redo me-2"></i> Tomar de nuevo
                    </button>
                </div>

                <!-- Footer oculto para compatibilidad con JS existente -->
                <div style="display: none;">
                    <button id="btn-start-camera"></button>
                    <button id="btn-capture"></button>
                    <button id="btn-retake"></button>
                    <button id="btn-send"></button>
                </div>
            </div>

            <!-- Panel Derecho: Cámara -->
            <div class="right-panel">
                <div class="camera-container-wrapper">
                    <!-- Overlay Text -->
                    <div class="overlay-text" style="display:none;">ALINEA TU ROSTRO</div>
                    
                    <!-- Overlay Shape -->
                    <div class="face-overlay" style="display:none;"></div>

                    <!-- Mensaje Cámara Inactiva -->
                    <div id="camera-inactive" class="camera-inactive-message">
                        <i class="fas fa-video-slash camera-inactive-icon"></i>
                        <br>
                        La cámara se activará en el siguiente paso
                    </div>
                    
                    <!-- Video Feed -->
                    <video id="camera-feed" autoplay playsinline muted style="display:none;"></video>
                    
                    <!-- Photo Preview Canvas (Hidden initially) -->
                    <canvas id="photo-preview" style="display: none;"></canvas>

                    <!-- Loading State -->
                    <div class="loading position-absolute top-50 start-50 translate-middle text-white text-center" style="display: none; z-index: 20;">
                        <i class="fas fa-spinner fa-spin fa-3x mb-3"></i>
                        <div>Procesando...</div>
                    </div>
                </div>
                
                <div class="position-absolute bottom-0 mb-3 text-muted small">
                    <i class="fas fa-lock"></i> Procesamiento seguro y encriptado
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Política (Mismo contenido solicitado) -->
    <div class="modal fade modal-policy" id="policyModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-white border-bottom-0">
                    <h5 class="modal-title fw-bold" style="color: #1e3a8a;">
                        <i class="fas fa-shield-alt me-2"></i> Política de Tratamiento de Datos Personales
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body px-5 pb-5 pt-0">
                    <hr class="mb-4">
                    <div style="text-align: justify; line-height: 1.8; color: #334155;">
                        <p>La información personal suministrada por los usuarios, incluida la <span class="policy-highlight">captura de imagen facial</span>, será tratada de manera <span class="policy-highlight">confidencial y segura</span>, conforme a la normativa vigente en materia de protección de datos personales.</p>
                        
                        <p>Los datos recolectados serán utilizados <span class="policy-highlight">exclusivamente para fines internos de la empresa</span>, relacionados con procesos de <span class="policy-highlight">verificación de identidad, control, seguridad y cumplimiento operativo</span>.</p>
                        
                        <p>En ningún caso la información será utilizada con <span class="policy-highlight">fines comerciales, publicitarios o lucrativos</span>, ni será vendida, cedida o transferida a terceros no autorizados.</p>
                        
                        <p>La empresa contratante implementa las <span class="policy-highlight">medidas técnicas, administrativas y organizativas necesarias</span> para garantizar la protección de los datos personales, evitando su pérdida, uso indebido, acceso no autorizado o divulgación.</p>
                        
                        <p>El titular de los datos podrá ejercer en cualquier momento sus derechos de <span class="policy-highlight">acceso, actualización, rectificación y supresión</span>, así como revocar la autorización otorgada, de acuerdo con los canales establecidos por la empresa.</p>
                        
                        <p>Al aceptar esta política, el usuario autoriza de manera <span class="policy-highlight">libre, previa, expresa e informada</span> el tratamiento de sus datos personales para los fines aquí descritos.</p>
                    </div>
                </div>
                <div class="modal-footer border-top-0 justify-content-center pb-4">
                    <button type="button" class="btn btn-primary px-5 py-2 rounded-pill fw-bold" data-bs-dismiss="modal" style="background: #1e3a8a;">Entendido</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Éxito -->
    <div class="modal fade" id="successModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content text-center p-4" style="border-radius: 20px;">
                <div class="modal-body">
                    <div class="mb-3 text-success">
                        <i class="fas fa-check-circle fa-4x"></i>
                    </div>
                    <h4 class="fw-bold mb-3" style="color: #1e3a8a;">¡Foto capturada con éxito!</h4>
                    <p class="text-muted mb-4">
                        Hemos verificado tu identidad correctamente.
                    </p>
                    <a href="module/leccion/index.php?course_code=<?php echo $course_code; ?>" class="btn btn-primary btn-lg rounded-pill px-5 fw-bold" style="background: #1e3a8a;">
                        Continuar al Curso <i class="fas fa-arrow-right ms-2"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="./plugins/libs/jquery-3.3.1.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"></script>
    <script src="./plugins/js/proctoring.js"></script>
    <script>
        // Variables del curso
        const courseData = {
            course_code: '<?php echo $course_code; ?>',
            module_id: <?php echo $module_id; ?>,
            unique_course_id: '<?php echo $unique_course_id; ?>',
            emp_unique_id: '<?php echo $emp_unique_id; ?>'
        };
        
        // Inicializar proctoring
        // NOTA: Modificamos el comportamiento para que la cámara arranque automáticamente
        // pero la captura solo se permita tras el consentimiento.
        const proctoring = new PhotoProctoring('camera-feed', 'photo-preview', courseData);

        // Lógica de UI Personalizada
        $(document).ready(function() {
            const btnMain = $('#btn-action-main');
            const checkbox = $('#consentCheckbox');
            const cameraFeed = $('#camera-feed');
            const cameraInactive = $('#camera-inactive');
            const overlayText = $('.overlay-text');
            const faceOverlay = $('.face-overlay');

            // 1. Manejo del Checkbox de Consentimiento
            checkbox.change(function() {
                if(this.checked) {
                    btnMain.prop('disabled', false);
                    
                    // Activar cámara al aceptar términos
                    cameraInactive.fadeOut();
                    cameraFeed.fadeIn();
                    overlayText.fadeIn();
                    faceOverlay.fadeIn();
                    
                    proctoring.startCamera(); 
                } else {
                    btnMain.prop('disabled', true);
                    
                    // Desactivar cámara si desmarca
                    cameraInactive.fadeIn();
                    cameraFeed.fadeOut();
                    overlayText.fadeOut();
                    faceOverlay.fadeOut();
                    
                    // Detener stream si es necesario, o simplemente ocultarlo
                    // proctoring.stopCamera(); 
                }
            });

            // 2. Iniciar cámara (pero oculta) al cargar para agilizar
            // NO, según requerimiento: "la camara se activara en el siguiente paso"
            // Entonces no iniciamos nada hasta el checkbox.

            // 3. Lógica del Botón Principal (Tomar foto)
            btnMain.click(function() {
                if (!checkbox.is(':checked')) return;

                // Paso 1: Capturar
                proctoring.takePhoto();

                // Efecto visual: Ocultar video, mostrar preview en el mismo contenedor
                cameraFeed.hide();
                $('#photo-preview').show();
                faceOverlay.fadeOut(); // Ocultar guia
                overlayText.text('REVISA TU FOTO');

                // Cambiar botones
                $('#initial-buttons').hide();
                $('#confirmation-buttons').show();
            });

            // 4. Lógica de Confirmar y Enviar
            $('#btn-confirm-photo').click(function() {
                const btn = $(this);
                const originalContent = btn.html();
                
                btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i> Enviando...');
                $('#btn-retake-photo').prop('disabled', true);
                
                overlayText.text('ENVIANDO...');
                
                // Llamar al método de envío de la clase proctoring
                proctoring.sendPhoto();
            });

            // 5. Lógica de Reintentar (Antes de enviar)
            $('#btn-retake-photo').click(function() {
                // Resetear UI
                $('#photo-preview').hide();
                cameraFeed.show();
                faceOverlay.fadeIn();
                overlayText.text('ALINEA TU ROSTRO');
                
                $('#confirmation-buttons').hide();
                $('#initial-buttons').show();
                
                // Reiniciar cámara en la clase
                proctoring.isFaceValid = false;
                proctoring.startCamera();
            });
        });
    </script>
</body>
</html>