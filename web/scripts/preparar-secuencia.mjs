/**
 * Convierte el video del atardecer en dos juegos de cuadros WebP.
 *
 * La secuencia del scroll no reproduce un video: dibuja un cuadro en un canvas
 * segun donde este el scroll, hacia adelante y hacia atras, a la velocidad del
 * dedo. Es la tecnica de las paginas de producto de Apple, y necesita los
 * cuadros sueltos porque buscar dentro de un <video> con currentTime va a
 * tirones en Safari de iOS.
 *
 * Se generan dos juegos porque el peso es el limite real: un celular en 4G no
 * puede descargar los mismos 36 cuadros a 1100px que una laptop.
 *
 * Requiere ffmpeg en el PATH (ya esta instalado en esta maquina).
 *
 * Uso:
 *   node scripts/preparar-secuencia.mjs ../animacionsolbambu1.mp4
 */
import sharp from 'sharp';
import {execFileSync} from 'node:child_process';
import {mkdirSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const entrada = process.argv[2];
if (!entrada) {
  console.error('Falta el video. Ej: node scripts/preparar-secuencia.mjs ../animacion.mp4');
  process.exit(1);
}
const rutaVideo = path.resolve(process.cwd(), entrada);

const JUEGOS = [
  {nombre: 'esc', cuadros: 36, ancho: 1100, calidad: 74},
  {nombre: 'mov', cuadros: 24, ancho: 640, calidad: 72},
];

const DESTINO = path.resolve(process.cwd(), 'public/secuencia');
const TEMPORAL = path.resolve(process.cwd(), '.tmp-secuencia');

const duracion = Number(
  execFileSync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'csv=p=0',
    rutaVideo,
  ]).toString().trim(),
);
console.log(`  video     ${path.basename(rutaVideo)}  ${duracion.toFixed(2)} s`);

rmSync(DESTINO, {recursive: true, force: true});
mkdirSync(DESTINO, {recursive: true});

const manifiesto = {};

for (const juego of JUEGOS) {
  rmSync(TEMPORAL, {recursive: true, force: true});
  mkdirSync(TEMPORAL, {recursive: true});

  // fps calculado para que salgan exactamente los cuadros que queremos
  // repartidos por igual a lo largo del clip.
  const fps = (juego.cuadros / duracion).toFixed(6);
  execFileSync(
    'ffmpeg',
    [
      '-v', 'error',
      '-i', rutaVideo,
      '-vf', `fps=${fps},scale=${juego.ancho}:-2:flags=lanczos`,
      '-fps_mode', 'passthrough',
      '-y',
      path.join(TEMPORAL, '%04d.png'),
    ],
    {stdio: 'inherit'},
  );

  const png = readdirSync(TEMPORAL).filter((f) => f.endsWith('.png')).sort();
  let peso = 0;
  let alto = 0;

  for (const [i, archivo] of png.entries()) {
    const salida = path.join(DESTINO, `${juego.nombre}-${String(i).padStart(3, '0')}.webp`);
    const info = await sharp(path.join(TEMPORAL, archivo))
      .webp({quality: juego.calidad, effort: 6})
      .toFile(salida);
    peso += info.size;
    alto = info.height;
  }

  manifiesto[juego.nombre] = {cuadros: png.length, ancho: juego.ancho, alto};
  console.log(
    `  ${juego.nombre}       ${png.length} cuadros a ${juego.ancho}px  ` +
      `= ${(peso / 1024 / 1024).toFixed(2)} MB  (${Math.round(peso / png.length / 1024)} KB c/u)`,
  );
}

rmSync(TEMPORAL, {recursive: true, force: true});

writeFileSync(
  path.resolve(process.cwd(), 'src/datos/secuencia.generado.ts'),
  `// ARCHIVO GENERADO por scripts/preparar-secuencia.mjs — no editar a mano.
// Los cuadros del atardecer que recorre el scroll, en dos tamaños.

export type JuegoCuadros = {cuadros: number; ancho: number; alto: number};

export const SECUENCIA: Record<'esc' | 'mov', JuegoCuadros> = ${JSON.stringify(
    manifiesto,
    null,
    2,
  )};

/** Ruta de un cuadro suelto. */
export function cuadro(juego: 'esc' | 'mov', i: number): string {
  return \`/secuencia/\${juego}-\${String(i).padStart(3, '0')}.webp\`;
}
`,
  'utf8',
);

console.log('\n  manifiesto en src/datos/secuencia.generado.ts');
