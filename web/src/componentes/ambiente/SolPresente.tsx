/**
 * EL SOL — la mitad que le falta al nombre.
 *
 * Las dos versiones anteriores fallaron por lo mismo: era un degradado radial, y
 * un degradado radial no es un sol, es una mancha. Este es un sol dibujado, en
 * el mismo lenguaje plano que las cañas de bambú — disco con borde, halos
 * concéntricos y rayos triangulares. Vectorial y con detalle, no fotorrealista.
 *
 * Los rayos son cortos y de baja opacidad a propósito: tienen que leerse como
 * sol sin llegar hasta donde está el texto. Un sol que compite con el titular es
 * un sol que hay que apagar después.
 *
 * En `centro` va detrás de donde el bambusal se abre, y su recorrido hace dos
 * cosas seguidas sobre el mismo scroll: crece y se aclara mientras lo destapan,
 * y después cae y se enfría hacia el atardecer.
 */

/** Los rayos: triángulos finos, alternando largo, como los dibujaría un vector. */
const RAYOS = Array.from({length: 16}, (_, i) => ({
  angulo: i * 22.5,
  largo: i % 2 === 0 ? 46 : 27,
  ancho: i % 2 === 0 ? 4.2 : 3,
}));

function Disco() {
  return (
    <svg viewBox="-100 -100 200 200" className="h-full w-full overflow-visible">
      {/* Los halos, de afuera hacia adentro. Van dentro del SVG y no como
          box-shadow para que escalen junto con el resto del dibujo. */}
      <circle r="88" fill="var(--color-sol)" opacity="0.05" />
      <circle r="66" fill="var(--color-sol)" opacity="0.08" />
      <circle r="49" fill="var(--color-sol-vivo)" opacity="0.11" />

      <g fill="var(--color-sol)" opacity="0.34">
        {RAYOS.map((r) => (
          <path
            key={r.angulo}
            d={`M${-r.ancho} -40 L${r.ancho} -40 L0 ${-40 - r.largo} Z`}
            transform={`rotate(${r.angulo})`}
          />
        ))}
      </g>

      {/* El disco. El borde en un tono más vivo es lo que lo convierte en un
          objeto con contorno, en vez de un degradado que se desvanece. */}
      <circle r="34" fill="var(--color-sol-vivo)" opacity="0.62" />
      <circle r="34" fill="none" stroke="var(--color-sol)" strokeWidth="2.5" opacity="0.55" />
      <circle r="26" fill="#FFF4DC" opacity="0.5" />
    </svg>
  );
}

export function SolPresente({
  lado = 'izquierda',
  posicion = 'lateral',
}: {
  lado?: 'izquierda' | 'derecha';
  /** `centro` lo pone detrás de donde el bambusal se abre y le da el revelado. */
  posicion?: 'lateral' | 'centro';
}) {
  if (posicion === 'centro') {
    return (
      // `sticky` de alto cero: el sol deja de estar clavado a un punto de la
      // sección y pasa a quedarse centrado en la PANTALLA mientras la sección
      // dura. Es lo que hace que te acompañe al bajar en vez de irse hacia
      // arriba con el contenido. El alto cero es para que no ocupe lugar en el
      // flujo; lo único que aporta es el anclaje.
      <div aria-hidden="true" className="pointer-events-none sticky top-0 h-0 select-none">
        <div
          // El centrado va por `margin` y no por las utilidades `-translate-*`:
          // esas escriben la propiedad `translate`, y con el sol animándose es
          // una pelea que no hace falta tener.
          className="sol-halo sol-halo--centro absolute top-[18vh] left-1/2 aspect-square w-[min(38vw,400px)]"
          style={{
            marginLeft: 'calc(min(19vw, 200px) * -1)',
            marginTop: 'calc(min(19vw, 200px) * -1)',
          }}
        >
          <Disco />
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`sol-halo pointer-events-none absolute top-[18%] aspect-square w-[min(40vw,420px)] select-none ${
        lado === 'derecha' ? 'right-[-8%]' : 'left-[-8%]'
      }`}
    >
      <Disco />
    </div>
  );
}
