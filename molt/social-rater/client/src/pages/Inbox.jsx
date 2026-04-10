import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const ago = ms => { if(!ms) return '\u2014'; const s=Math.floor((Date.now()-ms)/1000); if(s<60) return s+'s'; if(s<3600) return Math.floor(s/60)+'m'; if(s<86400) return Math.floor(s/3600)+'h'; return Math.floor(s/86400)+'d'; };
const actionColors = { review: '#6366f1', publish: '#4ade80', remix: '#a855f7', discuss: '#fbbf24' };
const statusColors = { pending: '#fbbf24', read: '#6366f1', done: '#4ade80' };

const inputStyle = {
  width: '100%', padding: '6px 10px', fontSize: '0.65rem', background: '#18181b',
  border: '1px solid #27272a', borderRadius: 6, color: '#a1a1aa', fontFamily: 'inherit',
};

export default function Inbox() {
  const { user } = useAuth();
  const [tab, setTab] = useState('inbox');
  const [items, setItems] = useState([]);
  const [sentItems, setSentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

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

  const markRead = async (id) => { await api.markRead(id); loadInbox(); };
  const markDone = async (id) => { await api.markDone(id); loadInbox(); };

  const send = async () => {
    if (!sendTitle && !sendUrl) return;
    setSending(true);
    await api.sendShare({
      to_user: toUser, type: sendType, action: sendAction,
      title: sendTitle, url: sendUrl, note: sendNote,
    });
    setSendTitle(''); setSendUrl(''); setSendNote('');
    setSending(false);
    setTab('sent');
    loadSent();
  };

  const renderItem = (item, isSent) => (
    <div key={item.id} style={{
      display: 'flex', gap: 14, padding: '12px 8px',
      borderBottom: '1px solid #18181b',
      alignItems: 'flex-start', transition: 'background 0.12s',
      background: item.status === 'pending' ? '#0d0d0f' : 'transparent',
    }}
      onMouseOver={e => e.currentTarget.style.background = '#111113'}
      onMouseOut={e => e.currentTarget.style.background = item.status === 'pending' ? '#0d0d0f' : ''}
    >
      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '0.78rem', fontWeight: item.status === 'pending' ? 600 : 400, color: '#fafafa',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.35,
        }}>
          {item.url ? <a href={item.url} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{item.title || item.url}</a> : (item.title || '(no title)')}
        </div>
        {item.note && <div style={{ fontSize: '0.58rem', color: '#52525b', marginTop: 3 }}>{item.note}</div>}
        <div style={{ display: 'flex', gap: 6, marginTop: 4, fontSize: '0.55rem', color: '#3f3f46', alignItems: 'center' }}>
          <span>{isSent ? `to ${item.to_user}` : `from ${item.from_name || item.from_user}`}</span>
          <span>{'\u00b7'} {item.type}</span>
          <span>{'\u00b7'} {ago(item.created_at)}</span>
        </div>
      </div>

      {/* Action */}
      <span style={{ fontSize: '0.58rem', color: actionColors[item.action] || '#52525b', fontWeight: 600, textTransform: 'uppercase', flexShrink: 0 }}>
        {item.action}
      </span>

      {/* Status */}
      <span style={{ fontSize: '0.58rem', color: statusColors[item.status] || '#52525b', fontWeight: 500, flexShrink: 0, minWidth: 40 }}>
        {item.status}
      </span>

      {/* Actions */}
      {!isSent && (
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          {item.status === 'pending' && (
            <button onClick={() => markRead(item.id)} style={{
              padding: '4px 10px', fontSize: '0.55rem', borderRadius: 5, border: '1px solid #27272a',
              background: 'transparent', color: '#71717a', cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.12s',
            }}
              onMouseOver={e => { e.currentTarget.style.background = '#27272a'; e.currentTarget.style.color = '#fafafa'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#71717a'; }}
            >read</button>
          )}
          {item.status !== 'done' && (
            <button onClick={() => markDone(item.id)} style={{
              padding: '4px 10px', fontSize: '0.55rem', borderRadius: 5, border: '1px solid #27272a',
              background: 'transparent', color: '#71717a', cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.12s',
            }}
              onMouseOver={e => { e.currentTarget.style.background = '#27272a'; e.currentTarget.style.color = '#fafafa'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#71717a'; }}
            >done</button>
          )}
          {item.url && (
            <button onClick={() => window.open(item.url, '_blank')} style={{
              padding: '4px 10px', fontSize: '0.55rem', borderRadius: 5, border: '1px solid #27272a',
              background: 'transparent', color: '#71717a', cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.12s',
            }}
              onMouseOver={e => { e.currentTarget.style.background = '#27272a'; e.currentTarget.style.color = '#fafafa'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#71717a'; }}
            >{'\u2197'}</button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 4px', borderBottom: '1px solid #18181b', flexShrink: 0 }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fafafa', letterSpacing: '-0.01em' }}>Inbox</span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 2, background: '#18181b', borderRadius: 6, padding: 2 }}>
          {[['inbox', 'Inbox'], ['sent', 'Sent'], ['send', 'Send New']].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: '4px 12px', fontSize: '0.6rem', borderRadius: 4,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: tab === k ? '#27272a' : 'transparent',
              color: tab === k ? '#fafafa' : '#71717a',
              fontWeight: tab === k ? 500 : 400,
              transition: 'all 0.15s',
            }}>{label}</button>
          ))}
        </div>
        {tab === 'inbox' && (
          <>
            <div style={{ display: 'flex', gap: 2, background: '#18181b', borderRadius: 6, padding: 2 }}>
              {['', 'pending', 'read', 'done'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '4px 10px', fontSize: '0.55rem', borderRadius: 4,
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  background: filter === f ? '#27272a' : 'transparent',
                  color: filter === f ? '#fafafa' : '#71717a',
                  fontWeight: filter === f ? 500 : 400,
                  transition: 'all 0.15s',
                }}>{f || 'all'}</button>
              ))}
            </div>
            <button onClick={loadInbox} style={{
              padding: '5px 12px', fontSize: '0.6rem', borderRadius: 6, border: '1px solid #27272a',
              background: 'transparent', color: '#a1a1aa', cursor: 'pointer', fontFamily: 'inherit',
            }}>{'\u21bb'}</button>
          </>
        )}
      </div>

      {/* INBOX */}
      {tab === 'inbox' && (
        <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
          {loading && <div style={{ textAlign: 'center', padding: 60 }}><span className="spinner" /></div>}
          {!loading && items.length === 0 && <div style={{ textAlign: 'center', padding: 60, color: '#3f3f46', fontSize: '0.75rem' }}>inbox empty</div>}
          {!loading && items.map(it => renderItem(it, false))}
        </div>
      )}

      {/* SENT */}
      {tab === 'sent' && (
        <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
          {sentItems.length === 0 && <div style={{ textAlign: 'center', padding: 60, color: '#3f3f46', fontSize: '0.75rem' }}>nothing sent yet</div>}
          {sentItems.map(it => renderItem(it, true))}
        </div>
      )}

      {/* SEND NEW */}
      {tab === 'send' && (
        <div style={{ flex: 1, padding: 16, maxWidth: 600, overflowY: 'auto' }}>
          <div style={{ fontSize: '0.55rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14, fontWeight: 500 }}>send to team</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div>
                <div style={{ fontSize: '0.52rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontWeight: 500 }}>to</div>
                <select value={toUser} onChange={e => setToUser(e.target.value)} style={inputStyle}>
                  <option value="all">everyone</option>
                  {users.filter(u => u.email !== user?.email).map(u => <option key={u.email} value={u.email}>{u.name}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: '0.52rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontWeight: 500 }}>type</div>
                <select value={sendType} onChange={e => setSendType(e.target.value)} style={inputStyle}>
                  <option value="link">link</option>
                  <option value="video">video</option>
                  <option value="news">news</option>
                  <option value="publish">publish request</option>
                </select>
              </div>
              <div>
                <div style={{ fontSize: '0.52rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontWeight: 500 }}>action needed</div>
                <select value={sendAction} onChange={e => setSendAction(e.target.value)} style={inputStyle}>
                  <option value="review">review</option>
                  <option value="publish">publish</option>
                  <option value="remix">remix</option>
                  <option value="discuss">discuss</option>
                </select>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.52rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontWeight: 500 }}>title</div>
              <input value={sendTitle} onChange={e => setSendTitle(e.target.value)} placeholder="what is this about?" style={inputStyle} />
            </div>

            <div>
              <div style={{ fontSize: '0.52rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontWeight: 500 }}>url</div>
              <input value={sendUrl} onChange={e => setSendUrl(e.target.value)} placeholder="paste link..." style={inputStyle} />
            </div>

            <div>
              <div style={{ fontSize: '0.52rem', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontWeight: 500 }}>note (optional)</div>
              <textarea value={sendNote} onChange={e => setSendNote(e.target.value)} placeholder="any context for the team..." style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} />
            </div>

            <button onClick={send} disabled={sending} style={{
              alignSelf: 'flex-start', padding: '7px 20px', fontSize: '0.62rem', borderRadius: 6, border: 'none',
              background: '#6366f1', color: '#fafafa', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
            }}>{sending ? '...' : 'send'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
