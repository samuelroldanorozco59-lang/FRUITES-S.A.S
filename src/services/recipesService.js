import { initialRecipes } from '../data/recipes.js';
import { supabase, isDemoMode } from './supabaseClient.js';
import { mapRecipeFromDb, mapRecipeToDb } from './mappers.js';

const STORAGE_KEY = 'fruites_demo_recipes';

/**
 * Carga las recetas y artículos de blog
 */
export async function getRecipes() {
  if (!isDemoMode && supabase) {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        return data.map(mapRecipeFromDb);
      }
    } catch (err) {
      console.warn('Error al consultar recetas en Supabase, usando locales:', err);
    }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error al leer localStorage de recetas:', e);
  }

  return initialRecipes;
}

/**
 * Obtiene una receta por su slug
 */
export async function getRecipeBySlug(slug) {
  const recipes = await getRecipes();
  return recipes.find((r) => r.slug === slug || r.id === slug) || null;
}

/**
 * Guarda o actualiza una receta
 * Resuelve C-03 y C-04: mapea snake_case <-> camelCase
 */
export async function saveRecipe(recipe) {
  const dbPayload = mapRecipeToDb(recipe);

  if (!isDemoMode && supabase) {
    if (recipe.id && !String(recipe.id).startsWith('demo-')) {
      const { data, error } = await supabase
        .from('recipes')
        .update(dbPayload)
        .eq('id', recipe.id)
        .select()
        .single();

      if (error) {
        console.error('Error al actualizar receta en Supabase:', error);
        throw error;
      }
      return mapRecipeFromDb(data);
    } else {
      const { data, error } = await supabase
        .from('recipes')
        .insert([dbPayload])
        .select()
        .single();

      if (error) {
        console.error('Error al insertar receta en Supabase:', error);
        throw error;
      }
      return mapRecipeFromDb(data);
    }
  }

  // Guardado en modo demo
  const recipes = await getRecipes();
  let updated;
  if (recipe.id) {
    updated = recipes.map((r) => (r.id === recipe.id ? { ...r, ...recipe } : r));
  } else {
    const newId = `demo-recipe-${Date.now()}`;
    const generatedSlug = (recipe.titulo || 'receta')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    updated = [
      {
        ...recipe,
        id: newId,
        slug: recipe.slug || generatedSlug,
        fecha: new Date().toISOString().slice(0, 10),
      },
      ...recipes,
    ];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return recipe;
}

/**
 * Elimina una receta
 * Resuelve C-03: lanza excepción si falla en Supabase real
 */
export async function deleteRecipe(id) {
  if (!isDemoMode && supabase) {
    const { error } = await supabase.from('recipes').delete().eq('id', id);
    if (error) {
      console.error('Error al borrar en Supabase:', error);
      throw error;
    }
  }

  const recipes = await getRecipes();
  const updated = recipes.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return true;
}

export function resetDemoRecipes() {
  localStorage.removeItem(STORAGE_KEY);
  return initialRecipes;
}
