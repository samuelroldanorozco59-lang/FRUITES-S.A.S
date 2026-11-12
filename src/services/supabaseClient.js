import { createClient } from '@supabase/supabase-js';

/**
 * ============================================================================
 * CLIENTE DE SUPABASE — FRUITES
 * ============================================================================
 * Valida de forma estricta las variables de entorno:
 * - VITE_SUPABASE_URL
 * - VITE_SUPABASE_ANON_KEY
 * 
 * Si las credenciales no son URLs válidas o están ausentes/incompletas,
 * la aplicación entra de manera 100% segura en "Modo Demostración" sin lanzar
 * excepciones ni romper la carga de la página.
 * ============================================================================
 */

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function isValidSupabaseConfig(url, key) {
  if (!url || typeof url !== 'string' || !key || typeof key !== 'string') {
    return false;
  }

  const cleanUrl = url.trim();
  const cleanKey = key.trim();

  if (!cleanUrl || !cleanKey) return false;

  // Filtrar valores de plantilla o ejemplos
  if (
    cleanUrl === 'https://tu-proyecto.supabase.co' ||
    cleanUrl.includes('TU_PROYECTO') ||
    cleanUrl.includes('example.com') ||
    cleanKey === 'tu-clave-anon-publica'
  ) {
    return false;
  }

  // Verificar que sea una URL HTTP/HTTPS bien formada
  try {
    const parsed = new URL(cleanUrl);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

let client = null;
export const isConfigured = isValidSupabaseConfig(rawUrl, rawKey);

if (isConfigured) {
  try {
    client = createClient(rawUrl.trim(), rawKey.trim());
  } catch (err) {
    console.warn('No se pudo inicializar Supabase, activando Modo Demostración:', err);
    client = null;
  }
}

// Cliente exportado (null en modo demo)
export const supabase = client;

// Indicador booleano de modo demostración
export const isDemoMode = !client;
