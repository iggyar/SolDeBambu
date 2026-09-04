/**
 * La barra de avance de la página. Dos píxeles, en el amarillo del sol, pegada
 * al borde superior por encima de la barra de navegación.
 *
 * Sin estado y sin listener: la escala horizontal la resuelve
 * `animation-timeline: scroll(root)` en el compositor (ver `.progreso-scroll`).
 * Donde eso no existe, arranca en `scaleX(0)` y se queda ahí — una barra que no
 * aparece es mejor que una barra llena que miente.
 */
export function ProgresoScroll() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[2px] select-none"
    >
      <div className="progreso-scroll bg-sol h-full w-full" />
    </div>
  );
}
