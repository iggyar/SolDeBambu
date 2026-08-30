import {Boton} from '@/componentes/ui/Boton';
import {Foto} from '@/componentes/ui/Foto';
import {IconoWhatsApp} from '@/componentes/ui/IconoWhatsApp';
import {Aparece} from '@/componentes/ui/Seccion';
import {NEGOCIO} from '@/config/negocio';
import {enlaceWhatsApp, formatearSoles, MENSAJES} from '@/lib/whatsapp';

export function CtaFinal() {
  return (
    <section className="textura-grano relative overflow-hidden">
      <div className="absolute inset-0">
        <Foto
          nombre="cabana-palmeras"
          alt="Una de las cabañas entre palmeras, con su terraza al jardín"
          sizes="100vw"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="bg-bambu-hondo/78 absolute inset-0" />

      <div className="relative mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 md:py-32">
        <Aparece>
          <h2 className="text-arena text-[2.1rem] leading-[1.1] sm:text-5xl">
            Elige tu fecha y escríbenos.
          </h2>
          <p className="text-arena/75 mx-auto mt-5 max-w-lg text-[1.05rem] leading-relaxed">
            Te confirmamos disponibilidad y la tarifa final en el mismo chat. Desde{' '}
            {formatearSoles(NEGOCIO.precioDesde)} la noche.
          </p>
          <div className="mt-9 flex justify-center">
            <Boton href={enlaceWhatsApp(MENSAJES.disponibilidad)} variante="whatsapp" tamano="lg">
              <IconoWhatsApp size={19} />
              Consultar disponibilidad
            </Boton>
          </div>
        </Aparece>
      </div>
    </section>
  );
}
