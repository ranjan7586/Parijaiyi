import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import SectionHeading from './SectionHeading';
import { MOCK_PHOTOS } from '../data/mockData';
import { useToast } from '../context/ToastContext';
import { cldThumb, cldPreview } from '../lib/cloudinary';

const TABS = ['All', 'Nature', 'The Road', 'Group Selfies', 'Abstracts', 'Candids'];

// ── Inline icons (Lucide shapes, no extra dependency) ──
const EyeIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const DownloadIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>
);
const CloseIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

// Pull the file down as a blob so the browser saves it instead of navigating away.
async function downloadImage(url, name = 'parijaiyi.jpg') {
  const res = await fetch(url, { mode: 'cors' });
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
}

export default function Gallery() {
  const [photos, setPhotos] = useState(MOCK_PHOTOS);
  const [tab, setTab] = useState('All');
  const [preview, setPreview] = useState(null); // the photo being previewed
  const { toast } = useToast();

  useEffect(() => {
    api
      .get('/media', { params: { type: 'image' } })
      .then((res) => res.data?.length && setPhotos(res.data))
      .catch(() => {});
  }, []);

  const filtered = useMemo(
    () => (tab === 'All' ? photos : photos.filter((p) => p.category === tab)),
    [photos, tab],
  );

  // Close preview on Escape.
  useEffect(() => {
    if (!preview) return;
    const onKey = (e) => e.key === 'Escape' && setPreview(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [preview]);

  // Download + celebratory toast.
  const handleDownload = async (photo) => {
    toast({
      title: 'Thank you for downloading! 🏍️',
      message: 'Your image will be downloaded shortly…',
      type: 'download',
    });
    try {
      const fileName = `parijaiyi-${(photo.category || 'image').toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.jpg`;
      await downloadImage(photo.url, fileName);
    } catch {
      window.open(photo.url, '_blank', 'noopener');
    }
  };

  return (
    <section id="gallery" className="section-pad container-x">
      <SectionHeading
        center
        eyebrow="The Gallery"
        title="Frames from the road."
        subtitle="Every photo is a mile we earned. Hover a frame to preview or download it."
      />

      {/* Category tabs */}
      <div className="mt-10 flex flex-wrap justify-center gap-2.5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative rounded-full px-5 py-2 text-sm font-medium transition ${
              tab === t ? 'text-onyx' : 'text-mist hover:text-cloud'
            }`}
          >
            {tab === t && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 -z-10 rounded-full bg-amber-glow"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            {t}
          </button>
        ))}
      </div>

      {/* Uniform grid — every tile is the same shape (square),
          so portrait and landscape uploads never break the layout. */}
      <motion.div layout className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence>
          {filtered.map((photo) => (
            <motion.figure
              key={photo._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="group relative aspect-square overflow-hidden rounded-xl border border-white/5 bg-slate-card"
            >
              <img
                src={cldThumb(photo.url)}
                alt={photo.title || photo.category}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-110"
              />

              {/* Hover overlay — darkens and reveals the two action icons */}
              <div className="absolute inset-0 flex items-center justify-center gap-3 bg-onyx/0 transition duration-300 group-hover:bg-onyx/45">
                {/* Preview (eye) */}
                <button
                  type="button"
                  onClick={() => setPreview(photo)}
                  aria-label="Preview image"
                  title="Preview"
                  className="grid h-12 w-12 translate-y-3 place-items-center rounded-full border border-white/20 bg-onyx/80 text-cloud opacity-0 backdrop-blur transition duration-300 hover:border-amber-glow hover:text-amber-glow group-hover:translate-y-0 group-hover:opacity-100"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>

                {/* Download */}
                <button
                  type="button"
                  onClick={() => handleDownload(photo)}
                  aria-label="Download image"
                  title="Download"
                  className="grid h-12 w-12 translate-y-3 place-items-center rounded-full border border-white/20 bg-amber-glow text-onyx opacity-0 shadow-glow backdrop-blur transition duration-300 hover:scale-105 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  <DownloadIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Category label slides up on hover */}
              <button
                type="button"
                onClick={() => setPreview(photo)}
                className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-onyx/95 to-transparent p-4 text-left text-sm font-semibold text-cloud transition duration-300 group-hover:translate-y-0"
              >
                <span className="text-amber-glow">●</span> {photo.category}
              </button>
            </motion.figure>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* ── Preview modal: smooth spring zoom-in ── */}
      <AnimatePresence>
        {preview && (
          <motion.div
            className="fixed inset-0 z-[1000] grid place-items-center bg-onyx/90 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreview(null)}
          >
            <motion.div
              className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-slate-card shadow-2xl"
              initial={{ scale: 0.82, y: 36, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 140, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={cldPreview(preview.url)}
                alt={preview.title || preview.category}
                className="max-h-[82vh] w-full object-contain"
              />

              <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-onyx/85 to-transparent p-4">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-cloud">
                  {preview.category}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownload(preview)}
                    aria-label="Download high-res"
                    title="Download High-Res"
                    className="grid h-10 w-10 place-items-center rounded-full bg-amber-glow text-onyx shadow-glow transition hover:scale-105"
                  >
                    <DownloadIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreview(null)}
                    aria-label="Close preview"
                    title="Close"
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-onyx/80 text-cloud transition hover:border-amber-glow hover:text-amber-glow"
                  >
                    <CloseIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
