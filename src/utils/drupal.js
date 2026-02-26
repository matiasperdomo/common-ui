// Host institucional
export const ABC_HOST = 'https://abc.gob.ar';

// Base pública de archivos de Drupal
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

  // data: p.ej. placeholders inline
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
 * - Bloquea javascript:
 * - internal:/ruta → https://abc.gob.ar/ruta (Drupal)
 * - //example.com → https://example.com
 * - http://...    → https://...
 * - /ruta         → https://abc.gob.ar/ruta
 * - mailto:, tel: → permitidos tal cual
 * - otros         → devueltos tal cual
 */
export function toHref(u = '') {
  if (!u) return '#';
  const v = String(u).trim();

  // Drupal internal:/ruta → /ruta (mismo dominio)
  if (/^internal:\//i.test(v)) {
    const path = v.replace(/^internal:\//i, '/'); // asegura / al inicio
    return `${ABC_HOST}${path}`;
  }

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

export function normalizeDrupalFileUrl(rawUrl) {
  if (!rawUrl) return rawUrl;

  try {
    const url = new URL(rawUrl);
    const segments = url.pathname.split('/');
    let filename = segments.pop() || '';

    // Si vino un fragmento (#15.png), se re-anexa al nombre de archivo
    // para que el # pase a ser %23 dentro del path y no un anchor.
    if (url.hash) {
      const hashWithoutSharp = url.hash.substring(1);

      // Heurística: si el filename NO tiene punto y el fragmento SÍ,
      // se asume que el fragmento es parte del nombre real del archivo.
      if (!filename.includes('.') && hashWithoutSharp.includes('.')) {
        filename = `${filename}#${hashWithoutSharp}`;
        url.hash = '';
      }
    }

    if (!filename) return rawUrl;

    // 1) Intenta decodificar por si ya tiene %20, %23, etc.
    let decoded = filename;
    try {
      decoded = decodeURIComponent(filename);
    } catch {
      // si falla, sigue con filename tal cual
    }

    // 2) Vuelve a codificar de forma correcta (espacios, #, acentos, etc.)
    const encoded = encodeURIComponent(decoded);

    segments.push(encoded);
    url.pathname = segments.join('/');

    return url.toString();
  } catch {
    // Si algo sale mal, devuelve la original para no romper nada
    return rawUrl;
  }
}

/**
 * HREF seguro para navegación.
 * - Normaliza primero (incluye internal:/ → https://abc.gob.ar/...)
 * - Devuelve null si no es navegable/seguro
 * - Permite: https://, mailto:, tel:, rutas internas
 * - Bloquea: javascript:, data:, vbscript:, file:, control chars
 */
export function toSafeHref(raw) {
  if (!raw) return null;

  const input = String(raw).trim();
  if (!input) return null;

  // Caracteres de control (defensa básica)
  if (/[\u0000-\u001F\u007F]/.test(input)) return null;

  // Bloquear esquemas inseguros en el input (antes de normalizar)
  if (/^(javascript:|data:|vbscript:|file:)/i.test(input)) return null;

  // Normalizar primero (esto resuelve internal:/, http→https, /ruta→ABC_HOST, etc.)
  const normalized = toHref(input);

  // Si no es navegable, no renderizamos enlace
  if (!normalized || normalized === '#') return null;

  // Permitir mailto/tel tal cual
  if (/^(mailto:|tel:)/i.test(normalized)) return normalized;

  // Rechazar cualquier esquema que no sea https (política institucional razonable)
  // Si en algún caso se necesita permitir http interno, se revisa, pero por defecto es mejor bloquearlo.
  if (!/^https:\/\//i.test(normalized)) return null;

  // Validar URL final
  try {
    const u = new URL(normalized);
    if (u.protocol !== 'https:') return null;
    return u.toString();
  } catch {
    return null;
  }
}