/**
 * Genera los anchos WebP de las capas del hero y de la foto del camino.
 *
 * Estas imágenes se colaron fuera del pipeline de `optimizar-fotos.mjs` porque
 * no salen de la carpeta del dueño: son capas recortadas a mano. El costo de
 * esa excepción se mide: en un teléfono de 375px la página descargaba las tres
 * capas a 1600px, 351 KB, para pintarlas en un elemento de 375 de ancho. El
 * tráfico llega de Instagram y TikTok en 4G; ese medio megabyte es la
 * diferencia entre ver la piscina y cerrar la pestaña.
 *
 * Las tres capas del hero se escalan por el mismo factor y conservan el mismo
 * encuadre, así que siguen alineándose entre ellas y con la máscara de oclusión,
 * que se aplica con `mask-size: cover` y escala sola.
 *
 * Se corre una sola vez (`npm run intro`).
 */
import sharp from 'sharp';
import {readdir, writeFile} from 'node:fs/promises';
import path from 'node:path';

const CARPETA = path.resolve(process.cwd(), 'public/intro');
const MANIFIESTO = path.resolve(process.cwd(), 'src/datos/intro.generado.ts');
const ANCHOS_OBJETIVO = [640, 960, 1280, 1600];

// Nombre en disco → nombre publicado. `Camino.webp` está con mayúscula en el
// repo y se servía en minúscula: en Windows funciona y en cualquier host Linux
// es un 404. Al pasar por acá queda normalizado en minúsculas de una vez.
const CAPAS = {
  'cielo.webp': 'cielo',
  'natura.webp': 'natura',
  'foto.webp': 'foto',
  'Camino.webp': 'camino',
};

const enCarpeta = await readdir(CARPETA);
const manifiesto = {};

for (const [archivo, nombre] of Object.entries(CAPAS)) {
  if (!enCarpeta.includes(archivo)) {
    console.warn(`  ! falta ${archivo}, se omite`);
    continue;
  }
  const entrada = path.join(CARPETA, archivo);
  const meta = await sharp(entrada).metadata();
  const anchoOriginal = meta.width ?? 1600;
  const proporcion = (meta.height ?? 1) / anchoOriginal;

  const anchos = [
    ...new Set(ANCHOS_OBJETIVO.map((a) => Math.min(a, anchoOriginal))),
  ].sort((a, b) => a - b);

  for (const ancho of anchos) {
    await sharp(entrada)
      .resize({width: ancho, withoutEnlargement: true})
      // El cielo es un degradado casi liso: a calidad 78 le sale banding, y es
      // el único archivo del set donde eso se nota. Sube a 86 y aun así pesa
      // menos que cualquiera de las otras capas.
      .webp({quality: nombre === 'cielo' ? 86 : 78, effort: 5})
      .toFile(path.join(CARPETA, `${nombre}-${ancho}.webp`));
  }

  manifiesto[nombre] = {anchos, proporcion: Number(proporcion.toFixed(4))};
  console.log(`  ✓ ${archivo} → ${nombre} [${anchos.join(', ')}]`);
}

const cabecera = `// ARCHIVO GENERADO por scripts/optimizar-intro.mjs — no editar a mano.
// Las capas del hero y la foto del camino, con los anchos que existen de
// verdad en public/intro/.

export type MedidasCapa = {anchos: number[]; proporcion: number};

export const INTRO: Record<string, MedidasCapa> = ${JSON.stringify(manifiesto, null, 2)};

/** El srcset de una capa, con los anchos reales que hay en disco. */
export function srcSetIntro(nombre: string): string {
  return INTRO[nombre].anchos.map((a) => \`/intro/\${nombre}-\${a}.webp \${a}w\`).join(', ');
}

/** El archivo más grande, como \`src\` de respaldo. */
export function srcIntro(nombre: string): string {
  const anchos = INTRO[nombre].anchos;
  return \`/intro/\${nombre}-\${anchos[anchos.length - 1]}.webp\`;
}
`;
await writeFile(MANIFIESTO, cabecera, 'utf8');

console.log(`\nListo. Manifiesto en src/datos/intro.generado.ts`);
