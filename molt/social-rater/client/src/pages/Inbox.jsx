import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const ago = ms => { if(!ms) return '—'; const s=Math.floor((Date.now()-ms)/1000); if(s<60) return s+'s'; if(s<3600) return Math.floor(s/60)+'m'; if(s<86400) return Math.floor(s/3600)+'h'; return Math.floor(s/86400)+'d'; };
const typeIcons = { link: '🔗', video: '🎬', news: '📰', publish: '🚀' };
const actionColors = { review: '#5b8aff', publish: '#22c55e', remix: '#a855f7', discuss: '#f59e0b' };
const statusColors = { pending: '#f59e0b', read: '#5b8aff', done: '#22c55e' };

export default function Inbox() {
  const { user } = useAuth();
  const [tab, setTab] = useState('inbox'); // inbox, sent, send
  const [items, setItems] = useState([]);
  const [sentItems, setSentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  // Send form
  const [users, setUsers] = useState([]);
  const [toUser, setToUser] = useState('all');
  const [sendType, setSendType] = useState('link');
  const [sendAction, setSendAction] = useState('review');
  const [sendTitle, setSendTitle] = useState('');
  const [sendUrl, setSendUrl] = useState('');
  const [sendNote, setSendNote] = useState('');
  const [sending, setSending] = useState(false);

  const loadInbox = useCallback(async () => {
    setLoading(true);
    const d = await api.getShares(filter || undefined);
    setItems(d.items || []);
    setLoading(false);
  }, [filter]);

  const loadSent = useCallback(async () => {
    const d = await api.getSentShares();
    setSentItems(d.items || []);
  }, []);

  const loadUsers = useCallback(async () => {
    const d = await api.getShareUsers();
    setUsers(d.users || []);
  }, []);

  useEffect(() => { loadInbox(); loadUsers(); }, []);
  useEffect(() => { if (tab === 'sent') loadSent(); }, [tab]);
  useEffect(() => { loadInbox(); }, [filter]);

  const markRead = async (id) => {
    await api.markRead(id);
    loadInbox();
  };

  const markDone = async (id) => {
    await api.markDone(id);
    loadInbox();
  };

  const send = async () => {
    if (!sendTitle && !sendUrl) return;
    setSending(true);
    await api.sendShare({
      to_user: toUser,
      type: sendType,
      action: sendAction,
      title: sendTitle,
      url: sendUrl,
      note: sendNote,
    });
    setSendTitle(''); setSendUrl(''); setSendNote('');
    setSending(false);
    setTab('sent');
    loadSent();
  };

  const renderItem = (item, isSent) => (
    <div key={item.id} style={{
      display: 'grid', gridTemplateColumns: '30px 1fr 80px 70px 60px 50px 80px',
      gap: 8, padding: '8px 10px', borderBottom: '1px solid #111317',
      alignItems: 'center', fontSize: '0.62rem',
      background: item.status === 'pending' ? '#0c0e14' : 'transparent',
    }}>
      <span style={{ fontSize: 16 }}>{typeIcons[item.type] || '🔗'}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: item.status === 'pending' ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.url ? <a href={item.url} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{item.title || item.url}</a> : (item.title || '(no title)')}
        </div>
        {item.note && <div style={{ fontSize: '0.52rem', color: '#9ba3af', marginTop: 1 }}>💬 {item.note}</div>}
        <div style={{ fontSize: '0.48rem', color: '#5a606c', marginTop: 2 }}>
          {isSent ? `→ ${item.to_user}` : `from ${item.from_name || item.from_user}`} · {ago(item.created_at)}
        </div>
      </div>
      <div style={{ fontSize: '0.52rem', color: actionColors[item.action] || '#5a606c', fontWeight: 600, textTransform: 'uppercase' }}>
        {item.action}
      </div>
      <div style={{ fontSize: '0.52rem' }}>
        <span style={{ padding: '2px 6px', borderRadius: 3, background: (statusColors[item.status] || '#5a606c') + '15', color: statusColors[item.status] || '#5a606c', fontWeight: 600 }}>
          {item.status}
        </span>
      </div>
      <div style={{ fontSize: '0.5rem', color: '#5a606c' }}>{item.platform || item.type}</div>
      <div style={{ fontSize: '0.48rem', color: '#5a606c' }}>{ago(item.created_at)}</div>
      {!isSent && (
        <div style={{ display: 'flex', gap: 3 }}>
          {item.status === 'pending' && <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.48rem', padding: '2px 6px' }} onClick={() => markRead(item.id)}>✓ read</button>}
          {item.status !== 'done' && <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.48rem', padding: '2px 6px' }} onClick={() => markDone(item.id)}>✓ done</button>}
          {item.url && <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.48rem', padding: '2px 6px' }} onClick={() => window.open(item.url, '_blank')}>↗</button>}
        </div>
      )}
    </div>
  );

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 1, borderBottom: '1px solid var(--border)', marginBottom: 0, flexShrink: 0, alignItems: 'center' }}>
        <button className={`tab ${tab === 'inbox' ? 'active' : ''}`} onClick={() => setTab('inbox')}>📨 inbox</button>
        <button className={`tab ${tab === 'sent' ? 'active' : ''}`} onClick={() => setTab('sent')}>📤 sent</button>
        <button className={`tab ${tab === 'send' ? 'active' : ''}`} onClick={() => setTab('send')}>✉ send new</button>
        {tab === 'inbox' && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 3 }}>
            {['', 'pending', 'read', 'done'].map(f => (
              <button key={f} className={`tab ${filter === f ? 'active' : ''}`} style={{ fontSize: '0.5rem', padding: '3px 8px' }} onClick={() => setFilter(f)}>
                {f || 'all'}
              </button>
            ))}
            <button className="btn btn-ghost btn-sm" onClick={loadInbox}>↻</button>
          </div>
        )}
      </div>

      {/* INBOX */}
      {tab === 'inbox' && (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '30px 1fr 80px 70px 60px 50px 80px', gap: 8, padding: '5px 10px', fontSize: '0.48rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.1em', borderBottom: '1px solid var(--border)' }}>
            <div></div><div>item</div><div>action</div><div>status</div><div>type</div><div>when</div><div></div>
          </div>
          {loading && <div style={{ textAlign: 'center', padding: 40 }}><span className="spinner" /></div>}
          {!loading && items.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: '0.7rem' }}>inbox empty</div>}
          {!loading && items.map(it => renderItem(it, false))}
        </div>
      )}

      {/* SENT */}
      {tab === 'sent' && (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '30px 1fr 80px 70px 60px 50px 80px', gap: 8, padding: '5px 10px', fontSize: '0.48rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.1em', borderBottom: '1px solid var(--border)' }}>
            <div></div><div>item</div><div>action</div><div>status</div><div>type</div><div>when</div><div></div>
          </div>
          {sentItems.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: '0.7rem' }}>nothing sent yet</div>}
          {sentItems.map(it => renderItem(it, true))}
        </div>
      )}

      {/* SEND NEW */}
      {tab === 'send' && (
        <div style={{ flex: 1, padding: 14, maxWidth: 600 }}>
          <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10, fontWeight: 600 }}>send to team</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
              <div>
                <label className="label">to</label>
                <select value={toUser} onChange={e => setToUser(e.target.value)} style={{ width: '100%' }}>
                  <option value="all">everyone</option>
                  {users.filter(u => u.email !== user?.email).map(u => <option key={u.email} value={u.email}>{u.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">type</label>
                <select value={sendType} onChange={e => setSendType(e.target.value)} style={{ width: '100%' }}>
                  <option value="link">🔗 link</option>
                  <option value="video">🎬 video</option>
                  <option value="news">📰 news</option>
                  <option value="publish">🚀 publish request</option>
                </select>
              </div>
              <div>
                <label className="label">action needed</label>
                <select value={sendAction} onChange={e => setSendAction(e.target.value)} style={{ width: '100%' }}>
                  <option value="review">👀 review</option>
                  <option value="publish">🚀 publish</option>
                  <option value="remix">🔄 remix</option>
                  <option value="discuss">💬 discuss</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">title</label>
              <input value={sendTitle} onChange={e => setSendTitle(e.target.value)} placeholder="what is this about?" style={{ width: '100%' }} />
            </div>

            <div>
              <label className="label">url</label>
              <input value={sendUrl} onChange={e => setSendUrl(e.target.value)} placeholder="paste link..." style={{ width: '100%' }} />
            </div>

            <div>
              <label className="label">note (optional)</label>
              <textarea value={sendNote} onChange={e => setSendNote(e.target.value)} placeholder="any context for the team..." style={{ width: '100%', minHeight: 60, resize: 'vertical' }} />
            </div>

            <button className="btn btn-primary" onClick={send} disabled={sending} style={{ alignSelf: 'flex-start', padding: '8px 20px' }}>
              {sending ? '⏳ sending...' : '📨 send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
