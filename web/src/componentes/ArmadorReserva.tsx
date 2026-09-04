import {Clock, MapPin, Minus, Plus} from 'lucide-react';
import {useMemo, useState} from 'react';
import {IconoWhatsApp} from '@/componentes/ui/IconoWhatsApp';
import {Aparece, Etiqueta} from '@/componentes/ui/Seccion';
import {Footer} from '@/componentes/Footer';
import {NEGOCIO} from '@/config/negocio';
import {enlaceWhatsApp, MENSAJES} from '@/lib/whatsapp';
import {cabanasSugeridas, capacidadDeCabanas, finesDeSemana, proximosMeses} from '@/lib/reserva';

/**
 * EL CIERRE.
 *
 * Antes acá había un botón suelto sobre una foto que abría WhatsApp con un
 * mensaje genérico. La fricción real de reservar no es encontrar el botón: es
 * tener que redactar. Quien llega al chat con "hola, información" recibe cinco
 * preguntas de vuelta y la mitad de las veces no contesta.
 *
 * Esto arma el mensaje por el huésped. No es un formulario y no hay que
 * completarlo: cada dato es opcional y el botón funciona vacío. Tampoco hay
 * calendario real porque no hay disponibilidad que consultar — pedir una fecha
 * exacta prometería una precisión que el sistema no tiene.
 *
 * Sin precios en ninguna parte: es una restricción del producto, no un olvido.
 */

function Chip({
  activo,
  children,
  ...props
}: {
  activo: boolean;
  children: React.ReactNode;
} & React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      className={`pulsable min-h-11 rounded-xl border px-4 py-2.5 text-[0.88rem] transition-colors duration-200 ease-(--ease-suave) ${
        activo
          ? 'border-sol bg-sol text-noche font-semibold'
          : 'border-filete text-bruma-2 hover:border-bruma-3 hover:text-crema'
      } disabled:cursor-not-allowed disabled:opacity-30`}
      {...props}
    >
      {children}
    </button>
  );
}

function Campo({titulo, children}: {titulo: string; children: React.ReactNode}) {
  return (
    <div>
      <p className="mono text-bruma-3 mb-3.5 text-[0.72rem]">{titulo}</p>
      {children}
    </div>
  );
}

/**
 * UN DATO DE CONTACTO. Icono en su placa, etiqueta arriba y el dato debajo.
 *
 * Los tres que hay son los tres que existen de verdad: el WhatsApp, dónde
 * queda y a qué hora se entra y se sale. La referencia traía además un correo
 * y no se inventa uno — un canal de contacto falso es peor que uno de menos.
 * Cuando haya, entra aquí con su icono y ya.
 */
function DatoContacto({
  icono,
  etiqueta,
  children,
  href,
}: {
  icono: React.ReactNode;
  etiqueta: string;
  children: React.ReactNode;
  href?: string;
}) {
  const cuerpo = (
    <>
      <span className="dato-contacto__placa">{icono}</span>
      <span className="min-w-0">
        <span className="mono text-bruma-3 block text-[0.72rem]">{etiqueta}</span>
        <span className="text-crema mt-1 block text-[0.95rem] leading-snug font-medium">
          {children}
        </span>
      </span>
    </>
  );

  // Los que llevan a algún sitio son enlaces de verdad; el horario no lleva a
  // ninguna parte y por tanto no finge ser pulsable.
  return href ? (
    <a
      href={href}
      {...(href.startsWith('http') ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
      className="dato-contacto pulsable"
    >
      {cuerpo}
    </a>
  ) : (
    <div className="dato-contacto">{cuerpo}</div>
  );
}

export function ArmadorReserva() {
  const meses = useMemo(proximosMeses, []);
  const [mes, setMes] = useState<string | null>(null);
  const [semana, setSemana] = useState<string | null>(null);
  const [personas, setPersonas] = useState<number | null>(null);
  /** null = todavía la decide el número de personas; un número = lo eligió a mano. */
  const [cabanasManual, setCabanasManual] = useState<number | null>(null);

  const mesElegido = meses.find((x) => x.clave === mes);
  const semanas = useMemo(() => (mesElegido ? finesDeSemana(mesElegido) : []), [mesElegido]);
  const sugerida = cabanasSugeridas(personas);
  const cabanas = cabanasManual ?? sugerida;

  const cuando = useMemo(() => {
    if (!mesElegido) return undefined;
    const finde = semanas.find((x) => x.clave === semana);
    return finde?.frase ?? mesElegido.nombre;
  }, [mesElegido, semana, semanas]);

  const cambiarPersonas = (siguiente: number | null) => {
    setPersonas(siguiente);
    const minimo = cabanasSugeridas(siguiente);
    if (cabanasManual && minimo && cabanasManual < minimo) setCabanasManual(null);
  };

  const vacio = !cuando && !personas && !cabanas;
  const mensaje = vacio
    ? MENSAJES.general
    : MENSAJES.armado({
        cuando,
        personas: personas ?? undefined,
        cabanas: cabanas ?? undefined,
      });

  return (
    <section id="reservar" className="recorta relative">
      {/* Aquí vivía una fotografía de la cabaña de noche al 60% de opacidad,
          con un velo encima que la iba dejando asomar hacia abajo. Se fueron
          las dos, y el motivo se midió: la foto arrancaba exactamente en el
          borde superior de la sección, y el velo no llegaba a taparla del todo
          ahí, así que la costura con las preguntas de arriba tenía a un lado
          azul liso y al otro azul con foto. Esa era la raya delgada.

          Comprobado apagando solo la foto: con ella oculta el color queda
          perfectamente uniforme de un lado al otro de la costura.

          De paso se van dos capas del alto entero de la sección —2.08
          megapíxeles cada una, la foto y el degradado que la sujetaba— en la
          sección más alta de la página. Lo que se pierde es una textura que
          apenas se adivinaba bajo el velo; lo que se gana es que el cierre de
          la página tenga el mismo azul liso que sus vecinas, sin línea. */}

      {/* DOS TARJETAS: quién somos a la izquierda, qué eliges a la derecha.
          El titular se mudó ADENTRO de la tarjeta izquierda. Suelto y a lo
          ancho hacía de portada de la sección y empujaba el armador media
          pantalla más abajo; dentro de la tarjeta es lo que encabeza la
          columna de contacto, y las dos mitades del cierre —quiénes somos y
          qué eliges— quedan a la misma altura y a la vista a la vez.

          `items-stretch` (el reposo de la grilla) es lo que iguala el alto de
          las dos tarjetas, y por eso la izquierda reparte su contenido con
          `justify-between`: el aire sobrante se va al medio, entre el texto y
          los datos, en vez de dejar la tarjeta corta al lado de la otra. */}
      <div className="relative mx-auto max-w-6xl px-5 pt-28 pb-12 sm:px-8 md:pt-36 md:pb-16">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-8">
          <Aparece className="desde-izq panel-vidrio flex flex-col justify-between gap-12 p-9 sm:p-11">
            <div>
              <Etiqueta className="text-sol mb-6">Reservar</Etiqueta>
              <h2 className="titular text-crema">El próximo atardecer puede ser tuyo.</h2>
              <p className="bajada text-bruma-2 mt-6">
                Elige mes y grupo y el chat se abre con la consulta ya escrita. No hace falta
                completar nada: si prefieres, escríbenos directo.
              </p>
            </div>

            <div className="grid gap-5">
              <DatoContacto
                icono={<IconoWhatsApp size={17} />}
                etiqueta="WhatsApp"
                href={enlaceWhatsApp(MENSAJES.general)}
              >
                {NEGOCIO.telefonoVisible}
              </DatoContacto>
              <DatoContacto
                icono={<MapPin size={17} strokeWidth={1.9} />}
                etiqueta="Dónde"
                href={NEGOCIO.ubicacion.googleMaps}
              >
                {NEGOCIO.ubicacion.referencia}
                <span className="text-bruma-2 block font-normal">
                  {NEGOCIO.ubicacion.distrito}, {NEGOCIO.ubicacion.provincia}
                </span>
              </DatoContacto>
              <DatoContacto icono={<Clock size={17} strokeWidth={1.9} />} etiqueta="Horarios">
                Ingreso {NEGOCIO.horarios.ingreso} · salida {NEGOCIO.horarios.salida}
              </DatoContacto>
            </div>
          </Aparece>

          <Aparece
            demora={0.1}
            className="desde-der panel-vidrio grid content-start gap-8 p-8 sm:p-10"
          >
            <Campo titulo="¿Qué mes?">
              <div className="flex flex-wrap gap-2">
                {meses.map((m) => (
                  <Chip
                    key={m.clave}
                    activo={mes === m.clave}
                    onClick={() => {
                      setMes(mes === m.clave ? null : m.clave);
                      setSemana(null);
                    }}
                  >
                    {m.etiqueta}
                  </Chip>
                ))}
              </div>
            </Campo>

            {/* La semana solo aparece cuando ya hay mes: preguntar "qué finde" sin
              mes es pedir un dato que no significa nada todavía. */}
            {mes && semanas.length > 0 && (
              <Campo titulo="¿Qué fin de semana? (opcional)">
                <div className="flex flex-wrap gap-2">
                  {semanas.map((s) => (
                    <Chip
                      key={s.clave}
                      activo={semana === s.clave}
                      onClick={() => setSemana(semana === s.clave ? null : s.clave)}
                    >
                      {s.etiqueta}
                    </Chip>
                  ))}
                </div>
              </Campo>
            )}

            <Campo titulo="¿Cuántos son?">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  aria-label="Quitar una persona"
                  disabled={!personas || personas <= 1}
                  onClick={() => cambiarPersonas(personas && personas > 1 ? personas - 1 : null)}
                  className="pulsable border-filete text-crema hover:border-bruma-3 flex h-11 w-11 items-center justify-center rounded-full border transition-colors disabled:opacity-30"
                >
                  <Minus size={17} />
                </button>
                <p className="min-w-[7.5rem] text-center">
                  <span className="titular-chico text-crema block tabular-nums">
                    {personas ?? '—'}
                  </span>
                  <span className="mono text-bruma-3 mt-1 block text-[0.72rem]">
                    {personas === 1 ? 'persona' : 'personas'}
                  </span>
                </p>
                <button
                  type="button"
                  aria-label="Agregar una persona"
                  disabled={personas === NEGOCIO.capacidad.total}
                  onClick={() =>
                    cambiarPersonas(Math.min((personas ?? 0) + 1, NEGOCIO.capacidad.total))
                  }
                  className="pulsable border-filete text-crema hover:border-bruma-3 flex h-11 w-11 items-center justify-center rounded-full border transition-colors disabled:opacity-30"
                >
                  <Plus size={17} />
                </button>
              </div>
            </Campo>

            <Campo titulo="¿Cuántas cabañas?">
              <div className="flex flex-wrap items-center gap-2">
                {[1, 2, 3].map((n) => (
                  <Chip
                    key={n}
                    activo={cabanas === n}
                    disabled={personas !== null && capacidadDeCabanas(n) < personas}
                    onClick={() => setCabanasManual(cabanasManual === n ? null : n)}
                  >
                    {n === 1 ? '1 cabaña' : `${n} cabañas`}
                  </Chip>
                ))}
                <span className="text-bruma-3 ml-1 text-[0.82rem]">
                  {cabanas
                    ? `hasta ${capacidadDeCabanas(cabanas)} personas`
                    : 'las que hagan falta'}
                </span>
              </div>
            </Campo>

            {/* Ver el mensaje antes de mandarlo quita el miedo a tocar el botón:
              nadie abre WhatsApp a ciegas sin saber qué va a enviar. */}
            <div className="border-filete border-t pt-6">
              <p className="mono text-bruma-3 mb-3 text-[0.72rem]">Se va a enviar</p>
              <p className="text-bruma-2 text-[0.95rem] leading-relaxed italic">«{mensaje}»</p>
            </div>

            {/* El CTA más grande de la página: ancho completo, y el único con
              tipografía de un rem. Es el final del recorrido. */}
            <a
              href={enlaceWhatsApp(mensaje)}
              target="_blank"
              rel="noopener noreferrer"
              className="boton boton-sol boton-grande pulsable"
            >
              <IconoWhatsApp size={19} className="flex-none" />
              <span>Consultar disponibilidad</span>
            </a>
          </Aparece>
        </div>
      </div>

      {/* Un solo cierre y una sola fotografía. El footer forma parte de esta
          misma escena para que la cabaña no vuelva a empezar a mitad de página. */}
      <Footer />
    </section>
  );
}
