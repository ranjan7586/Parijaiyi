import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '../lib/animations';

/**
 * Scroll-triggered reveal wrapper. Wrap any block to get a fade-up on enter.
 */
export default function Reveal({ children, variants = fadeUp, className = '', as = 'div', ...rest }) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
