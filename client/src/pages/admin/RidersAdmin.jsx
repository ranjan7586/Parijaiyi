import { useEffect, useState } from 'react';
import api from '../../lib/api';

const EMPTY = { name: '', bike: '', experience: '', profession: '', favoriteDestination: '', quote: '', bio: '' };

export default function RidersAdmin() {
  const [riders, setRiders] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [editing, setEditing] = useState(null); // rider id or null
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const load = () => api.get('/riders').then((r) => setRiders(r.data));
  useEffect(() => { load(); }, []);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const reset = () => { setForm(EMPTY); setFile(null); setEditing(null); setErr(''); };

  const startEdit = (r) => {
    setEditing(r._id);
    setForm({ name: r.name, bike: r.bike, experience: r.experience, profession: r.profession, favoriteDestination: r.favoriteDestination, quote: r.quote, bio: r.bio });
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true); setErr('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('image', file);
      if (editing) await api.put(`/riders/${editing}`, fd);
      else await api.post('/riders', fd);
      reset();
      load();
    } catch (e2) {
      setErr(e2.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Remove this rider?')) return;
    await api.delete(`/riders/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold">Riders</h1>
      <p className="mt-1 text-mist">Add, edit and remove rider profiles.</p>

      {/* Form */}
      <form onSubmit={submit} className="card mt-6 grid gap-4 p-6 md:grid-cols-2">
        <h2 className="font-heading text-lg font-bold md:col-span-2">{editing ? 'Edit rider' : 'Add a rider'}</h2>
        <input required className="input" placeholder="Name" value={form.name} onChange={update('name')} />
        <input className="input" placeholder="Bike (e.g. KTM 390 Adventure)" value={form.bike} onChange={update('bike')} />
        <input className="input" placeholder="Experience (e.g. 6 yrs • 85,000 km)" value={form.experience} onChange={update('experience')} />
        <input className="input" placeholder="Profession" value={form.profession} onChange={update('profession')} />
        <input className="input" placeholder="Favourite destination" value={form.favoriteDestination} onChange={update('favoriteDestination')} />
        <input className="input" placeholder="Quote" value={form.quote} onChange={update('quote')} />
        <textarea className="input md:col-span-2" placeholder="Short bio" value={form.bio} onChange={update('bio')} />
        <div className="md:col-span-2">
          <label className="text-sm text-mist">Profile image {editing && '(leave empty to keep current)'}</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="mt-1 block w-full text-sm text-mist file:mr-4 file:rounded-full file:border-0 file:bg-amber-glow file:px-4 file:py-2 file:text-onyx" />
        </div>
        {err && <p className="text-sm text-red-400 md:col-span-2">{err}</p>}
        <div className="flex gap-3 md:col-span-2">
          <button type="submit" disabled={saving} className="btn-amber disabled:opacity-60">{saving ? 'Saving…' : editing ? 'Update rider' : 'Add rider'}</button>
          {editing && <button type="button" onClick={reset} className="btn-ghost">Cancel</button>}
        </div>
      </form>

      {/* List */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {riders.map((r) => (
          <div key={r._id} className="card overflow-hidden">
            {r.imageUrl && <img src={r.imageUrl} alt={r.name} className="h-44 w-full object-cover" />}
            <div className="p-4">
              <h3 className="font-heading text-lg font-bold text-cloud">{r.name}</h3>
              <p className="text-sm text-amber-glow">{r.bike}</p>
              <p className="mt-1 text-xs text-mist">{r.experience}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => startEdit(r)} className="rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:border-amber-glow hover:text-amber-glow">Edit</button>
                <button onClick={() => remove(r._id)} className="rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:border-red-400 hover:text-red-400">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {riders.length === 0 && <p className="text-mist">No riders yet.</p>}
      </div>
    </div>
  );
}
