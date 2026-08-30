import {Aparece, Encabezado, Seccion} from '@/componentes/ui/Seccion';
import {AMENIDADES} from '@/datos/amenidades';

export function Amenidades() {
  return (
    <Seccion id="amenidades">
      <Encabezado
        sobretitulo="Lo que hay"
        titulo="Todo esto es de ustedes mientras estén."
        bajada="Nada es compartido con otro grupo. La propiedad se alquila entera o por cabaña, pero las áreas comunes no se dividen."
      />

      <div className="mt-14 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {AMENIDADES.map(({icono: Icono, titulo, detalle}, i) => (
          <Aparece key={titulo} demora={(i % 3) * 0.07}>
            <div className="flex gap-4">
              <span className="bg-terracota-tenue text-terracota flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
                <Icono size={20} strokeWidth={1.7} />
              </span>
              <div>
                <h3 className="text-tinta font-sans text-[1.02rem] font-semibold">{titulo}</h3>
                <p className="text-tinta-2 mt-1 text-[0.92rem] leading-relaxed">{detalle}</p>
              </div>
            </div>
          </Aparece>
        ))}
      </div>
    </Seccion>
  );
}
