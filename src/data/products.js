/**
 * ============================================================================
 * FRUITES — CATÁLOGO OFICIAL DE PRODUCTOS & E-COMMERCE ("Colección Tropical")
 * ============================================================================
 * Snacks de frutas tropicales deshidratadas en bolsa stand-up pouch resellable.
 * Configuración comercial con precios en Pesos Colombianos (COP) y presentaciones.
 * ============================================================================
 */

export const initialProducts = [
  {
    id: 'prod-mango',
    slug: 'mango-tropical',
    nombre: 'Mango Tropical',
    fruta: 'Mango',
    colorPrincipal: '#F6C945', // Amarillo mango
    colorAcento: '#183D32',
    colorSecundario: '#FFF4D6',
    descripcionCorta: 'Tiras de mango deshidratado con dulzor característico y textura suave para disfrutar en cualquier momento.',
    descripcionLarga: 'El clásico indiscutible del trópico colombiano. Cada bocado concentra el sabor cálido y vibrante del mango maduro en láminas fáciles de comer. Ideal para quienes buscan un snack dulce y masticable para tener en el escritorio o en el morral.',
    perfilSensorial: {
      sabor: 'Dulce frutal concentrado con notas florales suaves',
      textura: 'Flexible, suave y agradablemente masticable',
      aroma: 'Fragancia tropical intensa a mango maduro',
    },
    momentosDeConsumo: [
      'Pausa en la oficina o estudio',
      'Antojo dulce a media tarde',
      'Acompañamiento en caminatas o viajes',
    ],
    presentaciones: [
      {
        gramaje: '40g',
        precio: 9500,
        disponible: true,
        descripcion: 'Bolsa personal resellable',
      },
      {
        gramaje: '80g',
        precio: 17500,
        disponible: true,
        descripcion: 'Bolsa dúo para compartir',
      },
    ],
    empaque: 'Bolsa stand-up pouch resellable con zipper hermético',
    disponible: true,
    imagen: '/images/mango_pouch.jpg',
    orden: 1,
    destacado: true,
  },
  {
    id: 'prod-pina',
    slug: 'pina-dorada',
    nombre: 'Piña Dorada',
    fruta: 'Piña',
    colorPrincipal: '#E9B935', // Amarillo dorado
    colorAcento: '#B7C96A',    // Toque verde lima
    colorSecundario: '#FCF5DF',
    descripcionCorta: 'Rodajas de piña deshidratada con balance entre notas ácidas y dulces que despiertan el paladar.',
    descripcionLarga: 'Un estallido refrescante inspirado en la brisa caribeña. La piña deshidratada ofrece una experiencia llena de vitalidad, combinando la acidez natural de la fruta con una dulzura profunda y aromática.',
    perfilSensorial: {
      sabor: 'Equilibrio vibrante entre dulce y un toque ácido cítrico',
      textura: 'Textura elástica y carnosa, agradable al morder',
      aroma: 'Aroma fresco, cítrico y tropical',
    },
    momentosDeConsumo: [
      'Después de una sesión de entrenamiento',
      'Para cortar la rutina en el trabajo',
      'Como toque frutal en mezclas personales o yogures',
    ],
    presentaciones: [
      {
        gramaje: '40g',
        precio: 9500,
        disponible: true,
        descripcion: 'Bolsa personal resellable',
      },
      {
        gramaje: '80g',
        precio: 17500,
        disponible: true,
        descripcion: 'Bolsa dúo para compartir',
      },
    ],
    empaque: 'Bolsa stand-up pouch resellable con zipper hermético',
    disponible: true,
    imagen: '/images/pineapple_pouch.jpg',
    orden: 2,
    destacado: true,
  },
  {
    id: 'prod-papaya',
    slug: 'papaya-caribe',
    nombre: 'Papaya Caribe',
    fruta: 'Papaya',
    colorPrincipal: '#EF775C', // Coral tropical
    colorAcento: '#183D32',
    colorSecundario: '#FDEEE9',
    descripcionCorta: 'Tiras de papaya deshidratada con un tono coral cálido y dulzor delicado, suave al morder.',
    descripcionLarga: 'Una propuesta única y diferenciadora. La papaya adquiere al deshidratarse una textura tierna y un perfil de sabor suave, dulce y reconfortante. Perfecta para quienes buscan sabores más equilibrados y menos invasivos.',
    perfilSensorial: {
      sabor: 'Dulce suave, aterciopelado y agradable',
      textura: 'Textura blanda y dócil',
      aroma: 'Suave y sutil, con notas de fruta tropical reposada',
    },
    momentosDeConsumo: [
      'Al comenzar la mañana o en el desayuno',
      'Entre comidas ligeras',
      'Para disfrutar con una infusión o bebida fría',
    ],
    presentaciones: [
      {
        gramaje: '40g',
        precio: 9500,
        disponible: true,
        descripcion: 'Bolsa personal resellable',
      },
      {
        gramaje: '80g',
        precio: 17500,
        disponible: true,
        descripcion: 'Bolsa dúo para compartir',
      },
    ],
    empaque: 'Bolsa stand-up pouch resellable con zipper hermético',
    disponible: true,
    imagen: '/images/papaya_pouch.jpg',
    orden: 3,
    destacado: false,
  },
  {
    id: 'prod-banano',
    slug: 'banano-crujiente',
    nombre: 'Banano Tropical',
    fruta: 'Banano',
    colorPrincipal: '#DFCC7D', // Tono crema con destello dorado
    colorAcento: '#183D32',
    colorSecundario: '#FAF6E8',
    descripcionCorta: 'Cortes de banano deshidratado con sabor familiar, redondo y reconfortante para el día a día.',
    descripcionLarga: 'La fruta más popular adaptada al ritmo de hoy. Conserva la dulzura natural del banano en un bocado que cabe en cualquier bolsillo y acompaña los momentos de actividad física o trabajo.',
    perfilSensorial: {
      sabor: 'Dulce pleno con notas acarameladas sutiles',
      textura: 'Consistente, agradable y fácil de disfrutar',
      aroma: 'Aroma clásico y cálido a banano maduro',
    },
    momentosDeConsumo: [
      'Antes de salir a entrenar o pedalear',
      'Snack rápido en trayectos largos o transporte',
      'Pausa en la jornada laboral',
    ],
    presentaciones: [
      {
        gramaje: '40g',
        precio: 9500,
        disponible: true,
        descripcion: 'Bolsa personal resellable',
      },
      {
        gramaje: '80g',
        precio: 17500,
        disponible: true,
        descripcion: 'Bolsa dúo para compartir',
      },
    ],
    empaque: 'Bolsa stand-up pouch resellable con zipper hermético',
    disponible: true,
    imagen: '/images/banana_pouch.jpg',
    orden: 4,
    destacado: false,
  },
  {
    id: 'prod-pack-tropical',
    slug: 'pack-tropical-completo',
    nombre: 'Pack Colección Tropical (4 Sabores)',
    fruta: 'Mix 4 Sabores',
    colorPrincipal: '#183D32', // Verde selva insignia
    colorAcento: '#F6C945',
    colorSecundario: '#E8ECE9',
    descripcionCorta: 'Prueba la experiencia completa: 1 bolsa de Mango, 1 de Piña, 1 de Papaya y 1 de Banano con precio especial.',
    descripcionLarga: 'El combo ideal para descubrir cuál es tu sabor favorito o para tener surtido frutal toda la semana. Incluye las cuatro referencias de nuestra Colección Tropical en presentación de 40g cada una en bolsas tipo stand-up pouch resellables.',
    perfilSensorial: {
      sabor: 'Variedad completa desde lo dulce e intenso hasta lo cítrico y suave',
      textura: 'Surtido de texturas suaves, elásticas y carnosas',
      aroma: 'Bouquet completo de frutas del Caribe colombiano',
    },
    momentosDeConsumo: [
      'Para compartir en casa o la oficina',
      'Regalo o detalle gastronómico saludable',
      'Snacks para toda la semana laboral',
    ],
    presentaciones: [
      {
        gramaje: '4x40g (160g total)',
        precio: 34900,
        precioAnterior: 38000,
        disponible: true,
        descripcion: 'Pack completo 4 sabores',
      },
    ],
    empaque: 'Caja coleccionable con 4 stand-up pouches resellables',
    disponible: true,
    imagen: '/images/hero_tropical.jpg',
    orden: 5,
    destacado: true,
    esPack: true,
  },
];

// Próximas líneas en desarrollo (mencionadas discretamente como "Próximamente")
export const upcomingLines = [
  {
    titulo: 'Mezclas Tropicales',
    descripcion: 'Combinaciones armónicas de nuestras frutas en una sola bolsa.',
    estado: 'Próximamente',
  },
  {
    titulo: 'Fruta con Semillas',
    descripcion: 'Texturas crocantes combinadas con frutas deshidratadas.',
    estado: 'Próximamente',
  },
  {
    titulo: 'Ediciones Especiales de Temporada',
    descripcion: 'Exploración con frutas caribeñas de cosecha limitada.',
    estado: 'Próximamente',
  },
];
