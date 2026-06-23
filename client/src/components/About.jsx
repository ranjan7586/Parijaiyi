import { motion } from 'framer-motion';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import { staggerParent, fadeUp } from '../lib/animations';

const STATS = [
  ['12', 'Riders in the flock'],
  ['48', 'Expeditions ridden'],
  ['190k', 'Kilometres together'],
  ['9', 'States crossed'],
];

export default function About() {
  return (
    <section id="about" className="section-pad container-x">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="The Flock"
            title="Brothers bound by the horizon."
          />
          <Reveal className="mt-6 space-y-5 text-lg leading-relaxed text-mist">
            <p>
              <span className="text-cloud font-medium">Parijaiyi</span> — Bengali for{' '}
              <em className="text-amber-glow not-italic">migratory</em> — is what the birds are called
              when the season turns and they answer a pull they can't explain. We feel the same pull.
            </p>
            <p>
              We are a brotherhood of riders who chase that restlessness across mountain passes,
              coastlines and forgotten roads. We ride for the silence at 14,000 feet, for the chai at
              the next bend, and for the people who turn a journey into a home.
            </p>
            <p className="text-cloud">
              The destination is just an excuse. The flock is the reason.
            </p>
          </Reveal>
        </div>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-2 gap-5"
        >
          {STATS.map(([num, label]) => (
            <motion.div
              key={label}
              variants={fadeUp}
              className="card p-7 transition hover:border-amber-glow/40 hover:shadow-glow"
            >
              <div className="font-heading text-4xl font-bold text-amber-glow md:text-5xl">{num}</div>
              <div className="mt-2 text-sm text-mist">{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
