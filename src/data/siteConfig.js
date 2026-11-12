/**
 * ============================================================================
 * FRUITES — CONFIGURACIÓN GENERAL DEL SITIO
 * ============================================================================
 * Este archivo contiene los textos, datos de contacto, enlaces y eslóganes
 * de la marca FRUITES. Puedes cambiar cualquiera de estos valores directamente
 * en este archivo y se actualizará en todo el sitio web automáticamente.
 * ============================================================================
 */

export const siteConfig = {
  // Datos básicos de la marca
  brandName: 'FRUITES',
  tagline: 'Fruta que va contigo.',
  
  // Opciones alternativas de eslogan que puedes probar cuando quieras:
  taglinesAlternative: [
    'Sabor que se mueve contigo',
    'El lado más frutal de tu día',
    'Fruta con otra actitud',
  ],

  // Propuesta de valor central
  valueProposition: 'Snacks de frutas tropicales con presentación moderna, sabores atractivos y formato práctico para disfrutar la fruta en distintos momentos del día.',

  // Ciudad de origen y ámbito
  originCity: 'Barranquilla',
  originCountry: 'Colombia',
  year: new Date().getFullYear(),

  // Datos de contacto oficial
  contact: {
    whatsappNumber: '+57 324 903 7227',
    whatsappClean: '573249037227',
    email: 'contacto@fruites.co',
    instagram: '@fruites.co',
    instagramUrl: 'https://instagram.com/',
    tiktok: '@fruites.co',
    tiktokUrl: 'https://tiktok.com/',
    address: 'Barranquilla, Atlántico, Colombia',
    businessHours: 'Lunes a Viernes: 8:00 a.m. a 5:00 p.m.',
  },

  // Notas de tono y avisos legales obligatorios
  legalFooterNote: 'Información del producto sujeta a la etiqueta final y a la normativa vigente.',
  developmentNote: 'FRUITES se encuentra en etapa de formulación y desarrollo en Barranquilla, Colombia. Las presentaciones, empaques y valores finales están en proceso de verificación.',

  // Declaraciones estratégicas de marca
  brandStory: {
    core: 'La fruta, en otra forma de disfrutarla.',
    history: 'FRUITES nace de una idea sencilla: la fruta puede formar parte de la vida cotidiana de una manera práctica, atractiva y actual. Inspirada en la riqueza tropical colombiana, la marca busca transformar frutas conocidas en una experiencia de snack que combine sabor, diseño y conveniencia. Quiere acompañar a quienes estudian, trabajan, entrenan, viajan o simplemente desean tener una opción diferente a la mano. El Caribe es parte de su origen y de su energía, pero FRUITES está concebida para conectar con personas dentro y fuera de Colombia.',
    purpose: 'Hacer que disfrutar de la fruta sea una opción atractiva y accesible dentro de la rutina cotidiana.',
    mission: 'Desarrollar snacks de frutas tropicales que combinen sabor, conveniencia y una presentación diferenciada.',
    vision: 'Construir una marca colombiana de snacks reconocida por su identidad, calidad y capacidad de innovación, con presencia nacional y posibilidades de expansión internacional.',
    values: [
      {
        title: 'Creatividad',
        description: 'Buscamos formas atractivas y frescas de acercar la fruta a la vida de hoy.',
      },
      {
        title: 'Calidad y honestidad',
        description: 'Hablamos con transparencia de lo que hacemos, cuidando el sabor y la experiencia en cada etapa.',
      },
      {
        title: 'Disfrute cotidiano',
        description: 'Creemos que comer fruta debe ser un placer sencillo, no una obligación.',
      },
      {
        title: 'Autenticidad tropical',
        description: 'Nos mueve la calidez y vitalidad del Caribe colombiano con una mirada global.',
      },
      {
        title: 'Evolución constante',
        description: 'Escuchamos a nuestra comunidad para aprender, mejorar y crear nuevas alternativas.',
      },
    ],
  },

  // Pilares del negocio y producto
  pillars: [
    {
      id: 'producto',
      title: 'Producto atractivo',
      description: 'Cortes seleccionados de frutas tropicales deshidratadas con textura agradable y notas de sabor bien conservadas.',
    },
    {
      id: 'diseno',
      title: 'Diseño diferenciador',
      description: 'Empaque tipo stand-up pouch resellable, coleccionable por sabor, con una identidad visual limpia y contemporánea.',
    },
    {
      id: 'cotidiano',
      title: 'Uso cotidiano',
      description: 'Un formato práctico que cabe en tu bolso, morral o escritorio, listo para abrir, disfrutar y volver a cerrar.',
    },
  ],

  // Momentos de consumo recomendados
  moments: [
    {
      id: 'estudio',
      title: 'Estudio y universidad',
      description: 'Una pausa entre clases con el sabor dulce y práctico de la fruta.',
      icon: 'BookOpen',
    },
    {
      id: 'trabajo',
      title: 'Oficina y home office',
      description: 'El snack ideal para tener al lado del teclado en jornadas largas.',
      icon: 'Briefcase',
    },
    {
      id: 'entrenamiento',
      title: 'Antes o después de moverte',
      description: 'Un bocado frutal y ligero para acompañar tu rutina activa.',
      icon: 'Activity',
    },
    {
      id: 'trayectos',
      title: 'Trayectos y viajes',
      description: 'Fácil de llevar en el carro, en el bus o en tu equipaje sin ensuciar.',
      icon: 'Compass',
    },
    {
      id: 'pausas',
      title: 'Momentos de antojo',
      description: 'Para cuando buscas un sabor diferente para compartir o disfrutar a solas.',
      icon: 'Smile',
    },
  ],

  // Información para negocios (B2B)
  b2b: {
    heroTitle: 'FRUITES en tu punto de venta o empresa',
    heroDescription: 'Diseñado para negocios que buscan una opción de snack atractiva, con empaque moderno y rotación en mostrador.',
    targetAudiences: [
      { title: 'Gimnasios y centros deportivos', description: 'Snacks prácticos para clientes con estilo de vida activo.' },
      { title: 'Cafés y panaderías especiales', description: 'Un complemento perfecto para café o bebidas frías.' },
      { title: 'Tiendas saludables y de conveniencia', description: 'Presentación llamativa que resalta en estantería.' },
      { title: 'Empresas y eventos corporativos', description: 'Opciones de pausas activas o kits de bienvenida.' },
    ],
    steps: [
      { step: '01', title: 'Cuéntanos sobre tu negocio', description: 'Compártenos qué tipo de punto de venta tienes y en qué ciudad te encuentras.' },
      { step: '02', title: 'Te enviamos catálogo y condiciones', description: 'Recibe información detallada de sabores, sugerencias de exhibición y opciones.' },
      { step: '03', title: 'Probamos un lote inicial', description: 'Iniciamos con una cantidad cómoda para validar la acogida de tus clientes.' },
      { step: '04', title: 'Medimos rotación y ajustamos', description: 'Revisamos qué sabores se mueven mejor y programamos abastecimiento continuo.' },
    ],
  },
};
