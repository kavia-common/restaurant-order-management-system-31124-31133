import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../store/cartContext';
import { validateCheckout } from '../utils/validation';
import { paymentService } from '../services/paymentService';
import { orderService } from '../services/orderService';

// PUBLIC_INTERFACE
export default function Checkout() {
  /** Checkout form with validation and mock/supabase order creation */
  const { items, clear } = useCart();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const total = items.reduce((acc, it) => acc + it.price * it.quantity, 0) * 1.08;

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validateCheckout(form);
    if (err) { setError(err); return; }

    try {
      setStatus('processing');
      setError('');
      // Simulate payment
      await paymentService.charge(total, { name: form.name, email: form.email });
      // Create order
      const order = await orderService.createOrder({
        customer_name: form.name,
        customer_email: form.email,
        address: form.address,
        total,
        items: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
        status: 'placed'
      });
      clear();
      nav('/orders', { state: { placed: order?.id } });
    } catch (e2) {
      setError(e2.message || 'Failed to complete checkout');
    } finally {
      setStatus('idle');
    }
  };

  if (items.length === 0) {
    return <div className="surface" style={{padding: 24}}>Your cart is empty.</div>;
  }

  return (
    <div className="surface" style={{padding: 24, maxWidth: 720, margin: '0 auto'}}>
      <h2 style={{marginTop: 0}}>Checkout</h2>
      {error && (
        <div role="alert" className="card" style={{padding: 12, borderColor: 'rgba(220,38,38,0.25)'}}>
          <span style={{color: 'var(--error)'}}>⚠ {error}</span>
        </div>
      )}
      <form onSubmit={onSubmit} className="grid" style={{gap: 12}}>
        <div>
          <label htmlFor="name">Full name</label>
          <input id="name" className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" className="input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        </div>
        <div>
          <label htmlFor="address">Delivery address</label>
          <textarea id="address" className="input" rows="3" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>Total: <strong>${total.toFixed(2)}</strong></div>
          <button className="btn btn-primary" type="submit" disabled={status === 'processing'} aria-busy={status === 'processing'}>
            {status === 'processing' ? 'Processing…' : 'Pay & Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
