/**
 * El motor comun de las dos secuencias de scroll: partir un video en cuadros
 * WebP y escribir el manifiesto que los describe.
 *
 * Vive aparte porque la pagina tiene DOS de estas —el atardecer y el camino— y
 * la unica diferencia entre ellas son los numeros: cuantos cuadros, de que
 * ancho y con que recorte. Lo demas —el reparto parejo a lo largo del clip, el
 * recorte antes del escalado, el manifiesto— es identico, y tenerlo dos veces
 * era garantizar que se arreglara en una sola.
 *
 * Requiere ffmpeg y ffprobe en el PATH.
 */
import sharp from 'sharp';
import {execFileSync} from 'node:child_process';
import {mkdirSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';

/**
 * @param {object} opciones
 * @param {string} opciones.video      Ruta del video de origen.
 * @param {Array}  opciones.juegos     [{nombre, cuadros, ancho, calidad, recorte?}]
 * @param {string} opciones.destino    Carpeta de salida dentro de public/.
 * @param {string} opciones.modulo     Ruta del .ts generado.
 * @param {string} opciones.constante  Nombre de la constante exportada.
 * @param {string} opciones.titulo     Una linea de comentario para el archivo.
 */
export async function generarCuadros({video, juegos, destino, modulo, constante, titulo}) {
  const rutaVideo = path.resolve(process.cwd(), video);
  const carpeta = path.resolve(process.cwd(), destino);
  const temporal = path.resolve(process.cwd(), '.tmp-cuadros');

  const duracion = Number(
    execFileSync('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'csv=p=0',
      rutaVideo,
    ]).toString().trim(),
  );
  console.log(`  video     ${path.basename(rutaVideo)}  ${duracion.toFixed(2)} s`);

  rmSync(carpeta, {recursive: true, force: true});
  mkdirSync(carpeta, {recursive: true});

  const manifiesto = {};
  const nombres = [];

  for (const juego of juegos) {
    rmSync(temporal, {recursive: true, force: true});
    mkdirSync(temporal, {recursive: true});

    // fps calculado para que salgan exactamente los cuadros que queremos
    // repartidos por igual a lo largo del clip.
    const fps = (juego.cuadros / duracion).toFixed(6);
    // El recorte va ANTES del escalado: al reves se escalaria el cuadro entero
    // para tirar despues la mitad, que es trabajo perdido y ademas dejaria el
    // recorte medido en pixeles equivocados.
    const filtros = [
      `fps=${fps}`,
      juego.recorte && `crop=${juego.recorte}`,
      `scale=${juego.ancho}:-2:flags=lanczos`,
    ].filter(Boolean);

    execFileSync(
      'ffmpeg',
      ['-v', 'error', '-i', rutaVideo, '-vf', filtros.join(','), '-fps_mode', 'passthrough', '-y',
       path.join(temporal, '%04d.png')],
      {stdio: 'inherit'},
    );

    const png = readdirSync(temporal).filter((f) => f.endsWith('.png')).sort();
    let peso = 0;
    let alto = 0;

    for (const [i, archivo] of png.entries()) {
      const salida = path.join(carpeta, `${juego.nombre}-${String(i).padStart(3, '0')}.webp`);
      const info = await sharp(path.join(temporal, archivo))
        .webp({quality: juego.calidad, effort: 6})
        .toFile(salida);
      peso += info.size;
      alto = info.height;
    }

    manifiesto[juego.nombre] = {cuadros: png.length, ancho: juego.ancho, alto};
    nombres.push(juego.nombre);
    console.log(
      `  ${juego.nombre.padEnd(9)} ${png.length} cuadros a ${juego.ancho}px  ` +
        `= ${(peso / 1024 / 1024).toFixed(2)} MB  (${Math.round(peso / png.length / 1024)} KB c/u)`,
    );
  }

  rmSync(temporal, {recursive: true, force: true});

  const union = nombres.map((n) => `'${n}'`).join(' | ');
  writeFileSync(
    path.resolve(process.cwd(), modulo),
    `// ARCHIVO GENERADO por scripts/${path.basename(process.argv[1])} — no editar a mano.
// ${titulo}

export type JuegoCuadros = {cuadros: number; ancho: number; alto: number};

export const ${constante}: Record<${union}, JuegoCuadros> = ${JSON.stringify(manifiesto, null, 2)};

/** Ruta de un cuadro suelto. */
export function cuadro(juego: ${union}, i: number): string {
  return \`/${path.basename(destino)}/\${juego}-\${String(i).padStart(3, '0')}.webp\`;
}
`,
    'utf8',
  );

  console.log(`\n  manifiesto en ${modulo}`);
}
