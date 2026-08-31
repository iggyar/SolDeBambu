// ARCHIVO GENERADO por scripts/preparar-secuencia.mjs — no editar a mano.
// Los cuadros del atardecer que recorre el scroll, en dos tamaños.

export type JuegoCuadros = {cuadros: number; ancho: number; alto: number};

export const SECUENCIA: Record<'esc' | 'mov', JuegoCuadros> = {
  "esc": {
    "cuadros": 36,
    "ancho": 1100,
    "alto": 814
  },
  "mov": {
    "cuadros": 24,
    "ancho": 640,
    "alto": 474
  }
};

/** Ruta de un cuadro suelto. */
export function cuadro(juego: 'esc' | 'mov', i: number): string {
  return `/secuencia/${juego}-${String(i).padStart(3, '0')}.webp`;
}
