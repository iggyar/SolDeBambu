import {ChevronLeft, ChevronRight, X} from 'lucide-react';
import {useEffect, useRef} from 'react';
import {Foto} from '@/componentes/ui/Foto';
import type {FotoGaleria} from '@/datos/galeria';

type Props = {
  fotos: FotoGaleria[];
  indice: number;
  alCambiar: (i: number) => void;
  alCerrar: () => void;
};

export function Lightbox({fotos, indice, alCambiar, alCerrar}: Props) {
  const contenedor = useRef<HTMLDivElement>(null);
  const inicioTacto = useRef<number | null>(null);
  const estado = useRef({fotos, indice, alCambiar, alCerrar});
  estado.current = {fotos, indice, alCambiar, alCerrar};
  const foto = fotos[indice];

  const anterior = () => {
    const actual = estado.current;
    actual.alCambiar((actual.indice - 1 + actual.fotos.length) % actual.fotos.length);
  };
  const siguiente = () => {
    const actual = estado.current;
    actual.alCambiar((actual.indice + 1) % actual.fotos.length);
  };

  useEffect(() => {
    const focoPrevio = document.activeElement as HTMLElement | null;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') estado.current.alCerrar();
      if (e.key === 'ArrowLeft') anterior();
      if (e.key === 'ArrowRight') siguiente();
      if (e.key !== 'Tab') return;

      const enfocables = Array.from(
        contenedor.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      if (enfocables.length === 0) return;
      const primero = enfocables[0];
      const ultimo = enfocables[enfocables.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    window.addEventListener('keydown', alTeclear);

    // El fondo no se mueve mientras el visor está abierto.
    const scrollPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    contenedor.current?.querySelector<HTMLElement>('button')?.focus();

    return () => {
      window.removeEventListener('keydown', alTeclear);
      document.body.style.overflow = scrollPrevio;
      focoPrevio?.focus();
    };
  }, []);

  return (
    <div
      ref={contenedor}
      role="dialog"
      aria-modal="true"
      aria-label={foto.alt}
      aria-describedby="lightbox-pie"
      tabIndex={-1}
      onClick={alCerrar}
      onTouchStart={(e) => {
        inicioTacto.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (inicioTacto.current === null) return;
        const recorrido = e.changedTouches[0].clientX - inicioTacto.current;
        // 55px es el umbral que separa un deslizamiento de un toque tembloroso.
        if (recorrido > 55) anterior();
        else if (recorrido < -55) siguiente();
        inicioTacto.current = null;
      }}
      className="surge fixed inset-0 z-70 flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={alCerrar}
        aria-label="Cerrar"
        className="pulsable absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X size={20} />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          anterior();
        }}
        aria-label="Foto anterior"
        className="pulsable absolute left-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          siguiente();
        }}
        aria-label="Foto siguiente"
        className="pulsable absolute right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
      >
        <ChevronRight size={22} />
      </button>

      <figure
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full w-full max-w-4xl flex-col items-center gap-4"
      >
        <Foto
          key={foto.nombre}
          nombre={foto.nombre}
          alt={foto.alt}
          sizes="(min-width: 1024px) 900px, 96vw"
          className="max-h-[75svh] w-auto rounded-xl object-contain"
        />
        <figcaption
          id="lightbox-pie"
          className="max-w-2xl text-center text-sm leading-relaxed text-white/65"
        >
          {foto.alt}
          <span className="mt-2 block text-white/35">
            {indice + 1} / {fotos.length}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
