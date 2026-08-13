"use client";

const particles = Array.from({ length: 34 }, (_, i) => ({
  left: `${(i * 29 + 7) % 100}%`,
  top: `${(i * 47 + 11) % 100}%`,
  size: 1 + (i % 2),
  delay: `${(i % 11) * -0.8}s`,
  duration: `${8 + (i % 5) * 2}s`,
}));

export function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient-grid" />
      <div className="ambient-vignette" />
      <div className="ambient-noise" />
      <div className="ambient-glow ambient-glow-a" />
      <div className="ambient-glow ambient-glow-b" />
      
      {/* Background flowing energy aura waves */}
      <svg className="aura-waves" viewBox="0 0 1600 900" preserveAspectRatio="none">
        <defs>
          <linearGradient id="auraBlue" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#1977ff" stopOpacity="0" />
            <stop offset=".24" stopColor="#2f9dff" stopOpacity=".48" />
            <stop offset=".52" stopColor="#6677ff" stopOpacity=".72" />
            <stop offset=".76" stopColor="#4b5cff" stopOpacity=".42" />
            <stop offset="1" stopColor="#39d7ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="auraViolet" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#805cff" stopOpacity="0" />
            <stop offset=".35" stopColor="#735bff" stopOpacity=".44" />
            <stop offset=".63" stopColor="#b06dff" stopOpacity=".62" />
            <stop offset="1" stopColor="#287cff" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Waves will be blurred as a whole container using GPU CSS filter: blur() */}
        <g className="aura-wave aura-wave-one" fill="none">
          <path d="M-180 735 C120 520 320 875 610 690 S1080 455 1780 710" stroke="url(#auraBlue)" strokeWidth="20" />
          <path d="M-180 742 C120 535 320 890 610 704 S1080 470 1780 718" stroke="url(#auraBlue)" strokeWidth="5" />
        </g>
        <g className="aura-wave aura-wave-two" fill="none">
          <path d="M-160 365 C150 565 320 230 575 420 S980 650 1305 345 S1550 260 1780 365" stroke="url(#auraViolet)" strokeWidth="16" />
          <path d="M-160 373 C150 578 320 248 575 432 S980 664 1305 356 S1550 275 1780 374" stroke="url(#auraViolet)" strokeWidth="4" />
        </g>
        <g className="aura-wave aura-wave-three" fill="none">
          <path d="M-120 795 C190 650 355 850 610 760 S980 570 1235 735 S1510 825 1720 650" stroke="url(#auraBlue)" strokeWidth="2.2" />
          <path d="M-120 810 C190 665 355 865 610 775 S980 585 1235 750 S1510 840 1720 665" stroke="url(#auraViolet)" strokeWidth="1.2" opacity=".62" />
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
