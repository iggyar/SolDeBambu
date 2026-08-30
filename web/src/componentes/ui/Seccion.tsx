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
    <section id={id} className={`px-5 py-20 sm:px-8 md:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

type EncabezadoProps = {
  sobretitulo?: string;
  titulo: ReactNode;
  bajada?: ReactNode;
  centrado?: boolean;
  oscuro?: boolean;
};

export function Encabezado({
  sobretitulo,
  titulo,
  bajada,
  centrado = false,
  oscuro = false,
}: EncabezadoProps) {
  return (
    <Aparece className={`max-w-2xl ${centrado ? 'mx-auto text-center' : ''}`}>
      {sobretitulo && (
        <p
          className={`mb-3 text-xs font-semibold tracking-[0.18em] uppercase ${
            oscuro ? 'text-cesped' : 'text-terracota'
          }`}
        >
          {sobretitulo}
        </p>
      )}
      <h2
        className={`text-3xl leading-[1.12] sm:text-4xl md:text-[2.9rem] ${
          oscuro ? 'text-arena' : 'text-tinta'
        }`}
      >
        {titulo}
      </h2>
      {bajada && (
        <p
          className={`mt-5 text-[1.05rem] leading-relaxed ${
            oscuro ? 'text-arena/75' : 'text-tinta-2'
          }`}
        >
          {bajada}
        </p>
      )}
    </Aparece>
  );
}

/**
 * Entrada al hacer scroll: 12px de subida y un fundido. Una sola vez, y se
 * anula solo con prefers-reduced-motion (lo maneja el CSS global).
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
