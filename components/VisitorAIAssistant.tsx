"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Sparkles,
  X,
  Send,
  ExternalLink,
  ArrowDown,
  RotateCcw,
  MessageSquare
} from "lucide-react";
import type { AIMessage } from "@/lib/types";

export function VisitorAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      role: "assistant",
      content:
        "Halo! Saya **Daffa AI**, asisten interaktif portofolio Muhamad Daffa Permana.\n\nAda yang ingin Anda ketahui seputar proyek, keahlian backend, kolaborasi tim, atau kontak Daffa?",
      actions: [
        { label: "Proyek InstanPage", url: "#projects", type: "scroll" },
        { label: "Keahlian & Tech Stack", url: "#skills", type: "scroll" },
        { label: "Hubungi Daffa", url: "#contact", type: "scroll" }
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const quickQuestions = [
    "Ceritakan tentang proyek InstanPage",
    "Apa teknologi utama yang dikuasai Daffa?",
    "Apakah InstanPage dikerjakan sendiri?",
    "Proyek apa saja yang sudah live?",
    "Bagaimana cara menghubungi Daffa?"
  ];

  async function handleSend(textToSend?: string) {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: AIMessage = { role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          history: messages.slice(-4).map((m) => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.content,
          actions: data.actions
        }
      ]);
    } catch (e) {
      console.error("AI error", e);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Maaf, terjadi kendala saat memproses jawaban. Silakan coba kembali atau gunakan menu navigasi portofolio.",
          actions: [{ label: "Lihat Proyek", url: "#projects", type: "scroll" }]
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleActionClick(action: NonNullable<AIMessage["actions"]>[number]) {
    if (action.type === "link" && action.url) {
      window.open(action.url, "_blank", "noopener,noreferrer");
    } else if (action.url?.startsWith("#")) {
      const el = document.querySelector(action.url);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
      }
    }
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        className="visitor-ai-trigger"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Ask Daffa AI"
      >
        <div className="visitor-ai-trigger-inner">
          <div className="visitor-ai-pulse" />
          <Sparkles size={16} className="visitor-ai-sparkle" />
          <span className="visitor-ai-label">Ask Daffa AI</span>
        </div>
      </motion.button>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="visitor-ai-window"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            {/* Header */}
            <div className="visitor-ai-header">
              <div className="visitor-ai-header-title">
                <div className="visitor-ai-avatar">
                  <Bot size={17} />
                  <span className="visitor-ai-online" />
                </div>
                <div>
                  <strong>Daffa AI</strong>
                  <span>Portfolio Assistant • Grounded Facts</span>
                </div>
              </div>
              <button
                className="visitor-ai-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close AI Assistant"
              >
                <X size={17} />
              </button>
            </div>

            {/* Messages Stream */}
            <div className="visitor-ai-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`visitor-ai-msg ${msg.role}`}>
                  {msg.role === "assistant" && (
                    <div className="visitor-ai-msg-icon">
                      <Sparkles size={13} />
                    </div>
                  )}
                  <div className="visitor-ai-msg-content">
                    <p style={{ whiteSpace: "pre-wrap" }}>{msg.content}</p>

                    {/* Interactive Action Buttons */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="visitor-ai-actions-row">
                        {msg.actions.map((act, actIdx) => (
                          <button
                            key={actIdx}
                            className="visitor-ai-action-btn"
                            onClick={() => handleActionClick(act)}
                          >
                            <span>{act.label}</span>
                            {act.type === "link" ? (
                              <ExternalLink size={12} />
                            ) : (
                              <ArrowDown size={12} />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="visitor-ai-msg assistant">
                  <div className="visitor-ai-msg-icon">
                    <Sparkles size={13} />
                  </div>
                  <div className="visitor-ai-msg-content">
                    <div className="visitor-ai-typing">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips (when few messages) */}
            {messages.length <= 2 && (
              <div className="visitor-ai-chips">
                <small>Pertanyaan Cepat:</small>
                <div className="visitor-ai-chips-scroll">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      className="visitor-ai-chip"
                      onClick={() => handleSend(q)}
                      disabled={loading}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="visitor-ai-input-form"
            >
              <input
                type="text"
                placeholder="Tanyakan sesuatu tentang Daffa..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="visitor-ai-send-btn"
                aria-label="Send query"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
