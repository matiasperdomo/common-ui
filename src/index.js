export { default as Header } from './components/header/Header.jsx';
export { default as Footer } from './components/footer/Footer.jsx';

export { default as RedesSociales } from './components/RedesSociales.jsx';

export { useMenu, useMenuMeta } from './hooks/useMenu.js';

export { default as PageSplit } from './components/layout/page-split/PageSplit.jsx';
export { default as PageBreadcrumb } from './components/header/PageBreadcrumb.jsx';

export { toAbsolute, toHref } from './utils/drupal.js';
export { buildApiUrl } from './utils/api.js';

export { getYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbUrl } from './utils/youtube.js';

export { formatFechaLongEs } from './utils/dates.js';

export { ensureEncodeSans, ensureIconFontAwesome } from './utils/fonts';


export * from './utils/slug';