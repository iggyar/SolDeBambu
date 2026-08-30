import {BedDouble, Bath, Sofa, Users} from 'lucide-react';
import {Foto} from '@/componentes/ui/Foto';
import {Aparece, Encabezado, Seccion} from '@/componentes/ui/Seccion';
import {NEGOCIO} from '@/config/negocio';

const PISOS = [
  {
    etiqueta: 'Planta baja',
    foto: 'sala-escalera',
    alt: 'La sala de la cabaña con sillones de madera y la escalera de bambú que sube al altillo',
    detalle:
      'Sala con sillones, dos dormitorios matrimoniales y baño. Del centro sale la escalera de bambú.',
  },
  {
    etiqueta: 'El altillo',
    foto: 'altillo',
    alt: 'El altillo bajo el techo a dos aguas, con tres camas y una ventana al valle',
    detalle:
      'Bajo el techo a dos aguas, tres camas más y una ventana que da justo a los cerros.',
  },
];

const DISTRIBUCION = [
  {icono: BedDouble, texto: '2 dormitorios matrimoniales'},
  {icono: BedDouble, texto: '3 camas en el altillo'},
  {icono: Sofa, texto: 'Sala con sillones'},
  {icono: Bath, texto: 'Baño'},
];

export function ComoEsLaCabana() {
  return (
    <Seccion id="cabanas" className="bg-arena-2">
      <Encabezado
        sobretitulo="Por dentro"
        titulo="Las tres cabañas son iguales. Y en cada una entran siete."
        bajada="Estructura de madera con techo a dos aguas, piso de cerámico y ventanales al jardín. Se toma una, dos o las tres."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {PISOS.map((piso, i) => (
          <Aparece key={piso.etiqueta} demora={i * 0.1}>
            <div className="bg-arena shadow-(--shadow-suave) h-full overflow-hidden rounded-3xl">
              <Foto
                nombre={piso.foto}
                alt={piso.alt}
                sizes="(min-width: 768px) 46vw, 92vw"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-7">
                <h3 className="text-tinta text-xl font-semibold">{piso.etiqueta}</h3>
                <p className="text-tinta-2 mt-2 leading-relaxed">{piso.detalle}</p>
              </div>
            </div>
          </Aparece>
        ))}
      </div>

      <Aparece demora={0.2}>
        <div className="border-arena-3 mt-6 flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-dashed px-7 py-6">
          <ul className="flex flex-wrap gap-x-7 gap-y-3">
            {DISTRIBUCION.map(({icono: Icono, texto}) => (
              <li key={texto} className="text-tinta-2 flex items-center gap-2.5 text-[0.95rem]">
                <Icono size={17} className="text-terracota shrink-0" strokeWidth={1.7} />
                {texto}
              </li>
            ))}
          </ul>
          <span className="bg-terracota-tenue text-terracota flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold">
            <Users size={16} strokeWidth={2} />
            {NEGOCIO.capacidad.porCabana} personas por cabaña
          </span>
        </div>
      </Aparece>
    </Seccion>
  );
}
