import { Link } from 'react-router-dom';
import QuantityStepper from '../components/QuantityStepper';
import { useCart } from '../store/cartContext';

// PUBLIC_INTERFACE
export default function Cart() {
  /** Cart page with editable quantities and totals */
  const { items, updateQuantity, removeItem, clear } = useCart();
  const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <div className="surface" style={{padding: 24, textAlign: 'center'}}>
        <p>Your cart is empty.</p>
        <Link className="btn btn-primary" to="/menu">Browse menu</Link>
      </div>
    );
  }

  return (
    <div className="grid" style={{gap: 16}}>
      <div className="surface" style={{padding: 16}}>
        <h2 style={{marginTop: 0}}>Cart</h2>
        <div className="grid" style={{gap: 12}}>
          {items.map((it) => (
            <div key={it.id} className="card" style={{padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12}}>
              <div>
                <div style={{fontWeight: 700}}>{it.name}</div>
                <div className="small">${it.price.toFixed(2)} each</div>
              </div>
              <QuantityStepper
                value={it.quantity}
                onChange={(q) => updateQuantity(it.id, q)}
                min={0}
                max={99}
                label={`Quantity for ${it.name}`}
              />
              <div style={{fontWeight: 700}}>${(it.price * it.quantity).toFixed(2)}</div>
              <button className="btn btn-outline" onClick={() => removeItem(it.id)} aria-label={`Remove ${it.name}`}>Remove</button>
            </div>
          ))}
        </div>
      </div>

      <div className="surface" style={{padding: 16}}>
        <h3 style={{marginTop: 0}}>Summary</h3>
        <div className="grid" style={{gap: 6}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}><span className="small">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}><span className="small">Tax</span><span>${tax.toFixed(2)}</span></div>
          <hr className="hr" />
          <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 800}}><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>
        <div style={{display: 'flex', gap: 8, marginTop: 12}}>
          <Link className="btn btn-primary" to="/checkout">Proceed to Checkout</Link>
          <button className="btn btn-outline" onClick={clear}>Clear Cart</button>
        </div>
      </div>
    </div>
  );
}
