/**
 * Solo preguntas que se pueden responder con información confirmada — ahora
 * con lo que aporta la ficha de la propiedad (agosto 2026). Nada de precios,
 * garantías ni condiciones de pago: eso se conversa por WhatsApp.
 * Las que faltan están abajo en PENDIENTES, listas para completar.
 */

export type Pregunta = {pregunta: string; respuesta: string};

export const FAQ: Pregunta[] = [
  {
    pregunta: '¿Cómo reservo?',
    respuesta:
      'Escríbenos por WhatsApp con la fecha y cuántos son. Te confirmamos disponibilidad ' +
      'en el momento. No hace falta crear ninguna cuenta.',
  },
  {
    pregunta: '¿A qué hora puedo llegar y hasta qué hora me quedo?',
    respuesta:
      'El ingreso es a las 11:00 a. m. y la salida a las 6:00 p. m. Son siete horas más de las ' +
      'que da un hotel normal: se aprovecha el día entero, no solo la noche.',
  },
  {
    pregunta: '¿Cuántas personas entran?',
    respuesta:
      'Las cabañas 1 y 2 reciben hasta 7 personas cada una y la cabaña 3 hasta 6. Se pueden ' +
      'tomar una, dos o las tres: con las tres llegan hasta 20 personas y la propiedad queda ' +
      'entera para el grupo.',
  },
  {
    pregunta: '¿Cómo es cada cabaña por dentro?',
    respuesta:
      'En la planta baja hay sala, cocina y comedor con menaje incluido, dormitorios y baño ' +
      'con ducha. Una escalera sube al altillo, bajo el techo a dos aguas, donde hay más ' +
      'camas. Afuera, cada cabaña tiene su hamaca.',
  },
  {
    pregunta: '¿Qué hay para hacer sin salir de la propiedad?',
    respuesta:
      'Piscina con sombrillas, campo de fulbito, espacio para vóley, mesa de ping pong, ' +
      'fulbito de mesa y sapito. Y de noche, el área de fogata, que es donde termina cayendo ' +
      'todo el mundo.',
  },
  {
    pregunta: '¿Aceptan mascotas?',
    respuesta:
      'Sí, la propiedad es pet friendly. Lo único que pedimos es recoger el popó y botarlo ' +
      'en la basura, porque el área verde la usan todos.',
  },
  {
    pregunta: '¿Qué tengo que llevar?',
    respuesta:
      'Toallas, artículos de aseo personal, papel higiénico, repelente, bloqueador y ropa de ' +
      'baño. Las camas ya vienen con sábanas, colcha y cojín. Y para cocinar: el carbón de la ' +
      'parrilla y la leña del horno los trae cada huésped.',
  },
  {
    pregunta: '¿Qué está incluido?',
    respuesta:
      'El consumo de agua, la luz y el mantenimiento. Los ambientes se entregan totalmente ' +
      'higienizados y con elementos de limpieza para que los uses durante la estadía.',
  },
  {
    pregunta: '¿Hay alguna regla en el jardín?',
    respuesta:
      'Tres, y son por el césped y la piscina: nada de globos ni pica pica, ducharse antes de ' +
      'entrar al agua y no comer ni beber dentro de la piscina. El auto se queda en la ' +
      'cochera, no sobre el pasto. Todo lo demás — parlante, fútbol, fogata — corre por ' +
      'cuenta de ustedes.',
  },
  {
    pregunta: '¿Dónde queda exactamente?',
    respuesta:
      'En Mala, Cañete, a la altura del km 86 de la Panamericana Sur. Desde Lima son cerca de ' +
      'una hora y cuarto en auto, y desde la propiedad las playas de Totoritas y Bujama quedan ' +
      'a unos quince minutos. Cerca están también el valle de Azpitia y la bodega Sarcay.',
  },
];

/**
 * ⚠️ PENDIENTE — preguntas que la gente sí hace, pero que no puedo responder
 * sin que el dueño confirme. Se agregan al array de arriba cuando haya dato:
 *
 *   ¿Hay wifi?
 *   ¿Las duchas tienen agua caliente?
 *   ¿La piscina es temperada?
 *   ¿Cuántos autos entran en la cochera?
 *   ¿Se puede hacer un evento con proveedores externos (catering, DJ)?
 */
