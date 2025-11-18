// Inserta <link> a Google Fonts 
export function ensureEncodeSans() {
  const head = document.head;

  const needs = (id) => !head.querySelector(`#${id}`);

  if (needs('gf-preconnect-apis')) {
    const l = document.createElement('link');
    l.id = 'gf-preconnect-apis';
    l.rel = 'preconnect';
    l.href = 'https://fonts.googleapis.com';
    head.appendChild(l);
  }

  if (needs('gf-preconnect-gstatic')) {
    const l = document.createElement('link');
    l.id = 'gf-preconnect-gstatic';
    l.rel = 'preconnect';
    l.href = 'https://fonts.gstatic.com';
    l.crossOrigin = '';
    head.appendChild(l);
  }

  if (needs('gf-encode-sans')) {
    const l = document.createElement('link');
    l.id = 'gf-encode-sans';
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Encode+Sans:wght@400;600;700&display=swap';
    head.appendChild(l);
  }
}

export function ensureIconFontAwesome() {
  const head = document.head;
  const needs = (id) => !head.querySelector(`#${id}`);

  if (needs('fa6-cdn')) {
    const l = document.createElement('link');
    l.id = 'fa6-cdn';
    l.rel = 'stylesheet';
    // CDN estable (puedes fijar versión si querés)
    l.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
    // Si tu CSP/SRI rompe, quita integrity para diagnosticar y luego restáuralo con el hash correcto.
    // l.integrity = 'sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkfE2QmXwIJ7jQ4Rz2LrLZ1xQDo8oyV2Lrj3QX7rS2V5Qq1N9+JX4Ck6Q==';
    l.crossOrigin = 'anonymous';
    l.referrerPolicy = 'no-referrer';
    head.appendChild(l);
  }
}