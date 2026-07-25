'use client';

import { motion } from 'framer-motion';

interface FlipTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function FlipText({ text, className = '', delay = 0 }: FlipTextProps) {
  const letters = Array.from(text);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03, // 30ms stagger
        delayChildren: delay,
      },
    },
  };

  const letterVariants = {
    hidden: { 
      rotateX: -90, 
      opacity: 0, 
      transformOrigin: 'center bottom' 
    },
    visible: { 
      rotateX: 0, 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1] as any, // Custom cubic-bezier
      }
    },
  };

  return (
    <motion.h2 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={`flex flex-wrap justify-center font-black select-none ${className}`}
      style={{ perspective: 1000 }}
    >
      {letters.map((char, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          className="inline-block"
          style={{
            whiteSpace: char === ' ' ? 'pre' : 'normal',
            textShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.h2>
  );
}
