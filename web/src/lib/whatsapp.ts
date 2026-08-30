import {NEGOCIO} from '@/config/negocio';

/**
 * Arma el enlace de WhatsApp con el mensaje ya escrito.
 *
 * La gracia está en el mensaje: quien hace clic en "3 noches, 2 cabañas" llega
 * al chat con eso ya redactado. No tiene que explicar nada, y del otro lado se
 * sabe al instante qué estaba mirando — que es la mitad de una venta.
 */
export function enlaceWhatsApp(mensaje: string): string {
  return `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

const soles = new Intl.NumberFormat('es-PE', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** S/ 2,310 — con separador de miles, como se lee en Perú. */
export function formatearSoles(monto: number): string {
  return `S/ ${soles.format(monto)}`;
}

export const MENSAJES = {
  general: 'Hola, vi la web de Sol de Bambú y quiero consultar disponibilidad.',

  tarifa: (cabanas: number, noches: number, personas: number, precio: number) =>
    `Hola, quiero reservar ${cabanas === 1 ? '1 cabaña' : `${cabanas} cabañas`} por ` +
    `${noches === 1 ? '1 noche' : `${noches} noches`} ` +
    `(hasta ${personas} personas, ${formatearSoles(precio)} precio promoción). ` +
    `¿Tienen disponibilidad?`,

  evento:
    'Hola, quiero cotizar un evento en Sol de Bambú. Somos aproximadamente ___ personas ' +
    'y la fecha que tenemos en mente es ___.',

  disponibilidad:
    'Hola, quiero saber si tienen disponibilidad en Sol de Bambú para la fecha ___.',
} as const;
