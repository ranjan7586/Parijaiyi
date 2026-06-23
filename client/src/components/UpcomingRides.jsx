import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api';
import SectionHeading from './SectionHeading';
import { staggerParent, fadeUp } from '../lib/animations';
import { MOCK_RIDES } from '../data/mockData';

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA';

export default function UpcomingRides() {
  const [rides, setRides] = useState(MOCK_RIDES.upcoming);

  useEffect(() => {
    api
      .get('/rides', { params: { status: 'upcoming' } })
      .then((res) => res.data?.length && setRides(res.data))
      .catch(() => {});
  }, []);

  return (
    <section id="rides" className="section-pad bg-gradient-to-b from-slate-card/30 to-onyx">
      <div className="container-x">
        <SectionHeading
          eyebrow="The Road Ahead"
          title="Upcoming rides."
          subtitle="Throttle up. Here's where the flock heads next."
        />

        <motion.ol
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative mt-14 space-y-8 before:absolute before:left-[7px] before:top-2 before:h-full before:w-px before:bg-gradient-to-b before:from-amber-glow/60 before:to-transparent md:before:left-[9px]"
        >
          {rides.map((ride) => (
            <motion.li key={ride._id} variants={fadeUp} className="relative pl-10 md:pl-14">
              <span className="absolute left-0 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-amber-glow shadow-glow md:h-5 md:w-5">
                <span className="h-1.5 w-1.5 rounded-full bg-onyx" />
              </span>
              <div className="card p-6 transition hover:border-amber-glow/40">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-heading text-xl font-bold text-cloud">{ride.title}</h3>
                  <span className="rounded-full bg-amber-glow/15 px-3 py-1 text-xs font-medium text-amber-glow">
                    {fmtDate(ride.date)}
                  </span>
                </div>
                {ride.location && (
                  <p className="mt-1 text-sm text-amber-glow/80">📍 {ride.location}</p>
                )}
                <p className="mt-3 text-mist">{ride.description}</p>
              </div>
            </motion.li>
          ))}
          {rides.length === 0 && (
            <p className="pl-10 text-mist">No rides scheduled yet — check back soon.</p>
          )}
        </motion.ol>
      </div>
    </section>
  );
}
