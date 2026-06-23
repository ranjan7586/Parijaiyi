import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-onyx px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card w-full max-w-md p-8"
      >
        <div className="mb-6 flex items-center gap-2">
          <img src="/moto.svg" alt="" className="h-8 w-8" />
          <span className="font-heading text-xl font-bold text-cloud">PARIJAIYI</span>
          <span className="ml-auto rounded-full bg-amber-glow/15 px-3 py-1 text-xs text-amber-glow">Admin</span>
        </div>
        <h1 className="font-heading text-2xl font-bold text-cloud">Welcome back, rider.</h1>
        <p className="mt-1 text-sm text-mist">Sign in to manage the flock.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <input type="email" required className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" required className="input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn-amber w-full disabled:opacity-60">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
