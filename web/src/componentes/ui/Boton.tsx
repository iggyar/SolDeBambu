import {ArrowRight} from 'lucide-react';
import type {ReactNode} from 'react';
import {IconoWhatsApp} from '@/componentes/ui/IconoWhatsApp';

type Variante = 'sol' | 'sol-dia' | 'linea' | 'linea-dia';

type Props = {
  href: string;
  children: ReactNode;
  variante?: Variante;
  /** Abre en pestaña nueva y agrega el rel seguro. Se enciende solo con wa.me. */
  externo?: boolean;
  /** La flecha que se corre 4px al hover. Se apaga en los CTA de WhatsApp. */
  flecha?: boolean;
  /** Antepone el ícono de WhatsApp. Se enciende solo con los enlaces wa.me. */
  whatsapp?: boolean;
  className?: string;
  tabIndex?: number;
};

const VARIANTES: Record<Variante, string> = {
  sol: 'boton-sol',
  'sol-dia': 'boton-sol boton-sol--dia',
  linea: 'boton-linea',
  'linea-dia': 'boton-linea boton-linea--dia',
};

/**
 * EL BOTÓN, uno solo para toda la página.
 *
 * Antes cada sección redeclaraba su CTA con su propio radio, su propio
 * relleno y su propia transición: catorce botones que se parecían pero no
 * eran el mismo, que es justo lo que hace que una página se lea como un
 * montaje. Acá hay dos variantes —sol y línea— por mitad del día, y el
 * comportamiento (elevación de 2px, flecha que avanza 4px) vive en `.boton`,
 * en el CSS, una sola vez.
 *
 * Los enlaces de WhatsApp se detectan por la URL: nadie tiene que acordarse
 * de pasarle `target` ni `rel` a mano.
 */
export function Boton({
  href,
  children,
  variante = 'sol',
  externo,
  flecha = true,
  whatsapp,
  className = '',
  tabIndex,
}: Props) {
  const esWhatsApp = whatsapp ?? href.startsWith('https://wa.me/');
  const abreFuera = externo ?? (href.startsWith('http') || href.startsWith('tel:'));

  return (
    <a
      href={href}
      tabIndex={tabIndex}
      {...(abreFuera ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
      className={`boton pulsable ${VARIANTES[variante]} ${className}`}
    >
      {esWhatsApp && <IconoWhatsApp size={17} className="flex-none" />}
      <span>{children}</span>
      {flecha && !esWhatsApp && (
        <ArrowRight size={16} strokeWidth={2.1} className="flecha" aria-hidden="true" />
      )}
    </a>
  );
}
