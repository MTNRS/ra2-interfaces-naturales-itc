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
