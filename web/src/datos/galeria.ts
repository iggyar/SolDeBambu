/**
 * Las fotos publicadas, con su texto alternativo y su categoría.
 * Los nombres coinciden con las claves de fotos.generado.ts.
 */

export type CategoriaFoto = 'exteriores' | 'piscina' | 'comunes' | 'interiores' | 'noche';

export type FotoGaleria = {
  nombre: string;
  /** Descripción completa, para el lector de pantalla y el pie del visor. */
  alt: string;
  /**
   * Tres o cuatro palabras, lo único que se imprime sobre la foto en el
   * carrusel. El alt explica; la etiqueta nombra.
   */
  etiqueta: string;
  categoria: CategoriaFoto;
};

export const CATEGORIAS: {id: CategoriaFoto | 'todo'; etiqueta: string}[] = [
  {id: 'todo', etiqueta: 'Todo'},
  {id: 'exteriores', etiqueta: 'Las cabañas'},
  {id: 'piscina', etiqueta: 'Piscina y jardín'},
  {id: 'comunes', etiqueta: 'Áreas comunes'},
  {id: 'interiores', etiqueta: 'Por dentro'},
  {id: 'noche', etiqueta: 'De noche'},
];

export const GALERIA: FotoGaleria[] = [
  {
    nombre: 'piscina-quincho',
    etiqueta: 'La piscina al atardecer',
    alt: 'La piscina con sus toldos de madera y el comedor techado al fondo, con los cerros de Mala detrás',
    categoria: 'piscina',
  },
  {
    nombre: 'cabanas-piscina',
    etiqueta: 'Las cabañas desde el agua',
    alt: 'Dos de las cabañas vistas desde el borde de la piscina, sobre el césped',
    categoria: 'exteriores',
  },
  {
    nombre: 'cabana-palmeras',
    etiqueta: 'La cabaña entre palmeras',
    alt: 'Una cabaña entre palmeras, con su terraza y sombrilla',
    categoria: 'exteriores',
  },
  {
    nombre: 'jardin-palmeras',
    etiqueta: 'El jardín de palmeras',
    alt: 'El jardín de césped con palmeras jóvenes y el toldo del área de descanso',
    categoria: 'piscina',
  },
  {
    nombre: 'piscina-hamacas',
    etiqueta: 'Las hamacas',
    alt: 'La piscina al atardecer, con las hamacas colgadas entre los postes de madera y el cerro detrás',
    categoria: 'piscina',
  },
  {
    nombre: 'comedor-bambu',
    etiqueta: 'El comedor de bambú',
    alt: 'El comedor techado con el techo de bambú, las mesas largas y el horno artesanal al fondo',
    categoria: 'comunes',
  },
  {
    nombre: 'sala-juegos',
    etiqueta: 'La sala de juegos',
    alt: 'La mesa de ping pong bajo el techo de bambú, con el fulbito de mesa a un costado',
    categoria: 'comunes',
  },
  {
    nombre: 'campo-futbol',
    etiqueta: 'El campo de fulbito',
    alt: 'El campo de fulbito sobre el césped, con los dos arcos y los cerros al fondo',
    categoria: 'comunes',
  },
  {
    nombre: 'sala-escalera',
    etiqueta: 'La sala y la escalera',
    alt: 'La sala de la cabaña con sus sillones de madera y la escalera de bambú que sube al altillo',
    categoria: 'interiores',
  },
  {
    nombre: 'altillo',
    etiqueta: 'El altillo',
    alt: 'El altillo bajo el techo a dos aguas, con tres camas y ventana al valle',
    categoria: 'interiores',
  },
  {
    nombre: 'altillo-ventana',
    etiqueta: 'La ventana del altillo',
    alt: 'El altillo bajo el techo a dos aguas, con la cama frente al ventanal triangular que da a las palmeras',
    categoria: 'interiores',
  },
  {
    nombre: 'dormitorio-uno',
    etiqueta: 'El dormitorio principal',
    alt: 'Dormitorio matrimonial con ventana al jardín',
    categoria: 'interiores',
  },
  {
    nombre: 'dormitorio-dos',
    etiqueta: 'El segundo dormitorio',
    alt: 'Segundo dormitorio matrimonial, con perchero y vista a la vegetación',
    categoria: 'interiores',
  },
  {
    nombre: 'cabana-noche',
    etiqueta: 'La cabaña de noche',
    alt: 'La cabaña iluminada de noche, con la sombrilla abierta y el cielo estrellado',
    categoria: 'noche',
  },
  {
    nombre: 'fogata',
    etiqueta: 'La fogata',
    alt: 'La fogata encendida al anochecer, con el techo a dos aguas de una cabaña y los cerros de Mala detrás',
    categoria: 'noche',
  },
];
