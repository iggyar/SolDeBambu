import {Flame, Utensils} from 'lucide-react';
import {Foto} from '@/componentes/ui/Foto';
import {Aparece} from '@/componentes/ui/Seccion';

const PLAN_NOCHE = [
  {
    icono: Flame,
    titulo: 'La fogata',
    detalle: 'Se prende cuando refresca y ahí se queda todo el mundo, sin que nadie lo proponga.',
  },
  {
    icono: Utensils,
    titulo: 'El comedor de bambú',
    detalle: 'Techado y rústico, con la parrilla al lado. Es donde termina cayendo la noche.',
  },
];

/**
 * Esta sección no salió de una sesión de fotos: salió de una reseña.
 * Jeri Rodríguez escribió que el lugar tiene "una ubicación precisa para
 * maravillarte del atardecer", y esa frase vende mejor que cualquier copy.
 *
 * ⚠️ PENDIENTE: acá va una foto propia del atardecer (cielo naranja, cabañas
 * en silueta). Mientras no llegue, se usa la foto nocturna, que es lo más
 * cercano que hay. Las fotos de atardecer que aparecen en las reseñas de
 * Google son de los huéspedes, no de la propiedad, y no se pueden publicar.
 */
export function Atardecer() {
  return (
    <section className="textura-grano relative overflow-hidden">
      <div className="absolute inset-0">
        <Foto
          nombre="cabana-noche"
          alt="La cabaña iluminada de noche, con la sombrilla abierta bajo el cielo estrellado"
          sizes="100vw"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f08]/80 via-[#2a1408]/65 to-[#1a0f08]/90" />

      <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <Aparece className="mx-auto max-w-3xl text-center">
          <p className="mb-6 text-xs font-semibold tracking-[0.18em] text-[#E9A96A] uppercase">
            Cuando baja el sol
          </p>
          <blockquote className="font-display text-[1.75rem] leading-[1.28] font-medium text-white sm:text-[2.35rem]">
            «Una ubicación precisa para maravillarte del atardecer.»
          </blockquote>
          <p className="mt-6 text-sm text-white/55">
            Jeri Rodríguez, en una reseña de Google
          </p>
        </Aparece>

        <div className="mx-auto mt-16 grid max-w-3xl gap-4 sm:grid-cols-2">
          {PLAN_NOCHE.map(({icono: Icono, titulo, detalle}, i) => (
            <Aparece key={titulo} demora={i * 0.1}>
              <div className="h-full rounded-2xl border border-white/12 bg-white/[0.07] p-6 backdrop-blur-md">
                <Icono size={22} className="mb-3 text-[#E9A96A]" strokeWidth={1.6} />
                <h3 className="text-lg font-semibold text-white">{titulo}</h3>
                <p className="mt-1.5 text-[0.92rem] leading-relaxed text-white/70">{detalle}</p>
              </div>
            </Aparece>
          ))}
        </div>
      </div>
    </section>
  );
}
