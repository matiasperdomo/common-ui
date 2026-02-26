import React from 'react';
import FooterView from './FooterView';
import { useFooterData } from '../../hooks/useFooterData';
import { toSafeHref } from '../../utils/drupal';

const DEFAULT_STATIC_MODEL = {
  logos: {
    enlace: 'https://abc.gob.ar',
    desktop: null,
    desktopAlt: 'abc.gob.ar',
    mobile: null,
    mobileAlt: 'abc.gob.ar',
  },
  columnas: {
    0: {
      Servicios: {
        delta: 0,
        enlaces: [
          { texto: 'Inicio', url: 'https://abc.gob.ar', delta: 0 },
          { texto: 'Listado oficial', url: 'https://abc.gob.ar/listado-oficial', delta: 1 },
          { texto: 'Consulta de Establecimientos', url: 'https://abc.gob.ar/establecimientos', delta: 2 },
        ],
      },
    },
  },
};

function sanitizeStaticModel(model) {
  const m = model || DEFAULT_STATIC_MODEL;

  const logos = m.logos || {};
  const columnas = m.columnas || {};

  const sanitizedLogos = {
    ...logos,
    enlace: toSafeHref(logos.enlace),
  };

  const sanitizedColumnas = {};
  Object.keys(columnas).forEach((colKey) => {
    const col = columnas[colKey] || {};
    sanitizedColumnas[colKey] = {};

    Object.entries(col).forEach(([titulo, sec]) => {
      const enlaces = Array.isArray(sec?.enlaces) ? sec.enlaces : [];
      sanitizedColumnas[colKey][titulo] = {
        ...sec,
        enlaces: enlaces.map((e) => ({
          ...e,
          url: toSafeHref(e?.url),
        })),
      };
    });
  });

  return { logos: sanitizedLogos, columnas: sanitizedColumnas };
}

export default function Footer({
  fallback = 'none', // 'none' | 'static'
  staticModel,
}) {
  const { logos, columnas, hasData, loading, error } = useFooterData();

  // 1) Cargando: siempre skeleton (evita mostrar fallback “antes de tiempo”)
  if (loading) return <FooterSkeleton />;

  // Helper: construir modelo fallback una sola vez cuando corresponde
  const renderStaticFallback = () => {
    const model = sanitizeStaticModel(staticModel || DEFAULT_STATIC_MODEL);
    return <FooterView logos={model.logos} columnas={model.columnas} />;
  };

  // 2) Error:
  // - con fallback="static" → mostrar footer mínimo (NO alert)
  // - sin fallback          → mostrar alert
  if (error) {
    if (fallback === 'static') return renderStaticFallback();
    return <FooterError message="No se pudo cargar el pie de página." />;
  }

  // 3) Sin datos:
  // - con fallback="static" → mostrar footer mínimo
  // - sin fallback          → no renderizar nada
  if (!hasData) {
    if (fallback === 'static') return renderStaticFallback();
    return null;
  }

  // 4) Con datos
  return <FooterView logos={logos} columnas={columnas} />;
}

/* ============================= */
/*            Skeleton           */
/* ============================= */

function FooterSkeleton() {
  return (
    <footer
      className="bg-light border-top py-4"
      role="contentinfo"
      aria-label="Pie de página DGCyE"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="container">
        <div className="row gx-4 gy-4 placeholder-glow">
          <div className="col-12 col-md-3">
            <div className="d-flex align-items-start gap-3">
              <span className="placeholder rounded" style={{ width: 64, height: 64 }} />
              <div className="flex-grow-1">
                <div className="placeholder col-10 mb-2" style={{ height: 16 }} />
                <div className="placeholder col-8 mb-2" style={{ height: 12 }} />
                <div className="placeholder col-6" style={{ height: 12 }} />
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="placeholder col-7 mb-3" style={{ height: 14 }} />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`c1-${i}`} className="placeholder col-10 mb-2" style={{ height: 12 }} />
            ))}
          </div>

          <div className="col-6 col-md-3">
            <div className="placeholder col-6 mb-3" style={{ height: 14 }} />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`c2-${i}`} className="placeholder col-9 mb-2" style={{ height: 12 }} />
            ))}
          </div>

          <div className="col-12 col-md-3">
            <div className="placeholder col-8 mb-3" style={{ height: 14 }} />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`c3-${i}`} className="placeholder col-11 mb-2" style={{ height: 12 }} />
            ))}
          </div>
        </div>

        <hr className="my-4" />

        <div className="row">
          <div className="col-12">
            <div className="d-flex align-items-center gap-3 placeholder-glow">
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={`rs-${i}`}
                  className="placeholder rounded-circle"
                  style={{ width: 32, height: 32 }}
                  aria-hidden="true"
                />
              ))}
              <div className="ms-auto d-none d-md-block">
                <div className="placeholder col-6" style={{ height: 12 }} />
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-3 placeholder-glow">
          <div className="col-12">
            <div className="placeholder col-12 mb-2" style={{ height: 10 }} />
            <div className="placeholder col-8" style={{ height: 10 }} />
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================= */
/*         Estado de error       */
/* ============================= */

function FooterError({ message = 'Error al cargar.' }) {
  return (
    <footer
      className="bg-light border-top py-4"
      role="contentinfo"
      aria-label="Pie de página DGCyE"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="container">
        <div className="alert alert-warning mb-0" role="alert">
          {message}
        </div>
      </div>
    </footer>
  );
}