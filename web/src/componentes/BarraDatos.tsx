import {NEGOCIO} from '@/config/negocio';

const {capacidad, ubicacion, reseñasGoogle} = NEGOCIO;

/**
 * Banda de cifras, al estilo de la de MODO. Responde de un vistazo las cuatro
 * preguntas que alguien se hace antes de seguir bajando, en la variante
 * condensada de Archivo — la misma familia del wordmark, en su otro extremo.
 */
const DATOS = [
  {cifra: '1 h 15', pie: 'desde Lima'},
  {cifra: 'Km 86', pie: 'Panamericana Sur'},
  {cifra: String(capacidad.cabanas), pie: 'cabañas independientes'},
  {cifra: String(capacidad.total), pie: 'personas como máximo'},
  {cifra: reseñasGoogle.puntaje.toFixed(1), pie: 'en Google'},
];

export function BarraDatos() {
  return (
    <section aria-label={`Datos de ${NEGOCIO.nombre}`} className="border-filete border-y">
      <div className="mx-auto grid max-w-6xl grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {DATOS.map((d, i) => (
          <div
            key={d.pie}
            className={`border-filete flex flex-col items-center gap-1 px-4 py-7 text-center lg:py-9 ${
              // Los filetes verticales solo entre columnas, y como la grilla
              // cambia de 2 a 3 a 5 columnas, cada breakpoint necesita su
              // propia regla. Sin esto quedan filetes colgando en los bordes.
              i % 2 === 0 ? 'border-r sm:border-r' : ''
            } ${i % 3 !== 2 ? 'sm:border-r' : 'sm:border-r-0'} ${
              i !== DATOS.length - 1 ? 'lg:border-r' : 'lg:border-r-0'
            } ${i < DATOS.length - 1 ? 'border-b sm:border-b-0' : ''}`}
          >
            <span className="condensada text-bruma text-2xl tracking-normal lg:text-[1.75rem]">
              {d.cifra}
            </span>
            <span className="text-bruma-3 text-[0.78rem] leading-snug">{d.pie}</span>
          </div>
        ))}
      </div>
      <span className="sr-only">
        {ubicacion.distrito}, {ubicacion.provincia}
      </span>
    </section>
  );
}
