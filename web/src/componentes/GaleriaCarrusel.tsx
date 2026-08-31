import {ChevronLeft, ChevronRight, Expand} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';
import {Foto} from '@/componentes/ui/Foto';
import {Lightbox} from '@/componentes/Lightbox';
import {Aparece} from '@/componentes/ui/Seccion';
import {GALERIA} from '@/datos/galeria';

/**
 * Carrusel en perspectiva, como el de Voyage: la foto activa al frente y las
 * vecinas girando hacia atrás en el eje Y.
 *
 * Las tarjetas laterales van con `aria-hidden` y sin foco: para quien navega
 * con teclado o lector de pantalla, el carrusel es una sola imagen con dos
 * botones, no nueve elementos superpuestos que no puede ver.
 */
export function GaleriaCarrusel() {
  const [activo, setActivo] = useState(0);
  const [ampliada, setAmpliada] = useState<number | null>(null);
  const tacto = useRef<number | null>(null);
  const total = GALERIA.length;

  const ir = (paso: number) => setActivo((a) => (a + paso + total) % total);

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (ampliada !== null) return;
      if (e.key === 'ArrowLeft') ir(-1);
      if (e.key === 'ArrowRight') ir(1);
    };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  });

  return (
    <section id="galeria" className="bg-arena overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Aparece className="max-w-2xl">
          <p className="condensada text-tierra mb-4 text-[0.72rem]">Galería</p>
          <h2 className="text-tinta text-[2rem] leading-[1.12] sm:text-[2.6rem] md:text-[3rem]">
            Así se ve, sin filtros.
          </h2>
        </Aparece>
      </div>

      <div
        className="relative mt-14 h-[62svh] min-h-[380px] select-none"
        style={{perspective: '1400px'}}
        onTouchStart={(e) => {
          tacto.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (tacto.current === null) return;
          const recorrido = e.changedTouches[0].clientX - tacto.current;
          if (recorrido > 55) ir(-1);
          else if (recorrido < -55) ir(1);
          tacto.current = null;
        }}
      >
        {GALERIA.map((foto, i) => {
          // Distancia con vuelta: la foto 8 está a un paso de la 0.
          let d = i - activo;
          if (d > total / 2) d -= total;
          if (d < -total / 2) d += total;
          const fuera = Math.abs(d) > 2;
          const centro = d === 0;

          return (
            <div
              key={foto.nombre}
              aria-hidden={!centro}
              // Sin las utilidades -translate-x-1/2 de Tailwind: la v4 las
              // escribe en la propiedad `translate`, que es distinta de
              // `transform` y se compone con ella. Con ambas, el centrado se
              // aplicaba dos veces y las tarjetas quedaban corridas media
              // tarjeta a la izquierda. El centrado vive en el transform.
              className="absolute top-1/2 left-1/2 h-full w-[74vw] max-w-[420px] transition-all duration-700 ease-(--ease-suave) sm:w-[42vw]"
              style={{
                transform: `translate(-50%, -50%) translateX(${d * 58}%) scale(${
                  centro ? 1 : Math.abs(d) === 1 ? 0.82 : 0.66
                }) rotateY(${d === 0 ? 0 : d > 0 ? -22 : 22}deg)`,
                opacity: fuera ? 0 : centro ? 1 : Math.abs(d) === 1 ? 0.55 : 0.25,
                zIndex: 10 - Math.abs(d),
                pointerEvents: centro ? 'auto' : 'none',
              }}
            >
              <button
                type="button"
                onClick={() => centro && setAmpliada(i)}
                tabIndex={centro ? 0 : -1}
                aria-label={centro ? `Ampliar: ${foto.alt}` : undefined}
                className="group relative block h-full w-full overflow-hidden rounded-3xl"
              >
                <Foto
                  nombre={foto.nombre}
                  alt={centro ? foto.alt : ''}
                  sizes="(min-width: 640px) 42vw, 74vw"
                  className="h-full w-full object-cover"
                />
                {!centro && <span className="bg-arena/45 absolute inset-0" />}
                {centro && (
                  <span className="text-tinta absolute right-4 bottom-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Expand size={15} strokeWidth={2} />
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center gap-6 px-5 sm:px-8">
        <p className="text-tinta-2 max-w-md text-center text-[0.92rem] leading-relaxed">
          {GALERIA[activo].alt}
        </p>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => ir(-1)}
            aria-label="Foto anterior"
            className="border-arena-3/60 text-tinta hover:border-tierra hover:text-tierra flex h-11 w-11 items-center justify-center rounded-full border transition-colors"
          >
            <ChevronLeft size={19} />
          </button>

          <div className="flex items-center gap-2" role="presentation">
            {GALERIA.map((f, i) => (
              <button
                key={f.nombre}
                type="button"
                onClick={() => setActivo(i)}
                aria-label={`Ir a la foto ${i + 1} de ${total}`}
                aria-current={i === activo}
                className="group grid h-8 w-4 place-items-center"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    i === activo
                      ? 'bg-tierra h-1.5 w-5'
                      : 'bg-tinta-3/40 group-hover:bg-tinta-2 h-1.5 w-1.5'
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => ir(1)}
            aria-label="Foto siguiente"
            className="border-arena-3/60 text-tinta hover:border-tierra hover:text-tierra flex h-11 w-11 items-center justify-center rounded-full border transition-colors"
          >
            <ChevronRight size={19} />
          </button>
        </div>
      </div>

      {ampliada !== null && (
        <Lightbox
          fotos={GALERIA}
          indice={ampliada}
          alCambiar={setAmpliada}
          alCerrar={() => setAmpliada(null)}
        />
      )}
    </section>
  );
}
