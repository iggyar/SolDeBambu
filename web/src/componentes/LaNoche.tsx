import {ArrowUpRight, Cake, Flame, Heart, PartyPopper, Users} from 'lucide-react';
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

/**
 * Primera sección de la mitad de noche. La foto es la cabaña encendida, que es
 * lo que se ve cuando termina la secuencia del atardecer: la página y la
 * propiedad quedan a la misma hora.
 */
export function LaNoche() {
  return (
    <section id="eventos" className="bg-noche relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Aparece>
            <p className="condensada text-sol mb-4 flex items-center gap-2.5 text-[0.72rem]">
              <Flame size={14} strokeWidth={2} />
              Cuando cae la noche
            </p>
            <h2 className="text-bruma text-[2rem] leading-[1.12] sm:text-[2.6rem] md:text-[3rem]">
              Se prende la fogata y ahí se queda todo el mundo.
            </h2>
            <p className="text-bruma-2 mt-6 text-[1.02rem] leading-relaxed">
              El comedor techado tiene la parrilla y el horno al lado, y da para una mesa larga.
              Ustedes traen el carbón y la leña; el resto ya está. A esa hora no hay otro grupo en
              el terreno — con las tres cabañas la propiedad entera es del suyo, hasta{' '}
              {NEGOCIO.capacidad.total} personas.
            </p>

            <ul className="mt-8 grid gap-x-6 gap-y-4 sm:grid-cols-2">
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
              className="bg-sol text-noche group mt-10 inline-flex items-center gap-3 rounded-full py-3.5 pr-3.5 pl-6 text-[0.95rem] font-semibold transition-colors duration-300 hover:bg-[#FFC15E]"
            >
              Cotizar mi evento
              <span className="bg-noche text-sol flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight size={16} strokeWidth={2.2} />
              </span>
            </a>

            {/* La única regla del jardín, dicha acá y no escondida en el FAQ:
                vale más avisarlo antes que discutirlo el día del cumpleaños. */}
            <p className="text-bruma-3 mt-7 max-w-sm text-[0.85rem] leading-relaxed">
              Una sola regla: en el jardín no se permite jugar con globos ni pica pica.
            </p>
          </Aparece>

          <Aparece demora={0.1}>
            <div className="shadow-(--shadow-alta) overflow-hidden rounded-3xl">
              <Foto
                nombre="cabana-noche"
                alt="La cabaña iluminada por dentro al anochecer, con el cielo estrellado detrás"
                sizes="(min-width: 1024px) 48vw, 92vw"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </Aparece>
        </div>
      </div>
    </section>
  );
}
