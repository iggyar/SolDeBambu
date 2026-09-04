// ARCHIVO GENERADO por scripts/optimizar-intro.mjs — no editar a mano.
// Las capas del hero y la foto del camino, con los anchos que existen de
// verdad en public/intro/.

export type MedidasCapa = {anchos: number[]; proporcion: number};

export const INTRO: Record<string, MedidasCapa> = {
  "cielo": {
    "anchos": [
      640,
      960,
      1280,
      1600
    ],
    "proporcion": 0.5625
  },
  "natura": {
    "anchos": [
      640,
      960,
      1280,
      1600
    ],
    "proporcion": 0.5625
  },
  "foto": {
    "anchos": [
      640,
      960,
      1280,
      1600
    ],
    "proporcion": 0.5625
  },
  "camino": {
    "anchos": [
      640,
      960,
      1280,
      1600
    ],
    "proporcion": 0.6708
  }
};

/** El srcset de una capa, con los anchos reales que hay en disco. */
export function srcSetIntro(nombre: string): string {
  return INTRO[nombre].anchos.map((a) => `/intro/${nombre}-${a}.webp ${a}w`).join(', ');
}

/** El archivo más grande, como `src` de respaldo. */
export function srcIntro(nombre: string): string {
  const anchos = INTRO[nombre].anchos;
  return `/intro/${nombre}-${anchos[anchos.length - 1]}.webp`;
}
