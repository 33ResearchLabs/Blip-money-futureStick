import { NavLink } from 'react-router-dom';
import { Compass, Newspaper, Flame, Target, Video, PenTool, Wrench, Archive, Users, Zap } from 'lucide-react';

const tabs = [
  { to: '/', icon: Target, label: 'today' },
  { to: '/discover', icon: Compass, label: 'discover' },
  { to: '/news', icon: Newspaper, label: 'news' },
  { to: '/trending', icon: Flame, label: 'trending' },
  { to: '/videos', icon: Video, label: 'videos' },
  { to: '/studio', icon: PenTool, label: 'studio' },
  { to: '/tools', icon: Wrench, label: 'tools' },
  { to: '/vault', icon: Archive, label: 'vault' },
  { to: '/accounts', icon: Users, label: 'accounts' },
  { to: '/engine', icon: Zap, label: 'engine' },
];

export default function Sidebar() {
  return (
    <aside style={{
      width: 200,
      minHeight: '100vh',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 100,
    }}>
      {/* Brand */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 24, height: 24,
          background: 'var(--accent-bg)',
          color: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 10,
          borderRadius: 4,
          border: '1px solid var(--border2)',
          letterSpacing: -0.5,
        }}>33</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>33 Tools</div>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>content engine</div>
        </div>
      </div>

      {/* Section label */}
      <div style={{ padding: '8px 12px 4px', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
        tools
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, padding: '0 4px' }}>
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={{ textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '5px 8px',
                fontSize: 11,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-bg)' : 'transparent',
                border: isActive ? '1px solid var(--border2)' : '1px solid transparent',
                borderRadius: 3,
                textDecoration: 'none',
                transition: 'all 0.1s',
                letterSpacing: '0.02em',
              }}>
                <Icon size={13} strokeWidth={isActive ? 2 : 1.5} />
                {label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '6px 12px', borderTop: '1px solid var(--border)', fontSize: 9, color: 'var(--text-muted)' }}>
        33labs.io
      </div>
    </aside>
  );
}
