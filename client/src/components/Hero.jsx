import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { PLACES } from '../data/mockData';
import api from '../lib/api';
import { cldPreview } from '../lib/cloudinary';

// ── Static hero backdrops ──────────────────────────────────────────────
// Edit this list to use your own fixed images (local /public paths or any
// CDN/Cloudinary URL). picsum.photos is used by default because, unlike
// images.unsplash.com, it isn't blocked by common ad-blockers.
const STATIC_SLIDES = [
  'https://picsum.photos/id/1018/1920/1080',
  'https://picsum.photos/id/1015/1920/1080',
  'https://picsum.photos/id/1019/1920/1080',
  'https://picsum.photos/id/1016/1920/1080',
];

/**
 * Resolve the hero slide image URLs.
 * @param {'static'|'api'} source
 *   - 'static' → return the fixed STATIC_SLIDES array (no network call)
 *   - 'api'    → fetch your gallery images from Cloudinary via the API
 * @returns {Promise<string[]>} list of image URLs
 */
export async function getHeroSlides(source = 'static') {
  if (source === 'api') {
    try {
      const res = await api.get('/media', { params: { type: 'image' } });
      const urls = (res.data || []).map((m) => cldPreview(m.url)).slice(0, 6);
      return urls.length ? urls : STATIC_SLIDES; // fall back if API has no images
    } catch {
      return STATIC_SLIDES; // fall back if the API is unreachable
    }
  }
  return STATIC_SLIDES;
}

/**
 * @param {{ source?: 'static'|'api' }} props
 *   Pass source="static" for the fixed array, or source="api" to pull from Cloudinary.
 */
export default function Hero({ source = 'static' }) {
  const [slides, setSlides] = useState(STATIC_SLIDES);
  const [index, setIndex] = useState(0);
  const { scrollY } = useScroll();
  // Parallax: the backdrop drifts slower than the page.
  const y = useTransform(scrollY, [0, 600], [0, 160]);
  const overlayOpacity = useTransform(scrollY, [0, 500], [1, 0.4]);

  // Load slides for the chosen source.
  useEffect(() => {
    let active = true;
    getHeroSlides(source).then((urls) => {
      if (active && urls.length) {
        setSlides(urls);
        setIndex(0);
      }
    });
    return () => {
      active = false;
    };
  }, [source]);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides]);

  return (
    <section id="hero" className="relative h-screen min-h-[640px] w-full overflow-hidden bg-onyx">
      {/* Parallax slider — all slides stacked, crossfaded by opacity.
          Note: this layer must NOT use a negative z-index, or the page's
          own bg-onyx background paints over the images. It sits at the base
          of the section's own stacking context (z-0) instead. */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        {slides.map((src, i) => (
          <motion.img
            key={src}
            src={src}
            alt="Riding the open road"
            aria-hidden={i !== index}
            initial={false}
            animate={{ opacity: i === index ? 1 : 0, scale: i === index ? 1 : 1.08 }}
            transition={{ opacity: { duration: 1.4, ease: 'easeInOut' }, scale: { duration: 6, ease: 'linear' } }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ))}
      </motion.div>

      {/* Cinematic gradient overlays */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-onyx/70 via-onyx/40 to-onyx"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-onyx/80 to-transparent" />

      {/* Content */}
      <div className="container-x relative z-10 flex h-full flex-col justify-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="eyebrow mb-5"
        >
          Parijaiyi · পরিযায়ী · The Migratory Souls
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          className="max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl lg:text-8xl"
        >
          We don't take trips.
          <br />
          <span className="text-amber-glow">Trips take us.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-7 text-xl text-cloud md:text-2xl"
        >
          <span className="text-mist">Riding through… </span>
          <span className="font-heading font-semibold text-amber-glow">
            <Typewriter words={PLACES} loop cursor cursorStyle="_" typeSpeed={90} deleteSpeed={50} delaySpeed={1600} />
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.6 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <button onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })} className="btn-amber">
            Explore the Journey
          </button>
          <button onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })} className="btn-ghost">
            Ride With Us
          </button>
        </motion.div>
      </div>

      {/* Slider dots */}
      <div className="absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? 'w-8 bg-amber-glow' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-mist"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </section>
  );
}
