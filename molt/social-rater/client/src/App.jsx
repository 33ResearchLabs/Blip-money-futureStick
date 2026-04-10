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
];

function Titlebar() {
  return (
    <div style={{
      height: 48, background: '#050505',
      borderBottom: '1px solid #262626',
      display: 'grid', gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center', padding: '0 16px',
      flexShrink: 0, userSelect: 'none', gap: 16,
      zIndex: 200, position: 'relative',
    }}>
      {/* Left — dots + brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, paddingLeft: 4 }}>
          {/* macOS dots */}
          <div style={{ display: 'flex', gap: 7 }}>
            <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FF5F57' }} />
            <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FEBC2E' }} />
            <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28C840' }} />
          </div>
          <div style={{
            width: 26, height: 26, background: '#fff', color: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '0.7rem', borderRadius: 6, letterSpacing: -0.5,
          }}>33</div>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff', letterSpacing: 0.3 }}>33 Tools</span>
          <span style={{ fontSize: '0.6rem', color: '#4a4a4a', padding: '2px 6px', border: '1px solid #262626', borderRadius: 4, marginLeft: 2 }}>v1.0</span>
        </div>
      </div>

      {/* Center — tabs */}
      <div style={{
        display: 'flex', gap: 2, justifyContent: 'center',
        background: '#0a0a0a', border: '1px solid #262626',
        borderRadius: 8, padding: 3,
        overflowX: 'auto', scrollbarWidth: 'none',
        flexShrink: 1, minWidth: 0,
      }}>
        {tabs.map(({ to, label }) => (
          <NavLink key={to} to={to} end={to === '/'} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <span style={{
                background: isActive ? '#fff' : 'transparent',
                color: isActive ? '#000' : '#71717A',
                fontFamily: 'inherit',
                fontSize: '0.72rem', fontWeight: isActive ? 500 : 400,
                padding: '7px 16px', borderRadius: 5,
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                gap: 7, transition: 'all .12s', whiteSpace: 'nowrap',
              }}>
                {label}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Right — clock */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
        <span style={{ fontSize: '0.7rem', color: '#71717A' }}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div style={{
      height: 22, background: '#060606',
      borderTop: '1px solid #262626',
      display: 'flex', alignItems: 'center',
      padding: '0 12px', gap: 16,
      fontSize: '0.6rem', color: '#4a4a4a',
      flexShrink: 0,
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22C55E' }} />
        online
      </span>
      <span>tool: social_rater</span>
      <span>api: anthropic</span>
      <span style={{ marginLeft: 'auto' }}>35.202.198.103</span>
      <span>utf-8</span>
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
      <main style={{ flex: 1, overflow: 'auto', padding: '10px 14px' }}>
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
