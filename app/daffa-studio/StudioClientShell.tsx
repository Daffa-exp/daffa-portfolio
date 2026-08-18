"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Award,
  Image as ImageIcon,
  Bot,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Sparkles
} from "lucide-react";

export default function StudioClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === "/daffa-studio/login";

  useEffect(() => {
    if (isLoginPage) {
      setAuthorized(true);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();
        if (!data.authenticated) {
          router.replace("/daffa-studio/login");
        } else {
          setAuthorized(true);
        }
      } catch {
        router.replace("/daffa-studio/login");
      }
    }

    checkAuth();
  }, [pathname, isLoginPage, router]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/daffa-studio/login");
    } catch (e) {
      console.error("Logout error", e);
    }
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (authorized === null) {
    return (
      <div className="studio-loading-screen">
        <div className="studio-spinner" />
        <span>Loading Daffa Studio...</span>
      </div>
    );
  }

  const navItems = [
    { label: "Overview", href: "/daffa-studio", icon: LayoutDashboard, exact: true },
    { label: "Projects", href: "/daffa-studio/projects", icon: FolderKanban },
    { label: "Certificates", href: "/daffa-studio/certificates", icon: Award },
    { label: "Media Library", href: "/daffa-studio/media", icon: ImageIcon },
    { label: "AI Copilot", href: "/daffa-studio/ai", icon: Bot }
  ];

  return (
    <div className="studio-shell">
      {/* Studio Topbar for Mobile */}
      <div className="studio-mobile-topbar">
        <div className="studio-logo">
          <Sparkles size={16} />
          <strong>DAFFA STUDIO</strong>
        </div>
        <button
          className="studio-icon-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Studio Sidebar */}
      <aside className={`studio-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <div className="studio-sidebar-header">
          <div className="studio-logo">
            <span className="studio-badge-dot" />
            <strong>DAFFA STUDIO</strong>
          </div>
          <span className="studio-version">v2.0 • Admin Control</span>
        </div>

        <nav className="studio-nav">
          <div className="studio-nav-group-label">CONTENT & CMS</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`studio-nav-item ${active ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="studio-sidebar-footer">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="studio-nav-item studio-nav-ext"
          >
            <ExternalLink size={16} />
            <span>Lihat Public Site</span>
          </a>
          <button
            onClick={handleLogout}
            className="studio-nav-item studio-logout-btn"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="studio-main-content">
        {children}
      </main>
    </div>
  );
}
