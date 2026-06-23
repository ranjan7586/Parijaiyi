import { motion } from 'framer-motion';
import { fadeUp } from '../lib/animations';

const FALLBACK = 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80';

export default function RiderCard({ rider }) {
  return (
    <motion.div variants={fadeUp} className="group [perspective:1200px]">
      <div className="relative h-96 w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* ── Front ── */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl border border-white/5 [backface-visibility:hidden]">
          <img
            src={rider.imageUrl || FALLBACK}
            alt={rider.name}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={(e) => (e.currentTarget.src = FALLBACK)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/30 to-transparent" />
          <div className="absolute bottom-0 p-6">
            <h3 className="font-heading text-2xl font-bold text-cloud">{rider.name}</h3>
            <p className="text-sm text-amber-glow">{rider.bike}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-mist">{rider.experience}</p>
          </div>
          <span className="absolute right-4 top-4 rounded-full bg-onyx/70 px-3 py-1 text-[11px] text-mist backdrop-blur">
            Hover to flip
          </span>
        </div>

        {/* ── Back ── */}
        <div className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-amber-glow/20 bg-slate-card p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div>
            <h3 className="font-heading text-2xl font-bold text-cloud">{rider.name}</h3>
            <p className="text-sm text-amber-glow">{rider.profession}</p>
            <p className="mt-4 text-sm leading-relaxed text-mist">{rider.bio}</p>
          </div>
          <div>
            {rider.quote && (
              <p className="border-l-2 border-amber-glow pl-3 text-sm italic text-cloud">
                “{rider.quote}”
              </p>
            )}
            {rider.favoriteDestination && (
              <p className="mt-4 flex items-center gap-2 text-xs text-mist">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Happiest in <span className="text-cloud">{rider.favoriteDestination}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
