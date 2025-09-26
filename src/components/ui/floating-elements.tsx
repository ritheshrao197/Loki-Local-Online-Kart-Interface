'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
}

export function FloatingElement({ 
  children, 
  className = '',
  delay = 0,
  duration = 2,
  distance = 10
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -distance, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

interface FloatingIconProps {
  icon: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
  rotation?: number;
}

export function FloatingIcon({ 
  icon, 
  className = '',
  delay = 0,
  duration = 3,
  distance = 15,
  rotation = 5
}: FloatingIconProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -distance, 0],
        rotate: [0, rotation, -rotation, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {icon}
    </motion.div>
  );
}

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
  rotation?: number;
}

export function FloatingCard({ 
  children, 
  className = '',
  delay = 0,
  duration = 4,
  distance = 8,
  rotation = 2
}: FloatingCardProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -distance, 0],
        rotate: [0, rotation, -rotation, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  );
}
