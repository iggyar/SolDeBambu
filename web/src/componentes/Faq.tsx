import {Plus} from 'lucide-react';
import {Aparece, Encabezado, Seccion} from '@/componentes/ui/Seccion';
import {FAQ} from '@/datos/faq';

/**
 * Acordeón minimalista: una sola columna centrada, tipografía grande y nada de
 * tarjetas. Diez tarjetas apiladas con su borde y su fondo convierten una lista
 * de preguntas en un muro; con cañas de por medio se lee como el índice de un
 * manual, que es lo que es.
 *
 * Antes esto era una rejilla de dos columnas con el titular pegajoso a la
 * izquierda acompañando el scroll de las preguntas. Ahora el titular va arriba
 * y solo: una lista de preguntas no necesita que nada la acompañe, y a una sola
 * columna centrada las preguntas ganan el ancho que antes se llevaba la
 * columna del titular.
 *
 * `<details>`/`<summary>` nativos: se abren con teclado, los lee cualquier
 * lector de pantalla y funcionan aunque el JS falle. El despliegue se anima por
 * CSS con `::details-content` e `interpolate-size` (ver index.css); donde eso
 * no está soportado se abre de golpe, que es un degradado aceptable.
 */
export function Faq() {
  return (
    <Seccion id="faq">
      <Encabezado centrado grande titulo="Lo que todos preguntan." />

      {/* Filete de un píxel y no una caña de bambú, que es lo que hubo aquí un
          rato: el bambú ya sostiene el bambusal del día, la medianera de "Cómo
          llegar" y el marco de las tarjetas del cierre. Repetido también diez
          veces seguidas en una lista deja de ser un motivo y pasa a ser el
          relleno de la página.

          Blanco al 10% y no negro: sobre el azul de la noche una línea negra
          no se ve. Lo que hace de "línea" sobre un fondo oscuro es una luz
          tenue, no una sombra. */}
      <div className="mx-auto mt-16 max-w-3xl border-t border-white/10">
        {FAQ.map((p, i) => (
          <Aparece key={p.pregunta} demora={Math.min(i, 4) * 0.04}>
            <details className="group border-b border-white/10">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                <h3 className="titular-chico text-crema group-hover:text-sol transition-colors duration-300">
                  {p.pregunta}
                </h3>
                <span className="text-sol border-filete mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-transform duration-500 ease-(--ease-editorial) group-open:rotate-45">
                  <Plus size={15} strokeWidth={2.1} />
                </span>
              </summary>
              <div className="faq-cuerpo">
                <p className="text-bruma-2 max-w-[38rem] pr-8 pb-7 leading-relaxed">
                  {p.respuesta}
                </p>
              </div>
            </details>
          </Aparece>
        ))}
      </div>
    </Seccion>
  );
}
