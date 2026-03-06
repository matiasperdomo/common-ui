// Bundle CDN solo de utilidades (sin Web Components).
// Se expone como window.CommonUI en el navegador.
// Carga también los estilos (tokens.css) y la tipografía (Encode Sans).
import '../globals.js';

export { formatFechaLongEs, formatFechaLargoES } from '../utils/dates.js';
export { getYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbUrl } from '../utils/youtube.js';
export { toAbsolute, toHref, normalizeDrupalFileUrl } from '../utils/drupal.js';
export { buildApiUrl, setApiBase } from '../utils/api.js';
export { ensureEncodeSans, ensureIconFontAwesome } from '../utils/fonts.js';
export * from '../utils/slug.js';
