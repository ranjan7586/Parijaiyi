import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function InboxAdmin() {
  const [messages, setMessages] = useState([]);
  const [tab, setTab] = useState('all'); // all | contact | application

  const load = () => api.get('/messages').then((r) => setMessages(r.data));
  useEffect(() => { load(); }, []);

  const markRead = async (m) => {
    await api.patch(`/messages/${m._id}/read`, { read: !m.read });
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this message?')) return;
    await api.delete(`/messages/${id}`);
    load();
  };

  const shown = messages.filter((m) => tab === 'all' || m.type === tab);

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold">Inbox</h1>
      <p className="mt-1 text-mist">Contact messages and ride-along applications.</p>

      <div className="mt-6 flex gap-2">
        {[['all', 'All'], ['application', 'Applications'], ['contact', 'Contact']].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-full px-4 py-1.5 text-sm ${tab === k ? 'bg-amber-glow text-onyx' : 'text-mist hover:text-cloud'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {shown.map((m) => (
          <div key={m._id} className={`card p-5 ${!m.read ? 'border-amber-glow/30' : ''}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-lg font-bold text-cloud">{m.name}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${m.type === 'application' ? 'bg-amber-glow/15 text-amber-glow' : 'bg-white/10 text-mist'}`}>{m.type}</span>
                  {!m.read && <span className="h-2 w-2 rounded-full bg-amber-glow" title="Unread" />}
                </div>
                <p className="mt-1 text-sm text-mist">
                  {m.email && <span>{m.email} · </span>}
                  {m.phone && <span>{m.phone}</span>}
                </p>
              </div>
              <span className="text-xs text-mist">{new Date(m.createdAt).toLocaleString()}</span>
            </div>

            {m.type === 'application' && (
              <p className="mt-3 text-sm text-mist">
                <span className="text-cloud">Bike:</span> {m.bike || '—'} ·{' '}
                <span className="text-cloud">Experience:</span> {m.experience || '—'}
              </p>
            )}
            {m.message && <p className="mt-3 rounded-lg bg-onyx/50 p-3 text-sm text-cloud">{m.message}</p>}

            <div className="mt-4 flex gap-2">
              <button onClick={() => markRead(m)} className="rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:border-amber-glow hover:text-amber-glow">
                Mark as {m.read ? 'unread' : 'read'}
              </button>
              <button onClick={() => remove(m._id)} className="rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:border-red-400 hover:text-red-400">Delete</button>
            </div>
          </div>
        ))}
        {shown.length === 0 && <p className="text-mist">No messages.</p>}
      </div>
    </div>
  );
}
