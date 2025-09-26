'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  delay?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
}

export function ScrollReveal({ 
  children, 
  direction = 'up',
  distance = 50,
  duration = 0.6,
  delay = 0,
  className = '',
  threshold = 0.1,
  once = true
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold, once });
  const controls = useAnimation();

  const directionMap = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  };

  useEffect(() => {
    if (isInView) {
      controls.start({
        x: 0,
        y: 0,
        opacity: 1,
        transition: {
          duration,
          delay,
          ease: "easeOut",
        },
      });
    } else if (!once) {
      controls.start({
        ...directionMap[direction],
        opacity: 0,
        transition: {
          duration: 0.3,
        },
      });
    }
  }, [isInView, controls, direction, distance, duration, delay, once]);

  return (
    <motion.div
      ref={ref}
      initial={{
        ...directionMap[direction],
        opacity: 0,
      }}
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggeredRevealProps {
  children: React.ReactNode[];
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  stagger?: number;
  className?: string;
  threshold?: number;
}

export function StaggeredReveal({ 
  children, 
  direction = 'up',
  distance = 50,
  duration = 0.6,
  stagger = 0.1,
  className = '',
  threshold = 0.1
}: StaggeredRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold, once: true });
  const controls = useAnimation();

  const directionMap = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  };

  useEffect(() => {
    if (isInView) {
      controls.start({
        x: 0,
        y: 0,
        opacity: 1,
        transition: {
          duration,
          ease: "easeOut",
          staggerChildren: stagger,
        },
      });
    }
  }, [isInView, controls, direction, distance, duration, stagger]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      className={className}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{
            ...directionMap[direction],
            opacity: 0,
          }}
          variants={{
            visible: {
              x: 0,
              y: 0,
              opacity: 1,
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
