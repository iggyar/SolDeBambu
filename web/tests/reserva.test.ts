import assert from 'node:assert/strict';
import test from 'node:test';
import {
  cabanasSugeridas,
  capacidadDeCabanas,
  finesDeSemana,
  proximosMeses,
} from '../src/lib/reserva.ts';

test('sugiere cabañas sin exceder su capacidad acumulada', () => {
  assert.equal(cabanasSugeridas(null), null);
  assert.equal(cabanasSugeridas(7), 1);
  assert.equal(cabanasSugeridas(8), 2);
  assert.equal(cabanasSugeridas(14), 2);
  assert.equal(cabanasSugeridas(15), 3);
  assert.equal(cabanasSugeridas(20), 3);
  assert.equal(capacidadDeCabanas(1), 7);
  assert.equal(capacidadDeCabanas(3), 20);
});

test('incluye el quinto fin de semana y usa fechas exactas', () => {
  const octubre = proximosMeses(new Date(2026, 9, 1, 12), 1)[0];
  const findes = finesDeSemana(octubre, new Date(2026, 9, 1, 12));

  assert.equal(findes.length, 5);
  assert.equal(findes[0].etiqueta, '3–4 oct');
  assert.equal(findes[4].etiqueta, '31 oct–1 nov');
  assert.match(findes[4].frase, /31 de octubre al 1 de noviembre de 2026/);
});

test('oculta fines de semana que ya terminaron en el mes actual', () => {
  const setiembre = proximosMeses(new Date(2026, 8, 20, 12), 1)[0];
  const findes = finesDeSemana(setiembre, new Date(2026, 8, 20, 12));

  assert.deepEqual(
    findes.map((finde) => finde.etiqueta),
    ['19–20 set', '26–27 set'],
  );
});
