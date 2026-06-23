import Reveal from './Reveal';

export default function SectionHeading({ eyebrow, title, subtitle, center }) {
  return (
    <Reveal className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="heading-xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-mist">{subtitle}</p>}
    </Reveal>
  );
}
