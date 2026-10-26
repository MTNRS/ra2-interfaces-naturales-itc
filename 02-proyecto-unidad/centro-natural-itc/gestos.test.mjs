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
