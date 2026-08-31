import {Plus} from 'lucide-react';
import {Aparece, Encabezado, Seccion} from '@/componentes/ui/Seccion';
import {FAQ} from '@/datos/faq';

/**
 * Acordeón con <details>/<summary> nativos: se abren con teclado, los lee
 * cualquier lector de pantalla y funcionan aunque el JS falle. Nada de eso
 * sale gratis con un div y un useState.
 */
export function Faq() {
  return (
    <Seccion id="faq" className="bg-noche">
      <div className="grid gap-14 lg:grid-cols-3 lg:gap-20">
        <div className="lg:col-span-1">
          <Encabezado
            sobretitulo="Dudas"
            titulo="Lo que todos preguntan."
            bajada="Y si falta algo, se responde en dos minutos por WhatsApp."
          />
        </div>

        <div className="lg:col-span-2">
          {FAQ.map((p, i) => (
            <Aparece key={p.pregunta} demora={Math.min(i, 4) * 0.05}>
              <details className="group border-filete border-b">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-bruma group-hover:text-sol font-sans text-[1.02rem] leading-snug font-semibold transition-colors">
                    {p.pregunta}
                  </h3>
                  <span className="bg-bosque text-sol mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-open:rotate-45">
                    <Plus size={15} strokeWidth={2.2} />
                  </span>
                </summary>
                <p className="text-bruma-2 pr-12 pb-6 leading-relaxed">{p.respuesta}</p>
              </details>
            </Aparece>
          ))}
        </div>
      </div>
    </Seccion>
  );
}
