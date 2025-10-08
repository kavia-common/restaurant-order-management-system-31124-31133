import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function NotFound() {
  /** 404 fallback page */
  return (
    <div className="surface" style={{padding: 24, textAlign: 'center'}}>
      <h2>Page not found</h2>
      <p className="small">The page you are looking for might have been removed or is temporarily unavailable.</p>
      <Link className="btn btn-primary" to="/">Go Home</Link>
    </div>
  );
}
