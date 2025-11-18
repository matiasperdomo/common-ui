// Fecha ISO → "26 de julio de 2025" (es-AR)
export function formatFechaLongEs(isoLike) {
  if (!isoLike) return '';
  const d = new Date(isoLike);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
}
