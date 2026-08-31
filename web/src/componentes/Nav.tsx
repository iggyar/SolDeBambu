import {Menu, X} from 'lucide-react';
import {useEffect, useState} from 'react';
import {IconoWhatsApp} from '@/componentes/ui/IconoWhatsApp';
import {NEGOCIO} from '@/config/negocio';
import {enlaceWhatsApp, MENSAJES} from '@/lib/whatsapp';

const ENLACES = [
  {href: '#el-dia', texto: 'El día'},
  {href: '#cabanas', texto: 'La cabaña'},
  {href: '#precios', texto: 'Precios'},
  {href: '#galeria', texto: 'Galería'},
  {href: '#llegar', texto: 'Cómo llegar'},
];

export function Nav() {
  const [solida, setSolida] = useState(false);
  const [abierta, setAbierta] = useState(false);

  useEffect(() => {
    const alScroll = () => setSolida(window.scrollY > 40);
    alScroll();
    window.addEventListener('scroll', alScroll, {passive: true});
    return () => window.removeEventListener('scroll', alScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = abierta ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [abierta]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-(--ease-suave) ${
          solida
            ? 'bg-noche/80 border-filete border-b backdrop-blur-xl'
            : 'border-b border-transparent'
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-[4.5rem] sm:px-8">
          <a
            href="#inicio"
            className="text-bruma font-display text-[1.05rem] leading-none tracking-tight"
            style={{fontVariationSettings: "'wdth' 118, 'wght' 800"}}
          >
            Sol de Bambú
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {ENLACES.map((e) => (
              <a
                key={e.href}
                href={e.href}
                className="text-bruma-2 hover:text-bruma text-[0.86rem] font-medium transition-colors"
              >
                {e.texto}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:+${NEGOCIO.whatsapp}`}
              className="condensada text-bruma-2 hover:text-bruma hidden text-[0.72rem] transition-colors xl:block"
            >
              {NEGOCIO.telefonoVisible}
            </a>
            <a
              href={enlaceWhatsApp(MENSAJES.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-bruma text-noche inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.86rem] font-semibold transition-colors hover:bg-white sm:px-5"
            >
              <IconoWhatsApp size={16} />
              <span className="hidden sm:inline">Reservar</span>
            </a>

            <button
              type="button"
              onClick={() => setAbierta(true)}
              aria-label="Abrir menú"
              className="text-bruma -mr-1 p-2 lg:hidden"
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </header>

      {abierta && (
        <div className="bg-noche fixed inset-0 z-60 flex flex-col lg:hidden">
          <div className="flex h-16 items-center justify-between px-5">
            <span
              className="text-bruma font-display text-[1.05rem]"
              style={{fontVariationSettings: "'wdth' 118, 'wght' 800"}}
            >
              Sol de Bambú
            </span>
            <button
              type="button"
              onClick={() => setAbierta(false)}
              aria-label="Cerrar menú"
              className="text-bruma -mr-1 p-2"
            >
              <X size={22} />
            </button>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-1 px-8 pb-24">
            {ENLACES.map((e) => (
              <a
                key={e.href}
                href={e.href}
                onClick={() => setAbierta(false)}
                className="font-display text-bruma hover:text-sol border-filete border-b py-4 text-3xl transition-colors"
                style={{fontVariationSettings: "'wdth' 110, 'wght' 700"}}
              >
                {e.texto}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
