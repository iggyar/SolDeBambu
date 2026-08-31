import {useEffect, useRef, useState} from 'react';
import {cuadro, SECUENCIA} from '@/datos/secuencia.generado';

/**
 * La bisagra de la página: aquí cae la noche.
 *
 * No es un video reproduciéndose. Son cuadros sueltos dibujados en un canvas
 * según dónde esté el scroll — adelante y atrás, a la velocidad del dedo. Es la
 * técnica de las páginas de producto de Apple, y se hace con cuadros y no con
 * un <video> porque buscar dentro de un video con `currentTime` va a tirones en
 * Safari de iOS, que es justo donde tiene que funcionar.
 *
 * El clip es real: la misma cámara fija sobre la propiedad, del mediodía a la
 * noche. Lo único que cambia es la luz.
 */
export function SecuenciaDiaNoche() {
  const seccion = useRef<HTMLElement>(null);
  const lienzo = useRef<HTMLCanvasElement>(null);
  const imagenes = useRef<HTMLImageElement[]>([]);
  const ultimo = useRef(-1);
  const [listo, setListo] = useState(false);
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    const canvas = lienzo.current;
    const el = seccion.current;
    if (!canvas || !el) return;

    // El juego se decide una sola vez, antes de precargar: si no, el celular
    // se descarga los 36 cuadros grandes además de los suyos.
    const juego: 'esc' | 'mov' = window.matchMedia('(min-width: 768px)').matches ? 'esc' : 'mov';
    const total = SECUENCIA[juego].cuadros;
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = canvas.getContext('2d', {alpha: false});
    if (!ctx) return;

    const dibujar = (i: number) => {
      const img = imagenes.current[i];
      if (!img?.complete || img.naturalWidth === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Equivalente a object-fit: cover, hecho a mano porque el canvas no lo trae.
      const escala = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * escala;
      const dh = img.naturalHeight * escala;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      ultimo.current = i;
    };

    // Precarga. El primero se dibuja apenas llega para que la sección nunca se
    // vea vacía; el resto entran mientras la persona lee lo de arriba.
    let cargados = 0;
    for (let i = 0; i < total; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.src = cuadro(juego, i);
      img.onload = () => {
        cargados++;
        if (i === 0 || cargados === total) {
          setListo(true);
          calcular();
        }
      };
      imagenes.current[i] = img;
    }

    function calcular() {
      const rect = el!.getBoundingClientRect();
      const recorrido = el!.offsetHeight - window.innerHeight;
      if (recorrido <= 0) return;
      const avance = Math.min(1, Math.max(0, -rect.top / recorrido));
      const i = quieto ? total - 1 : Math.min(total - 1, Math.round(avance * (total - 1)));
      setProgreso(avance);
      if (i !== ultimo.current) dibujar(i);
    }

    // Sin requestAnimationFrame a propósito: el latch que evita encolar dos
    // cuadros solo se libera dentro del callback, y rAF no corre con la pestaña
    // oculta. Dibujar una imagen ya decodificada es barato.
    calcular();
    if (!quieto) window.addEventListener('scroll', calcular, {passive: true});
    window.addEventListener('resize', calcular);
    return () => {
      window.removeEventListener('scroll', calcular);
      window.removeEventListener('resize', calcular);
    };
  }, []);

  return (
    <section
      ref={seccion}
      id="atardecer"
      className="relative h-[260svh] motion-reduce:h-[100svh]"
      aria-label="El atardecer en Sol de Bambú, del mediodía a la noche"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* absolute y no en flujo: si el canvas ocupa su lugar normal, el
            bloque del texto se apila DEBAJO en vez de encima y la cita queda
            fuera de la pantalla. Todo lo que va sobre la imagen tiene que
            superponerse, no seguirla. */}
        <canvas
          ref={lienzo}
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
            listo ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Grano: mata el banding del cielo degradado, que en un WebP
            comprimido y a pantalla completa se nota mucho. */}
        <div className="textura-grano pointer-events-none absolute inset-0" />

        {/* Los bordes que cosen la sección con lo que viene antes y después:
            arriba se funde con el día, abajo con la noche. */}
        <div className="from-arena pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b to-transparent" />
        <div className="from-noche pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t to-transparent" />

        <div // pb-32 en móvil: la barra fija de reservar mide unos 76px.
          className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-32 sm:px-8 lg:pb-24">
          <figure className="max-w-2xl">
            <blockquote className="text-bruma text-[1.5rem] leading-[1.2] sm:text-[2.2rem] md:text-[2.7rem]">
              «Una ubicación precisa para maravillarte del atardecer.»
            </blockquote>
            <figcaption className="text-bruma-2 mt-5 text-[0.9rem]">
              Jeri Rodríguez, en una reseña de Google
            </figcaption>
          </figure>

          {/* Barra de avance: le dice a la persona que el scroll está moviendo
              la imagen, no que la página se trabó. */}
          <div
            className="mt-10 h-px w-full max-w-xs bg-white/20"
            role="presentation"
            aria-hidden="true"
          >
            <div
              className="bg-sol h-px transition-none"
              style={{width: `${Math.round(progreso * 100)}%`}}
            />
          </div>
          <p className="condensada text-bruma-2 mt-3 text-[0.66rem]">
            Del mediodía a la noche · sigue bajando
          </p>
        </div>
      </div>
    </section>
  );
}
