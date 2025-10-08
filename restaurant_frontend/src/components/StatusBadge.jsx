 // PUBLIC_INTERFACE
export default function StatusBadge({ type = 'info', text }) {
  /** Simple status badge by type: success, error, info */
  const typeClass = type === 'success' ? 'badge-success' : type === 'error' ? 'badge-error' : 'badge-info';
  return <span className={`badge ${typeClass}`} aria-live="polite">{text}</span>;
}
