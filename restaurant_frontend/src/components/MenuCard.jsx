import QuantityStepper from './QuantityStepper';

// PUBLIC_INTERFACE
export default function MenuCard({ item, onAdd }) {
  /** Card for menu item with add-to-cart and quantity control. */
  return (
    <div className="surface" style={{ padding: 16, display: 'flex', gap: 12 }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 8 }}>
          <div>
            <h3 style={{ margin: '0 0 6px 0' }}>{item.name}</h3>
            <p className="small" style={{ margin: 0, color: 'var(--muted)' }}>{item.description}</p>
          </div>
          <div style={{ fontWeight: 800, color: 'var(--primary)' }}>${item.price.toFixed(2)}</div>
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className="btn btn-primary"
            aria-label={`Add ${item.name} to cart`}
            onClick={() => onAdd(item, 1)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};
```

Explanation: Create QuantityStepper component for cart items
````write file="restaurant-order-management-system-31124-31133/restaurant_frontend/src/components/QuantityStepper.jsx"
import React from 'react';

// PUBLIC_INTERFACE
export default function QuantityStepper({ value, onChange, min = 0, max = 99, label }) {
  /** Accessible quantity stepper component. */
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  const onInput = (e) => {
    const v = parseInt(e.target.value || '0', 10);
    if (!Number.isNaN(v)) {
      onChange(Math.min(max, Math.max(min, v)));
    }
  };

  const inputId = React.useId();

  return (
    <div role="group" aria-label={label || 'Quantity control'} style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
      <button className="btn btn-outline" aria-label="Decrease quantity" onClick={dec} disabled={value <= min}>−</button>
      <label htmlFor={inputId} className="small" style={{position: 'absolute', left: -10000}}>Quantity</label>
      <input id={inputId} className="input" style={{width: 60, textAlign: 'center'}} type="number" value={value} min={min} max={max} onChange={onInput} />
      <button className="btn btn-outline" aria-label="Increase quantity" onClick={inc} disabled={value >= max}>+</button>
    </div>
  );
}
```

Explanation: Create StatusBadge component for order statuses
````write file="restaurant-order-management-system-31124-31133/restaurant_frontend/src/components/StatusBadge.jsx"
 // PUBLIC_INTERFACE
export default function StatusBadge({ type = 'info', text }) {
  /** Simple status badge by type: success, error, info */
  const typeClass = type === 'success' ? 'badge-success' : type === 'error' ? 'badge-error' : 'badge-info';
  return <span className={`badge ${typeClass}`} aria-live="polite">{text}</span>;
}
