import { initialStores } from '../data/stores.js';
import { supabase, isDemoMode } from './supabaseClient.js';
import { mapStoreFromDb, mapStoreToDb } from './mappers.js';

const STORAGE_KEY = 'fruites_demo_stores';

/**
 * Carga los puntos de venta (desde Supabase o localStorage en modo demo)
 */
export async function getStores() {
  if (!isDemoMode && supabase) {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('nombre', { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) {
        return data.map(mapStoreFromDb);
      }
    } catch (err) {
      console.warn('Error al consultar tiendas en Supabase, usando catálogo local:', err);
    }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error al leer localStorage de tiendas:', e);
  }

  return initialStores;
}

/**
 * Guarda o actualiza una tienda
 * Resuelve C-03 y C-04: mapea columnas y no hace fallback silencioso en errores de producción.
 */
export async function saveStore(store) {
  const dbPayload = mapStoreToDb(store);

  if (!isDemoMode && supabase) {
    if (store.id && !String(store.id).startsWith('demo-')) {
      const { data, error } = await supabase
        .from('stores')
        .update(dbPayload)
        .eq('id', store.id)
        .select()
        .single();

      if (error) {
        console.error('Error al actualizar tienda en Supabase:', error);
        throw error;
      }
      return mapStoreFromDb(data);
    } else {
      const { data, error } = await supabase
        .from('stores')
        .insert([dbPayload])
        .select()
        .single();

      if (error) {
        console.error('Error al insertar tienda en Supabase:', error);
        throw error;
      }
      return mapStoreFromDb(data);
    }
  }

  // Guardado en modo demo (localStorage)
  const stores = await getStores();
  let updated;
  if (store.id) {
    updated = stores.map((s) => (s.id === store.id ? { ...s, ...store } : s));
  } else {
    const newId = `demo-store-${Date.now()}`;
    updated = [...stores, { ...store, id: newId }];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return store;
}

/**
 * Elimina una tienda
 * Resuelve C-03: lanza excepción si falla en Supabase real en vez de fingir éxito.
 */
export async function deleteStore(id) {
  if (!isDemoMode && supabase) {
    const { error } = await supabase.from('stores').delete().eq('id', id);
    if (error) {
      console.error('Error al eliminar tienda en Supabase:', error);
      throw error;
    }
  }

  const stores = await getStores();
  const updated = stores.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return true;
}

export function resetDemoStores() {
  localStorage.removeItem(STORAGE_KEY);
  return initialStores;
}
