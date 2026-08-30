import {
  Beef,
  Car,
  ChefHat,
  Flame,
  Mountain,
  TreePalm,
  Umbrella,
  Utensils,
  Waves,
} from 'lucide-react';

/**
 * Solo va acá lo que está confirmado por las fotos o por las reseñas de Google.
 * Nada de "wifi de alta velocidad" de relleno: una amenidad inventada que
 * después no está es una reseña de 3 estrellas esperando a pasar.
 *
 * Lo que falta confirmar está listado abajo en PENDIENTES.
 */
export const AMENIDADES = [
  {
    icono: Waves,
    titulo: 'Piscina privada',
    detalle: 'Para ustedes solos, con camastros y toldos de madera alrededor.',
  },
  {
    icono: Beef,
    titulo: 'Parrilla',
    detalle: 'En el comedor techado. Ustedes traen el carbón.',
  },
  {
    icono: ChefHat,
    titulo: 'Horno de barro',
    detalle: 'Para pizzas, pollo o pachamanca. Funciona a leña.',
  },
  {
    icono: Flame,
    titulo: 'Área de fogata',
    detalle: 'El plan de la noche, cuando refresca y sale el cielo.',
  },
  {
    icono: Utensils,
    titulo: 'Comedor con techo de bambú',
    detalle: 'Rústico y a la sombra, con mesa larga para todo el grupo.',
  },
  {
    icono: TreePalm,
    titulo: 'Jardín de palmeras',
    detalle: 'Césped abierto de punta a punta, sin vecinos al costado.',
  },
  {
    icono: Umbrella,
    titulo: 'Toldos y camastros',
    detalle: 'Sombra junto a la piscina para cuando el sol de Cañete pega fuerte.',
  },
  {
    icono: Car,
    titulo: 'Estacionamiento',
    detalle: 'Dentro de la propiedad, sin dejar el auto en la calle.',
  },
  {
    icono: Mountain,
    titulo: 'Vista al valle',
    detalle: 'Los cerros de Mala de un lado, el verde del valle del otro.',
  },
] as const;

/**
 * ⚠️ PENDIENTE DE CONFIRMAR con el dueño. Cuando responda, se mueven a la
 * lista de arriba con su ícono y listo — no hay que tocar ningún componente.
 *
 *   ¿Hay wifi?
 *   ¿Agua caliente en las duchas?
 *   ¿Cocina equipada / refrigeradora dentro de la cabaña?
 *   ¿TV?
 *   ¿Cuántos baños tiene cada cabaña?
 *   ¿Toallas y ropa de cama incluidas?
 *   ¿Cuántos autos entran en el estacionamiento?
 *   ¿La piscina es temperada?
 *   ¿Hay juegos (ping-pong, vóley, fútbol)?
 *   ¿La leña de la fogata la ponen ustedes o la lleva el huésped?
 */
