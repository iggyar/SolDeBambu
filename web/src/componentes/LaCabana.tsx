import {Bath, BedDouble, Sofa, Users} from 'lucide-react';
import {Foto} from '@/componentes/ui/Foto';
import {Aparece} from '@/componentes/ui/Seccion';
import {AMENIDADES} from '@/datos/amenidades';
import {NEGOCIO} from '@/config/negocio';

const DISTRIBUCION = [
  {icono: BedDouble, texto: '2 dormitorios matrimoniales'},
  {icono: BedDouble, texto: '3 camas en el altillo'},
  {icono: Sofa, texto: 'Sala con sillones'},
  {icono: Bath, texto: 'Baño'},
];

/** El collage en rombos de Karelia, con las cuatro fotos que lo aguantan. */
const ROMBOS = [
  {nombre: 'sala-escalera', alt: 'La sala con sillones y la escalera de bambú que sube al altillo'},
  {nombre: 'altillo', alt: 'El altillo bajo el techo a dos aguas, con tres camas'},
  {nombre: 'dormitorio-uno', alt: 'Dormitorio matrimonial con ventana al jardín'},
  {nombre: 'jardin-palmeras', alt: 'El jardín de césped con palmeras junto a las cabañas'},
];

export function LaCabana() {
  return (
    <section id="cabanas" className="bg-arena px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <Aparece>
          <p className="condensada text-tierra mb-4 text-[0.72rem]">Por dentro</p>
          <h2 className="text-tinta text-[2rem] leading-[1.12] sm:text-[2.6rem] md:text-[3rem]">
            Las tres son iguales. En cada una entran siete.
          </h2>
          <p className="text-tinta-2 mt-6 text-[1.02rem] leading-relaxed">
            Estructura de madera con techo a dos aguas y ventanales al jardín. Abajo, la sala y dos
            dormitorios matrimoniales; arriba, un altillo con tres camas más y una ventana que da
            justo a los cerros. Se toma una, dos o las tres.
          </p>

          <ul className="mt-8 grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
            {DISTRIBUCION.map(({icono: Icono, texto}) => (
              <li key={texto} className="text-tinta flex items-center gap-3 text-[0.95rem]">
                <Icono size={17} className="text-tierra shrink-0" strokeWidth={1.7} />
                {texto}
              </li>
            ))}
          </ul>

          <p className="border-arena-3/60 text-tinta-2 mt-8 inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-[0.9rem]">
            <Users size={16} className="text-tierra" strokeWidth={1.9} />
            Hasta{' '}
            <strong className="text-tinta font-semibold">
              {NEGOCIO.capacidad.porCabana} personas
            </strong>{' '}
            por cabaña
          </p>
        </Aparece>

        {/* En pantallas grandes las cuatro fotos giran 45° y forman un rombo,
            como en Karelia. En móvil se quedan derechas: un rombo en 375px
            desperdicia la mitad del ancho y recorta lo que importa de cada foto. */}
        <Aparece demora={0.12}>
          <div className="mx-auto grid max-w-md grid-cols-2 gap-3 lg:max-w-none lg:rotate-45 lg:gap-4 lg:p-10">
            {ROMBOS.map((r, i) => (
              <div
                key={r.nombre}
                className={`shadow-(--shadow-alta) overflow-hidden rounded-2xl lg:rounded-3xl ${
                  i === 1 || i === 2 ? 'lg:opacity-95' : ''
                }`}
              >
                <Foto
                  nombre={r.nombre}
                  alt={r.alt}
                  sizes="(min-width: 1024px) 22vw, 45vw"
                  className="aspect-square w-full object-cover lg:-rotate-45 lg:scale-[1.42]"
                />
              </div>
            ))}
          </div>
        </Aparece>
      </div>

      {/* Amenidades: lo que hay, sin inventar nada */}
      <div className="mx-auto mt-24 max-w-6xl md:mt-32">
        <Aparece>
          <p className="condensada text-tierra mb-4 text-[0.72rem]">Lo que hay</p>
          <h2 className="text-tinta max-w-lg text-[1.8rem] leading-[1.15] sm:text-[2.3rem]">
            Todo esto es de ustedes mientras estén.
          </h2>
        </Aparece>

        <div className="border-arena-3/60 bg-arena-3 mt-12 grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-3">
          {AMENIDADES.map(({icono: Icono, titulo, detalle}, i) => (
            <Aparece key={titulo} demora={(i % 3) * 0.06}>
              <div className="bg-arena-2 hover:bg-arena-3/50 h-full p-6 transition-colors duration-300 lg:p-7">
                <Icono size={20} className="text-tierra mb-4" strokeWidth={1.6} />
                <h3 className="text-tinta font-sans text-[1rem] font-semibold">{titulo}</h3>
                <p className="text-tinta-2 mt-1.5 text-[0.9rem] leading-relaxed">{detalle}</p>
              </div>
            </Aparece>
          ))}
        </div>
      </div>
    </section>
  );
}
