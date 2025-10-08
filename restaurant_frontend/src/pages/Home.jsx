import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Home() {
  /** Landing page with theme hero and quick links */
  return (
    <div className="grid" style={{gap: 20}}>
      <section className="surface" style={{padding: 24, background: 'linear-gradient(135deg, rgba(30,58,138,0.06), rgba(245,158,11,0.06))'}}>
        <h1 style={{marginTop: 0, marginBottom: 8}}>Welcome to NavyDine</h1>
        <p className="small" style={{marginTop: 0}}>Browse our curated corporate menu and place orders with ease.</p>
        <div style={{display: 'flex', gap: 10, marginTop: 12}}>
          <Link className="btn btn-primary" to="/menu" aria-label="Go to menu">View Menu</Link>
          <Link className="btn btn-outline" to="/orders" aria-label="Go to orders">View Orders</Link>
        </div>
      </section>

      <section className="grid grid-3">
        <div className="card" style={{padding: 16}}>
          <h3 style={{marginTop: 0}}>Corporate Classics</h3>
          <p className="small">Time-tested dishes with consistent quality.</p>
        </div>
        <div className="card" style={{padding: 16}}>
          <h3 style={{marginTop: 0}}>Fast Checkout</h3>
          <p className="small">Streamlined, secure payment and order confirmation.</p>
        </div>
        <div className="card" style={{padding: 16}}>
          <h3 style={{marginTop: 0}}>Reliable Tracking</h3>
          <p className="small">Follow your orders from the kitchen to your desk.</p>
        </div>
      </section>
    </div>
  );
}
