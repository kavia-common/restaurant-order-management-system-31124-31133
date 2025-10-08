import QuantityStepper from './QuantityStepper';

// Inline SVG placeholder; shown only when no image or image fails to load
const FALLBACK_IMG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" role="img" aria-label="No image available"><rect width="100%" height="100%" rx="10" ry="10" fill="%23e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-size="14" font-family="Arial, Helvetica, sans-serif">No image</text></svg>';

/**
 * Normalize an image URL for safe rendering:
 * - Trim whitespace
 * - If running on https origin and the URL is http, attempt to upgrade to https to avoid mixed-content blocks
 * - Return empty string when not a plausible URL so caller can fallback
 */
function normalizeImageUrl(raw) {
  if (!raw || typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  try {
    // Allow data URLs as-is
    if (trimmed.startsWith('data:')) return trimmed;
    const onHttps = typeof window !== 'undefined' && window.location && window.location.protocol === 'https:';
    if (onHttps && trimmed.startsWith('http://')) {
      return trimmed.replace(/^http:\/\//i, 'https://');
    }
    return trimmed;
  } catch {
    return '';
  }
}

// PUBLIC_INTERFACE
export default function MenuCard({ item, onAdd }) {
  /** Card for menu item with add-to-cart and optional quantity control. */
  const origUrl = item?.imageUrl || item?.image_url || '';
  const normalizedUrl = normalizeImageUrl(origUrl);

  // Log suspicious or missing image URLs for easier debugging (e.g., BBQ Ribs)
  if (!origUrl || !origUrl.toString().trim()) {
    // eslint-disable-next-line no-console
    console.warn('[MenuCard] Missing image URL for item:', { id: item?.id, name: item?.name });
  } else if (normalizedUrl !== origUrl) {
    // eslint-disable-next-line no-console
    console.warn('[MenuCard] Normalized image URL to avoid mixed content/CORS issues:', {
      id: item?.id,
      name: item?.name,
      from: origUrl,
      to: normalizedUrl,
    });
  }

  const onImgError = (e) => {
    if (e?.target) {
      // prevent infinite loop when fallback fails for any reason
      e.target.onerror = null;
      // eslint-disable-next-line no-console
      console.warn('[MenuCard] Image failed to load, using fallback:', {
        id: item?.id,
        name: item?.name,
        attemptedSrc: normalizedUrl || '(empty)',
      });
      e.target.src = FALLBACK_IMG;
    } else {
      // eslint-disable-next-line no-console
      console.warn('[MenuCard] Image failed to load for item but no target element present:', {
        id: item?.id,
        name: item?.name,
      });
    }
  };

  return (
    <div className="surface menu-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="menu-card-media-wrap">
        <img
          className="menu-card-image"
          src={normalizedUrl || FALLBACK_IMG}
          onError={onImgError}
          alt={item?.name ? `${item.name} image` : 'Menu item image'}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
        />
        {item?.category ? (
          <span className="menu-card-category" aria-label={`Category ${item.category}`}>
            {item.category}
          </span>
        ) : null}
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 8 }}>
          <div>
            <h3 style={{ margin: '0 0 6px 0' }}>{item?.name}</h3>
            {item?.description && (
              <p className="small" style={{ margin: 0, color: 'var(--muted)' }}>
                {item.description}
              </p>
            )}
          </div>
          <div style={{ fontWeight: 800, color: 'var(--primary)' }}>${Number(item?.price || 0).toFixed(2)}</div>
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className="btn btn-primary"
            aria-label={`Add ${item?.name || 'item'} to cart`}
            onClick={() => onAdd(item, 1)}
          >
            Add to cart
          </button>

          {/* If parent passes quantity/onChange, show QuantityStepper (optional) */}
          {typeof item?.quantity === 'number' && item?.onQuantityChange && (
            <QuantityStepper
              value={item.quantity}
              onChange={item.onQuantityChange}
              min={0}
              max={99}
              label={`Quantity for ${item?.name || 'item'}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
