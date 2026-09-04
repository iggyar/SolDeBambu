import {ArrowUpRight, Star} from 'lucide-react';
import {type CSSProperties, useEffect} from 'react';
import {IconoWhatsApp} from '@/componentes/ui/IconoWhatsApp';
import {NEGOCIO} from '@/config/negocio';
import {enlaceWhatsApp, MENSAJES} from '@/lib/whatsapp';
import {srcIntro, srcSetIntro} from '@/datos/intro.generado';

const {hero, ubicacion, reseñasGoogle} = NEGOCIO;

const ETIQUETAS = [
  {texto: 'Piscina incluida', x: '46%', y: '70%'},
  {texto: 'Toldos y camastros', x: '13%', y: '64%'},
  {texto: 'Cocina y sala de juegos', x: '74%', y: '69%'},
];

const MASCARA = `url(/fotos/${hero.foto}-mascara.png)`;

export function Hero() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('intro-hero');
    const t = window.setTimeout(() => {
      document.documentElement.classList.remove('intro-hero');
      // 1100ms, no 2100. Mientras la clase está puesta la barra de navegación
      // está oculta Y sin eventos: eran más de dos segundos sin navegación en
      // cada carga, para todo el mundo, por una intro que solo tiene gracia la
      // primera vez. A 1100ms sigue tapada durante el tramo fuerte del
      // movimiento y vuelve —con fundido, ver index.css— antes de que haga falta.
    }, 1100);
    return () => {
      window.clearTimeout(t);
      document.documentElement.classList.remove('intro-hero');
    };
  }, []);

  return (
    <section
      id="inicio"
      // Detrás de la barra hay fotografía oscura aunque la página sea de día.
      // Lo lee Nav.tsx; ver el comentario de `--oscuridad` allí.
      data-oscuro="1"
      className="textura-grano relative min-h-[100svh] overflow-hidden bg-noche"
    >
      {/* 1. Cielo + nubes + sol */}
      {/* Las tres capas van con srcset: en 375px la página se traía 351 KB de
          imágenes de 1600 para pintarlas en un elemento de 375 de ancho. */}
      {/* El paralaje va en un envoltorio y no en la imagen: la imagen ya tiene
          su propia animación de entrada, y dos animaciones peleando por el
          mismo `transform` es como se rompen las intros. */}
      <div className="hero-parallax hero-parallax--cielo absolute inset-0 z-[1]">
        <img
          src={srcIntro('cielo')}
          srcSet={srcSetIntro('cielo')}
          sizes="100vw"
          fetchPriority="high"
          alt=""
          className="hero-capa hero-capa--cielo h-full w-full object-cover object-[center_45%]"
        />
      </div>
      <div
        aria-hidden="true"
        className="hero-sol pointer-events-none absolute z-[1] left-[6%] top-[38%] h-[18vmin] w-[18vmin] -translate-x-[30%] -translate-y-1/2 mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle, rgba(255,236,180,.85) 0%, rgba(240,169,60,.4) 38%, transparent 68%)',
        }}
      />

      {/* 2. Cerro, pasto, árboles — sin piscina */}
      <div className="hero-parallax hero-parallax--natura absolute inset-0 z-[2]">
        <img
          src={srcIntro('natura')}
          srcSet={srcSetIntro('natura')}
          sizes="100vw"
          alt=""
          // Sin `filter: blur()` en el recorrido. `blur` no lo resuelve el
          // compositor: cada fotograma vuelve a desenfocar una imagen a sangre
          // completa, y esto corre en los primeros 750ms sobre la capa que
          // define el LCP — o sea, gasta cuadros exactamente en el momento en
          // que la página está intentando pintar por primera vez. El
          // desplazamiento y la opacidad solos leen igual y son gratis.
          className="hero-capa hero-capa--natura h-full w-full object-cover object-[center_45%]"
        />
      </div>

      {/* 3. Piscina, sillas, quincho */}
      <div className="hero-parallax hero-parallax--foto absolute inset-0 z-[3]">
        <img
          src={srcIntro('foto')}
          srcSet={srcSetIntro('foto')}
          sizes="100vw"
          fetchPriority="high"
          alt={hero.alt}
          className="hero-capa hero-capa--foto h-full w-full object-cover object-[center_45%]"
        />
      </div>

      {/* Texto detrás de los árboles */}
      <div className="hero-wordmark-scroll pointer-events-none absolute inset-0 z-[4] overflow-hidden select-none">
        <h1 className="hero-wordmark-entra wordmark wordmark-vidrio absolute inset-x-0 top-[24%] sm:top-[26%] [@media(max-height:520px)]:top-[17%] px-2 text-center select-none">
            <span className="block text-[14.4vw] [@media(max-height:520px)]:text-[8.1vw] whitespace-nowrap sm:hidden">
              Sol de
              <br />
              Bambú
            </span>
            <span className="hidden text-[7.8vw] lg:text-[8.8vw] [@media(max-height:520px)]:text-[4.5vw] whitespace-nowrap sm:block">
              Sol de Bambú
            </span>
        </h1>
      </div>

      <div className="hero-parallax hero-parallax--foto pointer-events-none absolute inset-0 z-[5]">
        <div
          aria-hidden="true"
          className="hero-oclusion absolute inset-0"
          style={{
            maskImage: MASCARA,
            WebkitMaskImage: MASCARA,
            maskSize: 'cover',
            WebkitMaskSize: 'cover',
            maskPosition: 'center 45%',
            WebkitMaskPosition: 'center 45%',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
          }}
        >
          <img
            src={srcIntro('foto')}
            srcSet={srcSetIntro('foto')}
            sizes="100vw"
            alt=""
            className="h-full w-full object-cover object-[center_45%]"
          />
        </div>
      </div>

      <div className="from-noche/65 pointer-events-none absolute inset-x-0 top-0 z-[6] h-32 bg-gradient-to-b to-transparent" />
      {/* Aquí había un segundo plano de azul noche, `h-[42%]`, subiendo desde
          el pie. Estaba para que el texto de abajo se leyera sobre la foto, y
          para eso servía — pero cuarenta y dos por ciento de la altura es casi
          media pantalla de foto oscurecida, y se veía como lo que era: una
          banda plantada sobre el jardín, justo en la parte más bonita de la
          toma. El contraste ahora lo pone `.sombra-legible` en el bloque de
          texto: la sombra viaja pegada a las letras, mide unos píxeles y la
          fotografía llega entera hasta el borde.

          La sombra de texto sola no alcanzaba —medido, la línea de reseñas
          quedaba en 2.6:1 sobre el pasto—, así que debajo va `.sombra-pie`:
          una elipse con el centro fuera de la pantalla, que oscurece la
          esquina del texto y nada más. Ver index.css. */}
      <div className="sombra-pie pointer-events-none absolute inset-0 z-[6]" />

      <div className="hero-ui-scroll pointer-events-none absolute inset-0 z-[7] hidden lg:block">
        {ETIQUETAS.map((e, i) => (
          <div
            key={e.texto}
            className="hero-etiqueta absolute flex items-center gap-2"
            style={{left: e.x, top: e.y, '--i': i} as CSSProperties}
          >
            <span className="bg-sol h-1.5 w-1.5 rounded-full shadow-[0_0_12px_2px_rgba(240,169,60,0.6)]" />
            <span className="text-bruma rounded-full border border-white/15 bg-black/35 px-3.5 py-1.5 text-[0.78rem] font-medium backdrop-blur-md">
              {e.texto}
            </span>
          </div>
        ))}
      </div>

      <div className="relative z-[8] mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pt-24 pb-10 sm:px-8 sm:pb-14 [@media(max-height:520px)]:pt-16 [@media(max-height:520px)]:pb-6">
        <div className="hero-contenido-entra flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="sombra-legible max-w-md">
            <p className="condensada text-sol mb-3 text-[0.68rem] sm:text-[0.74rem]">
              {ubicacion.distrito}, {ubicacion.provincia} · {ubicacion.referenciaCorta}
            </p>
            <p className="text-bruma text-[1.15rem] leading-snug sm:text-[1.35rem]">
              Tres cabañas, una piscina y todo el valle para ustedes.
            </p>
            <div className="text-bruma-2 mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.85rem]">
              <span className="text-bruma flex items-center gap-1.5">
                <Star size={13} strokeWidth={0} className="fill-[#F2A93B]" />
                {reseñasGoogle.puntaje !== null
                  ? `${reseñasGoogle.puntaje.toFixed(1)} en Google`
                  : 'Reseñas en Google'}
              </span>
              <span className="bg-bruma-3/40 h-3 w-px" />
              <span>Tres cabañas · hasta 20 personas</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={enlaceWhatsApp(MENSAJES.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="pulsable bg-bruma text-noche group inline-flex items-center gap-3 rounded-full py-3.5 pr-3.5 pl-6 text-[0.95rem] font-semibold transition-colors duration-300 hover:bg-white"
            >
              Reservar
              <span className="bg-noche text-bruma group-hover:bg-sol group-hover:text-noche flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300">
                <ArrowUpRight size={16} strokeWidth={2.2} />
              </span>
            </a>
            <a
              href="#cabanas"
              className="pulsable text-bruma hidden rounded-full border border-white/20 px-6 py-3.5 text-[0.95rem] font-medium backdrop-blur-sm transition-colors duration-300 hover:border-white/50 sm:inline-flex"
            >
              Ver la casa
            </a>
            <a
              href={enlaceWhatsApp(MENSAJES.general)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Escribir por WhatsApp"
              className="pulsable border-whatsapp/40 text-whatsapp flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full border backdrop-blur-sm sm:hidden"
            >
              <IconoWhatsApp size={22} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
