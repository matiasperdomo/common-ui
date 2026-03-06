/**
 * App.jsx — Playground para visualizar y probar los componentes de common-ui.
 * Solo se usa en desarrollo (npm run dev). No afecta el build de la librería.
 */
import React, { useState } from 'react';

import Header from './components/header/Header.jsx';
import Footer from './components/footer/Footer.jsx';
import Pagination from './components/pagination/Pagination.jsx';
import RedesSociales from './components/RedesSociales.jsx';
import PageSplit from './components/layout/page-split/PageSplit.jsx';
import { formatFechaLongEs, formatFechaLargoES } from './utils/dates.js';

const sectionStyle = {
  padding: '2rem',
  borderBottom: '1px solid #dee2e6',
};

const labelStyle = {
  display: 'inline-block',
  background: '#6c757d',
  color: '#fff',
  fontSize: '0.75rem',
  padding: '2px 8px',
  borderRadius: '4px',
  marginBottom: '1rem',
};

export default function App() {
  const [page, setPage] = useState(3);

  return (
    <>
      {/* ── Header ─────────────────────────────── */}
      <section style={sectionStyle}>
        <span style={labelStyle}>Header</span>
        <Header />
      </section>

      {/* ── Pagination ─────────────────────────── */}
      <section style={sectionStyle}>
        <span style={labelStyle}>Pagination</span>
        <p style={{ marginBottom: '0.5rem', color: '#6c757d', fontSize: '0.875rem' }}>
          Página actual: <strong>{page}</strong> / 10
        </p>
        <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
      </section>

      {/* ── RedesSociales ──────────────────────── */}
      <section style={sectionStyle}>
        <span style={labelStyle}>RedesSociales</span>
        <RedesSociales />
      </section>

      {/* ── PageSplit ──────────────────────────── */}
      <section style={sectionStyle}>
        <span style={labelStyle}>PageSplit</span>
        <PageSplit
          splitHeight={200}
          right={
            <div style={{ background: '#e9ecef', padding: '1rem', borderRadius: '4px' }}>
              Panel derecho
            </div>
          }
        >
          <div style={{ background: '#dee2e6', padding: '1rem', borderRadius: '4px' }}>
            Contenido principal
          </div>
        </PageSplit>
      </section>

      {/* ── Utils / dates ──────────────────────── */}
      <section style={sectionStyle}>
        <span style={labelStyle}>utils/dates</span>
        <table style={{ borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr>
              <th style={{ padding: '4px 12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Función</th>
              <th style={{ padding: '4px 12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Entrada</th>
              <th style={{ padding: '4px 12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Resultado</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['formatFechaLongEs',  '2025-07-26', formatFechaLongEs('2025-07-26')],
              ['formatFechaLongEs',  '2025-12-01', formatFechaLongEs('2025-12-01')],
              ['formatFechaLargoES', '2025-11-10', formatFechaLargoES('2025-11-10')],
              ['formatFechaLargoES', '10/11/2025', formatFechaLargoES('10/11/2025')],
            ].map(([fn, input, output]) => (
              <tr key={fn + input}>
                <td style={{ padding: '4px 12px', fontFamily: 'monospace' }}>{fn}</td>
                <td style={{ padding: '4px 12px', fontFamily: 'monospace', color: '#6c757d' }}>{input}</td>
                <td style={{ padding: '4px 12px', fontWeight: 'bold' }}>{output}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ── Footer ─────────────────────────────── */}
      <Footer />
    </>
  );
}
