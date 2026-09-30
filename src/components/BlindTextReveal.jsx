import React from 'react';
import { motion } from 'framer-motion';

/**
 * BlindTextReveal
 * Renders text with an architectural "blinds / louver" reveal effect upon scrolling into view.
 * The text emerges smoothly from beneath an overflow-hidden baseline slit ("выезжает снизу строки").
 */
export default function BlindTextReveal({
  children,
  className = '',
  innerClassName = '',
  as = 'div',
  delay = 0,
  duration = 0.75,
  yOffset = '105%',
  once = true,
  threshold = 0.15,
  inline = false,
  ...props
}) {
  const Component = motion[as] || motion.div;
  const displayClass = inline ? 'inline-block align-top' : 'block';

  return (
    <span className={`overflow-hidden ${displayClass} py-0.5 ${className}`}>
      <Component
        initial={{ y: yOffset, opacity: 0.05 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once, amount: threshold }}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1], // Smooth editorial luxury deceleration
        }}
        style={{ willChange: 'transform, opacity' }}
        className={`${innerClassName} ${displayClass}`}
        {...props}
      >
        {children}
      </Component>
    </span>
  );
}

/**
 * BlindLines
 * Splits an array of lines or phrases and reveals each sequentially like venetian blinds.
 */
export function BlindLines({
  lines = [],
  className = '',
  lineClassName = '',
  baseDelay = 0,
  stagger = 0.12,
  duration = 0.75,
}) {
  return (
    <div className={className}>
      {lines.map((line, idx) => (
        <div key={idx} className="overflow-hidden block py-0.5">
          <motion.div
            initial={{ y: '105%', opacity: 0.05 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration,
              delay: baseDelay + idx * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ willChange: 'transform, opacity' }}
            className={lineClassName}
          >
            {line}
          </motion.div>
        </div>
      ))}
    </div>
  );
}
