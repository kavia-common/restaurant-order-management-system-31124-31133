 // PUBLIC_INTERFACE
export default function ErrorState({ message = 'Something went wrong.', actionText, onAction }) {
  /** Error state with optional retry */
  return (
    <div className="surface" style={{padding: 16}}>
      <div role="alert" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12}}>
        <div style={{color: 'var(--error)', fontWeight: 700}}>⚠ {message}</div>
        {actionText && <button className="btn btn-outline" onClick={onAction}>{actionText}</button>}
      </div>
    </div>
  );
}
