import QuantityStepper from './QuantityStepper';

const FALLBACK_IMG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120"><rect width="100%" height="100%" rx="10" ry="10" fill="%23e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-size="14" font-family="Arial, Helvetica, sans-serif">No image</text></svg>';

// PUBLIC_INTERFACE
export default function MenuCard({ item, onAdd }) {
  /** Card for menu item with add-to-cart and optional quantity control. */
  const imgSrc = item.imageUrl || null;

  const onImgError = (e) => {
    if (e?.target) {
      // Swap to inline placeholder on error and prevent loop
      e.target.onerror = null;
      e.target.src = FALLBACK_IMG;
    }
  };

  return (
    <div className="surface menu-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="menu-card-media-wrap">
        <img
          className="menu-card-image"
          src={imgSrc || FALLBACK_IMG}
          onError={onImgError}
          alt={item.name}
        />
        {item.category ? (
          <span className="menu-card-category" aria-label={`Category ${item.category}`}>
            {item.category}
          </span>
        ) : null}
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 8 }}>
          <div>
            <h3 style={{ margin: '0 0 6px 0' }}>{item.name}</h3>
            {item.description && (
              <p className="small" style={{ margin: 0, color: 'var(--muted)' }}>
                {item.description}
              </p>
            )}
          </div>
          <div style={{ fontWeight: 800, color: 'var(--primary)' }}>${Number(item.price || 0).toFixed(2)}</div>
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className="btn btn-primary"
            aria-label={`Add ${item.name} to cart`}
            onClick={() => onAdd(item, 1)}
          >
            Add to cart
          </button>

          {/* If parent passes quantity/onChange, show QuantityStepper (optional) */}
          {typeof item.quantity === 'number' && item.onQuantityChange && (
            <QuantityStepper
              value={item.quantity}
              onChange={item.onQuantityChange}
              min={0}
              max={99}
              label={`Quantity for ${item.name}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
