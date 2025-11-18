// Stub: cuando haya endpoint, acá se hace fetch real.
export function useHeaderAlert() {
  return {
    status: 'empty',   // 'loading' | 'success' | 'error' | 'empty'
    message: null,     // futuro: string del mensaje de alerta
    error: null,
  };
}
