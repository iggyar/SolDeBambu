import {useState} from 'react';
import {MapPin} from 'lucide-react';
import {Boton} from '@/componentes/ui/Boton';
import {CanaSeparadora} from '@/componentes/ui/CanaSeparadora';
import {Aparece, Encabezado, Seccion} from '@/componentes/ui/Seccion';
import {NEGOCIO} from '@/config/negocio';

const {coordenadas, googleMaps, referencia, distrito, provincia, desdeLima} = NEGOCIO.ubicacion;

// Embed de Google Maps sin API key ni costo: basta con output=embed. El
// paréntesis después de las coordenadas es lo que etiqueta el marcador.
const MAPA =
  `https://www.google.com/maps?q=${coordenadas.lat},${coordenadas.lng}` +
  `(${encodeURIComponent(NEGOCIO.nombre)})&hl=es&z=15&output=embed`;

/** Los datos de llegada. Etiqueta en mono, dato en grande, una línea de detalle.
 *  El orden importa: los dos primeros van a la izquierda del mapa y los dos
 *  últimos a la derecha. */
const REFERENCIAS = [
  {
    etiqueta: 'En auto',
    titulo: `${desdeLima} desde Lima`,
    detalle: 'Todo por la Panamericana Sur, sin dejar el asfalto.',
  },
  {
    etiqueta: 'Referencia',
    titulo: referencia,
    detalle: `${distrito}, ${provincia}.`,
  },
  {
    etiqueta: 'Playa',
    titulo: 'A 15 minutos del mar',
    detalle: 'Totoritas y Bujama quedan a un salto por la misma carretera.',
  },
  {
    etiqueta: 'Horarios',
    titulo: `Ingreso ${NEGOCIO.horarios.ingreso} · salida ${NEGOCIO.horarios.salida}`,
    detalle: 'Siete horas más de día que en un hotel.',
  },
];

/**
 * EL MAPA, CON FACHADA.
 *
 * Antes esto era el iframe de Google montado siempre y con un
 * `filter: invert() hue-rotate() saturate() contrast()` encima para pasarlo a
 * oscuro. Esa combinación era el tirón que se sentía al llegar acá:
 *
 *  1. Un iframe de Google Maps no es una imagen, es una aplicación que se
 *     repinta sola (tiles, atribución, controles).
 *  2. Un `filter` de CSS obliga al navegador a rasterizar TODO ese iframe a una
 *     textura y pasarle la cadena de cuatro etapas en cada repintado.
 *  3. Y con `loading="lazy"`, la carga del mapa caía justo en el momento en que
 *     el scroll lo traía a pantalla: el pico de trabajo coincidía exactamente
 *     con el gesto de bajar.
 *
 * La fachada corta el problema de raíz: hasta que alguien no quiere el mapa, no
 * hay iframe. Lo que se ve mientras tanto es un panel nuestro, en la paleta de
 * la página, que carga en cero. Cuando se abre, el iframe va SIN filtro: a esa
 * altura el mapa es una herramienta que se está usando, y un mapa legible vale
 * más que un mapa a tono.
 *
 * De regalo, no se contacta a Google hasta que hay intención — que es también
 * lo correcto en privacidad.
 *
 * ── SIN CAJA ──────────────────────────────────────────────────────────────
 * La fachada vivía dentro de un panel con borde, fondo sólido y esquinas
 * redondeadas. En una sección que ya no tiene ni una sola caja, ese rectángulo
 * era lo único que quedaba pareciéndose a un formulario. Ahora el fondo es un
 * velo mínimo y la pieza entera se disuelve por los cuatro lados
 * (`.mapa-difuso`): lo que se ve es una carta que se apaga contra la noche, no
 * un recuadro pegado encima.
 */
function MapaEmbebido() {
  const [abierto, setAbierto] = useState(false);

  if (abierto) {
    // Nítido y entero, a propósito: ver el comentario de `.mapa-difuso`.
    return (
      <iframe
        src={MAPA}
        title={`Ubicación de ${NEGOCIO.nombre} en Google Maps`}
        referrerPolicy="no-referrer-when-downgrade"
        className="recorta-2xl h-[360px] w-full border-0 sm:h-[420px]"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setAbierto(true)}
      className="pulsable mapa-difuso group relative flex h-[360px] w-full flex-col items-center justify-center gap-5 sm:h-[420px]"
    >
      {/* El velo que queda del panel: lo justo para que la retícula tenga sobre
          qué apoyarse. Sin él las líneas flotan sueltas sobre la noche. */}
      <span aria-hidden="true" className="bg-bosque/55 absolute inset-0" />
      {/* La retícula y la luz del centro: sugieren carta náutica sin dibujar un
          mapa falso ni descargar un solo byte. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-filete) 1px, transparent 1px), linear-gradient(90deg, var(--color-filete) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.5]"
        style={{
          background:
            'radial-gradient(closest-side at 50% 50%, rgb(246 167 45 / 0.1), transparent 70%)',
        }}
      />
      <span className="bg-sol/15 text-sol relative flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-500 ease-(--ease-editorial) group-hover:scale-110">
        <MapPin size={26} strokeWidth={1.7} />
      </span>
      <span className="relative text-center">
        <span className="text-crema block text-[1rem] font-semibold">Ver el mapa</span>
        <span className="mono text-bruma-3 mt-2 block text-[0.72rem]">
          {referencia} · {distrito}
        </span>
      </span>
    </button>
  );
}

/** Una columna de datos, centrada. Sin filetes ni bordes: solo aire entre uno
 *  y otro, que a esta escala alcanza para que se lean como cuatro cosas. */
function Datos({items}: {items: typeof REFERENCIAS}) {
  return (
    <ul className="space-y-11">
      {items.map(({etiqueta, titulo, detalle}) => (
        <li key={titulo} className="text-center">
          <p className="mono text-sol mb-2.5 text-[0.72rem]">{etiqueta}</p>
          <p className="text-crema text-[0.98rem] leading-snug font-semibold">{titulo}</p>
          <p className="text-bruma-2 mx-auto mt-2 max-w-[30ch] text-[0.88rem] leading-relaxed">
            {detalle}
          </p>
        </li>
      ))}
    </ul>
  );
}

/**
 * CÓMO LLEGAR — dos datos, el mapa, dos datos.
 *
 * Antes eran dos tarjetas con borde: el mapa a la izquierda y una lista con
 * filetes a la derecha. Funcionaba, pero se leía como un formulario, que es
 * justo lo contrario de lo que vende esta página.
 *
 * La fila de tres reparte la información alrededor del mapa en vez de apilarla
 * a un costado, y lo que separa las columnas no es un borde: son dos cañas de
 * bambú (ver `.cana-separadora`). Es la misma idea que ya sostiene el bambusal
 * de la mitad de día, traída aquí como estructura y no como fondo.
 *
 * ── El apilado en celular ────────────────────────────────────────────────
 * Con una sola columna las cañas desaparecen y el orden cambia: el mapa sube al
 * primer lugar. En escritorio el mapa es el centro porque está en el centro; en
 * celular, si se queda tercero, la persona baja por cuatro datos sueltos antes
 * de encontrar el ancla de la sección.
 */
export function ComoLlegar() {
  return (
    <Seccion id="llegar">
      <Encabezado
        centrado
        grande
        etiqueta="Cómo llegar"
        titulo="En el valle de Mala, saliendo de la Panamericana."
        bajada="Se llega en auto sin dejar el asfalto. Si vas por primera vez, escríbenos y te pasamos la referencia exacta."
      />

      {/* 1.8fr en el centro y no 1.5: con la fila repartida en partes iguales el
          mapa quedaba más alto que ancho, y un mapa en formato retrato se lee
          como un cartel. Así llega a cuadrado largo, que es la proporción en la
          que se reconoce un plano. */}
      <div className="mt-16 grid items-center gap-x-12 gap-y-16 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.8fr)_auto_minmax(0,1fr)]">
        <Aparece className="desde-izq order-2 lg:order-none">
          <Datos items={REFERENCIAS.slice(0, 2)} />
        </Aparece>

        <CanaSeparadora />

        <Aparece className="order-1 lg:order-none">
          <MapaEmbebido />
          <Boton href={googleMaps} variante="linea" className="mt-8 w-full">
            Abrir en Google Maps
          </Boton>
        </Aparece>

        <CanaSeparadora />

        <Aparece className="desde-der order-3 lg:order-none">
          <Datos items={REFERENCIAS.slice(2)} />
        </Aparece>
      </div>
    </Seccion>
  );
}
