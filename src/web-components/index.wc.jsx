// Entry point del bundle CDN combinado.
// Registra todos los Web Components en un único archivo autocontenido.
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/tokens.css';
import { ensureEncodeSans } from '../utils/fonts.js';
ensureEncodeSans();
import Header from '../components/header/Header.jsx';
import Footer from '../components/footer/Footer.jsx';

class AppHeader extends HTMLElement {
  connectedCallback() {
    this._root = ReactDOM.createRoot(this);
    this._render();
  }
  disconnectedCallback() {
    this._root?.unmount();
    this._root = null;
  }
  static get observedAttributes() { return ['alerta']; }
  attributeChangedCallback() { if (this._root) this._render(); }
  _render() {
    const alerta = this.getAttribute('alerta') || undefined;
    this._root.render(React.createElement(Header, { alerta }));
  }
}

class AppFooter extends HTMLElement {
  connectedCallback() {
    this._root = ReactDOM.createRoot(this);
    this._render();
  }
  disconnectedCallback() {
    this._root?.unmount();
    this._root = null;
  }
  static get observedAttributes() { return ['fallback']; }
  attributeChangedCallback() { if (this._root) this._render(); }
  _render() {
    const fallback = this.getAttribute('fallback') || 'none';
    this._root.render(React.createElement(Footer, { fallback }));
  }
}

if (!customElements.get('abc-header')) customElements.define('abc-header', AppHeader);
if (!customElements.get('abc-footer')) customElements.define('abc-footer', AppFooter);

// Utilidades expuestas como window.CommonUI.xxx
export { formatFechaLongEs, formatFechaLargoES } from '../utils/dates.js';
export { getYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbUrl } from '../utils/youtube.js';
export { toAbsolute, toHref, normalizeDrupalFileUrl } from '../utils/drupal.js';
export { buildApiUrl, setApiBase } from '../utils/api.js';
export { ensureEncodeSans, ensureIconFontAwesome } from '../utils/fonts.js';
export * from '../utils/slug.js';
