import { useEffect, useState } from 'react';
import MenuCard from '../components/MenuCard';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';
import { menuService } from '../services/menuService';
import { useCart } from '../store/cartContext';

// PUBLIC_INTERFACE
export default function Menu() {
  /** Menu page fetching items and allowing add to cart */
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    setStatus('loading');
    menuService.getMenu()
      .then((res) => { setItems(res); setStatus('success'); })
      .catch((e) => { setError(e.message || 'Failed to load menu'); setStatus('error'); });
  }, []);

  const onAdd = (item) => addItem(item, 1);

  if (status === 'loading') return <Loader text="Loading menu..." />;
  if (status === 'error') return <ErrorState message={error} actionText="Retry" onAction={() => window.location.reload()} />;

  return (
    <div>
      <div className="section-header">
        <h2 style={{margin: '8px 0'}}>Menu</h2>
      </div>
      <div className="grid grid-3">
        {items.map((it) => (
          <MenuCard key={it.id} item={it} onAdd={onAdd} />
        ))}
      </div>
    </div>
  );
}
