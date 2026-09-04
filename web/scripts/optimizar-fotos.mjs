/**
 * Convierte los PNG originales de la propiedad a WebP en varios anchos y
 * escribe un manifiesto tipado con las medidas REALES de cada archivo.
 *
 * Los originales pesan 3.6 MB entre todos: suicida para el tráfico que va a
 * llegar desde Instagram y TikTok en 4G. Este script se corre una sola vez
 * (`npm run fotos`).
 *
 * El manifiesto existe porque las fotos no tienen todas el mismo tamaño: van
 * de 1024px a 1600px de ancho. Declarar un srcset de "1920w" para una foto de
 * 1200px haría que el navegador la eligiera creyendo que rinde más resolución
 * de la que tiene, y se vería blanda en pantallas retina. Mejor decir la verdad.
 *
 * Los tres tarifarios hechos en Canva NO se procesan a propósito: sus datos
 * viven en src/datos/tarifas.ts y se renderizan como HTML.
 */
import sharp from 'sharp';
import {mkdir, readdir, writeFile} from 'node:fs/promises';
import path from 'node:path';

const ORIGEN = path.resolve(process.cwd(), '..');
const DESTINO = path.resolve(process.cwd(), 'public/fotos');
const MANIFIESTO = path.resolve(process.cwd(), 'src/datos/fotos.generado.ts');
const ANCHOS_OBJETIVO = [640, 1024, 1600];

/**
 * Excepciones al tratamiento por defecto.
 *
 * El cielo estrellado no se puede comprimir como una fotografía de la
 * propiedad. Una foto normal es superficies grandes de color parecido —césped,
 * cielo, una pared— y ahí un WebP al 78 no se nota. Un campo de estrellas es lo
 * contrario: ruido de alta frecuencia sobre un fondo casi plano, o sea miles de
 * detalles de un píxel que no se parecen a sus vecinos. Es el peor caso posible
 * para cualquier compresor, y al 78 las estrellas chicas simplemente
 * desaparecen — el cielo queda liso y sucio.
 *
 * Va también a 2560 porque es la única foto de la página que se ve a sangre en
 * pantalla completa: a 1600 en un monitor de 1920 se estaría ampliando, y una
 * estrella ampliada deja de ser un punto y pasa a ser una mancha.
 *
 * La calidad la decidió una comparación a 1:1, no una corazonada: recortes de
 * la misma zona a 80, 84, 88 y 92 puestos uno al lado del otro a tamaño real.
 * A 80 las estrellas de un píxel siguen todas ahí y no aparece bloqueo en el
 * fondo; de 80 a 92 el archivo se triplica (215 KB → 632 KB a 2048) para una
 * diferencia que no se ve, y menos aún detrás de una máscara y al 55% de
 * opacidad. */
const ESPECIALES = {
  'cielo-nocturno': {anchos: [1024, 1600, 2048, 2560], calidad: 80},
};

// Nombre original → nombre publicado. Renombrar acá y no en disco mantiene
// intactos los archivos que el dueño tiene en su carpeta.
const MAPA = {
  // Las cuatro primeras se regeneraron con Grok a partir de las originales:
  // misma arquitectura y encuadre, corregida la luz y limpiado el terreno.
  // Pasaron de 4:3 a 16:9, por eso hay que volver a correr esto y la mascara.
  'solbambu3MEJORADOGROK.jpg': 'piscina-quincho',
  'Solbambu2MEJORADAGROK.jpg': 'cabanas-piscina',
  'SOLBAMBU1GROKMEJORADO.jpg': 'jardin-palmeras',
  'SolBambu5GROKMEJORADA.jpg': 'cabana-noche',
  // Estas siguen siendo las originales de celular, pendientes de mejorar.
  'solbambu4.png': 'cabana-palmeras',
  'solbambuadentro1.png': 'dormitorio-uno',
  'solbambuadentro2.png': 'sala-escalera',
  'solbamuadentro3.png': 'dormitorio-dos',
  'solbambuadentro4.png': 'altillo',
  // Tanda de agosto 2026: las áreas comunes, que hasta ahora la página nombraba
  // en una lista de texto sin una sola foto que las respaldara.
  'fogataprendida.png': 'fogata',
  'salajuegoSolBambu.png': 'sala-juegos',
  'arcofutbolsolbambu.png': 'campo-futbol',
  'vistapisicnasolbambu.png': 'piscina-hamacas',
  'saladeestarsb.png': 'comedor-bambu',
  'amanecerdesdecabana.png': 'altillo-ventana',
  // El cielo de la mitad de noche: la Vía Láctea, 5472x3648. Se renombra aquí
  // y no en disco, como el resto — la carpeta del dueño se queda intacta. Si el
  // archivo no está, este script lo avisa y sigue; la página no se rompe,
  // simplemente no hay cielo.
  'pexels-instawally-176851.jpg': 'cielo-nocturno',
};

await mkdir(DESTINO, {recursive: true});
const enCarpeta = await readdir(ORIGEN);
const manifiesto = {};

for (const [archivo, nombre] of Object.entries(MAPA)) {
  if (!enCarpeta.includes(archivo)) {
    console.warn(`  ! falta ${archivo}, se omite`);
    continue;
  }
  const entrada = path.join(ORIGEN, archivo);
  const meta = await sharp(entrada).metadata();
  const anchoOriginal = meta.width ?? 1600;
  const proporcion = (meta.height ?? 1) / anchoOriginal;

  const especial = ESPECIALES[nombre];
  // Nunca agrandamos, y no repetimos un ancho ya cubierto por el original.
  const anchos = [...new Set(
    (especial?.anchos ?? ANCHOS_OBJETIVO).map((a) => Math.min(a, anchoOriginal)),
  )].sort((a, b) => a - b);

  for (const ancho of anchos) {
    await sharp(entrada)
      .resize({width: ancho, withoutEnlargement: true})
      .webp({quality: especial?.calidad ?? 78, effort: 6})
      .toFile(path.join(DESTINO, `${nombre}-${ancho}.webp`));
  }

  manifiesto[nombre] = {anchos, proporcion: Number(proporcion.toFixed(4))};
  console.log(`  ✓ ${archivo} → ${nombre} [${anchos.join(', ')}]`);
}

// Imagen para compartir en WhatsApp y redes: 1200x630 recortado al centro.
await sharp(path.join(ORIGEN, 'solbambu3.png'))
  .resize(1200, 630, {fit: 'cover', position: 'centre'})
  .jpeg({quality: 82, mozjpeg: true})
  .toFile(path.join(DESTINO, 'og.jpg'));

const cabecera = `// ARCHIVO GENERADO por scripts/optimizar-fotos.mjs — no editar a mano.
// Contiene los anchos WebP que existen de verdad en public/fotos/ y la
// proporción alto/ancho de cada foto, para reservar el espacio antes de que
// cargue y evitar que la página salte (CLS).

export type MedidasFoto = {anchos: number[]; proporcion: number};

export const FOTOS: Record<string, MedidasFoto> = ${JSON.stringify(manifiesto, null, 2)};
`;
await writeFile(MANIFIESTO, cabecera, 'utf8');

console.log(`\nListo. Manifiesto en src/datos/fotos.generado.ts`);
