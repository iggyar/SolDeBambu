import {Cake, Heart, PartyPopper, Users} from 'lucide-react';
import {Boton} from '@/componentes/ui/Boton';
import {Foto} from '@/componentes/ui/Foto';
import {IconoWhatsApp} from '@/componentes/ui/IconoWhatsApp';
import {Aparece} from '@/componentes/ui/Seccion';
import {NEGOCIO} from '@/config/negocio';
import {enlaceWhatsApp, MENSAJES} from '@/lib/whatsapp';

const OCASIONES = [
  {icono: Cake, texto: 'Cumpleaños'},
  {icono: Users, texto: 'Reuniones familiares'},
  {icono: PartyPopper, texto: 'Despedidas'},
  {icono: Heart, texto: 'Aniversarios'},
];

export function Eventos() {
  return (
    <section id="eventos" className="bg-bambu-hondo">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-2 lg:gap-16">
        <Aparece>
          <p className="text-cesped mb-3 text-xs font-semibold tracking-[0.18em] uppercase">
            Celebraciones
          </p>
          <h2 className="text-arena text-3xl leading-[1.12] sm:text-4xl md:text-[2.9rem]">
            Tomen las tres cabañas y la propiedad es de ustedes.
          </h2>
          <p className="text-arena/75 mt-6 text-[1.05rem] leading-relaxed">
            Con las tres cabañas entran hasta {NEGOCIO.capacidad.total} personas y no hay otro
            grupo en el terreno. El comedor techado da para una mesa larga, el horno aguanta una
            pachamanca, y la fogata resuelve la noche sin que nadie tenga que organizar nada.
          </p>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {OCASIONES.map(({icono: Icono, texto}) => (
              <li key={texto} className="text-arena/85 flex items-center gap-2.5 text-[0.95rem]">
                <Icono size={17} className="text-cesped shrink-0" strokeWidth={1.7} />
                {texto}
              </li>
            ))}
          </ul>

          <div className="mt-9">
            <Boton href={enlaceWhatsApp(MENSAJES.evento)} variante="whatsapp" tamano="lg">
              <IconoWhatsApp size={19} />
              Cotizar mi evento
            </Boton>
          </div>

          {/* La única regla del jardín, dicha acá y no escondida en el FAQ:
              vale más avisarlo antes que discutirlo el día del cumpleaños. */}
          <p className="text-arena/45 mt-6 text-[0.85rem] leading-relaxed">
            Una sola regla: en el jardín no se permite jugar con globos ni pica pica. Todo lo
            demás corre por cuenta de ustedes.
          </p>
        </Aparece>

        <Aparece demora={0.12}>
          <div className="shadow-(--shadow-alta) overflow-hidden rounded-3xl">
            <Foto
              nombre="piscina-quincho"
              alt="La piscina y el comedor techado con parrilla, listos para recibir a un grupo grande"
              sizes="(min-width: 1024px) 45vw, 92vw"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </Aparece>
      </div>
    </section>
  );
}
