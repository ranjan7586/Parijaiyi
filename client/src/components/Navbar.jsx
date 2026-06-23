import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LINKS = [
  ['The Flock', 'about'],
  ['Riders', 'riders'],
  ['Gallery', 'gallery'],
  ['Videos', 'videos'],
  ['Map', 'map'],
  ['Rides', 'rides'],
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-onyx/85 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between md:h-20">
        <button onClick={() => go('hero')} className="flex items-center gap-2 group">
          <img src="/moto.svg" alt="" className="h-7 w-7" />
          <span className="font-heading text-lg font-bold tracking-wide text-cloud">
            PARIJAIYI
          </span>
        </button>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map(([label, id]) => (
            <li key={id}>
              <button
                onClick={() => go(id)}
                className="text-sm font-medium text-mist transition hover:text-amber-glow"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        <button onClick={() => go('join')} className="btn-amber hidden md:inline-flex !py-2 !px-5 text-sm">
          Join the Flock
        </button>

        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden text-cloud"
          aria-label="Menu"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-white/5 bg-onyx/95 backdrop-blur"
          >
            <ul className="container-x flex flex-col gap-1 py-4">
              {[...LINKS, ['Join the Flock', 'join']].map(([label, id]) => (
                <li key={id}>
                  <button
                    onClick={() => go(id)}
                    className="w-full rounded-lg px-3 py-3 text-left text-mist hover:bg-white/5 hover:text-amber-glow"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
