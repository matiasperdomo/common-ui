/**
 * Footer.jsx (container)
 * Rol: Orquestador del Footer. Obtiene datos vía useFooterData y delega renderizado a FooterView.
 * - Muestra Skeleton con Bootstrap mientras carga.
 * - Muestra estado de error si falla.
 * - Renderiza FooterView cuando hay datos.
 */

import React from 'react';
import FooterView from './FooterView';
import { useFooterData } from '../../hooks/useFooterData';

export default function Footer() {
  // Compatibilidad: si el hook aún no expone loading/error, usamos defaults.
  const {
    logos,
    columnas,
    hasData,
    loading = false,
    error = null,
  } = useFooterData();

  if (loading) return <FooterSkeleton />;
  if (error) return <FooterError message="No se pudo cargar el pie de página." />;

  // Mantiene el comportamiento previo: si no hay datos, no renderiza nada.
  if (!hasData) return null;

  return <FooterView logos={logos} columnas={columnas} />;
}

/* ============================= */
/*            Skeleton           */
/* ============================= */

function FooterSkeleton() {
  return (
    <footer className="bg-light border-top py-4" role="contentinfo" aria-label="Pie de página DGCyE" aria-busy="true" aria-live="polite">
      <div className="container">
        {/* Fila superior: logo + columnas */}
        <div className="row gx-4 gy-4 placeholder-glow">
          {/* Columna logo/identidad */}
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

          {/* Tres columnas de enlaces simuladas */}
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

        {/* Separador */}
        <hr className="my-4" />

        {/* Fila inferior: redes sociales simuladas */}
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

        {/* Leyenda legal simulada */}
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
    <footer className="bg-light border-top py-4" role="contentinfo" aria-label="Pie de página DGCyE" aria-live="polite" aria-atomic="true">
      <div className="container">
        <div className="alert alert-warning mb-0" role="alert">
          {message}
        </div>
      </div>
    </footer>
  );
}
