import {ArrowLeft, ArrowRight, Expand} from 'lucide-react';
import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Foto} from '@/componentes/ui/Foto';
import {Lightbox} from '@/componentes/Lightbox';
import {Aparece} from '@/componentes/ui/Seccion';
import {GALERIA} from '@/datos/galeria';

/** Cuánto hay que arrastrar para que cuente como un pase y no como un temblor. */
const UMBRAL = 52;
/** Por debajo de esto el gesto fue un toque, no un arrastre. */
const TOQUE = 8;
/** Más allá de esta distancia del centro, todas las láminas se ven igual. */
const PROFUNDIDAD = 3;

/**
 * Cuánto dura cada salto intermedio de un viaje de varias láminas.
 *
 * El ritmo se reparte entre lo que falta, con techo y suelo: un viaje largo
 * aprieta el paso para no eternizarse, y como el divisor baja según se acerca,
 * los últimos saltos son más lentos que los primeros. Eso es la desaceleración
 * —la cinta llega frenando, no de golpe— y sale de la propia cuenta, sin curva
 * aparte que mantener.
 */
const saltoDe = (restantes: number) => Math.max(130, Math.min(200, Math.round(700 / restantes)));

/**
 * El rebote de la lámina que acaba de caer en el eje.
 *
 * Va sobre `scale`, la propiedad independiente, y no sobre `transform`: la
 * lámina ya tiene ahí su escala de estado con una transición corriendo, y dos
 * cosas escribiendo la misma propiedad se pisan. Como `scale` se aplica ANTES
 * que `transform`, el rebote se multiplica con la escala de estado en vez de
 * reemplazarla, y al terminar la animación el valor vuelve solo a 1.
 */
const REBOTE: Keyframe[] = [{scale: '1'}, {scale: '1.035', offset: 0.42}, {scale: '1'}];

/**
 * EL RETROCESO DE CÁMARA.
 *
 * Al pulsar la flecha, la cinta entera se aleja un poco, viaja, y vuelve. No es
 * un adorno: es lo que hace que el salto se lea como un movimiento de cámara y
 * no como una lámina que se desliza sobre otra. Un travelling de verdad
 * retrocede antes de desplazarse, porque encuadrar más ancho es lo que permite
 * moverse sin que el encuadre pegue un tirón.
 *
 * Las curvas de cada tramo son distintas a propósito: la salida es rápida y se
 * frena —el ojo tiene que enterarse de que algo empezó—, y la vuelta es larga y
 * simétrica, que es lo que se siente como aterrizar. Un solo `easing` para los
 * dos tramos daba un rebote de muelle, que es justo lo contrario.
 *
 * Va como animación WAAPI y no como transición CSS por la misma razón que el
 * rebote de la lámina: la cinta ya tiene su `transition-duration` escrita y
 * reescrita desde JS a lo largo de un viaje de varios saltos, y una transición
 * más sobre el mismo elemento quedaría a merced de esos cambios. Una animación
 * corre con su propio reloj y no la pisa nadie.
 *
 * Y va sobre la PISTA y no sobre la cinta: la cinta mide varios miles de
 * píxeles y su centro de transformación cae en su propia mitad, o sea lejísimos
 * del eje que la persona está mirando; escalarla desde ahí desplazaría la
 * lámina activa en vez de alejarla. La pista mide una pantalla y está centrada
 * en el eje, así que su centro ES el punto que se está mirando.
 */
const RETROCESO: Keyframe[] = [
  {scale: '1', easing: 'cubic-bezier(0.34, 0, 0.2, 1)'},
  {scale: '0.955', offset: 0.32, easing: 'cubic-bezier(0.4, 0, 0.25, 1)'},
  {scale: '1'},
];

const SOMBRA_CENTRO = '0 18px 45px rgba(16, 27, 45, 0.16)';
const SOMBRA_LADO = '0 8px 22px rgba(16, 27, 45, 0.10)';

const sinMovimiento = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * LA GALERÍA — una cinta editorial de láminas.
 *
 * La sección no explica la propiedad, la expone: encabezado de portada
 * centrado, una fila de fotografías verticales que cruza la pantalla entera, y
 * abajo la ficha de la que está seleccionada. Es el único lugar de la página
 * que se presenta como una colección, y por eso es el único que usa la serif.
 *
 * ── Por qué todas las láminas miden lo mismo ─────────────────────────────
 * Las laterales se ven más chicas, pero su CAJA es idéntica a la de la activa:
 * lo que las encoge es un `scale` sobre el contenido. Si cada una midiera
 * distinto, el paso entre láminas cambiaría según cuál esté al centro y el
 * recentrado nunca caería en el mismo sitio. Con la caja constante, el
 * desplazamiento de la cinta es una multiplicación y la lámina activa queda
 * clavada en el eje siempre.
 *
 * ── Por qué la cinta se coloca con píxeles medidos y no con `calc()` ─────
 * La posición de la cinta era un `calc()` con variables CSS dentro de un
 * `transform` que además transiciona. Chrome deja de reevaluar ese valor: la
 * cadena cambia con cada lámina y la matriz usada se queda clavada en la
 * anterior, así que la cinta se descuadraba y la lámina activa terminaba fuera
 * del eje —cada paso sumaba el error hasta dejarla contra el borde. Acá la
 * medida se toma del propio DOM (dónde empieza la lámina y cuánto mide) y lo
 * que se escribe es un número de píxeles: sin variables dentro del transform no
 * hay nada que el navegador pueda dejar sin resolver, y el centrado es exacto
 * por construcción en cualquier ancho.
 *
 * ── Por qué el toque se resuelve en el `pointerup` y no en un `onClick` ──
 * La cinta captura el puntero al bajar el dedo para que el arrastre siga
 * funcionando cuando el cursor se sale de la caja. El efecto secundario es que
 * mientras la captura está viva el navegador reapunta los eventos de ratón al
 * elemento que captura: el `click` posterior se dispara sobre la cinta y NUNCA
 * sobre la lámina, así que un `onClick` en la lámina no se ejecuta jamás. Por
 * eso el toque se decide acá: se anota sobre qué lámina bajó el dedo y, al
 * soltar, si el recorrido fue menor que un toque se trata como clic. El
 * `onClick` de la lámina queda solo para el teclado (`detail === 0`).
 *
 * ── Por qué cambiar de lámina es un viaje y no un salto ─────────────────
 * Pasar de la 5 a la 8 no lleva la cinta de un tirón: la lleva por la 6 y por
 * la 7, un salto corto cada una, y cada lámina que cruza el eje rebota al
 * pasar. Un desplazamiento largo y liso no dice cuánto te moviste —la cinta se
 * va y aparece otra foto—, mientras que ver pasar las del camino sí: la
 * colección se lee como una colección y no como una sustitución. Los saltos
 * intermedios son cortos y el último aterriza con la duración de reposo, así
 * que el viaje frena en vez de chocar.
 *
 * El destino vive en una `ref` y no en el estado: mientras el viaje corre hay
 * un `setState` por salto, y leer el destino del render sería leer siempre uno
 * viejo. Con la `ref`, pulsar la flecha tres veces seguidas suma tres láminas
 * al destino aunque los tres clics caigan en el mismo fotograma.
 *
 * ── Por qué el arrastre no pasa por el estado de React ───────────────────
 * Mientras el dedo está abajo hay un evento de puntero por fotograma. Meter
 * cada uno en `useState` es un render completo para mover una caja: el
 * arrastre se escribe directo sobre el `transform` de la cinta y React se
 * entera una sola vez, al soltar.
 */
export function GaleriaCarrusel() {
  // Arranca en la tercera y no en la primera: con la primera al centro, la
  // mitad izquierda de la cinta queda vacía y la sección abre coja. Desde la
  // tercera hay láminas a los dos lados en cualquier pantalla de escritorio,
  // que es la composición que la sección viene a hacer. El contador dice en
  // cuál estás, así que no se pierde nada.
  const [activo, setActivo] = useState(2);
  const [ampliada, setAmpliada] = useState<number | null>(null);
  const cinta = useRef<HTMLDivElement>(null);
  const gesto = useRef<{x: number; dx: number; lamina: number} | null>(null);
  /** Dónde tiene que quedar la cinta para que la lámina activa caiga en el eje. */
  const centro = useRef(0);
  /** De centro a centro de lámina: lo que hay que recorrer para pasar una. */
  const pasoPx = useRef(320);
  /** Lo que lleva empujado el trackpad, y la cita para asentarlo. */
  const rueda = useRef<{px: number; espera: number | null}>({px: 0, espera: null});
  /** La lámina que está en el eje ahora mismo, sin esperar al render. */
  const actual = useRef(2);
  /** La lámina a la que va el viaje en curso. */
  const destino = useRef(2);
  /** El temporizador del próximo salto, o `null` si no hay viaje. */
  const viaje = useRef<number | null>(null);
  /** La última lámina que pasó por el eje durante un gesto vivo. */
  const cruce = useRef(2);
  /** Qué lámina rebotó y cuándo, para no rebotar dos veces por una llegada. */
  const ultimoRebote = useRef({lamina: -1, en: 0});
  const total = GALERIA.length;

  const limitar = (i: number) => Math.min(total - 1, Math.max(0, i));

  /** Las caras: el botón de cada lámina, que es lo que lleva el arco. */
  /** La caja de una pantalla de ancho donde vive la cinta. Es lo que retrocede. */
  const pista = useRef<HTMLDivElement>(null);

  const caras = () =>
    Array.from(cinta.current?.children ?? []).map((l) => l.firstElementChild as HTMLElement | null);

  /** La foto que está derivando ahora mismo, para poder devolverla al centro. */
  const derivada = useRef<HTMLElement | null>(null);

  const quieta = (foto: HTMLElement | null) => {
    if (foto) foto.style.translate = '0px 0px';
  };

  /**
   * El encuadre de la lámina activa sigue al puntero, dividido por treinta.
   *
   * Treinta es el número que separa "la foto respira" de "la foto persigue el
   * ratón": sobre una lámina de unos 340px el recorrido máximo queda en cinco
   * o seis píxeles, que se notan sin que nadie sepa qué se está moviendo.
   *
   * Solo con ratón. Un dedo no pasea por encima de nada —toca—, así que en
   * táctil esto sería un tirón al empezar el arrastre y nada más.
   */
  const derivar = (e: React.PointerEvent) => {
    const cara = caras()[activo];
    const foto = cara?.querySelector<HTMLElement>('img') ?? null;
    // La anterior se devuelve al centro en cuanto deja de ser la activa: si no,
    // se quedaba congelada con el último desplazamiento que le tocó.
    if (derivada.current && derivada.current !== foto) quieta(derivada.current);
    derivada.current = foto;
    if (!foto || !cara) return;
    const r = cara.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / 30;
    const y = (e.clientY - (r.top + r.height / 2)) / 30;
    // Píxeles medidos y no una variable CSS: ver `.lamina-foto` en index.css.
    foto.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
  };

  const soltarDeriva = () => {
    quieta(derivada.current);
    derivada.current = null;
  };

  /**
   * Escribe el arco entero para un centro que puede caer ENTRE dos láminas.
   *
   * Es la pieza que hace que el gesto se vea mientras la mano sigue abajo.
   * Antes el arco se calculaba en el render con la distancia entera
   * `i - activo`, y una distancia entera solo cambia cuando cambia el estado
   * —o sea, al soltar—: durante todo el arrastre las láminas iban rígidas y el
   * cambio aparecía de golpe al final. Acá el centro es un número con
   * decimales, así que la que viene crece y se endereza a medida que el dedo la
   * trae y la que se va se hunde. Las fórmulas son las mismas de siempre,
   * escritas de forma continua: en los enteros dan exactamente los valores de
   * antes.
   */
  const pintar = (c: number) => {
    caras().forEach((cara, i) => {
      if (!cara) return;
      const d = i - c;
      const ad = Math.abs(d);
      // Más allá del fondo del arco todas se ven igual, así que una vez
      // escritas en el tope no hay nada que reescribir por fotograma.
      const enTope = ad >= PROFUNDIDAD;
      if (enTope && cara.dataset.tope === '1') return;
      cara.dataset.tope = enTope ? '1' : '';

      const lejos = Math.min(ad, PROFUNDIDAD);
      /** Cuánto ha dejado de ser la del centro: 0 en el eje, 1 a una lámina. */
      const t = Math.min(ad, 1);
      const y = ad <= 1 ? -13 + ad * 22 : lejos * 11 - 2;
      const escala = ad <= 1 ? 1 - ad * 0.073 : 0.95 - lejos * 0.023;
      // La inclinación sigue el signo —a la izquierda cae hacia la izquierda—
      // y se detiene en grado y medio: es lo que se lee como naipes apoyados
      // en vez de como un efecto.
      const giro = Math.max(-PROFUNDIDAD, Math.min(PROFUNDIDAD, d)) * 0.5;
      // Y la fuga: las laterales no solo encogen, se van hacia atrás. Encoger
      // es lo que hace una cosa lejana en un dibujo plano; irse hacia atrás es
      // lo que hace una cosa lejana. Siete grados es poco a propósito —lo justo
      // para que el ojo lea que la lámina activa está DELANTE de las otras y no
      // simplemente que es la más grande.
      const fuga = t * 7;

      // La perspectiva va dentro del propio `transform` y no en un envoltorio:
      // así cada lámina tiene su punto de fuga en su propio centro. Con una
      // perspectiva compartida en la cinta, las de los extremos —que están a
      // varios anchos del centro— se verían torcidas hacia adentro como si la
      // fila se cerrara, y esto es un arco, no un pasillo.
      cara.style.transform =
        `perspective(1400px) translate3d(0, ${y}px, 0) ` +
        `rotateX(${fuga.toFixed(2)}deg) scale(${escala}) rotate(${giro}deg)`;
      cara.style.opacity = `${ad <= 1 ? 1 - ad * 0.272 : 0.8 - lejos * 0.072}`;
      // `saturate` siempre puesto y nunca `none`: un filtro promueve el
      // elemento a su propia capa de composición, y dejar a la lámina del
      // centro como la única sin filtro la hacía la única que se componía por
      // otro camino. Con filtro en las quince, ninguna puede parpadear.
      cara.style.filter = `saturate(${1 - 0.15 * t}) brightness(${1 - 0.03 * t})`;
      cara.style.zIndex = `${PROFUNDIDAD + 1 - Math.round(lejos)}`;
      // La sombra es lo único que se queda en dos valores y no en una rampa:
      // interpolarla por fotograma obliga a repintar quince sombras suaves en
      // cada movimiento del dedo, que es el trabajo más caro de todo el gesto
      // para una diferencia que en movimiento no se ve.
      const sombra = ad < 0.5 ? SOMBRA_CENTRO : SOMBRA_LADO;
      if (cara.style.boxShadow !== sombra) cara.style.boxShadow = sombra;
      // La lupa es de la lámina del centro: si el dedo se la lleva, se va con
      // ella en vez de quedarse encendida sobre una que ya no lo es.
      const lupa = cara.querySelector<HTMLElement>('[data-lupa]');
      if (lupa) lupa.style.opacity = `${Math.max(0, 1 - ad * 2)}`;
    });
  };

  /** Enciende o apaga el recorrido: durante el gesto nada interpola. */
  const transiciones = (activas: boolean) => {
    const poner = (el: HTMLElement | null | undefined) => {
      if (!el) return;
      if (activas) el.style.removeProperty('transition-duration');
      else el.style.transitionDuration = '0ms';
    };
    poner(cinta.current);
    for (const cara of caras()) poner(cara);
  };

  const cortarViaje = () => {
    if (viaje.current !== null) window.clearTimeout(viaje.current);
    viaje.current = null;
  };

  /** Un salto del viaje: una lámina, y la cita para la siguiente. */
  const saltar = () => {
    viaje.current = null;
    const restantes = destino.current - actual.current;
    if (restantes === 0) return;

    const siguiente = actual.current + Math.sign(restantes);
    const ultimo = siguiente === destino.current;
    const duracion = saltoDe(Math.abs(restantes));
    // La duración se escribe ANTES del `setState`: el recentrado corre en el
    // `useLayoutEffect` de abajo y usa la que tenga la cinta puesta en ese
    // momento. El último salto se queda sin override, o sea con los 620ms del
    // reposo: es el que aterriza.
    if (cinta.current) {
      if (ultimo) cinta.current.style.removeProperty('transition-duration');
      else cinta.current.style.transitionDuration = `${duracion}ms`;
    }

    actual.current = siguiente;
    setActivo(siguiente);
    // El viaje sigue vivo un compás DESPUÉS del último salto, aunque no quede
    // nada por recorrer. Sin esa cola, tres flechas dentro del mismo fotograma
    // se resolvían como tres saltos finales seguidos —o sea, una sola lámina
    // aparecida tres más allá—; con ella, la segunda y la tercera llegan a
    // tiempo de convertirse en tramos del mismo viaje y las láminas del camino
    // pasan por el eje. Si nadie pide nada, el compás se cumple y se apaga.
    viaje.current = window.setTimeout(saltar, ultimo ? saltoDe(1) : duracion);
  };

  const irA = (i: number) => {
    destino.current = limitar(i);
    // Solo cuando el viaje ARRANCA. Pulsar tres veces seguidas es un viaje de
    // tres láminas, no tres retrocesos encimados: el segundo y el tercero
    // reiniciarían la animación desde 1 y la cámara daría un tirón hacia
    // adelante en mitad del desplazamiento.
    if (viaje.current === null && destino.current !== actual.current) retroceder();
    if (sinMovimiento()) {
      // Sin movimiento no hay viaje que valga: se llega y ya.
      cortarViaje();
      actual.current = destino.current;
      setActivo(destino.current);
      return;
    }
    // Si ya hay un salto en cola, ese mismo leerá el destino nuevo cuando le
    // toque. Arrancar otro acá sería mover dos láminas en el mismo fotograma.
    if (viaje.current === null) saltar();
  };

  // El paso relativo se cuenta desde el DESTINO mientras hay viaje: pulsar la
  // flecha tres veces seguidas tiene que sumar tres láminas, y contar desde la
  // que está en el eje haría que los tres clics pidieran la misma.
  const ir = (paso: number) => irA((viaje.current !== null ? destino.current : actual.current) + paso);

  /** El retroceso de cámara, una vez por viaje y no una vez por salto. */
  const retroceder = () => {
    if (sinMovimiento()) return;
    pista.current?.animate(RETROCESO, {duration: 900, easing: 'linear'});
  };

  /** El rebote de una lámina al caer en el eje. */
  const rebotar = (i: number) => {
    if (sinMovimiento()) return;
    const ahora = performance.now();
    // La que ya rebotó al pasar bajo el dedo no vuelve a rebotar cuando el
    // gesto se asienta sobre ella: sería un doble golpe para una sola llegada.
    if (ultimoRebote.current.lamina === i && ahora - ultimoRebote.current.en < 400) return;
    ultimoRebote.current = {lamina: i, en: ahora};
    const rebote = caras()[i]?.animate(REBOTE, {
      duration: 420,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    });
    // Una animación terminada que no rellena se queda igual en la lista del
    // elemento: sin esto, una sesión larga deja un objeto muerto por cada
    // lámina que pasó. Al terminar ya está en su valor de reposo, así que
    // cancelarla no se ve.
    if (rebote) rebote.onfinish = () => rebote.cancel();
  };

  const primerRender = useRef(true);
  useEffect(() => {
    // En el primer render la lámina ya entra con su propia animación de
    // entrada; un rebote encima sería una animación sobre otra.
    if (primerRender.current) {
      primerRender.current = false;
      return;
    }
    rebotar(activo);
  }, [activo]);

  useEffect(
    () => () => {
      cortarViaje();
      if (rueda.current.espera !== null) window.clearTimeout(rueda.current.espera);
    },
    [],
  );

  /** Escribe la posición de la cinta: el centro de la activa más el gesto. */
  const colocar = (px = 0) => {
    if (cinta.current) cinta.current.style.transform = `translate3d(${centro.current + px}px, 0, 0)`;
  };

  /**
   * Un fotograma de gesto vivo: la cinta sigue a la mano y el arco se repinta
   * con el centro donde haya quedado, que casi nunca es una lámina entera. Cada
   * vez que una nueva pasa por el eje, rebota — el "van pasando" ocurre durante
   * el gesto, que es cuando la mano lo está pidiendo, y no al soltar.
   */
  const vivir = (px: number) => {
    const c = actual.current - px / pasoPx.current;
    colocar(px);
    pintar(c);
    const cerca = limitar(Math.round(c));
    if (cerca !== cruce.current) {
      cruce.current = cerca;
      rebotar(cerca);
    }
  };

  /**
   * Cierra un gesto vivo: vuelven las transiciones y se decide dónde queda.
   *
   * El asentado NO usa el viaje por saltos aunque el destino esté a varias
   * láminas: el gesto ya las recorrió con la mano, y volver a recorrerlas
   * obligaría a la cinta a retroceder hasta la de origen para empezar de nuevo.
   */
  const asentar = (idx: number) => {
    transiciones(true);
    cortarViaje();
    destino.current = idx;
    if (idx === actual.current) {
      // Vuelve al eje aunque el gesto no llegue a pasar de lámina: si se queda
      // corto, la cinta regresa sola en vez de quedarse torcida a medio camino.
      colocar();
      pintar(actual.current);
      return;
    }
    actual.current = idx;
    setActivo(idx);
  };

  /**
   * Recalcula dónde cae el eje y lleva la cinta ahí.
   *
   * Se mide en `useLayoutEffect` y no en `useEffect`: entre uno y otro hay un
   * pintado, y con el segundo la cinta se vería un fotograma en la posición
   * vieja cada vez que se cambia de lámina.
   */
  useLayoutEffect(() => {
    // El estado manda: cualquier camino que mueva `activo` sin pasar por el
    // viaje (el visor, por ejemplo) queda igual de sincronizado.
    actual.current = activo;
    cruce.current = activo;

    const recentrar = (animado: boolean) => {
      const cin = cinta.current;
      const lamina = cin?.children[activo] as HTMLElement | undefined;
      if (!cin || !lamina) return;
      const primera = cin.children[0] as HTMLElement | undefined;
      const segunda = cin.children[1] as HTMLElement | undefined;
      // El paso es de centro a centro: la lámina MÁS el hueco. Medirlo por el
      // ancho de la lámina a secas —como se hacía— deja el hueco fuera, y con
      // un paso corto la cuenta del imán se pasa de lámina.
      pasoPx.current =
        primera && segunda ? segunda.offsetLeft - primera.offsetLeft : lamina.offsetWidth;
      centro.current = -(lamina.offsetLeft + lamina.offsetWidth / 2);
      // Al redimensionar no hay gesto detrás que justifique un viaje: la cinta
      // aparece ya recolocada. El cambio de lámina sí viaja.
      if (!animado) cin.style.transitionDuration = '0ms';
      colocar();
      pintar(activo);
      if (!animado) {
        // Leer el layout fuerza el reflow: sin esto el navegador junta el
        // salto y la vuelta de la transición en el mismo fotograma y el
        // recentrado se vería animado igual.
        void cin.offsetWidth;
        cin.style.removeProperty('transition-duration');
      }
    };

    recentrar(true);

    // Un `ResizeObserver` sobre la cinta y no un `resize` de ventana: la
    // medida que importa es la de la propia cinta, y esa puede cambiar sin que
    // la ventana se mueva —una fuente que termina de cargar, `--lamina-w`
    // resolviéndose contra un `svh` que se asienta después del primer
    // pintado—. Con el listener de ventana, en esos casos la cinta se quedaba
    // medida como antes y la lámina activa aparecía fuera del eje sin que nada
    // volviera a corregirla. El observador cubre también el redimensionado,
    // porque cambiar la ventana cambia el ancho de las láminas.
    const ojo = new ResizeObserver(() => recentrar(false));
    if (cinta.current) ojo.observe(cinta.current);
    return () => ojo.disconnect();
  }, [activo]);

  // ── Arrastre y deslizamiento ───────────────────────────────────────────
  const alBajar = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    // La mano gana: si había un viaje en curso, se queda donde lo alcanzó el
    // dedo en lugar de seguir tirando de la cinta por debajo del gesto.
    cortarViaje();
    destino.current = actual.current;
    cruce.current = actual.current;
    const lamina = (e.target as HTMLElement).closest<HTMLElement>('[data-lamina]');
    gesto.current = {
      x: e.clientX,
      dx: 0,
      lamina: lamina ? Number(lamina.dataset.lamina) : -1,
    };
    // La deriva se apaga en cuanto empieza un arrastre: el encuadre corrido
    // por el paseo anterior no tiene nada que ver con el gesto que empieza.
    soltarDeriva();
    // Mientras el dedo está abajo nada interpola: ni la cinta ni el arco. Todo
    // lo que se ve sale del gesto, fotograma a fotograma.
    transiciones(false);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const alMover = (e: React.PointerEvent) => {
    if (!gesto.current) {
      // Sin gesto, el puntero solo está paseando: es cuando la foto deriva.
      if (e.pointerType === 'mouse') derivar(e);
      return;
    }
    const dx = e.clientX - gesto.current.x;
    gesto.current.dx = dx;
    // Resistencia en los extremos: la cinta se estira a un tercio en lugar de
    // seguir el dedo. Dice "hasta acá llega" sin necesidad de un mensaje.
    const tope =
      (actual.current === 0 && dx > 0) || (actual.current === total - 1 && dx < 0);
    vivir(tope ? dx / 3 : dx);
  };

  const alSoltar = () => {
    const g = gesto.current;
    gesto.current = null;
    if (!g) {
      asentar(actual.current);
      return;
    }

    // Un toque: el dedo prácticamente no se movió. La lámina del centro abre
    // el visor; cualquier otra se viene al centro.
    if (Math.abs(g.dx) < TOQUE) {
      asentar(actual.current);
      if (g.lamina < 0) return;
      if (g.lamina === actual.current) setAmpliada(g.lamina);
      else irA(g.lamina);
      return;
    }

    asentar(imanDe(g.dx));
  };

  /**
   * Dónde deja el gesto la cinta: en la lámina que quedó más cerca del eje.
   *
   * Es la cuenta que ve el ojo. Durante el arrastre esa lámina ya venía
   * creciendo bajo el dedo, así que soltar solo termina de encajarla. La
   * versión vieja sumaba una lámina POR el gesto y otra por cada paso
   * recorrido, y por eso arrastrar una lámina aterrizaba dos más allá: esa era
   * la que se saltaba.
   */
  const imanDe = (dx: number) => {
    const idx = limitar(Math.round(actual.current - dx / pasoPx.current));
    // Un tirón corto pero decidido cuenta como una lámina: sin esto, un golpe
    // rápido de menos de media lámina no pasaría ninguna.
    if (idx === actual.current && Math.abs(dx) >= UMBRAL) {
      return limitar(actual.current - Math.sign(dx));
    }
    return idx;
  };

  // Un gesto cancelado (el sistema se lleva el puntero, entra una llamada) no
  // es ni un toque ni un pase: la cinta vuelve a su sitio y no pasa nada más.
  const alCancelar = () => {
    gesto.current = null;
    asentar(actual.current);
  };

  /**
   * Rueda horizontal y trackpad, tratados como un arrastre sin dedo.
   *
   * Solo entra cuando el gesto es claramente lateral: si no, le robaría el
   * scroll vertical a la página. Lo que llega se acumula en píxeles y se pinta
   * en vivo igual que el arrastre —el trackpad manda decenas de eventos por
   * gesto, y convertir cada uno en un paso entero era justamente lo que hacía
   * que la cinta se fuera a saltos—; cuando el dedo deja de empujar, un
   * silencio corto cierra el gesto y encaja la lámina más cercana.
   */
  const alRodar = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    if (gesto.current) return;

    if (rueda.current.espera === null) {
      cortarViaje();
      destino.current = actual.current;
      cruce.current = actual.current;
      transiciones(false);
    } else {
      window.clearTimeout(rueda.current.espera);
    }

    // El contenido va al revés del scroll: empujar hacia la derecha trae las
    // láminas de la derecha.
    const bruto = -e.deltaX;
    const tope =
      (actual.current === 0 && rueda.current.px + bruto > 0) ||
      (actual.current === total - 1 && rueda.current.px + bruto < 0);
    rueda.current.px += tope ? bruto / 3 : bruto;
    vivir(rueda.current.px);
    rueda.current.espera = window.setTimeout(asentarRueda, 130);
  };

  const asentarRueda = () => {
    const px = rueda.current.px;
    rueda.current = {px: 0, espera: null};
    asentar(imanDe(px));
  };

  const alTeclear = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    ir(e.key === 'ArrowRight' ? 1 : -1);
  };

  // Si dentro del visor se pasa de foto, la galería queda donde la dejaron.
  // Sin viaje: la cinta está detrás de una pantalla completa, y recorrer las
  // láminas del camino ahí es animar lo que nadie está viendo.
  useEffect(() => {
    if (ampliada === null) return;
    cortarViaje();
    destino.current = ampliada;
    actual.current = ampliada;
    setActivo(ampliada);
  }, [ampliada]);

  const foto = GALERIA[activo];

  return (
    <section
      id="galeria"
      // `overflow-x: clip` y no `hidden`: la cinta mide varios miles de píxeles
      // y sin recorte queda como desbordamiento desplazable de la página
      // entera. `clip` recorta sin convertir la caja en contenedor de scroll,
      // que es lo que rompería los timelines de `view()` de lo que haya dentro.
      className="galeria textura-grano fondo-hora relative flex min-h-[100svh] flex-col justify-center py-8 pb-24 [overflow-x:clip] sm:py-14 md:py-16"
    >
      {/* ── Encabezado de portada ─────────────────────────────────────── */}
      <Aparece className="relative mx-auto w-full max-w-3xl px-5 text-center sm:px-8">
        <p className="mb-6 flex items-center justify-center gap-4">
          <span aria-hidden="true" className="bg-tinta/18 h-px w-9 sm:w-14" />
          <span className="mono texto-hora text-[0.72rem] tracking-[0.22em] opacity-65">
            La colección · Sol de Bambú
          </span>
          <span aria-hidden="true" className="bg-tinta/18 h-px w-9 sm:w-14" />
        </p>
        <h2 className="portada texto-hora">
          Momentos para
          <br />
          <em>quedarse</em>.
        </h2>
      </Aparece>

      {/* ── La cinta ──────────────────────────────────────────────────────
          Sale de la caja de contenido a propósito: es lo que permite que las
          láminas de los extremos lleguen recortadas hasta el borde. */}
      <div
        role="group"
        aria-roledescription="carrusel"
        aria-label="Fotografías de Sol de Bambú"
        tabIndex={0}
        onKeyDown={alTeclear}
        onWheel={alRodar}
        onPointerDown={alBajar}
        onPointerMove={alMover}
        onPointerUp={alSoltar}
        onPointerCancel={alCancelar}
        onPointerLeave={soltarDeriva}
        ref={pista}
        className="relative mt-6 h-[calc(var(--lamina-w)*4/3+2.5rem)] cursor-grab touch-pan-y select-none active:cursor-grabbing sm:mt-10 md:mt-12"
      >
        <div
          ref={cinta}
          className="absolute inset-y-0 left-1/2 flex items-center gap-[var(--hueco)]"
          // El `transform` no se declara acá: lo escribe `colocar()` en píxeles
          // (ver la nota de arriba). Lo que sí vive en el estilo es la
          // transición, que es la que hace que el paso por clic, por arrastre,
          // por rueda y por flecha se vean todos iguales.
          style={{transition: 'transform 860ms var(--ease-lamina)'}}
        >
          {GALERIA.map((f, i) => {
            const d = i - activo;
            const centro = d === 0;

            return (
              <div
                key={f.nombre}
                data-lamina={i}
                className="entra-lamina w-[var(--lamina-w)] shrink-0"
                style={{'--orden': Math.min(i, 6)} as React.CSSProperties}
              >
                <button
                  type="button"
                  tabIndex={centro ? 0 : -1}
                  aria-label={
                    centro ? `Ampliar: ${f.alt}` : `Ver la fotografía ${i + 1}: ${f.etiqueta}`
                  }
                  aria-current={centro || undefined}
                  onClick={(e) => {
                    // Solo el teclado. Un clic de puntero ya se resolvió en el
                    // `pointerup` de la cinta —donde sí se sabe si el dedo se
                    // movió—, y atenderlo también acá haría el trabajo dos
                    // veces: la lámina se centraría y el visor se abriría de
                    // corrido. `detail === 0` es lo que distingue un Enter o un
                    // espacio de un clic con el ratón.
                    if (e.detail !== 0) return;
                    if (centro) setAmpliada(i);
                    else irA(i);
                  }}
                  className="block w-full origin-center"
                  // El arco —posición, escala, giro, velo y sombra— no se
                  // declara acá: lo escribe `pintar()`, porque tiene que poder
                  // caer entre dos láminas mientras la mano arrastra y eso no
                  // cabe en un render por lámina entera. Del estilo solo queda
                  // lo que nunca cambia: la forma y el recorrido.
                  style={{
                    borderRadius: '14px',
                    transition:
                      'transform 860ms var(--ease-lamina), opacity 860ms var(--ease-lamina), filter 860ms var(--ease-lamina)',
                  }}
                >
                  <span
                    className="relative block aspect-3/4 w-full overflow-hidden"
                    style={{borderRadius: '14px'}}
                  >
                    <Foto
                      nombre={f.nombre}
                      alt={f.alt}
                      // Sube con `--lamina-w`: la lámina llega ahora a 450px
                      // y la foto va escalada un 6%, o sea 477 de ancho pintado.
                      // Con el 366 de antes el navegador elegía un archivo más
                      // chico del que hace falta y la foto salía blanda.
                      sizes="(min-width: 1024px) 480px, (min-width: 640px) 31vw, 90vw"
                      // La activa y sus dos vecinas entran sin esperar: son las
                      // únicas que alguien puede estar mirando ahora mismo. El
                      // resto se descargan cuando el navegador tenga margen.
                      prioridad={Math.abs(d) <= 2}
                      className="lamina-foto pointer-events-none h-full w-full object-cover"
                    />

                    {/* El degradado vive SOLO en el borde inferior. Un velo
                        sobre la foto entera apaga la fotografía, que es
                        justamente lo que la sección viene a mostrar. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%]"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(11,17,28,0.62), rgba(11,17,28,0.2) 45%, transparent)',
                      }}
                    />

                    <span
                      aria-hidden="true"
                      className="mono text-crema absolute top-3.5 left-3.5 text-[0.62rem] tracking-[0.18em]"
                      style={{textShadow: '0 1px 3px rgba(11,17,28,0.55)'}}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <span
                      aria-hidden="true"
                      className="text-crema font-serif absolute right-12 bottom-3.5 left-3.5 block text-left text-[1rem] leading-tight"
                    >
                      {f.etiqueta}
                    </span>

                    {/* La lupa es decorativa: la lámina activa entera ya es el
                        botón que abre el visor. Un botón dentro de otro botón
                        no es HTML válido, y acá no haría nada distinto. */}
                    {centro && (
                      <span
                        aria-hidden="true"
                        data-lupa
                        className="bg-crema text-tinta absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full"
                      >
                        <Expand size={14} strokeWidth={2} />
                      </span>
                    )}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Cómo se usa ───────────────────────────────────────────────── */}
      <p
        aria-hidden="true"
        className="mono texto-hora mt-7 hidden text-center text-[0.66rem] tracking-[0.24em] opacity-65 sm:block"
      >
        Arrastra · Desliza · Usa las flechas
      </p>

      {/* ── La ficha de la lámina seleccionada ────────────────────────── */}
      <div className="relative mx-auto mt-6 grid w-full max-w-6xl grid-cols-2 items-center gap-x-6 gap-y-7 px-5 sm:px-8 lg:mt-8 lg:grid-cols-[1fr_auto_1fr]">
        <p className="flex items-baseline gap-2 lg:justify-self-start">
          <span className="portada-chica texto-hora tabular-nums">
            {String(activo + 1).padStart(2, '0')}
          </span>
          <span className="mono texto-hora text-[0.72rem] tabular-nums opacity-65">
            / {String(total).padStart(2, '0')}
          </span>
        </p>

        {/* En móvil las flechas comparten fila con el contador; en escritorio
            se van al extremo derecho de la ficha. */}
        <div className="flex items-center justify-end gap-2.5 lg:order-3 lg:justify-self-end">
          <BotonFlecha
            etiqueta="Fotografía anterior"
            desactivado={activo === 0}
            alPulsar={() => ir(-1)}
          >
            <ArrowLeft size={17} strokeWidth={1.6} />
          </BotonFlecha>
          <BotonFlecha
            etiqueta="Fotografía siguiente"
            desactivado={activo === total - 1}
            alPulsar={() => ir(1)}
          >
            <ArrowRight size={17} strokeWidth={1.6} />
          </BotonFlecha>
        </div>

        {/* `key` fuerza el remontaje para que el fundido vuelva a correr en
            cada cambio de lámina. */}
        <div
          key={foto.nombre}
          className="entra-ficha col-span-2 text-center lg:order-2 lg:col-span-1"
        >
          <p className="portada-chica texto-hora">{foto.etiqueta}</p>
          <p className="mono texto-hora mt-2.5 text-[0.66rem] tracking-[0.22em] opacity-65">
            Sol de Bambú · Mala, Perú
          </p>
          {/* `aria-live` es lo que hace que pasar una lámina se anuncie: sin
              esto el cambio no produce ningún evento audible. */}
          <p
            aria-live="polite"
            className="texto-2-hora mx-auto mt-3 max-w-md text-[0.86rem] leading-relaxed"
          >
            {foto.alt}
          </p>

          <div aria-hidden="true" className="mt-5 flex items-center justify-center gap-[3px]">
            {GALERIA.map((g, i) => (
              <span
                key={g.nombre}
                className="h-[2px] rounded-full transition-all duration-500 ease-(--ease-lamina)"
                style={{
                  width: i === activo ? 22 : 9,
                  backgroundColor:
                    i === activo
                      ? 'var(--color-sol-dia)'
                      : 'color-mix(in oklab, var(--color-tinta), transparent 82%)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {ampliada !== null && (
        <Lightbox
          fotos={GALERIA}
          indice={ampliada}
          alCambiar={setAmpliada}
          alCerrar={() => setAmpliada(null)}
        />
      )}
    </section>
  );
}

function BotonFlecha({
  etiqueta,
  desactivado,
  alPulsar,
  children,
}: {
  etiqueta: string;
  desactivado: boolean;
  alPulsar: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={alPulsar}
      disabled={desactivado}
      aria-label={etiqueta}
      className="border-tinta/15 texto-hora hover:bg-crema flex h-11 w-11 items-center justify-center rounded-full border transition-[background-color,border-color,opacity] duration-300 ease-(--ease-suave) active:scale-[0.96] disabled:pointer-events-none disabled:opacity-25 lg:h-12 lg:w-12"
    >
      {children}
    </button>
  );
}
