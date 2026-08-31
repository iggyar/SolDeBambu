import {ArrowUpRight} from 'lucide-react';
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
          nombre="cabana-noche"
          alt=""
          sizes="100vw"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="from-noche via-noche/70 to-noche/85 absolute inset-0 bg-gradient-to-b" />

      <div className="relative mx-auto max-w-3xl px-5 py-28 text-center sm:px-8 md:py-36">
        <Aparece>
          <h2 className="text-bruma text-[2.2rem] leading-[1.08] sm:text-[3rem] md:text-[3.6rem]">
            Elige tu fecha
            <br />y escríbenos.
          </h2>
          <p className="text-bruma-2 mx-auto mt-6 max-w-md text-[1.02rem] leading-relaxed">
            Te confirmamos disponibilidad y la tarifa final en el mismo chat. Desde{' '}
            {formatearSoles(NEGOCIO.precioDesde)} la noche.
          </p>
          <div className="mt-10 flex justify-center">
            <a
              href={enlaceWhatsApp(MENSAJES.disponibilidad)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sol text-noche group inline-flex items-center gap-3 rounded-full py-4 pr-4 pl-7 text-[1rem] font-semibold transition-colors duration-300 hover:bg-[#FFC15E]"
            >
              <IconoWhatsApp size={19} />
              Consultar disponibilidad
              <span className="bg-noche text-sol flex h-9 w-9 items-center justify-center rounded-full">
                <ArrowUpRight size={17} strokeWidth={2.2} />
              </span>
            </a>
          </div>
        </Aparece>
      </div>
    </section>
  );
}
