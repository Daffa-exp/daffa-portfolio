"use client";

import { motion } from "framer-motion";

export function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      {/* Background canvas */}
      <div className="ambient-canvas" />

      {/* Huly Signature Vertical Aurora Beam (Electric Iris -> Ember Pulse -> Snow) */}
      <div className="huly-hero-aurora-beam" />

      {/* Huly Warm Sunburst Glow at Base */}
      <div className="huly-sunburst-glow" />

      {/* Subtle secondary ambient iris wash */}
      <motion.div
        className="huly-iris-ambient"
        animate={{ opacity: [0.3, 0.45, 0.3], scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

