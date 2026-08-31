import {animate, useInView} from 'motion/react';
import {useEffect, useRef, useState} from 'react';

type Props = {
  /** Valor final. */
  hasta: number;
  /** Decimales a mostrar. El 5.0 de Google necesita uno; el resto, ninguno. */
  decimales?: number;
  className?: string;
};

/**
 * La cifra sube hasta su valor cuando entra en pantalla.
 *
 * El patrón viene del CountUp de React Bits, pero reimplementado sobre Motion,
 * que ya es dependencia del proyecto. La versión de React Bits arrastra GSAP, y
 * sumar 50 KB para animar cinco números no se paga.
 *
 * Arranca mostrando el valor final, no un cero: si el JavaScript no llega a
 * correr, la cifra que se ve es la correcta.
 */
export function Contador({hasta, decimales = 0, className = ''}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const enVista = useInView(ref, {once: true, margin: '-80px'});
  const [valor, setValor] = useState(hasta);
  const yaCorrio = useRef(false);

  useEffect(() => {
    if (!enVista || yaCorrio.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    yaCorrio.current = true;
    // No se pone el valor en 0 antes de animar: si la animación no llegara a
    // correr, la cifra se quedaría en cero. El primer onUpdate ya lo baja.
    const control = animate(0, hasta, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValor(v),
    });
    return () => control.stop();
  }, [enVista, hasta]);

  return (
    <span ref={ref} className={className}>
      {valor.toFixed(decimales)}
    </span>
  );
}
