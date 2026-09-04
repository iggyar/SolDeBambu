import {Camino} from '@/componentes/Camino';
import {Foto} from '@/componentes/ui/Foto';
import {BarraMovil} from '@/componentes/BarraMovil';
import {BotonWhatsApp} from '@/componentes/BotonWhatsApp';
import {ComoLlegar} from '@/componentes/ComoLlegar';
import {ArmadorReserva} from '@/componentes/ArmadorReserva';
import {Experiencia} from '@/componentes/Experiencia';
import {LaCabana} from '@/componentes/LaCabana';
import {LaNoche} from '@/componentes/LaNoche';
import {Faq} from '@/componentes/Faq';
import {GaleriaCarrusel} from '@/componentes/GaleriaCarrusel';
import {Hero} from '@/componentes/Hero';
import {SecuenciaDiaNoche} from '@/componentes/SecuenciaDiaNoche';
import {Nav} from '@/componentes/Nav';
import {ProgresoScroll} from '@/componentes/ui/ProgresoScroll';
import {Resenas} from '@/componentes/Resenas';
import {useEntradas} from '@/lib/entrada';
import {useHora} from '@/lib/hora';

/**
 * Una sola página, y una sola tarde.
 *
 * El eje narrativo es la luz, y es literal: se entra a mediodía sobre el
 * celeste del valle, la secuencia del atardecer hace de bisagra —y arrastra el
 * color de toda la página con ella—, y de ahí abajo ya es de noche. La invitación a escribir queda del lado de la fogata,
 * que es cuando la gente decide.
 *
 * El orden es el del recorrido de alguien que no conoce el lugar:
 *   qué es → qué incluye → cuán lejos está → cómo se ve →
 *   cae el sol → cómo es de noche → quién más estuvo →
 *   dónde queda exactamente → qué falta preguntar → reservar.
 *
 * El CTA de reserva aparece cuatro veces: al cerrar la presentación, sobre la
 * carretera, junto a la fogata y en el cierre. Más la barra superior y la barra
 * fija de celular, que no se van nunca.
 */
export default function App() {
  // Arma las entradas de toda la página: esconde lo que va a entrar y lo
  // suelta cuando asoma, una sola vez (ver lib/entrada.ts).
  useEntradas();
  // El reloj de la página: la secuencia del atardecer manda el color de todo lo
  // que lleva `fondo-hora` / `texto-hora` (ver lib/hora.ts).
  useHora();

  return (
    <>
      <ProgresoScroll />
      <Nav />
      <main>
        <Hero />

        {/* LA SUPERFICIE DEL DÍA.
            Todas las secciones claras van sobre un mismo fondo, y no cada una
            con el suyo. No es cosmético: las secciones recortan con `clip-path`
            y sus bordes quedan con antialias, así que cuando el límite entre
            dos cae en una fracción de píxel —que es casi siempre— por esa
            costura se veía el fondo del `body`, que es azul noche. El resultado
            era una raya oscura de un píxel cruzando la página entre sección y
            sección.

            Este envoltorio lleva `fondo-hora`, la misma variable de color que
            usa la galería, así que lo que asoma por cualquier
            costura es exactamente el color que la página tiene a esa hora: de
            día celeste, de noche azul tinta. La raya deja de existir sin que
            haya que perseguir cada límite por separado. */}
        <div className="fondo-hora">
          {/* — De día — */}
          <LaCabana />
          <Experiencia />
          <Camino />
          <GaleriaCarrusel />

          {/* — La bisagra: acá cambia la hora de la página entera — */}
          <SecuenciaDiaNoche />
        </div>

        {/* LA SUPERFICIE DE LA NOCHE.
            El mismo envoltorio que la mitad de día, y por el mismo motivo, que
            aquí se veía todavía peor: las secciones recortan con `clip-path` y
            sus bordes quedan con antialias, así que en el límite entre dos
            —que casi nunca cae en un píxel entero— ninguna de las dos cubre
            del todo esa fila. Con el grano puesto sección por sección, esa
            fila era la única sin película: una raya de un píxel cruzando la
            pantalla entre sección y sección.

            Con `bg-noche` y `textura-grano` aquí arriba, lo que asoma por
            cualquier costura es el mismo azul con el mismo grano que tienen
            los dos lados, y la costura deja de existir sin perseguir cada
            límite por separado. */}
        <div className="textura-grano bg-noche relative">
          {/* Un único cielo pegajoso acompaña toda la mitad nocturna. Así la
              foto conserva su proporción y resolución en vez de estirarse a
              varios miles de píxeles o terminar después de una sola sección. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="sticky top-0 h-[100svh] overflow-hidden bg-noche">
              <Foto
                nombre="cielo-nocturno"
                alt=""
                sizes="125vw"
                className="h-full w-full object-cover object-[65%_50%] opacity-55"
              />
            </div>

            {/* Solo suaviza los límites del bloque completo; el centro queda
                despejado para que las constelaciones continúen sin cortes. */}
            <div className="from-noche absolute inset-x-0 top-0 h-36 bg-gradient-to-b to-transparent" />
            <div className="from-noche absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t to-transparent" />
          </div>

          <LaNoche />
          <Resenas />
          <ComoLlegar />
          <Faq />
          <ArmadorReserva />
        </div>
      </main>
      <BotonWhatsApp />
      <BarraMovil />
    </>
  );
}
