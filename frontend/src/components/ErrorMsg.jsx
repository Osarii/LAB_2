export default function ErrorMsg({ error }) {
  if (!error) return null;
  return <div className="error-msg">{error}</div>;
}
