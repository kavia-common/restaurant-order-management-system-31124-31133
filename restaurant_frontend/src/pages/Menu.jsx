import { useEffect, useMemo, useState } from 'react';
import MenuCard from '../components/MenuCard';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';
import { menuService } from '../services/menuService';
import { useCart } from '../store/cartContext';

// PUBLIC_INTERFACE
export default function Menu() {
  /** Menu page fetching items, displaying images, and providing category filters */
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    setStatus('loading');
    menuService
      .getMenu()
      .then((res) => {
        setItems(res || []);
        setStatus('success');
      })
      .catch((e) => {
        setError(e.message || 'Failed to load menu');
        setStatus('error');
      });
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    (items || []).forEach((it) => {
      const c = (it.category || '').trim();
      if (c) set.add(c);
    });
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [items]);

  const filtered = useMemo(() => {
    let res = items;
    if (activeCategory && activeCategory !== 'All') {
      res = res.filter((it) => (it.category || '').trim() === activeCategory);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      res = res.filter(
        (it) =>
          it.name?.toLowerCase().includes(q) ||
          it.description?.toLowerCase().includes(q) ||
          (it.category || '').toLowerCase().includes(q)
      );
    }
    return res;
  }, [items, activeCategory, query]);

  const onAdd = (item) => addItem(item, 1);

  if (status === 'loading') return <Loader text="Loading menu..." />;
  if (status === 'error')
    return <ErrorState message={error} actionText="Retry" onAction={() => window.location.reload()} />;

  return (
    <div>
      <div className="section-header" style={{ alignItems: 'end', gap: 12, flexWrap: 'wrap' }}>
        <h2 style={{ margin: '8px 0' }}>Menu</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search (optional) */}
          <label htmlFor="menu-search" className="small" style={{ position: 'absolute', left: -10000 }}>
            Search menu
          </label>
          <input
            id="menu-search"
            className="input"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search menu items"
            style={{ maxWidth: 220 }}
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="category-filters" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        <div className="category-chips" role="tablist" aria-label="Filter by category" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {categories.map((c) => (
            <button
              key={c}
              className={`chip ${activeCategory === c ? 'chip-active' : ''}`}
              onClick={() => setActiveCategory(c)}
              aria-pressed={activeCategory === c}
              aria-label={`Filter by ${c}`}
              role="tab"
            >
              {c}
            </button>
          ))}
        </div>
        {/* Responsive select for small screens as an alternative control */}
        <div>
          <label htmlFor="category-select" className="small" style={{ marginRight: 8 }}>
            Category:
          </label>
          <select
            id="category-select"
            className="input"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            aria-label="Select category"
            style={{ minWidth: 160 }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-3 menu-grid">
        {filtered.map((it) => (
          <MenuCard key={it.id} item={it} onAdd={onAdd} />
        ))}
        {filtered.length === 0 && (
          <div className="surface" style={{ padding: 16 }}>
            <div className="small">No items match the current filters.</div>
          </div>
        )}
      </div>
    </div>
  );
}
