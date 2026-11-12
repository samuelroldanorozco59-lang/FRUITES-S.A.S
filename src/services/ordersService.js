import { supabase, isDemoMode } from './supabaseClient.js';
import { mapOrderFromDb, mapOrderToDb } from './mappers.js';

const STORAGE_KEY = 'fruites_demo_orders';

// Órdenes iniciales de demostración para visualización en el panel
const SEED_ORDERS = [
  {
    id: 'demo-ord-1',
    orderNumber: 'FRT-73912',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    customerName: 'Valentina Restrepo',
    customerEmail: 'valentina.r@ejemplo.com',
    customerPhone: '+57 300 456 7890',
    customerAddress: 'Cra 54 # 75-128, Apto 402',
    customerCity: 'Barranquilla',
    customerDepartment: 'Atlántico',
    deliveryNotes: 'Dejar en portería con el celador de turno',
    paymentMethod: 'contraentrega',
    paymentStatus: 'pendiente',
    shippingCost: 0,
    subtotal: 62900,
    discount: 6290,
    couponCode: 'FRUITES10',
    total: 56610,
    status: 'confirmado',
    items: [
      {
        id: 'prod-pack-tropical-4x40g',
        nombre: 'Pack Colección Tropical (4 Sabores)',
        fruta: 'Mix 4 Sabores',
        gramaje: '4x40g (160g total)',
        precio: 34900,
        quantity: 1,
        imagen: '/images/hero_tropical.jpg',
      },
      {
        id: 'prod-mango-40g',
        nombre: 'Mango Tropical',
        fruta: 'Mango',
        gramaje: '40g',
        precio: 9500,
        quantity: 2,
        imagen: '/images/mango_pouch.jpg',
      },
      {
        id: 'prod-pina-40g',
        nombre: 'Piña Dorada',
        fruta: 'Piña',
        gramaje: '40g',
        precio: 9500,
        quantity: 1,
        imagen: '/images/pineapple_pouch.jpg',
      },
    ],
    adminNotes: 'Confirmado por WhatsApp. Despacho programado para la tarde.',
  },
  {
    id: 'demo-ord-2',
    orderNumber: 'FRT-55104',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    customerName: 'Carlos Mario Peña',
    customerEmail: 'carlos.pena@ejemplo.co',
    customerPhone: '+57 312 998 7711',
    customerAddress: 'Calle 84 # 51B-32',
    customerCity: 'Barranquilla',
    customerDepartment: 'Atlántico',
    deliveryNotes: 'Timbre número 2',
    paymentMethod: 'transferencia',
    paymentStatus: 'verificado',
    shippingCost: 6000,
    subtotal: 35000,
    discount: 0,
    couponCode: null,
    total: 41000,
    status: 'en_preparacion',
    items: [
      {
        id: 'prod-mango-80g',
        nombre: 'Mango Tropical',
        fruta: 'Mango',
        gramaje: '80g',
        precio: 17500,
        quantity: 2,
        imagen: '/images/mango_pouch.jpg',
      },
    ],
    adminNotes: 'Comprobante de Nequi recibido y verificado.',
  },
];

/**
 * Crea y registra un nuevo pedido
 */
export async function createOrder(orderData) {
  const orderNumber = `FRT-${Math.floor(10000 + Math.random() * 90000)}`;
  const orderWithNumber = {
    ...orderData,
    orderNumber,
    createdAt: new Date().toISOString(),
    status: orderData.status || 'nuevo',
  };

  if (!isDemoMode && supabase) {
    try {
      const dbPayload = mapOrderToDb(orderWithNumber);
      const { data, error } = await supabase
        .from('orders')
        .insert([dbPayload])
        .select()
        .single();

      if (error) throw error;
      return { success: true, order: mapOrderFromDb(data) };
    } catch (err) {
      console.error('Error al registrar pedido en Supabase:', err);
      // Si la tabla no existe aún o falla red, guardamos en demo para no perder la venta
    }
  }

  // Guardado en modo local / demo
  const existing = getDemoOrders();
  const demoOrder = {
    ...orderWithNumber,
    id: `ord-${Date.now()}`,
  };
  const updated = [demoOrder, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return { success: true, order: demoOrder, isDemo: true };
}

/**
 * Obtiene todas las órdenes para el panel de administración
 */
export async function getOrders() {
  if (!isDemoMode && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(mapOrderFromDb);
      }
    } catch (err) {
      console.warn('Error al consultar órdenes en Supabase, usando locales:', err);
    }
  }

  return getDemoOrders();
}

/**
 * Obtiene una orden por su número o ID
 */
export async function getOrderById(orderIdentifier) {
  const orders = await getOrders();
  return (
    orders.find(
      (o) =>
        o.id === orderIdentifier ||
        o.orderNumber === orderIdentifier ||
        String(o.orderNumber).toLowerCase() === String(orderIdentifier).toLowerCase()
    ) || null
  );
}

/**
 * Actualiza el estado de una orden
 */
export async function updateOrderStatus(orderId, newStatus) {
  if (!isDemoMode && supabase) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error al actualizar estado de orden en Supabase:', err);
      throw err;
    }
  }

  const orders = getDemoOrders();
  const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return true;
}

function getDemoOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error al leer pedidos demo:', e);
  }
  return SEED_ORDERS;
}
