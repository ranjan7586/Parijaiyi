import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api';
import RiderCard from './RiderCard';
import SectionHeading from './SectionHeading';
import { staggerParent } from '../lib/animations';
import { MOCK_RIDERS } from '../data/mockData';

export default function RiderProfiles() {
  const [riders, setRiders] = useState(MOCK_RIDERS);

  useEffect(() => {
    api
      .get('/riders')
      .then((res) => res.data?.length && setRiders(res.data))
      .catch(() => {}); // keep mock data if API is down
  }, []);

  return (
    <section id="riders" className="section-pad bg-gradient-to-b from-onyx to-slate-card/30">
      <div className="container-x">
        <SectionHeading
          center
          eyebrow="The Riders"
          title="The souls behind the machines."
          subtitle="Different bikes, different lives — one direction. Hover a card to meet the rider."
        />

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {riders.map((rider) => (
            <RiderCard key={rider._id} rider={rider} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
