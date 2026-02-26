import React from 'react';
import HeaderView from './HeaderView';
import { useHeaderLogos } from '../../hooks/useHeaderLogos';
import { useMenu } from '../../hooks/useMenu';

export default function Header({ alerta }) {
  // Menú (soporta array o { data, status, error })
  const menuHook = useMenu();
  let menuItems = [];
  let menuStatus = 'success';
  let menuError = null;

  if (Array.isArray(menuHook)) {
    menuItems = menuHook;
  } else if (menuHook && typeof menuHook === 'object') {
    menuItems = menuHook.data ?? [];
    menuStatus = menuHook.status ?? 'success';
    menuError = menuHook.error ?? null;
  }

  // Logos (tu interfaz actual { status, data, error })
  const { status: logoStatus = 'idle', data: logos = null, error: logoError = null } = useHeaderLogos();

  // loading sólo bloquea si el hook EXPONE estado distinto de 'success'
  const loading = (logoStatus !== 'success') || (menuStatus !== 'success');
  const error = menuError || logoError;

  return (
    <HeaderView
      logos={logos || {}}
      menuItems={menuItems}
      alerta={alerta}
      loading={loading}
      error={error}
    />
  );
}