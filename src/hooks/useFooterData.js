import { useMemo } from 'react';
import { useFooter } from './useFooter';
import { fromPublicUri } from '../utils/drupal';

// Devuelve el primer elemento si es array; si es string/number/obj, lo deja tal cual
const first = (v) => (Array.isArray(v) ? v[0] : v);

export function useFooterData() {
  const raw = useFooter() || [];

  const { logos, columnas } = useMemo(() => {
    // LOGOS (usa el primer doc que tenga imágenes de logo)
    const logoDoc = raw.find(
      (doc) => first(doc?.foot_logodesk_img_url) || first(doc?.foot_logomobil_img_url)
    );

    const logos = {
      enlace: first(logoDoc?.foot_enlace_url) || '#',
      desktop: fromPublicUri(first(logoDoc?.foot_logodesk_img_url)),
      desktopAlt: first(logoDoc?.foot_logodesk_img_alt) || '',
      mobile: fromPublicUri(first(logoDoc?.foot_logomobil_img_url)),
      mobileAlt: first(logoDoc?.foot_logomobil_img_alt) || '',
    };

    // COLUMNAS: { [colDelta]: { [seccion]: { delta?: number, enlaces: [{texto,url,delta?}] } } }
    const columnas = {};
    raw.forEach((item) => {
      const colDelta = Number(first(item.foot_columna_delta));
      const seccion = first(item.foot_tit_seccion) || '';
      if (Number.isNaN(colDelta) || !seccion) return;

      const secDelta =
        first(item.foot_tit_seccion_delta) != null
          ? Number(first(item.foot_tit_seccion_delta))
          : undefined;

      const enlace = {
        texto: first(item.foot_enlace_texto) || '',
        url: first(item.foot_enlace_url) || '#',
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

    // Ordenar por delta cuando exista
    const sortByDelta = (a, b) =>
      (a?.delta ?? Number.MAX_SAFE_INTEGER) - (b?.delta ?? Number.MAX_SAFE_INTEGER);

    Object.keys(columnas).forEach((col) => {
      // Orden secciones
      const entries = Object.entries(columnas[col]).sort(([, A], [, B]) =>
        sortByDelta(A, B)
      );
      const ordered = {};
      entries.forEach(([name, obj]) => {
        // Orden enlaces
        obj.enlaces.sort((A, B) => sortByDelta(A, B));
        ordered[name] = obj;
      });
      columnas[col] = ordered;
    });

    return { logos, columnas };
  }, [raw]);

  const hasData =
    !!Object.keys(columnas).length || !!(logos.desktop || logos.mobile);
  return { logos, columnas, hasData };
}
