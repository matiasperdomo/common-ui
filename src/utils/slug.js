// Controla longitud y set de caracteres. Queda en 100, pero si complica se puede eliminar la línea o subir el número
const MAX_SLUG_LEN = 100;

// Normaliza texto a slug URL-safe
export function slugify(text) {
  if (!text) return '';
  let s = String(text)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita acentos
    .replace(/&/g, ' y ')                              // & -> 'y'
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')                          // quita símbolos
    .trim()
    .replace(/\s+/g, '-')                              // espacios → guiones
    .replace(/-+/g, '-');                              // colapsa guiones

  // no se usa underscores:
  s = s.replace(/_/g, '-');

  if (s.length > MAX_SLUG_LEN) s = s.slice(0, MAX_SLUG_LEN);
  return s;
}

// Toma alias Drupal ("/noticias/mi-titulo" o "/mi-titulo") o cae a título
export function getSlugFromAliasOrTitle({ alias, path_alias, titulo, titulo_url }) {
  const raw = alias || path_alias || titulo_url || '';
  if (raw && typeof raw === 'string') {
    // quita query/hash, normaliza barras, decodifica %20 etc.
    let a = raw.split('#')[0].split('?')[0].replace(/\/{2,}/g, '/');
    try { a = decodeURI(a); } catch (_) {}
    const seg = a.replace(/^\/+|\/+$/g, '').split('/').pop() || '';
    return slugify(seg) || slugify(titulo || '');
  }
  return slugify(titulo || '');
}

// Escapa valor para query 
function escapeQueryValue(v) {
  return String(v).replace(/([+\-!(){}\[\]^"~*?:\\\/]|&&|\|\|)/g, '\\$1');
}

/** Construye condición para buscar por slug / alias / título **/
export function buildSlugFq(slug) {
  const s = slugify(slug);
  if (!s) return '';

  const tituloExacto = escapeQueryValue(s.replace(/-/g, ' '));
  const sEsc = escapeQueryValue(s);

  return [
    `alias:"/noticias/${sEsc}"`,
    `alias:"/${sEsc}"`,
    `path_alias:"/noticias/${sEsc}"`,
    `path_alias:"/${sEsc}"`,
    `titulo_url:"${sEsc}"`,
    `titulo_slug:"${sEsc}"`,
    `titulo:"${tituloExacto}"`
  ].join(' OR ');
}
