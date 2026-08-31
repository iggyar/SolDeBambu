import {ArrowUpRight, Car, Clock, MapPin, Waves} from 'lucide-react';
import {Aparece, Encabezado, Seccion} from '@/componentes/ui/Seccion';
import {NEGOCIO} from '@/config/negocio';

const {coordenadas, googleMaps, referencia, distrito, provincia, desdeLima} = NEGOCIO.ubicacion;

// Embed de Google Maps sin API key ni costo: basta con output=embed. El
// paréntesis después de las coordenadas es lo que etiqueta el marcador.
const MAPA =
  `https://www.google.com/maps?q=${coordenadas.lat},${coordenadas.lng}` +
  `(${encodeURIComponent(NEGOCIO.nombre)})&hl=es&z=15&output=embed`;

const REFERENCIAS = [
  {icono: Car, titulo: `${desdeLima} desde Lima`, detalle: 'Todo por la Panamericana Sur.'},
  {icono: MapPin, titulo: referencia, detalle: `${distrito}, ${provincia}.`},
  {
    icono: Waves,
    titulo: 'A 15 minutos de la playa',
    detalle: 'Totoritas y Bujama quedan a un salto por la misma carretera.',
  },
  {
    icono: Clock,
    titulo: `Ingreso ${NEGOCIO.horarios.ingreso}, salida ${NEGOCIO.horarios.salida}`,
    detalle: 'Siete horas más de día que en un hotel.',
  },
];

export function ComoLlegar() {
  return (
    <Seccion id="llegar" className="bg-noche">
      <Encabezado
        sobretitulo="Cómo llegar"
        titulo="En el valle de Mala, saliendo de la Panamericana."
        bajada="Se llega en auto sin dejar el asfalto. Si vas por primera vez, escríbenos y te pasamos la referencia exacta."
      />

      <div className="mt-14 grid gap-3 lg:grid-cols-5">
        <Aparece className="lg:col-span-3">
          <div className="border-filete overflow-hidden rounded-2xl border">
            {/* El mapa de Google viene en claro y en una página oscura es un
                foco de luz. `invert` + `hue-rotate` lo pasan a oscuro sin
                cargar un estilo propio ni una API key. */}
            <iframe
              src={MAPA}
              title={`Ubicación de ${NEGOCIO.nombre} en Google Maps`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[340px] w-full border-0 opacity-90 sm:h-[440px]"
              style={{filter: 'invert(0.92) hue-rotate(180deg) saturate(0.75) contrast(0.9)'}}
            />
          </div>
        </Aparece>

        <Aparece demora={0.1} className="lg:col-span-2">
          <div className="bg-bosque border-filete flex h-full flex-col rounded-2xl border p-7">
            <ul className="flex-1 space-y-6">
              {REFERENCIAS.map(({icono: Icono, titulo, detalle}) => (
                <li key={titulo} className="flex gap-3.5">
                  <Icono size={18} className="text-sol mt-0.5 shrink-0" strokeWidth={1.7} />
                  <span>
                    <span className="text-bruma block text-[0.96rem] font-semibold">{titulo}</span>
                    <span className="text-bruma-2 block text-[0.88rem] leading-relaxed">
                      {detalle}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <a
              href={googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-bosque-alto text-bruma hover:bg-sol hover:text-noche group mt-8 inline-flex items-center justify-between gap-2 rounded-full py-3 pr-3 pl-6 text-[0.9rem] font-semibold transition-colors duration-300"
            >
              Abrir en Google Maps
              <span className="bg-noche/40 flex h-8 w-8 items-center justify-center rounded-full transition-colors group-hover:bg-noche/20">
                <ArrowUpRight size={15} strokeWidth={2.2} />
              </span>
            </a>
          </div>
        </Aparece>
      </div>
    </Seccion>
  );
}
