import { supabase, isDemoMode } from './supabaseClient.js';

const STORAGE_KEY = 'fruites_demo_messages';

// Mensajes de demostración precargados para que el dueño pueda ver el panel activo en desarrollo
const SEED_MESSAGES = [
  {
    id: 'demo-msg-1',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    nombre: 'Carolina Méndez',
    email: 'carolina.mendez@ejemplo.com',
    whatsapp: '+57 310 456 7890',
    tipo_contacto: 'Negocio',
    nombre_negocio: 'Café & Botánica Barranquilla',
    mensaje: 'Hola equipo FRUITES, nos encantó la presentación de sus snacks. Tenemos dos locales en Barranquilla y quisiéramos conocer condiciones y catálogo para exhibición en mostrador.',
    estado: 'nuevo',
  },
  {
    id: 'demo-msg-2',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    nombre: 'Andrés Felipe Gómez',
    email: 'andres.felipe@ejemplo.co',
    whatsapp: '+57 301 222 3344',
    tipo_contacto: 'Consumidor',
    nombre_negocio: null,
    mensaje: '¡Hola! ¿Tienen fecha estimada para la venta directa al público en Barranquilla? Me interesa probar el sabor a Piña y Mango.',
    estado: 'leido',
  },
];

/**
 * Guarda un mensaje enviado por el formulario de contacto.
 * Resuelve el hallazgo C-02 de la auditoría:
 * - Inserta directamente sin exigir SELECT posterior (evitando error RLS para anónimos).
 * - En modo real (!isDemoMode), si falla la inserción reporta el error y no finge éxito local.
 */
export async function sendContactMessage(formData) {
  // Verificación básica de honeypot anti-spam
  if (formData.honeypot) {
    return { success: true };
  }

  const payload = {
    nombre: formData.nombre.trim(),
    email: formData.email.trim().toLowerCase(),
    whatsapp: formData.whatsapp ? formData.whatsapp.trim() : null,
    tipo_contacto: formData.tipo_contacto || 'Consumidor',
    nombre_negocio: formData.tipo_contacto === 'Negocio' ? (formData.nombre_negocio || '').trim() : null,
    mensaje: formData.mensaje.trim(),
    estado: 'nuevo',
  };

  if (!isDemoMode && supabase) {
    try {
      // Inserción limpia sin .select() ya que los anónimos no tienen permiso SELECT
      const { error } = await supabase
        .from('contact_messages')
        .insert([payload]);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error al enviar mensaje a Supabase:', err);
      return {
        success: false,
        error: 'No se pudo enviar el mensaje por el servidor. Por favor contáctanos directamente a nuestro WhatsApp oficial.',
      };
    }
  }

  // Guardado solo en modo demo (desarrollo local sin credenciales de Supabase)
  const existing = getDemoMessages();
  const newMsg = {
    ...payload,
    id: `demo-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  const updated = [newMsg, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return { success: true, data: newMsg, isDemo: true };
}

/**
 * Obtiene los mensajes para el panel de administración
 */
export async function getContactMessages() {
  if (!isDemoMode && supabase) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn('Error al obtener mensajes de Supabase, usando demo:', err);
    }
  }

  return getDemoMessages();
}

/**
 * Actualiza el estado de un mensaje
 */
export async function updateMessageStatus(id, newStatus) {
  if (!isDemoMode && supabase) {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ estado: newStatus })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error al actualizar estado en Supabase:', err);
      throw err;
    }
  }

  const messages = getDemoMessages();
  const updated = messages.map((m) => (m.id === id ? { ...m, estado: newStatus } : m));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return true;
}

function getDemoMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error al leer mensajes demo:', e);
  }
  return SEED_MESSAGES;
}
