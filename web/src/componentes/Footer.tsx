import {Facebook, Instagram} from 'lucide-react';
import {Boton} from '@/componentes/ui/Boton';
import {NEGOCIO} from '@/config/negocio';
import {enlaceWhatsApp, MENSAJES} from '@/lib/whatsapp';

const {ubicacion, redes, horarios} = NEGOCIO;

export function Footer() {
  const conRedes = [
    redes.instagram && {href: redes.instagram, icono: Instagram, nombre: 'Instagram'},
    redes.facebook && {href: redes.facebook, icono: Facebook, nombre: 'Facebook'},
  ].filter(Boolean) as {href: string; icono: typeof Instagram; nombre: string}[];

  return (
    // El padding inferior extra en celular deja pasar la barra fija de reservar,
    // que mide unos 76px y taparía la última línea del pie.
    <footer
      role="contentinfo"
      className="text-bruma-2 relative pb-28 lg:pb-0"
    >
      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="titular-chico text-crema">Sol de Bambú</p>
            <p className="mt-3 max-w-xs text-[0.95rem] leading-relaxed">
              Tres cabañas con piscina, parrilla y fogata en el valle de {ubicacion.distrito},{' '}
              {ubicacion.provincia}. A 1 h 15 de Lima.
            </p>
            <Boton
              href={enlaceWhatsApp(MENSAJES.general)}
              variante="sol"
              className="mt-6"
            >
              Reservar por WhatsApp
            </Boton>
          </div>

          <div>
            <p className="mono text-bruma-3 mb-4 text-[0.72rem]">Dónde</p>
            <p className="text-crema text-[0.92rem] leading-relaxed">
              {ubicacion.referencia}
              <br />
              <span className="text-bruma-2">
                {ubicacion.distrito}, {ubicacion.provincia}
              </span>
            </p>
            <a
              href={ubicacion.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-crema mt-3 inline-block text-[0.86rem] underline underline-offset-4 transition-colors duration-300"
            >
              Ver en Google Maps
            </a>
          </div>

          <div>
            <p className="mono text-bruma-3 mb-4 text-[0.72rem]">Contacto</p>
            <a
              href={`tel:+${NEGOCIO.whatsapp}`}
              className="text-crema hover:text-sol block text-[0.98rem] font-semibold transition-colors duration-300"
            >
              {NEGOCIO.telefonoVisible}
            </a>
            <p className="mt-3 text-[0.88rem] leading-relaxed">
              Ingreso {horarios.ingreso}
              <br />
              Salida {horarios.salida}
            </p>

            {conRedes.length > 0 && (
              <div className="mt-4 flex gap-3">
                {conRedes.map(({href, icono: Icono, nombre}) => (
                  <a
                    key={nombre}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={nombre}
                    className="hover:text-crema flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 transition-colors duration-300"
                  >
                    <Icono size={18} strokeWidth={1.7} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-bruma-3 mt-16 flex flex-col gap-2 border-t border-white/15 pt-6 text-[0.8rem] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {NEGOCIO.nombre}. Todos los derechos reservados.
          </p>
          <p className="mono text-[0.72rem]">
            {ubicacion.distrito}, Perú · Km 86
          </p>
        </div>
      </div>
    </footer>
  );
}
