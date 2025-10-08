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
