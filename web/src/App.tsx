import {BarraDatos} from '@/componentes/BarraDatos';
import {BarraMovil} from '@/componentes/BarraMovil';
import {BotonWhatsApp} from '@/componentes/BotonWhatsApp';
import {ComoLlegar} from '@/componentes/ComoLlegar';
import {CtaFinal} from '@/componentes/CtaFinal';
import {LaCabana} from '@/componentes/LaCabana';
import {LaNoche} from '@/componentes/LaNoche';
import {Faq} from '@/componentes/Faq';
import {Footer} from '@/componentes/Footer';
import {GaleriaCarrusel} from '@/componentes/GaleriaCarrusel';
import {Hero} from '@/componentes/Hero';
import {SecuenciaDiaNoche} from '@/componentes/SecuenciaDiaNoche';
import {Nav} from '@/componentes/Nav';
import {Resenas} from '@/componentes/Resenas';
import {Tarifario} from '@/componentes/Tarifario';

/**
 * Una sola página. El eje narrativo es la luz, y es literal: la primera mitad
 * transcurre de día sobre fondo arena, la secuencia del atardecer hace de
 * bisagra, y la segunda mitad ya es de noche. El precio queda del lado de la
 * fogata, que es cuando la gente decide.
 */
export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <BarraDatos />
        <LaCabana />
        <GaleriaCarrusel />
        <SecuenciaDiaNoche />
        <LaNoche />
        <Tarifario />
        <Resenas />
        <ComoLlegar />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
      <BotonWhatsApp />
      <BarraMovil />
    </>
  );
}
