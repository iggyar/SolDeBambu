import {ArrowLeft, ArrowRight, ExternalLink, MapPin, Star} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';
import {Estrellas} from '@/componentes/ui/Estrellas';
import {Encabezado, Seccion} from '@/componentes/ui/Seccion';
import {NEGOCIO} from '@/config/negocio';
import {RESENAS} from '@/datos/resenas';

const {puntaje} = NEGOCIO.reseñasGoogle;

/**
 * LAS CINCO QUE VUELAN.
 *
 * Un calco de la capa de estrellas de la cápsula: mismo tamaño de estrella,
 * mismo `gap`, y el puntaje y el texto presentes pero invisibles para que
 * ocupen exactamente el mismo sitio. Eso es lo que hace que las cinco aterricen
 * sobre las cinco de la cápsula sin una sola coordenada escrita a mano — si
 * mañana cambia el texto del botón, el aterrizaje se corrige solo.
 *
 * Cada estrella va envuelta en un `<span>` y no suelta: la estela es un
 * `::before`, y un `<svg>` es un elemento reemplazado, así que sus
 * pseudoelementos no se dibujan.
 */
function FugacesEnVuelo() {
  return (
    <div className="fugaces" aria-hidden="true">
      <div className="flex gap-0.5">
        {Array.from({length: 5}, (_, i) => (
          <span key={i} className="fugaz">
            <Star size={15} strokeWidth={0} className="fill-[#F2A93B]" />
          </span>
        ))}
      </div>
      {puntaje !== null && (
        <span className="invisible text-[0.88rem] font-semibold">{puntaje.toFixed(1)}</span>
      )}
      <span className="invisible text-[0.86rem] font-medium">Publicadas en Google</span>
    </div>
  );
}

/**
 * LO QUE DICEN.
 *
 * Tres reseñas a la vez, centradas y sin caja: el texto, quién lo dijo y nada
 * más. Antes eran tarjetas grandes de una en una dentro de un panel con borde;
 * el borde se fue con el resto de las cajas de la página y el tamaño bajó,
 * porque una reseña no compite con el titular, lo respalda.
 *
 * El carrusel sigue siendo scroll nativo con `scroll-snap` y no un carrusel de
 * JavaScript: funciona con el dedo, con el trackpad, con la rueda y con el
 * teclado sin programar ninguna de esas cuatro cosas, y si el JS falla sigue
 * siendo una tira que se puede desplazar. Las flechas son un mando encima de
 * eso, no el mecanismo.
 *
 * ── Por qué las posiciones se cuentan y no se escriben ────────────────────
 * Cuántas hay depende de cuántas tarjetas entren, y eso lo decide el ancho:
 * con tres a la vista y cuatro reseñas hay DOS posiciones reales, no cuatro.
 * De ahí sale tanto el contador como el momento en que cada flecha se apaga;
 * escrito a mano, la flecha derecha habría seguido encendida prometiendo un
 * movimiento que el scroll ya no tiene. Se miden las que entran y se restan.
 *
 * Ninguna reseña se inventa ni se retoca: son las publicadas en Google, con su
 * autor. La de Jeri viene cortada por el «…Más» de Google y se marca como tal.
 */
export function Resenas() {
  const pista = useRef<HTMLDivElement>(null);
  const [activa, setActiva] = useState(0);
  const [posiciones, setPosiciones] = useState(1);

  /** Lo que avanza el scroll por tarjeta: su ancho más la separación real. */
  const paso = () => {
    const el = pista.current;
    const tarjeta = el?.firstElementChild as HTMLElement | null;
    if (!el || !tarjeta) return 0;
    return tarjeta.offsetWidth + (parseFloat(getComputedStyle(el).columnGap) || 0);
  };

  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    const medir = () => {
      const p = paso();
      if (!p) return;
      const visibles = Math.max(1, Math.round(el.clientWidth / p));
      setPosiciones(Math.max(1, RESENAS.length - visibles + 1));
    };
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, []);

  const alDesplazar = () => {
    const el = pista.current;
    const p = paso();
    if (!el || !p) return;
    setActiva(Math.min(posiciones - 1, Math.max(0, Math.round(el.scrollLeft / p))));
  };

  const irA = (i: number) => {
    const el = pista.current;
    const p = paso();
    if (!el || !p) return;
    el.scrollTo({left: i * p, behavior: 'smooth'});
  };

  return (
    <Seccion id="resenas">
      <Encabezado
        centrado
        grande
        etiqueta="Lo que dicen"
        titulo={
          <>
            Nadie lo cuenta <span className="text-sol">mejor</span> que quien ya estuvo.
          </>
        }
      />

      {/* LA ESCENA DE LAS CINCO FUGACES.
          `escena-fugaces` no dibuja ni anima nada: es el disparador que el
          observador de entradas marca cuando la sección asoma (ver
          lib/entrada.ts). Todo lo que se mueve son sus descendientes.

          Dentro, la cápsula de Google y la capa de vuelo son HERMANAS, no una
          dentro de la otra, y el motivo está en `.fugaces`: la cápsula recorta
          con `clip-path` para el barrido del hover, y una estrella que volara
          dentro aparecería de golpe al cruzar ese borde. */}
      <div className="escena-fugaces mt-11 flex justify-center">
        <div className="aterrizaje">
          <a
            href={NEGOCIO.reseñasGoogle.enlace}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ver las reseñas de Sol de Bambú en Google Maps; se abre en una pestaña nueva"
            className="enlace-resenas-google capsula-aterriza"
          >
            <span className="enlace-resenas-google__capa enlace-resenas-google__capa--estrellas">
              <Estrellas cantidad={5} tamano={15} />
              {puntaje !== null && (
                <span className="text-crema text-[0.95rem] font-semibold">
                  {puntaje.toFixed(1)}
                </span>
              )}
              <span className="text-bruma-2 text-[0.86rem] font-medium">Publicadas en Google</span>
            </span>

            <span className="enlace-resenas-google__capa enlace-resenas-google__capa--mapa">
              <MapPin size={17} strokeWidth={1.9} aria-hidden="true" />
              <span>Ver en Google Maps</span>
              <ExternalLink size={14} strokeWidth={1.9} aria-hidden="true" />
            </span>
          </a>

          <FugacesEnVuelo />
        </div>
      </div>

      <div
        ref={pista}
        onScroll={alDesplazar}
        className="sin-scrollbar mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth"
      >
        {RESENAS.map((r) => (
          <figure
            key={r.autor}
            className="flex w-full shrink-0 snap-start flex-col items-center px-2 text-center sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
          >
            {/* La comilla angular, en el acento: es lo que dice "esto lo dijo
                alguien" antes de leer una palabra. */}
            <span
              aria-hidden="true"
              className="text-sol font-serif block text-5xl leading-[0.6] select-none"
            >
              «
            </span>

            {/* Cuatro líneas para todas, sean de diez palabras o de cuarenta y
                siete: cuatro columnas de alto distinto se leen como un error de
                maquetación. El bloque mide siempre esas cuatro líneas y el texto
                se centra dentro, así los nombres caen todos en la misma altura
                sin que las reseñas cortas queden colgando de arriba. */}
            {/* 1.1rem es el escalón `bajada` de DESIGN.md, uno por encima del
                cuerpo normal. Una reseña no es texto de relleno: es lo único de
                la página que no escribimos nosotros, y a tamaño de cuerpo
                quedaba pidiendo perdón debajo de un titular de 86px. */}
            <blockquote className="text-bruma-2 mt-9 flex min-h-[6.6em] items-center text-[1.1rem] leading-[1.5]">
              <span className="line-clamp-4">
                {r.texto}
                {/* Si Google cortó el texto con su "…Más", se marca en vez de
                    completarlo por nuestra cuenta. */}
                {r.truncada && <span className="text-bruma-3">…</span>}
              </span>
            </blockquote>

            <figcaption className="mt-9">
              <span className="text-crema block text-[1.02rem] font-semibold">{r.autor}</span>
              <span className="mono text-bruma-3 mt-2 block text-[0.72rem]">
                {r.cuando} · Google
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* DOS FLECHAS Y NO UNA FILA DE PUNTOS.
          Un punto dice DÓNDE estás; una flecha dice QUÉ va a pasar si la tocas,
          que es lo único que hace falta aquí. Con dos posiciones en escritorio,
          además, los puntos eran dos bolitas que no significaban nada.

          Siguen siendo un mando sobre el scroll nativo, no el mecanismo: la
          tira se puede seguir arrastrando con el dedo y con el trackpad aunque
          estos botones no existan. Se desactivan en los extremos en vez de dar
          la vuelta, para que la flecha nunca prometa un movimiento que no hay. */}
      {posiciones > 1 && (
        <div className="mt-14 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => irA(activa - 1)}
            disabled={activa === 0}
            aria-label="Reseñas anteriores"
            className="pulsable border-filete text-crema hover:border-bruma-3 hover:bg-bruma/5 flex h-12 w-12 items-center justify-center rounded-full border transition-colors duration-300 disabled:pointer-events-none disabled:opacity-25"
          >
            <ArrowLeft size={18} strokeWidth={1.9} />
          </button>

          <p className="mono text-bruma-3 w-16 text-center text-[0.72rem] tabular-nums">
            {String(activa + 1).padStart(2, '0')} <span className="opacity-45">/</span>{' '}
            {String(posiciones).padStart(2, '0')}
          </p>

          <button
            type="button"
            onClick={() => irA(activa + 1)}
            disabled={activa === posiciones - 1}
            aria-label="Reseñas siguientes"
            className="pulsable border-filete text-crema hover:border-bruma-3 hover:bg-bruma/5 flex h-12 w-12 items-center justify-center rounded-full border transition-colors duration-300 disabled:pointer-events-none disabled:opacity-25"
          >
            <ArrowRight size={18} strokeWidth={1.9} />
          </button>
        </div>
      )}
    </Seccion>
  );
}
