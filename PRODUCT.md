# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Familias y grupos de amigos de Lima que buscan una escapada de fin de semana
fuera de la ciudad. Llegan en auto, en grupo de entre seis y veinte personas, y
deciden rápido: miran la propiedad, calculan si entran todos y escriben. Es el
público que la página tiene que convencer primero.

La ficha de la propiedad también ofrece la casa para actividades de integración
de empresas y para celebraciones (cumpleaños, aniversarios, despedidas), y el
sitio ya tiene un mensaje de WhatsApp para cotizar eventos. Son audiencias
reales pero secundarias: no ordenan la página.

## Product Purpose

Conseguir que un grupo escriba por WhatsApp con una fecha y un número de
personas. La web no reserva, no cobra y no crea cuentas: su único trabajo es
que alguien que nunca vio el lugar entienda qué es, se lo imagine con su
gente adentro, y abra el chat. El éxito se mide en conversaciones iniciadas,
no en tiempo de permanencia.

## Positioning

La propiedad entera se entrega a un solo grupo. No es un hotel donde se alquila
una habitación entre desconocidos: son tres cabañas, una piscina y cinco mil
metros cuadrados de área verde sin vecinos al costado, y el grupo los tiene para
sí mientras esté. A eso se suman dos hechos que un competidor no puede copiar
diciéndolos: el horario (ingreso 11:00 a. m., salida 6:00 p. m. — siete horas
más de día que un hotel convencional) y la distancia (1 h 15 desde Lima, km 86
de la Panamericana Sur, con las playas de Totoritas y Bujama a quince minutos).

## Operating Context

- **Reserva:** cien por ciento por WhatsApp al +51 965 706 432. No hay
  calendario, carrito, formulario ni cuenta de usuario. Cada botón de la página
  abre el chat con el mensaje ya redactado.
- **Descubrimiento:** el tráfico llega por tres vías confirmadas — Instagram y
  TikTok, la ficha de Google Maps con sus reseñas, y recomendación directa de
  huéspedes anteriores. Ninguna domina.
- **Dispositivo:** el celular es el escenario real de uso. Las tres vías de
  entrada son móviles, y la decisión suele tomarse en grupo, pasándose el link
  por chat.
- **Estadía:** el huésped llega en auto, cocina en la propiedad (parrilla, horno
  artesanal, cocina con menaje) y trae su propio carbón y leña. El plan de la
  noche es la fogata.

## Capabilities and Constraints

- Tres cabañas de madera con techo a dos aguas. Las cabañas 1 y 2 reciben hasta
  7 personas cada una; la cabaña 3, hasta 6. Con las tres, hasta 20 personas. Se
  toma una, dos o las tres. **La página no debe afirmar que las tres son
  iguales:** no lo son.
- Cada cabaña: sala, cocina y comedor con menaje incluido, dormitorios y baño
  con ducha abajo; altillo con camas de plaza y media arriba; hamaca afuera.
- Áreas comunes: piscina con sombrillas, parrilla equipada, horno artesanal,
  área de fogata, zona de pérgola, campo de fulbito, espacio para vóley, mesa de
  ping pong, fulbito de mesa, sapito, lavaderos, baños y duchas comunes
  separados por sexo, estacionamiento dentro de la propiedad.
- Incluido en la estadía: consumo de agua, luz y mantenimiento; ambientes
  higienizados con elementos de limpieza; sábanas, colcha y cojín.
- Lo trae el huésped: toallas, artículos de aseo personal, papel higiénico,
  repelente, bloqueador, ropa de baño, carbón para la parrilla y leña para el
  horno.
- Reglas de la casa que la web comunica: ducharse antes de entrar a la piscina,
  no comer ni beber dentro de ella, nada de globos ni pica pica en el jardín, el
  auto se queda en la cochera y no sobre el césped.
- Pet friendly, con la condición de recoger los desechos de la mascota.
- **Restricción durable: la web nunca muestra precios.** Ni tarifario, ni precio
  "desde", ni garantía, ni adelantos, ni penalidades, ni datos estructurados de
  precio. Toda tarifa se conversa por WhatsApp. Esta decisión es permanente y
  ningún trabajo futuro debe revertirla.
- **Sin confirmar** (no inventar ni afirmar): si hay wifi, si las duchas tienen
  agua caliente, si la piscina es temperada, cuántos autos entran en la cochera,
  y si se permiten eventos con proveedores externos (catering, DJ).

## Brand Commitments

- Nombre: **Sol de Bambú**. Ubicación siempre como Mala, Cañete.
- Voz: español peruano, dirigido al grupo en segunda persona plural ("ustedes").
  Frases cortas y concretas, con hechos verificables en lugar de adjetivos de
  folleto. Nada de "experiencia única" ni "paraíso escondido".
- Regla de contenido heredada y vigente: solo se publica lo que está confirmado
  por las fotos, las reseñas o la ficha de la propiedad. Una amenidad inventada
  que después no está es una reseña de tres estrellas esperando a ocurrir.
- Las reseñas de Google se transcriben textualmente, con su autor, sin retocar
  la redacción, y no se usan las fotos que subieron los huéspedes.

## Evidence on Hand

- **Reseñas reales de Google**, transcritas con autor y fecha, en
  `web/src/datos/resenas.ts`. Todas de cinco estrellas.
- **Fotos propias de la propiedad** en `web/public/fotos/`: piscina y quincho,
  cabañas, jardín de palmeras, sala con escalera, altillo, dormitorios, cabaña
  de noche. Hay un pipeline de optimización (`npm run fotos`) y de máscara de
  oclusión para el hero.
- **Ficha oficial de la propiedad**: "INFORMACIÓN cabañas 2026 agosto", con la
  distribución de cada cabaña, las áreas comunes, lo incluido y las reglas.
- **Ubicación verificable**: ficha de Google Maps y coordenadas
  (-12.643576, -76.628338).

Ausencias que ningún trabajo futuro debe rellenar inventando:

- No hay cuentas de Instagram, TikTok ni Facebook enlazadas: están en `null` en
  la configuración, pese a que esas redes sí son un canal de entrada.
- El puntaje de 5.0 y el total de reseñas están marcados como pendientes de
  confirmar contra la ficha real de Google.
- No hay testimonios fuera de Google, ni premios, ni prensa, ni cifras de
  ocupación, ni clientes corporativos nombrables.

## Product Principles

1. **El único llamado a la acción es WhatsApp.** Cualquier paso intermedio entre
   ver la propiedad y escribir es fricción que cuesta una reserva.
2. **Nada de precios en la página.** La conversación de tarifas ocurre en el
   chat, donde se puede preguntar fecha, grupo y noches.
3. **Solo hechos verificables.** Cada afirmación tiene detrás una foto, una
   reseña o la ficha. Lo que no está confirmado se omite, no se suaviza.
4. **El celular es la pantalla real.** Las tres vías de entrada son móviles y la
   decisión se toma pasando el link por chat.
5. **Se vende la propiedad entera, no una habitación.** Lo que hace único al
   lugar es que el grupo lo tiene para sí, con el día completo por delante.
