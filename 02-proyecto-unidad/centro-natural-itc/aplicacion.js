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
