import {Car, Clock, MapPin, Navigation, Waves} from 'lucide-react';
import {Boton} from '@/componentes/ui/Boton';
import {Aparece, Encabezado, Seccion} from '@/componentes/ui/Seccion';
import {NEGOCIO} from '@/config/negocio';

const {coordenadas, googleMaps, referencia, distrito, provincia, desdeLima} = NEGOCIO.ubicacion;

// Embed de Google Maps sin API key ni costo: basta con output=embed.
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
    <Seccion id="llegar" className="bg-arena-2">
      <Encabezado
        sobretitulo="Cómo llegar"
        titulo="En el valle de Mala, saliendo de la Panamericana."
        bajada="Se llega en auto sin dejar el asfalto. Si vas por primera vez, escríbenos y te pasamos la referencia exacta."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-5">
        <Aparece className="lg:col-span-3">
          <div className="shadow-(--shadow-media) overflow-hidden rounded-3xl">
            <iframe
              src={MAPA}
              title={`Ubicación de ${NEGOCIO.nombre} en Google Maps`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[340px] w-full border-0 sm:h-[420px]"
            />
          </div>
        </Aparece>

        <Aparece demora={0.1} className="lg:col-span-2">
          <div className="bg-arena flex h-full flex-col rounded-3xl p-7">
            <ul className="flex-1 space-y-6">
              {REFERENCIAS.map(({icono: Icono, titulo, detalle}) => (
                <li key={titulo} className="flex gap-3.5">
                  <Icono size={19} className="text-terracota mt-0.5 shrink-0" strokeWidth={1.7} />
                  <span>
                    <span className="text-tinta block text-[0.98rem] font-semibold">{titulo}</span>
                    <span className="text-tinta-2 block text-[0.9rem] leading-relaxed">
                      {detalle}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <Boton href={googleMaps} variante="primario" className="mt-7 w-full">
              <Navigation size={17} />
              Abrir en Google Maps
            </Boton>
          </div>
        </Aparece>
      </div>
    </Seccion>
  );
}
