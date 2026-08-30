import {motion} from 'motion/react';
import {Info, Users} from 'lucide-react';
import {useState} from 'react';
import {IconoWhatsApp} from '@/componentes/ui/IconoWhatsApp';
import {Aparece, Encabezado, Seccion} from '@/componentes/ui/Seccion';
import {NOTAS_TARIFARIO, TARIFAS} from '@/datos/tarifas';
import {enlaceWhatsApp, formatearSoles, MENSAJES} from '@/lib/whatsapp';

export function Tarifario() {
  const [indice, setIndice] = useState(0);
  const bloque = TARIFAS[indice];

  // El mayor ahorro no se elige a dedo: se calcula. Así la etiqueta siempre
  // dice la verdad, aunque mañana cambien los precios en tarifas.ts.
  const mayorAhorro = Math.max(...bloque.tarifas.map((t) => t.lista - t.promocion));

  return (
    <Seccion id="precios">
      <Encabezado
        sobretitulo="Tarifas"
        titulo="Los precios, completos y sin vueltas."
        bajada="Elige cuántas cabañas necesitas y cuántas noches se quedan. El botón te lleva a WhatsApp con esa opción ya escrita."
        centrado
      />

      {/* Selector de cabañas */}
      <Aparece demora={0.08} className="mt-10 flex justify-center">
        <div
          role="tablist"
          aria-label="Cantidad de cabañas"
          className="bg-arena-2 inline-flex rounded-full p-1.5"
        >
          {TARIFAS.map((b, i) => (
            <button
              key={b.cabanas}
              role="tab"
              aria-selected={i === indice}
              onClick={() => setIndice(i)}
              className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 sm:px-7 ${
                i === indice ? 'text-arena' : 'text-tinta-2 hover:text-tinta'
              }`}
            >
              {i === indice && (
                <motion.span
                  layoutId="pastilla-cabanas"
                  className="bg-terracota absolute inset-0 rounded-full"
                  transition={{type: 'spring', stiffness: 380, damping: 32}}
                />
              )}
              <span className="relative">
                {b.cabanas} {b.cabanas === 1 ? 'cabaña' : 'cabañas'}
              </span>
            </button>
          ))}
        </div>
      </Aparece>

      <Aparece demora={0.12} className="mt-5 flex justify-center">
        <p className="text-tinta-2 flex items-center gap-2 text-sm">
          <Users size={16} className="text-terracota" strokeWidth={1.8} />
          Hasta <strong className="text-tinta font-semibold">{bloque.capacidad} personas</strong>
        </p>
      </Aparece>

      {/* Tarjetas de precio */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {bloque.tarifas.map((t, i) => {
          const ahorro = t.lista - t.promocion;
          const esMayorAhorro = ahorro === mayorAhorro;
          const porPersona = Math.round(t.promocion / (bloque.capacidad * t.noches));

          return (
            <motion.div
              // La clave incluye la cantidad de cabañas: al cambiar de pestaña,
              // las tarjetas se rehacen y el precio nuevo entra con un fundido
              // en vez de saltar de golpe.
              key={`${bloque.cabanas}-${t.noches}`}
              initial={{opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.35, delay: i * 0.05, ease: [0.16, 1, 0.3, 1]}}
              className={`relative flex flex-col rounded-3xl p-6 transition-shadow duration-300 ${
                esMayorAhorro
                  ? 'bg-bambu-hondo text-arena shadow-(--shadow-alta)'
                  : 'bg-arena-2 text-tinta hover:shadow-(--shadow-media)'
              }`}
            >
              {esMayorAhorro && (
                <span className="bg-cesped text-bambu-hondo absolute -top-2.5 left-6 rounded-full px-3 py-1 text-[0.7rem] font-bold tracking-wide uppercase">
                  Mayor ahorro
                </span>
              )}

              <p
                className={`font-display text-xl font-semibold ${
                  esMayorAhorro ? 'text-arena' : 'text-tinta'
                }`}
              >
                {t.noches} {t.noches === 1 ? 'noche' : 'noches'}
              </p>

              <div className="mt-5 flex items-baseline gap-2">
                <span
                  className={`font-display text-[2.1rem] leading-none font-semibold ${
                    esMayorAhorro ? 'text-arena' : 'text-terracota'
                  }`}
                >
                  {formatearSoles(t.promocion)}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span
                  className={`text-[0.9rem] line-through ${
                    esMayorAhorro ? 'text-arena/45' : 'text-tinta-3'
                  }`}
                >
                  {formatearSoles(t.lista)}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold ${
                    esMayorAhorro ? 'bg-arena/15 text-arena' : 'bg-piscina/12 text-piscina'
                  }`}
                >
                  Ahorras {formatearSoles(ahorro)}
                </span>
              </div>

              {/* Reencuadre honesto: el mismo precio, dividido entre la gente.
                  Es lo que convierte "S/ 4,200" en "S/ 53 cada uno". */}
              <p
                className={`mt-4 text-[0.82rem] ${
                  esMayorAhorro ? 'text-arena/60' : 'text-tinta-3'
                }`}
              >
                ≈ {formatearSoles(porPersona)} por persona, por noche
              </p>

              <a
                href={enlaceWhatsApp(
                  MENSAJES.tarifa(bloque.cabanas, t.noches, bloque.capacidad, t.promocion),
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${
                  esMayorAhorro
                    ? 'bg-whatsapp hover:bg-whatsapp-hover text-white'
                    : 'bg-tinta text-arena hover:bg-terracota'
                }`}
              >
                <IconoWhatsApp size={16} />
                Reservar
              </a>
            </motion.div>
          );
        })}
      </div>

      {/* Letra chica: va completa y legible, no escondida */}
      <Aparece demora={0.2}>
        <div className="border-arena-3 mt-8 rounded-2xl border border-dashed p-6">
          <p className="text-tinta mb-3 flex items-center gap-2 text-sm font-semibold">
            <Info size={16} className="text-terracota shrink-0" strokeWidth={2} />
            Antes de reservar
          </p>
          <ul className="text-tinta-2 space-y-2 text-[0.9rem] leading-relaxed">
            <li className="flex gap-2.5">
              <span className="text-terracota mt-2 h-1 w-1 shrink-0 rounded-full bg-current" />
              {bloque.restriccion}
            </li>
            {NOTAS_TARIFARIO.map((nota) => (
              <li key={nota} className="flex gap-2.5">
                <span className="text-terracota mt-2 h-1 w-1 shrink-0 rounded-full bg-current" />
                {nota}
              </li>
            ))}
          </ul>
        </div>
      </Aparece>
    </Seccion>
  );
}
