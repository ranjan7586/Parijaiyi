import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

const EMPTY = { name: '', phone: '', bike: '', experience: '', message: '' };

export default function JoinForm() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/messages', { type: 'application', ...form });
      setStatus('done');
      setForm(EMPTY);
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="join" className="section-pad container-x">
      <div className="card relative overflow-hidden p-8 md:p-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-glow/10 blur-3xl" />
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Join the Flock"
              title="Think you belong on the road with us?"
              subtitle="Tell us about yourself and your machine. If the road agrees, we'll be in touch."
            />
          </div>

          <Reveal>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input required className="input" placeholder="Your name" value={form.name} onChange={update('name')} />
                <input required className="input" placeholder="Phone number" value={form.phone} onChange={update('phone')} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="input" placeholder="Bike you own" value={form.bike} onChange={update('bike')} />
                <input className="input" placeholder="Riding experience (e.g. 4 yrs)" value={form.experience} onChange={update('experience')} />
              </div>
              <textarea className="input min-h-28 resize-none" placeholder="Why do you want to ride with Parijaiyi?" value={form.message} onChange={update('message')} />

              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileTap={{ scale: 0.97 }}
                className="btn-amber w-full disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending…' : 'Send Application'}
              </motion.button>

              {status === 'done' && (
                <p className="text-center text-sm text-green-400">
                  🏍️ Application received — welcome to the radar. We'll reach out soon.
                </p>
              )}
              {status === 'error' && (
                <p className="text-center text-sm text-red-400">
                  Something went wrong. Please try again or message us directly.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
