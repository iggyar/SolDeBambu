import {motion} from 'motion/react';
import {ChevronDown, Clock, MapPin, Users} from 'lucide-react';
import {Boton} from '@/componentes/ui/Boton';
import {Estrellas} from '@/componentes/ui/Estrellas';
import {Foto} from '@/componentes/ui/Foto';
import {IconoWhatsApp} from '@/componentes/ui/IconoWhatsApp';
import {NEGOCIO} from '@/config/negocio';
import {enlaceWhatsApp, formatearSoles, MENSAJES} from '@/lib/whatsapp';

const CHIPS = [
  {icono: Users, texto: `Hasta ${NEGOCIO.capacidad.porCabana} personas por cabaña`},
  {
    icono: Clock,
    texto: `Ingreso ${NEGOCIO.horarios.ingreso} · Salida ${NEGOCIO.horarios.salida}`,
  },
];

export function Hero() {
  return (
    <section id="inicio" className="textura-grano relative min-h-[100svh] overflow-hidden">
      {/* La foto vive detrás de todo, con una deriva tan lenta que no se lee
          como animación: solo hace que la imagen no se sienta muerta. */}
      <div className="absolute inset-0">
        <Foto
          nombre="piscina-quincho"
          alt="La piscina de Sol de Bambú con sus toldos de madera, el comedor techado y los cerros de Mala al fondo"
          sizes="100vw"
          prioridad
          className="anima-deriva h-full w-full object-cover"
        />
      </div>

      {/* Dos degradados en vez de uno: el de arriba protege la nav, el de abajo
          sostiene el texto sin apagar el centro de la foto. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/30" />
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/90 via-black/55 to-transparent" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pt-28 pb-12 sm:px-8 sm:pb-16">
        <motion.div
          initial={{opacity: 0, y: 24}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.9, ease: [0.16, 1, 0.3, 1]}}
          className="max-w-3xl"
        >
          {/* En 375px la línea completa no entra con el tracking de escritorio,
              y partida en dos se ve como un error. Se achica en móvil. */}
          <p className="mb-5 flex items-center gap-2 text-[0.68rem] font-medium tracking-[0.1em] text-white/85 uppercase sm:text-[0.8rem] sm:tracking-[0.14em]">
            <MapPin size={14} className="shrink-0" />
            {NEGOCIO.ubicacion.distrito}, {NEGOCIO.ubicacion.provincia} ·{' '}
            {NEGOCIO.ubicacion.referenciaCorta}
          </p>

          <h1 className="text-[2.6rem] leading-[1.04] font-semibold text-white sm:text-6xl md:text-[4.25rem]">
            Tres cabañas, una piscina
            <br className="hidden sm:block" /> y todo el valle para ustedes.
          </h1>

          <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-white/85 sm:text-lg">
            Parrilla, horno de barro y fogata bajo las palmeras, a{' '}
            {NEGOCIO.ubicacion.desdeLima} de Lima. Vengan {NEGOCIO.capacidad.total} y no van a
            cruzarse con nadie más.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Boton
              href={enlaceWhatsApp(MENSAJES.general)}
              variante="whatsapp"
              tamano="lg"
              className="w-full sm:w-auto"
            >
              <IconoWhatsApp size={19} />
              Reservar por WhatsApp
            </Boton>
            <Boton href="#precios" variante="contorno" tamano="lg" className="w-full sm:w-auto">
              Ver precios desde {formatearSoles(NEGOCIO.precioDesde)}
            </Boton>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={NEGOCIO.reseñasGoogle.enlace}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-sm text-white/85 transition-colors hover:text-white"
            >
              <Estrellas cantidad={5} tamano={15} />
              <span className="font-medium">
                {NEGOCIO.reseñasGoogle.puntaje.toFixed(1)} en Google
              </span>
            </a>
            {CHIPS.map(({icono: Icono, texto}) => (
              <span key={texto} className="flex items-center gap-2 text-sm text-white/70">
                <Icono size={15} className="shrink-0" />
                {texto}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <a
        href="#propiedad"
        aria-label="Ver más"
        className="anima-flecha absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-white/50 transition-colors hover:text-white lg:block"
      >
        <ChevronDown size={26} />
      </a>
    </section>
  );
}
