 "use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Certificate } from "../data/portfolio";

export function CertificateCarousel({ certificates }: { certificates: Certificate[] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<Certificate | null>(null);

  const move = (dir: number) => setActive((v) => (v + dir + certificates.length) % certificates.length);

  useEffect(() => {
    const timer = window.setInterval(() => move(1), 5000);
    return () => window.clearInterval(timer);
  }, [certificates.length]);

  return (
    <>
      <div className="certificate-wrap">
        <button className="carousel-arrow" onClick={() => move(-1)} aria-label="Previous certificate"><ChevronLeft size={18} /></button>
        <div className="certificate-stage">
          {certificates.map((cert, i) => {
            const delta = (i - active + certificates.length) % certificates.length;
            const offset = delta === 0 ? 0 : delta === 1 ? 1 : delta === certificates.length - 1 ? -1 : 2;
            const isCenter = offset === 0;
            return (
              <motion.button
                key={cert.img}
                className={`certificate-card ${isCenter ? "center" : ""}`}
                animate={{
                  x: `${offset * 34}%`,
                  scale: isCenter ? 1 : 0.78,
                  opacity: isCenter ? 1 : 0.46,
                  rotateY: offset * -12,
                  filter: isCenter ? "blur(0px)" : "blur(1.2px)",
                  zIndex: isCenter ? 5 : 2,
                }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                onClick={() => isCenter ? setOpen(cert) : setActive(i)}
                aria-label={`View certificate ${cert.title}`}
              >
                <Image src={cert.img} alt={cert.title} fill sizes="(max-width: 700px) 65vw, 360px" />
              </motion.button>
            );
          })}
        </div>
        <button className="carousel-arrow" onClick={() => move(1)} aria-label="Next certificate"><ChevronRight size={18} /></button>
      </div>
      <div className="certificate-caption">
        <strong>{certificates[active].title}</strong>
        <span>{certificates[active].issuer} · {certificates[active].date}</span>
        <small>Click certificate to view details</small>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className="certificate-lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <motion.div className="certificate-large" initial={{ scale: .94, y: 12 }} animate={{ scale: 1, y: 0 }} onClick={(e) => e.stopPropagation()}>
              <button className="icon-button lightbox-close" onClick={() => setOpen(null)} aria-label="Close"><X size={18} /></button>
              <Image src={open.img} alt={open.title} fill sizes="90vw" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
