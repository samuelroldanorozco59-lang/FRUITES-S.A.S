/**
 * Helper para resolver rutas de imágenes públicas tanto en dominio raíz
 * como en subdirectorios de GitHub Pages (ej. usuario.github.io/fruites-web/).
 * Resuelve el hallazgo A-01 de la auditoría.
 */
export function getAssetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
}
