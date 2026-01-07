import { useEffect, useState } from 'react';
import { buildApiUrl } from '../utils/api';
import { toAbsolute, toHref } from '../utils/drupal';

export function useHeaderLogos() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error' | 'empty'
  const [error, setError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setStatus('loading');
        setError(null);

        const url = buildApiUrl('home.pagina.logos/select', { q: '*:*' });
        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        const docs = json?.response?.docs || [];
        if (!docs.length) {
          setStatus('empty');
          setData(null);
          return;
        }

        // Filtrar solo Header + Desktop 
        const headerDesktop = docs.filter(
          (d) => d?.tax_contexto === 'Header' && d?.tax_dispositivos === 'Desktop'
        );

        if (!headerDesktop.length) {
          setStatus('empty');
          setData(null);
          return;
        }

        // Orden por delta si existe
        const ordered = headerDesktop.slice().sort(
          (a, b) => (a?.delta ?? 999) - (b?.delta ?? 999)
        );

        // Selector que prioriza `clave`, si no hay cae a `titulo`
        const choose = (keyWord, clave) => {
          let hit =
            ordered.find((d) => (d?.clave || '').toLowerCase() === clave) ||
            ordered.find((d) => (d?.titulo || '').toLowerCase().includes(keyWord));
          return hit || null;
        };

        const provinciaDoc = choose('provincia', 'provincia');
        const abcDoc = choose('abc', 'abc');

        const toLogo = (d) =>
          d
            ? {
                src: d?.imagen1_url ? toAbsolute(d.imagen1_url) : null,
                alt: (d?.imagen1_alt || d?.titulo || '').trim(),
                link: d?.enlace_uri ? toHref(d.enlace_uri) : null,
              }
            : null;

        const payload = {
          provincia: toLogo(provinciaDoc),
          abc: toLogo(abcDoc),
        };

        if (!payload.provincia && !payload.abc) {
          setStatus('empty');
          setData(null);
          return;
        }

        setData(payload);
        setStatus('success');
      } catch (e) {
        if (ac.signal.aborted) return;
        setError(e?.message || 'Error desconocido');
        setStatus('error');
        setData(null);
      }
    })();

    return () => ac.abort();
  }, []);

  return { status, data, error };
}