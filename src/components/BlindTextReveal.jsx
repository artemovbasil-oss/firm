import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * BlindTextReveal
 * Renders text with an architectural "blinds / louver" reveal effect upon scrolling into view.
 * The text emerges smoothly from beneath an overflow-hidden baseline slit ("выезжает снизу строки").
 * - Positive rootMargin (+100px) pre-triggers the reveal so text is gracefully animating as it enters viewport.
 * - Opacity is kept solid (1) so text is masked exclusively by the overflow slit, preventing invisible ghost headings.
 * - Includes a defensive timeout fallback so content is guaranteed visible in all environments.
 */
export default function BlindTextReveal({
  children,
  className = '',
  innerClassName = '',
  as = 'div',
  delay = 0,
  duration = 0.7,
  yOffset = '100%',
  once = true,
  inline = false,
  ...props
}) {
  const ref = useRef(null);
  const [fallbackTriggered, setFallbackTriggered] = useState(false);
  
  const isInView = useInView(ref, { 
    once, 
    amount: 0,
    margin: '0px 0px 120px 0px'
  });

  useEffect(() => {
    // Defensive guarantee: ensure headings are never stuck invisible
    const timer = setTimeout(() => {
      setFallbackTriggered(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const shouldAnimate = isInView || fallbackTriggered;
  const Component = motion[as] || motion.div;
  const displayClass = inline ? 'inline-block align-top' : 'block';

  return (
    <div ref={ref} className={`overflow-hidden ${displayClass} py-0.5 ${className}`}>
      <Component
        initial={{ y: yOffset, opacity: 1 }}
        animate={shouldAnimate ? { y: 0, opacity: 1 } : { y: yOffset, opacity: 1 }}
        transition={{
          duration,
          delay: shouldAnimate && !fallbackTriggered ? delay : 0,
          ease: [0.16, 1, 0.3, 1], // Smooth editorial deceleration
        }}
        style={{ willChange: 'transform' }}
        className={`${innerClassName} ${displayClass}`}
        {...props}
      >
        {children}
      </Component>
    </div>
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
  stagger = 0.1,
  duration = 0.7,
}) {
  const ref = useRef(null);
  const [fallbackTriggered, setFallbackTriggered] = useState(false);
  
  const isInView = useInView(ref, { 
    once: true, 
    amount: 0,
    margin: '0px 0px 120px 0px'
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setFallbackTriggered(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const shouldAnimate = isInView || fallbackTriggered;

  return (
    <div ref={ref} className={className}>
      {lines.map((line, idx) => (
        <div key={idx} className="overflow-hidden block py-0.5">
          <motion.div
            initial={{ y: '100%', opacity: 1 }}
            animate={shouldAnimate ? { y: 0, opacity: 1 } : { y: '100%', opacity: 1 }}
            transition={{
              duration,
              delay: shouldAnimate && !fallbackTriggered ? baseDelay + idx * stagger : 0,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ willChange: 'transform' }}
            className={lineClassName}
          >
            {line}
          </motion.div>
        </div>
      ))}
    </div>
  );
}
