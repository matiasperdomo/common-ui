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

/** Permite sobreescribir el API_BASE en tests / dev */
export function setApiBase(base) {
  API_BASE = base;
}

/** Error normalizado para todo el frontend */
export class ApiError extends Error {
  constructor({ status, code, message, cause } = {}) {
    super(message || 'Error en la comunicación con el servidor');
    this.name = 'ApiError';
    this.status = status ?? null;     // 403, 404, 500, etc.
    this.code = code ?? 'unknown';    // 'forbidden', 'not_found', 'network_error', etc.
    this.cause = cause;
  }
}

/**
 * Normaliza cualquier error de axios/fetch a ApiError.
 */
export function normalizeApiError(rawError) {
  // 1) Errores con response (axios, fetch con status no-OK y body parseado)
  const status = rawError?.response?.status ?? rawError?.status ?? null;

  // 2) Mapear status → código semántico
  let code = 'unknown';

  if (status === 400) code = 'bad_request';
  else if (status === 401) code = 'unauthorized';
  else if (status === 403) code = 'forbidden';
  else if (status === 404) code = 'not_found';
  else if (status >= 500 && status < 600) code = 'server_error';
  else if (!status) code = 'network_error';

  // 3) Mensaje de fallback
  let message = rawError?.message || 'Error en la comunicación con el servidor';

  if (code === 'network_error') {
    message = 'Intentá nuevamente en unos minutos.';
  } else if (code === 'forbidden') {
    message = 'No tenés permisos para acceder a este recurso.';
  } else if (code === 'not_found') {
    message = 'El recurso solicitado no fue encontrado.';
  }

  return new ApiError({ status, code, message, cause: rawError });
}