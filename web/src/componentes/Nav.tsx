import {ArrowRight, Menu, X} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';
import {IconoWhatsApp} from '@/componentes/ui/IconoWhatsApp';
import {NEGOCIO} from '@/config/negocio';
import {enlaceWhatsApp, MENSAJES} from '@/lib/whatsapp';

const ENLACES = [
  {href: '#cabanas', texto: 'Las cabañas'},
  {href: '#areas', texto: 'Qué incluye'},
  {href: '#galeria', texto: 'Galería'},
  {href: '#eventos', texto: 'La fogata'},
  {href: '#llegar', texto: 'Cómo llegar'},
];

export function Nav() {
  const [solida, setSolida] = useState(false);
  const [abierta, setAbierta] = useState(false);
  const barra = useRef<HTMLElement>(null);
  const dialogo = useRef<HTMLDivElement>(null);
  const disparador = useRef<HTMLButtonElement>(null);

  /**
   * La oscuridad de lo que hay DETRÁS de la barra, de 0 a 1.
   *
   * Antes esto era el hero y nada más: mientras su fotografía cubría la barra
   * se forzaba un 1, y el resto del recorrido lo decidía la hora de la página.
   * Eso dejaba fuera el caso que más se notaba —las cuatro pantallas del
   * camino—, donde detrás de la barra hay una toma oscura a sangre mientras la
   * hora todavía dice "mediodía": barra celeste y tinta oscura sobre una
   * carretera de noche.
   *
   * Ahora no se supone, se mira. Cada sección que se sabe oscura lo declara
   * con `data-oscuro` en el HTML, y aquí se calcula cuánto de la franja que
   * ocupa la barra está cubierto por alguna de ellas. El hero deja de ser un
   * caso especial: es una más de la lista.
   *
   * Sobre eso manda la hora de la página, esa misma fracción que pinta los
   * fondos (la escribe lib/hora.ts en el estilo en línea de <html>, así que
   * leerla es leer una cadena y no forzar un recálculo de estilo). Se queda
   * con la mayor de las dos: una sección clara a media noche sigue teniendo
   * noche detrás.
   *
   * Se escribe como variable CSS sobre la barra y no como estado de React: es
   * un valor por evento de scroll, y un render completo por fotograma para
   * cambiar un color es trabajo que no hay que hacer. Lo único que sí es
   * estado es `solida`, que cambia una vez.
   */
  useEffect(() => {
    // La lista se arma una vez. Los efectos corren con el DOM ya montado, así
    // que aquí están todas; buscarlas de nuevo en cada evento de scroll sería
    // una consulta al documento por fotograma para leer algo que no cambia.
    const oscuros = Array.from(document.querySelectorAll<HTMLElement>('[data-oscuro]'));

    const alScroll = () => {
      setSolida(window.scrollY > 40);

      const el = barra.current;
      if (!el) return;
      const alto = el.offsetHeight;

      let detras = 0;
      for (const nodo of oscuros) {
        const {top, bottom} = nodo.getBoundingClientRect();
        // Los dos bordes se cruzan en 90px en lugar de conmutar. Un corte seco
        // en el píxel exacto en que la sección toca la barra se ve como un
        // parpadeo de color, y son 90px porque es lo que la barra tarda en
        // recorrerse a sí misma un poco más de una vez.
        //
        // El de entrada termina en `top === 0` y no en `top === alto`: la
        // sección tapa la barra ENTERA cuando su borde superior llega al de la
        // pantalla, y con el cruce puesto un alto más abajo el hero se quedaba
        // en 0.8 mientras cubría la barra del todo.
        const entrando = Math.min(1, Math.max(0, (90 - top) / 90));
        const saliendo = Math.min(1, Math.max(0, (bottom - alto) / 90));
        const peso = parseFloat(nodo.dataset.oscuro ?? '');
        detras = Math.max(
          detras,
          Math.min(entrando, saliendo) * (Number.isFinite(peso) ? peso : 1),
        );
      }

      const hora = parseFloat(document.documentElement.style.getPropertyValue('--mezcla'));
      const oscuridad = Math.max(detras, Number.isFinite(hora) ? hora : 0);
      el.style.setProperty('--oscuridad', oscuridad.toFixed(3));
    };
    alScroll();
    // Y otra vez en el fotograma siguiente: en el primer pase, `--mezcla`
    // todavía no existe —la escribe el efecto de la hora, que monta después
    // de este—, así que al recargar la página a media altura la barra se
    // pintaba de día sobre una sección de noche hasta el primer scroll.
    const segundoPase = requestAnimationFrame(alScroll);

    window.addEventListener('scroll', alScroll, {passive: true});
    window.addEventListener('resize', alScroll);
    return () => {
      cancelAnimationFrame(segundoPase);
      window.removeEventListener('scroll', alScroll);
      window.removeEventListener('resize', alScroll);
    };
  }, []);

  useEffect(() => {
    if (!abierta || !dialogo.current) return;

    const focoPrevio = document.activeElement as HTMLElement | null;
    const overflowPrevio = document.body.style.overflow;
    const raiz = document.getElementById('root');
    const fondo = Array.from(raiz?.children ?? []).filter((nodo) => nodo !== dialogo.current);
    const estados = fondo.map((nodo) => ({
      nodo: nodo as HTMLElement,
      inert: (nodo as HTMLElement).inert,
      ariaHidden: nodo.getAttribute('aria-hidden'),
    }));

    document.body.style.overflow = 'hidden';
    for (const {nodo} of estados) {
      nodo.inert = true;
      nodo.setAttribute('aria-hidden', 'true');
    }

    const enfocables = () =>
      Array.from(
        dialogo.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    enfocables()[0]?.focus();

    const alTeclear = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        evento.preventDefault();
        setAbierta(false);
        return;
      }
      if (evento.key !== 'Tab') return;

      const elementos = enfocables();
      if (elementos.length === 0) return;
      const primero = elementos[0];
      const ultimo = elementos[elementos.length - 1];
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    };
    document.addEventListener('keydown', alTeclear);

    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.body.style.overflow = overflowPrevio;
      for (const {nodo, inert, ariaHidden} of estados) {
        nodo.inert = inert;
        if (ariaHidden === null) nodo.removeAttribute('aria-hidden');
        else nodo.setAttribute('aria-hidden', ariaHidden);
      }
      (focoPrevio ?? disparador.current)?.focus();
    };
  }, [abierta]);

  return (
    <>
      <header
        ref={barra}
        // `backdrop-filter` NO va en la lista de transición: interpolarlo obliga
        // a recalcular el desenfoque de todo el ancho de la página en cada uno
        // de los 400ms, y el disparador es el scroll — o sea que el momento más
        // caro caía justo cuando la página se estaba moviendo. El color hace la
        // transición y el desenfoque aparece de golpe, que nadie nota.
        //
        // Sin borde inferior: una línea de un píxel cruzando la pantalla entera
        // parte la página en dos y le pone marco a algo que no lo necesita. El
        // vidrio derrama su color unos píxeles hacia abajo y con eso separa.
        // `opacity` está en la lista para que la barra vuelva con un fundido
        // cuando termina la intro del hero (ver `html.intro-hero` en index.css).
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,opacity] duration-[400ms] ease-(--ease-suave) ${
          solida ? 'barra-vidrio' : ''
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-[4.5rem] sm:px-8">
          {/* Sobre el hero, antes de que la barra sea vidrio, el texto va crema
              sobre la fotografía. En cuanto hay vidrio, el color lo decide la
              oscuridad de lo que quedó detrás. */}
          <a
            href="#inicio"
            className={`font-display text-[1.05rem] leading-none tracking-tight transition-opacity duration-300 hover:opacity-70 ${
              solida ? 'tinta-barra' : 'text-crema'
            }`}
            style={{fontVariationSettings: "'wdth' 118, 'wght' 800"}}
          >
            Sol de Bambú
          </a>

          <div className="hidden items-center gap-7 lg:flex">
            {ENLACES.map((e) => (
              <a
                key={e.href}
                href={e.href}
                className={`text-[0.86rem] font-medium ${
                  solida
                    ? 'enlace-barra'
                    : 'text-bruma-2 hover:text-crema transition-colors duration-300'
                }`}
              >
                {e.texto}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:+${NEGOCIO.whatsapp}`}
              className={`mono hidden text-[0.72rem] xl:block ${
                solida
                  ? 'enlace-barra'
                  : 'text-bruma-3 hover:text-crema transition-colors duration-300'
              }`}
            >
              {NEGOCIO.telefonoVisible}
            </a>

            {/* El CTA de reservar no se va nunca de la pantalla. Sobre el hero
                va claro para no competir con el botón grande que ya hay ahí;
                en cuanto la barra se vuelve sólida pasa al amarillo sol, que es
                el color de acción del resto de la página. */}
            <a
              href={enlaceWhatsApp(MENSAJES.general)}
              target="_blank"
              rel="noopener noreferrer"
              className={`boton boton-chico pulsable ${
                solida ? 'boton-sol' : 'bg-crema text-noche hover:bg-white'
              }`}
            >
              <IconoWhatsApp size={16} className="flex-none" />
              <span className="hidden sm:inline">Reservar</span>
            </a>

            <button
              ref={disparador}
              type="button"
              onClick={() => setAbierta(true)}
              aria-label="Abrir menú"
              aria-expanded={abierta}
              aria-controls="menu-movil"
              className={`pulsable -mr-2 flex h-11 w-11 items-center justify-center lg:hidden ${
                solida ? 'tinta-barra' : 'text-crema'
              }`}
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </header>

      {abierta && (
        <div
          ref={dialogo}
          id="menu-movil"
          role="dialog"
          aria-modal="true"
          aria-labelledby="menu-movil-titulo"
          className="surge-menu bg-noche fixed inset-0 z-60 flex flex-col lg:hidden"
        >
          <div className="flex h-16 items-center justify-between px-5">
            <span
              id="menu-movil-titulo"
              className="text-crema font-display text-[1.05rem]"
              style={{fontVariationSettings: "'wdth' 118, 'wght' 800"}}
            >
              Sol de Bambú
            </span>
            <button
              type="button"
              onClick={() => setAbierta(false)}
              aria-label="Cerrar menú"
              className="pulsable text-crema -mr-2 flex h-11 w-11 items-center justify-center"
            >
              <X size={22} />
            </button>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-1 px-7 pb-24">
            {ENLACES.map((e) => (
              <a
                key={e.href}
                href={e.href}
                onClick={() => setAbierta(false)}
                className="titular text-crema hover:text-sol group flex items-center justify-between border-b border-white/10 py-5 text-[1.9rem] transition-colors duration-300"
              >
                {e.texto}
                <ArrowRight
                  size={20}
                  strokeWidth={1.8}
                  className="text-sol opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
