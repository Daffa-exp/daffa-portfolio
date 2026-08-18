"use client";

import React, { useState } from "react";
import {
  Bot,
  Sparkles,
  Send,
  Check,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
  CheckCircle2
} from "lucide-react";
import type { AICopilotSuggestion } from "@/lib/types";

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestion?: AICopilotSuggestion;
  applied?: boolean;
  targetContext?: { id: string; type: "project" | "certificate" };
}

export default function StudioCopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Halo Daffa! Saya **Portfolio Copilot**, asisten strategis portofolio Anda. Saya dapat membantu mengoptimasi deskripsi proyek (seperti InstanPage atau Foodmart), menajamkan narasi teknis, menganalisis kelengkapan konten, atau merumuskan metadata SEO yang menarik bagi tech recruiter."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    { label: "Optimasi Deskripsi InstanPage", prompt: "Tingkatkan deskripsi InstanPage dengan menonjolkan kolaborasi 3 orang dan tech stack backend.", contextId: "instanpage", type: "project" as const },
    { label: "Review Teknis Foodmart", prompt: "Berikan saran peningkatan deskripsi arsitektur serverless Foodmart.", contextId: "foodmart", type: "project" as const },
    { label: "Analisis Kelengkapan Portofolio", prompt: "Analisis seluruh portofolio saya dan berikan rekomendasi area yang masih kurang lengkap.", type: "general" as const },
    { label: "Optimasi Ringkasan Pariwisata", prompt: "Perjelas bahwa proyek Pariwisata dibangun murni dengan Vanilla JavaScript.", contextId: "pariwisata", type: "project" as const }
  ];

  async function handleSend(promptText?: string, contextId?: string, type: "project" | "certificate" | "general" = "general") {
    const textToSend = promptText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          contextId,
          type
        })
      });

      const data = await res.json();
      const assistantMsg: Message = {
        role: "assistant",
        content: data.message || "Rekomendasi telah disiapkan.",
        suggestion: data.suggestion,
        targetContext: contextId ? { id: contextId, type: type === "certificate" ? "certificate" : "project" } : undefined
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error("Copilot error", e);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Terjadi kesalahan saat memproses permintaan. Silakan periksa koneksi atau coba lagi."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function applySuggestion(msgIndex: number) {
    const msg = messages[msgIndex];
    if (!msg.suggestion || !msg.targetContext) return;

    try {
      const { id, type } = msg.targetContext;
      const endpoint = type === "project" ? `/api/studio/projects/${id}` : `/api/studio/certificates/${id}`;

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [msg.suggestion.targetField]: msg.suggestion.suggestedValue
        })
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((m, idx) => (idx === msgIndex ? { ...m, applied: true } : m))
        );
      } else {
        alert("Gagal menerapkan perubahan ke database");
      }
    } catch (e) {
      console.error("Apply change error", e);
      alert("Terjadi kesalahan saat menyimpan perubahan");
    }
  }

  return (
    <div className="studio-page studio-copilot-page">
      <div className="studio-header">
        <div>
          <div className="studio-kicker">AI ASSISTANT</div>
          <h1>Portfolio Copilot</h1>
          <p>Konsultan AI privat untuk meninjau, menyempurnakan, dan mengoptimalkan konten portofolio Anda.</p>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="studio-copilot-chips">
        {quickPrompts.map((q, i) => (
          <button
            key={i}
            className="studio-copilot-chip"
            onClick={() => handleSend(q.prompt, q.contextId, q.type)}
            disabled={loading}
          >
            <Sparkles size={13} className="text-cyan-400" />
            <span>{q.label}</span>
          </button>
        ))}
      </div>

      {/* Conversation Stage */}
      <div className="studio-copilot-stage">
        {messages.map((msg, idx) => (
          <div key={idx} className={`studio-copilot-msg ${msg.role}`}>
            <div className="studio-copilot-avatar">
              {msg.role === "assistant" ? <Bot size={18} /> : <span>You</span>}
            </div>
            <div className="studio-copilot-body">
              <div className="studio-copilot-text" style={{ whiteSpace: "pre-wrap" }}>
                {msg.content}
              </div>

              {/* Suggestion Diff Preview */}
              {msg.suggestion && (
                <div className="studio-copilot-suggestion-card">
                  <div className="studio-copilot-head">
                    <Sparkles size={16} className="text-cyan-400" />
                    <div>
                      <strong>Saran Perubahan: Field {msg.suggestion.targetField}</strong>
                      <small>{msg.suggestion.rationale}</small>
                    </div>
                  </div>

                  <div className="studio-diff-view">
                    <div className="studio-diff-old">
                      <span className="studio-diff-label">Saat Ini:</span>
                      <p>{msg.suggestion.originalValue}</p>
                    </div>
                    <div className="studio-diff-new">
                      <span className="studio-diff-label">Saran Baru:</span>
                      <p>{msg.suggestion.suggestedValue}</p>
                    </div>
                  </div>

                  {msg.suggestion.changesSummary && (
                    <ul className="studio-copilot-points">
                      {msg.suggestion.changesSummary.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  )}

                  <div className="studio-copilot-actions">
                    {msg.applied ? (
                      <span className="studio-applied-badge">
                        <CheckCircle2 size={16} /> Perubahan Berhasil Diterapkan ke Database
                      </span>
                    ) : (
                      <button
                        className="studio-btn studio-btn-primary studio-btn-sm"
                        onClick={() => applySuggestion(idx)}
                      >
                        <Check size={14} /> Terapkan Perubahan (Apply Change)
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="studio-copilot-msg assistant">
            <div className="studio-copilot-avatar">
              <Bot size={18} />
            </div>
            <div className="studio-copilot-body">
              <div className="studio-copilot-typing">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="studio-copilot-input-bar"
      >
        <input
          type="text"
          placeholder="Tanyakan rekomendasi konten, perbaikan narasi, atau perbandingan teknis..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="studio-btn studio-btn-primary"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
