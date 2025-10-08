let liveRegion;

// PUBLIC_INTERFACE
export function toast(message) {
  /** Minimal toast: console + aria-live */
  // eslint-disable-next-line no-console
  console.log('[Toast]', message);
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.style.position = 'fixed';
    liveRegion.style.bottom = '16px';
    liveRegion.style.right = '16px';
    liveRegion.style.background = 'rgba(17,24,39,0.9)';
    liveRegion.style.color = 'white';
    liveRegion.style.padding = '10px 12px';
    liveRegion.style.borderRadius = '10px';
    liveRegion.style.zIndex = '1000';
    document.body.appendChild(liveRegion);
  }
  liveRegion.textContent = message;
  setTimeout(() => { if (liveRegion) liveRegion.textContent = ''; }, 2000);
}
