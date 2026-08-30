import {useEffect, useState} from 'react';
import {IconoWhatsApp} from '@/componentes/ui/IconoWhatsApp';
import {NEGOCIO} from '@/config/negocio';
import {enlaceWhatsApp, formatearSoles, MENSAJES} from '@/lib/whatsapp';

/**
 * Barra fija inferior, solo en móvil. Casi todo el tráfico va a llegar de
 * Instagram y TikTok, en celular: que el precio y el botón estén siempre a la
 * vista es lo que más mueve la aguja de toda la página.
 */
export function BarraMovil() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    alScroll();
    window.addEventListener('scroll', alScroll, {passive: true});
    return () => window.removeEventListener('scroll', alScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`bg-arena/95 border-arena-3/70 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-xl transition-transform duration-500 ease-(--ease-suave) lg:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{paddingBottom: 'env(safe-area-inset-bottom)'}}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-3">
        <div className="leading-tight">
          <p className="text-tinta-3 text-[0.7rem] font-medium tracking-wide uppercase">Desde</p>
          <p className="font-display text-tinta text-xl font-semibold">
            {formatearSoles(NEGOCIO.precioDesde)}
            <span className="text-tinta-3 ml-1 text-[0.8rem] font-normal">la noche</span>
          </p>
        </div>
        <a
          href={enlaceWhatsApp(MENSAJES.general)}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={visible ? 0 : -1}
          className="bg-whatsapp hover:bg-whatsapp-hover inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[0.95rem] font-semibold text-white transition-colors active:scale-[0.98]"
        >
          <IconoWhatsApp size={18} />
          Reservar
        </a>
      </div>
    </div>
  );
}
