"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function LanyardCard() {
  return (
    <motion.div
      className="lanyard-container"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
    >
      <div className="lanyard-wrapper">
        {/* Realistically curved Rope SVG ribbon with DAFFA-EXP repeating text */}
        <svg
          className="lanyard-rope-svg"
          viewBox="0 0 400 520"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="strapGradLeft" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0a0e19" />
              <stop offset="30%" stopColor="#1e2952" />
              <stop offset="60%" stopColor="#4f63c6" />
              <stop offset="85%" stopColor="#1e2952" />
              <stop offset="100%" stopColor="#080b14" />
            </linearGradient>
            <linearGradient id="strapGradRight" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#080b14" />
              <stop offset="25%" stopColor="#1d2850" />
              <stop offset="55%" stopColor="#485bbd" />
              <stop offset="80%" stopColor="#1d2850" />
              <stop offset="100%" stopColor="#0a0e19" />
            </linearGradient>

            <linearGradient id="metalChrome" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="35%" stopColor="#94a3b8" />
              <stop offset="70%" stopColor="#334155" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            <filter id="hookShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="3" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.6" />
            </filter>

            {/* Strap Paths starting from top viewport edge down to the central swivel hook */}
            <path id="leftStrapPath" d="M 130 -30 C 135 60 148 120 168 180 C 182 220 195 245 200 270" />
            <path id="rightStrapPath" d="M 270 -30 C 265 60 252 120 232 180 C 218 220 205 245 200 270" />
          </defs>

          {/* Ribbon Base Fabric */}
          <use href="#leftStrapPath" className="strap-ribbon-base" stroke="url(#strapGradLeft)" />
          <use href="#rightStrapPath" className="strap-ribbon-base" stroke="url(#strapGradRight)" />

          {/* Strap Highlight Edges */}
          <use href="#leftStrapPath" className="strap-edge-line" />
          <use href="#rightStrapPath" className="strap-edge-line" />

          {/* DAFFA-EXP Printed Text along left & right strap curves */}
          <text fill="rgba(224, 231, 255, 0.65)" fontSize="8" fontWeight="800" letterSpacing="1.8">
            <textPath href="#leftStrapPath" startOffset="8%">
              DAFFA-EXP &nbsp;&nbsp;&nbsp;&nbsp; DAFFA-EXP &nbsp;&nbsp;&nbsp;&nbsp; DAFFA-EXP
            </textPath>
          </text>
          <text fill="rgba(224, 231, 255, 0.65)" fontSize="8" fontWeight="800" letterSpacing="1.8">
            <textPath href="#rightStrapPath" startOffset="8%">
              DAFFA-EXP &nbsp;&nbsp;&nbsp;&nbsp; DAFFA-EXP &nbsp;&nbsp;&nbsp;&nbsp; DAFFA-EXP
            </textPath>
          </text>

          {/* Metal Swivel Clasp Hardware */}
          <g className="metal-clasp-group" filter="url(#hookShadow)">
            {/* Top Swivel Ring */}
            <ellipse cx="200" cy="272" rx="14" ry="7" fill="none" stroke="url(#metalChrome)" strokeWidth="3.5" />
            {/* Cylindrical Join */}
            <rect x="196" y="278" width="8" height="10" rx="2" fill="url(#metalChrome)" />
            {/* Carabiner Hook Clip */}
            <path
              d="M 200 288 C 190 288, 186 298, 188 310 C 190 320, 196 322, 200 322 C 204 322, 210 320, 212 310 C 214 298, 210 288, 200 288 Z"
              fill="none"
              stroke="url(#metalChrome)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Lever Catch */}
            <line x1="192" y1="295" x2="208" y2="315" stroke="url(#metalChrome)" strokeWidth="1.8" />
          </g>
        </svg>

        {/* Floating Acrylic Glass ID Card */}
        <div className="id-card-acrylic">
          <span className="card-top-slot" aria-hidden="true" />
          <div className="card-header">
            <span>DEVELOPER ID</span>
            <span className="card-status-led" />
          </div>

          <div className="card-photo-wrapper">
            <Image
              src="/assets/daffa.jpg"
              alt="Muhamad Daffa Permana"
              fill
              priority
              sizes="200px"
              className="card-photo"
            />
          </div>

          <div className="card-details">
            <div className="card-user-name">
              Muhamad Daffa
              <br />
              Permana
            </div>
            <div className="card-user-role">Junior Software Developer</div>
          </div>

          <div className="card-bottom-bar">
            <div className="card-barcode-lines">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="card-id-code">DAFFA-EXP</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default LanyardCard;
