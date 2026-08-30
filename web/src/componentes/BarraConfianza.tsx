import {Car, Home, Users, Waves} from 'lucide-react';
import {NEGOCIO} from '@/config/negocio';

const DATOS = [
  {icono: Home, cifra: String(NEGOCIO.capacidad.cabanas), texto: 'cabañas independientes'},
  {icono: Users, cifra: String(NEGOCIO.capacidad.total), texto: 'personas como máximo'},
  {icono: Waves, cifra: '1', texto: 'piscina solo para ustedes'},
  {icono: Car, cifra: '1 h 15', texto: 'en auto desde Lima'},
];

/**
 * Franja de datos duros, pegada al hero. Responde en un vistazo las cuatro
 * preguntas que alguien se hace antes de seguir bajando.
 */
export function BarraConfianza() {
  return (
    <div className="bg-bambu-hondo text-arena">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-5 py-10 sm:px-8 md:grid-cols-4 md:py-12">
        {DATOS.map(({icono: Icono, cifra, texto}) => (
          <div key={texto} className="flex flex-col items-center gap-1.5 text-center">
            <Icono size={19} className="text-cesped mb-1" strokeWidth={1.6} />
            <span className="font-display text-2xl leading-none font-semibold md:text-3xl">
              {cifra}
            </span>
            <span className="text-arena/60 max-w-[10rem] text-[0.8rem] leading-snug">{texto}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
