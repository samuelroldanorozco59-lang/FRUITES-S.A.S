/**
 * Capa de mapeo bidireccional entre la base de datos Supabase (snake_case)
 * y el código frontend de React (camelCase).
 * Resuelve el hallazgo C-04 de la auditoría técnica.
 */

// --- PRODUCTOS ---
export function mapProductFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    nombre: row.nombre,
    fruta: row.fruta,
    colorPrincipal: row.color_principal || row.colorPrincipal || '#F6C945',
    colorAcento: row.color_acento || row.colorAcento || '#183D32',
    colorSecundario: row.color_secundario || row.colorSecundario || '#FFF4D6',
    descripcionCorta: row.descripcion_corta || row.descripcionCorta || '',
    descripcionLarga: row.descripcion_larga || row.descripcionLarga || '',
    perfilSensorial: row.perfil_sensorial || row.perfilSensorial || {
      sabor: '',
      textura: '',
      aroma: '',
    },
    momentosDeConsumo: row.momentos_consumo || row.momentosDeConsumo || [],
    presentaciones: row.presentaciones || [
      { gramaje: '40g', precio: 9500, disponible: true },
      { gramaje: '80g', precio: 17500, disponible: true },
    ],
    empaque: row.empaque || 'Bolsa stand-up pouch resellable',
    disponible: row.disponible !== false,
    imagen: row.imagen || '/images/mango_pouch.jpg',
    orden: row.orden || 1,
    precio: row.precio || (row.presentaciones && row.presentaciones[0]?.precio) || 9500,
    gramaje: row.gramaje || (row.presentaciones && row.presentaciones[0]?.gramaje) || '40g',
  };
}

export function mapProductToDb(product) {
  if (!product) return {};
  return {
    slug: product.slug,
    nombre: product.nombre,
    fruta: product.fruta,
    color_principal: product.colorPrincipal,
    color_acento: product.colorAcento,
    color_secundario: product.colorSecundario,
    descripcion_corta: product.descripcionCorta,
    descripcion_larga: product.descripcionLarga,
    perfil_sensorial: product.perfilSensorial,
    momentos_consumo: product.momentosDeConsumo,
    presentaciones: product.presentaciones,
    empaque: product.empaque,
    disponible: product.disponible,
    imagen: product.imagen,
    orden: product.orden,
  };
}

// --- TIENDAS / PUNTOS DE VENTA ---
export function mapStoreFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    nombre: row.nombre,
    categoria: row.categoria || 'Café de Especialidad',
    tipo: row.tipo || 'Café',
    direccion: row.direccion,
    barrio: row.barrio || '',
    ciudad: row.ciudad || 'Barranquilla',
    departamento: row.departamento || 'Atlántico',
    pais: row.pais || 'Colombia',
    lat: Number(row.lat) || 0,
    lng: Number(row.lng) || 0,
    telefono: row.telefono || '',
    whatsapp: row.whatsapp || '',
    horario: row.horario || '',
    saboresDisponibles: row.sabores_disponibles || row.saboresDisponibles || [],
    esClienteB2B: row.es_cliente_b2b !== undefined ? row.es_cliente_b2b : (row.esClienteB2B !== false),
    activo: row.activo !== false,
    descripcion: row.descripcion || '',
  };
}

export function mapStoreToDb(store) {
  if (!store) return {};
  return {
    nombre: store.nombre,
    categoria: store.categoria,
    tipo: store.tipo,
    direccion: store.direccion,
    barrio: store.barrio,
    ciudad: store.ciudad,
    departamento: store.departamento,
    pais: store.pais,
    lat: Number(store.lat) || 0,
    lng: Number(store.lng) || 0,
    telefono: store.telefono,
    whatsapp: store.whatsapp,
    horario: store.horario,
    sabores_disponibles: store.saboresDisponibles,
    es_cliente_b2b: store.esClienteB2B,
    activo: store.activo,
    descripcion: store.descripcion,
  };
}

// --- RECETAS & BLOG ---
export function mapRecipeFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    titulo: row.titulo,
    subtitulo: row.subtitulo || '',
    categoria: row.categoria || 'Desayunos & Bowls',
    tiempoPrep: row.tiempo_prep || row.tiempoPrep || '10 min',
    dificultad: row.dificultad || 'Fácil',
    porciones: row.porciones || '1 - 2 personas',
    frutasUsadas: row.frutas_usadas || row.frutasUsadas || [],
    imagen: row.imagen || '/images/recipe_smoothie_bowl.jpg',
    extracto: row.extracto || '',
    ingredientes: row.ingredientes || [],
    pasos: row.pasos || [],
    consejos: row.consejos || '',
    fecha: row.fecha || '',
    publicado: row.publicado !== false,
    autor: row.autor || 'Equipo FRUITES',
  };
}

export function mapRecipeToDb(recipe) {
  if (!recipe) return {};
  return {
    slug: recipe.slug,
    titulo: recipe.titulo,
    subtitulo: recipe.subtitulo,
    categoria: recipe.categoria,
    tiempo_prep: recipe.tiempoPrep,
    dificultad: recipe.dificultad,
    porciones: recipe.porciones,
    frutas_usadas: recipe.frutasUsadas,
    imagen: recipe.imagen,
    extracto: recipe.extracto,
    ingredientes: recipe.ingredientes,
    pasos: recipe.pasos,
    consejos: recipe.consejos,
    fecha: recipe.fecha,
    publicado: recipe.publicado,
    autor: recipe.autor,
  };
}

// --- PEDIDOS (E-COMMERCE) ---
export function mapOrderFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    orderNumber: row.order_number,
    createdAt: row.created_at,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    customerAddress: row.customer_address,
    customerCity: row.customer_city,
    customerDepartment: row.customer_department,
    deliveryNotes: row.delivery_notes,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    shippingCost: Number(row.shipping_cost) || 0,
    subtotal: Number(row.subtotal) || 0,
    discount: Number(row.discount) || 0,
    couponCode: row.coupon_code,
    total: Number(row.total) || 0,
    status: row.status || 'nuevo',
    items: row.items || [],
    adminNotes: row.admin_notes,
  };
}

export function mapOrderToDb(order) {
  if (!order) return {};
  return {
    order_number: order.orderNumber,
    customer_name: order.customerName,
    customer_email: order.customerEmail,
    customer_phone: order.customerPhone,
    customer_address: order.customerAddress,
    customer_city: order.customerCity,
    customer_department: order.customerDepartment,
    delivery_notes: order.deliveryNotes,
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus || 'pendiente',
    shipping_cost: Number(order.shippingCost) || 0,
    subtotal: Number(order.subtotal) || 0,
    discount: Number(order.discount) || 0,
    coupon_code: order.couponCode,
    total: Number(order.total) || 0,
    status: order.status || 'nuevo',
    items: order.items,
    admin_notes: order.adminNotes,
  };
}
