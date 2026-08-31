import {Facebook, Instagram, MapPin} from 'lucide-react';
import {IconoWhatsApp} from '@/componentes/ui/IconoWhatsApp';
import {NEGOCIO} from '@/config/negocio';
import {enlaceWhatsApp, MENSAJES} from '@/lib/whatsapp';

const {ubicacion, redes, horarios} = NEGOCIO;

export function Footer() {
  const conRedes = [
    redes.instagram && {href: redes.instagram, icono: Instagram, nombre: 'Instagram'},
    redes.facebook && {href: redes.facebook, icono: Facebook, nombre: 'Facebook'},
  ].filter(Boolean) as {href: string; icono: typeof Instagram; nombre: string}[];

  return (
    <footer className="bg-noche-hondo border-filete text-bruma-2 border-t pb-28 lg:pb-0">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p
              className="text-bruma font-display text-2xl"
              style={{fontVariationSettings: "'wdth' 118, 'wght' 800"}}
            >
              Sol de Bambú
            </p>
            <p className="mt-3 max-w-xs text-[0.9rem] leading-relaxed">
              Tres cabañas con piscina, parrilla y fogata en el valle de {ubicacion.distrito},{' '}
              {ubicacion.provincia}.
            </p>
          </div>

          <div>
            <p className="condensada text-bruma-3 mb-4 text-[0.68rem]">Dónde</p>
            <p className="flex gap-2.5 text-[0.9rem] leading-relaxed">
              <MapPin size={16} className="mt-0.5 shrink-0" strokeWidth={1.7} />
              <span>
                {ubicacion.referencia}
                <br />
                {ubicacion.distrito}, {ubicacion.provincia}
              </span>
            </p>
            <a
              href={ubicacion.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-bruma mt-3 inline-block text-[0.86rem] underline underline-offset-4 transition-colors"
            >
              Ver en Google Maps
            </a>
          </div>

          <div>
            <p className="condensada text-bruma-3 mb-4 text-[0.68rem]">Reservas</p>
            <a
              href={enlaceWhatsApp(MENSAJES.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-whatsapp inline-flex items-center gap-2 text-[0.92rem] font-medium transition-opacity hover:opacity-80"
            >
              <IconoWhatsApp size={16} />
              {NEGOCIO.telefonoVisible}
            </a>
            <p className="mt-3 text-[0.86rem] leading-relaxed">
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
                    className="hover:text-bruma transition-colors"
                  >
                    <Icono size={18} strokeWidth={1.7} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-filete text-bruma-3 mt-14 flex flex-col gap-2 border-t pt-6 text-[0.8rem] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {NEGOCIO.nombre}. Todos los derechos reservados.
          </p>
          <p>Precios sujetos a variación.</p>
        </div>
      </div>
    </footer>
  );
}
