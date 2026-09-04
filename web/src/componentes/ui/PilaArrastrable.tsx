import {useEffect, useRef} from 'react';
import {Foto} from '@/componentes/ui/Foto';

/**
 * LA PILA QUE SE DESPEJA.
 *
 * Las seis áreas de la propiedad, apiladas como fotos sobre una mesa: se
 * agarran, se arrastran, se lanzan y se quedan donde caen. Debajo, cuando ya
 * no queda nada encima, hay una línea escrita.
 *
 * Es la tarjeta arrastrable de Aceternity, hecha a mano. Aquello viene sobre
 * `motion/react` con siete `useMotionValue`, cuatro `useSpring`,
 * `useAnimationControls` y `useVelocity`; esto es la misma idea en eventos de
 * puntero y un bucle de inercia de diez líneas, sin una dependencia nueva ni un
 * render de React por fotograma. Toda la posición se escribe directamente sobre
 * el nodo, como el resto de los gestos de esta página.
 *
 * ── Las tres propiedades, separadas ──────────────────────────────────────
 * Cada carta usa `translate` para el arrastre, `rotate` para su inclinación de
 * reposo sobre la mesa y `transform` para el vuelco en profundidad. Son
 * propiedades independientes justamente para que tres cosas que cambian en
 * momentos distintos —el dedo, el reparto inicial, el puntero— no tengan que
 * compartir una sola cadena que reescribir entera cada vez.
 *
 * ── El eje vertical se queda con la página ───────────────────────────────
 * `touch-action: pan-y`: en un teléfono el navegador se queda con el
 * desplazamiento vertical y la carta solo recibe lo horizontal. Es la mitad del
 * gesto, sí — pero la alternativa es `none`, y eso significa una zona de media
 * pantalla en mitad de la página por la que no se puede bajar. Una carta que se
 * arrastra menos es un defecto; una página que se traba no.
 */

/**
 * Sin `alt`, y no por olvido: las cartas van con `aria-hidden` porque lo que
 * dicen ya está escrito en la lista de al lado, con más detalle y en un orden
 * que se puede recorrer con el teclado. Repetir seis fotografías arrastrables
 * en el árbol de accesibilidad sería anunciar un gesto que quien está ahí no
 * puede hacer.
 */
export type CartaPila = {
  clave: string;
  titulo: string;
  foto: string;
};

/**
 * El reparto sobre la mesa, en porcentajes de la caja y grados.
 *
 * Escrito a mano y no al azar: seis posiciones aleatorias se amontonan o dejan
 * un hueco, y hay que volver a tirar los dados hasta que salga algo que se vea
 * repartido. Esto ya es ese resultado. La de más abajo en la lista queda más al
 * centro y más derecha, que es donde el ojo entra.
 */
const REPARTO = [
  {x: -26, y: -9, r: -6},
  {x: 0, y: -11, r: 4},
  {x: 26, y: -8, r: 6.5},
  {x: -22, y: 9, r: 5.5},
  {x: 2, y: 11, r: -3.5},
  {x: 24, y: 8, r: -6},
];

/** Cuánto tiene que haberse ido una carta para contar como despejada. */
const DESPEJE = 0.42;

export function PilaArrastrable({
  cartas,
  activa,
  onActivar,
  cierre,
}: {
  cartas: CartaPila[];
  /** Cuál va encima. La manda la lista de al lado. */
  activa: number;
  onActivar: (i: number) => void;
  /** La línea que queda debajo de todo. */
  cierre: string;
}) {
  const caja = useRef<HTMLDivElement>(null);
  /** Dónde está cada carta ahora mismo, en píxeles desde su sitio de reparto. */
  const sitios = useRef<{x: number; y: number}[]>(cartas.map(() => ({x: 0, y: 0})));
  const inercia = useRef<number | null>(null);

  useEffect(() => () => {
    if (inercia.current) cancelAnimationFrame(inercia.current);
  }, []);

  const naipes = () =>
    Array.from(caja.current?.querySelectorAll<HTMLElement>('[data-carta]') ?? []);

  /**
   * Cuánto se ha despejado la mesa, de 0 a 1. Lo lee el CSS para ir sacando la
   * línea del fondo a medida que las cartas se van.
   */
  const medirDespeje = () => {
    const el = caja.current;
    if (!el) return;
    const ancho = el.clientWidth || 1;
    const fuera = sitios.current.filter(
      (s) => Math.hypot(s.x, s.y) > ancho * DESPEJE,
    ).length;
    el.style.setProperty('--despejado', (fuera / cartas.length).toFixed(3));
  };

  const colocar = (naipe: HTMLElement, i: number) => {
    const s = sitios.current[i];
    naipe.style.translate = `${s.x.toFixed(1)}px ${s.y.toFixed(1)}px`;
  };

  useEffect(() => {
    // El reparto inicial se escribe una vez, después del montaje: son valores
    // que no cambian con el estado y no tienen por qué pasar por el render.
    naipes().forEach((naipe, i) => colocar(naipe, i));
    medirDespeje();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const engancharCarta = (naipe: HTMLElement, i: number) => {
    let gesto: {x: number; y: number; ox: number; oy: number; px: number; py: number; t: number} | null =
      null;
    let vx = 0;
    let vy = 0;

    /** El tope: la carta puede irse, pero no a otra provincia. */
    const limitar = (x: number, y: number) => {
      const el = caja.current;
      const w = (el?.clientWidth ?? 400) * 0.9;
      const h = (el?.clientHeight ?? 400) * 0.9;
      return {
        x: Math.max(-w, Math.min(w, x)),
        y: Math.max(-h, Math.min(h, y)),
      };
    };

    const volcar = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = naipe.getBoundingClientRect();
      const px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      // El signo de X va invertido: empujar el borde derecho tiene que
      // alejarlo, y `rotateY` positivo lo trae.
      naipe.style.transform = `rotateX(${(-py * 9).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg)`;
      naipe.style.setProperty('--brillo', Math.min(0.22, Math.abs(px) * 0.22).toFixed(3));
    };

    const aplanar = () => {
      naipe.style.transform = 'rotateX(0deg) rotateY(0deg)';
      naipe.style.setProperty('--brillo', '0');
    };

    naipe.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      if (inercia.current) cancelAnimationFrame(inercia.current);
      onActivar(i);
      const s = sitios.current[i];
      gesto = {x: e.clientX, y: e.clientY, ox: s.x, oy: s.y, px: e.clientX, py: e.clientY, t: performance.now()};
      vx = 0;
      vy = 0;
      naipe.dataset.arrastrando = 'si';
      naipe.setPointerCapture(e.pointerId);
    });

    naipe.addEventListener('pointermove', (e) => {
      if (!gesto) {
        volcar(e);
        return;
      }
      const ahora = performance.now();
      const dt = Math.max(8, ahora - gesto.t);
      // Velocidad en píxeles POR FOTOGRAMA y no por milisegundo: es la unidad
      // en la que va a trabajar la inercia de abajo, y convertirla una sola vez
      // aquí evita repetir el 16 en cada paso del bucle.
      vx = ((e.clientX - gesto.px) / dt) * 16;
      vy = ((e.clientY - gesto.py) / dt) * 16;
      gesto.px = e.clientX;
      gesto.py = e.clientY;
      gesto.t = ahora;
      sitios.current[i] = limitar(gesto.ox + (e.clientX - gesto.x), gesto.oy + (e.clientY - gesto.y));
      colocar(naipe, i);
    });

    const soltar = () => {
      if (!gesto) return;
      gesto = null;
      delete naipe.dataset.arrastrando;
      aplanar();

      // La inercia: la carta sigue con la velocidad que llevaba y se va
      // frenando. 0.9 por fotograma es una mesa con algo de roce —a 60fps la
      // velocidad cae a la décima parte en poco más de veinte cuadros—, que es
      // lo que hace que un lanzamiento fuerte recorra un buen trecho y uno
      // flojo se quede casi donde estaba.
      const paso = () => {
        vx *= 0.9;
        vy *= 0.9;
        const s = sitios.current[i];
        sitios.current[i] = limitar(s.x + vx, s.y + vy);
        colocar(naipe, i);
        if (Math.hypot(vx, vy) > 0.4) {
          inercia.current = requestAnimationFrame(paso);
        } else {
          inercia.current = null;
          medirDespeje();
        }
      };
      // Se mide al soltar Y otra vez cuando la inercia se detiene. La primera
      // vez no es redundante: si el lanzamiento se corta a medias —porque la
      // mano agarra otra carta, o porque el navegador dejó de dar fotogramas
      // con la pestaña de fondo— la segunda medición no llega nunca, y la
      // frase del fondo se quedaría tapada por una carta que ya no está ahí.
      medirDespeje();
      if (Math.hypot(vx, vy) > 0.4) inercia.current = requestAnimationFrame(paso);
    };

    naipe.addEventListener('pointerup', soltar);
    naipe.addEventListener('pointercancel', soltar);
    naipe.addEventListener('pointerleave', () => {
      if (!gesto) aplanar();
    });
  };

  const enganchada = useRef(false);
  useEffect(() => {
    if (enganchada.current) return;
    enganchada.current = true;
    naipes().forEach(engancharCarta);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={caja}
      // `perspective` en el envoltorio y no en cada carta: aquí las cartas
      // comparten mesa, y una perspectiva común es lo que hace que las de los
      // bordes se vuelquen hacia el mismo punto en vez de cada una hacia el
      // suyo. Es lo contrario de la galería, donde cada lámina necesitaba su
      // propio punto de fuga porque están en fila y no en montón.
      className="pila relative aspect-[4/5] w-full sm:aspect-[4/3] lg:aspect-[16/10]"
      style={{perspective: '3000px'}}
    >
      {/* La línea del fondo. Está siempre; lo que cambia es cuánto se ve, y eso
          lo dice `--despejado`, que se recalcula cada vez que una carta termina
          de moverse. Empieza tenue —se adivina entre los huecos de la pila— y
          termina entera cuando la mesa queda limpia. */}
      <p
        aria-hidden="true"
        className="pila-cierre titular-chico text-tierra pointer-events-none absolute inset-0 flex items-center justify-center px-8 text-center select-none"
      >
        {cierre}
      </p>

      {cartas.map((c, i) => {
        const r = REPARTO[i % REPARTO.length];
        return (
          <div
            key={c.clave}
            data-carta
            aria-hidden="true"
            className="carta-pila absolute"
            style={{
              left: `${50 + r.x}%`,
              top: `${50 + r.y}%`,
              rotate: `${r.r}deg`,
              // La activa va encima. El resto conserva su orden de reparto, así
              // que la pila no se rebaraja sola cada vez que cambia el foco.
              zIndex: i === activa ? cartas.length + 1 : i,
            }}
          >
            <span className="carta-pila-marco">
              <Foto
                nombre={c.foto}
                alt=""
                sizes="(min-width: 1024px) 30vw, 54vw"
                className="pointer-events-none block aspect-[4/5] w-full object-cover"
              />
            </span>
            <span className="mono text-tierra mt-2.5 block text-center text-[0.72rem]">
              {c.titulo}
            </span>
            {/* El destello del vidrio, atado al vuelco. */}
            <span aria-hidden="true" className="carta-pila-brillo" />
          </div>
        );
      })}
    </div>
  );
}
