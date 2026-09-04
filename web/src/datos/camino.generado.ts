// ARCHIVO GENERADO por scripts/preparar-camino.mjs — no editar a mano.
// Los cuadros del camino que recorre el scroll, en dos tamaños.

export type JuegoCuadros = {cuadros: number; ancho: number; alto: number};

export const CAMINO: Record<'ruta' | 'ruta-mov', JuegoCuadros> = {
  "ruta": {
    "cuadros": 72,
    "ancho": 1280,
    "alto": 720
  },
  "ruta-mov": {
    "cuadros": 44,
    "ancho": 540,
    "alto": 720
  }
};

/** Ruta de un cuadro suelto. */
export function cuadro(juego: 'ruta' | 'ruta-mov', i: number): string {
  return `/camino/${juego}-${String(i).padStart(3, '0')}.webp`;
}
