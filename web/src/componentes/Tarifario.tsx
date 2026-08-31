import {ArrowUpRight, Info, Users} from 'lucide-react';
import {useState} from 'react';
import {Aparece} from '@/componentes/ui/Seccion';
import {NOTAS_TARIFARIO, TARIFAS} from '@/datos/tarifas';
import {enlaceWhatsApp, formatearSoles, MENSAJES} from '@/lib/whatsapp';

export function Tarifario() {
  const [indice, setIndice] = useState(0);
  const bloque = TARIFAS[indice];

  // El mayor ahorro no se elige a dedo: se calcula. Así la etiqueta siempre
  // dice la verdad, aunque mañana cambien los precios en tarifas.ts.
  const mayorAhorro = Math.max(...bloque.tarifas.map((t) => t.lista - t.promocion));

  return (
    <section id="precios" className="bg-noche px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Aparece className="max-w-2xl">
          <p className="condensada text-musgo mb-4 text-[0.72rem]">Tarifas</p>
          <h2 className="text-bruma text-[2rem] leading-[1.12] sm:text-[2.6rem] md:text-[3rem]">
            Los precios, completos y sin vueltas.
          </h2>
          <p className="text-bruma-2 mt-6 text-[1.02rem] leading-relaxed">
            Elige cuántas cabañas necesitas y cuántas noches se quedan. El botón te lleva a
            WhatsApp con esa opción ya escrita.
          </p>
        </Aparece>

        <Aparece demora={0.08}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <div
              role="tablist"
              aria-label="Cantidad de cabañas"
              className="border-filete inline-flex rounded-full border p-1"
            >
              {TARIFAS.map((b, i) => (
                <button
                  key={b.cabanas}
                  role="tab"
                  aria-selected={i === indice}
                  onClick={() => setIndice(i)}
                  className={`rounded-full px-5 py-2.5 text-[0.86rem] font-semibold transition-colors duration-300 sm:px-6 ${
                    i === indice
                      ? 'bg-sol text-noche'
                      : 'text-bruma-2 hover:text-bruma'
                  }`}
                >
                  {b.cabanas} {b.cabanas === 1 ? 'cabaña' : 'cabañas'}
                </button>
              ))}
            </div>
            <p className="text-bruma-2 flex items-center gap-2 text-[0.9rem]">
              <Users size={16} className="text-sol" strokeWidth={1.8} />
              Hasta <strong className="text-bruma font-semibold">{bloque.capacidad} personas</strong>
            </p>
          </div>
        </Aparece>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {bloque.tarifas.map((t, i) => {
            const ahorro = t.lista - t.promocion;
            const destacada = ahorro === mayorAhorro;
            const porPersona = Math.round(t.promocion / (bloque.capacidad * t.noches));

            return (
              <div
                // La clave incluye la cantidad de cabañas: al cambiar de pestaña
                // las tarjetas se rehacen y el precio nuevo entra con la
                // animación de entrada en vez de saltar de golpe.
                key={`${bloque.cabanas}-${t.noches}`}
                className={`entra relative flex flex-col rounded-2xl p-6 ${
                  destacada
                    ? 'bg-sol text-noche'
                    : 'bg-bosque text-bruma border-filete hover:border-bruma-3/40 border transition-colors duration-300'
                }`}
                style={{animationDelay: `${i * 0.06}s`}}
              >
                {destacada && (
                  <span className="condensada bg-noche text-sol absolute -top-2.5 left-6 rounded-full px-3 py-1 text-[0.62rem]">
                    Mayor ahorro
                  </span>
                )}

                <p
                  className={`condensada text-[0.72rem] ${destacada ? 'text-noche/70' : 'text-bruma-3'}`}
                >
                  {t.noches} {t.noches === 1 ? 'noche' : 'noches'}
                </p>

                <p
                  className="font-display mt-4 text-[2.15rem] leading-none"
                  style={{fontVariationSettings: "'wdth' 100, 'wght' 800"}}
                >
                  {formatearSoles(t.promocion)}
                </p>

                <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <span
                    className={`text-[0.85rem] line-through ${
                      destacada ? 'text-noche/45' : 'text-bruma-3'
                    }`}
                  >
                    {formatearSoles(t.lista)}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold ${
                      destacada ? 'bg-noche/12 text-noche' : 'bg-musgo/15 text-musgo'
                    }`}
                  >
                    −{formatearSoles(ahorro)}
                  </span>
                </div>

                {/* Reencuadre honesto: el mismo precio, dividido entre la gente.
                    Es lo que convierte "S/ 4,200" en "S/ 53 cada uno". */}
                <p
                  className={`mt-4 text-[0.8rem] ${destacada ? 'text-noche/65' : 'text-bruma-3'}`}
                >
                  ≈ {formatearSoles(porPersona)} por persona, por noche
                </p>

                <a
                  href={enlaceWhatsApp(
                    MENSAJES.tarifa(bloque.cabanas, t.noches, bloque.capacidad, t.promocion),
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group mt-6 inline-flex items-center justify-between gap-2 rounded-full py-2.5 pr-2.5 pl-5 text-[0.88rem] font-semibold transition-colors duration-300 ${
                    destacada
                      ? 'bg-noche text-bruma hover:bg-noche-hondo'
                      : 'bg-bosque-alto text-bruma hover:bg-sol hover:text-noche'
                  }`}
                >
                  Reservar
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                      destacada ? 'bg-sol text-noche' : 'bg-noche/40 group-hover:bg-noche/20'
                    }`}
                  >
                    <ArrowUpRight size={14} strokeWidth={2.4} />
                  </span>
                </a>
              </div>
            );
          })}
        </div>

        <Aparece demora={0.18}>
          <div className="border-filete mt-8 rounded-2xl border p-6">
            <p className="condensada text-bruma mb-3.5 flex items-center gap-2 text-[0.7rem]">
              <Info size={15} className="text-sol shrink-0" strokeWidth={2} />
              Antes de reservar
            </p>
            <ul className="text-bruma-2 space-y-2.5 text-[0.9rem] leading-relaxed">
              {[bloque.restriccion, ...NOTAS_TARIFARIO].map((nota) => (
                <li key={nota} className="flex gap-3">
                  <span className="bg-sol mt-2 h-1 w-1 shrink-0 rounded-full" />
                  {nota}
                </li>
              ))}
            </ul>
          </div>
        </Aparece>
      </div>
    </section>
  );
}
