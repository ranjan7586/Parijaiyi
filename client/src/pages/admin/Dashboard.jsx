import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ riders: 0, photos: 0, videos: 0, rides: 0, messages: 0, unread: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/riders'),
      api.get('/media', { params: { type: 'image' } }),
      api.get('/media', { params: { type: 'video' } }),
      api.get('/rides'),
      api.get('/messages'),
    ])
      .then(([r, p, v, rd, m]) => {
        setStats({
          riders: r.data.length,
          photos: p.data.length,
          videos: v.data.length,
          rides: rd.data.length,
          messages: m.data.length,
          unread: m.data.filter((x) => !x.read).length,
        });
      })
      .catch(() => {});
  }, []);

  const cards = [
    ['Riders', stats.riders, '/admin/riders'],
    ['Photos', stats.photos, '/admin/media'],
    ['Videos', stats.videos, '/admin/media'],
    ['Rides', stats.rides, '/admin/rides'],
    ['Messages', stats.messages, '/admin/inbox'],
    ['Unread', stats.unread, '/admin/inbox'],
  ];

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
      <p className="mt-1 text-mist">A bird's-eye view of the flock.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map(([label, value, to]) => (
          <Link key={label} to={to} className="card p-5 transition hover:border-amber-glow/40 hover:shadow-glow">
            <div className="font-heading text-3xl font-bold text-amber-glow">{value}</div>
            <div className="mt-1 text-sm text-mist">{label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10 card p-6">
        <h2 className="font-heading text-xl font-bold">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/admin/riders" className="btn-ghost !py-2 text-sm">+ Add rider</Link>
          <Link to="/admin/media" className="btn-ghost !py-2 text-sm">+ Upload media</Link>
          <Link to="/admin/rides" className="btn-ghost !py-2 text-sm">+ Plan a ride</Link>
        </div>
      </div>
    </div>
  );
}
