import {useState} from 'react';
import {Bambusal} from '@/componentes/ambiente/Bambusal';
import {Boton} from '@/componentes/ui/Boton';
import {PilaArrastrable} from '@/componentes/ui/PilaArrastrable';
import {Aparece, Etiqueta} from '@/componentes/ui/Seccion';
import {EXPERIENCIA} from '@/datos/experiencia';
import {enlaceWhatsApp, MENSAJES} from '@/lib/whatsapp';

/**
 * QUÉ INCLUYE.
 *
 * Empezó siendo diez amenidades con su ícono en una grilla: diez cosas del
 * mismo tamaño y del mismo peso, o sea ninguna. Después fueron seis en una
 * lista editorial a la derecha que mandaba sobre una fotografía a la izquierda.
 * Ahora la lista tampoco está, y la sección es una sola cosa centrada: las seis
 * fotos repartidas sobre la mesa, con su nombre escrito debajo de cada una.
 *
 * ── Por qué se fue la lista ──────────────────────────────────────────────
 * Porque decía dos veces lo mismo. El nombre de cada área ya está impreso en su
 * propia carta, así que la columna de la derecha repetía los seis títulos y
 * añadía una línea de detalle — y para leer esa línea había que dejar de mirar
 * las fotos, que es justamente lo que la sección viene a hacer. Con una sola
 * pieza centrada no hay que elegir dónde mirar.
 *
 * El detalle largo de cada área no se perdió: sigue en el FAQ, que es donde
 * alguien lo busca cuando lo busca.
 */
export function Experiencia() {
  // Cuál carta va encima. Lo único que la mueve es agarrarla: sin la lista de
  // al lado ya no hay nada más que pueda pedir el frente.
  const [activa, setActiva] = useState(0);

  return (
    <section id="areas" className="textura-grano bg-cielo recorta relative">
      <Bambusal />

      <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <Aparece className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <Etiqueta className="text-tierra mb-6">Todo incluido</Etiqueta>
          <h2 className="titular text-tinta mx-auto max-w-[20ch] text-center">
            Todo esto es de ustedes mientras estén.
          </h2>
          <p className="bajada text-tinta-2 mx-auto mt-7 text-center">
            No se comparte con nadie: mientras dura la reserva, la propiedad entera es del grupo.
            El agua, la luz y el mantenimiento van incluidos, y los ambientes se entregan limpios.
          </p>
        </Aparece>

        {/* La mesa. Ocupa el centro y nada compite con ella: es la sección
            entera, no la mitad izquierda de una sección. */}
        <div className="mx-auto mt-14 w-full max-w-4xl md:mt-20">
          <PilaArrastrable
            cartas={EXPERIENCIA.map((e) => ({
              clave: e.foto,
              titulo: e.titulo,
              foto: e.foto,
            }))}
            activa={activa}
            onActivar={setActiva}
            cierre="Todo esto para ti."
          />
          <p className="mono text-tinta-3 mt-7 text-center text-[0.72rem]">
            Arrastra las fotos
          </p>
        </div>

        {/* Primer CTA de reserva de la página después del hero: cierra el
            bloque de "qué es y qué incluye", que es donde alguien ya sabe
            lo suficiente como para preguntar. */}
        <Aparece className="mt-16" demora={0.08}>
          <div className="flex flex-col items-center gap-4 text-center">
            <Boton href={enlaceWhatsApp(MENSAJES.general)} variante="sol-dia">
              Consultar disponibilidad
            </Boton>
            <p className="text-tinta-2 text-[0.95rem]">
              La consulta se continúa directamente por WhatsApp.
            </p>
          </div>
        </Aparece>
      </div>
    </section>
  );
}
