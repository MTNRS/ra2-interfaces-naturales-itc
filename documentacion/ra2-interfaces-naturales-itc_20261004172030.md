# Reporte de proyecto

## Información de generación

- **Fecha:** 2026-10-04 17:20:30 +0200
- **Usuario:** freak
- **Equipo:** JARVIS
- **Sistema operativo:** Windows
- **Arquitectura:** x86_64
- **Directorio de ejecución:** `C:/Users/freak/Downloads/jocarsa-generador-windows-x64 (1)`
- **Proyecto documentado:** `C:/Users/freak/Documents/DAM2-entregas/ra2-interfaces-naturales-itc`
- **HMAC-SHA-256 de autenticidad:** `264bf21b3db2b712be904d10208c83525ad33b028aabef997994553281b6b7c0`

> El HMAC-SHA-256 se calcula sobre el documento completo usando un secreto incluido en el programa y 64 ceros en el propio campo del HMAC. El secreto no se escribe en el informe. Este mecanismo permite comprobar integridad y que el documento fue generado con el mismo secreto.

## Estructura del proyecto

```
C:/Users/freak/Documents/DAM2-entregas/ra2-interfaces-naturales-itc
├── .gitignore
├── 01-ejercicios
│   ├── 01-voz
│   │   └── index.html
│   ├── 02-movimiento-y-partes-cuerpo
│   │   └── README.md
│   └── 03-realidad-aumentada
│       └── README.md
├── 02-proyecto-unidad
│   └── centro-natural-itc
│       ├── aplicacion.js
│       ├── estilos.css
│       └── index.html
├── 03-criterios-evaluacion
│   └── RESPUESTAS-CRITERIOS.md
└── README.md
```

## Bases de datos SQLite

Esta sección documenta únicamente el esquema de las bases SQLite detectadas. No se vuelcan registros ni datos de usuario.

No se han encontrado bases SQLite con extensiones .db, .sqlite o .sqlite3.

## Código (intercalado)

# ra2-interfaces-naturales-itc
**README.md**
```markdown
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
```
## 01-ejercicios
### 01-voz
**index.html**
```html
<!doctype html><html lang="es"><meta charset="utf-8"><title>Práctica de voz</title><body><h1>Práctica: orden por voz</h1><button id="escuchar">Escuchar</button><p id="salida">Di «hola».</p><script>const salida=document.querySelector('#salida');document.querySelector('#escuchar').onclick=function(){const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R){salida.textContent='Reconocimiento no disponible.';return}const r=new R();r.lang='es-ES';r.onresult=e=>{const texto=e.results[0][0].transcript;salida.textContent='Has dicho: '+texto;speechSynthesis.speak(new SpeechSynthesisUtterance(texto))};r.start()};</script></body></html>
```
### 02-movimiento-y-partes-cuerpo
**README.md**
```markdown
# Práctica: cámara, pose, mano y cara

La aplicación final incorpora los tres detectores de MediaPipe: `HandLandmarker`, `PoseLandmarker` y `FaceDetector`. Se utilizan para distinguir el gesto del índice, el desplazamiento de los hombros y la presencia de la cara.

Se conservó como práctica documental porque los detectores comparten la misma cámara y se prueban juntos en el proyecto final.
```
### 03-realidad-aumentada
**README.md**
```markdown
# Práctica: superposición de realidad aumentada

La realidad aumentada se resuelve dibujando un elemento virtual en un `canvas` transparente sobre la cámara. En el proyecto final, la coordenada de la punta del índice recibida desde MediaPipe sitúa el marcador «Punto ITC» sobre la imagen real.
```
## 02-proyecto-unidad
### centro-natural-itc
**aplicacion.js**
```js
import {
  FilesetResolver,
  HandLandmarker,
  PoseLandmarker,
  FaceDetector
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";

const video = document.querySelector("#video");
const lienzo = document.querySelector("#lienzo");
const contexto = lienzo.getContext("2d");
const botonCamara = document.querySelector("#botonCamara");
const botonVoz = document.querySelector("#botonVoz");
const estadoCamara = document.querySelector("#estadoCamara");
const mensaje = document.querySelector("#mensaje");
const contenedor = document.querySelector("#incidencias");
const plantilla = document.querySelector("#plantillaTarjeta");

const incidencias = [
  { prioridad: "Alta", titulo: "VPN de oficina", detalle: "El acceso remoto de ejemplo necesita una revisión." },
  { prioridad: "Media", titulo: "Copia de seguridad", detalle: "Comprobar la última copia del entorno de demostración." },
  { prioridad: "Baja", titulo: "Inventario", detalle: "Actualizar la ficha ficticia de un equipo prestado." }
];

let indiceActivo = 0;
let camaraActiva = false;
let escuchando = false;
let manoDetector;
let poseDetector;
let caraDetector;
let ultimoGesto = 0;
let referenciaHombros = null;

function escribir(texto) {
  mensaje.textContent = texto;
}

function pintarIncidencias() {
  contenedor.innerHTML = "";
  incidencias.forEach(function(incidencia, indice) {
    const tarjeta = plantilla.content.cloneNode(true);
    const articulo = tarjeta.querySelector("article");
    tarjeta.querySelector(".prioridad").textContent = "Prioridad " + incidencia.prioridad;
    tarjeta.querySelector("h3").textContent = incidencia.titulo;
    tarjeta.querySelector(".detalle").textContent = incidencia.detalle;
    if (indice === indiceActivo) articulo.classList.add("activa");
    if (incidencia.revisada) articulo.classList.add("revisada");
    tarjeta.querySelector("button").addEventListener("click", function() { seleccionar(indice); });
    contenedor.appendChild(tarjeta);
  });
}

function cambiar(direccion) {
  indiceActivo = (indiceActivo + direccion + incidencias.length) % incidencias.length;
  pintarIncidencias();
  escribir("Incidencia activa: " + incidencias[indiceActivo].titulo + ".");
}

function seleccionar(indice = indiceActivo) {
  incidencias[indice].revisada = true;
  indiceActivo = indice;
  pintarIncidencias();
  escribir(incidencias[indice].titulo + " marcada como revisada.");
}

function dibujarEtiqueta(x, y, texto, color) {
  contexto.save();
  // El vídeo y el canvas ya se muestran como espejo con CSS.
  // No invertimos X otra vez: así el marcador queda sobre la mano real.
  contexto.translate(x, y);
  contexto.strokeStyle = color;
  contexto.lineWidth = 5;
  contexto.beginPath();
  contexto.arc(0, 0, 19, 0, Math.PI * 2);
  contexto.stroke();
  contexto.fillStyle = color;
  contexto.fillRect(25, -32, 138, 28);
  contexto.fillStyle = "#061720";
  contexto.font = "bold 14px Arial";
  contexto.fillText(texto, 33, -13);
  contexto.restore();
}

function indiceLevantado(puntos) {
  const punta = puntos[8];
  const articulacion = puntos[6];
  const palma = puntos[0];
  return punta.y < articulacion.y && punta.y < palma.y - 0.08;
}

function procesarMano(resultado) {
  if (!resultado.landmarks.length) return;
  const puntos = resultado.landmarks[0];
  const punta = puntos[8];
  dibujarEtiqueta(punta.x * lienzo.width, punta.y * lienzo.height, "Punto ITC", "#31f3c5");
  if (indiceLevantado(puntos) && performance.now() - ultimoGesto > 1800) {
    ultimoGesto = performance.now();
    seleccionar();
  }
}

function procesarPose(resultado) {
  if (!resultado.landmarks.length) return;
  const puntos = resultado.landmarks[0];
  const centro = (puntos[11].x + puntos[12].x) / 2;
  if (referenciaHombros === null) referenciaHombros = centro;
  const desplazamiento = centro - referenciaHombros;
  if (Math.abs(desplazamiento) > 0.16 && performance.now() - ultimoGesto > 1600) {
    ultimoGesto = performance.now();
    cambiar(desplazamiento > 0 ? -1 : 1);
    referenciaHombros = centro;
  }
}

function procesarCara(resultado) {
  if (!resultado.detections.length) return;
  const caja = resultado.detections[0].boundingBox;
  const x = caja.originX + caja.width / 2;
  const y = caja.originY - 8;
  dibujarEtiqueta(x, y, "Usuario detectado", "#ffd35a");
}

async function cargarDetectores() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
  );
  manoDetector = await HandLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task" },
    runningMode: "VIDEO", numHands: 1
  });
  poseDetector = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/lite/float16/latest/pose_landmarker_lite.task" },
    runningMode: "VIDEO", numPoses: 1
  });
  caraDetector = await FaceDetector.createFromOptions(vision, {
    baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite" },
    runningMode: "VIDEO"
  });
}

function bucle() {
  if (!camaraActiva) return;
  lienzo.width = video.videoWidth;
  lienzo.height = video.videoHeight;
  contexto.clearRect(0, 0, lienzo.width, lienzo.height);
  if (video.readyState >= 2) {
    const ahora = performance.now();
    procesarMano(manoDetector.detectForVideo(video, ahora));
    procesarPose(poseDetector.detectForVideo(video, ahora));
    procesarCara(caraDetector.detectForVideo(video, ahora));
  }
  requestAnimationFrame(bucle);
}

async function iniciarCamara() {
  try {
    botonCamara.disabled = true;
    escribir("Cargando los detectores de cara, mano y pose...");
    const flujo = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = flujo;
    await video.play();
    await cargarDetectores();
    camaraActiva = true;
    botonVoz.disabled = false;
    estadoCamara.textContent = "Cámara activa: mueve los hombros o levanta el índice.";
    escribir("Interfaz natural lista. La etiqueta sobre el dedo es realidad aumentada.");
    bucle();
  } catch (error) {
    botonCamara.disabled = false;
    escribir("No se pudo usar la cámara: " + error.message);
  }
}

function ejecutarOrden(texto) {
  const orden = texto.toLowerCase();
  if (orden.includes("siguiente")) cambiar(1);
  else if (orden.includes("anterior")) cambiar(-1);
  else if (orden.includes("seleccionar") || orden.includes("revisar")) seleccionar();
  else if (orden.includes("ayuda")) escribir("Puedes decir siguiente, anterior, seleccionar, ayuda o parar.");
  else if (orden.includes("parar")) { speechSynthesis.cancel(); escribir("Voz detenida."); }
  else escribir("Orden no reconocida: " + texto);
}

function iniciarVoz() {
  const Reconocimiento = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Reconocimiento) { escribir("Este navegador no ofrece reconocimiento de voz."); return; }
  const reconocimiento = new Reconocimiento();
  reconocimiento.lang = "es-ES";
  reconocimiento.continuous = false;
  reconocimiento.onresult = function(evento) {
    const texto = evento.results[0][0].transcript;
    ejecutarOrden(texto);
    const lectura = new SpeechSynthesisUtterance(mensaje.textContent);
    lectura.lang = "es-ES";
    speechSynthesis.speak(lectura);
  };
  reconocimiento.onend = function() { escuchando = false; botonVoz.textContent = "Activar voz"; };
  reconocimiento.start();
  escuchando = true;
  botonVoz.textContent = "Escuchando...";
  escribir("Di una orden.");
}

botonCamara.addEventListener("click", iniciarCamara);
botonVoz.addEventListener("click", function() { if (!escuchando) iniciarVoz(); });
pintarIncidencias();
```
**estilos.css**
```css
:root{--azul:#123a64;--turquesa:#0fa3b1;--fondo:#edf4f7;--texto:#17212b;--alerta:#bd3e42}
*{box-sizing:border-box} body{margin:0;background:var(--fondo);color:var(--texto);font-family:Arial,sans-serif}
header{background:var(--azul);color:white;padding:28px max(24px,calc((100% - 1120px)/2));display:flex;gap:24px;justify-content:space-between;align-items:center}
h1{margin:4px 0 8px;font-size:clamp(1.7rem,4vw,2.5rem)} h2{margin-top:0}.marca{margin:0;color:#a9e7eb;font-size:.84rem;text-transform:uppercase;letter-spacing:.07em}
header p:not(.marca){margin:0;color:#dbe7ee}.acciones{display:flex;gap:10px;flex-wrap:wrap}button{border:0;border-radius:7px;padding:11px 15px;font-weight:bold;cursor:pointer;background:var(--turquesa);color:#06242a}button:disabled,.acciones button:disabled{background:#8da1af;color:#fff;cursor:not-allowed}.acciones button+button{background:white;color:var(--azul)}
main{max-width:1120px;margin:28px auto;padding:0 24px;display:grid;grid-template-columns:minmax(300px,1fr) minmax(320px,1fr);gap:24px}.visor{position:relative;min-height:410px;overflow:hidden;background:#101820;border-radius:12px;box-shadow:0 7px 22px #23364733}.visor video,.visor canvas{width:100%;height:100%;object-fit:cover;position:absolute;inset:0;transform:scaleX(-1)}.visor canvas{pointer-events:none}.estado{position:absolute;bottom:0;left:0;right:0;margin:0;padding:12px 15px;background:#0a151bcc;color:#fff;font-size:.9rem}
.panel{display:flex;flex-direction:column;gap:20px}.instrucciones,.tarjeta{background:#fff;border-radius:10px;padding:18px;box-shadow:0 3px 12px #2336471a}.instrucciones ul{padding-left:20px;line-height:1.5}.mensaje{background:#e1f5f6;border-left:4px solid var(--turquesa);padding:10px;margin:0}.tarjetas{display:grid;gap:12px}.tarjeta{border:3px solid transparent;transition:.2s}.tarjeta.activa{border-color:var(--turquesa);transform:translateX(5px)}.tarjeta.revisada{opacity:.58}.tarjeta h3{margin:5px 0}.tarjeta button{background:var(--azul);color:#fff}.prioridad{margin:0;color:var(--alerta);font-weight:bold;font-size:.85rem}.detalle{line-height:1.45}@media(max-width:760px){header{align-items:flex-start;flex-direction:column}main{grid-template-columns:1fr}.visor{min-height:360px}}
```
**index.html**
```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Centro natural ITC</title>
  <link rel="stylesheet" href="estilos.css">
</head>
<body>
  <header>
    <div>
      <p class="marca">integra tech consulting · prototipo académico</p>
      <h1>Centro natural de incidencias</h1>
      <p>Consulta un panel sencillo sin ratón: habla, señala o desplázate.</p>
    </div>
    <div class="acciones">
      <button id="botonCamara">Iniciar cámara</button>
      <button id="botonVoz" disabled>Activar voz</button>
    </div>
  </header>

  <main>
    <section class="visor" aria-label="Cámara y realidad aumentada">
      <video id="video" autoplay playsinline muted></video>
      <canvas id="lienzo"></canvas>
      <p id="estadoCamara" class="estado">Cámara apagada.</p>
    </section>

    <section class="panel" aria-live="polite">
      <div class="instrucciones">
        <h2>Interacción natural</h2>
        <ul>
          <li><strong>Voz:</strong> siguiente, anterior, seleccionar, ayuda o parar.</li>
          <li><strong>Índice levantado:</strong> selecciona la incidencia activa.</li>
          <li><strong>Hombros:</strong> mueve el cuerpo a izquierda o derecha para navegar.</li>
        </ul>
        <p id="mensaje" class="mensaje">Pulsa «Iniciar cámara» para comenzar.</p>
      </div>

      <h2>Incidencias ficticias</h2>
      <div id="incidencias" class="tarjetas"></div>
    </section>
  </main>

  <template id="plantillaTarjeta">
    <article class="tarjeta">
      <p class="prioridad"></p>
      <h3></h3>
      <p class="detalle"></p>
      <button>Marcar como revisada</button>
    </article>
  </template>

  <script type="module" src="aplicacion.js"></script>
</body>
</html>
```
## 03-criterios-evaluacion
**RESPUESTAS-CRITERIOS.md**
```markdown
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
```
