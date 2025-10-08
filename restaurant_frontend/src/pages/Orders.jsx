import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';
import StatusBadge from '../components/StatusBadge';
import { orderService } from '../services/orderService';
import { useLocation } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Orders() {
  /** Orders page showing recent orders */
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const location = useLocation();
  const placedId = location.state?.placed;

  useEffect(() => {
    setStatus('loading');
    orderService.listOrders()
      .then((res) => { setOrders(res); setStatus('success'); })
      .catch((e) => { setError(e.message || 'Failed to load orders'); setStatus('error'); });
  }, []);

  if (status === 'loading') return <Loader text="Loading orders..." />;
  if (status === 'error') return <ErrorState message={error} actionText="Retry" onAction={() => window.location.reload()} />;

  return (
    <div className="grid" style={{gap: 12}}>
      <div className="section-header">
        <h2 style={{marginTop: 0}}>Orders</h2>
        {placedId && <StatusBadge type="success" text={`Order placed: #${placedId}`} />}
      </div>
      {orders.length === 0 ? (
        <div className="surface" style={{padding: 24}}>No orders yet.</div>
      ) : (
        <div className="grid" style={{gap: 10}}>
          {orders.map((o) => (
            <div key={o.id} className="surface" style={{padding: 16}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div><strong>Order #{o.id}</strong> • {new Date(o.created_at).toLocaleString()}</div>
                <StatusBadge type={o.status === 'delivered' ? 'success' : 'info'} text={o.status} />
              </div>
              <ul>
                {o.items?.map((it, idx) => (
                  <li key={idx} className="small">{it.quantity} × {it.name} @ ${it.price.toFixed(2)}</li>
                ))}
              </ul>
              <div style={{textAlign: 'right', fontWeight: 800}}>Total: ${o.total.toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
