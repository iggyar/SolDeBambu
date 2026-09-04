import {useEffect} from 'react';

/**
 * LA HORA QUE CAMBIA.
 *
 * El motor de la transición ambiental. Escribe dos fracciones en la raíz del
 * documento, `--mezcla` y `--mezcla-t`, y las secciones que participan del
 * cambio de hora mezclan su fondo y su texto contra ellas en oklab (ver
 * `.fondo-hora` / `.texto-hora` en index.css). Por eso el paso del día a la
 * noche no es un corte entre dos secciones de color distinto: el celeste de la
 * galería se apaga mientras todavía lo estás mirando.
 *
 * El recorrido es exactamente la sección del atardecer: empieza cuando asoma
 * por abajo y termina cuando su pie toca el borde inferior de la pantalla, que
 * es el último cuadro de la secuencia. Antes esto vivía en una franja aparte
 * —el crepúsculo, con su titular— que iba entre la secuencia y la fogata; sin
 * ella el recorrido se acorta, y por eso los cuatro números de abajo están
 * corridos: son los mismos instantes del scroll medidos contra un recorrido
 * más corto, no un ajuste a ojo.
 *
 * ── Por qué son DOS fracciones y no una ──────────────────────────────────
 * Si el fondo y el texto cruzaran juntos, habría un instante en que la tinta y
 * el cielo tendrían la misma luminancia: contraste 1:1, texto ilegible.
 * `--mezcla` (el fondo) arranca primero; `--mezcla-t` (el texto) espera a que
 * la secuencia ocupe la pantalla entera y no quede nada claro a la vista.
 * Cuando la tinta se vuelve crema, no hay tinta que mirar.
 */
export function useHora() {
  useEffect(() => {
    const raiz = document.documentElement;
    let ultima = -1;

    const calcular = () => {
      const seccion = document.getElementById('atardecer');
      if (!seccion) return;

      const rect = seccion.getBoundingClientRect();
      const recorrido = rect.height;
      if (recorrido <= 0) return;

      // Todo en coordenadas de viewport: no hace falta leer scrollY ni el alto
      // del documento, y por lo tanto no hay nada que recalcular al redimensionar
      // más allá de volver a medir.
      const p = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / recorrido));

      // El tramo del fondo: arranca apenas la secuencia asoma y termina en el
      // 88% del recorrido, o sea con el pie de la sección todavía a un tercio
      // de pantalla del borde — para entonces la noche ya tiene que estar
      // puesta o se vería la costura contra la fogata.
      //
      // Los dos números están medidos, no elegidos. La galería termina de salir
      // de pantalla temprano, y hasta ahí la mezcla no puede pasar de ~0.25 o
      // el texto de tinta sobre el celeste que se apaga baja de 4.5:1.
      const u = Math.min(1, Math.max(0, (p - 0.071) / 0.805));
      const mezcla = u * u * (3 - 2 * u);
      // El texto voltea con la galería ya fuera de pantalla y la secuencia
      // ocupándola entera.
      const t = Math.min(1, Math.max(0, (p - 0.403) / 0.189));
      const mezclaTexto = t * t * (3 - 2 * t);

      // Sin este corte, cada evento de scroll invalidaría el estilo del
      // documento entero por una diferencia que nadie puede ver.
      if (Math.abs(mezcla - ultima) < 0.004) return;
      ultima = mezcla;
      raiz.style.setProperty('--mezcla', mezcla.toFixed(3));
      raiz.style.setProperty('--mezcla-t', mezclaTexto.toFixed(3));
    };

    calcular();
    window.addEventListener('scroll', calcular, {passive: true});
    window.addEventListener('resize', calcular);
    return () => {
      window.removeEventListener('scroll', calcular);
      window.removeEventListener('resize', calcular);
      raiz.style.removeProperty('--mezcla');
      raiz.style.removeProperty('--mezcla-t');
    };
  }, []);
}
