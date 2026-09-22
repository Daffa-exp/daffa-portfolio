"use client";

import Image from "next/image";
import {
  AppWindow,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Database,
  ExternalLink,
  Github,
  Globe,
  Mail,
  MapPin,
  Menu,
  Send,
  Server,
  Smartphone,
  Sparkles,
  Monitor,
  Wrench,
  X,
  type LucideIcon
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Project, Certificate, SkillGroup } from "@/lib/types";
import { groupSkills, isPortraitProject, sentenceCase, type SkillCategoryKey } from "@/lib/display";
import { ProjectModal } from "./ProjectModal";
import { CertificateCarousel } from "./CertificateCarousel";
import { HeroVisual } from "./HeroVisual";
import { ProjectFrame } from "./ProjectFrame";
import { Reveal } from "./Reveal";
import { VisitorAIAssistant } from "./VisitorAIAssistant";

const GITHUB_URL = "https://github.com/Daffa-exp";
const EMAIL = "permanadaffa89@gmail.com";
const LOCATION = "Parongpong, Jawa Barat, Indonesia";

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" }
] as const;

const EDUCATION = [
  { period: "2024 – now", school: "SMK Negeri 1 Cisarua", field: "Rekayasa Perangkat Lunak" },
  { period: "2021 – 2024", school: "MTs As Shofa Cisarua", field: "Pendidikan Menengah" },
  { period: "2015 – 2021", school: "SD Negeri Kancah", field: "Pendidikan Dasar" }
];

const SKILL_ICONS: Record<SkillCategoryKey, LucideIcon> = {
  frontend: Monitor,
  backend: Server,
  mobile: Smartphone,
  database: Database,
  ai: Sparkles,
  tools: Wrench
};

const DEFAULT_SKILLS: SkillGroup[] = [
  { group: "PROGRAMMING", items: ["HTML", "CSS", "JavaScript", "Python", "PHP", "Dart", "TypeScript"] },
  { group: "FRAMEWORKS / TOOLS", items: ["Next.js", "React", "Express.js", "Node.js", "Laravel", "Flutter", "Flask", "Tailwind CSS", "Electron"] },
  { group: "DATABASE", items: ["MySQL", "Firebase", "Supabase", "Prisma"] },
  { group: "DEVELOPMENT", items: ["AI-assisted Development", "Docker", "Git"] }
];

const COMPACT_VISIBLE = 6;

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["home", ...NAV_ITEMS.map((n) => n.id), "contact"];
    const targets = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!targets.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const id = visible[0].target.id;
          setActive(NAV_ITEMS.some((n) => n.id === id) ? id : "");
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className={`nav ${scrolled || open ? "is-solid" : ""}`}>
      <div className="nav__inner">
        <a className="nav__brand" href="#home" onClick={() => setOpen(false)} aria-label="Daffa, back to top">
          <span className="nav__mark" aria-hidden="true" />
          Daffa
        </a>

        <nav className="nav__links" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <a key={item.id} href={`#${item.id}`} className={active === item.id ? "is-active" : ""} aria-current={active === item.id ? "true" : undefined}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <a className="btn btn--ghost btn--sm nav__github" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <Github size={14} aria-hidden="true" /> GitHub
          </a>
          <a className="btn btn--primary btn--sm" href="#contact">
            Contact
          </a>
          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`nav__sheet ${open ? "is-open" : ""}`} aria-hidden={!open}>
        {NAV_ITEMS.map((item) => (
          <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
            {item.label}
          </a>
        ))}
        <div className="nav__sheet-cta">
          <a className="btn btn--primary" href="#contact" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
            Contact
          </a>
          <a className="btn btn--ghost" href={GITHUB_URL} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
            <Github size={15} aria-hidden="true" /> GitHub
          </a>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Project cards                                                       */
/* ------------------------------------------------------------------ */

function TechTags({ items, limit }: { items: string[]; limit?: number }) {
  const shown = limit ? items.slice(0, limit) : items;
  const rest = limit ? items.length - shown.length : 0;
  return (
    <ul className="tags" aria-label="Tech stack">
      {shown.map((t) => (
        <li key={t} className="tag">
          {t}
        </li>
      ))}
      {rest > 0 && <li className="tag tag--more">+{rest}</li>}
    </ul>
  );
}

function ProjectActions({ project, onOpen, compact = false }: { project: Project; onOpen: (p: Project) => void; compact?: boolean }) {
  return (
    <div className="actions">
      {project.projectUrl && (
        <a
          className={`btn btn--primary ${compact ? "btn--sm" : ""}`}
          href={project.projectUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} live demo (opens in a new tab)`}
        >
          Live demo <ExternalLink size={13} aria-hidden="true" />
        </a>
      )}
      {project.githubUrl && (
        <a
          className={`btn btn--ghost ${compact ? "btn--sm" : ""}`}
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} source on GitHub (opens in a new tab)`}
        >
          <Github size={13} aria-hidden="true" /> Source
        </a>
      )}
      <button type="button" className={`btn btn--ghost ${compact ? "btn--sm" : ""}`} onClick={() => onOpen(project)}>
        Case study
      </button>
    </div>
  );
}

function FeatureCard({ project, lead, onOpen }: { project: Project; lead?: boolean; onOpen: (p: Project) => void }) {
  return (
    <Reveal as="article" className={`feature ${lead ? "feature--lead" : ""}`}>
      <button type="button" className="feature__visual" onClick={() => onOpen(project)} aria-label={`Open ${project.title} case study`}>
        <ProjectFrame
          project={project}
          sizes={lead ? "(max-width: 900px) 92vw, 640px" : "(max-width: 900px) 92vw, 560px"}
        />
      </button>
      <div className="feature__copy">
        <span className="tag tag--ember">{sentenceCase(project.category)}</span>
        <h3 className="feature__title">{project.title}</h3>
        <p className="feature__desc">{project.shortDescription || project.fullDescription}</p>
        <TechTags items={project.technologies} limit={lead ? undefined : 5} />
        <ProjectActions project={project} onOpen={onOpen} />
      </div>
    </Reveal>
  );
}

function CompactCard({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  const portrait = isPortraitProject(project.category);
  const thumb = project.coverImage || project.galleryImages?.[0];
  return (
    <Reveal as="article" className="compact">
      <button type="button" className={`compact__thumb ${portrait ? "is-portrait" : ""}`} onClick={() => onOpen(project)} aria-label={`Open ${project.title} case study`}>
        {thumb && <Image src={thumb} alt={`${project.title} screenshot`} fill sizes="160px" />}
      </button>
      <div className="compact__body">
        <span className="tag tag--ember">{sentenceCase(project.category)}</span>
        <h3 className="compact__title">{project.title}</h3>
        <p className="compact__desc">{project.tagline}</p>
        <TechTags items={project.technologies} limit={3} />
        <ProjectActions project={project} onOpen={onOpen} compact />
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Contact form (submission logic unchanged: POST /api/contact)        */
/* ------------------------------------------------------------------ */

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/contact", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || "Failed");
      setStatus("success");
      setMessage("Message sent. Thanks for reaching out, I'll reply by email.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage(`Sending failed. Email me directly at ${EMAIL}.`);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form__row">
        <label className="field">
          <span>Name</span>
          <input name="name" required autoComplete="name" placeholder="Your name" />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
        </label>
      </div>
      <label className="field">
        <span>Message</span>
        <textarea name="message" required rows={5} placeholder="What are you building?" />
      </label>
      <div className="form__foot">
        <button className="btn btn--primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? (
            "Sending..."
          ) : status === "success" ? (
            <>
              Sent <CheckCircle2 size={15} aria-hidden="true" />
            </>
          ) : (
            <>
              Send message <Send size={14} aria-hidden="true" />
            </>
          )}
        </button>
        <p className={`form__status form__status--${status}`} role="status" aria-live="polite">
          {message}
        </p>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

interface PortfolioPageProps {
  initialProjects?: Project[];
  initialCertificates?: Certificate[];
  initialSkills?: SkillGroup[];
}

export default function PortfolioPage({ initialProjects, initialCertificates, initialSkills }: PortfolioPageProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects || []);
  const [certs, setCerts] = useState<Certificate[]>(initialCertificates || []);
  const [skillsList, setSkillsList] = useState<SkillGroup[]>(initialSkills || DEFAULT_SKILLS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function syncData() {
      try {
        const res = await fetch("/api/public/data");
        if (res.ok) {
          const data = await res.json();
          if (data.projects && data.projects.length > 0) setProjects(data.projects);
          if (data.certificates && data.certificates.length > 0) setCerts(data.certificates);
          if (data.skills && data.skills.length > 0) setSkillsList(data.skills);
        }
      } catch (err) {
        console.warn("Using offline portfolio seed data", err);
      }
    }
    syncData();
  }, []);

  const featured = useMemo(() => projects.filter((p) => p.featured), [projects]);
  const others = useMemo(() => projects.filter((p) => !p.featured), [projects]);
  const heroProjects = featured.length ? featured : projects.slice(0, 3);
  const [lead, ...restFeatured] = featured;
  const visibleOthers = showAll ? others : others.slice(0, COMPACT_VISIBLE);
  const categories = useMemo(() => groupSkills(skillsList), [skillsList]);
  const open = (p: Project) => setSelectedProject(p);

  return (
    <main className="site">
      <SiteNav />

      {/* ---------------- HERO (dark) ---------------- */}
      <section id="home" className="hero">
        <div className="hero__aurora" aria-hidden="true">
          <span className="hero__beam" />
          <span className="hero__sunburst" />
        </div>

        <div className="wrap hero__inner">
          <div className="hero__copy">
            <p className="hero__eyebrow">
              <span className="dot" aria-hidden="true" /> Full-Stack Developer
            </p>
            <h1 className="hero__title">
              Building digital products with code, design &amp; AI.
            </h1>
            <p className="hero__lead">
              I&apos;m Muhamad Daffa Permana, a software engineering student at SMK Negeri 1 Cisarua. I build web, desktop and mobile apps
              with Next.js, Node.js, Express and Prisma.
            </p>
            <div className="hero__cta">
              <a className="btn btn--primary btn--lg" href="#projects">
                View projects
              </a>
              <a className="btn btn--ghost btn--lg" href="#contact">
                Get in touch
              </a>
            </div>
          </div>

          {heroProjects.length > 0 && <HeroVisual projects={heroProjects} onOpen={open} />}
        </div>
      </section>

      {/* ---------------- ABOUT (light) ---------------- */}
      <section id="about" className="band band--light">
        <div className="wrap about">
          <Reveal className="about__head">
            <div className="about__photo-wrap">
              <Image
                src="/assets/photo.jpg"
                alt="Muhamad Daffa Permana"
                width={280}
                height={280}
                className="about__photo"
                priority
              />
            </div>
            <p className="kicker" style={{ marginTop: "24px" }}>About</p>
            <h2 className="display">Full-stack development, with a back-end mindset.</h2>
          </Reveal>

          <Reveal className="about__body" delay={80}>
            <p className="about__lead">
              I focus on software development, back-end architecture and modern web, with hands-on work across web, desktop and mobile apps.
              I care about clean code, solving real technical problems and designing systems that stay simple to run.
            </p>

            <ul className="build-list">
              <li>
                <Globe size={18} aria-hidden="true" />
                <div>
                  <strong>Web apps</strong>
                  <span>Next.js and React front ends with Node.js and Express back ends.</span>
                </div>
              </li>
              <li>
                <AppWindow size={18} aria-hidden="true" />
                <div>
                  <strong>Desktop apps</strong>
                  <span>Electron tools for school operations, such as Kas Kelas and Hubin.</span>
                </div>
              </li>
              <li>
                <Cpu size={18} aria-hidden="true" />
                <div>
                  <strong>Mobile and AI experiments</strong>
                  <span>A Flutter learning app and an exam monitor built on OpenCV and MediaPipe.</span>
                </div>
              </li>
            </ul>

            <dl className="facts">
              <div>
                <dt>Studying</dt>
                <dd>Rekayasa Perangkat Lunak, SMK Negeri 1 Cisarua</dd>
              </div>
              <div>
                <dt>Based in</dt>
                <dd>{LOCATION}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ---------------- SKILLS (dark) ---------------- */}
      <section id="skills" className="band band--canvas">
        <div className="wrap">
          <Reveal className="section-head section-head--dark">
            <div>
              <p className="kicker">Skills</p>
              <h2 className="display">The stack I work in.</h2>
            </div>
            <p className="section-head__note">Grouped by what each tool is used for, from interface to database to delivery.</p>
          </Reveal>

          <div className="skills__list">
            {categories.map((cat, i) => {
              const Icon = SKILL_ICONS[cat.key];
              return (
                <Reveal key={cat.key} className="skill-row" delay={i * 40}>
                  <div className="skill-row__label">
                    <Icon size={18} aria-hidden="true" />
                    <div>
                      <h3>{cat.label}</h3>
                      <p>{cat.note}</p>
                    </div>
                  </div>
                  <ul className="skill-row__tags" aria-label={`${cat.label} technologies`}>
                    {cat.items.map((item) => (
                      <li key={item} className="tag tag--lg">
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- PROJECTS (light) ---------------- */}
      <section id="projects" className="band band--linen">
        <div className="wrap">
          <Reveal className="section-head">
            <div>
              <p className="kicker">Projects</p>
              <h2 className="display">Selected work.</h2>
            </div>
            <p className="section-head__note">
              Featured projects are live and deployed. Open a case study for the full screenshot gallery, features and stack.
            </p>
          </Reveal>

          {lead && (
            <div className="feature-stack">
              <FeatureCard project={lead} lead onOpen={open} />
              {restFeatured.length > 0 && (
                <div className="feature-grid">
                  {restFeatured.map((p) => (
                    <FeatureCard key={p.id} project={p} onOpen={open} />
                  ))}
                </div>
              )}
            </div>
          )}

          {others.length > 0 && (
            <div className="more">
              <Reveal className="more__head">
                <h3>More projects</h3>
                <span className="muted-on-light">{others.length} smaller builds across web, desktop, mobile and AI</span>
              </Reveal>
              <div className="compact-grid">
                {visibleOthers.map((p) => (
                  <CompactCard key={p.id} project={p} onOpen={open} />
                ))}
              </div>
              {others.length > COMPACT_VISIBLE && (
                <div className="more__toggle">
                  <button type="button" className="btn btn--outline" onClick={() => setShowAll((v) => !v)} aria-expanded={showAll}>
                    {showAll ? "Show fewer" : `Show all ${others.length} projects`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ---------------- EXPERIENCE (dark) ---------------- */}
      <section id="experience" className="band band--dark">
        <div className="wrap">
          <Reveal className="section-head section-head--dark">
            <div>
              <p className="kicker">Experience</p>
              <h2 className="display">Learning by building.</h2>
            </div>
            <p className="section-head__note">Formal education, plus certifications in AI, security and digital skills.</p>
          </Reveal>

          <ol className="timeline">
            {EDUCATION.map((e, i) => (
              <Reveal as="li" key={e.school} className="timeline__item" delay={i * 60}>
                <span className="timeline__period">{e.period}</span>
                <strong>{e.school}</strong>
                <span>{e.field}</span>
              </Reveal>
            ))}
          </ol>

          <div id="certificates" className="certs">
            <CertificateCarousel certificates={certs} />
          </div>
        </div>
      </section>

      {/* ---------------- CONTACT (light) ---------------- */}
      <section id="contact" className="band band--light">
        <div className="wrap contact">
          <Reveal className="contact__intro">
            <p className="kicker">Contact</p>
            <h2 className="display display--xl">
              Have an idea?
              <br />
              Let&apos;s build it.
            </h2>
            <p className="about__lead">
              Open to collaboration, internships and interesting problems. The fastest way to reach me is email.
            </p>
            <div className="actions">
              <a className="btn btn--primary btn--lg" href={`mailto:${EMAIL}`}>
                <Mail size={16} aria-hidden="true" /> Email me
              </a>
              <a className="btn btn--outline btn--lg" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                <Github size={16} aria-hidden="true" /> GitHub
              </a>
            </div>
            <p className="contact__meta">
              <MapPin size={15} aria-hidden="true" /> {LOCATION}
            </p>
          </Reveal>

          <Reveal className="panel" delay={80}>
            <h3>Send a message</h3>
            <p className="muted-on-light">It goes straight to my inbox.</p>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* ---------------- FOOTER (dark) ---------------- */}
      <footer className="footer">
        <div className="wrap footer__inner">
          <div>
            <strong>Muhamad Daffa Permana</strong>
            <p>Full-stack developer based in West Java, Indonesia.</p>
          </div>
          <div className="footer__links">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github size={16} aria-hidden="true" /> GitHub
            </a>
            <a href={`mailto:${EMAIL}`} aria-label="Email">
              <Mail size={16} aria-hidden="true" /> Email
            </a>
            <a href="/daffa-studio/login" aria-label="Daffa Studio Admin">
              Studio
            </a>
            <a href="#home">
              Back to top <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
          <p className="footer__copy">&copy; {new Date().getFullYear()} Muhamad Daffa Permana</p>
        </div>
      </footer>

      <VisitorAIAssistant />
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </main>
  );
}
