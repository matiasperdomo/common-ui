import React from 'react';
import styles from './Footer.module.css';
import RedesSociales from '../RedesSociales';

export default function FooterView({ logos = {}, columnas = {} }) {
  // Normalizar columnas → array de secciones { titulo, enlaces }
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

  // Helpers “tontos”: el View NO decide seguridad; solo renderiza si hay href.
  const renderLinkOrText = (enlace, key) => {
    const text = (enlace?.texto || '').trim();
    const href = enlace?.url || null;

    return (
      <li key={key} className={styles['footer-item']}>
        {href ? (
          <a href={href} className={`${styles['footer-link']} text-decoration-none`}>
            {text}
          </a>
        ) : (
          <span className="text-dark">{text}</span>
        )}
      </li>
    );
  };

  const renderLogo = (variant) => {
    const isMobile = variant === 'mobile';
    const src = isMobile ? (logos.mobile || logos.desktop) : logos.desktop;
    if (!src) return null;

    const alt = isMobile
      ? (logos.mobileAlt || logos.desktopAlt || 'Logo institucional')
      : (logos.desktopAlt || 'Logo institucional');

    const href = logos.enlace || null;
    const imgClass = isMobile ? styles.footerLogoMobile : styles.footerLogo;

    const img = (
      <img
        src={src}
        alt={alt}
        className={`img-fluid ${imgClass}`}
      />
    );

    // Si no hay href válido, no se renderiza <a>
    return href ? (
      <a href={href} aria-label={alt} className="d-inline-block">
        {img}
      </a>
    ) : (
      <span aria-label={alt} className="d-inline-block">
        {img}
      </span>
    );
  };

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
          <ul
            className={`list-unstyled m-0 ${styles.accordionList}`}
            aria-label="Enlaces del pie de página"
          >
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
                      {sec.enlaces.map((enlace, i) =>
                        renderLinkOrText(enlace, `${panelId}-${i}`)
                      )}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Logo debajo del acordeón */}
          <div className="text-center mt-3">{renderLogo('mobile')}</div>

          {/* Redes debajo del logo (visibles en mobile) */}
          <div
            className={`${styles['footer-social']} d-flex justify-content-center mt-2`}
            aria-label="Redes sociales"
            role="group"
          >
            <RedesSociales />
          </div>
        </div>

        {/* ====== DESKTOP ====== */}
        <div className="d-none d-md-block">
          <div className="row g-4 g-lg-5 align-items-start">
            {/* Columna 1: Logo + Redes */}
            <div className="col-12 col-lg-3">
              {renderLogo('desktop')}

              <div className={styles['footer-social']} aria-label="Redes sociales" role="group">
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
                          {enlaces.map((enlace, idx) =>
                            renderLinkOrText(enlace, `${seccion}-${idx}`)
                          )}
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