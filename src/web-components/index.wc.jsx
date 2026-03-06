// Entry point del bundle CDN combinado.
// Registra todos los Web Components en un único archivo autocontenido.
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../globals.js';
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

if (!customElements.get('app-header')) customElements.define('app-header', AppHeader);
if (!customElements.get('app-footer')) customElements.define('app-footer', AppFooter);
