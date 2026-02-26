import { useEffect, useState } from 'react';
import { buildApiUrl } from '../utils/api.js';

/**
 * useFooter
 * - Carga los docs del endpoint Solr del footer (paginado + deduplicación defensiva).
 * - Expone estado operativo para UI: { data, loading, error }.
 */
export const useFooter = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    const PAGE_SIZE = 200;

    const makeKey = (d) => {
      // Clave defensiva para deduplicar sin depender de 'sort'
      const tb = String(d?.tipo_bloque ?? '');
      const nid = String(d?.nid ?? '');
      const delta = String(d?.delta ?? d?.foot_enlace_delta ?? '');
      const link = String(d?.foot_enlace_url ?? d?.redes_enlace ?? '');
      return `${tb}|${nid}|${delta}|${link}`;
    };

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) HEAD: cuántos documentos hay (sin traer filas)
        const headUrl = buildApiUrl('/home.footer.redes/select', {
          q: '*:*',
          wt: 'json',
          rows: 0,
        });

        const headRes = await fetch(headUrl, { headers: { Accept: 'application/json' } });
        if (!headRes.ok) throw new Error(`HTTP ${headRes.status} (head)`);

        const head = await headRes.json();
        if (!alive) return;

        const total = Number(head?.response?.numFound ?? 0);

        // Si no hay docs, esto NO es error: es "sin datos"
        if (!total) {
          setData([]);
          setLoading(false);
          return;
        }

        // 2) Paginación con start/rows (sin sort)
        const seen = new Set();
        const all = [];

        for (let start = 0; start < total; start += PAGE_SIZE) {
          const url = buildApiUrl('/home.footer.redes/select', {
            q: '*:*',
            wt: 'json',
            rows: PAGE_SIZE,
            start,
          });

          const res = await fetch(url, { headers: { Accept: 'application/json' } });
          if (!res.ok) throw new Error(`HTTP ${res.status} (page ${start})`);

          const json = await res.json();
          if (!alive) return;

          const page = Array.isArray(json?.response?.docs) ? json.response.docs : [];
          for (const d of page) {
            const k = makeKey(d);
            if (!seen.has(k)) {
              seen.add(k);
              all.push(d);
            }
          }
        }

        if (!alive) return;
        setData(all);
        setLoading(false);
      } catch (e) {
        if (!alive) return;
        console.error('useFooter:', e);
        setData([]);
        setError(e instanceof Error ? e : new Error('Error desconocido'));
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return { data, loading, error };
};