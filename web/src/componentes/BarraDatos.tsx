import {Contador} from '@/componentes/ui/Contador';
import {NEGOCIO} from '@/config/negocio';

const {capacidad, reseñasGoogle} = NEGOCIO;

/**
 * Banda de cifras, primera sección de la mitad de día. Responde de un vistazo
 * las cinco preguntas que alguien se hace antes de seguir bajando, en la
 * variante condensada de Archivo — la misma familia del wordmark, en su otro
 * extremo.
 */
const DATOS: {cifra: number | string; decimales?: number; sufijo?: string; pie: string}[] = [
  {cifra: '1 h 15', pie: 'en auto desde Lima'},
  {cifra: 'Km 86', pie: 'Panamericana Sur'},
  {cifra: capacidad.cabanas, pie: 'cabañas independientes'},
  {cifra: capacidad.total, pie: 'personas como máximo'},
  {cifra: reseñasGoogle.puntaje, decimales: 1, pie: 'estrellas en Google'},
];

export function BarraDatos() {
  return (
    <section
      aria-label={`Datos de ${NEGOCIO.nombre}`}
      className="bg-arena border-arena-3/60 border-b"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {DATOS.map((d, i) => (
          <div
            key={d.pie}
            className={`border-arena-3/50 flex flex-col items-center gap-1.5 px-4 py-8 text-center lg:py-10 ${
              // Los filetes verticales solo entre columnas, y como la grilla
              // cambia de 2 a 3 a 5, cada breakpoint necesita su regla.
              i % 2 === 0 ? 'border-r' : ''
            } ${i % 3 !== 2 ? 'sm:border-r' : 'sm:border-r-0'} ${
              i !== DATOS.length - 1 ? 'lg:border-r' : 'lg:border-r-0'
            } ${i < DATOS.length - 1 ? 'border-b sm:border-b-0' : ''}`}
          >
            <span className="condensada text-tinta text-2xl tracking-normal lg:text-[1.8rem]">
              {typeof d.cifra === 'number' ? (
                <Contador hasta={d.cifra} decimales={d.decimales} />
              ) : (
                d.cifra
              )}
            </span>
            <span className="text-tinta-2 max-w-[10rem] text-[0.8rem] leading-snug">{d.pie}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
