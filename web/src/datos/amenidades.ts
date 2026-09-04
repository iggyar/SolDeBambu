import {
  Beef,
  ChefHat,
  Croissant,
  Flame,
  Gamepad2,
  Goal,
  PawPrint,
  Trees,
  Volleyball,
  Waves,
} from 'lucide-react';

/**
 * Las áreas comunes, tal como las lista la ficha de la propiedad. Es una lista
 * corta a propósito: acá se escanea, no se lee. El detalle largo de cada cosa
 * ya está en las FAQ, y lo que no está confirmado no entra — una amenidad
 * inventada que después no aparece es una reseña de 3 estrellas esperando.
 *
 * Lo que falta confirmar está listado abajo en PENDIENTES.
 */
export const AMENIDADES = [
  {icono: Waves, texto: 'Piscina con sombrillas'},
  {icono: Goal, texto: 'Campo de fulbito'},
  {icono: Beef, texto: 'Parrilla equipada'},
  {icono: Volleyball, texto: 'Espacio para vóley'},
  {icono: ChefHat, texto: 'Horno artesanal'},
  {icono: Gamepad2, texto: 'Ping pong y sapito'},
  {icono: Flame, texto: 'Área de fogata'},
  {icono: Croissant, texto: 'Cocina con menaje'},
  {icono: Trees, texto: '5 000 m² de área verde'},
  {icono: PawPrint, texto: 'Pet friendly'},
] as const;

/**
 * ⚠️ PENDIENTE DE CONFIRMAR con el dueño. Cuando responda, se agregan a la
 * lista de arriba con su ícono y listo — no hay que tocar ningún componente.
 *
 *   ¿Hay wifi?
 *   ¿Agua caliente en las duchas?
 *   ¿La piscina es temperada?
 *   ¿Refrigeradora dentro de la cabaña?
 *   ¿TV?
 *   ¿Cuántos autos entran en la cochera?
 *   ¿La leña de la fogata la ponen ustedes o la lleva el huésped?
 */
