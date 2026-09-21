"use client";

import { motion } from "framer-motion";

export function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      {/* Deep Canvas */}
      <div className="ambient-canvas" />

      {/* Atmospheric Aurora Cloud on the Right */}
      <motion.div
        className="huly-aurora-cloud-right"
        animate={{ opacity: [0.45, 0.65, 0.45], scale: [1, 1.04, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Vertical Light Pillar / Laser Line */}
      <div className="huly-laser-pillar" />

      {/* Fan / Flare Bloom at the Base of the Beam */}
      <div className="huly-beam-flare" />

      {/* Warm Amber / Ember Glow Underneath the Flare */}
      <div className="huly-sunburst-glow" />
    </div>
  );
}


