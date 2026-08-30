import {Amenidades} from '@/componentes/Amenidades';
import {Atardecer} from '@/componentes/Atardecer';
import {BarraConfianza} from '@/componentes/BarraConfianza';
import {BarraMovil} from '@/componentes/BarraMovil';
import {BotonWhatsApp} from '@/componentes/BotonWhatsApp';
import {ComoEsLaCabana} from '@/componentes/ComoEsLaCabana';
import {ComoLlegar} from '@/componentes/ComoLlegar';
import {CtaFinal} from '@/componentes/CtaFinal';
import {Eventos} from '@/componentes/Eventos';
import {Faq} from '@/componentes/Faq';
import {Footer} from '@/componentes/Footer';
import {Galeria} from '@/componentes/Galeria';
import {Hero} from '@/componentes/Hero';
import {LaPropiedad} from '@/componentes/LaPropiedad';
import {Nav} from '@/componentes/Nav';
import {Resenas} from '@/componentes/Resenas';
import {Tarifario} from '@/componentes/Tarifario';

/**
 * Una sola página, con anclas. El orden sigue el recorrido de alguien que
 * todavía no decidió: primero una imagen que convenza, después la promesa,
 * enseguida el precio y la capacidad (que es lo que hace abandonar cuando no
 * está), luego la prueba, la logística, y recién al final el empujón.
 */
export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <BarraConfianza />
        <LaPropiedad />
        <ComoEsLaCabana />
        <Tarifario />
        <Amenidades />
        <Atardecer />
        <Eventos />
        <Galeria />
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
