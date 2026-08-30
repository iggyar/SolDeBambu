import {FOTOS} from '@/datos/fotos.generado';

type Props = {
  nombre: string;
  alt: string;
  /** Cuánto espacio ocupa la foto en pantalla; el navegador elige el archivo con esto. */
  sizes: string;
  className?: string;
  /** Solo para la foto del hero: la descarga sin esperar y con prioridad alta. */
  prioridad?: boolean;
};

/**
 * Sirve una foto con el srcset real que existe en disco (ver fotos.generado.ts)
 * y con width/height puestos, para que el navegador reserve el hueco antes de
 * descargarla y la página no salte mientras carga.
 */
export function Foto({nombre, alt, sizes, className, prioridad = false}: Props) {
  const medidas = FOTOS[nombre];
  if (!medidas) {
    console.warn(`Foto desconocida: ${nombre}`);
    return null;
  }

  const mayor = medidas.anchos[medidas.anchos.length - 1];

  return (
    <img
      src={`/fotos/${nombre}-${mayor}.webp`}
      srcSet={medidas.anchos.map((a) => `/fotos/${nombre}-${a}.webp ${a}w`).join(', ')}
      sizes={sizes}
      alt={alt}
      width={mayor}
      height={Math.round(mayor * medidas.proporcion)}
      loading={prioridad ? 'eager' : 'lazy'}
      fetchPriority={prioridad ? 'high' : 'auto'}
      decoding="async"
      className={className}
    />
  );
}
