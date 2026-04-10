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
import Inbox from './pages/Inbox';
import './styles/global.css';

const tabs = [
  { to: '/discover', label: '🔭 discover' },
  { to: '/news', label: '📰 news' },
  { to: '/trending', label: '🔥 trending' },
  { to: '/', label: '🎯 today' },
  { to: '/videos', label: '🎬 videos' },
  { to: '/studio', label: '✍ studio' },
  { to: '/tools', label: '🛠 tools' },
  { to: '/vault', label: '💾 vault' },
  { to: '/accounts', label: '📊 accounts' },
  { to: '/engine', label: '⚡ engine' },
  { to: '/inbox', label: '📨 inbox' },
];

function Titlebar() {
  return (
    <div style={{
      height: 44, background: '#0c0c0e',
      borderBottom: '1px solid #1c1c1f',
      display: 'flex', alignItems: 'center', padding: '0 12px',
      flexShrink: 0, userSelect: 'none', gap: 0,
      zIndex: 200,
    }}>
      {/* Left — dots + brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 16, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fafafa', letterSpacing: '-0.01em' }}>33 Tools</span>
      </div>

      {/* Center — tabs as segmented control */}
      <nav style={{
        display: 'flex', gap: 1, flex: 1,
        background: '#111113', borderRadius: 7, padding: 2,
        overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        {tabs.map(({ to, label }) => (
          <NavLink key={to} to={to} end={to === '/'} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <span style={{
                padding: '5px 12px', fontSize: '0.62rem',
                borderRadius: 5, whiteSpace: 'nowrap',
                fontWeight: isActive ? 500 : 400,
                color: isActive ? '#fafafa' : '#52525b',
                background: isActive ? '#27272a' : 'transparent',
                boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
                transition: 'all 0.12s', cursor: 'pointer',
                display: 'block',
              }}>
                {label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function StatusBar() {
  return (
    <div style={{
      height: 20, background: '#0c0c0e',
      borderTop: '1px solid #1c1c1f',
      display: 'flex', alignItems: 'center',
      padding: '0 12px', gap: 14,
      fontSize: '0.55rem', color: '#3f3f46',
      flexShrink: 0,
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#4ade80' }} />
        connected
      </span>
      <span>social-rater</span>
      <span style={{ marginLeft: 'auto' }}>v1.0</span>
    </div>
  );
}

function ProtectedLayout() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#71717A', background: '#0A0A0A' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#0A0A0A' }}>
      <Titlebar />
      <main style={{ flex: 1, overflow: 'auto', padding: '8px 16px' }}>
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
          <Route path="/inbox" element={<Inbox />} />
        </Routes>
      </main>
      <StatusBar />
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
