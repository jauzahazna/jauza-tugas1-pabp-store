'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

// Wrapper for simple fade-up animation
export function FadeUp({ children, delay = 0, className = "" }: { children: ReactNode, delay?: number, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Wrapper for staggered grid animations (makes items pop up one by one)
export const MotionGrid = motion.div;
export const MotionItem = motion.div;