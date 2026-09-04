import {useLayoutEffect} from 'react';

/** Lo que entra: un bloque entero, un contenedor cuyos hijos entran en fila,
 *  o una pieza suelta que se prende sola.
 *
 *  `.escena-fugaces` no anima nada por sí misma: es solo el disparador de la
 *  escena de las cinco estrellas, que ocurre en sus descendientes. Va aquí y no
 *  colgada de un `.aparece` porque un bloque que además se desvanece encima
 *  taparía justo el vuelo que hay que mirar. */
const SELECTOR = '.aparece, .escalona, .luz-fogata, .revela-marco, .escena-fugaces';

/**
 * LAS ENTRADAS, DE UNA SOLA PASADA.
 *
 * ── Por qué esto no es CSS ───────────────────────────────────────────────
 * Antes esto vivía en `animation-timeline: view()`, y ahí está el problema:
 * una línea de tiempo de scroll no DISPARA la animación, la recorre. El
 * progreso es la posición del scroll, así que al subir la animación se
 * reproduce al revés y todo lo que había entrado se va: el texto se desliza
 * de vuelta y se apaga. No hay forma de fijarla —`forwards` rellena el final
 * del rango, no lo congela— porque no es un disparo, es un cursor.
 *
 * Un `IntersectionObserver` sí es un disparo: avisa una vez, se marca el
 * elemento y se deja de mirar. La animación es entonces una animación normal,
 * de reloj, que corre hacia adelante una sola vez y se queda donde terminó.
 *
 * ── Por qué esconder es lo último que se hace ────────────────────────────
 * El estado de reposo de la página es "se ve". Nada está escondido en la hoja
 * de estilos: la CSS solo esconde lo que lleva `data-entra="espera"`, y ese
 * atributo lo pone este archivo. Si el JavaScript no llega a correr, si el
 * navegador no tiene `IntersectionObserver` o si la persona pidió menos
 * movimiento, el atributo nunca se escribe y la página se ve entera —que es
 * exactamente el fallo que hundió a las dos versiones anteriores de esto.
 *
 * Se marca en `useLayoutEffect` y no en `useEffect`: entre uno y otro hay un
 * pintado, y con el segundo se vería un fotograma de la página completa antes
 * de que todo se esconda para entrar.
 */
export function useEntradas() {
  useLayoutEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          (entrada.target as HTMLElement).dataset.entra = 'si';
          // Se deja de mirar en cuanto entró: lo que ya llegó no vuelve a
          // salir ni vuelve a entrar por mucho que se suba y se baje.
          observador.unobserve(entrada.target);
        }
      },
      {
        // El recorte de abajo es lo que evita que las cosas entren pegadas al
        // borde inferior, donde nadie las está mirando todavía: tienen que
        // haber subido un 12% de la pantalla para que valga como "asomó".
        rootMargin: '0px 0px -12% 0px',
        threshold: 0,
      },
    );

    const piezas = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    for (const pieza of piezas) {
      pieza.dataset.entra = 'espera';
      observador.observe(pieza);
    }

    /**
     * LA RED.
     *
     * Esconder la página es una apuesta a que algo la va a destapar, y esa
     * apuesta hay que cubrirla: una página sin animación es un problema, una
     * página en blanco es otro mucho peor.
     *
     * Lo que se comprueba no es si el observador contestó, sino si HIZO su
     * trabajo: si al segundo largo queda algo escondido que ya pasó de la
     * mitad de la pantalla, no hay excusa —el disparo no va a llegar— y se
     * quita el atributo de todo, con lo que la página aparece sin más. La
     * media pantalla deja margen de sobra sobre el 12% en que dispara el
     * observador, así que lo que esté simplemente esperando su turno no
     * cuenta como fallo.
     *
     * Y solo se juzga con la pestaña a la vista: en una pestaña de fondo el
     * observador no corre por diseño, y castigar eso sería apagar las
     * animaciones de quien abrió la página en segundo plano.
     */
    let red = 0;
    const armarRed = () => {
      if (document.visibilityState !== 'visible') return;
      window.clearTimeout(red);
      red = window.setTimeout(() => {
        const atascadas = piezas.filter(
          (pieza) =>
            pieza.dataset.entra === 'espera' &&
            pieza.getBoundingClientRect().top < window.innerHeight * 0.5,
        );
        if (atascadas.length === 0) return;
        for (const pieza of piezas) delete pieza.dataset.entra;
      }, 1200);
    };
    armarRed();
    document.addEventListener('visibilitychange', armarRed);

    return () => {
      window.clearTimeout(red);
      document.removeEventListener('visibilitychange', armarRed);
      observador.disconnect();
    };
  }, []);
}
