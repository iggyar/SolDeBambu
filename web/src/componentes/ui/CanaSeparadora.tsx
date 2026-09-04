/**
 * LA CAÑA MEDIANERA. Separa dos columnas sin dibujar una celda.
 *
 * El dibujo vive entero en CSS (ver `.cana-separadora` en index.css) y no en un
 * SVG: la caña tiene que medir lo que mida la fila de al lado, sea cual sea, y
 * un `viewBox` estirado a una altura arbitraria engorda los nudos y les cambia
 * la separación. Con degradados el tallo es una franja y los nudos caen cada
 * 76px reales, tenga el alto que tenga.
 *
 * `self-stretch` es lo que la hace crecer hasta el alto de la fila cuando la
 * grilla está en `items-center`; sin eso se encogería a su propio contenido,
 * que es ninguno.
 *
 * Solo existe desde `lg`, que es donde hay columnas que separar. Debajo la
 * sección se apila en una sola columna y una caña horizontal no separaría nada
 * que el aire no separe mejor.
 *
 * ── Para usarla ───────────────────────────────────────────────────────────
 * La columna que la aloja tiene que ser `auto` en la plantilla de la grilla,
 * no `1px`: la caña mide 15px de ancho y en una columna de un píxel se
 * recortaría a una raya, que es exactamente lo que vino a reemplazar.
 */
export function CanaSeparadora() {
  return <div aria-hidden="true" className="cana-separadora hidden self-stretch lg:block" />;
}
