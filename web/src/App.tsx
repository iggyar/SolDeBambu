import {BarraDatos} from '@/componentes/BarraDatos';
import {BarraMovil} from '@/componentes/BarraMovil';
import {BotonWhatsApp} from '@/componentes/BotonWhatsApp';
import {ComoLlegar} from '@/componentes/ComoLlegar';
import {CtaFinal} from '@/componentes/CtaFinal';
import {DiaEnTresActos} from '@/componentes/DiaEnTresActos';
import {LaCabana} from '@/componentes/LaCabana';
import {Eventos} from '@/componentes/Eventos';
import {Faq} from '@/componentes/Faq';
import {Footer} from '@/componentes/Footer';
import {GaleriaCarrusel} from '@/componentes/GaleriaCarrusel';
import {Hero} from '@/componentes/Hero';
import {Nav} from '@/componentes/Nav';
import {Resenas} from '@/componentes/Resenas';
import {Tarifario} from '@/componentes/Tarifario';

/**
 * Una sola página, con anclas. El eje narrativo es la luz: abre al atardecer,
 * retrocede a la mañana y avanza hasta la noche, y recién entonces habla de
 * dinero. El orden sigue el recorrido de alguien que todavía no decidió —
 * primero una imagen que convenza, después la historia, enseguida el precio y
 * la capacidad, luego la prueba, la logística, y al final el empujón.
 */
export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <BarraDatos />
        <DiaEnTresActos />
        <LaCabana />
        <Tarifario />
        <Eventos />
        <GaleriaCarrusel />
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
