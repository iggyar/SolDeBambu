import {ArrowUpRight, Cake, Heart, PartyPopper, Users} from 'lucide-react';
import {Foto} from '@/componentes/ui/Foto';
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
    <section id="eventos" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Foto
          nombre="cabana-palmeras"
          alt=""
          sizes="100vw"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="bg-noche/88 absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-20">
          <Aparece>
            <p className="condensada text-musgo mb-4 text-[0.72rem]">Celebraciones</p>
            <h2 className="text-bruma text-[2rem] leading-[1.12] sm:text-[2.6rem] md:text-[3.1rem]">
              Tomen las tres y la propiedad es de ustedes.
            </h2>
            <p className="text-bruma-2 mt-6 max-w-lg text-[1.02rem] leading-relaxed">
              Con las tres cabañas entran hasta {NEGOCIO.capacidad.total} personas y no hay otro
              grupo en el terreno. El comedor techado da para una mesa larga, el horno aguanta una
              pachamanca, y la fogata resuelve la noche sin que nadie tenga que organizar nada.
            </p>
          </Aparece>

          <Aparece demora={0.1}>
            <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {OCASIONES.map(({icono: Icono, texto}) => (
                <li key={texto} className="text-bruma flex items-center gap-3 text-[0.95rem]">
                  <Icono size={17} className="text-sol shrink-0" strokeWidth={1.7} />
                  {texto}
                </li>
              ))}
            </ul>

            <a
              href={enlaceWhatsApp(MENSAJES.evento)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sol text-noche group mt-9 inline-flex items-center gap-3 rounded-full py-3.5 pr-3.5 pl-6 text-[0.95rem] font-semibold transition-colors duration-300 hover:bg-[#FFC15E]"
            >
              Cotizar mi evento
              <span className="bg-noche text-sol flex h-8 w-8 items-center justify-center rounded-full">
                <ArrowUpRight size={16} strokeWidth={2.2} />
              </span>
            </a>

            {/* La única regla del jardín, dicha acá y no escondida en el FAQ:
                vale más avisarlo antes que discutirlo el día del cumpleaños. */}
            <p className="text-bruma-3 mt-7 max-w-sm text-[0.85rem] leading-relaxed">
              Una sola regla: en el jardín no se permite jugar con globos ni pica pica. Todo lo
              demás corre por cuenta de ustedes.
            </p>
          </Aparece>
        </div>
      </div>
    </section>
  );
}
