let API_BASE = 'https://servicios3.abc.gob.ar/dti/api/v1';

export function buildApiUrl(pathOrUrl, params = {}) {
  if (!pathOrUrl) throw new Error('buildApiUrl: path vacío');
  // si es absoluta, respetar tal cual
  if (/^https?:\/\//i.test(pathOrUrl)) return addQs(pathOrUrl, params);
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return addQs(`${API_BASE}${path}`, params);
}

function addQs(url, params) {
  const entries = Object.entries(params ?? {})
    .filter(([, v]) => v !== undefined)            // omite undefined
    .flatMap(([k, v]) => Array.isArray(v) ? v.map(x => [k, x]) : [[k, v]]);
  const qs = new URLSearchParams(entries).toString();
  return qs ? `${url}${url.includes('?') ? '&' : '?'}${qs}` : url;
}