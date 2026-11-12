/**
 * Exportador CSV seguro para Excel y hojas de cálculo.
 * Resuelve el hallazgo M-02 de la auditoría:
 * 1. Usa Blob + URL.createObjectURL para que no se trunque en caracteres como '#'
 * 2. Agrega BOM UTF-8 (\uFEFF) para que Excel abra acentos y tildes correctamente
 * 3. Sanitiza cada celda contra inyección de fórmulas CSV (CWE-1236) prefijando apóstrofe si empieza por '=', '+', '-', '@'
 * 4. Envuelve campos en comillas dobles y escapa comillas internas (" -> "")
 */
export function exportSecureCSV(filename, headers, rows) {
  if (!rows || rows.length === 0) return;

  const sanitizeCell = (val) => {
    if (val === null || val === undefined) return '""';
    let str = String(val);

    // Prevenir inyección de fórmulas de Excel si el primer carácter es =, +, -, @, \t, \r
    if (/^[=+\-@\t\r]/.test(str)) {
      str = `'${str}`;
    }

    // Escapar comillas dobles
    const escaped = str.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const headerRow = headers.map(sanitizeCell).join(',');
  const dataRows = rows.map((r) => r.map(sanitizeCell).join(','));

  const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
