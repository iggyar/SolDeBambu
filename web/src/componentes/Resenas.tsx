import {ExternalLink} from 'lucide-react';
import {Estrellas} from '@/componentes/ui/Estrellas';
import {Aparece, Encabezado, Seccion} from '@/componentes/ui/Seccion';
import {NEGOCIO} from '@/config/negocio';
import {RESENAS} from '@/datos/resenas';

export function Resenas() {
  return (
    <Seccion id="resenas" className="bg-noche">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Encabezado
          sobretitulo="Lo que dicen"
          titulo="Nadie lo cuenta mejor que quien ya estuvo."
        />
        <Aparece demora={0.06}>
          <a
            href={NEGOCIO.reseñasGoogle.enlace}
            target="_blank"
            rel="noopener noreferrer"
            className="border-filete hover:border-bruma-3 inline-flex items-center gap-3 rounded-full border px-5 py-2.5 transition-colors"
          >
            <Estrellas cantidad={5} tamano={14} />
            <span className="text-bruma text-[0.86rem] font-semibold">
              {NEGOCIO.reseñasGoogle.puntaje.toFixed(1)} en Google
            </span>
            <ExternalLink size={13} className="text-bruma-3" />
          </a>
        </Aparece>
      </div>

      <div className="mt-14 grid gap-3 md:grid-cols-2">
        {RESENAS.map((r, i) => (
          <Aparece key={r.autor} demora={(i % 2) * 0.08}>
            <figure className="bg-bosque border-filete flex h-full flex-col rounded-2xl border p-7">
              <Estrellas cantidad={r.estrellas} tamano={14} />
              <blockquote className="text-bruma mt-5 flex-1 text-[1rem] leading-relaxed">
                «{r.texto}
                {/* Si Google cortó el texto con su "…Más", se marca en vez de
                    completarlo por nuestra cuenta. */}
                {r.truncada && <span className="text-bruma-3">…</span>}»
              </blockquote>
              <figcaption className="border-filete mt-6 flex items-center gap-3 border-t pt-5">
                <span className="bg-bosque-alto text-sol font-display flex h-10 w-10 items-center justify-center rounded-full text-[0.95rem] font-bold">
                  {r.autor.charAt(0)}
                </span>
                <span>
                  <span className="text-bruma block text-[0.9rem] font-semibold">{r.autor}</span>
                  <span className="text-bruma-3 block text-[0.8rem]">{r.cuando} · Google</span>
                </span>
              </figcaption>
            </figure>
          </Aparece>
        ))}
      </div>
    </Seccion>
  );
}
