// usePageBreadcrumb.js
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

export function usePageBreadcrumb({
  homeHref = '/',
  homeLabel = 'HOME',
  overrides = {},
  transform,            // p.ej. (s) => s.replace(/[-_]+/g,' ').toUpperCase()
  maxItems,             // número opcional
  pathname,             // opcional (para test); por defecto usa useLocation()
} = {}) {
  const loc = useLocation();
  const path = pathname ?? loc.pathname;

  const segments = useMemo(() => {
    return path.split('/').filter(Boolean).map((s) => {
      try { return decodeURIComponent(s); } catch { return s; }
    });
  }, [path]);

  const prettify = (seg) => {
    if (overrides && overrides[seg]) return overrides[seg];
    if (transform) return transform(seg);
    return seg.replace(/[-_]+/g, ' ').trim().toUpperCase();
  };

  const paths = useMemo(() => {
    const acc = [];
    segments.reduce((prev, seg) => {
      const next = `${prev}/${seg}`;
      acc.push(next);
      return next;
    }, '');
    return acc;
  }, [segments]);

  const items = useMemo(() => {
    const base = [{ label: homeLabel, href: homeHref, active: false }];

    if (maxItems && segments.length + 1 > maxItems) {
      const [first, last] = [segments[0], segments[segments.length - 1]];
      return [
        ...base,
        { label: prettify(first), href: `/${segments[0]}`, active: false },
        { label: '…', href: null, active: false, ellipsis: true },
        { label: prettify(last), href: null, active: true },
      ];
    }

    segments.forEach((seg, i) => {
      const href = paths[i];
      const active = i === segments.length - 1;
      base.push({ label: prettify(seg), href: active ? null : href, active });
    });

    return base;
  }, [homeHref, homeLabel, maxItems, paths, segments, transform, overrides]);

  return { items, ariaLabel: 'breadcrumb' };
}