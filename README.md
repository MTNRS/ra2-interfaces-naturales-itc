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
python -m http.server 8000
```

Abrir `http://localhost:8000` en Chrome o Edge y aceptar los permisos de cámara y micrófono. La detección usa modelos de MediaPipe descargados desde CDN, por lo que se necesita conexión a Internet la primera vez.

## Controles

- Botón **Iniciar cámara**: activa la cámara y los detectores.
- Botón **Activar voz**: reconoce órdenes en español: `siguiente`, `anterior`, `seleccionar`, `ayuda` y `parar`.
- Mano: levantar el índice selecciona la incidencia activa.
- Cuerpo: desplazar los hombros a izquierda o derecha cambia de incidencia.
- Realidad aumentada: el círculo y etiqueta ITC se dibujan sobre la punta del índice en la imagen real de la cámara.

El caso de uso utiliza incidencias ficticias y es un prototipo académico independiente.
