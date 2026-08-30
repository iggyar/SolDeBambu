import {Foto} from '@/componentes/ui/Foto';
import {Aparece, Seccion} from '@/componentes/ui/Seccion';

export function LaPropiedad() {
  return (
    <Seccion id="propiedad">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Aparece>
          <p className="text-terracota mb-3 text-xs font-semibold tracking-[0.18em] uppercase">
            El lugar
          </p>
          <h2 className="text-tinta text-3xl leading-[1.12] sm:text-4xl md:text-[2.9rem]">
            Un valle entero que se apaga temprano.
          </h2>
          <div className="text-tinta-2 mt-6 space-y-5 text-[1.05rem] leading-relaxed">
            <p>
              Sol de Bambú son tres cabañas de techo a dos aguas repartidas sobre un jardín
              abierto de césped y palmeras, en el valle de Mala. No hay recepción, ni pasillos,
              ni otro grupo al lado: quien llega se queda con la piscina, el comedor y el jardín
              para su gente.
            </p>
            <p>
              El día se arma solo. La mañana en el agua, la tarde con la parrilla prendida bajo
              el techo de bambú, y cuando el sol baja detrás de los cerros, la fogata. A esa hora
              se entiende por qué la gente vuelve.
            </p>
          </div>
        </Aparece>

        <Aparece demora={0.12} className="relative">
          <div className="shadow-(--shadow-alta) overflow-hidden rounded-3xl">
            <Foto
              nombre="jardin-palmeras"
              alt="El jardín de césped con palmeras jóvenes y el toldo del área de descanso junto a la piscina"
              sizes="(min-width: 1024px) 45vw, 92vw"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          {/* Segunda foto montada en la esquina: rompe el rectángulo y deja ver
              las cabañas sin gastar una fila entera de la grilla. */}
          <div className="border-arena shadow-(--shadow-alta) absolute -bottom-8 -left-4 hidden w-44 overflow-hidden rounded-2xl border-4 sm:block lg:-left-10 lg:w-52">
            <Foto
              nombre="cabanas-piscina"
              alt="Dos de las cabañas vistas desde el borde de la piscina"
              sizes="220px"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </Aparece>
      </div>
    </Seccion>
  );
}
