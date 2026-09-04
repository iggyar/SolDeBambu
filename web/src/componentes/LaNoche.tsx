import {Boton} from '@/componentes/ui/Boton';
import {CanaSeparadora} from '@/componentes/ui/CanaSeparadora';
import {Foto} from '@/componentes/ui/Foto';
import {Aparece, Etiqueta} from '@/componentes/ui/Seccion';
import {Tarjeta3D} from '@/componentes/ui/Tarjeta3D';
import {NEGOCIO} from '@/config/negocio';
import {enlaceWhatsApp, MENSAJES} from '@/lib/whatsapp';

/** Lo práctico, dicho corto. Es lo que alguien necesita saber antes de escribir. */
const DETALLES = [
  'Comedor techado con parrilla y horno al lado',
  'Mesa larga para todo el grupo',
  'El carbón y la leña los trae cada huésped',
  `Sin otro grupo en el terreno: hasta ${NEGOCIO.capacidad.total} personas`,
];

const OCASIONES = ['Cumpleaños', 'Reuniones familiares', 'Despedidas', 'Aniversarios'];

/**
 * LA FOGATA — el punto emocional de la mitad de noche.
 *
 * Es la sección más grande de la página después del hero, y a propósito: es la
 * imagen que la gente se lleva y la que decide. El titular se va a la escala
 * mayor del sistema, el cuerpo es corto, y la foto vertical de la fogata lleva
 * una luz cálida alrededor que se enciende cuando la sección entra en pantalla.
 *
 * La luz es un degradado radial que sube de opacidad, no una simulación de
 * fuego: nada parpadea, nada titila. Lo que se busca es que la página parezca
 * iluminada POR la foto, no que la foto tenga un efecto encima.
 */
export function LaNoche() {
  return (
    <section id="eventos" className="recorta relative">

      <div className="relative mx-auto max-w-6xl px-5 py-28 sm:px-8 md:py-36">
        {/* La columna del medio es `auto` y ya no `1px`: la caña mide 15px de
            ancho y en una columna de un píxel se recortaba a una raya, que es
            justo lo que vino a reemplazar. */}
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,0.9fr)] lg:gap-16">
          {/* Cada columna entra desde su lado: el texto por la izquierda, la
              foto por la derecha, y la sección se arma hacia el centro. */}
          <Aparece className="desde-izq">
            <Etiqueta className="text-sol mb-6">Cuando cae la noche</Etiqueta>
            <h2 className="titular titular-grande text-crema">
              Se prende la fogata y ahí se queda todo el mundo.
            </h2>
            <p className="bajada text-bruma-2 mt-7">
              A esa hora ya nadie vuelve a la piscina. Se arma la mesa larga bajo el comedor
              techado, alguien pone música y la noche se estira sola.
            </p>

            <ul className="escalona mt-10 border-t border-white/10">
              {DETALLES.map((d, i) => (
                <li
                  key={d}
                  style={{'--i': i} as React.CSSProperties}
                  className="text-crema/90 border-b border-white/10 py-3.5 text-[0.95rem] leading-snug"
                >
                  {d}
                </li>
              ))}
            </ul>

            <p className="mono text-bruma-3 mt-9 text-[0.72rem]">También para</p>
            <p className="text-bruma-2 mt-2.5 text-[0.92rem]">{OCASIONES.join(' · ')}</p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Boton href={enlaceWhatsApp(MENSAJES.evento)} variante="sol">
                Quiero vivir esta noche
              </Boton>
            </div>

            {/* La única regla del jardín, dicha acá y no escondida en el FAQ:
                vale más avisarlo antes que discutirlo el día del cumpleaños. */}
            <p className="text-bruma-3 mt-8 max-w-sm text-[0.85rem] leading-relaxed">
              Una sola regla: en el jardín no se permite jugar con globos ni pica pica.
            </p>
          </Aparece>

          {/* La misma caña que separa las columnas de "Cómo llegar". Aquí había
              una raya de un píxel con un degradado del color del sol, y hacía
              su trabajo, pero era una raya: la única medianera de la página que
              no pertenecía al lugar que la página está vendiendo. */}
          <CanaSeparadora />

          <Aparece demora={0.1} className="desde-der">
            <Tarjeta3D className="relative">
              {/* La luz que la foto proyecta sobre la página. Va detrás y
                  desbordando la foto, y se enciende con el scroll.

                  Queda FUERA del cuerpo que gira, y a propósito: no es parte
                  de la tarjeta, es lo que la tarjeta ilumina. Una luz proyectada
                  que se inclinara junto con el objeto que la proyecta sería una
                  mancha pegada a la foto, y entonces no habría nada iluminado. */}
              <div
                aria-hidden="true"
                // Sin z-index negativo: eso la mandaría detrás del fondo de la
                // sección y desaparecería. Va primera en el DOM y la foto, que
                // es `relative`, se pinta encima.
                className="luz-fogata pointer-events-none absolute -inset-16"
                style={{
                  background:
                    'radial-gradient(closest-side, rgb(246 167 45 / 0.3), rgb(214 122 52 / 0.14) 55%, transparent 78%)',
                }}
              />
              <div className="tarjeta3d-cuerpo relative">
                <div
                  className="tarjeta3d-alza shadow-(--shadow-alta) relative"
                  style={{borderRadius: '1.25rem'}}
                >
                  <div
                    className="revela-marco"
                    style={{'--radio-marco': '1.25rem'} as React.CSSProperties}
                  >
                    <Foto
                      nombre="fogata"
                      alt="La fogata encendida al anochecer, con el techo a dos aguas de una cabaña y los cerros de Mala detrás"
                      sizes="(min-width: 1024px) 44vw, 92vw"
                      className="respira aspect-[4/5] w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </Tarjeta3D>
          </Aparece>
        </div>
      </div>
    </section>
  );
}
