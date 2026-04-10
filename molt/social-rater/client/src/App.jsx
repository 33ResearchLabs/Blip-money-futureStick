import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Today from './pages/Today';
import Discover from './pages/Discover';
import News from './pages/News';
import Trending from './pages/Trending';
import Videos from './pages/Videos';
import Studio from './pages/Studio';
import Tools from './pages/Tools';
import Vault from './pages/Vault';
import Accounts from './pages/Accounts';
import Engine from './pages/Engine';
import './styles/global.css';

const tabs = [
  { to: '/', label: '🎯 today' },
  { to: '/discover', label: '🔭 discover' },
  { to: '/news', label: '📰 news' },
  { to: '/trending', label: '🔥 trending' },
  { to: '/videos', label: '🎬 videos' },
  { to: '/studio', label: '✍ studio' },
  { to: '/tools', label: '🛠 tools' },
  { to: '/vault', label: '💾 vault' },
  { to: '/accounts', label: '📊 accounts' },
  { to: '/engine', label: '⚡ engine' },
];

function TopBar() {
  const { logout } = useAuth();
  return (
    <header style={{
      height: 44,
      background: '#050505',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      gap: 8,
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 200,
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8, flexShrink: 0 }}>
        <div style={{
          width: 24, height: 24,
          background: '#fff', color: '#000',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 9, borderRadius: 4,
        }}>33</div>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Tools</span>
      </div>

      {/* Tabs */}
      <nav style={{
        display: 'flex', gap: 1, flex: 1,
        overflowX: 'auto', scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        {tabs.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={{ textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <span style={{
                padding: '6px 12px',
                fontSize: 11,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? '#000' : 'var(--text-muted)',
                background: isActive ? '#fff' : 'transparent',
                borderRadius: 4,
                whiteSpace: 'nowrap',
                transition: 'all 0.1s',
                cursor: 'pointer',
                display: 'block',
              }}>
                {label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </header>
  );
}

function ProtectedLayout() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-muted)' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar />
      <main style={{ flex: 1, marginTop: 44, padding: '10px 14px', overflow: 'auto' }}>
        <Routes>
          <Route path="/" element={<Today />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/news" element={<News />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/engine" element={<Engine />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/33/app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
