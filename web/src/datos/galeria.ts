/**
 * Las fotos publicadas, con su texto alternativo y su categoría.
 * Los nombres coinciden con las claves de fotos.generado.ts.
 */

export type CategoriaFoto = 'exteriores' | 'piscina' | 'interiores' | 'noche';

export type FotoGaleria = {
  nombre: string;
  alt: string;
  categoria: CategoriaFoto;
};

export const CATEGORIAS: {id: CategoriaFoto | 'todo'; etiqueta: string}[] = [
  {id: 'todo', etiqueta: 'Todo'},
  {id: 'exteriores', etiqueta: 'Las cabañas'},
  {id: 'piscina', etiqueta: 'Piscina y jardín'},
  {id: 'interiores', etiqueta: 'Por dentro'},
  {id: 'noche', etiqueta: 'De noche'},
];

export const GALERIA: FotoGaleria[] = [
  {
    nombre: 'piscina-quincho',
    alt: 'La piscina con sus toldos de madera y el comedor techado al fondo, con los cerros de Mala detrás',
    categoria: 'piscina',
  },
  {
    nombre: 'cabanas-piscina',
    alt: 'Dos de las cabañas vistas desde el borde de la piscina, sobre el césped',
    categoria: 'exteriores',
  },
  {
    nombre: 'cabana-palmeras',
    alt: 'Una cabaña entre palmeras, con su terraza y sombrilla',
    categoria: 'exteriores',
  },
  {
    nombre: 'jardin-palmeras',
    alt: 'El jardín de césped con palmeras jóvenes y el toldo del área de descanso',
    categoria: 'piscina',
  },
  {
    nombre: 'sala-escalera',
    alt: 'La sala de la cabaña con sus sillones de madera y la escalera de bambú que sube al altillo',
    categoria: 'interiores',
  },
  {
    nombre: 'altillo',
    alt: 'El altillo bajo el techo a dos aguas, con tres camas y ventana al valle',
    categoria: 'interiores',
  },
  {
    nombre: 'dormitorio-uno',
    alt: 'Dormitorio matrimonial con ventana al jardín',
    categoria: 'interiores',
  },
  {
    nombre: 'dormitorio-dos',
    alt: 'Segundo dormitorio matrimonial, con perchero y vista a la vegetación',
    categoria: 'interiores',
  },
  {
    nombre: 'cabana-noche',
    alt: 'La cabaña iluminada de noche, con la sombrilla abierta y el cielo estrellado',
    categoria: 'noche',
  },
];
