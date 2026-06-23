import { NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  ['Dashboard', '/admin', 'M3 12l9-9 9 9M5 10v10h14V10'],
  ['Riders', '/admin/riders', 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z'],
  ['Media', '/admin/media', 'M3 3h18v18H3zM3 15l5-5 4 4 5-5 4 4'],
  ['Rides', '/admin/rides', 'M3 12h18M3 6h18M3 18h18'],
  ['Inbox', '/admin/inbox', 'M22 12h-6l-2 3h-4l-2-3H2M5 5h14l3 7v6H2v-6z'],
];

export default function AdminLayout() {
  const { admin, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-onyx text-mist">Loading…</div>;
  }
  if (!admin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex min-h-screen bg-onyx text-cloud">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-slate-card/40 p-5 md:flex">
        <div className="mb-8 flex items-center gap-2 px-2">
          <img src="/moto.svg" alt="" className="h-7 w-7" />
          <span className="font-heading text-lg font-bold">PARIJAIYI</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map(([label, to, d]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-amber-glow text-onyx' : 'text-mist hover:bg-white/5 hover:text-cloud'
                }`
              }
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => { logout(); navigate('/admin/login'); }}
          className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-mist transition hover:bg-white/5 hover:text-red-400"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
          Sign out
        </button>
      </aside>

      {/* Content */}
      <div className="flex-1">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-white/5 p-4 md:hidden">
          <span className="font-heading font-bold">PARIJAIYI Admin</span>
          <button onClick={() => { logout(); navigate('/admin/login'); }} className="text-sm text-mist">Sign out</button>
        </header>
        {/* Mobile nav */}
        <nav className="flex gap-1 overflow-x-auto border-b border-white/5 p-2 md:hidden">
          {NAV.map(([label, to]) => (
            <NavLink key={to} to={to} end={to === '/admin'}
              className={({ isActive }) => `whitespace-nowrap rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-amber-glow text-onyx' : 'text-mist'}`}>
              {label}
            </NavLink>
          ))}
        </nav>

        <main className="p-5 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
