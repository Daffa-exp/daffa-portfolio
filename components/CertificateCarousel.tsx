"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ExternalLink, Maximize2, Award } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import type { Certificate } from "@/lib/types";

export function CertificateCarousel({ certificates }: { certificates: Certificate[] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<Certificate | null>(null);
  const touchStartX = useRef<number | null>(null);

  const list = certificates && certificates.length > 0 ? certificates : [];
  const move = (dir: number) => {
    if (list.length === 0) return;
    setActive((v) => (v + dir + list.length) % list.length);
  };

  useEffect(() => {
    if (list.length <= 1) return;
    const timer = window.setInterval(() => move(1), 6000);
    return () => window.clearInterval(timer);
  }, [list.length, active]);

  if (list.length === 0) return null;
  const currentCert = list[active] || list[0];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 35) {
      if (diff > 0) {
        // Swipe left -> next
        move(1);
      } else {
        // Swipe right -> prev
        move(-1);
      }
    }
    touchStartX.current = null;
  };

  return (
    <div className="cert-section-container">
      {/* Main Certificate Showcase Frame */}
      <div
        className="cert-showcase-stage"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          className="cert-nav-btn cert-nav-left"
          onClick={() => move(-1)}
          aria-label="Previous certificate"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="cert-card-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCert.id || currentCert.imageUrl}
              className="cert-main-card"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setOpen(currentCert)}
            >
              <div className="cert-image-frame">
                <Image
                  src={currentCert.imageUrl || "/assets/certs/cert1.jpg"}
                  alt={currentCert.title}
                  fill
                  sizes="(max-width: 768px) 92vw, 680px"
                  priority
                  className="cert-img"
                />
                <div className="cert-expand-overlay">
                  <Maximize2 size={16} />
                  <span>Tap to expand</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          className="cert-nav-btn cert-nav-right"
          onClick={() => move(1)}
          aria-label="Next certificate"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Certificate Meta & Caption */}
      <div className="cert-meta-box">
        <div className="cert-meta-header">
          <div className="cert-counter-pill">
            <Award size={13} />
            <span>
              {String(active + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
            </span>
          </div>
          <div className="cert-dots-indicator">
            {list.map((_, i) => (
              <button
                key={i}
                className={`cert-dot ${i === active ? "active" : ""}`}
                onClick={() => setActive(i)}
                aria-label={`Go to certificate ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <h3 className="cert-title">{currentCert.title}</h3>
        <p className="cert-issuer">
          <strong>{currentCert.issuer}</strong> • <span>{currentCert.issueDate}</span>
        </p>

        {currentCert.description && (
          <p className="cert-description">{currentCert.description}</p>
        )}

        <div className="cert-actions-row">
          <button
            className="button button-ghost small"
            onClick={() => setOpen(currentCert)}
          >
            <Maximize2 size={13} /> Lihat Fullscreen
          </button>

          {currentCert.credentialUrl && (
            <a
              href={currentCert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-primary small"
            >
              Verifikasi Kredensial <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fullscreen-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <button
              className="fullscreen-close-btn"
              onClick={() => setOpen(null)}
              aria-label="Close certificate"
            >
              <X size={20} />
            </button>
            <div
              className="fullscreen-stage"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={open.imageUrl || "/assets/certs/cert1.jpg"}
                alt={open.title}
                fill
                sizes="100vw"
                className="fullscreen-img"
              />
              {list.length > 1 && (
                <>
                  <button
                    className="gallery-arrow left"
                    onClick={() => move(-1)}
                    aria-label="Previous certificate"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    className="gallery-arrow right"
                    onClick={() => move(1)}
                    aria-label="Next certificate"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
