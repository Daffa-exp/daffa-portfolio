"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Award,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Plus,
  ArrowRight,
  TrendingUp,
  Bot
} from "lucide-react";
import type { StudioHealth } from "@/lib/types";

export default function StudioDashboardPage() {
  const [health, setHealth] = useState<StudioHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHealth() {
      try {
        const res = await fetch("/api/studio/health");
        if (res.ok) {
          const data = await res.json();
          setHealth(data);
        }
      } catch (err) {
        console.error("Failed to load studio health", err);
      } finally {
        setLoading(false);
      }
    }
    loadHealth();
  }, []);

  if (loading) {
    return (
      <div className="studio-page">
        <div className="studio-spinner" />
      </div>
    );
  }

  return (
    <div className="studio-page">
      {/* Page Header */}
      <div className="studio-header">
        <div>
          <div className="studio-kicker">CONTROL CENTER</div>
          <h1>Portfolio Studio Dashboard</h1>
          <p>Kelola seluruh data portofolio publik, aset gambar, dan analisis AI secara real-time.</p>
        </div>
        <div className="studio-actions">
          <Link href="/daffa-studio/projects/new" className="studio-btn studio-btn-primary">
            <Plus size={16} /> New Project
          </Link>
          <Link href="/daffa-studio/certificates/new" className="studio-btn studio-btn-secondary">
            <Plus size={16} /> New Certificate
          </Link>
        </div>
      </div>

      {/* Health Stats Grid */}
      <div className="studio-stats-grid">
        <div className="studio-stat-card">
          <div className="studio-stat-head">
            <span>Total Projects</span>
            <FolderKanban size={18} className="text-cyan-400" />
          </div>
          <div className="studio-stat-value">{health?.totalProjects ?? 0}</div>
          <div className="studio-stat-foot">
            <span className="text-cyan-400">{health?.featuredProjects ?? 0}</span> Featured projects live
          </div>
        </div>

        <div className="studio-stat-card">
          <div className="studio-stat-head">
            <span>Certificates</span>
            <Award size={18} className="text-violet-400" />
          </div>
          <div className="studio-stat-value">{health?.totalCertificates ?? 0}</div>
          <div className="studio-stat-foot">Terdaftar & terverifikasi</div>
        </div>

        <div className="studio-stat-card">
          <div className="studio-stat-head">
            <span>Media Library</span>
            <ImageIcon size={18} className="text-emerald-400" />
          </div>
          <div className="studio-stat-value">{health?.totalMedia ?? 0}</div>
          <div className="studio-stat-foot">Asset gambar & screenshot</div>
        </div>

        <div className="studio-stat-card">
          <div className="studio-stat-head">
            <span>Completeness Score</span>
            <TrendingUp size={18} className="text-amber-400" />
          </div>
          <div className="studio-stat-value">{health?.completenessScore ?? 100}%</div>
          <div className="studio-stat-foot">
            <span className="studio-progress-bar">
              <span style={{ width: `${health?.completenessScore ?? 100}%` }} />
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Health Status & AI Recommendations */}
      <div className="studio-two-col">
        {/* Left Column: Diagnostics */}
        <div className="studio-card">
          <div className="studio-card-head">
            <div>
              <h3>Portfolio Health Diagnostics</h3>
              <p>Pemeriksaan otomatis kelengkapan data & validitas aset.</p>
            </div>
            <CheckCircle2 size={20} className="text-emerald-400" />
          </div>

          <div className="studio-diagnostics-list">
            <div className="studio-diag-row">
              <span>Broken Links / URLs</span>
              <strong>{health?.brokenLinks.length ?? 0}</strong>
            </div>
            <div className="studio-diag-row">
              <span>Missing Project / Certificate Images</span>
              <strong>{health?.missingImages.length ?? 0}</strong>
            </div>
            <div className="studio-diag-row">
              <span>Items with Minimal Description</span>
              <strong>{health?.missingDescriptions.length ?? 0}</strong>
            </div>
            <div className="studio-diag-row">
              <span>Database Sync Status</span>
              <strong className="text-emerald-400">Synchronized & Active</strong>
            </div>
          </div>

          {health && health.missingDescriptions.length > 0 && (
            <div className="studio-notice-box">
              <AlertTriangle size={16} />
              <div>
                <strong>Perhatian Kelengkapan:</strong>
                <ul>
                  {health.missingDescriptions.map((item) => (
                    <li key={item.id}>
                      {item.type === "project" ? "Proyek" : "Sertifikat"} <em>{item.title}</em> memiliki deskripsi singkat.
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Recommendations */}
        <div className="studio-card studio-card-ai">
          <div className="studio-card-head">
            <div>
              <h3>AI Recommendations</h3>
              <p>Insight otomatis dari AI Copilot untuk memaksimalkan profil.</p>
            </div>
            <Sparkles size={20} className="text-cyan-400" />
          </div>

          <div className="studio-ai-recommendations">
            {health?.aiRecommendations && health.aiRecommendations.length > 0 ? (
              health.aiRecommendations.map((rec, i) => (
                <div key={i} className="studio-rec-item">
                  <span className="studio-rec-bullet" />
                  <p>{rec}</p>
                </div>
              ))
            ) : (
              <p className="text-muted">Semua data proyek dan sertifikasi sudah dalam kondisi optimal.</p>
            )}
          </div>

          <div className="studio-card-footer">
            <Link href="/daffa-studio/ai" className="studio-btn studio-btn-primary studio-btn-sm">
              <Bot size={15} /> Buka Portfolio Copilot <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
