export const CAPACIDAD_POR_CABANA = [7, 14, 20] as const;

export type MesReserva = {
  clave: string;
  etiqueta: string;
  nombre: string;
  anio: number;
  mes: number;
};

export type FinDeSemana = {
  clave: string;
  etiqueta: string;
  frase: string;
};

const formatoMes = new Intl.DateTimeFormat('es-PE', {month: 'long'});
const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];

function capitalizar(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function nombreMes(fecha: Date) {
  return formatoMes.format(fecha).toLocaleLowerCase('es-PE');
}

/** Los meses visibles en el armador, conservando el año para evitar ambigüedades. */
export function proximosMeses(desde = new Date(), cantidad = 8): MesReserva[] {
  return Array.from({length: cantidad}, (_, i) => {
    const fecha = new Date(desde.getFullYear(), desde.getMonth() + i, 1, 12);
    const nombreDelMes = nombreMes(fecha);
    const cruzaDeAnio = fecha.getFullYear() !== desde.getFullYear();

    return {
      clave: `${fecha.getFullYear()}-${fecha.getMonth()}`,
      etiqueta: capitalizar(cruzaDeAnio ? `${nombreDelMes} ${fecha.getFullYear()}` : nombreDelMes),
      nombre: cruzaDeAnio ? `${nombreDelMes} de ${fecha.getFullYear()}` : nombreDelMes,
      anio: fecha.getFullYear(),
      mes: fecha.getMonth(),
    };
  });
}

/**
 * Devuelve fines de semana reales, con fechas, incluyendo el quinto cuando existe.
 * En el mes actual oculta los que ya terminaron.
 */
export function finesDeSemana(mes: MesReserva, desde = new Date()): FinDeSemana[] {
  const hoy = new Date(desde.getFullYear(), desde.getMonth(), desde.getDate(), 12);
  const resultado: FinDeSemana[] = [];

  for (let dia = 1; dia <= 31; dia++) {
    const sabado = new Date(mes.anio, mes.mes, dia, 12);
    if (sabado.getMonth() !== mes.mes) break;
    if (sabado.getDay() !== 6) continue;

    const domingo = new Date(mes.anio, mes.mes, dia + 1, 12);
    if (domingo < hoy) continue;

    const mismoMes = sabado.getMonth() === domingo.getMonth();
    const etiqueta = mismoMes
      ? `${sabado.getDate()}–${domingo.getDate()} ${MESES_CORTOS[sabado.getMonth()]}`
      : `${sabado.getDate()} ${MESES_CORTOS[sabado.getMonth()]}–${domingo.getDate()} ${MESES_CORTOS[domingo.getMonth()]}`;
    const frase = mismoMes
      ? `el fin de semana del ${sabado.getDate()} al ${domingo.getDate()} de ${nombreMes(sabado)} de ${sabado.getFullYear()}`
      : `el fin de semana del ${sabado.getDate()} de ${nombreMes(sabado)} al ${domingo.getDate()} de ${nombreMes(domingo)} de ${domingo.getFullYear()}`;

    resultado.push({
      clave: `${sabado.getFullYear()}-${sabado.getMonth()}-${sabado.getDate()}`,
      etiqueta,
      frase,
    });
  }

  return resultado;
}

export function cabanasSugeridas(personas: number | null): number | null {
  if (!personas) return null;
  const indice = CAPACIDAD_POR_CABANA.findIndex((capacidad) => personas <= capacidad);
  return indice === -1 ? CAPACIDAD_POR_CABANA.length : indice + 1;
}

export function capacidadDeCabanas(cabanas: number): number {
  return CAPACIDAD_POR_CABANA[cabanas - 1] ?? CAPACIDAD_POR_CABANA.at(-1)!;
}
