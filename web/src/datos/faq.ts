/**
 * Solo preguntas que se pueden responder con información confirmada.
 * Las que faltan están abajo en PENDIENTES, listas para completar.
 */

export type Pregunta = {pregunta: string; respuesta: string};

export const FAQ: Pregunta[] = [
  {
    pregunta: '¿Cómo reservo?',
    respuesta:
      'Escríbenos por WhatsApp con la fecha y cuántos son. Te confirmamos disponibilidad ' +
      'y la tarifa final en el momento. No hace falta crear ninguna cuenta.',
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
      'Cada cabaña recibe hasta 7 personas. Se pueden tomar una, dos o las tres: con las tres ' +
      'llegan hasta 20 personas y la propiedad queda entera para el grupo.',
  },
  {
    pregunta: '¿Cómo es cada cabaña por dentro?',
    respuesta:
      'En la planta baja hay una sala con sillones, dos dormitorios matrimoniales y baño. ' +
      'Una escalera de bambú sube al altillo, bajo el techo a dos aguas, donde hay tres camas más.',
  },
  {
    pregunta: '¿Tengo que llevar algo para la parrilla o el horno?',
    respuesta:
      'Sí: el carbón para la parrilla y la leña para el horno los trae cada huésped. Es lo único ' +
      'que conviene comprar antes de subir, porque ya en la propiedad no hay dónde.',
  },
  {
    pregunta: '¿Hay alguna regla en el jardín?',
    respuesta:
      'Una sola, y es por el césped: no se permite jugar con globos, pica pica ni nada parecido. ' +
      'Todo lo demás — parlante, piscina, fútbol, fogata — corre por cuenta de ustedes.',
  },
  {
    pregunta: '¿El precio de promoción aplica siempre?',
    respuesta:
      'No en fechas festivas. Además, las estadías cortas (1 y 2 noches, y de 1 a 3 noches si es ' +
      'una sola cabaña) no están disponibles en feriados ni en época de verano, porque en esas ' +
      'fechas se reserva por bloques más largos.',
  },
  {
    pregunta: '¿Dónde queda exactamente?',
    respuesta:
      'En Mala, Cañete, a la altura del km 86 de la Panamericana Sur. Desde Lima son cerca de ' +
      'una hora y cuarto en auto, y desde la propiedad las playas de Totoritas y Bujama quedan ' +
      'a unos quince minutos.',
  },
];

/**
 * ⚠️ PENDIENTE — preguntas que la gente sí hace, pero que no puedo responder
 * sin que el dueño confirme. Se agregan al array de arriba cuando haya dato:
 *
 *   ¿Aceptan mascotas?
 *   ¿Hay que dejar un adelanto para separar la fecha? ¿De cuánto?
 *   ¿Aceptan Yape / Plin / transferencia?
 *   ¿Hay wifi?
 *   ¿Las duchas tienen agua caliente?
 *   ¿Incluye toallas y ropa de cama?
 *   ¿Cuántos autos entran?
 *   ¿Se puede hacer un evento con proveedores externos (catering, DJ)?
 */
