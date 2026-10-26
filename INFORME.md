# Reporte de proyecto

## Información de generación

- **Fecha:** 2026-10-26 18:48:52 +0100
- **Usuario:** freak
- **Equipo:** JARVIS
- **Sistema operativo:** Windows
- **Arquitectura:** x86_64
- **Directorio de ejecución:** `C:/Users/freak/Documents/ChatGPT/Jarvis`
- **Proyecto documentado:** `C:/Users/freak/AppData/Local/Temp/ra2-informe-12302f60222a41309e67e25c1279fa5d/RA2-interfaces-naturales-itc`
- **HMAC-SHA-256 de autenticidad:** `f7a5bcdb765c1c0009c5c7259d77105e28229d9c5edb43d13e1ca0bf8b56aa1c`

> El HMAC-SHA-256 se calcula sobre el documento completo usando un secreto incluido en el programa y 64 ceros en el propio campo del HMAC. El secreto no se escribe en el informe. Este mecanismo permite comprobar integridad y que el documento fue generado con el mismo secreto.

## Estructura del proyecto

```
C:/Users/freak/AppData/Local/Temp/ra2-informe-12302f60222a41309e67e25c1279fa5d/RA2-interfaces-naturales-itc
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
│       ├── gestos.js
│       ├── gestos.test.mjs
│       ├── index.html
│       ├── muestras
│       │   └── manifest.json
│       ├── package.json
│       ├── reconocer-muestra.ps1
│       └── servidor.py
├── 03-criterios-evaluacion
│   ├── AUDITORIA-ITC.md
│   ├── PRUEBAS.md
│   └── RESPUESTAS-CRITERIOS.md
└── README.md
```

## Bases de datos SQLite

Esta sección documenta únicamente el esquema de las bases SQLite detectadas. No se vuelcan registros ni datos de usuario.

No se han encontrado bases SQLite con extensiones .db, .sqlite o .sqlite3.

## Código (intercalado)

# RA2-interfaces-naturales-itc
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
// Carga diferida: un fallo de red de los modelos no bloquea el panel ni la voz.
import {indiceLevantado, desplazamientoHombros, reconocerOrden} from './gestos.js';

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
let ultimoGestoMano = 0;
let ultimoGestoPose = 0;
let referenciaHombros = null;
let reconocimientoActivo = null;
let ultimoFotograma = -1;
let urlMuestra = null;
const medidas = {fotogramas:0, manos:0, poses:0, caras:0, acciones:0, gestosMano:0, gestosCuerpo:0};

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
  medidas.acciones++;
  indiceActivo = (indiceActivo + direccion + incidencias.length) % incidencias.length;
  pintarIncidencias();
  escribir("Incidencia activa: " + incidencias[indiceActivo].titulo + ".");
}

function seleccionar(indice = indiceActivo) {
  medidas.acciones++;
  incidencias[indice].revisada = true;
  indiceActivo = indice;
  pintarIncidencias();
  escribir(incidencias[indice].titulo + " marcada como revisada.");
}

function dibujarEtiqueta(x, y, texto, color) {
  contexto.save();
  // El vídeo y el canvas ya se muestran como espejo con CSS.
  // No invertimos X otra vez: así el marcador queda sobre la mano real.
  contexto.translate(lienzo.width - x, y);
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

function procesarMano(resultado) {
  if (!resultado.landmarks.length) return;
  medidas.manos++;
  const puntos = resultado.landmarks[0];
  const punta = puntos[8];
  dibujarEtiqueta(punta.x * lienzo.width, punta.y * lienzo.height, "Punto ITC", "#31f3c5");
  if (indiceLevantado(puntos) && performance.now() - ultimoGestoMano > 1800) {
    ultimoGestoMano = performance.now();
    medidas.gestosMano++;
    seleccionar();
  }
}

function procesarPose(resultado) {
  if (!resultado.landmarks.length) return;
  medidas.poses++;
  const puntos = resultado.landmarks[0];
  const calculo = desplazamientoHombros(puntos, referenciaHombros);
  if (!calculo) return;
  const {centro, desplazamiento} = calculo;
  if (referenciaHombros === null) referenciaHombros = centro;
  if (Math.abs(desplazamiento) > 0.16 && performance.now() - ultimoGestoPose > 1600) {
    ultimoGestoPose = performance.now();
    medidas.gestosCuerpo++;
    cambiar(desplazamiento > 0 ? -1 : 1);
    referenciaHombros = centro;
  }
}

function procesarCara(resultado) {
  if (!resultado.detections.length) return;
  medidas.caras++;
  const caja = resultado.detections[0].boundingBox;
  const x = caja.originX + caja.width / 2;
  const y = caja.originY - 8;
  dibujarEtiqueta(x, y, "Usuario detectado", "#ffd35a");
}

async function cargarDetectores() {
  if (manoDetector && poseDetector && caraDetector) return;
  const {FilesetResolver, HandLandmarker, PoseLandmarker, FaceDetector} = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/+esm');
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
  );
  manoDetector = await HandLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task" },
    runningMode: "VIDEO", numHands: 1
  });
  poseDetector = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task" },
    runningMode: "VIDEO", numPoses: 1
  });
  caraDetector = await FaceDetector.createFromOptions(vision, {
    baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite" },
    runningMode: "VIDEO", minDetectionConfidence: 0.85
  });
}

function bucle() {
  if (!camaraActiva) return;
  lienzo.width = video.videoWidth;
  lienzo.height = video.videoHeight;
  contexto.clearRect(0, 0, lienzo.width, lienzo.height);
  if (video.readyState >= 2 && video.currentTime !== ultimoFotograma) {
    ultimoFotograma = video.currentTime;
    medidas.fotogramas++;
    const ahora = performance.now();
    procesarMano(manoDetector.detectForVideo(video, ahora));
    procesarPose(poseDetector.detectForVideo(video, ahora));
    procesarCara(caraDetector.detectForVideo(video, ahora));
    document.querySelector('#evidencia').textContent = `Inferencias reales: ${medidas.fotogramas} fotogramas · mano ${medidas.manos} · pose ${medidas.poses} · cara ${medidas.caras} · acciones ${medidas.acciones} (mano ${medidas.gestosMano}, cuerpo ${medidas.gestosCuerpo})`;
  }
  requestAnimationFrame(bucle);
}

async function iniciarCamara() {
  try {
    detener();
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
    detener();
    botonCamara.disabled = false;
    escribir("No se pudo usar la cámara: " + error.message);
  }
}

function ejecutarOrden(texto) {
  const orden = reconocerOrden(texto);
  if (orden === 'siguiente') cambiar(1);
  else if (orden === 'anterior') cambiar(-1);
  else if (orden === 'seleccionar' || orden === 'revisar') seleccionar();
  else if (orden === 'ayuda') escribir("Puedes decir siguiente, anterior, seleccionar, ayuda o parar.");
  else if (orden === 'parar') { reconocimientoActivo?.stop(); speechSynthesis.cancel(); escribir("Voz detenida."); }
  else escribir("Orden no reconocida: " + texto);
}

function iniciarVoz(pista = null) {
  const Reconocimiento = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Reconocimiento) { escribir("Este navegador no ofrece reconocimiento de voz."); return; }
  const reconocimiento = new Reconocimiento();
  reconocimientoActivo = reconocimiento;
  reconocimiento.lang = "es-ES";
  reconocimiento.continuous = false;
  reconocimiento.onresult = function(evento) {
    const texto = evento.results[0][0].transcript;
    ejecutarOrden(texto);
    document.querySelector('#evidencia').textContent = 'Transcripción real del reconocedor: ' + texto + '. ' + mensaje.textContent;
    const lectura = new SpeechSynthesisUtterance(mensaje.textContent);
    lectura.lang = "es-ES";
    speechSynthesis.speak(lectura);
  };
  reconocimiento.onend = function() { escuchando = false; botonVoz.textContent = "Activar voz"; };
  reconocimiento.onerror = evento => escribir('Reconocimiento no completado: ' + evento.error + '. No se ha simulado una transcripción.');
  if (pista) reconocimiento.start(pista);
  else reconocimiento.start();
  escuchando = true;
  botonVoz.textContent = "Escuchando...";
  escribir("Di una orden.");
}

function detener() {
  camaraActiva = false;
  reconocimientoActivo?.abort();
  video.srcObject?.getTracks().forEach(pista => pista.stop());
  video.srcObject = null;
  video.pause();
  video.removeAttribute('src');
  ultimoFotograma = -1;
  referenciaHombros = null;
  botonCamara.disabled = false;
  estadoCamara.textContent = 'Sensores detenidos.';
}

async function probarMuestra() {
  detener();
  document.querySelector('#botonMuestra').disabled = true;
  try {
    escribir('Cargando MediaPipe para inferir sobre el vídeo de prueba...');
    await cargarDetectores();
    video.src = 'muestras/gestos-prueba.mp4';
    video.loop = false;
    await video.play();
    camaraActiva = true;
    estadoCamara.textContent = 'Muestra de prueba: imágenes animadas; inferencia real, sin cámara.';
    escribir('Detectando mano, cuerpo y cara del archivo de vídeo.');
    bucle();
  } catch(error) {
    detener();
    escribir('No se pudo procesar la muestra: ' + error.message);
  } finally { document.querySelector('#botonMuestra').disabled = false; }
}

document.querySelector('#botonMuestra').addEventListener('click', probarMuestra);
document.querySelector('#botonDetener').addEventListener('click', detener);
document.querySelector('#botonAudioLocal').addEventListener('click', async evento => {
  evento.target.disabled = true;
  escribir('Reconociendo el archivo WAV con el motor español local de Windows...');
  try {
    const respuesta = await fetch('/api/reconocer-muestra', {method:'POST'});
    const resultado = await respuesta.json();
    if (!respuesta.ok) throw new Error(resultado.error);
    ejecutarOrden(resultado.texto);
    document.querySelector('#evidencia').textContent = `Transcripción real local: ${resultado.texto} · confianza ${Number(resultado.confianza).toFixed(2)}. ${mensaje.textContent}`;
  } catch(error) { escribir('Reconocimiento local pendiente: ' + error.message); }
  finally { evento.target.disabled = false; }
});
document.querySelector('#botonAudio').addEventListener('click', async () => {
  const audio = new Audio('muestras/orden-siguiente.wav');
  try {
    if (!audio.captureStream) throw new Error('El navegador no permite capturar pistas de audio.');
    await new Promise((resolve,reject) => {audio.oncanplay=resolve;audio.onerror=reject;audio.load();});
    const flujo = audio.captureStream();
    await audio.play();
    const pista = flujo.getAudioTracks()[0];
    if (!pista) throw new Error('No se ha obtenido una pista de audio.');
    iniciarVoz(pista);
  } catch(error) { escribir('Audio de prueba no reconocido: ' + error.message + '. No se usa el micrófono como alternativa.'); }
});
video.addEventListener('ended', () => {camaraActiva=false;estadoCamara.textContent='Muestra terminada. Consulta los contadores de detección.';});
window.addEventListener('pagehide', detener);

botonCamara.addEventListener("click", iniciarCamara);
botonVoz.addEventListener("click", function() { if (!escuchando) iniciarVoz(); });
pintarIncidencias();





if (new URLSearchParams(location.search).get('demo') === '1') document.body.classList.add('demo');
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

.visor{min-height:0;aspect-ratio:4/3;align-self:start}.visor video{object-fit:fill}.visor canvas{transform:none}#evidencia{font-size:.9rem;font-weight:bold}header .acciones{max-width:420px}


.demo header{padding:14px;display:block}.demo header h1{font-size:23px}.demo header p{font-size:12px}.demo .acciones{max-width:none;margin-top:10px}.demo button{padding:8px;font-size:11px}.demo main{grid-template-columns:1fr 1fr;padding:0 10px;gap:12px;margin:12px auto}.demo .instrucciones,.demo .tarjeta{padding:10px}.demo .panel{gap:10px;font-size:12px}.demo h2{font-size:17px}.demo .instrucciones ul{font-size:11px}.demo .instrucciones p{font-size:11px}.demo .tarjetas{gap:6px}.demo .tarjeta h3{font-size:14px}.demo .estado{font-size:11px;padding:8px}.demo #evidencia{font-size:12px}
```
**gestos.js**
```js
// Cálculos de interacción; reciben puntos del detector, no imágenes simuladas.
export function indiceLevantado(puntos) {
  if (!Array.isArray(puntos) || puntos.length < 9) return false;
  const [palma, articulacion, punta] = [puntos[0], puntos[6], puntos[8]];
  return [palma, articulacion, punta].every(p => Number.isFinite(p?.y)) &&
    punta.y < articulacion.y && punta.y < palma.y - 0.08;
}

export function desplazamientoHombros(puntos, referencia) {
  if (!puntos?.[11] || !puntos?.[12]) return null;
  const izquierda = puntos[11], derecha = puntos[12];
  if ((izquierda.visibility ?? 1) < 0.5 || (derecha.visibility ?? 1) < 0.5) return null;
  const centro = (izquierda.x + derecha.x) / 2;
  if (!Number.isFinite(centro)) return null;
  return {centro, desplazamiento:referencia === null ? 0 : centro - referencia};
}

export function reconocerOrden(texto) {
  const palabras = String(texto).toLowerCase().match(/[a-záéíóúñ]+/g) ?? [];
  if (palabras.includes('parar')) return 'parar';
  return ['siguiente','anterior','seleccionar','revisar','ayuda'].find(p => palabras.includes(p)) ?? null;
}
```
**gestos.test.mjs**
```
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {indiceLevantado, desplazamientoHombros, reconocerOrden} from './gestos.js';

test('índice levantado y mano cerrada', () => {
  const mano = Array.from({length:21}, () => ({x:0.5,y:0.7}));
  mano[8].y=0.2; mano[6].y=0.4;
  assert.equal(indiceLevantado(mano),true);
  mano[8].y=0.8;
  assert.equal(indiceLevantado(mano),false);
});
test('puntos incompletos no accionan', () => {
  assert.equal(indiceLevantado([]),false);
  assert.equal(desplazamientoHombros([],0.5),null);
});
test('calibración y movimiento lateral', () => {
  const pose=Array.from({length:33},()=>({x:0.5,y:0.5,visibility:1}));
  assert.equal(desplazamientoHombros(pose,null).desplazamiento,0);
  pose[11].x=0.8;pose[12].x=0.9;
  assert.ok(desplazamientoHombros(pose,0.5).desplazamiento>0.16);
  pose[11].visibility=0.2;
  assert.equal(desplazamientoHombros(pose,0.5),null);
});
test('órdenes como palabras y parada prioritaria', () => {
  assert.equal(reconocerOrden('Siguiente, por favor.'),'siguiente');
  assert.equal(reconocerOrden('anteriormente'),null);
  assert.equal(reconocerOrden('siguiente y parar'),'parar');
  assert.equal(reconocerOrden('seleccionar'),'seleccionar');
});
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
      <button id="botonVoz">Activar voz</button>
      <button id="botonMuestra">Probar vídeo de muestra</button>
      <button id="botonAudio">Reconocer audio de prueba</button>
      <button id="botonAudioLocal">Reconocer WAV local (Windows)</button>
      <button id="botonDetener">Detener sensores</button>
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
        <p id="mensaje" class="mensaje">Elige cámara o muestra. El audio de prueba no utiliza tu micrófono.</p>
        <p id="evidencia">Sin inferencias realizadas.</p>
        <p>La muestra contiene fotografías públicas de pruebas MediaPipe animadas. No representa movimiento espontáneo de una persona. El marcador 2D sigue puntos detectados; no hay anclaje espacial 3D.</p>
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
**package.json**
```json
{"private":true,"type":"module","scripts":{"test":"node --test gestos.test.mjs"}}
```
**servidor.py**
```python
"""Servidor local de la práctica y reconocimiento de una muestra WAV fija.

No recibe rutas ni ejecuta órdenes proporcionadas por el navegador.
"""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import os
import subprocess

RAIZ = Path(__file__).resolve().parent


class Aplicacion(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(RAIZ), **kwargs)

    def do_POST(self):
        if self.path != '/api/reconocer-muestra':
            self.send_error(404)
            return
        # Solo solicitudes del propio origen local; no hay acceso desde Internet.
        if self.headers.get('Origin') not in (None, 'http://127.0.0.1:8070', 'http://localhost:8070'):
            self.send_error(403)
            return
        try:
            if os.name != 'nt':
                raise RuntimeError('La muestra local requiere Windows con reconocimiento es-ES instalado.')
            proceso = subprocess.run(['powershell.exe', '-NoProfile', '-NonInteractive', '-File',
                str(RAIZ / 'reconocer-muestra.ps1')], capture_output=True, timeout=15)
            if proceso.returncode:
                raise RuntimeError('No se ha podido reconocer la muestra con el motor local instalado.')
            texto = proceso.stdout.decode('utf-8-sig', errors='replace')
            resultado = json.loads(texto)
            estado = 200
        except (OSError, RuntimeError, ValueError, subprocess.TimeoutExpired) as error:
            resultado, estado = {'error':str(error)}, 503
        cuerpo = json.dumps(resultado, ensure_ascii=False).encode('utf-8')
        self.send_response(estado)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(cuerpo)))
        self.end_headers()
        self.wfile.write(cuerpo)


if __name__ == '__main__':
    print('RA2: http://127.0.0.1:8070 (solo equipo local)', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 8070), Aplicacion).serve_forever()
```
#### muestras
**manifest.json**
```json
[
  {
    "archivo": "gestos-prueba.mp4",
    "bytes": 262770,
    "sha256": "668d863474f70ceaadf9b307db139355f9cc55620a068a2cb352e072d3357dea"
  },
  {
    "archivo": "orden-siguiente.wav",
    "bytes": 63512,
    "sha256": "82f58574735126d9273039d67aba377144b85af1693d15a90a0c486a3beb7110"
  },
  {
    "archivo": "pointing_up.jpg",
    "bytes": 74461,
    "sha256": "ecf8ca2611d08fa25948a4fc10710af9120e88243a54da6356bacea17ff3e36e"
  },
  {
    "archivo": "portrait.jpg",
    "bytes": 176561,
    "sha256": "a6f11efaa834706db23f275b6115058fa87fc7f14362681e6abe14e82749de3e"
  },
  {
    "archivo": "pose.jpg",
    "bytes": 44100,
    "sha256": "c8a830ed683c0276d713dd5aeda28f415f10cd6291972084a40d0d8b934ed62b"
  }
]
```
## 03-criterios-evaluacion
**AUDITORIA-ITC.md**
```markdown
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
```
**PRUEBAS.md**
```markdown
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
```
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

## Verificación actual y precedencias (26/10/2026)

La auditoría y los resultados actuales prevalecen sobre la descripción inicial.
La prueba autorizada utiliza archivos de vídeo y audio, no los dispositivos del usuario.

- a: comparación y fuentes primarias en AUDITORIA-ITC.md; MediaPipe es ML preentrenado.
- b: panel funcional con controles naturales y alternativas convencionales.
- c: reconocimiento real local de WAV con Windows Speech es-ES: «siguiente»,
  confianza 0,8359, cambio visible a Copia de seguridad. Web Speech devolvió network.
- d: detector de pose sobre una fotografía desplazada en el vídeo de prueba;
  mide el cambio de hombros y acciona navegación. No acredita gestos espontáneos.
- e: inferencia de mano y cara sobre muestras públicas y selección por índice.
- f: marcador 2D asociado a coordenadas detectadas; no se afirma WebXR ni SLAM.

Cuatro pruebas de lógica superadas, separadas de la inferencia del modelo.
La prueba inicial del vídeo detectó mano, pose y cara en 250 fotogramas,
con siete acciones combinadas. Los contadores por origen se incorporan en la
versión final para distinguir navegación corporal y selección con mano.
```
