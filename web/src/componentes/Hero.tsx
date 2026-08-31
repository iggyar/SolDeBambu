import {motion, useReducedMotion, useScroll, useTransform} from 'motion/react';
import {ArrowUpRight, Star} from 'lucide-react';
import {useRef} from 'react';
import {Foto} from '@/componentes/ui/Foto';
import {IconoWhatsApp} from '@/componentes/ui/IconoWhatsApp';
import {NEGOCIO} from '@/config/negocio';
import {enlaceWhatsApp, formatearSoles, MENSAJES} from '@/lib/whatsapp';

const {hero, ubicacion, capacidad, reseñasGoogle, precioDesde} = NEGOCIO;

/** Las etiquetas flotantes de Nestora, con lo que aquí sí existe. */
const ETIQUETAS = [
  {texto: 'Piscina privada', x: '18%', y: '63%'},
  {texto: `Hasta ${capacidad.total} personas`, x: '52%', y: '56%'},
  {texto: 'Parrilla y fogata', x: '74%', y: '69%'},
];

const MASCARA = `url(/fotos/${hero.foto}-mascara.png)`;

export function Hero() {
  const seccion = useRef<HTMLElement>(null);
  const sinMovimiento = useReducedMotion();

  const {scrollYProgress} = useScroll({
    target: seccion,
    offset: ['start start', 'end start'],
  });

  // El wordmark se hunde detrás del paisaje mientras el sol sube. Es el único
  // momento coreografiado de la página. Se anima con transform y no con el eje
  // de ancho de la fuente: variar `wdth` en cada frame obliga al navegador a
  // rehacer el layout del texto, y transform va en la GPU.
  const yWordmark = useTransform(scrollYProgress, [0, 1], ['0%', '55%']);
  const ySol = useTransform(scrollYProgress, [0, 1], ['0%', '-130%']);
  const opacidadUI = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      ref={seccion}
      id="inicio"
      className="textura-grano relative min-h-[100svh] overflow-hidden"
    >
      {/* ── CAPA 1 · el cielo, y todo lo demás, al fondo ──────────────── */}
      <div className="absolute inset-0">
        <Foto
          nombre={hero.foto}
          alt={hero.alt}
          sizes="100vw"
          prioridad
          className="h-full w-full object-cover"
        />
      </div>

      {/* ── CAPA 1b · penumbra SOLO sobre el cielo ────────────────────
          Va entre la foto de fondo y el wordmark, así que la capa 3 la
          vuelve a tapar en todo el paisaje: el césped y la piscina
          conservan su luz y solo el cielo se apaga. Es lo que le da al
          wordmark el contraste que en Nestora regala un cielo tormentoso
          y que un mediodía de Cañete no tiene. */}
      <div className="from-noche/58 via-noche/22 pointer-events-none absolute inset-0 bg-gradient-to-b to-transparent" />

      {/* ── CAPA 2 · el sol y el wordmark, DETRÁS del paisaje ─────────── */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          aria-hidden="true"
          style={{
            top: `${hero.horizonte * 100}%`,
            ...(sinMovimiento ? {} : {y: ySol}),
          }}
          className="absolute left-[22%] h-[46vmin] w-[46vmin] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(255,226,160,0.95) 0%, rgba(240,169,60,0.7) 38%, rgba(240,169,60,0.18) 62%, transparent 72%)',
            }}
          />
        </motion.div>

        {/* Los tamaños no son a ojo: medidos en Archivo con wdth 125 y wght 900,
            "Sol de Bambú" ocupa 9.61em y "Bambú" 4.81em. Dividiendo el ancho
            disponible entre esas cifras salen 9.8vw en una línea y 18.4vw en
            dos, que es lo que hace que el wordmark toque ambos bordes exacto
            en cualquier pantalla. Ese es el motivo de usar una fuente con eje
            de ancho en vez de una condensada fija. */}
        <motion.h1
          style={
            {
              // Se ancla por abajo, no por arriba: lo que importa es cuánto se
              // hunde por debajo del horizonte, y eso se mide desde el pie.
              // Dos valores porque el recorte cambia: en móvil se ve la franja
              // central, donde el bambú sube, y hay que anclarse a las copas.
              '--pie-movil': `${(1 - hero.horizonteAlto) * 100 - 2}%`,
              '--pie-esc': `${(1 - hero.horizonte) * 100 - 5}%`,
              ...(sinMovimiento ? {} : {y: yWordmark}),
            } as React.CSSProperties
          }
          className="wordmark text-bruma absolute inset-x-0 bottom-(--pie-movil) px-2 text-center sm:bottom-(--pie-esc)"
        >
          <span className="block text-[18.4vw] whitespace-nowrap sm:hidden">
            Sol de
            <br />
            Bambú
          </span>
          <span className="hidden text-[9.8vw] whitespace-nowrap sm:block">Sol de Bambú</span>
        </motion.h1>
      </div>

      {/* ── CAPA 3 · el paisaje, recortado por la máscara del cielo ───── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          maskImage: MASCARA,
          WebkitMaskImage: MASCARA,
          maskSize: 'cover',
          WebkitMaskSize: 'cover',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
        }}
      >
        <Foto
          nombre={hero.foto}
          alt=""
          sizes="100vw"
          prioridad
          className="h-full w-full object-cover"
        />
      </div>

      {/* ── CAPA 4 · legibilidad y contenido ──────────────────────────── */}
      <div className="from-noche via-noche/55 pointer-events-none absolute inset-x-0 bottom-0 h-[66%] bg-gradient-to-t to-transparent" />
      <div className="from-noche/65 pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b to-transparent" />

      <motion.div
        style={sinMovimiento ? {} : {opacity: opacidadUI}}
        className="pointer-events-none absolute inset-0 hidden lg:block"
      >
        {ETIQUETAS.map((e, i) => (
          <div
            key={e.texto}
            className="entra absolute flex items-center gap-2"
            style={{left: e.x, top: e.y, animationDelay: `${0.9 + i * 0.14}s`}}
          >
            <span className="bg-sol h-1.5 w-1.5 rounded-full shadow-[0_0_12px_2px_rgba(240,169,60,0.6)]" />
            <span className="text-bruma rounded-full border border-white/15 bg-black/35 px-3.5 py-1.5 text-[0.78rem] font-medium backdrop-blur-md">
              {e.texto}
            </span>
          </div>
        ))}
      </motion.div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pt-24 pb-10 sm:px-8 sm:pb-14">
        <div
          className="entra flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
          style={{animationDelay: '0.35s'}}
        >
          <div className="max-w-md">
            <p className="condensada text-sol mb-3 text-[0.68rem] sm:text-[0.74rem]">
              {ubicacion.distrito}, {ubicacion.provincia} · {ubicacion.referenciaCorta}
            </p>
            <p className="text-bruma text-[1.15rem] leading-snug sm:text-[1.35rem]">
              Tres cabañas, una piscina y todo el valle para ustedes.
            </p>
            <div className="text-bruma-2 mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.85rem]">
              <span className="text-bruma flex items-center gap-1.5">
                <Star size={13} strokeWidth={0} className="fill-[#F2A93B]" />
                {reseñasGoogle.puntaje.toFixed(1)} en Google
              </span>
              <span className="bg-bruma-3/40 h-3 w-px" />
              <span>Desde {formatearSoles(precioDesde)} la noche</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={enlaceWhatsApp(MENSAJES.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-bruma text-noche group inline-flex items-center gap-3 rounded-full py-3.5 pr-3.5 pl-6 text-[0.95rem] font-semibold transition-colors duration-300 hover:bg-white"
            >
              Reservar
              <span className="bg-noche text-bruma group-hover:bg-sol group-hover:text-noche flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300">
                <ArrowUpRight size={16} strokeWidth={2.2} />
              </span>
            </a>
            <a
              href="#precios"
              className="text-bruma hidden rounded-full border border-white/20 px-6 py-3.5 text-[0.95rem] font-medium backdrop-blur-sm transition-colors duration-300 hover:border-white/50 sm:inline-flex"
            >
              Ver precios
            </a>
            <a
              href={enlaceWhatsApp(MENSAJES.general)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Escribir por WhatsApp"
              className="border-whatsapp/40 text-whatsapp flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full border backdrop-blur-sm sm:hidden"
            >
              <IconoWhatsApp size={22} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
