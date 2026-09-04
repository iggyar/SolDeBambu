import {useEffect, useRef, useState} from 'react';
import {cuadro, SECUENCIA} from '@/datos/secuencia.generado';

/**
 * La bisagra de la página: aquí cae la noche.
 *
 * No es un video reproduciéndose. Son cuadros sueltos dibujados en un canvas
 * según dónde esté el scroll — adelante y atrás, a la velocidad del dedo. Es la
 * técnica de las páginas de producto de Apple, y se hace con cuadros y no con
 * un <video> porque buscar dentro de un video con `currentTime` va a tirones en
 * Safari de iOS, que es justo donde tiene que funcionar.
 *
 * El clip es real: la misma cámara fija sobre la propiedad, del mediodía a la
 * noche. Lo único que cambia es la luz.
 */
export function SecuenciaDiaNoche() {
  const seccion = useRef<HTMLElement>(null);
  const lienzo = useRef<HTMLCanvasElement>(null);
  const imagenes = useRef<HTMLImageElement[]>([]);
  const ultimo = useRef(-1);
  const progresoVisual = useRef<HTMLDivElement>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    const canvas = lienzo.current;
    const el = seccion.current;
    if (!canvas || !el) return;

    // El juego se decide una sola vez, antes de precargar: si no, el celular
    // se descarga los 36 cuadros grandes además de los suyos.
    const juego: 'esc' | 'mov' = window.matchMedia('(min-width: 768px)').matches ? 'esc' : 'mov';
    const total = SECUENCIA[juego].cuadros;
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = canvas.getContext('2d', {alpha: false});
    if (!ctx) return;

    const dibujar = (i: number) => {
      const exacta: HTMLImageElement | undefined = imagenes.current[i];
      const servible = (c?: HTMLImageElement) => !!c?.complete && c.naturalWidth > 0;
      let img: HTMLImageElement | undefined = exacta;
      // Si el cuadro exacto todavía no llegó se pinta el más cercano que sí
      // esté, mirando hacia atrás y TAMBIÉN hacia adelante: los cuadros se
      // descargan en paralelo y no terminan en orden, así que buscar solo
      // hacia atrás dejaba sin nada a quien entraba por el principio de la
      // sección con los cuadros del final ya listos — y un lienzo opaco sin
      // dibujar no es un hueco, es un rectángulo negro a pantalla completa.
      if (!servible(img)) {
        img = undefined;
        for (let d = 1; d < imagenes.current.length && !img; d++) {
          if (servible(imagenes.current[i - d])) img = imagenes.current[i - d];
          else if (servible(imagenes.current[i + d])) img = imagenes.current[i + d];
        }
      }
      if (!img) return false;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Va acá y no al crear el contexto: asignar `canvas.width` reinicia TODO
      // el estado del contexto —transformación, suavizado, estilos—, así que
      // puesto una sola vez al montar se perdía en el primer dibujo. El cuadro
      // es de 1280 y el lienzo puede medir el doble en una pantalla retina, o
      // sea que casi siempre se amplía; Chrome interpola en calidad baja por
      // defecto y sobre una toma fotográfica ampliada eso se ve como lo que
      // es: blando.
      ctx.imageSmoothingQuality = 'high';
      // Equivalente a object-fit: cover, hecho a mano porque el canvas no lo trae.
      const escala = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * escala;
      const dh = img.naturalHeight * escala;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      // El candado se cierra solo si se pintó el cuadro PEDIDO. Con un
      // sustituto en pantalla queda abierto a propósito, para que el siguiente
      // pintado vuelva a intentarlo.
      ultimo.current = img === exacta ? i : -1;
      return true;
    };

    // Precarga diferida. Los cuadros son 650 KB en celular y esta sección está
    // cuatro pantallas más abajo: traerlos al montar es quitarle ancho de banda
    // al hero, que es lo único que la persona está mirando en ese momento. En
    // 4G desde Instagram esa competencia se ve — la piscina aparece tarde.
    //
    // Toda la secuencia espera a que falten dos pantallas para llegar acá. El
    // primer cuadro de escritorio pesa cerca de 100 KB: pedirlo desde el hero
    // competía directamente con el LCP sin aportar nada visible.
    let procesados = 0;

    const cargar = (i: number) => {
      if (imagenes.current[i]) return;
      const img = new Image();
      img.decoding = 'async';
      img.src = cuadro(juego, i);
      // Cada cuadro que llega repinta: si solo repintaran el primero y el
      // último, quien estuviera quieto se quedaría con un sustituto congelado
      // mientras los de en medio van llegando.
      const terminar = () => {
        procesados++;
        // Solo repinta si hay algo que ganar: `ultimo` en -1 significa que en
        // pantalla hay un sustituto esperando al cuadro bueno. Con el cuadro
        // exacto ya puesto, los que sigan llegando no cambian nada de lo que
        // se ve, y cada repintado de más cuesta un recálculo de estilo.
        if (ultimo.current === -1 || ultimo.current === i) calcular();
      };
      img.onload = terminar;
      img.onerror = terminar;
      imagenes.current[i] = img;
    };

    let restoPedido = false;
    const cargarSecuencia = () => {
      for (let i = 0; i < total; i++) cargar(i);
    };

    // Segunda vía de entrada para saltos por ancla y scroll programático. La
    // descarga ocurre por proximidad, nunca porque pasó un temporizador.
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting || restoPedido) return;
        restoPedido = true;
        cargarSecuencia();
        observador.disconnect();
      },
      {rootMargin: '200% 0px'},
    );
    observador.observe(el);

    function calcular() {
      const rect = el!.getBoundingClientRect();

      // Vía alternativa a dos pantallas de distancia. Mantener el evento de
      // scroll junto al observador cubre navegadores y estados suspendidos sin
      // descargar la secuencia cuando nadie se acerca.
      if (!restoPedido && rect.top < window.innerHeight * 2) {
        restoPedido = true;
        cargarSecuencia();
      }

      const recorrido = el!.offsetHeight - window.innerHeight;
      if (recorrido <= 0) return;
      const avance = Math.min(1, Math.max(0, -rect.top / recorrido));
      const i = quieto ? total - 1 : Math.min(total - 1, Math.round(avance * (total - 1)));
      progresoVisual.current?.style.setProperty('transform', `scaleX(${avance})`);
      // El lienzo se destapa cuando hay algo PINTADO, no cuando hay algo
      // descargado: es opaco, y enseñarlo vacío sería un rectángulo negro.
      if (i !== ultimo.current && dibujar(i)) setListo(true);
    }

    // Sin requestAnimationFrame a propósito: el latch que evita encolar dos
    // cuadros solo se libera dentro del callback, y rAF no corre con la pestaña
    // oculta. Dibujar una imagen ya decodificada es barato.
    calcular();
    if (!quieto) window.addEventListener('scroll', calcular, {passive: true});
    window.addEventListener('resize', calcular);
    return () => {
      observador.disconnect();
      window.removeEventListener('scroll', calcular);
      window.removeEventListener('resize', calcular);
    };
  }, []);

  return (
    <section
      ref={seccion}
      id="atardecer"
      // `fondo-hora` y no `bg-cielo`: el fondo propio de esta sección solo se ve
      // por las costuras —una fracción de píxel entre el lienzo pegajoso y lo
      // que sigue, o la franja que asoma en un móvil cuando la barra del
      // navegador aparece y `100svh` deja de medir la pantalla entera—. Con un
      // celeste fijo, eso que asoma es una raya de día contra una página que ya
      // es de noche; con el color de la hora, es exactamente el color que la
      // página tiene en ese momento y la costura deja de existir.
      className="fondo-hora relative h-[260svh] motion-reduce:h-[100svh]"
      aria-label="El atardecer en Sol de Bambú, del mediodía a la noche"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* absolute y no en flujo: si el canvas ocupa su lugar normal, el
            bloque del texto se apila DEBAJO en vez de encima y la cita queda
            fuera de la pantalla. Todo lo que va sobre la imagen tiene que
            superponerse, no seguirla. */}
        <canvas
          ref={lienzo}
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
            listo ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Aquí iban los dos velos que cosían la sección con lo de arriba y lo
            de abajo: un degradado del color de la hora sobre el 46% superior de
            la pantalla y `disuelve-noche` sobre el 38-42% inferior. Los dos
            estaban puestos sobre el LIENZO PEGAJOSO, no sobre las costuras, así
            que no velaban un borde: velaban ocho décimas de la fotografía
            durante todo el recorrido, siempre, y la toma —que es el corazón de
            la página— se veía lavada por arriba y por abajo. Fuera los dos: la
            imagen va a sangre y limpia de punta a punta.

            Lo que se paga es el corte al entrar y al salir. No se nota: arriba
            la galería ya es del color de la hora y el primer cuadro es el mismo
            mediodía; abajo el último cuadro es noche cerrada y la fogata
            arranca en `bg-noche`, el mismo azul. Los dos lados de cada costura
            son el mismo color, que es lo único que los velos estaban
            comprando. */}

        {/* Grano: mata el banding del cielo, que en un WebP comprimido y a
            pantalla completa se nota mucho. No es un velo —es una película al
            5%, la misma que llevan todas las secciones vecinas como `::after`—
            y por eso se queda: sin ella el degradado del cielo se escalona en
            bandas, que es justo lo contrario de limpio. */}
        <div className="textura-grano pointer-events-none absolute inset-0" />

        {/* `sombra-legible` en vez del velo que ya no está: es la misma
            respuesta que el pie del hero le dio al mismo problema. Sin el velo,
            la cita cae sobre el pasto a pleno sol en los primeros cuadros y el
            crema contra el verde no se lee. La sombra viaja pegada a las
            letras, mide unos píxeles y no oscurece ni un centímetro de la
            fotografía. */}
        <div // pb-32 en móvil: la barra fija de reservar mide unos 76px.
          className="sombra-legible relative mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-32 sm:px-8 lg:pb-24">
          <figure className="max-w-2xl">
            <blockquote className="titular text-crema">
              «Una ubicación precisa para maravillarte del atardecer.»
            </blockquote>
            <figcaption className="text-crema/70 mt-5 text-[0.95rem]">
              Jeri Rodríguez, en una reseña de Google
            </figcaption>
          </figure>

          {/* Barra de avance: le dice a la persona que el scroll está moviendo
              la imagen, no que la página se trabó. */}
          <div
            className="mt-10 h-px w-full max-w-xs bg-white/30"
            role="presentation"
            aria-hidden="true"
          >
            <div
              ref={progresoVisual}
              className="bg-sol h-px w-full origin-left scale-x-0 transition-none"
            />
          </div>
          <p className="mono text-crema/75 mt-3 text-[0.72rem]">
            Del mediodía a la noche · sigue bajando
          </p>
        </div>
      </div>
    </section>
  );
}
