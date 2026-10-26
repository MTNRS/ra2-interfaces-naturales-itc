# RA2 - Centro natural de incidencias ITC

Entrega de Desarrollo de Interfaces, resultado de aprendizaje 2: generación de interfaces naturales de usuario.

## Estructura

- `01-ejercicios`: prácticas previas de voz, detección corporal y realidad aumentada.
- `02-proyecto-unidad`: aplicación final `centro-natural-itc`.
- `03-criterios-evaluacion`: respuestas razonadas a los criterios del RA2.

## Ejecución

La cámara y el micrófono requieren un servidor local. Desde la carpeta del proyecto:

```powershell
cd 02-proyecto-unidad\centro-natural-itc
python servidor.py
```

Abrir `http://127.0.0.1:8070` en Chrome o Edge y aceptar los permisos de cámara y micrófono. La detección usa modelos de MediaPipe descargados desde CDN, por lo que se necesita conexión a Internet la primera vez.

## Controles

- Botón **Iniciar cámara**: activa la cámara y los detectores.
- Botón **Activar voz**: reconoce órdenes en español: `siguiente`, `anterior`, `seleccionar`, `ayuda` y `parar`.
- Mano: levantar el índice selecciona la incidencia activa.
- Cuerpo: desplazar los hombros a izquierda o derecha cambia de incidencia.
- Realidad aumentada: el círculo y etiqueta ITC se dibujan sobre la punta del índice en la imagen real de la cámara.

El caso de uso utiliza incidencias ficticias y es un prototipo académico independiente.

## Prueba reproducible sin cámara ni micrófono

1. Abrir la aplicación con `python servidor.py` en Windows.
2. Pulsar **Reconocer WAV local (Windows)**. El motor es-ES instalado reconoce
   el audio sintetizado «siguiente» y cambia la incidencia activa. No se compara
   el texto con una respuesta fija: se ejecuta SpeechRecognitionEngine sobre el WAV.
3. Pulsar **Probar vídeo de muestra**: inferencia real de MediaPipe sobre fotos
   de prueba animadas, marcadores superpuestos y acciones de mano y pose.
4. Pulsar **Detener sensores** para liberar cámara y detener reconocimiento.

La prueba local requiere el reconocedor español de Windows instalado. No se
instala automáticamente ningún motor. La alternativa Web Speech está implementada,
pero durante la verificación devolvió `network`: no se considera superada.
El vídeo de muestra contiene fotografías animadas, no una persona moviéndose
espontáneamente. La RA es una superposición 2D, sin anclaje espacial 3D.

Pruebas de lógica: `node --test gestos.test.mjs` desde la carpeta de la aplicación.
No se necesita `npm install`. Las dependencias visuales se descargan de CDN.
La aplicación es independiente de producción y de sus datos.

La auditoría está en `03-criterios-evaluacion/AUDITORIA-ITC.md`. La grabación real
se guarda como `DEMO-RA2.mp4` en esta misma carpeta. `INFORME.md` es el documento
para entregar; no se ha enviado nada al portal de clase.
