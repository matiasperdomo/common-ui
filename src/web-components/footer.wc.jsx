import React from 'react';
import ReactDOM from 'react-dom/client';
import './_cdn-globals.js';
import Footer from '../components/footer/Footer.jsx';

class AppFooter extends HTMLElement {
  connectedCallback() {
    this._root = ReactDOM.createRoot(this);
    this._render();
  }

  disconnectedCallback() {
    this._root?.unmount();
    this._root = null;
  }

  static get observedAttributes() {
    return ['fallback'];
  }

  attributeChangedCallback() {
    if (this._root) this._render();
  }

  _render() {
    const fallback = this.getAttribute('fallback') || 'none';
    this._root.render(React.createElement(Footer, { fallback }));
  }
}

if (!customElements.get('app-footer')) {
  customElements.define('app-footer', AppFooter);
}
