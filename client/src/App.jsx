import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import RidersAdmin from './pages/admin/RidersAdmin';
import MediaAdmin from './pages/admin/MediaAdmin';
import RidesAdmin from './pages/admin/RidesAdmin';
import InboxAdmin from './pages/admin/InboxAdmin';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="riders" element={<RidersAdmin />} />
        <Route path="media" element={<MediaAdmin />} />
        <Route path="rides" element={<RidesAdmin />} />
        <Route path="inbox" element={<InboxAdmin />} />
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
