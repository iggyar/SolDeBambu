import {Menu, X} from 'lucide-react';
import {useEffect, useState} from 'react';
import {IconoWhatsApp} from '@/componentes/ui/IconoWhatsApp';
import {enlaceWhatsApp, MENSAJES} from '@/lib/whatsapp';

const ENLACES = [
  {href: '#cabanas', texto: 'Las cabañas'},
  {href: '#precios', texto: 'Precios'},
  {href: '#galeria', texto: 'Galería'},
  {href: '#eventos', texto: 'Eventos'},
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

  // Con el menú móvil abierto, el fondo no debe poder desplazarse.
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
            ? 'bg-arena/88 shadow-(--shadow-suave) backdrop-blur-xl'
            : 'bg-gradient-to-b from-black/35 to-transparent'
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-[4.5rem] sm:px-8">
          <a
            href="#inicio"
            className={`font-display text-[1.35rem] leading-none font-semibold tracking-tight transition-colors ${
              solida ? 'text-tinta' : 'text-white'
            }`}
          >
            Sol de Bambú
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {ENLACES.map((e) => (
              <a
                key={e.href}
                href={e.href}
                className={`text-sm font-medium transition-colors ${
                  solida ? 'text-tinta-2 hover:text-terracota' : 'text-white/85 hover:text-white'
                }`}
              >
                {e.texto}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={enlaceWhatsApp(MENSAJES.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-whatsapp hover:bg-whatsapp-hover inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-white transition-colors sm:px-5"
            >
              <IconoWhatsApp size={17} />
              <span className="hidden sm:inline">Reservar</span>
            </a>

            <button
              type="button"
              onClick={() => setAbierta(true)}
              aria-label="Abrir menú"
              className={`-mr-1 p-2 lg:hidden ${solida ? 'text-tinta' : 'text-white'}`}
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </header>

      {/* Menú móvil: pantalla completa, sin animaciones que estorben */}
      {abierta && (
        <div className="bg-arena fixed inset-0 z-60 flex flex-col lg:hidden">
          <div className="flex h-16 items-center justify-between px-5">
            <span className="font-display text-tinta text-[1.35rem] font-semibold">
              Sol de Bambú
            </span>
            <button
              type="button"
              onClick={() => setAbierta(false)}
              aria-label="Cerrar menú"
              className="text-tinta -mr-1 p-2"
            >
              <X size={22} />
            </button>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-2 px-8 pb-24">
            {ENLACES.map((e) => (
              <a
                key={e.href}
                href={e.href}
                onClick={() => setAbierta(false)}
                className="font-display text-tinta hover:text-terracota border-arena-3/60 border-b py-4 text-3xl transition-colors"
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
