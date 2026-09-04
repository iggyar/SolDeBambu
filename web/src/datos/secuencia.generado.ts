// ARCHIVO GENERADO por scripts/preparar-secuencia.mjs — no editar a mano.
// Los cuadros del atardecer que recorre el scroll, en dos tamaños.

export type JuegoCuadros = {cuadros: number; ancho: number; alto: number};

export const SECUENCIA: Record<'esc' | 'mov', JuegoCuadros> = {
  "esc": {
    "cuadros": 72,
    "ancho": 1280,
    "alto": 720
  },
  "mov": {
    "cuadros": 44,
    "ancho": 540,
    "alto": 720
  }
};

/** Ruta de un cuadro suelto. */
export function cuadro(juego: 'esc' | 'mov', i: number): string {
  return `/secuencia/${juego}-${String(i).padStart(3, '0')}.webp`;
}
