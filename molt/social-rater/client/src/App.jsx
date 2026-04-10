import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Sidebar from './components/Sidebar';
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

function ProtectedLayout() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-muted)' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 200, padding: '12px 16px', maxWidth: 'calc(100vw - 200px)' }}>
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
