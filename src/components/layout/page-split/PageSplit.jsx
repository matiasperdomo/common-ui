import React, { useMemo } from 'react';
import PageSplitView from './PageSplitView';

/**
 * Container que inyecta variables CSS y pasa slots.
 *
 * Props clave:
 *  - withPanel = true
 *  - breadcrumb: ReactNode (afuera del panel blanco, sobre gris)
 *  - right: ReactNode (columna derecha, sobre gris)
 *  - panelInnerClassName="container py-4" (interior del panel blanco)
 *  - splitHeight, panelMinHeight, panelTopGap (opcional)
 */
export default function PageSplit({
  splitHeight = 320,
  topColor,
  bottomColor,
  noFullBleed = false,
  withPanel = false,
  breadcrumb = null,
  panelClassName = '',
  panelInnerClassName = '',
  right = null,
  rightClassName = '',
  panelTopGap,
  panelBottomGap,
  panelMinHeight,
  contentClassName = '',
  className = '',
  style = {},
  children,
}) {
  const computedStyle = useMemo(() => {
    const v = {};
    if (splitHeight != null) v['--split-height'] = typeof splitHeight === 'number' ? `${splitHeight}px` : String(splitHeight);
    if (topColor) v['--split-top'] = topColor;
    if (bottomColor) v['--split-bottom'] = bottomColor;
    if (panelTopGap) v['--panel-top-gap'] = String(panelTopGap);
    if (panelBottomGap) v['--panel-bottom-gap'] = String(panelBottomGap);
    if (panelMinHeight) v['--panel-min-h'] = String(panelMinHeight);
    return { ...v, ...style };
  }, [splitHeight, topColor, bottomColor, panelTopGap, panelBottomGap, panelMinHeight, style]);

  return (
    <PageSplitView
      className={className}
      noFullBleed={noFullBleed}
      withPanel={withPanel}
      breadcrumb={breadcrumb}
      panelClassName={panelClassName}
      panelInnerClassName={panelInnerClassName}
      right={right}
      rightClassName={rightClassName}
      contentClassName={contentClassName}
    >
      <div style={computedStyle}>{children}</div>
    </PageSplitView>
  );
}
