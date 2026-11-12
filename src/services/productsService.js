import { initialProducts } from '../data/products.js';
import { supabase, isDemoMode } from './supabaseClient.js';
import { mapProductFromDb, mapProductToDb } from './mappers.js';

const STORAGE_KEY = 'fruites_demo_products';

/**
 * Carga la lista de productos:
 * 1. Intenta desde Supabase (si está configurado) aplicando mapeo bidireccional.
 * 2. Si está en modo demo o falla la conexión, lee de localStorage o usa el catálogo inicial.
 */
export async function getProducts() {
  if (!isDemoMode && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('orden', { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) {
        return data.map(mapProductFromDb);
      }
    } catch (err) {
      console.warn('Fallo al consultar Supabase, utilizando catálogo local:', err);
    }
  }

  // Modo demostración: leemos de localStorage o inicializamos con initialProducts
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {
    console.error('Error al leer localStorage de productos', e);
  }

  return initialProducts;
}

/**
 * Obtiene un producto por su slug o ID
 */
export async function getProductBySlug(slug) {
  const products = await getProducts();
  return products.find((p) => p.slug === slug || p.id === slug) || null;
}

/**
 * Guarda o actualiza un producto (para el panel de administración)
 * Resuelve C-03 y C-04: mapea a columnas snake_case y separa errores de BD.
 */
export async function saveProduct(product) {
  const dbPayload = mapProductToDb(product);

  if (!isDemoMode && supabase) {
    if (product.id && !String(product.id).startsWith('demo-')) {
      const { data, error } = await supabase
        .from('products')
        .update(dbPayload)
        .eq('id', product.id)
        .select()
        .single();

      if (error) {
        console.error('Error al actualizar producto en Supabase:', error);
        throw error;
      }
      return mapProductFromDb(data);
    } else {
      const { data, error } = await supabase
        .from('products')
        .insert([dbPayload])
        .select()
        .single();

      if (error) {
        console.error('Error al insertar producto en Supabase:', error);
        throw error;
      }
      return mapProductFromDb(data);
    }
  }

  // Guardado en modo demo (localStorage)
  const products = await getProducts();
  let updated;
  if (product.id) {
    updated = products.map((p) => (p.id === product.id ? { ...p, ...product } : p));
  } else {
    const newId = `demo-${Date.now()}`;
    updated = [...products, { ...product, id: newId }];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return product;
}

/**
 * Restablece los productos demo al catálogo inicial
 */
export function resetDemoProducts() {
  localStorage.removeItem(STORAGE_KEY);
  return initialProducts;
}
