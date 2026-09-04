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

export const MENSAJES = {
  general: 'Hola, vi la web de Sol de Bambú y quiero consultar disponibilidad.',

  cabanas: (cabanas: number) =>
    `Hola, quiero consultar por ${cabanas === 1 ? '1 cabaña' : `${cabanas} cabañas`} ` +
    `en Sol de Bambú. ¿Tienen disponibilidad?`,

  evento:
    'Hola, quiero cotizar un evento en Sol de Bambú. Somos aproximadamente ___ personas ' +
    'y la fecha que tenemos en mente es ___.',

  /**
   * El mensaje que arma la propia página. Llega al chat con fecha, grupo y
   * cabañas ya escritos: del otro lado se sabe al instante qué se está pidiendo,
   * y del lado del huésped no hay nada que redactar, que es la fricción que
   * hace que la gente no escriba.
   *
   * Cada dato es opcional a propósito. Alguien que solo eligió el mes tiene que
   * poder mandar igual: obligar a completar todo antes de escribir sería poner
   * un formulario donde no había ninguno.
   */
  armado: ({cuando, personas, cabanas}: {cuando?: string; personas?: number; cabanas?: number}) => {
    const cuantas = cabanas === 1 ? 'interesa 1 cabaña' : `interesan ${cabanas} cabañas`;
    let texto = 'Hola, quiero consultar disponibilidad en Sol de Bambú';
    if (cuando) texto += ` para ${cuando}`;
    texto += '.';
    if (personas) {
      texto += ` Somos ${personas} ${personas === 1 ? 'persona' : 'personas'}`;
      texto += cabanas ? ` y nos ${cuantas}.` : '.';
    } else if (cabanas) {
      // Sin el número de personas la frase arranca acá, así que va en mayúscula.
      texto += ` Nos ${cuantas}.`;
    }
    return texto;
  },

  disponibilidad:
    'Hola, quiero saber si tienen disponibilidad en Sol de Bambú para la fecha ___.',
} as const;
