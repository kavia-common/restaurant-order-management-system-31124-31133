import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import { CartProvider } from './store/cartContext';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';
import StatusBadge from './components/StatusBadge';
import { useCart } from './store/cartContext';
import { isMockMode } from './services/supabaseClient';

function Navbar() {
  const { items } = useCart();
  const count = items.reduce((acc, it) => acc + it.quantity, 0);
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        <div className="brand" aria-label="Brand">
          <div className="brand-mark" aria-hidden="true" />
          <div>
            <div style={{fontSize: 18, lineHeight: 1, marginBottom: 2}}>NavyDine</div>
            <div className="small" style={{color: 'rgba(255,255,255,0.8)'}}>Classic Corporate</div>
          </div>
        </div>

        <div className="nav-links" role="menubar">
          <NavLink to="/" className="nav-link" role="menuitem">Home</NavLink>
          <NavLink to="/menu" className="nav-link" role="menuitem">Menu</NavLink>
          <NavLink to="/orders" className="nav-link" role="menuitem">Orders</NavLink>
          <NavLink to="/cart" className="nav-link btn btn-secondary" aria-label={`Cart with ${count} items`}>
            Cart ({count})
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Root app with router, theme, and providers. */
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />
        <main className="container" id="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <div style={{marginTop: 24, display: 'flex', justifyContent: 'center'}}>
            <StatusBadge
              type={isMockMode() ? 'error' : 'success'}
              text={
                isMockMode()
                  ? 'Data mode: Mock (set REACT_APP_SUPABASE_URL/KEY and restart to use Supabase)'
                  : 'Data mode: Supabase (live database in use)'
              }
            />
          </div>
        </main>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
