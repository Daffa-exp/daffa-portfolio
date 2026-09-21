"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";

export default function StudioLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid password");
      }

      router.push("/daffa-studio");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="studio-login-page">
      <div className="studio-login-card">
        <div className="studio-login-badge">
          <ShieldCheck size={16} />
          <span>DAFFA STUDIO • PRIVATE AREA</span>
        </div>

        <div className="studio-login-header">
          <div className="studio-brand-icon">
            <Sparkles size={22} />
          </div>
          <h1>Studio Access</h1>
          <p>Masukkan master password untuk mengelola proyek, sertifikat, media, dan AI copilot.</p>
        </div>

        {error && (
          <div className="studio-alert studio-alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="studio-form">
          <div className="studio-field">
            <label htmlFor="studio-password">Master Password</label>
            <div className="studio-input-wrap">
              <Lock size={16} className="studio-input-icon" />
              <input
                id="studio-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                required
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="studio-btn studio-btn-primary studio-btn-full"
          >
            {loading ? "Authenticating..." : <>Masuk ke Studio <ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="studio-login-footer">
          <small>Protected by server-side authorization</small>
        </div>
      </div>
    </div>
  );
}
