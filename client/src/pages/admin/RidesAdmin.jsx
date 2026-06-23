import { useEffect, useState } from 'react';
import api from '../../lib/api';

const EMPTY = { title: '', date: '', description: '', status: 'upcoming', location: '', lat: '', lng: '' };

export default function RidesAdmin() {
  const [rides, setRides] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/rides').then((r) => setRides(r.data));
  useEffect(() => { load(); }, []);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const reset = () => { setForm(EMPTY); setEditing(null); };

  const startEdit = (r) => {
    setEditing(r._id);
    setForm({
      title: r.title, date: r.date ? r.date.slice(0, 10) : '', description: r.description,
      status: r.status, location: r.location || '', lat: r.lat ?? '', lng: r.lng ?? '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, lat: form.lat === '' ? undefined : Number(form.lat), lng: form.lng === '' ? undefined : Number(form.lng) };
    try {
      if (editing) await api.put(`/rides/${editing}`, payload);
      else await api.post('/rides', payload);
      reset();
      load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this ride?')) return;
    await api.delete(`/rides/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold">Rides</h1>
      <p className="mt-1 text-mist">Plan upcoming rides and pin conquered places on the map.</p>

      <form onSubmit={submit} className="card mt-6 grid gap-4 p-6 md:grid-cols-2">
        <h2 className="font-heading text-lg font-bold md:col-span-2">{editing ? 'Edit ride' : 'Add a ride'}</h2>
        <input required className="input" placeholder="Title" value={form.title} onChange={update('title')} />
        <input type="date" className="input" value={form.date} onChange={update('date')} />
        <select className="input" value={form.status} onChange={update('status')}>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed (shows on map)</option>
        </select>
        <input className="input" placeholder="Location (e.g. Leh, Ladakh)" value={form.location} onChange={update('location')} />
        <input className="input" placeholder="Latitude (for map)" value={form.lat} onChange={update('lat')} />
        <input className="input" placeholder="Longitude (for map)" value={form.lng} onChange={update('lng')} />
        <textarea className="input md:col-span-2" placeholder="Description" value={form.description} onChange={update('description')} />
        <div className="flex gap-3 md:col-span-2">
          <button type="submit" disabled={saving} className="btn-amber disabled:opacity-60">{saving ? 'Saving…' : editing ? 'Update ride' : 'Add ride'}</button>
          {editing && <button type="button" onClick={reset} className="btn-ghost">Cancel</button>}
        </div>
      </form>

      <div className="mt-8 space-y-3">
        {rides.map((r) => (
          <div key={r._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg font-bold text-cloud">{r.title}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs ${r.status === 'completed' ? 'bg-green-500/15 text-green-400' : 'bg-amber-glow/15 text-amber-glow'}`}>{r.status}</span>
              </div>
              <p className="text-sm text-mist">{r.location} {r.date && `· ${new Date(r.date).toLocaleDateString()}`}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(r)} className="rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:border-amber-glow hover:text-amber-glow">Edit</button>
              <button onClick={() => remove(r._id)} className="rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:border-red-400 hover:text-red-400">Delete</button>
            </div>
          </div>
        ))}
        {rides.length === 0 && <p className="text-mist">No rides yet.</p>}
      </div>
    </div>
  );
}
