import { useEffect, useState } from 'react';
import api from '../../lib/api';

const CATEGORIES = ['Nature', 'The Road', 'Group Selfies', 'Abstracts', 'Candids'];

export default function MediaAdmin() {
  const [media, setMedia] = useState([]);
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState('Nature');
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');
  const [filter, setFilter] = useState('all'); // all | image | video

  const load = () => api.get('/media').then((r) => setMedia(r.data));
  useEffect(() => { load(); }, []);

  const upload = async (e) => {
    e.preventDefault();
    if (!files.length) return;
    setUploading(true); setErr('');
    try {
      const fd = new FormData();
      [...files].forEach((f) => fd.append('files', f));
      fd.append('category', category);
      await api.post('/media', fd);
      setFiles([]);
      e.target.reset();
      load();
    } catch (e2) {
      setErr(e2.response?.data?.error || 'Upload failed — is Cloudinary configured?');
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this item?')) return;
    await api.delete(`/media/${id}`);
    load();
  };

  const shown = media.filter((m) => filter === 'all' || m.type === filter);

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold">Media Library</h1>
      <p className="mt-1 text-mist">Upload photos &amp; videos and tag them by category.</p>

      <form onSubmit={upload} className="card mt-6 grid gap-4 p-6 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <div>
          <label className="text-sm text-mist">Files (images or videos, up to 20)</label>
          <input type="file" multiple accept="image/*,video/*" onChange={(e) => setFiles(e.target.files)} className="mt-1 block w-full text-sm text-mist file:mr-4 file:rounded-full file:border-0 file:bg-amber-glow file:px-4 file:py-2 file:text-onyx" />
        </div>
        <div>
          <label className="text-sm text-mist">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input mt-1">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button type="submit" disabled={uploading || !files.length} className="btn-amber disabled:opacity-60">
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
        {err && <p className="text-sm text-red-400 sm:col-span-3">{err}</p>}
      </form>

      {/* Filter */}
      <div className="mt-8 flex gap-2">
        {['all', 'image', 'video'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm capitalize ${filter === f ? 'bg-amber-glow text-onyx' : 'text-mist hover:text-cloud'}`}>
            {f === 'all' ? 'All' : `${f}s`}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((m) => (
          <div key={m._id} className="card group relative overflow-hidden">
            {m.type === 'video'
              ? <video src={m.url} className="h-40 w-full object-cover" muted />
              : <img src={m.url} alt={m.category} className="h-40 w-full object-cover" />}
            <div className="flex items-center justify-between p-3 text-xs">
              <span className="rounded bg-amber-glow/15 px-2 py-0.5 text-amber-glow">{m.category}</span>
              <button onClick={() => remove(m._id)} className="text-mist hover:text-red-400">Delete</button>
            </div>
          </div>
        ))}
        {shown.length === 0 && <p className="text-mist">No media yet.</p>}
      </div>
    </div>
  );
}
