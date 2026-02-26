import React from 'react';
import { useRedesSociales } from '../hooks/useRedesSociales';
import styles from './RedesSociales.module.css';

function getRedAlt(red) {
  // Si el hook ya trae alt (desde Solr), se deja tal cual.
  if (red?.alt) return red.alt;

  // Fallback por URL (solo si falta el alt).
  const href = (red?.enlace || '').toLowerCase();

  if (href.includes('facebook.com')) return 'Facebook';
  if (href.includes('twitter.com') || href.includes('x.com')) return 'X';
  if (href.includes('instagram.com')) return 'Instagram';
  if (href.includes('flickr.com')) return 'Flickr';
  if (href.includes('youtube.com') || href.includes('youtu.be')) return 'YouTube';

  return 'Red social institucional';
}

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
      {redes?.map((red) => {
        // Evita <a href={null|''}> si el endpoint viene incompleto.
        if (!red?.enlace) return null;

        const label = getRedAlt(red);

        return (
          <li key={red.id} className={styles.link}>
            <a
              href={red.enlace}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="clickable"
            >
              <img src={red.icono} alt={label} className={styles.icon} loading="lazy" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}