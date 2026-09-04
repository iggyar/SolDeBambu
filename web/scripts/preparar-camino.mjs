/**
 * Convierte el video del camino en cuadros WebP para recorrerlo con el scroll.
 *
 * Existe por la misma razon que el del atardecer: buscar dentro de un <video>
 * con currentTime va a tirones. Acá el sintoma fue extremo —el archivo traia UN
 * cuadro clave en 145, asi que cada paso del scroll obligaba a decodificar
 * decenas de cuadros— pero incluso reencodeado con todos los cuadros en clave
 * el recorrido sigue pasando por la tuberia de medios del navegador, que no
 * esta hecha para ir y venir a la velocidad del dedo. Dibujar una imagen ya
 * decodificada en un canvas si lo esta.
 *
 * El camino lleva mas cuadros que el atardecer aunque dure menos: alli la
 * camara esta fija y lo unico que cambia es la luz, aca la camara AVANZA, y
 * entre un cuadro y el siguiente se mueve la escena entera. Con pocos cuadros
 * se ve a saltos.
 *
 * Requiere ffmpeg en el PATH.
 *
 * Uso:
 *   node scripts/preparar-camino.mjs medios/recorrido-sol-de-bambu.mp4
 */
import {generarCuadros} from './lib/cuadros.mjs';

// El video vive en `medios/` y no en `public/`: es el ORIGEN de los cuadros,
// no algo que el navegador tenga que descargar. Dentro de public/ se copiaba
// tal cual al build y viajaban 5 MB que ya nadie pide.
const entrada = process.argv[2] ?? 'medios/recorrido-sol-de-bambu.mp4';

await generarCuadros({
  video: entrada,
  destino: 'public/camino',
  modulo: 'src/datos/camino.generado.ts',
  constante: 'CAMINO',
  titulo: 'Los cuadros del camino que recorre el scroll, en dos tamaños.',
  // El ancho es el NATIVO del video (1280): subir de ahi solo agranda el
  // archivo sin agregar un pixel de informacion, y quedarse por debajo tira
  // resolucion que el video si tiene. Estaba en 1152 —un 10% de pixeles
  // regalados— y ademas a calidad 74, que sobre una toma en movimiento se veia
  // blanda. Con 1280 y 90 el cuadro llega entero.
  juegos: [
    {nombre: 'ruta', cuadros: 72, ancho: 1280, calidad: 90},
    // El movil recorta al centro: el cuadro es 16:9 y la pantalla es vertical,
    // asi que a `cover` solo se veria la franja del medio. Recortando en el
    // encoder, los pixeles se gastan en lo que de verdad se va a ver.
    //
    // El recorte es 540x720 —vertical, tomando el alto completo del video— y
    // no un cuadrado: sale del original pixel a pixel, sin reescalar, y sobre
    // una pantalla de 390x844 deja ver el 62% del ancho. El cuadrado de 720
    // que habia antes se encogia a 540 (perdiendo un cuarto de la resolucion
    // que si estaba) y encima recortaba casi la mitad del ancho al mostrarse.
    {nombre: 'ruta-mov', cuadros: 44, ancho: 540, calidad: 88, recorte: '540:720:370:0'},
  ],
});
