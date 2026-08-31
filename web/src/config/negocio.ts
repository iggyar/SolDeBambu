/**
 * ★ ESTE ES EL ÚNICO ARCHIVO QUE HAY QUE EDITAR PARA PONER LA WEB EN MARCHA.
 *
 * Todo lo que cambia con el negocio vive acá: teléfono, redes, ubicación.
 * Ningún componente tiene datos escritos a mano.
 */

export const NEGOCIO = {
  nombre: 'Sol de Bambú',

  /**
   * Número de WhatsApp de reservas, en formato internacional: solo dígitos,
   * sin "+" ni espacios. El 51 del principio es el código de Perú.
   * Todos los botones de la página apuntan acá.
   */
  whatsapp: '51965706432',
  whatsappEsPlaceholder: false,

  /** Cómo se muestra el número en el footer. Actualizar junto con el de arriba. */
  telefonoVisible: '+51 965 706 432',

  ubicacion: {
    distrito: 'Mala',
    provincia: 'Cañete',
    region: 'Lima',
    referencia: 'Km 86 de la Panamericana Sur',
    /** Versión corta, para el sobretítulo del hero, donde el espacio es de una línea. */
    referenciaCorta: 'Km 86 Panamericana Sur',
    desdeLima: '1 hora y 15 minutos',
    coordenadas: {lat: -12.643576, lng: -76.628338},
    /** Link corto de la ficha de Google Maps de la propiedad. */
    googleMaps: 'https://maps.app.goo.gl/i6i8R6WYBqrAnaMS7',
  },

  horarios: {
    ingreso: '11:00 a. m.',
    salida: '6:00 p. m.',
  },

  capacidad: {
    cabanas: 3,
    porCabana: 7,
    total: 20,
  },

  /** Precio ancla que se repite en el hero y en la barra móvil. */
  precioDesde: 530,

  /**
   * La foto protagonista del hero, y su máscara de oclusión.
   *
   * Para cambiarla: deja la foto nueva en la carpeta SolBambu, agrégala al
   * MAPA de scripts/optimizar-fotos.mjs, y corre
   *   npm run fotos && npm run mascara -- <nombre-nuevo>
   * Después cambia el nombre acá. Nada más.
   */
  hero: {
    foto: 'piscina-quincho',
    alt: 'La piscina de Sol de Bambú al atardecer, con los toldos de madera, el comedor techado y los cerros de Mala al fondo',
    /**
     * Dónde cae la línea del horizonte de esa foto, en fracción de alto.
     * Es lo que decide cuánto se hunde el wordmark detrás del paisaje: si
     * cambias la foto del hero, mira la revisión que deja el generador de
     * máscara y ajusta este número.
     */
    horizonte: 0.47,
  },

  reseñasGoogle: {
    /** ⚠️ PENDIENTE de confirmar con la ficha real. */
    puntaje: 5.0,
    total: 5,
    enlace: 'https://maps.app.goo.gl/i6i8R6WYBqrAnaMS7',
  },

  /** ⚠️ PENDIENTE — poner en null las que no existan; el footer las oculta solo. */
  redes: {
    instagram: null as string | null,
    tiktok: null as string | null,
    facebook: null as string | null,
  },
} as const;
