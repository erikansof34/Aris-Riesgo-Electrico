# Guía de Implementación de Proctoring en ARIS-Riesgo-Electrico

El curso **aris-riesgo-electrico** ahora incorpora un sistema de verificación de identidad mediante captura de foto (proctoring). Se ha replicado íntegramente la lógica utilizada en el curso `microcapsula-datafono`.

## 1. Archivos añadidos

Todos los siguientes archivos fueron creados/copied en la raíz del curso:

- `proctoring_helpers.php`      : funciones auxiliares y creación de tabla.
- `check_proctoring.php`       : API para consultar si el usuario ya tomó foto.
- `upload.php`                 : script tradicional que guarda imagen en BD.
- `upload_simple.php`          : versión moderna con subida a AWS S3.
- `save_signature.php`         : opcional para almacenar firma del alumno.
- `foto.php`                   : interfaz de cámara para el alumno.
- `plugins/js/proctoring.js`   : código JS que controla la cámara y validaciones.

Además se modificaron:

- `index.php` (raíz) – se añadió el include y redirección a `foto.php`.
- `module/leccion/index.php` – misma validación dentro de la lección.

## 2. Cómo funciona

1. Al ingresar al curso (`index.php`) se verifica en la base de datos si el empleado tiene foto (`check_proctoring_photo`).
2. Si no existe, se lo redirige automáticamente a `foto.php` donde debe autorizar y tomar la fotografía.
3. La imagen se envía al servidor a través de `upload_simple.php` (o `upload.php`) y se guarda en la tabla `proctoring_photos`.
4. Una vez completada la carga, el usuario es redirigido al contenido del curso (`module/leccion/index.php`).
5. De regreso el tránsito normal permite continuar con el curso ya sin pasos adicionales.

## 3. Pruebas iniciales

1. Borrar cualquier registro anterior de la tabla `proctoring_photos` para el curso.
2. Acceder al curso como un empleado nuevo.
3. Verificar que la primera página sea `foto.php` y que se pueda tomar la foto.
4. Confirmar que la inserción se realizó correctamente (revisar tabla y/o URL en S3).
5. Volver a entrar: debe saltar la verificación y mostrar la portada directamente.

## 4. Notas importantes

* Las rutas en los archivos PHP están calculadas respecto a la estructura actual del proyecto. Si mueve alguno de los scripts debe revisar las rutas relativas (`../../../`, etc.).
* El script `upload_simple.php` incluye configuración hardcodeada de AWS; mueva esas credenciales a variables de entorno en producción.
* El bucket S3 designado (`sofactia-dev` en el ejemplo) debe existir y el usuario IAM debe tener permisos de `PutObject`.
* La tabla `proctoring_photos` se crea automáticamente mediante `create_proctoring_table()` si no existe.
* Puede extender la funcionalidad agregando campo `module_id` para identificar fotos por módulo, o exportar la foto para revisión.


> 📝 **Extra:** si lo deseas, puedes adaptar este mismo flujo para guardar una firma digital adicional, ya que la estructura y el helper soportan `signature_data`.

---

¡Listo! El proceso de proctoring ya está integralmente copiado del curso de ejemplo y habilitado en ARIS.
