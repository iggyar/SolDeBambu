import {useEffect, useRef, useState} from 'react';
import {CAMINO, cuadro} from '@/datos/camino.generado';

function limitar(valor: number, minimo = 0, maximo = 1) {
  return Math.min(maximo, Math.max(minimo, valor));
}

function suavizar(desde: number, hasta: number, valor: number) {
  const progreso = limitar((valor - desde) / (hasta - desde));
  return progreso * progreso * (3 - 2 * progreso);
}

/**
 * EL VIAJE — una toma continua de la Panamericana a la propiedad.
 *
 * El recorrido no se reproduce contra el reloj: el scroll elige el cuadro. Así
 * la subida, el bambú que se abre y la llegada mantienen siempre su relación
 * espacial con la página. El texto acompaña dos hitos y no compite con la toma.
 *
 * ── Por qué son cuadros sueltos y no un <video> ──────────────────────────
 * Esto era un `<video>` al que el scroll le escribía `currentTime`, y se
 * arrastraba. La primera causa fue de manual: el archivo traía UN cuadro clave
 * en 145 —y en el 79, ni siquiera al principio—, así que para mostrar un cuadro
 * cualquiera el navegador tenía que decodificar decenas desde ahí. Reencodearlo
 * con todos los cuadros en clave bajó cada búsqueda de 59ms a 5ms… y seguía
 * yendo a tirones.
 *
 * Porque el problema de fondo no era el archivo: es que buscar dentro de un
 * video pasa por la tubería de medios del navegador, que está hecha para
 * reproducir hacia adelante y no para ir y venir a la velocidad del dedo. Cada
 * búsqueda es asíncrona, llega cuando llega, y ninguna cae necesariamente en el
 * fotograma en que se la necesita.
 *
 * Dibujar en un canvas una imagen que YA está decodificada no pasa por nada de
 * eso: es pintar. Es la técnica que la secuencia del atardecer usa en esta
 * misma página desde el principio —y por eso esa nunca se sintió lenta—, así
 * que acá no se inventa nada: se usa lo que ya estaba resuelto.
 *
 * Los cuadros los genera `scripts/preparar-camino.mjs`. Llevan más cuadros que
 * el atardecer aunque el clip dure menos: allí la cámara está fija y solo
 * cambia la luz; acá la cámara avanza y entre un cuadro y el siguiente se mueve
 * la escena entera.
 */
export function Camino() {
  const seccionRef = useRef<HTMLElement>(null);
  const lienzoRef = useRef<HTMLCanvasElement>(null);
  const inicioRef = useRef<HTMLDivElement>(null);
  const llegadaRef = useRef<HTMLDivElement>(null);
  const imagenes = useRef<HTMLImageElement[]>([]);
  const ultimo = useRef(-1);
  const [listo, setListo] = useState(false);
  const [quieto, setQuieto] = useState(false);

  useEffect(() => {
    const seccion = seccionRef.current;
    const canvas = lienzoRef.current;
    const inicio = inicioRef.current;
    const llegada = llegadaRef.current;
    if (!seccion || !canvas || !inicio || !llegada) return;

    const ctx = canvas.getContext('2d', {alpha: false});
    if (!ctx) return;

    // El juego se decide una sola vez, antes de precargar: si no, el celular se
    // descarga los cuadros grandes además de los suyos.
    const juego: 'ruta' | 'ruta-mov' = window.matchMedia('(min-width: 768px)').matches
      ? 'ruta'
      : 'ruta-mov';
    const total = CAMINO[juego].cuadros;
    // Con movimiento reducido la sección se encoge y muestra la foto de
    // llegada: no hay nada que recorrer y no hay nada que descargar.
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setQuieto(reducido);
    if (reducido) return;

    const dibujar = (i: number) => {
      const exacta: HTMLImageElement | undefined = imagenes.current[i];
      const servible = (c?: HTMLImageElement) => !!c?.complete && c.naturalWidth > 0;
      let img: HTMLImageElement | undefined = exacta;
      // Si el cuadro exacto todavía no llegó se pinta el más cercano que sí
      // esté, mirando hacia atrás y TAMBIÉN hacia adelante: los cuadros se
      // descargan en paralelo y no terminan en orden, así que buscar solo
      // hacia atrás dejaba sin nada a quien entraba por el principio de la
      // sección con los cuadros del final ya listos — y un lienzo opaco sin
      // dibujar no es un hueco, es un rectángulo negro a pantalla completa.
      if (!servible(img)) {
        img = undefined;
        for (let d = 1; d < imagenes.current.length && !img; d++) {
          if (servible(imagenes.current[i - d])) img = imagenes.current[i - d];
          else if (servible(imagenes.current[i + d])) img = imagenes.current[i + d];
        }
      }
      if (!img) return false;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Va acá y no al crear el contexto: asignar `canvas.width` reinicia TODO
      // el estado del contexto —transformación, suavizado, estilos—, así que
      // puesto una sola vez al montar se perdía en el primer dibujo. El cuadro
      // es de 1280 y el lienzo puede medir el doble en una pantalla retina, o
      // sea que casi siempre se amplía; Chrome interpola en calidad baja por
      // defecto y sobre una toma fotográfica ampliada eso se ve como lo que
      // es: blando.
      ctx.imageSmoothingQuality = 'high';
      // Equivalente a object-fit: cover, hecho a mano porque el canvas no lo trae.
      const escala = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * escala;
      const dh = img.naturalHeight * escala;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      // El candado se cierra solo si se pintó el cuadro PEDIDO. Con un
      // sustituto en pantalla queda abierto a propósito, para que el siguiente
      // pintado vuelva a intentarlo: si no, el sustituto se quedaba fijo hasta
      // que la persona volviera a mover el scroll.
      ultimo.current = img === exacta ? i : -1;
      return true;
    };

    let procesados = 0;
    const cargar = (i: number) => {
      if (imagenes.current[i]) return;
      const img = new Image();
      img.decoding = 'async';
      img.src = cuadro(juego, i);
      // Cada cuadro que llega repinta. Antes solo repintaban el primero y el
      // último, y entre medio quien estuviera quieto se quedaba con el
      // sustituto congelado: los cuadros de en medio llegaban a una pantalla
      // que ya nadie iba a redibujar hasta el siguiente movimiento. Repintar
      // cuesta dos décimas de milisegundo; setenta y dos veces durante la
      // descarga es nada.
      const terminar = () => {
        procesados++;
        // Solo repinta si hay algo que ganar: `ultimo` en -1 significa que en
        // pantalla hay un sustituto esperando al cuadro bueno. Con el cuadro
        // exacto ya puesto, los que sigan llegando no cambian nada de lo que
        // se ve, y cada repintado de más cuesta un recálculo de estilo.
        if (ultimo.current === -1 || ultimo.current === i) pintar();
      };
      img.onload = terminar;
      img.onerror = terminar;
      imagenes.current[i] = img;
    };

    // La descarga ocurre por proximidad y nunca porque pasó un temporizador:
    // esta sección está tres pantallas más abajo que el hero, y pedir sus
    // cuadros al montar es quitarle ancho de banda a lo único que la persona
    // está mirando en ese momento.
    let pedido = false;
    const cargarTodo = () => {
      for (let i = 0; i < total; i++) cargar(i);
    };

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting || pedido) return;
        pedido = true;
        cargarTodo();
        observador.disconnect();
      },
      {rootMargin: '200% 0px'},
    );
    observador.observe(seccion);

    function pintar() {
      const caja = seccion!.getBoundingClientRect();
      // Vía alternativa al observador, para saltos por ancla y scroll
      // programático.
      if (!pedido && caja.top < window.innerHeight * 2) {
        pedido = true;
        cargarTodo();
      }

      const recorrido = Math.max(1, seccion!.offsetHeight - window.innerHeight);
      const progreso = limitar(-caja.top / recorrido);

      const i = Math.min(total - 1, Math.round(progreso * (total - 1)));
      // El lienzo no se destapa hasta que hay algo PINTADO en él, no cuando
      // hay algo descargado: es opaco, así que enseñarlo vacío es un
      // rectángulo negro tapando el póster. Eso era la pantalla en negro.
      if (i !== ultimo.current && dibujar(i)) setListo(true);

      const salidaInicio = 1 - suavizar(0.2, 0.39, progreso);
      inicio!.style.opacity = salidaInicio.toFixed(3);
      inicio!.style.transform = `translate3d(0, ${(-12 * (1 - salidaInicio)).toFixed(2)}px, 0)`;

      const entradaLlegada = suavizar(0.72, 0.88, progreso);
      llegada!.style.opacity = entradaLlegada.toFixed(3);
      llegada!.style.transform = `translate3d(0, ${(22 * (1 - entradaLlegada)).toFixed(2)}px, 0)`;
    }

    // Sin `requestAnimationFrame` a propósito, igual que la secuencia del
    // atardecer: el candado que evita encolar dos pintados solo se suelta
    // dentro del callback, y rAF no corre con la pestaña oculta —así que una
    // pestaña de fondo que vuelve al frente se quedaba sin dibujar y con la
    // descarga sin pedir. El navegador ya entrega el scroll una vez por
    // fotograma, y dibujar una imagen decodificada es barato.
    pintar();
    window.addEventListener('scroll', pintar, {passive: true});
    window.addEventListener('resize', pintar);

    return () => {
      observador.disconnect();
      window.removeEventListener('scroll', pintar);
      window.removeEventListener('resize', pintar);
    };
  }, []);

  return (
    <section
      ref={seccionRef}
      id="viaje"
      aria-label="El camino a Sol de Bambú"
      // Cuatro pantallas de toma oscura a sangre con la hora todavía en
      // mediodía: sin esto la barra iba celeste sobre la carretera de noche.
      data-oscuro="1"
      className="camino-recorrido bg-cielo relative h-[400svh]"
    >
      <div className="camino-sticky bg-tinta recorta sticky top-0 h-svh">
        {/* El póster sostiene el cuadro mientras llegan los demás: el canvas es
            opaco desde el primer píxel, así que mostrarlo vacío sería un
            rectángulo negro y no una fotografía.

            Es el primer cuadro de la secuencia y no una captura aparte: el PNG
            que había acá pesaba 2 MB para mostrar exactamente la misma imagen
            que `ruta-000.webp` da en 51 KB. Además es el cuadro que el canvas
            va a dibujar encima, así que el relevo es invisible. */}
        <img
          src="/camino/ruta-000.webp"
          alt=""
          aria-hidden="true"
          className="camino-poster-inicio absolute inset-0 h-full w-full object-cover object-center"
        />

        <canvas
          ref={lienzoRef}
          aria-hidden="true"
          className={`camino-lienzo absolute inset-0 h-full w-full transition-opacity duration-500 ${
            listo ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* La foto de llegada existe SOLO para quien pidió menos movimiento, y
            por eso no se declara hasta saber que hace falta.
            
            Tenerla siempre en el HTML y esconderla con `display: none` no
            evitaba nada: medido en el navegador, Chrome se descargaba los
            2.6 MB igual, y `loading="lazy"` tampoco los frenó —una imagen sin
            caja no deja de pedirse, solo deja de tener sitio—. Montarla o no
            es lo único que de verdad decide si viaja. */}
        {quieto && (
          <img
            src="/fotos/panamericana-keyframe-final-v10-hq.png"
            alt="Vista aérea de Sol de Bambú al atardecer, con la piscina y las tres cabañas"
            className="camino-poster-final absolute inset-0 hidden h-full w-full object-cover object-center"
          />
        )}

        <p className="sr-only">
          A solo 1 hora 15 minutos de Lima, en el kilómetro 86 de la Panamericana Sur. Esto es Sol
          de Bambú.
        </p>

        <div
          ref={inicioRef}
          aria-hidden="true"
          className="camino-mensaje camino-mensaje--inicio absolute inset-x-0 bottom-[9svh] z-10 mx-auto max-w-6xl px-5 sm:px-8"
        >
          <p className="mono text-sol-vivo mb-4 text-[0.72rem]">
            Km 86 · Panamericana Sur · Mala
          </p>
          <h2 className="titular titular-grande text-crema max-w-2xl">
            A solo 1 h 15 de Lima.
          </h2>
        </div>

        <div
          ref={llegadaRef}
          aria-hidden="true"
          className="camino-mensaje camino-mensaje--llegada absolute inset-x-0 bottom-[10svh] z-10 mx-auto max-w-6xl px-5 opacity-0 sm:px-8"
        >
          <h2 className="titular titular-grande text-crema max-w-3xl">
            Esto es Sol de Bambú.
          </h2>
        </div>
      </div>

      {/* EL VELO DE ENTRADA.
          Va aquí —hermano del pegajoso, dentro de la sección— y no dentro de
          él, y esa es toda la diferencia: dentro del pegajoso se quedaría
          clavado en el borde superior de la pantalla durante las cuatro
          pantallas que dura el recorrido, y el cielo de la toma tendría una
          neblina celeste permanente. Aquí pertenece al documento: cose la
          costura mientras la sección entra y después se va hacia arriba con
          ella y no vuelve.

          `z-20` para pasar por encima del lienzo pegajoso; el texto del
          recorrido vive al pie, así que nunca se cruzan. */}
      <div
        aria-hidden="true"
        className="disuelve-dia pointer-events-none absolute inset-x-0 top-0 z-20 h-[34svh]"
      />
    </section>
  );
}
