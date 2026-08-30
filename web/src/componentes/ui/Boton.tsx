import type {ReactNode} from 'react';

type Variante = 'primario' | 'whatsapp' | 'claro' | 'contorno';
type Tamano = 'md' | 'lg';

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variante?: Variante;
  tamano?: Tamano;
  className?: string;
  'aria-label'?: string;
};

const VARIANTES: Record<Variante, string> = {
  // La acción primaria es una sola en toda la página, y es el terracota
  // del OSB de las cabañas.
  primario:
    'bg-terracota text-arena hover:bg-terracota-hover shadow-(--shadow-media) hover:shadow-(--shadow-alta)',
  // El verde de WhatsApp no decora nada más en la página: cuando aparece,
  // significa exactamente "esto abre WhatsApp".
  whatsapp:
    'bg-whatsapp text-white hover:bg-whatsapp-hover shadow-(--shadow-media) hover:shadow-(--shadow-alta)',
  claro: 'bg-arena text-tinta hover:bg-white shadow-(--shadow-media)',
  contorno:
    'border border-white/45 text-white backdrop-blur-sm bg-white/10 hover:bg-white/20 hover:border-white/70',
};

const TAMANOS: Record<Tamano, string> = {
  md: 'px-5 py-3 text-[0.95rem]',
  lg: 'px-7 py-4 text-base',
};

export function Boton({
  children,
  href,
  onClick,
  variante = 'primario',
  tamano = 'md',
  className = '',
  ...resto
}: Props) {
  const clases =
    'inline-flex items-center justify-center gap-2.5 rounded-full font-medium ' +
    'transition-all duration-300 ease-(--ease-suave) active:scale-[0.98] ' +
    `${VARIANTES[variante]} ${TAMANOS[tamano]} ${className}`;

  if (href) {
    const externo = href.startsWith('http');
    return (
      <a
        href={href}
        className={clases}
        {...(externo ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
        {...resto}
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={clases} {...resto}>
      {children}
    </button>
  );
}
