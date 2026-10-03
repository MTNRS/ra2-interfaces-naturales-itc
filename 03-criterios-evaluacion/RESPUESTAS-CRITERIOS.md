# Respuestas a los criterios de evaluación - RA2

## Proyecto presentado

`Centro natural de incidencias ITC` es un prototipo local con datos ficticios. Permite consultar un panel sin ratón mediante voz, desplazamiento del cuerpo y un gesto con el índice. La cámara muestra marcadores virtuales superpuestos sobre la imagen real.

| Criterio | Respuesta y evidencia |
| --- | --- |
| a) Herramientas de aprendizaje automático | Se investigan y utilizan `HandLandmarker`, `PoseLandmarker` y `FaceDetector` de MediaPipe Tasks Vision. Los apuntes también muestran Web Speech y Ollama; se elige Web Speech para no necesitar un modelo local. |
| b) Interfaz natural creada | El panel permite navegar incidencias ficticias con voz, pose y mano. Su entrada es `02-proyecto-unidad/centro-natural-itc/index.html`. |
| c) Reconocimiento de voz | `aplicacion.js` usa `SpeechRecognition` o `webkitSpeechRecognition`, en español. Las órdenes `siguiente`, `anterior`, `seleccionar`, `ayuda` y `parar` realizan acciones visibles. `SpeechSynthesisUtterance` lee la respuesta. |
| d) Movimiento del cuerpo | `PoseLandmarker` calcula el centro de los hombros. Al desplazarse a izquierda o derecha cambia la incidencia activa; se espera un tiempo entre gestos para evitar repeticiones. |
| e) Partes del cuerpo | `HandLandmarker` detecta los puntos de la mano y comprueba el índice levantado para revisar una incidencia. `FaceDetector` detecta la cara del usuario. |
| f) Realidad aumentada | Un `canvas` transparente se coloca sobre el vídeo. La coordenada de la punta del índice sitúa el marcador virtual «Punto ITC» sobre la cámara; la cara recibe otra etiqueta. |

## Ampliación investigada

Los tres detectores comparten una sola cámara. Esto evita abrir varios flujos de vídeo y mantiene la interfaz sencilla. Se limita la interacción a pocas órdenes y gestos para facilitar la prueba y explicación del proyecto.

## Prueba manual

1. Ejecutar el servidor local indicado en el README y abrirlo en Chrome o Edge.
2. Aceptar la cámara y comprobar las etiquetas al mostrar cara y mano.
3. Levantar el índice y comprobar que la tarjeta activa queda revisada.
4. Desplazar los hombros a ambos lados y comprobar el cambio de tarjeta.
5. Activar la voz y probar las cinco órdenes documentadas.
