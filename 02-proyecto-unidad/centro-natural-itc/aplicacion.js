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
