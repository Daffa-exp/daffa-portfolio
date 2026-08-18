"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ExternalLink } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Certificate } from "@/lib/types";

export function CertificateCarousel({ certificates }: { certificates: Certificate[] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<Certificate | null>(null);

  const list = certificates && certificates.length > 0 ? certificates : [];
  const move = (dir: number) => {
    if (list.length === 0) return;
    setActive((v) => (v + dir + list.length) % list.length);
  };

  useEffect(() => {
    if (list.length <= 1) return;
    const timer = window.setInterval(() => move(1), 5000);
    return () => window.clearInterval(timer);
  }, [list.length]);

  if (list.length === 0) return null;
  const currentCert = list[active] || list[0];

  return (
    <>
      <div className="certificate-wrap">
        <button className="carousel-arrow" onClick={() => move(-1)} aria-label="Previous certificate">
          <ChevronLeft size={18} />
        </button>
        <div className="certificate-stage">
          {list.map((cert, i) => {
            const delta = (i - active + list.length) % list.length;
            const offset = delta === 0 ? 0 : delta === 1 ? 1 : delta === list.length - 1 ? -1 : 2;
            const isCenter = offset === 0;
            const img = cert.imageUrl || "/assets/certs/cert1.jpg";

            return (
              <motion.button
                key={cert.id || img}
                className={`certificate-card ${isCenter ? "center" : ""}`}
                animate={{
                  x: `${offset * 34}%`,
                  scale: isCenter ? 1 : 0.78,
                  opacity: isCenter ? 1 : 0.46,
                  rotateY: offset * -12,
                  filter: isCenter ? "blur(0px)" : "blur(1.2px)",
                  zIndex: isCenter ? 5 : 2
                }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                onClick={() => (isCenter ? setOpen(cert) : setActive(i))}
                aria-label={`View certificate ${cert.title}`}
              >
                <Image src={img} alt={cert.title} fill sizes="(max-width: 700px) 65vw, 360px" />
              </motion.button>
            );
          })}
        </div>
        <button className="carousel-arrow" onClick={() => move(1)} aria-label="Next certificate">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="certificate-caption">
        <strong>{currentCert.title}</strong>
        <span>
          {currentCert.issuer} · {currentCert.issueDate}
        </span>
        {currentCert.description && <p className="cert-subdesc">{currentCert.description}</p>}
        <div className="cert-caption-action">
          <small>Click certificate to expand preview</small>
          {currentCert.credentialUrl && (
            <a
              href={currentCert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cert-verify-link"
              onClick={(e) => e.stopPropagation()}
            >
              Verify Credential <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="certificate-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              className="certificate-large"
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="icon-button lightbox-close" onClick={() => setOpen(null)} aria-label="Close">
                <X size={18} />
              </button>
              <Image src={open.imageUrl || "/assets/certs/cert1.jpg"} alt={open.title} fill sizes="90vw" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
