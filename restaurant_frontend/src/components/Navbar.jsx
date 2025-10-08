import { NavLink } from 'react-router-dom';
import { useCart } from '../store/cartContext';

// PUBLIC_INTERFACE
export default function Navbar() {
  /** Top navigation bar with links and cart count. */
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
