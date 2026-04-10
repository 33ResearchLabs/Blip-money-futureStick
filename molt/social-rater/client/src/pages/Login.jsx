import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const d = await login(email, password);
      if (d.ok) navigate('/');
      else setError(d.error || 'Invalid credentials');
    } catch { setError('Network error'); }
    finally { setBusy(false); }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0c',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#0f1014',
        border: '1px solid #1c1e24',
        borderRadius: 6,
        padding: '24px 20px',
        width: 320,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 28, height: 28,
            background: '#1a1f2e',
            color: '#5b8aff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 11, borderRadius: 5,
            border: '1px solid #2a3346',
            fontFamily: 'monospace',
          }}>33</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#d6dde6' }}>33 Tools</div>
            <div style={{ fontSize: 9, color: '#5a606c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>sign in</div>
          </div>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,85,102,0.08)',
            border: '1px solid rgba(255,85,102,0.2)',
            borderRadius: 3,
            padding: '5px 8px',
            color: '#ff5566',
            fontSize: 11,
          }}>{error}</div>
        )}

        <input
          type="email" placeholder="email" value={email}
          onChange={e => setEmail(e.target.value)} required
          style={inputStyle}
        />
        <input
          type="password" placeholder="password" value={password}
          onChange={e => setPassword(e.target.value)} required
          style={inputStyle}
        />
        <button type="submit" disabled={busy} style={{
          padding: '6px',
          borderRadius: 3,
          border: '1px solid #2a3346',
          background: '#1a1f2e',
          color: '#5b8aff',
          fontWeight: 600,
          fontSize: 11,
          fontFamily: 'inherit',
          cursor: busy ? 'wait' : 'pointer',
          opacity: busy ? 0.6 : 1,
          transition: 'all 0.12s',
        }}>
          {busy ? 'signing in...' : 'sign in →'}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: '6px 8px',
  borderRadius: 3,
  border: '1px solid #1c1e24',
  background: '#15171d',
  color: '#d6dde6',
  fontSize: 11,
  fontFamily: "'SF Mono', 'JetBrains Mono', monospace",
  outline: 'none',
};
