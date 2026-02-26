import React from 'react';
import { usePageBreadcrumb } from '../../hooks/usePageBreadcrumb';
import PageBreadcrumbView from './PageBreadcrumbView';

export default function PageBreadcrumb(props) {
  const { items, ariaLabel } = usePageBreadcrumb(props);
  return <PageBreadcrumbView items={items} ariaLabel={ariaLabel} className={props.className} />;
}
