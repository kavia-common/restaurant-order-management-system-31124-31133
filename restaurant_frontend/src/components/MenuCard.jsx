import QuantityStepper from './QuantityStepper';

// PUBLIC_INTERFACE
export default function MenuCard({ item, onAdd }) {
  /** Card for menu item with add-to-cart and optional quantity control. */
  return (
    <div className="surface" style={{ padding: 16, display: 'flex', gap: 12 }}>
      {/* Optional image if provided */}
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.name}
          style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(17,24,39,0.08)' }}
        />
      )}

      <div style={{ flex: 1 }}>
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
