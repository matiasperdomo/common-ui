import React from 'react';
import styles from './PageSplit.module.css';

/**
 * View presentacional (sin lógica).
 *
 * Props:
 *  - className, noFullBleed
 *  - withPanel: boolean (usa grid izquierda/derecha)
 *  - breadcrumb: ReactNode (se muestra sobre el gris, antes de las columnas)
 *  - panelClassName: clases extra para panel izquierdo (caja blanca)
 *  - panelInnerClassName: clases extra para .panel-inner (ej: "container py-4")
 *  - right: ReactNode (contenido columna derecha, sobre gris)
 *  - rightClassName: clases extra para .panel-right
 *  - contentClassName: (solo si withPanel=false)
 *  - children: contenido principal (va dentro del panel blanco)
 */
export default function PageSplitView({
  className = '',
  noFullBleed = false,
  withPanel = false,
  breadcrumb = null,
  panelClassName = '',
  panelInnerClassName = '',
  right = null,
  rightClassName = '',
  contentClassName = '',
  children,
}) {
  const wrapperClass = [
    styles['wrapper'],
    noFullBleed ? styles['no-full-bleed'] : '',
    className,
  ].filter(Boolean).join(' ');

  if (withPanel) {
    return (
      <div className={wrapperClass}>
        <div className={styles['panel-row']}>
          {breadcrumb && <div className={styles['breadcrumb-row']}>{breadcrumb}</div>}

          <div className={styles['panel-grid']}>
            <div className={[styles['panel-left'], panelClassName].filter(Boolean).join(' ')}>
              <div className={[styles['panel-inner'], panelInnerClassName].filter(Boolean).join(' ')}>
                {children}
              </div>
            </div>

            <aside className={[styles['panel-right'], rightClassName].filter(Boolean).join(' ')}>
              {right}
            </aside>
          </div>
        </div>
      </div>
    );
  }

  // Modo sin panel (no lo usas ahora)
  return (
    <div className={wrapperClass}>
      <div className={[styles['content'], contentClassName].filter(Boolean).join(' ')}>
        {children}
      </div>
    </div>
  );
}
