export type NavHandler = (page: string, payload?: any) => void;

let handler: NavHandler | null = null;

export function onNavigate(h: NavHandler) {
  handler = h;
  return () => {
    if (handler === h) handler = null;
  };
}

export function navigate(page: string, payload?: any) {
  if (handler) {
    handler(page, payload);
  } else {
    // eslint-disable-next-line no-console
    console.warn('[navigator] no handler registered for navigation', page, payload);
  }
}
