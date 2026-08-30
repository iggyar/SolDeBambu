import {useState} from 'react';
import {Expand} from 'lucide-react';
import {Foto} from '@/componentes/ui/Foto';
import {Aparece, Encabezado, Seccion} from '@/componentes/ui/Seccion';
import {CATEGORIAS, GALERIA, type CategoriaFoto} from '@/datos/galeria';
import {Lightbox} from '@/componentes/Lightbox';

export function Galeria() {
  const [filtro, setFiltro] = useState<CategoriaFoto | 'todo'>('todo');
  const [abierta, setAbierta] = useState<number | null>(null);

  const fotos = filtro === 'todo' ? GALERIA : GALERIA.filter((f) => f.categoria === filtro);

  return (
    <Seccion id="galeria" className="bg-arena-2">
      <Encabezado
        sobretitulo="Galería"
        titulo="Así se ve, sin filtros."
        bajada="Todas las fotos son de la propiedad tal como está hoy."
        centrado
      />

      <Aparece demora={0.08} className="mt-9">
        <div className="sin-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:justify-center sm:px-0">
          {CATEGORIAS.map((c) => (
            <button
              key={c.id}
              onClick={() => setFiltro(c.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                filtro === c.id
                  ? 'bg-tinta text-arena'
                  : 'bg-arena text-tinta-2 hover:text-tinta'
              }`}
            >
              {c.etiqueta}
            </button>
          ))}
        </div>
      </Aparece>

      {/* Mosaico: la primera foto de cada tanda ocupa el doble para que la
          grilla no se lea como una plancha de miniaturas todas iguales. */}
      <div className="mt-8 grid auto-rows-[190px] grid-cols-2 gap-3 sm:auto-rows-[220px] lg:grid-cols-4">
        {fotos.map((foto, i) => (
          <button
            key={foto.nombre}
            onClick={() => setAbierta(i)}
            aria-label={`Ampliar: ${foto.alt}`}
            className={`group relative overflow-hidden rounded-2xl ${
              i % 5 === 0 ? 'col-span-2 row-span-2' : ''
            }`}
          >
            <Foto
              nombre={foto.nombre}
              alt={foto.alt}
              sizes={i % 5 === 0 ? '(min-width: 1024px) 50vw, 92vw' : '(min-width: 1024px) 25vw, 46vw'}
              className="h-full w-full object-cover transition-transform duration-700 ease-(--ease-suave) group-hover:scale-[1.06]"
            />
            <span className="absolute inset-0 bg-tinta/0 transition-colors duration-300 group-hover:bg-tinta/25" />
            <span className="text-tinta absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Expand size={14} strokeWidth={2} />
            </span>
          </button>
        ))}
      </div>

      {abierta !== null && (
        <Lightbox
          fotos={fotos}
          indice={abierta}
          alCambiar={setAbierta}
          alCerrar={() => setAbierta(null)}
        />
      )}
    </Seccion>
  );
}
