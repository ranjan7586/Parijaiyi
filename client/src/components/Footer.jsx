import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api';

const SOCIALS = [
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
    name: 'X',
    href: 'https://x.com',
    icon: <path d="M4 4l16 16M20 4L4 20" />,
  },
];

const EMPTY = { name: '', email: '', message: '' };

export default function Footer() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle');
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/messages', { type: 'contact', ...form });
      setStatus('done');
      setForm(EMPTY);
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer id="contact" className="border-t border-white/5 bg-slate-card/40">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr]">
        {/* Left: brand + contact form */}
        <div>
          <div className="flex items-center gap-2">
            <img src="/moto.svg" alt="" className="h-8 w-8" />
            <span className="font-heading text-2xl font-bold text-cloud">PARIJAIYI</span>
          </div>
          <p className="mt-4 max-w-md text-mist">
            The Migratory Souls. We ride to remember that the world is wide and the best stories
            happen between the petrol stops.
          </p>

          <form onSubmit={submit} className="mt-8 max-w-md space-y-3">
            <h4 className="font-heading text-lg text-cloud">Drop us a line</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <input required className="input" placeholder="Name" value={form.name} onChange={update('name')} />
              <input required type="email" className="input" placeholder="Email" value={form.email} onChange={update('email')} />
            </div>
            <textarea required className="input min-h-24 resize-none" placeholder="Your message" value={form.message} onChange={update('message')} />
            <button type="submit" disabled={status === 'sending'} className="btn-amber w-full disabled:opacity-60">
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>
            {status === 'done' && <p className="text-sm text-green-400">Thanks! We'll write back soon.</p>}
            {status === 'error' && <p className="text-sm text-red-400">Couldn't send — please retry.</p>}
          </form>
        </div>

        {/* Right: quick links + socials */}
        <div className="flex flex-col gap-8 md:items-end">
          <nav className="flex flex-wrap gap-x-8 gap-y-2 md:justify-end">
            {[
              ['The Flock', 'about'],
              ['Riders', 'riders'],
              ['Gallery', 'gallery'],
              ['Videos', 'videos'],
              ['Map', 'map'],
              ['Rides', 'rides'],
              ['Join', 'join'],
            ].map(([label, id]) => (
              <button
                key={id}
                onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm text-mist transition hover:text-amber-glow"
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex gap-4">
            {SOCIALS.map((s) => (
              <motion.a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.name}
                whileHover={{ y: -4 }}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-mist transition hover:border-amber-glow hover:text-amber-glow hover:shadow-glow"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {s.icon}
                </svg>
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-mist sm:flex-row">
          <p>© {new Date().getFullYear()} Parijaiyi · The Migratory Souls. All roads reserved.</p>
          <a href="/admin" className="transition hover:text-amber-glow">Admin</a>
        </div>
      </div>
    </footer>
  );
}
