import {useEffect, useState} from 'react';
import {IconoWhatsApp} from '@/componentes/ui/IconoWhatsApp';
import {NEGOCIO} from '@/config/negocio';
import {enlaceWhatsApp, MENSAJES} from '@/lib/whatsapp';

/**
 * Barra fija inferior, solo en móvil. Casi todo el tráfico va a llegar de
 * Instagram y TikTok, en celular: que el botón de WhatsApp esté siempre a la
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
      // Sin `backdrop-blur`: el fondo va al 95% de opacidad, así que el
      // desenfoque de 24px que había acá era invisible y aun así el navegador lo
      // recalculaba en cada fotograma de scroll, a lo ancho de toda la pantalla
      // y en el dispositivo más lento. Junto con la barra de arriba eran dos
      // franjas desenfocándose a la vez en celular.
      className={`bg-noche/95 border-filete fixed inset-x-0 bottom-0 z-40 border-t transition-transform duration-500 ease-(--ease-suave) lg:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{paddingBottom: 'env(safe-area-inset-bottom)'}}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-3">
        <div className="leading-tight">
          <p className="mono text-bruma-3 text-[0.72rem]">
            {NEGOCIO.ubicacion.distrito}, {NEGOCIO.ubicacion.provincia}
          </p>
          <p className="titular-chico text-crema mt-0.5">{NEGOCIO.nombre}</p>
        </div>
        <a
          href={enlaceWhatsApp(MENSAJES.general)}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={visible ? 0 : -1}
          className="boton boton-sol pulsable px-6"
        >
          <IconoWhatsApp size={18} className="flex-none" />
          <span>Reservar</span>
        </a>
      </div>
    </div>
  );
}
