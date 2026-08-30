import {ExternalLink} from 'lucide-react';
import {Estrellas} from '@/componentes/ui/Estrellas';
import {Aparece, Encabezado, Seccion} from '@/componentes/ui/Seccion';
import {NEGOCIO} from '@/config/negocio';
import {RESENAS} from '@/datos/resenas';

export function Resenas() {
  return (
    <Seccion id="resenas">
      <Encabezado
        sobretitulo="Lo que dicen"
        titulo="Nadie lo cuenta mejor que quien ya estuvo."
        centrado
      />

      <Aparece demora={0.06} className="mt-6 flex justify-center">
        <a
          href={NEGOCIO.reseñasGoogle.enlace}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-arena-2 hover:bg-arena-3/60 inline-flex items-center gap-3 rounded-full px-5 py-2.5 transition-colors"
        >
          <Estrellas cantidad={5} tamano={15} />
          <span className="text-tinta text-sm font-semibold">
            {NEGOCIO.reseñasGoogle.puntaje.toFixed(1)} en Google
          </span>
          <ExternalLink size={14} className="text-tinta-3" />
        </a>
      </Aparece>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {RESENAS.map((r, i) => (
          <Aparece key={r.autor} demora={(i % 2) * 0.08}>
            <figure className="bg-arena-2 flex h-full flex-col rounded-3xl p-7">
              <Estrellas cantidad={r.estrellas} tamano={15} />
              <blockquote className="text-tinta mt-4 flex-1 text-[1.02rem] leading-relaxed">
                «{r.texto}
                {/* Si Google cortó el texto con su "…Más", se marca en vez de
                    completarlo por nuestra cuenta. */}
                {r.truncada && <span className="text-tinta-3">…</span>}»
              </blockquote>
              <figcaption className="border-arena-3/70 mt-5 flex items-center gap-3 border-t pt-5">
                <span className="bg-bambu-claro font-display flex h-10 w-10 items-center justify-center rounded-full text-base font-semibold text-white">
                  {r.autor.charAt(0)}
                </span>
                <span>
                  <span className="text-tinta block text-[0.92rem] font-semibold">{r.autor}</span>
                  <span className="text-tinta-3 block text-[0.82rem]">{r.cuando} · Google</span>
                </span>
              </figcaption>
            </figure>
          </Aparece>
        ))}
      </div>
    </Seccion>
  );
}
