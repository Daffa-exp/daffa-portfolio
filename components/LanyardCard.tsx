"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function LanyardCard() {
  return (
    <motion.div
      className="lanyard-outer"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── SVG STRAP — from top viewport to hook ── */}
      <svg
        className="lanyard-strap-svg"
        viewBox="0 0 240 420"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden="true"
        overflow="visible"
      >
        <defs>
          {/* Left ribbon gradient — fabric sheen */}
          <linearGradient id="lanyardGL" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#060912" />
            <stop offset="28%" stopColor="#1a2560" />
            <stop offset="55%" stopColor="#4a5bbf" />
            <stop offset="80%" stopColor="#1a2560" />
            <stop offset="100%" stopColor="#060912" />
          </linearGradient>
          {/* Right ribbon gradient */}
          <linearGradient id="lanyardGR" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#060912" />
            <stop offset="25%" stopColor="#16225a" />
            <stop offset="52%" stopColor="#3f50b8" />
            <stop offset="78%" stopColor="#16225a" />
            <stop offset="100%" stopColor="#060912" />
          </linearGradient>
          {/* Metal chrome gradient */}
          <linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="40%" stopColor="#94a3b8" />
            <stop offset="75%" stopColor="#2d3a4d" />
            <stop offset="100%" stopColor="#c8d5e8" />
          </linearGradient>
          <filter id="ropeShadow" x="-30%" y="-10%" width="160%" height="120%">
            <feDropShadow dx="3" dy="8" stdDeviation="5" floodColor="#000" floodOpacity="0.55" />
          </filter>

          {/* Curved strap paths */}
          <path id="sl" d="M 80 -40 C 84 60 95 130 110 190 C 120 230 126 255 120 275" />
          <path id="sr" d="M 160 -40 C 156 60 145 130 130 190 C 120 230 114 255 120 275" />
        </defs>

        {/* Strap shadows */}
        <use href="#sl" fill="none" stroke="#000" strokeWidth="28" strokeOpacity="0.5" strokeLinecap="round" />
        <use href="#sr" fill="none" stroke="#000" strokeWidth="28" strokeOpacity="0.5" strokeLinecap="round" />

        {/* Main fabric ribbons */}
        <use href="#sl" fill="none" stroke="url(#lanyardGL)" strokeWidth="26" strokeLinecap="round" />
        <use href="#sr" fill="none" stroke="url(#lanyardGR)" strokeWidth="26" strokeLinecap="round" />

        {/* Highlight sheen */}
        <use href="#sl" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" strokeLinecap="round" />
        <use href="#sr" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" strokeLinecap="round" />

        {/* DAFFA-EXP text on ribbons */}
        <text fill="rgba(210,225,255,0.65)" fontSize="7.5" fontWeight="800" letterSpacing="1.6"
          style={{ fontFamily: "monospace" }}>
          <textPath href="#sl" startOffset="5%">
            DAFFA-EXP · DAFFA-EXP · DAFFA-EXP · DAFFA-EXP
          </textPath>
        </text>
        <text fill="rgba(210,225,255,0.65)" fontSize="7.5" fontWeight="800" letterSpacing="1.6"
          style={{ fontFamily: "monospace" }}>
          <textPath href="#sr" startOffset="5%">
            DAFFA-EXP · DAFFA-EXP · DAFFA-EXP · DAFFA-EXP
          </textPath>
        </text>

        {/* Metal Swivel Hardware */}
        <g filter="url(#ropeShadow)">
          {/* O-ring */}
          <ellipse cx="120" cy="278" rx="14" ry="7"
            fill="none" stroke="url(#metalGrad)" strokeWidth="3.5" />
          {/* Cylindrical shackle */}
          <rect x="116" y="284" width="8" height="11" rx="2" fill="url(#metalGrad)" />
          {/* Carabiner hook body */}
          <path
            d="M120 295 C110 295 106 306 108 318 C110 328 115 331 120 331 C125 331 130 328 132 318 C134 306 130 295 120 295 Z"
            fill="none" stroke="url(#metalGrad)" strokeWidth="3.5"
            strokeLinecap="round" strokeLinejoin="round"
          />
          {/* Lever bar */}
          <line x1="113" y1="302" x2="127" y2="322" stroke="url(#metalGrad)" strokeWidth="2" />
        </g>
      </svg>

      {/* ── ACRYLIC GLASS ID CARD ── */}
      <motion.div
        className="id-card-glass"
        animate={{ rotate: ["-2.5deg", "1.5deg", "-2.5deg"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Top slot notch */}
        <span className="id-slot-notch" aria-hidden />

        {/* Card header */}
        <div className="id-card-header">
          <span className="id-header-label">DEVELOPER ID</span>
          <span className="id-live-dot" />
        </div>

        {/* Photo */}
        <div className="id-photo-container">
          <Image
            src="/assets/daffa.jpg"
            alt="Muhamad Daffa Permana"
            fill
            priority
            sizes="180px"
            className="id-photo-img"
          />
          {/* Photo overlay gradient */}
          <div className="id-photo-overlay" />
        </div>

        {/* Name + Role */}
        <div className="id-name-block">
          <p className="id-full-name">Muhamad Daffa<br />Permana</p>
          <p className="id-role-text">Junior Software Developer</p>
        </div>

        {/* Bottom bar */}
        <div className="id-bottom-bar">
          <div className="id-barcode">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className={`id-bar ${i % 3 === 0 ? "wide" : i % 4 === 0 ? "narrow" : ""}`} />
            ))}
          </div>
          <span className="id-code-text">DAFFA-EXP</span>
        </div>

        {/* Glass edge glow */}
        <div className="id-glass-edge" aria-hidden />
        {/* Reflection sheen */}
        <div className="id-reflection" aria-hidden />
      </motion.div>
    </motion.div>
  );
}

export default LanyardCard;
