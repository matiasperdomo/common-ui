// Fecha ISO → "26 de julio de 2025" (es-AR)
export function formatFechaLongEs(isoLike) {
  if (!isoLike) return '';
  const d = new Date(isoLike);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
}


// Fecha → "dd mes yyyy" (ej.: "10 noviembre 2025")
export function formatFechaLargoES(fecha) {
  if (!fecha) return '';
  const str = String(fecha);
  const iso = str.slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  let y, m, d;
  if (iso) {
    y = +iso[1]; m = +iso[2]; d = +iso[3];
  } else {
    const sl = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (sl) {
      d = +sl[1];
      m = +sl[2];
      y = +sl[3];
    } else {
      const dt = new Date(str);
      if (Number.isNaN(dt)) return str;
      d = dt.getDate();
      m = dt.getMonth() + 1;
      y = dt.getFullYear();
    }
  }
  const meses = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];
  return `${String(d).padStart(2, '0')} ${meses[m - 1]} ${y}`;
}
