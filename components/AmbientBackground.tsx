"use client";

import { motion } from "framer-motion";

const particles = Array.from({ length: 28 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 61) % 100}%`,
  size: 1 + (i % 3),
  delay: (i % 9) * 0.7,
  duration: 7 + (i % 6) * 1.4,
}));

export function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient-grid" />
      <div className="ambient-noise" />
      <svg className="aura-waves" viewBox="0 0 1600 900" preserveAspectRatio="none">
        <defs>
          <linearGradient id="auraBlue" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#1977ff" stopOpacity="0" />
            <stop offset=".28" stopColor="#4f8dff" stopOpacity=".55" />
            <stop offset=".62" stopColor="#7c5cff" stopOpacity=".78" />
            <stop offset="1" stopColor="#32d8ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="auraViolet" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7755ff" stopOpacity="0" />
            <stop offset=".45" stopColor="#875dff" stopOpacity=".55" />
            <stop offset=".72" stopColor="#35a7ff" stopOpacity=".72" />
            <stop offset="1" stopColor="#1e7cff" stopOpacity="0" />
          </linearGradient>
          <filter id="auraBlur"><feGaussianBlur stdDeviation="5" /></filter>
        </defs>
        <g className="aura-wave aura-wave-one" fill="none" filter="url(#auraBlur)">
          <path d="M-100 700 C180 510 350 850 610 675 S1080 450 1700 690" stroke="url(#auraBlue)" strokeWidth="18" />
          <path d="M-100 715 C170 525 365 875 625 700 S1100 470 1700 705" stroke="url(#auraBlue)" strokeWidth="4" />
        </g>
        <g className="aura-wave aura-wave-two" fill="none" filter="url(#auraBlur)">
          <path d="M-120 350 C160 540 310 250 560 420 S980 650 1320 350 S1540 250 1740 360" stroke="url(#auraViolet)" strokeWidth="15" />
          <path d="M-120 365 C150 550 315 270 565 438 S990 665 1325 365 S1550 265 1740 375" stroke="url(#auraViolet)" strokeWidth="3" />
        </g>
        <g className="aura-wave aura-wave-three" fill="none">
          <path d="M-80 760 C210 610 350 820 590 735 S980 550 1240 720 S1490 810 1690 650" stroke="url(#auraBlue)" strokeWidth="2" />
          <path d="M-80 775 C210 625 350 835 590 750 S980 565 1240 735 S1490 825 1690 665" stroke="url(#auraViolet)" strokeWidth="1" opacity=".55" />
        </g>
      </svg>
      <motion.div className="aurora aurora-one" animate={{ x: [0, 80, -30, 0], y: [0, -40, 25, 0], scale: [1, 1.08, .96, 1] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="aurora aurora-two" animate={{ x: [0, -70, 30, 0], y: [0, 45, -20, 0], scale: [1, .94, 1.08, 1] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="aurora aurora-three" animate={{ x: [0, 45, -20, 0], y: [0, -30, 35, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />
      <div className="light-sweep" />
      {particles.map((particle, i) => (
        <motion.span
          key={i}
          className="particle"
          style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size }}
          animate={{ opacity: [0, .65, .15, 0], y: [0, -26, -48], x: [0, i % 2 ? 10 : -10, 0] }}
          transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
