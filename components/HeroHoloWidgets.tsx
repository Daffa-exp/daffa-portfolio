"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code2, Sparkles, Layers } from "lucide-react";

export function HeroHoloWidgets() {
  return (
    <>
      {/* Left Holographic Widget: TECH STACK */}
      <motion.div
        className="holo-widget holo-widget-left"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <div className="holo-widget-header">
          <Code2 size={13} className="text-cyan-400" />
          <span>TECH STACK</span>
        </div>
        <ul className="holo-stack-list">
          <li>
            <span className="stack-badge">N</span> Next.js
          </li>
          <li>
            <span className="stack-badge ts">TS</span> TypeScript
          </li>
          <li>
            <span className="stack-badge tw">≈</span> Tailwind CSS
          </li>
          <li>
            <span className="stack-badge react">⚛</span> React
          </li>
          <li>
            <span className="stack-badge prisma">▲</span> Prisma
          </li>
          <li>
            <span className="stack-badge pg">🐘</span> PostgreSQL
          </li>
        </ul>
      </motion.div>

      {/* Right Holographic Widget: FEATURED PROJECTS */}
      <motion.div
        className="holo-widget holo-widget-right"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      >
        <div className="holo-widget-header">
          <Sparkles size={13} className="text-violet-400" />
          <span>FEATURED PROJECTS</span>
        </div>
        <ul className="holo-projects-list">
          <li>
            <div className="holo-proj-num">01</div>
            <div>
              <strong>Foodmart</strong>
              <small>E-Commerce</small>
            </div>
          </li>
          <li>
            <div className="holo-proj-num">02</div>
            <div>
              <strong>InstanPage</strong>
              <small>SaaS Website Builder</small>
            </div>
          </li>
          <li>
            <div className="holo-proj-num">03</div>
            <div>
              <strong>Pariwisata</strong>
              <small>Website Pariwisata</small>
            </div>
          </li>
        </ul>
        <div className="holo-more-tag">
          <Layers size={11} /> <span>and more...</span>
        </div>
      </motion.div>
    </>
  );
}

export default HeroHoloWidgets;
