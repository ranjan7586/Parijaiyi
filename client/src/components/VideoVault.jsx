import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api';
import SectionHeading from './SectionHeading';
import { staggerParent, fadeUp } from '../lib/animations';

// Fallback reels (YouTube embeds) until real Cloudinary videos are uploaded.
const FALLBACK_VIDEOS = [
  { _id: 'v1', title: 'Spiti — The Cold Desert Edit', url: 'https://www.youtube.com/embed/S9bP72A2zP4', poster: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80' },
  { _id: 'v2', title: 'Ladakh Motovlog · Day 6', url: 'https://www.youtube.com/embed/ScMzIvxBSi4', poster: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80' },
  { _id: 'v3', title: 'Monsoon Coastal Run', url: 'https://www.youtube.com/embed/aqz-KE-bpKQ', poster: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?auto=format&fit=crop&w=800&q=80' },
];

function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false);
  const isEmbed = /youtube|vimeo|player/.test(video.url);

  return (
    <motion.div variants={fadeUp} className="card overflow-hidden">
      <div className="relative aspect-video bg-onyx">
        {playing ? (
          isEmbed ? (
            <iframe
              src={`${video.url}?autoplay=1`}
              title={video.title}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              className="h-full w-full"
            />
          ) : (
            <video src={video.url} controls autoPlay className="h-full w-full object-cover" />
          )
        ) : (
          <button onClick={() => setPlaying(true)} className="group relative h-full w-full">
            <img src={video.poster} alt={video.title} className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-amber-glow/90 text-onyx shadow-glow transition group-hover:scale-110">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading text-lg font-semibold text-cloud">{video.title}</h3>
      </div>
    </motion.div>
  );
}

export default function VideoVault() {
  const [videos, setVideos] = useState(FALLBACK_VIDEOS);

  useEffect(() => {
    api
      .get('/media', { params: { type: 'video' } })
      .then((res) => {
        if (res.data?.length)
          setVideos(res.data.map((v) => ({ ...v, poster: v.url.replace(/\.(mp4|mov|webm)$/, '.jpg') })));
      })
      .catch(() => {});
  }, []);

  return (
    <section id="videos" className="section-pad bg-slate-card/30">
      <div className="container-x">
        <SectionHeading
          center
          eyebrow="Video Vault"
          title="The ride, in motion."
          subtitle="Cinematic edits and motovlogs from the road."
        />
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3"
        >
          {videos.map((v) => (
            <VideoCard key={v._id} video={v} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
