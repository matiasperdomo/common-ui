// common-ui/src/components/RedesSociales.jsx
import React from 'react';
import { useRedesSociales } from '../hooks/useRedesSociales';
import styles from './RedesSociales.module.css';

export default function RedesSociales({ variant = 'default', className = '' }) {
  const { redes, loading, error } = useRedesSociales({});
  const rootClass = `${styles.wrapper} ${variant === 'sidebar' ? styles.sidebar : ''} ${className}`;

  if (loading) {
    return (
      <ul className={`list-unstyled m-0 ${rootClass}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={`sk-${i}`} className={styles.link}>
            <span className={styles.skeleton} />
          </li>
        ))}
      </ul>
    );
  }

  if (error) return null;

  return (
    <ul className={`list-unstyled m-0 ${rootClass}`} aria-label="Redes sociales institucionales">
      {redes?.map((red) => (
        <li key={red.id} className={styles.link}>
          <a
            href={red.enlace}
            target="_blank"
            rel="noopener noreferrer"
            title={red.alt || 'Red social'}
            className="clickable"
          >
            <img src={red.icono} alt={red.alt || ''} className={styles.icon} loading="lazy" />
          </a>
        </li>
      ))}
    </ul>
  );
}
