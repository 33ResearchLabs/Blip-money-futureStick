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

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="card fade-in" style={{ width: 320, padding: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, background: 'var(--accent-bg)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, borderRadius: 6, border: '1px solid var(--border2)', marginBottom: 8 }}>33</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>33 Tools</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>content engine</div>
        </div>
        {error && <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '6px 10px', borderRadius: 3, fontSize: 11, marginBottom: 12, border: '1px solid #3a1520' }}>{error}</div>}
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <label className="label">email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@33labs.io" style={{ width: '100%' }} required />
          </div>
          <div>
            <label className="label">password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="........" style={{ width: '100%' }} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
            {loading ? <span className="spinner" /> : 'sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
