import React from 'react';
import ReactDOM from 'react-dom/client';
import './_cdn-globals.js';
import Header from '../components/header/Header.jsx';

class AppHeader extends HTMLElement {
  connectedCallback() {
    this._root = ReactDOM.createRoot(this);
    this._render();
  }

  disconnectedCallback() {
    this._root?.unmount();
    this._root = null;
  }

  static get observedAttributes() {
    return ['alerta'];
  }

  attributeChangedCallback() {
    if (this._root) this._render();
  }

  _render() {
    const alerta = this.getAttribute('alerta') || undefined;
    this._root.render(React.createElement(Header, { alerta }));
  }
}

if (!customElements.get('app-header')) {
  customElements.define('app-header', AppHeader);
}
