import {useEffect, useRef, type ReactNode} from 'react';

/**
 * LA TARJETA QUE SE INCLINA.
 *
 * La foto deja de estar pegada a la página: sigue al puntero con una
 * inclinación en perspectiva, y lo que hay dentro puede levantarse del plano
 * con `.tarjeta3d-alza`. Es el efecto de las tarjetas 3D de Aceternity, hecho
 * aquí a mano — aquello viene atado a `framer-motion` y a su propio
 * `components/ui/3d-card`, y esta página no tiene ninguna de las dos cosas.
 * Sin librería son treinta líneas y dos transformaciones.
 *
 * ── Sin estado de React ──────────────────────────────────────────────────
 * El giro se escribe como variable CSS directamente sobre el nodo, igual que
 * `--oscuridad` en la barra. Un `useState` por evento de puntero serían
 * decenas de renders completos por segundo para cambiar dos ángulos, y el
 * navegador ya sabe componer una transformación sin que React se entere.
 *
 * ── Dónde NO se activa ───────────────────────────────────────────────────
 * En pantallas táctiles no hay puntero que seguir: el efecto se quedaría en
 * "la tarjeta se tuerce al tocarla y se queda torcida". Y con movimiento
 * reducido tampoco, por lo obvio. En los dos casos no se registra ni un
 * escuchador — el reposo es la tarjeta plana de siempre, que es una tarjeta
 * perfectamente buena.
 */
export function Tarjeta3D({
  children,
  className = '',
  /** Inclinación máxima en cada eje, en grados, medida desde el centro. */
  grados = 8,
}: {
  children: ReactNode;
  className?: string;
  grados?: number;
}) {
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      // De la posición del puntero dentro de la caja a −0.5…0.5, que es lo
      // que hace que el centro sea el reposo y las esquinas los extremos.
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      // El eje Y gira con la X y el eje X con la Y, y este último invertido:
      // empujar el borde de arriba tiene que alejarlo, no acercarlo.
      el.style.setProperty('--giro-y', `${(x * grados * 2).toFixed(2)}deg`);
      el.style.setProperty('--giro-x', `${(-y * grados * 2).toFixed(2)}deg`);
    };

    const entrar = () => el.setAttribute('data-sigue', 'si');
    const salir = () => {
      // El atributo se quita ANTES de poner los ángulos a cero: eso devuelve la
      // transición a su duración larga, y la tarjeta vuelve al plano con calma
      // en vez de dar el mismo tirón corto con el que seguía al puntero.
      el.removeAttribute('data-sigue');
      el.style.setProperty('--giro-y', '0deg');
      el.style.setProperty('--giro-x', '0deg');
    };

    el.addEventListener('pointerenter', entrar);
    el.addEventListener('pointermove', mover);
    el.addEventListener('pointerleave', salir);
    return () => {
      el.removeEventListener('pointerenter', entrar);
      el.removeEventListener('pointermove', mover);
      el.removeEventListener('pointerleave', salir);
    };
  }, [grados]);

  return (
    <div ref={caja} className={`tarjeta3d ${className}`}>
      {children}
    </div>
  );
}
