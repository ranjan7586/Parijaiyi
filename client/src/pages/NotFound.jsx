import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// A few wandering-themed lines; one is picked per visit.
const LOST_LINES = [
  'This road isn’t on any map.',
  'You’ve ridden past the edge of the known world.',
  'Wrong turn at the last mountain pass.',
  'Even migratory souls lose the trail sometimes.',
  'The GPS gave up. The adventure didn’t.',
];

export default function NotFound() {
  const [line, setLine] = useState(LOST_LINES[0]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setLine(LOST_LINES[Math.floor(Math.random() * LOST_LINES.length)]);
    const onMove = (e) => {
      // -1 … 1 across the viewport, for a subtle parallax tilt.
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-onyx px-5 text-center">
      {/* Backdrop: night road photo with heavy onyx wash */}
      <motion.div
        aria-hidden
        style={{ x: mouse.x * -18, y: mouse.y * -18 }}
        className="pointer-events-none absolute inset-0 -z-20"
      >
        <img
          src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="h-full w-full scale-110 object-cover opacity-30"
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-onyx/70 via-onyx/85 to-onyx" />

      {/* Ambient amber glow */}
      <motion.div
        aria-hidden
        animate={{ opacity: [0.25, 0.45, 0.25], scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-glow/20 blur-[110px]"
      />

      <div className="relative max-w-2xl">
        {/* Big 404 with a spinning compass standing in for the middle 0 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-3 md:gap-5"
          style={{ transform: `translate(${mouse.x * 8}px, ${mouse.y * 8}px)` }}
        >
          <span className="font-heading text-[7rem] font-bold leading-none text-cloud drop-shadow-[0_0_30px_rgba(245,166,35,0.25)] md:text-[11rem]">
            4
          </span>

          {/* Compass */}
          <span className="relative inline-grid h-28 w-28 place-items-center md:h-44 md:w-44">
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-amber-glow/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            />
            <span className="absolute inset-3 rounded-full border border-white/10" />
            {/* Compass needle */}
            <motion.svg
              viewBox="0 0 100 100"
              className="h-20 w-20 md:h-32 md:w-32"
              animate={{ rotate: [0, 18, -14, 25, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <polygon points="50,12 58,50 50,42 42,50" fill="#F5A623" />
              <polygon points="50,88 42,50 50,58 58,50" fill="#A0AEC0" />
              <circle cx="50" cy="50" r="4" fill="#F8F9FA" />
            </motion.svg>
          </span>

          <span className="font-heading text-[7rem] font-bold leading-none text-cloud drop-shadow-[0_0_30px_rgba(245,166,35,0.25)] md:text-[11rem]">
            4
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="eyebrow mt-4"
        >
          Off the map · পথ হারিয়ে
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-3 text-3xl font-bold md:text-5xl"
        >
          {line}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mx-auto mt-4 max-w-md text-lg text-mist"
        >
          The page you’re chasing has drifted off the route. But every wrong turn is just
          another story for the campfire. Let’s get you back to the flock.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/" className="btn-amber">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12l9-9 9 9M5 10v10h14V10" />
            </svg>
            Ride back home
          </Link>
          <Link to="/#gallery" className="btn-ghost">
            Explore the journey
          </Link>
        </motion.div>
      </div>

      {/* Animated road line at the bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="h-full w-full">
          <line x1="0" y1="70" x2="1200" y2="70" stroke="#1C1F26" strokeWidth="40" />
          <motion.line
            x1="0" y1="70" x2="1200" y2="70"
            stroke="#F5A623" strokeWidth="4" strokeDasharray="40 36"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -152 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
          />
        </svg>
        {/* Tiny rider chasing the horizon */}
        <motion.div
          className="absolute bottom-9 text-amber-glow"
          initial={{ x: '-10%' }}
          animate={{ x: '110%' }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="5.5" cy="17.5" r="3.5" />
            <circle cx="18.5" cy="17.5" r="3.5" />
            <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3.5 11.5L9 11l4-1 2 3h3" />
          </svg>
        </motion.div>
      </div>
    </main>
  );
}
