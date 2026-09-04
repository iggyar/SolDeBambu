/**
 * EL BAMBUSAL — las cañas que enmarcan la mitad de día.
 *
 * La página se llama Sol de Bambú y las secciones de día eran campos de color
 * planos. Estas cañas nacen de las dos paredes, repartidas a lo alto de toda la
 * sección, y son completamente estáticas: acompañan la lectura por estar donde
 * están, no por moverse.
 *
 * En celular sobreviven cuatro por lado, repartidas igual de arriba abajo.
 */

/** Hoja lanceolada que cae desde su punto de anclaje. */
export const HOJA = 'M0 0C15 -8 36 -6 54 4C36 12 16 9 0 0Z';

export const BASE = 1200;

/**
 * Cuánto se meten las cañas por detrás del borde antes de dibujarse. Lo justo
 * para que el arranque quede fuera de cuadro y no se vea el pie cortado.
 */
const SANGRADO = 34;

export type Cana = {
  /** Altura del arranque sobre la pared. La caña siempre nace en x = 0. */
  y: number;
  ancho: number;
  alto: number;
  /** Cuánto se separa de la vertical, hacia el centro. */
  inclina: number;
  /** Distancias desde el arranque donde nace cada racimo de hojas. */
  hojas: number[];
  /** Cuánto se curva hacia el centro, como fracción de su propio largo. */
  curva?: number;
  /** Solo las marcadas sobreviven en celular. */
  movil?: boolean;
};

/**
 * Doce cañas por lado, repartidas a lo ALTO de toda la pared en vez de
 * agrupadas en racimos. La separación es irregular a propósito —un bambusal
 * regular se lee como una valla— y se va cerrando hacia abajo, que es donde el
 * ojo espera más densidad y donde da la sensación de acompañar el scroll.
 *
 * El ancho, el largo, la inclinación y la curvatura varían caña por caña: si
 * todas comparten valores, por más que estén separadas se leen como copias.
 */
const CANAS: Cana[] = [
  {y: 90, ancho: 16, alto: 620, inclina: 23, curva: 0.2, hojas: [360, 520]},
  {y: 215, ancho: 22, alto: 830, inclina: 15, curva: 0.23, hojas: [470, 660, 780], movil: true},
  {y: 355, ancho: 17, alto: 690, inclina: 20, curva: 0.26, hojas: [400, 580]},
  {y: 480, ancho: 27, alto: 960, inclina: 11, curva: 0.19, hojas: [540, 760, 890]},
  {y: 600, ancho: 19, alto: 770, inclina: 18, curva: 0.24, hojas: [450, 650], movil: true},
  {y: 705, ancho: 15, alto: 560, inclina: 26, curva: 0.27, hojas: [330, 480]},
  {y: 800, ancho: 29, alto: 1030, inclina: 9, curva: 0.2, hojas: [580, 810, 950]},
  {y: 885, ancho: 20, alto: 720, inclina: 17, curva: 0.25, hojas: [420, 610]},
  {y: 960, ancho: 24, alto: 880, inclina: 12, curva: 0.21, hojas: [500, 710, 830], movil: true},
  {y: 1030, ancho: 17, alto: 640, inclina: 21, curva: 0.26, hojas: [380, 545]},
  {y: 1100, ancho: 31, alto: 1120, inclina: 7, curva: 0.18, hojas: [620, 870, 1020]},
  {y: 1190, ancho: 21, alto: 810, inclina: 13, curva: 0.23, hojas: [470, 680], movil: true},
];

/**
 * Una caña. Nace en la pared (x = 0) y CRECE CURVÁNDOSE hacia el centro.
 *
 * La curva no es adorno: una caña recta inclinada se lee como un palo apoyado,
 * y para tapar el sol había que inclinarla tanto que terminaba tumbada. Con
 * curvatura el arranque sale casi perpendicular a la pared y la punta se va
 * cerrando sobre el centro, que es como se dobla un bambú de verdad y lo que
 * hace que cubra sin verse tieso.
 *
 * `desvio` es la separación horizontal respecto al eje a cada altura. Va al
 * cuadrado y no lineal: cerca del arranque casi no se desvía y la curva se
 * acentúa hacia la punta, que es donde el peso la vence.
 */
export function Cana({y: arranque, ancho, alto, inclina, hojas, curva = 0.24}: Cana) {
  const punta = ancho * 0.58;
  const nudos = Math.max(0, Math.floor((alto - 120) / 150));
  const maximo = alto * curva;
  const desvio = (h: number) => maximo * Math.pow(h / alto, 2);
  /** Ancho de la caña a una altura dada, por el ahusado. */
  const grosor = (h: number) => ancho - (ancho - punta) * (h / alto);

  const dPunta = desvio(alto);
  return (
    <g transform={`translate(${-SANGRADO} ${arranque}) rotate(${inclina})`}>
      <path
        d={
          `M${-ancho / 2} 0 ` +
          `C${-ancho / 2 + maximo * 0.06} ${-alto * 0.45}, ` +
          `${-punta / 2 + maximo * 0.55} ${-alto * 0.8}, ` +
          `${-punta / 2 + dPunta} ${-alto} ` +
          `Q${dPunta} ${-alto - 10} ${punta / 2 + dPunta} ${-alto} ` +
          `C${punta / 2 + maximo * 0.55} ${-alto * 0.8}, ` +
          `${ancho / 2 + maximo * 0.06} ${-alto * 0.45}, ` +
          `${ancho / 2} 0 Z`
        }
      />
      {Array.from({length: nudos}, (_, i) => {
        const h = 90 + i * 150;
        const w = grosor(h);
        return (
          <rect
            key={i}
            x={desvio(h) - w * 0.68}
            y={-h}
            width={w * 1.36}
            height={Math.max(2.5, w * 0.2)}
            rx={w * 0.1}
          />
        );
      })}
      {hojas.map((h, i) => (
        <g key={h} transform={`translate(${desvio(h)} ${-h})`}>
          <path d={HOJA} transform={`rotate(${-26 - i * 8}) scale(1.3)`} />
          <path d={HOJA} transform={`rotate(${18 + i * 6}) scale(-1.2 1.2)`} />
          <path d={HOJA} transform={`rotate(${-58 - i * 4}) scale(0.95)`} />
          <path d={HOJA} transform={`rotate(${52 + i * 5}) scale(-0.88 0.88)`} />
        </g>
      ))}
    </g>
  );
}

function Lado({derecha = false}: {derecha?: boolean}) {
  return (
    <svg
      viewBox={`0 0 360 ${BASE}`}
      preserveAspectRatio={derecha ? 'xMaxYMax slice' : 'xMinYMax slice'}
      // `overflow-visible`: las puntas curvadas salen del viewBox y sin esto se
      // cortarían en seco contra su propio borde. El recorte de verdad lo hace
      // la sección, que para eso usa clip-path.
      className={`bambu-lado absolute inset-y-0 h-full w-[clamp(88px,16vw,280px)] overflow-visible ${
        derecha ? 'right-0 -scale-x-100' : 'left-0'
      }`}
      fill="currentColor"
    >
      {CANAS.map((c) => (
        <g key={c.y} className={c.movil ? undefined : 'bambu-cana--amplia'}>
          <Cana {...c} />
        </g>
      ))}
    </svg>
  );
}

/**
 * Se monta dentro de una sección de la mitad de día, que tiene que ser
 * `relative` y recortar con `clip-path` — nunca con `overflow: hidden`, que
 * rompería los timelines de scroll de sus hijos.
 *
 * ── POR LOS DOS LADOS ─────────────────────────────────────────────────────
 * Se reutiliza solo en las secciones claras donde funciona como textura de
 * fondo; no aparece en toda la página ni compite con la fotografía.
 *
 * Al 30% de su fuerza se percibe como el papel sobre el que está impresa la
 * sección, no como un elemento que haya que mirar.
 *
 * La caña de la derecha es la misma volteada (`-scale-x-100`), no un segundo
 * dibujo: dos bambusales distintos a los lados se leen como error antes que
 * como variedad.
 */
export function Bambusal() {
  return (
    <div
      aria-hidden="true"
      className="bambusal recorta text-bambu/30 pointer-events-none absolute inset-0 select-none"
    >
      <Lado />
      <Lado derecha />
    </div>
  );
}
