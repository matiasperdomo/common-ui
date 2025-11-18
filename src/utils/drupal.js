// Host institucional configurable en un solo lugar
export const ABC_HOST = 'https://abc.gob.ar';

// Asegura que termine con /
export const PUBLIC_FILE_BASE = 'https://abc.gob.ar/sites/default/files/';

// Reemplaza public:// por la URL pública del files/ de Drupal
export function fromPublicUri(uri, base = PUBLIC_FILE_BASE) {
  if (!uri) return null;
  const v = String(uri).trim();
  if (/^https?:\/\//i.test(v) || /^\/\//.test(v)) return v; // ya absoluto
  if (/^public:\/\//i.test(v)) return v.replace(/^public:\/\//i, base);
  return v;
}

// Normalizador de URLs de archivos/imágenes
export function toAbsolute(u = '') {
  if (!u) return '';
  let v = String(u).trim();

  // data: → dejar tal cual (p.ej. placeholders inline)
  if (/^data:/i.test(v)) return v;

  // private:// → no exponer
  if (/^private:\/\//i.test(v)) return '';

  // public:// → files de Drupal
  if (/^public:\/\//i.test(v)) return v.replace(/^public:\/\//i, PUBLIC_FILE_BASE);

  // //example.com → https
  if (/^\/\//.test(v)) return `https:${v}`;

  // http:// → forzar https://
  if (/^http:\/\//i.test(v)) return v.replace(/^http:\/\//i, 'https://');

  // /sites/... o sites/... → absoluto en ABC_HOST
  if (/^\/?sites\//i.test(v)) {
    const path = v.startsWith('/') ? v : `/${v}`;
    return `${ABC_HOST}${path}`;
  }

  // Dejar tal cual (puede ser https://, blob:, etc.)
  return v;
}

/**
 * Normaliza HREFs de navegación (NO archivos).
 * - Bloquea javascript: y datos no navegables
 * - //example.com → https://example.com
 * - http://...    → https://...
 * - /ruta         → https://abc.gob.ar/ruta
 * - mailto:, tel: → permitidos tal cual
 * - otros         → devueltos tal cual
 */
export function toHref(u = '') {
  if (!u) return '#';
  const v = String(u).trim();

  // bloquear esquemas peligrosos
  if (/^javascript:/i.test(v)) return '#';

  // permitir mailto: y tel:
  if (/^(mailto:|tel:)/i.test(v)) return v;

  // protocol-relative → https
  if (/^\/\//.test(v)) return `https:${v}`;

  // http → https
  if (/^http:\/\//i.test(v)) return v.replace(/^http:\/\//i, 'https://');

  // ruta absoluta del mismo dominio
  if (v.startsWith('/')) return `${ABC_HOST}${v}`;

  // ya absoluto u otro esquema (https:, ftp:, blob:, etc.)
  return v;
}
