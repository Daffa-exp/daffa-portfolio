"use client";

import React from "react";

const particles = Array.from({ length: 36 }, (_, i) => ({
  left: `${(i * 29 + 7) % 100}%`,
  top: `${(i * 47 + 11) % 100}%`,
  size: 1 + (i % 3),
  delay: `${(i % 11) * -0.7}s`,
  duration: `${7 + (i % 5) * 2.5}s`,
}));

export function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient-grid" />
      <div className="ambient-vignette" />
      <div className="ambient-noise" />
      <div className="ambient-glow ambient-glow-a" />
      <div className="ambient-glow ambient-glow-b" />
      <div className="ambient-glow ambient-glow-hero" />
      
      {/* Background flowing energy aura waves */}
      <svg className="aura-waves" viewBox="0 0 1600 900" preserveAspectRatio="none">
        <defs>
          <linearGradient id="auraBlue" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1977ff" stopOpacity="0" />
            <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#6366f1" stopOpacity="0.75" />
            <stop offset="80%" stopColor="#38bdf8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="auraViolet" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#805cff" stopOpacity="0" />
            <stop offset="30%" stopColor="#8b5cf6" stopOpacity="0.5" />
            <stop offset="65%" stopColor="#d946ef" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Animated glowing wave paths */}
        <g className="aura-wave aura-wave-one" fill="none">
          <path d="M-180 735 C120 520 320 875 610 690 S1080 455 1780 710" stroke="url(#auraBlue)" strokeWidth="22" />
          <path d="M-180 742 C120 535 320 890 610 704 S1080 470 1780 718" stroke="url(#auraBlue)" strokeWidth="6" />
        </g>
        <g className="aura-wave aura-wave-two" fill="none">
          <path d="M-160 365 C150 565 320 230 575 420 S980 650 1305 345 S1550 260 1780 365" stroke="url(#auraViolet)" strokeWidth="18" />
          <path d="M-160 373 C150 578 320 248 575 432 S980 664 1305 356 S1550 275 1780 374" stroke="url(#auraViolet)" strokeWidth="5" />
        </g>
        <g className="aura-wave aura-wave-three" fill="none">
          <path d="M-120 795 C190 650 355 850 610 760 S980 570 1235 735 S1510 825 1720 650" stroke="url(#auraBlue)" strokeWidth="3" />
          <path d="M-120 810 C190 665 355 865 610 775 S980 585 1235 750 S1510 840 1720 665" stroke="url(#auraViolet)" strokeWidth="1.8" opacity="0.7" />
        </g>
      </svg>
      
      <div className="aura-beam aura-beam-one" />
      <div className="aura-beam aura-beam-two" />
      
      {particles.map((particle, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </div>
  );
}

export default AmbientBackground;
