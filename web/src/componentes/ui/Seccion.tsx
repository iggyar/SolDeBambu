import {motion} from 'motion/react';
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
 * Entrada al hacer scroll: 12px de subida y un fundido, una sola vez.
 * `whileInView` con `once` deja el elemento en su estado final para siempre,
 * así que no hay riesgo de que algo quede invisible si el scroll no vuelve.
 */
export function Aparece({
  children,
  className = '',
  demora = 0,
}: {
  children: ReactNode;
  className?: string;
  demora?: number;
}) {
  return (
    <motion.div
      initial={{opacity: 0, y: 12}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-60px'}}
      transition={{duration: 0.6, delay: demora, ease: [0.16, 1, 0.3, 1]}}
      className={className}
    >
      {children}
    </motion.div>
  );
}
