# Auditoría de procedencia y alcance · 26/10/2026

Asignatura: 0488 Desarrollo de interfaces. Unidad: generación de interfaces
naturales de usuario. Resultado de aprendizaje: RA2, criterios a–f.

La práctica original ya existía en `MTNRS/ra2-interfaces-naturales-itc`.
Se conserva su repositorio y se organiza bajo la carpeta de asignatura.

## Qué procede de ITC

El caso de uso es la gestión de incidencias del ERP. La revisión local de
`client-quality-review/itc-rest-audit-20261023/backend/saas_runtime.py`
confirma la ruta `POST /api/saas/public/incidents` y el uso de referencias,
prioridad y asignación a tickets (zona de la línea 3841). Es una instantánea
de código auditada; no se ha consultado producción ni creado tickets reales.

Las incidencias VPN, copias e inventario son ficticias. La detección corporal,
la voz y la superposición gráfica son una **extensión académica**, no funciones
extraídas de producción ni una integración empresarial ya desplegada.
La continuidad con RA1 es el mismo contexto ITC y los eventos de interfaz;
se mantiene una aplicación independiente para estudiar voz y visión.

## Herramientas

- HTML/CSS, canvas y editor visual del navegador: composición de la interfaz.
- MediaPipe Tasks Vision: modelos preentrenados de mano, pose y cara.
- Web Speech: transcripción y síntesis del navegador; no entrena un modelo.
- Herramientas alternativas: TensorFlow.js para modelos web, OpenCV para
  procesamiento de imagen; implican más código o preparación para este RA.

Documentación primaria consultada el 26/10/2026:

- [MediaPipe HandLandmarker](https://developers.google.com/edge/api/mediapipe/js/tasks-vision.handlandmarker)
- [MediaPipe Pose en web](https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js)
- [SpeechRecognition y pista de audio](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/start)

## Muestras y límites

Las muestras visuales proceden de los archivos de pruebas de MediaPipe:
`https://storage.googleapis.com/mediapipe-assets/pose.jpg`,
`pointing_up.jpg` y `portrait.jpg`. Se compone un vídeo con fotografías y
desplazamiento de imagen. Permite ejercitar inferencias sobre fotogramas reales;
no es evidencia de movimiento corporal espontáneo ni una cámara en directo.
El audio «siguiente» se sintetiza localmente con Microsoft Helena (es-ES).
La síntesis no acredita reconocimiento: solo un evento real `result` y su
transcripción pueden demostrar que el reconocedor lo ha entendido.

La voz puede utilizar el proveedor del navegador. La prueba con archivo no
solicita el micrófono como alternativa si falla. La cámara solo se inicia con
su botón y consentimiento del usuario. Detener libera las pistas de cámara.

La realidad aumentada implementada es una superposición 2D sobre vídeo,
vinculada a puntos detectados. No es WebXR, SLAM, reconstrucción 3D ni anclaje
en el espacio. No se interpreta que esas capacidades estén implementadas.

## Reparaciones realizadas

- Ruta del modelo de pose corregida tras observar HTTP 404.
- Carga diferida de modelos: la red no bloquea el panel ni la voz.
- Voz independiente de cámara, gestión de errores y parada de sensores.
- Una inferencia por nuevo fotograma, coordenadas de espejo y texto legible.
- Hombros con baja visibilidad descartados; órdenes por palabras completas.
- Módulo de cálculos con cuatro pruebas automáticas; esas pruebas no sustituyen
  la prueba de modelos ni acreditan reconocimiento de voz.

## Reconocimiento local verificado

Web Speech sobre el audio de prueba devolvió `network`. Se ha añadido una ruta
local fija que ejecuta el motor es-ES ya instalado en Windows sobre la muestra WAV.
La respuesta real ha sido «siguiente», confianza 0,83593553; el navegador ejecutó
la orden y cambió a Copia de seguridad. No se ha usado micrófono ni se ha enviado
el WAV a un proveedor para esta verificación local. El endpoint no admite archivos,
rutas ni comandos de usuario y el servidor escucha exclusivamente en 127.0.0.1.
