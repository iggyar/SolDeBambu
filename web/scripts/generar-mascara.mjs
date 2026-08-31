/**
 * Genera la máscara de oclusión del hero a partir del cielo de la propia foto.
 *
 * El efecto de Nestora es que el wordmark salga de DETRÁS del paisaje. Para eso
 * hay que separar cielo de tierra con precisión de hoja, y trazar una arboleda
 * a mano con clip-path se ve falso. Acá se deriva del pixel.
 *
 * Dos cosas hacen que funcione:
 *
 * 1. RELLENO POR INUNDACIÓN desde la fila de arriba. El agua de la piscina es
 *    tan azul y tan clara como el cielo, pero no está conectada con el borde
 *    superior. Sin inundación, la máscara abriría un agujero en la piscina.
 *
 * 2. DOS MODOS, elegidos solos según el color del borde superior:
 *    - azul     mediodía: el cielo es lo único donde el canal azul gana al rojo.
 *               La luminancia sola no sirve, porque un cielo con bruma y una
 *               arboleda iluminada brillan casi igual.
 *    - cálido   atardecer: el cielo es naranja y el rojo gana, así que el color
 *               deja de servir. Pero a contraluz el paisaje queda en silueta
 *               oscura, y ahí la luminancia separa perfecto. El corte lo decide
 *               el método de Otsu, que busca el umbral que mejor parte el
 *               histograma en dos — sin números a dedo.
 *
 * Salida: PNG RGBA con alfa 255 en el paisaje y 0 en el cielo, para usar como
 * mask-image sobre una copia de la foto apilada encima del wordmark.
 *
 * Uso:
 *   node scripts/generar-mascara.mjs <foto> [--umbral N] [--limite F] [--modo azul|calido]
 */
import sharp from 'sharp';
import {readdirSync} from 'node:fs';
import path from 'node:path';

const [nombre, ...resto] = process.argv.slice(2);
if (!nombre) {
  console.error('Falta el nombre. Ej: node scripts/generar-mascara.mjs piscina-quincho');
  process.exit(1);
}
const bandera = (b, pd) => {
  const i = resto.indexOf(b);
  return i === -1 ? pd : resto[i + 1];
};
const umbralManual = bandera('--umbral', null);
const limite = Number(bandera('--limite', 0.66));
const modoManual = bandera('--modo', null);
// Cuánto tiene que ganarle el azul al rojo para contar como cielo. Subirlo
// rescata las lonas y toldos color crema, que son neutros y se colaban.
const margen = Number(bandera('--margen', 4));

const DIR = path.resolve(process.cwd(), 'public/fotos');
const prefijo = `${nombre}-`;
const anchos = readdirSync(DIR)
  .filter((f) => f.startsWith(prefijo) && f.endsWith('.webp'))
  .map((f) => Number(f.slice(prefijo.length, -'.webp'.length)))
  .filter(Number.isFinite)
  .sort((a, b) => a - b);
if (anchos.length === 0) {
  console.error(`No hay WebP de "${nombre}" en public/fotos. Corre antes: npm run fotos`);
  process.exit(1);
}
const ancho = anchos[anchos.length - 1];

const {data, info} = await sharp(path.join(DIR, `${nombre}-${ancho}.webp`))
  .raw()
  .toBuffer({resolveWithObject: true});
const {width: W, height: H, channels: C} = info;

const lum = new Uint8Array(W * H);
for (let i = 0, p = 0; i < W * H; i++, p += C) {
  lum[i] = (data[p] * 0.2126 + data[p + 1] * 0.7152 + data[p + 2] * 0.0722) | 0;
}

// ¿El borde superior es azul o cálido?
const filasMuestra = Math.max(1, Math.round(H * 0.03));
let sumaR = 0;
let sumaB = 0;
for (let i = 0; i < W * filasMuestra; i++) {
  sumaR += data[i * C];
  sumaB += data[i * C + 2];
}
const modo = modoManual ?? (sumaB > sumaR + W * filasMuestra * 6 ? 'azul' : 'calido');

const techo = Math.round(H * limite);

/** Otsu: el umbral que minimiza la varianza dentro de cada grupo. */
function otsu(valores, hasta) {
  const hist = new Float64Array(256);
  for (let i = 0; i < hasta; i++) hist[valores[i]]++;
  const total = hasta;
  let suma = 0;
  for (let t = 0; t < 256; t++) suma += t * hist[t];
  let sumaB = 0;
  let pesoB = 0;
  let mejor = 0;
  let mejorVar = -1;
  for (let t = 0; t < 256; t++) {
    pesoB += hist[t];
    if (pesoB === 0) continue;
    const pesoF = total - pesoB;
    if (pesoF === 0) break;
    sumaB += t * hist[t];
    const mediaB = sumaB / pesoB;
    const mediaF = (suma - sumaB) / pesoF;
    const varianza = pesoB * pesoF * (mediaB - mediaF) ** 2;
    if (varianza > mejorVar) {
      mejorVar = varianza;
      mejor = t;
    }
  }
  return mejor;
}

let umbral;
if (umbralManual !== null) {
  umbral = Number(umbralManual);
} else if (modo === 'azul') {
  const muestra = Array.from(lum.slice(0, W * filasMuestra)).sort((a, b) => a - b);
  umbral = Math.round(muestra[muestra.length >> 1] * 0.45);
} else {
  umbral = otsu(lum, W * techo);
}

// En modo azul el color manda y la luminancia solo descarta sombras profundas.
const esCieloPixel =
  modo === 'azul'
    ? (i) => lum[i] >= umbral && data[i * C + 2] >= data[i * C] + margen
    : (i) => lum[i] >= umbral;

const esCielo = new Uint8Array(W * H);
const cola = new Int32Array(W * H);
let cabeza = 0;
let cierre = 0;
for (let x = 0; x < W; x++) {
  if (esCieloPixel(x)) {
    esCielo[x] = 1;
    cola[cierre++] = x;
  }
}
while (cabeza < cierre) {
  const i = cola[cabeza++];
  const x = i % W;
  const y = (i / W) | 0;
  const vecinos = [
    x > 0 ? i - 1 : -1,
    x < W - 1 ? i + 1 : -1,
    y > 0 ? i - W : -1,
    y < techo - 1 ? i + W : -1,
  ];
  for (const v of vecinos) {
    if (v >= 0 && !esCielo[v] && esCieloPixel(v)) {
      esCielo[v] = 1;
      cola[cierre++] = v;
    }
  }
}

const salida = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) {
  const o = i * 4;
  salida[o] = 255;
  salida[o + 1] = 255;
  salida[o + 2] = 255;
  salida[o + 3] = esCielo[i] ? 0 : 255;
}
await sharp(salida, {raw: {width: W, height: H, channels: 4}})
  // Medio pixel de desenfoque: sin esto la silueta se ve aserrada al escalar.
  .blur(0.6)
  .png({compressionLevel: 9})
  .toFile(path.join(DIR, `${nombre}-mascara.png`));

const revision = Buffer.from(data);
for (let i = 0, p = 0; i < W * H; i++, p += C) {
  if (esCielo[i]) {
    revision[p] = 255;
    revision[p + 1] = 0;
    revision[p + 2] = 220;
  }
}
await sharp(revision, {raw: {width: W, height: H, channels: C}})
  .resize({width: 900})
  .jpeg({quality: 80})
  .toFile(path.join(DIR, `_revision-${nombre}.jpg`));

let cuenta = 0;
for (let i = 0; i < W * H; i++) cuenta += esCielo[i];
console.log(`  foto      ${nombre}-${ancho}.webp  (${W}x${H})`);
console.log(`  modo      ${modo}${modoManual ? ' (manual)' : ' (detectado)'}`);
console.log(`  umbral    ${umbral}${umbralManual !== null ? ' (manual)' : ' (automático)'}`);
if (modo === 'azul') console.log(`  margen    azul supera al rojo por ${margen}`);
console.log(`  cielo     ${((cuenta / (W * H)) * 100).toFixed(1)}% de la imagen`);
console.log(`  revisión  public/fotos/_revision-${nombre}.jpg`);
