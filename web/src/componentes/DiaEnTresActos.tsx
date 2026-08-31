import {useEffect, useRef, useState} from 'react';
import {Foto} from '@/componentes/ui/Foto';

/**
 * El día en tres actos: la única sección fijada de toda la página.
 *
 * El eje narrativo del sitio es la luz, y acá es literal — la foto y el tinte
 * van de la mañana en el agua a la noche en la fogata mientras el texto pasa
 * por encima.
 *
 * Dos decisiones que valen la pena explicar:
 *
 * 1. Se fija con `position: sticky`, no con una librería de pinning. Sticky lo
 *    resuelve el compositor del navegador y no JavaScript, así que no pelea con
 *    el scroll nativo del celular.
 *
 * 2. El acto activo es un ESTADO DISCRETO y el cruce lo hace una transición de
 *    CSS. La primera versión ligaba la opacidad de las tres fotos al progreso
 *    del scroll cuadro a cuadro: tres imágenes a pantalla completa
 *    recalculándose en cada frame saturaban el compositor y la sección
 *    terminaba sin pintar. Así solo hay tres cambios de estado en todo el
 *    recorrido, y el navegador anima dos capas por vez.
 */
const ACTOS = [
  {
    numero: '01',
    momento: 'Mañana',
    titulo: 'A las nueve el agua ya está tibia.',
    texto:
      'En Mala el sol pega temprano y no hay nadie más en la propiedad. La piscina es de ustedes ' +
      'desde que abren los ojos, y el día entero todavía no empezó.',
    foto: 'cabanas-piscina',
    alt: 'Las cabañas vistas desde el borde de la piscina por la mañana',
    tinte: 'rgba(14, 34, 48, 0.26)',
  },
  {
    numero: '02',
    momento: 'Tarde',
    titulo: 'La parrilla se prende bajo el techo.',
    texto:
      'El comedor techado da sombra justo cuando más pega, con la parrilla y el horno al lado. ' +
      'Ustedes traen el carbón y la leña; el resto ya está.',
    foto: 'piscina-quincho',
    alt: 'El comedor techado con la parrilla, junto a la piscina, por la tarde',
    tinte: 'rgba(74, 34, 8, 0.36)',
  },
  {
    numero: '03',
    momento: 'Noche',
    titulo: 'Y cuando refresca, la fogata.',
    texto:
      'Nadie lo propone: se prende y ahí se queda todo el mundo. Arriba se ven las estrellas, que ' +
      'a hora y cuarto de Lima todavía existen.',
    foto: 'cabana-noche',
    alt: 'La cabaña iluminada de noche bajo el cielo estrellado',
    tinte: 'rgba(8, 12, 10, 0.58)',
  },
];

export function DiaEnTresActos() {
  const [activo, setActivo] = useState(0);
  const seccion = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = seccion.current;
    if (!el) return;

    // El acto sale de una cuenta sobre la posición de la sección, no de un
    // IntersectionObserver. La primera versión observaba una franja de altura
    // cero en el centro de la pantalla (`rootMargin: -50% 0 -50%`), que es la
    // receta habitual y aquí nunca disparó: con área cero el ratio de
    // intersección se queda en 0 y el acto no cambiaba nunca. Esto es
    // aritmética simple, se puede verificar y no depende de un umbral.
    // Se calcula en el propio evento de scroll, sin pasar por
    // requestAnimationFrame. La versión con rAF llevaba un latch para no
    // encolar dos cuadros, y ese latch solo se libera dentro del callback: si
    // rAF deja de correr — pasa con la pestaña oculta — el latch se queda
    // trabado y el acto no vuelve a cambiar. Es un riesgo que no hace falta
    // correr, porque acá el trabajo real es una lectura de posición y cuatro
    // cuentas, y setActivo corta cuando el acto no cambió: React vuelve a
    // renderizar tres veces en todo el recorrido, no una por cuadro.
    const calcular = () => {
      const recorrido = el.offsetHeight - window.innerHeight;
      if (recorrido <= 0) return;
      const avance = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / recorrido));
      // El último tramo se reserva para la salida, así que el acto 3 llega
      // antes de que la sección se despegue.
      const i = Math.min(ACTOS.length - 1, Math.floor(avance * ACTOS.length * 1.12));
      setActivo((previo) => (previo === i ? previo : i));
    };

    calcular();
    window.addEventListener('scroll', calcular, {passive: true});
    window.addEventListener('resize', calcular);
    return () => {
      window.removeEventListener('scroll', calcular);
      window.removeEventListener('resize', calcular);
    };
  }, []);

  return (
    <section id="el-dia" ref={seccion} className="bg-noche relative">
      <div className="textura-grano sticky top-0 h-[100svh] overflow-hidden">
        {ACTOS.map((acto, i) => (
          <div
            key={acto.numero}
            aria-hidden={i !== activo}
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{opacity: i === activo ? 1 : 0}}
          >
            <Foto
              nombre={acto.foto}
              alt={i === activo ? acto.alt : ''}
              sizes="100vw"
              className="h-full w-full object-cover"
            />
          </div>
        ))}

        <div
          className="absolute inset-0 transition-colors duration-700 ease-out"
          style={{backgroundColor: ACTOS[activo].tinte}}
        />
        <div className="from-noche via-noche/40 absolute inset-0 bg-gradient-to-t to-transparent" />

        {/* pb-32 en móvil: la barra fija de reservar mide unos 76px y se comía la
            última línea del párrafo. Desde lg la barra no existe. */}
        <div className="relative mx-auto flex h-full max-w-6xl items-end px-5 pb-32 sm:px-8 lg:pb-20">
          <div className="relative w-full">
            {/* Un molde invisible reserva el alto para que el bloque no salte
                al cambiar de acto. Tiene que ser el texto MÁS LARGO de los
                tres, no uno cualquiera, o el más largo se desborda. */}
            <div className="invisible" aria-hidden="true">
              <Texto acto={[...ACTOS].sort((a, b) => b.texto.length - a.texto.length)[0]} />
            </div>
            {ACTOS.map((acto, i) => (
              <div
                key={acto.numero}
                className="absolute inset-x-0 bottom-0 transition-opacity duration-500 ease-out"
                style={{opacity: i === activo ? 1 : 0}}
              >
                <Texto acto={acto} />
              </div>
            ))}
          </div>
        </div>

        {/* Marcador de acto. Acá la numeración sí codifica algo real: es un día,
            y el orden es la información. */}
        <ol className="absolute top-1/2 right-5 hidden -translate-y-1/2 flex-col gap-4 sm:right-8 lg:flex">
          {ACTOS.map((acto, i) => (
            <li
              key={acto.numero}
              className="flex items-center justify-end gap-3 transition-opacity duration-500"
              style={{opacity: i === activo ? 1 : 0.3}}
            >
              <span className="condensada text-bruma text-[0.7rem]">{acto.momento}</span>
              <span
                className="bg-sol h-px transition-all duration-500"
                style={{width: i === activo ? '2rem' : '0.75rem'}}
              />
            </li>
          ))}
        </ol>
      </div>

      {/* El recorrido: un tramo de pantalla por acto. No pinta nada, solo le da
          a la sección el alto que necesita para que el fijado dure tres actos. */}
      {ACTOS.map((acto) => (
        <div key={acto.numero} aria-hidden="true" className="h-[100svh]" />
      ))}
    </section>
  );
}

function Texto({acto}: {acto: (typeof ACTOS)[number]}) {
  return (
    <div className="max-w-xl">
      <p className="condensada text-sol mb-4 flex items-center gap-3 text-[0.72rem]">
        <span>{acto.numero}</span>
        <span className="bg-sol/40 h-px w-6" />
        <span>{acto.momento}</span>
      </p>
      <h2 className="text-bruma text-[1.9rem] leading-[1.12] sm:text-[2.6rem] md:text-[3rem]">
        {acto.titulo}
      </h2>
      <p className="text-bruma-2 mt-4 text-[1rem] leading-relaxed sm:text-[1.05rem]">{acto.texto}</p>
    </div>
  );
}
