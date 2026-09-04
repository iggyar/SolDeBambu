/**
 * LO QUE INCLUYE LA ESTADÍA — seis, no diez.
 *
 * La lista larga de amenidades (ver amenidades.ts) sigue existiendo y se lee
 * entera en el FAQ. Acá van solo seis, porque esta sección no es un inventario:
 * es la que tiene que hacer que alguien se imagine el fin de semana. Cada una
 * lleva su propia foto, que es lo que aparece al lado cuando se recorre la
 * lista.
 *
 * Nada entra sin estar confirmado por la ficha de la propiedad. Wi-Fi, agua
 * caliente y piscina temperada siguen pendientes de confirmación con el dueño
 * (ver PENDIENTES en amenidades.ts) y por eso no figuran: una amenidad
 * inventada que después no aparece es una reseña de tres estrellas esperando.
 */

export type Experiencia = {
  titulo: string;
  linea: string;
  foto: string;
  alt: string;
};

export const EXPERIENCIA: Experiencia[] = [
  {
    titulo: 'Piscina privada',
    linea: 'Con sombrillas y hamacas alrededor, y ningún otro grupo en el terreno.',
    foto: 'piscina-hamacas',
    alt: 'La piscina al atardecer, con las hamacas colgadas entre los postes de madera',
  },
  {
    titulo: 'Área de fogata',
    linea: 'Se prende al caer el sol y ahí termina cayendo todo el mundo.',
    foto: 'fogata',
    alt: 'La fogata encendida al anochecer, con una cabaña y los cerros de Mala detrás',
  },
  {
    titulo: 'Parrilla y horno artesanal',
    linea: 'Bajo el comedor techado de bambú, con sitio para una mesa larga.',
    foto: 'comedor-bambu',
    alt: 'El comedor techado con el techo de bambú, las mesas largas y el horno artesanal al fondo',
  },
  {
    titulo: 'Cocina con menaje',
    linea: 'Cada cabaña tiene sala, cocina y comedor propios, equipados.',
    foto: 'sala-escalera',
    alt: 'La sala de la cabaña con sus sillones de madera y la escalera de bambú que sube al altillo',
  },
  {
    titulo: 'Arcos de fútbol',
    linea: 'Cinco mil metros de césped abiertos a los cerros, con campo de fulbito.',
    foto: 'campo-futbol',
    alt: 'El campo de fulbito sobre el césped, con los dos arcos y los cerros al fondo',
  },
  {
    titulo: 'Pet friendly',
    linea: 'Tu perro entra. Lo único que pedimos es recoger y botar el popó.',
    foto: 'jardin-palmeras',
    alt: 'El jardín de césped con palmeras jóvenes y el toldo del área de descanso',
  },
];
