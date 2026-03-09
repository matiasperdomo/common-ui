export { default as Header } from './components/header/Header.jsx';
export { default as Footer } from './components/footer/Footer.jsx';

export { default as RedesSociales } from './components/RedesSociales.jsx';

export { default as Pagination } from './components/pagination/Pagination.jsx';
export { useMenu, useMenuMeta } from './hooks/useMenu.js';


export { default as PageSplit } from './components/layout/page-split/PageSplit.jsx';
export { default as PageBreadcrumb } from './components/header/PageBreadcrumb.jsx';

export { toAbsolute, toHref, normalizeDrupalFileUrl } from './utils/drupal.js';
export { default as iconPba } from './img/icon-pba.ico';
export { buildApiUrl, normalizeApiError, ApiError } from './utils/api.js';

export { getYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbUrl } from './utils/youtube.js';
export { formatFechaLongEs, formatFechaLargoES } from './utils/dates.js';
export { ensureEncodeSans, ensureIconFontAwesome } from './utils/fonts';
export * from './utils/slug';