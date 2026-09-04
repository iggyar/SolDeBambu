import {Fragment} from 'react';
import {Bambusal} from '@/componentes/ambiente/Bambusal';
import {SolPresente} from '@/componentes/ambiente/SolPresente';
import {Boton} from '@/componentes/ui/Boton';
import {Foto} from '@/componentes/ui/Foto';
import {Aparece, Etiqueta} from '@/componentes/ui/Seccion';
import {NEGOCIO} from '@/config/negocio';

/** Lo que hay dentro de cada cabaña. Sin íconos: una lista con filete lee más limpia. */
const DISTRIBUCION = [
  'Sala, cocina y comedor con menaje',
  'Dormitorios matrimoniales abajo',
  'Altillo con camas de plaza y media',
  'Baño con ducha',
  'Hamaca afuera',
];

/** La franja de datos. Cuatro cifras que contestan la página entera en diez segundos. */
const FRANJA = [
  {dato: '3', unidad: 'cabañas'},
  {dato: `${NEGOCIO.capacidad.total}`, unidad: 'huéspedes'},
  {dato: '1 h 15', unidad: 'desde Lima'},
  {dato: '5 000', unidad: 'm² de área verde'},
];

/**
 * LA INTRODUCCIÓN.
 *
 * Dos columnas: a la izquierda el texto, a la derecha una composición de tres
 * fotos —una vertical grande y dos detalles que la muerden por el borde—
 * medida en porcentajes sobre una caja de proporción fija, para que el
 * solapamiento sea exactamente el mismo en cualquier ancho.
 *
 * El collage en rombos que había acá se retiró: rotar cuatro fotos 45° recorta
 * lo que importa de cada una y convierte la fotografía en un patrón. Acá la
 * foto manda y la composición se limita a decidir cuál es la principal.
 */
export function LaCabana() {
  return (
    <section id="cabanas" className="textura-grano bg-cielo recorta relative">
      <SolPresente posicion="centro" />
      {/* Bambú tenue compartido con la sección de áreas: textura gráfica,
          no un marco que compita con las fotos. */}
      <Bambusal />

      <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 xl:gap-20">
          {/* La columna entra por partes y en orden —etiqueta, titular,
              bajada, lista, botón—, desde la izquierda. Es el mismo `escalona`
              de la lista de adentro, un nivel más arriba: no hace falta un
              bloque que se desplace entero cuando cada pieza ya sabe cuándo le
              toca. Se dispara una vez, cuando la columna asoma. */}
          <div className="escalona desde-izq" style={{'--paso': '85ms'} as React.CSSProperties}>
            {/* Sin `--i`: la primera es la que abre, y `--i` ya vale 0. */}
            <Etiqueta className="text-tierra mb-6">En Mala, Perú</Etiqueta>
            <h2 className="titular titular-grande palabras text-tinta">
              <Palabras texto="Tres cabañas de madera, y el valle alrededor." />
            </h2>
            <p className="bajada text-tinta-2 mt-7" style={{'--i': 3} as React.CSSProperties}>
              Techo a dos aguas, ventanales al jardín y cinco mil metros de área verde con la
              piscina en el medio. Las cabañas 1 y 2 reciben siete personas cada una y la 3 hasta
              seis: se toma una, dos o las tres.
            </p>

            <ul
              className="escalona mt-10 grid gap-x-8 sm:grid-cols-2"
              style={{'--i': 4} as React.CSSProperties}
            >
              {DISTRIBUCION.map((texto, i) => (
                <li
                  key={texto}
                  style={{'--i': i} as React.CSSProperties}
                  className="border-arena-3/70 text-tinta border-t py-3 text-[0.95rem] leading-snug"
                >
                  {texto}
                </li>
              ))}
            </ul>

            <div className="mt-10" style={{'--i': 5} as React.CSSProperties}>
              <Boton href="#galeria" variante="sol-dia">
                Explorar las cabañas
              </Boton>
            </div>
          </div>

          <Composicion />
        </div>

        {/* ── La franja de datos ─────────────────────────────────────────
            Cuatro cifras en mono, separadas por filete. Contesta qué es,
            para cuántos y a qué distancia sin obligar a leer un párrafo. */}
        <Aparece className="mt-20 md:mt-28" demora={0.1}>
          <dl className="border-arena-3/70 grid grid-cols-2 border-t sm:grid-cols-4">
            {FRANJA.map(({dato, unidad}) => (
              <div
                key={unidad}
                className="border-arena-3/70 border-b px-1 py-6 sm:border-b-0 sm:border-l sm:px-6 sm:first:border-l-0 sm:first:pl-0"
              >
                <dd className="titular-chico text-tinta">{dato}</dd>
                <dt className="mono text-tinta-2 mt-2 text-[0.72rem]">{unidad}</dt>
              </div>
            ))}
          </dl>
        </Aparece>
      </div>
    </section>
  );
}

/**
 * Un titular partido en palabras para que entren de a una.
 *
 * El espacio va FUERA del `<span>`: dentro de una caja en línea el espacio
 * final se descarta, y las palabras terminarían pegadas. Afuera es un nodo de
 * texto de verdad, que separa y además sigue permitiendo el corte de línea
 * donde corresponde. El lector de pantalla lee la frase entera igual, porque
 * lo que cambia es la caja de cada palabra y no el texto.
 */
function Palabras({texto}: {texto: string}) {
  const palabras = texto.split(' ');
  return (
    <>
      {palabras.map((palabra, i) => (
        <Fragment key={`${palabra}-${i}`}>
          <span style={{'--i': i} as React.CSSProperties}>{palabra}</span>
          {i < palabras.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </>
  );
}

/**
 * La composición fotográfica. Una caja de proporción fija con las tres fotos
 * colocadas en porcentajes: así el solapamiento no depende del ancho de la
 * pantalla ni de cuánto mida el texto de al lado.
 *
 * Por debajo de 1024px se desarma en foto grande + dos detalles en fila: un
 * solapamiento de este tipo en 375px deja las tres fotos ilegibles.
 */
function Composicion() {
  const principal = {
    nombre: 'cabana-palmeras',
    alt: 'Una de las cabañas entre las palmeras, con su terraza y la sombrilla abierta',
  };
  const detalles = [
    {
      nombre: 'altillo-ventana',
      alt: 'El altillo bajo el techo a dos aguas, con la cama frente al ventanal triangular',
    },
    {
      nombre: 'sala-escalera',
      alt: 'La sala de la cabaña, con los sillones de madera y la escalera de bambú al altillo',
    },
  ];

  return (
    <div className="lg:w-[118%] xl:w-[126%]">
      {/* Pantalla grande: composición solapada. Las tres llegan en el orden en
          que se leen —primero la que manda, después los dos detalles que la
          muerden— y no las tres a la vez: una composición solapada que aparece
          de golpe se lee como una sola imagen con cosas encima. El paso es más
          largo que el del texto porque son tres piezas y no seis. */}
      <div
        className="escalona desde-der relative hidden aspect-[5/4] w-full lg:block"
        style={{'--paso': '150ms'} as React.CSSProperties}
      >
        <Marco className="absolute top-0 right-0 h-full w-[70%]" radio="1.25rem" orden={0}>
          <Foto
            nombre={principal.nombre}
            alt={principal.alt}
            sizes="34vw"
            className="respira h-full w-full object-cover"
          />
        </Marco>
        <Marco className="absolute top-[17%] left-0 h-[38%] w-[40%]" orden={1}>
          <Foto
            nombre={detalles[0].nombre}
            alt={detalles[0].alt}
            sizes="19vw"
            className="h-full w-full object-cover"
          />
        </Marco>
        <Marco className="absolute bottom-[4%] left-[7%] h-[32%] w-[46%]" orden={2}>
          <Foto
            nombre={detalles[1].nombre}
            alt={detalles[1].alt}
            sizes="22vw"
            className="h-full w-full object-cover"
          />
        </Marco>
      </div>

      {/* Celular y tablet: la misma jerarquía, apilada. */}
      {/* En celular la composición no está a la derecha de nada, así que entra
          desde abajo: un deslizamiento lateral en 375px empuja contra el borde
          de la pantalla en vez de venir de algún sitio. */}
      <div className="escalona desde-abajo lg:hidden" style={{'--paso': '150ms'} as React.CSSProperties}>
        <Marco className="aspect-[4/5] w-full" radio="1.25rem" orden={0}>
          <Foto
            nombre={principal.nombre}
            alt={principal.alt}
            sizes="(min-width: 640px) 92vw, 90vw"
            className="respira h-full w-full object-cover"
          />
        </Marco>
        <div className="escalona mt-3 grid grid-cols-2 gap-3" style={{'--i': 1} as React.CSSProperties}>
          {detalles.map((d, i) => (
            <Marco key={d.nombre} className="aspect-[4/3] w-full" orden={i}>
              <Foto
                nombre={d.nombre}
                alt={d.alt}
                sizes="45vw"
                className="h-full w-full object-cover"
              />
            </Marco>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * El marco de una foto: recorta con `clip-path` —nunca con `overflow: hidden`,
 * que rompería los timelines de scroll de dentro. Este collage permanece
 * completo: escalonar tres máscaras dejaba la foto inferior a medio revelar
 * cuando la persona se detenía en la sección y parecía transparente.
 */
function Marco({
  children,
  className = '',
  radio = '1rem',
  orden,
}: {
  children: React.ReactNode;
  className?: string;
  radio?: string;
  /**
   * Su turno dentro de la composición.
   *
   * El cero se escribe igual que el resto: las variables CSS se heredan, así
   * que una foto sin `--i` propio no vale 0, vale lo que valga el de su
   * contenedor — y en el apilado de celular eso hacía que el primer detalle
   * tomara el turno de la fila entera y los dos entraran juntos.
   */
  orden?: number;
}) {
  return (
    // Dos capas a propósito: el recorte se lleva puesta la sombra del elemento
    // que recorta, así que la sombra vive afuera y el clip-path adentro.
    <div
      className={`shadow-(--shadow-media) ${className}`}
      style={
        {
          borderRadius: radio,
          ...(orden === undefined ? {} : {'--i': orden}),
        } as React.CSSProperties
      }
    >
      <div className="h-full w-full" style={{clipPath: `inset(0 round ${radio})`}}>
        {children}
      </div>
    </div>
  );
}
