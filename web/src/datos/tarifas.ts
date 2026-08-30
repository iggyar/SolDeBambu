/**
 * El tarifario completo, transcrito de las tres propuestas económicas.
 *
 * Vive como datos y no como imagen a propósito: así se puede leer en un
 * celular, lo indexa Google, y cada precio puede tener su propio botón que
 * abre WhatsApp con esa opción exacta ya escrita.
 */

export type Tarifa = {
  noches: number;
  /** Precio de lista, el que va tachado. */
  lista: number;
  /** Precio promoción, el que se destaca. */
  promocion: number;
};

export type BloqueTarifas = {
  cabanas: number;
  capacidad: number;
  /** La letra chica que cambia según cuántas cabañas se tomen. */
  restriccion: string;
  tarifas: Tarifa[];
};

export const TARIFAS: BloqueTarifas[] = [
  {
    cabanas: 1,
    capacidad: 7,
    restriccion: '1, 2 y 3 noches no aplican en fechas festivas ni en época de verano.',
    tarifas: [
      {noches: 1, lista: 600, promocion: 530},
      {noches: 2, lista: 1050, promocion: 965},
      {noches: 3, lista: 1470, promocion: 1315},
      {noches: 4, lista: 1840, promocion: 1680},
    ],
  },
  {
    cabanas: 2,
    capacidad: 14,
    restriccion: '1 y 2 noches no aplican en fechas festivas ni en época de verano.',
    tarifas: [
      {noches: 1, lista: 1070, promocion: 935},
      {noches: 2, lista: 1945, promocion: 1785},
      {noches: 3, lista: 2470, promocion: 2310},
      {noches: 4, lista: 3330, promocion: 3150},
    ],
  },
  {
    cabanas: 3,
    capacidad: 20,
    restriccion: '1 y 2 noches no aplican en fechas festivas ni en época de verano.',
    tarifas: [
      {noches: 1, lista: 1525, promocion: 1355},
      {noches: 2, lista: 2470, promocion: 2310},
      {noches: 3, lista: 3625, promocion: 3310},
      {noches: 4, lista: 4410, promocion: 4200},
    ],
  },
];

export const NOTAS_TARIFARIO = [
  'El precio de promoción no aplica en fechas festivas.',
  'Precios sujetos a variación. Confirmamos la tarifa final por WhatsApp al momento de reservar.',
];
