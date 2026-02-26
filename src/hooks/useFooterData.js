import { useMemo } from 'react';
import { useFooter } from './useFooter';
import { fromPublicUri, toSafeHref } from '../utils/drupal';

// Devuelve el primer elemento si es array; si es string/number/obj, lo deja tal cual
const first = (v) => (Array.isArray(v) ? v[0] : v);

// Ítems que NO deben tener enlace (texto plano)
const NO_LINK_TEXTS = new Set([
  'Consultas generales (conmutador): (0221) 429-7600',
  'Ayuda técnica a usuarios de ABC: infoayuda@abc.gob.ar',
]);

export function useFooterData() {
  const { data: rawData = [], loading = false, error = null } = useFooter();
  const raw = Array.isArray(rawData) ? rawData : [];

  const { logos, columnas } = useMemo(() => {
    // LOGOS (usa el primer doc que tenga imágenes de logo)
    const logoDoc = raw.find(
      (doc) => first(doc?.foot_logodesk_img_url) || first(doc?.foot_logomobil_img_url)
    );

    const logos = {
      enlace: toSafeHref(first(logoDoc?.foot_enlace_url)),
      desktop: fromPublicUri(first(logoDoc?.foot_logodesk_img_url)),
      desktopAlt: first(logoDoc?.foot_logodesk_img_alt) || '',
      mobile: fromPublicUri(first(logoDoc?.foot_logomobil_img_url)),
      mobileAlt: first(logoDoc?.foot_logomobil_img_alt) || '',
    };

    const columnas = {};

    raw.forEach((item) => {
      const colDelta = Number(first(item.foot_columna_delta));
      const seccion = (first(item.foot_tit_seccion) || '').trim();
      if (Number.isNaN(colDelta) || !seccion) return;

      const secDelta =
        first(item.foot_tit_seccion_delta) != null
          ? Number(first(item.foot_tit_seccion_delta))
          : undefined;

      const texto = (first(item.foot_enlace_texto) || '').trim();
      const rawUrl = first(item.foot_enlace_url);

      const url = NO_LINK_TEXTS.has(texto) ? null : toSafeHref(rawUrl);

      const enlace = {
        texto,
        url,
        delta:
          first(item.foot_enlace_delta) != null
            ? Number(first(item.foot_enlace_delta))
            : undefined,
      };

      if (!columnas[colDelta]) columnas[colDelta] = {};
      if (!columnas[colDelta][seccion])
        columnas[colDelta][seccion] = { delta: secDelta, enlaces: [] };

      columnas[colDelta][seccion].enlaces.push(enlace);
    });

    const sortByDelta = (a, b) =>
      (a?.delta ?? Number.MAX_SAFE_INTEGER) - (b?.delta ?? Number.MAX_SAFE_INTEGER);

    Object.keys(columnas).forEach((col) => {
      const entries = Object.entries(columnas[col]).sort(([, A], [, B]) => sortByDelta(A, B));
      const ordered = {};
      entries.forEach(([name, obj]) => {
        obj.enlaces.sort((A, B) => sortByDelta(A, B));
        ordered[name] = obj;
      });
      columnas[col] = ordered;
    });

    return { logos, columnas };
  }, [raw]);

  const hasData = !!Object.keys(columnas).length || !!(logos.desktop || logos.mobile);

  return { logos, columnas, hasData, loading, error };
}