import { useEffect, useMemo, useState } from 'react';
import { buildApiUrl } from '../utils/api.js';
import { toAbsolute, toHref } from '../utils/drupal.js';

const first = (v) => (Array.isArray(v) ? v[0] : v);

/**
 * Hook para obtener redes sociales desde la API
 * Retorna: { redes:[{id, enlace, alt, icono, order}], loading, error }
 */
export function useRedesSociales(opts = {}) {
  const { endpoint: endpointProp, rows = 50 } = opts;

  // Endpoint por defecto calculado dentro del hook
  const endpoint = useMemo(() => {
    return (
      endpointProp ||
      buildApiUrl('/home.footer.redes/select', {
        q: '*:*',
        wt: 'json',
        rows,
        sort: 'delta asc',
      })
    );
  }, [endpointProp, rows]);

  const [state, setState] = useState({ redes: [], loading: true, error: null });

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setState((s) => ({ ...s, loading: true, error: null }));

        const res = await fetch(endpoint, {
          headers: { Accept: 'application/json' },
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const docs = Array.isArray(data?.response?.docs) ? data.response.docs : [];

        const parsed = docs
          .map((item, idx) => {
            const rawIcon = first(item.redes_img_url) || '';
            const icono = rawIcon ? toAbsolute(rawIcon) : null;

            const rawLink = first(item.redes_enlace) || '';
            const enlace = rawLink ? toHref(rawLink) : null;

            // Si el endpoint trae alt, se usa; si no, alt decorativo ''
            const alt = first(item.redes_img_alt) || first(item.redes_img_tit) || '';

            const order = Number(first(item.delta)) || idx;

            const id = item.id ?? first(item.uuid) ?? `red-${idx}`;

            return { id, enlace, alt, icono, order };
          })
          .filter((r) => !!r.icono) // requiere ícono válido
          .sort((a, b) => a.order - b.order);

        if (ac.signal.aborted) return;
        setState({ redes: parsed, loading: false, error: null });
      } catch (error) {
        if (ac.signal.aborted) return;
        setState({ redes: [], loading: false, error });
      }
    })();

    return () => ac.abort();
  }, [endpoint]);

  return state;
}