// common-ui/src/components/footer/FooterView.jsx
import React from 'react';
import styles from './Footer.module.css';
import RedesSociales from '../RedesSociales';

// Ítems que NO deben tener enlace (texto plano)
const NO_LINK_TEXTS = new Set([
  'Consultas generales (conmutador): (0221) 429-7600',
  'Ayuda técnica a usuarios de ABC: infoayuda@abc.gob.ar',
]);

export default function FooterView({ logos = {}, columnas = {} }) {
  // Normalizar columnas → array de secciones {titulo, enlaces}
  const sections = React.useMemo(() => {
    const out = [];
    Object.keys(columnas)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach((col) => {
        Object.entries(columnas[col] || {}).forEach(([titulo, { enlaces }]) => {
          out.push({ titulo, enlaces });
        });
      });
    return out;
  }, [columnas]);

  // Estado del acordeón móvil
  const [open, setOpen] = React.useState(null);
  const toggle = (idx) => setOpen((o) => (o === idx ? null : idx));

  return (
    <footer
      className={`${styles.footer} container-fluid`}
      role="contentinfo"
      aria-label="Pie de página DGCyE"
    >
      <div className="container py-4 py-md-5">
        {/* ====== MOBILE: Acordeón → Logo → Redes ====== */}
        <div className="d-md-none">
          {/* Acordeón de columnas */}
          <ul className={`list-unstyled m-0 ${styles.accordionList}`} aria-label="Enlaces del pie de página">
            {sections.map((sec, idx) => {
              const isOpen = open === idx;
              const panelId = `fsec-${idx}`;
              const buttonId = `fbtn-${idx}`;
              return (
                <li key={panelId} className={`mb-2 ${styles.accItem}`}>
                  <button
                    type="button"
                    className={styles.accordionBtn}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    id={buttonId}
                    onClick={() => toggle(idx)}
                  >
                    <span className="me-2">{sec.titulo}</span>
                    <span
                      className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    id={panelId}
                    className={`${styles.accordionPanel} ${isOpen ? styles.panelOpen : ''}`}
                    role="region"
                    aria-labelledby={buttonId}
                    aria-hidden={!isOpen}
                  >
                    <ul className="list-unstyled m-0">
                      {sec.enlaces.map((enlace, i) => {
                        const text = (enlace.texto || enlace.url || '').trim();
                        const noLink = NO_LINK_TEXTS.has(text);
                        return (
                          <li key={`${panelId}-${i}`} className={styles['footer-item']}>
                            {noLink ? (
                              <span className="text-dark">{text}</span>
                            ) : (
                              <a
                                href={enlace.url || '#'}
                                className={`${styles['footer-link']} text-decoration-none`}
                              >
                                {text}
                              </a>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Logo debajo del acordeón */}
          <div className="text-center mt-3">
            {(logos.mobile || logos.desktop) && (
              <a
                href={logos.enlace || '#'}
                aria-label={logos.mobileAlt || logos.desktopAlt || 'Sitio institucional DGCyE'}
                className="d-inline-block"
              >
                <img
                  src={logos.mobile || logos.desktop}
                  alt={logos.mobileAlt || logos.desktopAlt || 'Logo institucional'}
                  className={`img-fluid ${styles.footerLogoMobile}`}
                />
              </a>
            )}
          </div>

          {/* Redes debajo del logo (visibles en mobile) */}
          <div
            className={`${styles['footer-social']} d-flex justify-content-center mt-2`}
            aria-label="Redes sociales"
            role="group"
          >
            <RedesSociales />
          </div>
        </div>

        {/* ====== DESKTOP: SIN CAMBIOS ====== */}
        <div className="d-none d-md-block">
          <div className="row g-4 g-lg-5 align-items-start">
            {/* Columna 1: Logo + Redes (tal cual original) */}
            <div className="col-12 col-lg-3">
              <a
                href={logos.enlace || '#'}
                aria-label={logos.desktopAlt || 'Sitio institucional DGCyE'}
                className="d-inline-block"
              >
                {logos.desktop && (
                  <img
                    src={logos.desktop}
                    alt={logos.desktopAlt || 'Logo institucional'}
                    className={`img-fluid ${styles.footerLogo}`}
                  />
                )}
              </a>

              <div
                className={styles['footer-social']}
                aria-label="Redes sociales"
                role="group"
              >
                <RedesSociales />
              </div>
            </div>

            {/* Columnas de enlaces */}
            {Object.keys(columnas)
              .map(Number)
              .sort((a, b) => a - b)
              .map((col) => (
                <div key={col} className="col-6 col-lg-3">
                  {Object.entries(columnas[col] || {}).map(([seccion, { enlaces }], secIdx) => {
                    const headingId = `fcol-${col}-h-${secIdx}`;
                    return (
                      <div key={seccion} className={styles['footer-section']}>
                        <h6
                          id={headingId}
                          className={`text-uppercase ${styles['footer-heading']}`}
                          role="heading"
                          aria-level={2}
                        >
                          {seccion}
                        </h6>
                        <ul className="list-unstyled m-0" aria-labelledby={headingId}>
                          {enlaces.map((enlace, idx) => {
                            const text = (enlace.texto || enlace.url || '').trim();
                            const noLink = NO_LINK_TEXTS.has(text);
                            return (
                              <li key={`${seccion}-${idx}`} className={styles['footer-item']}>
                                {noLink ? (
                                  <span className="text-dark">{text}</span>
                                ) : (
                                  <a
                                    href={enlace.url || '#'}
                                    className={`${styles['footer-link']} text-decoration-none`}
                                  >
                                    {text}
                                  </a>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              ))}
          </div>
        </div>
      </div>
    </footer>
  );
}


