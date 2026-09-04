/**
 * Convierte el video del atardecer en dos juegos de cuadros WebP.
 *
 * La secuencia del scroll no reproduce un video: dibuja un cuadro en un canvas
 * segun donde este el scroll, hacia adelante y hacia atras, a la velocidad del
 * dedo. Es la tecnica de las paginas de producto de Apple, y necesita los
 * cuadros sueltos porque buscar dentro de un <video> con currentTime va a
 * tirones — en Safari de iOS y, medido en esta misma pagina, tambien en
 * escritorio.
 *
 * El motor vive en lib/cuadros.mjs, compartido con el camino: lo unico propio
 * de cada secuencia son los numeros.
 *
 * Requiere ffmpeg en el PATH.
 *
 * Uso:
 *   node scripts/preparar-secuencia.mjs medios/atardecer-sol-de-bambu.mp4
 */
import {generarCuadros} from './lib/cuadros.mjs';

const entrada = process.argv[2] ?? 'medios/atardecer-sol-de-bambu.mp4';

await generarCuadros({
  video: entrada,
  destino: 'public/secuencia',
  modulo: 'src/datos/secuencia.generado.ts',
  constante: 'SECUENCIA',
  titulo: 'Los cuadros del atardecer que recorre el scroll, en dos tamaños.',
  // 1280 es el ancho NATIVO del video: subir de ahi solo agranda el archivo sin
  // agregar un pixel de informacion, y bajar tira resolucion que el video si
  // tiene. La calidad estaba en 78 y a pantalla completa se veia blanda; 90
  // mide 0.979 de SSIM contra el cuadro original, contra 0.954 de antes.
  // 72 cuadros y no 48: el clip dura 6 segundos, asi que 48 son 8 por segundo
  // y el paso de la luz se ve escalonado en las nubes, que es donde mas se
  // nota. A 72 son 12 por segundo, y sobre 145 cuadros de origen sigue siendo
  // uno de cada dos — no se inventa nada, se tira menos.
  juegos: [
    {nombre: 'esc', cuadros: 72, ancho: 1280, calidad: 90},
    // El movil recorta: el cuadro es 16:9 y la pantalla es vertical, asi que a
    // `cover` solo se veria la franja central — y ahi no entran ni la luna ni
    // el quincho, que son justo lo que cuenta la escena de noche.
    {nombre: 'mov', cuadros: 44, ancho: 540, calidad: 88, recorte: '540:720:640:0'},
  ],
});
