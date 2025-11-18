// PageBreadcrumbView.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function PageBreadcrumbView({ items, ariaLabel = 'breadcrumb', className = '' }) {
  return (
    <nav aria-label={ariaLabel}>
      <ol className={`breadcrumb mb-0 ${className}`}>
        {items.map((it, idx) => (
          <li
            key={idx}
            className={`breadcrumb-item ${it.active ? 'active' : ''}`}
            aria-current={it.active ? 'page' : undefined}
          >
            {it.ellipsis
              ? <span>…</span>
              : it.href
                ? <Link to={it.href}>{it.label}</Link>
                : it.label}
          </li>
        ))}
      </ol>
    </nav>
  );
}
