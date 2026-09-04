import {useEffect, useState} from 'react';
import {IconoWhatsApp} from '@/componentes/ui/IconoWhatsApp';
import {enlaceWhatsApp, MENSAJES} from '@/lib/whatsapp';

/**
 * Botón flotante de escritorio. No aparece sobre el hero — ahí ya hay un CTA
 * grande y taparlo sería redundante —, sino recién cuando el usuario empieza
 * a bajar y el botón del hero ya no está a la vista.
 */
export function BotonWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alScroll = () => setVisible(window.scrollY > window.innerHeight * 0.85);
    alScroll();
    window.addEventListener('scroll', alScroll, {passive: true});
    return () => window.removeEventListener('scroll', alScroll);
  }, []);

  return (
    <a
      href={enlaceWhatsApp(MENSAJES.general)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`pulsable bg-whatsapp hover:bg-whatsapp-hover shadow-(--shadow-alta) fixed right-6 bottom-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full text-white transition-[opacity,transform,background-color] duration-500 ease-(--ease-suave) lg:flex ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <span className="bg-whatsapp anima-latido absolute inset-0 rounded-full" aria-hidden="true" />
      <IconoWhatsApp size={26} className="relative" />
    </a>
  );
}
