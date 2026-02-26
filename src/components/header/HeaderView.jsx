import React, { useEffect, useState } from 'react';
import { Navbar, Container } from 'react-bootstrap';
import styles from './Header.module.css';
import Menu from './Menu';
import RedesSociales from '../RedesSociales';

const NAV_ID = 'main-navbar';

// Hook robusto: detecta ≥lg (992px)
function useIsLgUp() {
  const query = '(min-width: 992px)';
  const get = () =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false;

  const [lgUp, setLgUp] = useState(get);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia(query);
    const onMQ = () => setLgUp(mq.matches);

    let rafId = null;
    const onResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setLgUp(window.innerWidth >= 992));
    };

    if (mq.addEventListener) mq.addEventListener('change', onMQ);
    else mq.addListener(onMQ);

    window.addEventListener('resize', onResize);

    onMQ();

    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onMQ);
      else mq.removeListener(onMQ);
      window.removeEventListener('resize', onResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return lgUp;
}

function handleSearchSubmit(e) {
  const q = e.currentTarget.elements.q?.value?.trim();
  if (!q) e.preventDefault();
}

const Logo = React.memo(function Logo({ logo, className, fallbackAlt }) {
  if (!logo?.src) return null;
  const alt = logo.alt || fallbackAlt || '';
  const img = (
    <img
      src={logo.src}
      alt={alt}
      className={`${className ?? ''} img-fluid`}
    />
  );
  return logo.link ? (
    <a href={logo.link} aria-label={alt || 'logo'}>
      {img}
    </a>
  ) : (
    img
  );
});

// ✅ Arreglo A: HeaderView consume loading/error y los representa en la UI
export default function HeaderView({
  logos = {},
  menuItems = [],
  alerta,
  loading = false,
  error = null,
}) {
  const { provincia, abc } = logos || {};
  const isLgUp = useIsLgUp();

  return (
    <header
      style={{ overflowX: isLgUp ? 'visible' : 'hidden' }}
      aria-busy={loading ? 'true' : 'false'}
    >
      {Boolean(alerta) && <div className={styles.alerta}>{alerta}</div>}

      {Boolean(error) && (
        <div role="status" className={styles.alerta}>
          No se pudo cargar completamente el encabezado.
        </div>
      )}

      {/* Faja superior de logos */}
      <div className="container-fluid py-2 py-md-3 py-lg-4">
        <div className="row g-0 align-items-center">
          <div className="col-12 col-lg-6">
            <Logo
              logo={provincia}
              className={`${styles['logo-provincia']} img-fluid`}
              fallbackAlt="Logo Provincia"
            />
          </div>
          <div className="d-none d-lg-flex col-lg-6 justify-content-end">
            <Logo
              logo={abc}
              className={`${styles['logo-abc']} img-fluid`}
              fallbackAlt="Logo ABC"
            />
          </div>
        </div>
      </div>

      {/* Navbar */}
      <Navbar
        expand="lg"
        className={styles['menu-navbar']}
        style={{ overflow: 'visible' }}
      >
        <Container
          fluid
          className="px-3 px-md-4 px-xl-5"
          style={{ overflow: 'visible' }}
        >
          {/* Toggle + ABC (mobile) */}
          <div className="d-flex align-items-center">
            <Navbar.Toggle aria-controls={NAV_ID} />
            <div className="d-lg-none ms-3 flex-shrink-1">
              <Logo
                logo={abc}
                className={styles['logo-abc']}
                fallbackAlt="Logo ABC"
              />
            </div>
          </div>

          {/* Collapse */}
          <Navbar.Collapse
            id={NAV_ID}
            className={`mt-2 mt-lg-0 ${styles.collapseFlex}`}
            style={{ overflow: 'visible' }}
          >
            <Menu items={menuItems} />

            {/* Buscador (desktop) */}
            <form
              role="search"
              className={`d-none d-lg-block ${styles['buscador']} ms-lg-4`}
              action="/buscar"
              method="get"
              onSubmit={handleSearchSubmit}
            >
              <label htmlFor="site-search-desktop" className="visually-hidden">
                Buscar contenido
              </label>
              <div className={styles['buscador-box']}>
                <input
                  id="site-search-desktop"
                  name="q"
                  type="search"
                  placeholder="Buscar contenido"
                  aria-label="Buscar contenido en el sitio"
                  className={styles['buscador-input']}
                  autoComplete="on"
                  enterKeyHint="search"
                  inputMode="search"
                />
                <button
                  type="submit"
                  aria-label="Buscar"
                  title="Buscar"
                  className={styles['buscador-btn']}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <circle cx="11" cy="11" r="7"></circle>
                    <line x1="17" y1="17" x2="21" y2="21"></line>
                  </svg>
                </button>
              </div>
            </form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile: buscador + redes */}
      <div className="container-fluid px-3 px-md-4 px-xl-5 pe-3 d-lg-none">
        <form
          role="search"
          className={`${styles['buscador']} mt-3`}
          action="/buscar"
          method="get"
          onSubmit={handleSearchSubmit}
        >
          <label htmlFor="site-search-mobile" className="visually-hidden">
            Buscar contenido
          </label>
          <div className={styles['buscador-box']}>
            <input
              id="site-search-mobile"
              name="q"
              type="search"
              placeholder="Buscar contenido"
              aria-label="Buscar contenido en el sitio"
              className={styles['buscador-input']}
              autoComplete="on"
              enterKeyHint="search"
              inputMode="search"
            />
            <button
              type="submit"
              aria-label="Buscar"
              title="Buscar"
              className={styles['buscador-btn']}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <circle cx="11" cy="11" r="7"></circle>
                <line x1="17" y1="17" x2="21" y2="21"></line>
              </svg>
            </button>
          </div>
        </form>

        <div className={`mt-3 ${styles.headerRedes}`}>
          <RedesSociales variant="header" className={styles.redesInline} />
        </div>
      </div>
    </header>
  );
}