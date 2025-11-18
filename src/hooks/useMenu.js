import { useEffect, useState } from 'react';
import { buildApiUrl } from '../utils/api.js';
import { toHref } from '../utils/drupal.js';

// Helper: primer valor no nulo (acepta arrays o escalares)
const pick = (obj, keys) => {
  for (const k of keys) {
    const v = obj?.[k];
    if (v != null) return Array.isArray(v) ? v[0] : v;
  }
  return undefined;
};

// Núcleo: devuelve { status, items, error } sin cambiar la lógica original
function useMenuCore({ rows = 200 } = {}) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error' | 'empty'
  const [error, setError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setStatus('loading');
        setError(null);

        // API v1 : /dti/api/v1/home.menu/select  (solo API base)
        const url = buildApiUrl('/home.menu/select', {
          q: '*:*',
          wt: 'json',
          rows,                // (4) rows configurable
          sort: 'peso asc',
        });

        const res = await fetch(url, {
          headers: { Accept: 'application/json' },
          signal: ac.signal,   // (1) AbortController
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (ac.signal.aborted) return;

        const docs = Array.isArray(data?.response?.docs) ? data.response.docs : [];
        if (!docs.length) {
          setItems([]);
          setStatus('empty');
          return;
        }

        // Ítems activos (tolerante)
        const activos = docs.filter((it) => {
          const v = pick(it, ['enabled', 'activo']);
          return v === 1 || v === '1' || v === true || v === 'true' || v === undefined;
        });

        // Validación de id: si falta, se descarta el ítem
        const idMap = {};
        const uuidMap = {};

        activos.forEach((it) => {
          const id = pick(it, ['id', 'id_s']) ?? it.id;
          if (!id) return; // descartar sin id

          const uuid = pick(it, ['uuid', 'uuid_s']);
          if (uuid) uuidMap[`menu_link_content:${uuid}`] = id;

          const title =
            pick(it, ['title', 'name', 'texto_del_enlace', 'texto_delEnlace']) || '';

          const rawUri = pick(it, ['uri', 'url']);
          const baseUrl = rawUri?.startsWith?.('internal:/')
            ? rawUri.replace('internal:/', '/')
            : (rawUri || null);

          const urlHref = baseUrl ? toHref(String(baseUrl)) : null;

          const parent = pick(it, ['parent', 'parent_s', 'parent_id', 'padre', 'uuid_padre']);
          const weightVal = pick(it, ['peso', 'weight']);
          const weight = typeof weightVal === 'number' ? weightVal : parseInt(weightVal, 10) || 0;

          idMap[id] = {
            id,
            title,
            url: urlHref,
            parent,
            children: [],
            weight,
          };
        });

        // Armar jerarquía
        const estructurado = [];
        Object.values(idMap).forEach((node) => {
          const parentKey = node.parent;
          if (parentKey && uuidMap[parentKey] && idMap[uuidMap[parentKey]]) {
            idMap[uuidMap[parentKey]].children.push(node);
          } else if (parentKey && idMap[parentKey]) {
            idMap[parentKey].children.push(node);
          } else {
            estructurado.push(node);
          }
        });

        // Orden por peso 
        const byWeight = (a, b) => a.weight - b.weight;
        estructurado.sort(byWeight);
        Object.values(idMap).forEach((n) => n.children.sort(byWeight));

        if (!estructurado.length) {
          setItems([]);
          setStatus('empty');
          return;
        }

        setItems(estructurado);
        setStatus('success');
      } catch (e) {
        if (ac.signal.aborted) return;
        // Log claro
        console.error('[useMenu] Error:', e);
        setItems([]); // fallback 
        setError(e?.message || 'Error desconocido');
        setStatus('error');
      }
    })();

    return () => ac.abort();
  }, [rows]);

  return { status, items, error };
}

/**
 * Hook  que mantiene contrato (devuelve SOLO el array jerarquizado).
 */
export function useMenu(opts) {
  const { items } = useMenuCore(opts);
  return items;
}

/**
 * Hook que expone status/error además de items.
 * Útil para manejar loading/errores en la UI sin romper al consumidor existente.
 */
export function useMenuMeta(opts) {
  return useMenuCore(opts);
}
