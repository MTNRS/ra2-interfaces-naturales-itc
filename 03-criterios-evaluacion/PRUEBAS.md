# Pruebas realizadas · 26/10/2026

- `node --test gestos.test.mjs`: cuatro pruebas superadas de índice, datos
  incompletos, calibración de hombros y órdenes por palabras completas.
- Reconocimiento **real** de `orden-siguiente.wav` con Microsoft Speech
  Recognizer 8.0 es-ES: «siguiente», confianza 0,83593553. Cambio visible desde
  VPN de oficina a Copia de seguridad, usando el endpoint local.
- MediaPipe: una pasada de 255 fotogramas, 137 con mano, 254 con pose y 139
  con detección facial. Diez acciones: una orden de voz, cinco selecciones con
  mano y cuatro navegaciones por desplazamiento de hombros en la muestra.
- La inspección visual detectó falsos positivos de cara sobre una mano; se
  elevó la confianza mínima de FaceDetector a 0,85. Los números de la pasada
  anterior no son una medida de precisión ni la validación de esa corrección.
- El audio de Web Speech devolvió `network`. No se sustituyó su resultado por
  una transcripción inventada; se verificó el motor local con el archivo real.
- La prueba no activa cámara o micrófono. No prueba movimiento humano espontáneo.
- La superposición visual sigue puntos detectados en vídeo; es RA 2D, no anclaje 3D.

El vídeo `DEMO-RA2.mp4` es captura continua del navegador durante la ejecución,
con las muestras y los límites visibles en el propio panel.

## Pasada final, después de elevar el umbral facial

258 fotogramas procesados, mano en 137, pose en 257 y cara en 61.
Diez acciones observadas: una por reconocimiento local de audio, cinco por
índice y cuatro por desplazamiento de hombros. Son contadores de ejecución,
no medidas de precisión sobre una población. La demo final tiene 120 fotogramas
capturados del navegador a 5 fps (24 segundos), sin errores de captura.
