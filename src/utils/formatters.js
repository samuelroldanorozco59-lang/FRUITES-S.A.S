/**
 * Utilidades de formateo para la tienda e-commerce de FRUITES
 */

/**
 * Formatea un valor numérico a moneda colombiana (COP)
 * Ejemplo: 9500 -> "$9.500 COP"
 */
export function formatCOP(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '$0 COP';
  }
  const formatted = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return `${formatted} COP`;
}

/**
 * Formatea una fecha en formato legible para Colombia
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}
