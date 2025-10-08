const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// PUBLIC_INTERFACE
export function validateCheckout({ name, email, address }) {
  /** Validates checkout form, returns error string or empty when valid. */
  if (!name || name.trim().length < 2) return 'Please enter your full name.';
  if (!emailRe.test(email || '')) return 'Please enter a valid email address.';
  if (!address || address.trim().length < 5) return 'Please provide a delivery address.';
  return '';
}
