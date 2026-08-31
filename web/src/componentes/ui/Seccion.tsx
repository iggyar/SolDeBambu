import type {ReactNode} from 'react';

type Props = {
  id?: string;
  children: ReactNode;
  className?: string;
};

/** Ancho de contenido y ritmo vertical, iguales en toda la página. */
export function Seccion({id, children, className = ''}: Props) {
  return (
    <section id={id} className={`px-5 py-24 sm:px-8 md:py-32 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

type EncabezadoProps = {
  sobretitulo?: string;
  titulo: ReactNode;
  bajada?: ReactNode;
  centrado?: boolean;
};

export function Encabezado({sobretitulo, titulo, bajada, centrado = false}: EncabezadoProps) {
  return (
    <Aparece className={`max-w-2xl ${centrado ? 'mx-auto text-center' : ''}`}>
      {sobretitulo && <p className="condensada text-musgo mb-4 text-[0.72rem]">{sobretitulo}</p>}
      <h2 className="text-bruma text-[2rem] leading-[1.12] sm:text-[2.6rem] md:text-[3rem]">
        {titulo}
      </h2>
      {bajada && (
        <p className="text-bruma-2 mt-6 text-[1.02rem] leading-relaxed">{bajada}</p>
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
  /** Escalona el reveal corriendo el tramo en el que ocurre. */
  demora?: number;
}) {
  return (
    <div
      className={`aparece ${className}`}
      style={
        demora
          ? ({
              '--entrada-desde': `${4 + demora * 30}%`,
              '--entrada-hasta': `${42 + demora * 30}%`,
            } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}
