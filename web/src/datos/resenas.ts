/**
 * Reseñas reales publicadas en Google, transcritas textualmente y con su autor.
 * No se inventa ninguna, no se retoca la redacción y no se usan las fotos que
 * subieron los huéspedes: esas son de ellos, no de la propiedad.
 */

export type Resena = {
  autor: string;
  estrellas: number;
  cuando: string;
  texto: string;
  /** Si el texto venía cortado por el "…Más" de Google. */
  truncada?: boolean;
};

export const RESENAS: Resena[] = [
  {
    autor: 'Jeri Rodríguez',
    estrellas: 5,
    cuando: 'Hace un año',
    texto:
      'Un espacio adecuado para desconectar de la ciudad. Bungalows de estilos Oxapampinos, ' +
      'un comedor con techo de bambú muy hermoso y rústico, área de fogata muy acogedora. ' +
      'Todo esto en una ubicación precisa para maravillarte del atardecer',
    truncada: true,
  },
  {
    autor: 'Cristian Guzmán',
    estrellas: 5,
    cuando: 'Hace un año',
    texto:
      'Agradable lugar para disfrutar de su apacible vegetación. Es conectar realmente con la ' +
      'naturaleza y consigo mismo.',
  },
  {
    autor: 'Antonio Rodríguez',
    estrellas: 5,
    cuando: 'Hace un año',
    texto: 'Un lugar acogedor, para pasar gratos momentos en familia... y la naturaleza.',
  },
  {
    autor: 'Yiskah',
    estrellas: 5,
    cuando: 'Hace tres años',
    texto: 'Hermoso lugar para conectarte con la naturaleza y con uno mismo.',
  },
];

/**
 * ⚠️ PENDIENTE:
 *   — El texto completo de la reseña de Jeri Rodríguez (la captura la corta en "…Más").
 *     Mientras tanto se publica truncada, con puntos suspensivos y sin cambiarle una palabra.
 *   — El texto de la reseña de Ricardo Guzmán (5★, hace 3 meses), que no se alcanzaba a leer.
 *   — El puntaje y el total de reseñas reales, en config/negocio.ts → reseñasGoogle.
 */
