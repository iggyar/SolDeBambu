import type {ReactNode} from 'react';

type Props = {
  id?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Ancho de contenido y ritmo vertical, iguales en toda la página.
 *
 * Aquí hubo una opción `cielo` que montaba un campo de estrellas detrás del
 * contenido. Se fue entera, y el motivo está medido: eran tres capas del alto
 * de la sección por cada una de las cinco de noche —quince capas de
 * composición, veinticuatro megapíxeles, unos 91 MB de textura en GPU con
 * dpr 1 y el cuádruple en una pantalla retina—, y esa era la razón de que
 * bajar por la mitad de noche fuera a tirones. Un fondo decorativo no puede
 * costar eso.
 */
export function Seccion({id, children, className = ''}: Props) {
  return (
    <section id={id} className={`recorta relative px-5 py-24 sm:px-8 md:py-32 ${className}`}>
      <div className="relative mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

/**
 * EL MICROCOPY que abre cada sección. Mono, versalitas, cuatro palabras como
 * máximo. Es la única mayúscula de la página y lo que marca dónde empieza cada
 * capítulo del día.
 */
export function Etiqueta({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`mono text-[0.72rem] ${className}`}>{children}</p>;
}

type EncabezadoProps = {
  etiqueta?: string;
  titulo: ReactNode;
  bajada?: ReactNode;
  className?: string;
  /** Colores de la mitad clara. Por defecto usa los de la noche. */
  dia?: boolean;
  /**
   * Centra el bloque entero.
   *
   * No alcanza con `text-center` desde fuera, y ese es justo el error que
   * dejaba el encabezado de "Cómo llegar" torcido: `.bajada` lleva su propio
   * `max-width: 34rem`, así que dentro de una caja de 42rem la línea de texto
   * se apoyaba en el borde izquierdo y quedaba centrada 64px a la izquierda del
   * titular. Se veía como un error de alineación porque lo era. Centrado tiene
   * que centrar también la caja de la bajada, no solo su texto.
   *
   * De paso ensancha el bloque: un titular centrado a la misma medida que uno
   * alineado a la izquierda parte en más líneas de las que necesita.
   */
  centrado?: boolean;
  /** El escalón grande del titular, el mismo que usa La Noche. */
  grande?: boolean;
};

export function Encabezado({
  etiqueta,
  titulo,
  bajada,
  className = '',
  dia,
  centrado,
  grande,
}: EncabezadoProps) {
  return (
    <Aparece className={`${centrado ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'} ${className}`}>
      {etiqueta && (
        <Etiqueta className={`mb-5 ${dia ? 'text-tierra' : 'text-sol'}`}>{etiqueta}</Etiqueta>
      )}
      <h2 className={`titular ${grande ? 'titular-grande' : ''} ${dia ? 'text-tinta' : 'text-bruma'}`}>
        {titulo}
      </h2>
      {bajada && (
        <p className={`bajada mt-6 ${centrado ? 'mx-auto' : ''} ${dia ? 'text-tinta-2' : 'text-bruma-2'}`}>
          {bajada}
        </p>
      )}
    </Aparece>
  );
}

/**
 * Entrada al hacer scroll, resuelta enteramente en CSS (ver `.aparece`).
 *
 * No usa motion a propósito. Las dos versiones anteriores ataban la opacidad a
 * una animación de JavaScript, y en las dos el contenido se quedó invisible
 * cuando la animación no llegó a correr. El estado de reposo de esto es
 * "se ve"; la animación es un extra que ocurre solo si el navegador puede.
 */
export function Aparece({
  children,
  className = '',
  demora = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Retrasa la entrada de este bloque respecto de los de al lado. 0.1 ≈ 90ms. */
  demora?: number;
}) {
  return (
    <div
      className={`aparece ${className}`}
      // La demora es tiempo, no recorrido: el disparo lo da el observador
      // cuando el bloque asoma, y a partir de ahí manda el reloj.
      style={demora ? ({'--demora': `${Math.round(demora * 900)}ms`} as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
