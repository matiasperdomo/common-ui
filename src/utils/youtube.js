// common-ui/src/utils/youtube.js
export function getYouTubeId(raw = '') {
  try {
    const u = new URL(raw, 'https://example.com'); // base por si viene relativo
    const h = u.hostname.replace(/^www\./, '');

    if (h === 'youtu.be') return u.pathname.slice(1);
    if (h === 'youtube.com' || h === 'm.youtube.com') {
      // /watch?v=, /shorts/{id}, /embed/{id}
      if (u.pathname === '/watch') return u.searchParams.get('v') || '';
      const parts = u.pathname.split('/').filter(Boolean);
      if (parts[0] === 'shorts' || parts[0] === 'embed') return parts[1] || '';
    }
    return '';
  } catch { return ''; }
}

export function getYouTubeEmbedUrl(raw = '', { autoplay = 0, start = 0 } = {}) {
  const id = getYouTubeId(raw);
  if (!id) return null;
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    iv_load_policy: '3',
    autoplay: String(autoplay),
    start: String(start),
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params}`;
}

export function getYouTubeThumbUrl(raw = '', { quality = 'hqdefault' } = {}) {
  const id = getYouTubeId(raw);
  return id ? `https://i.ytimg.com/vi/${id}/${quality}.jpg` : null;
}
