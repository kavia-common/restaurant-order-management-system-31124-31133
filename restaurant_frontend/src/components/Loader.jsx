 // PUBLIC_INTERFACE
export default function Loader({ text = 'Loading...' }) {
  /** Loading indicator */
  return (
    <div className="surface" style={{padding: 16, textAlign: 'center'}}>
      <div role="status" aria-busy="true">{text}</div>
    </div>
  );
}
