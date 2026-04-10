import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const r = await login(email, password);
      if (!r.ok) setError(r.error || 'invalid credentials');
    } catch { setError('connection failed'); }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '8px 12px', fontSize: '0.72rem', background: '#18181b',
    border: '1px solid #27272a', borderRadius: 6, color: '#fafafa', fontFamily: 'inherit',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#09090b' }}>
      <div className="fade-in" style={{ width: 320, padding: 28, background: '#111113', borderRadius: 10, border: '1px solid #1c1c1f' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 38, height: 38, background: '#1e1b4b', color: '#6366f1',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 14, borderRadius: 8, border: '1px solid #312e81', marginBottom: 10,
          }}>33</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fafafa' }}>33 Tools</div>
          <div style={{ fontSize: '0.58rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>content engine</div>
        </div>
        {error && (
          <div style={{ background: '#1c1017', color: '#f87171', padding: '8px 12px', borderRadius: 6, fontSize: '0.65rem', marginBottom: 14, border: '1px solid #3a1520' }}>{error}</div>
        )}
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontSize: '0.52rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontWeight: 500 }}>email</div>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@33labs.io" style={inputStyle} required />
          </div>
          <div>
            <div style={{ fontSize: '0.52rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontWeight: 500 }}>password</div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="........" style={inputStyle} required />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '8px 14px', fontSize: '0.68rem', borderRadius: 6, border: 'none',
            background: '#6366f1', color: '#fafafa', cursor: 'pointer', fontFamily: 'inherit',
            fontWeight: 500, marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>{loading ? <span className="spinner" /> : 'sign in'}</button>
        </form>
      </div>
    </div>
  );
}
