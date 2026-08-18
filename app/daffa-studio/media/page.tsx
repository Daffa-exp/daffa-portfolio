"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  UploadCloud,
  Copy,
  Trash2,
  Check,
  AlertCircle,
  ImageIcon,
  FileText,
  Eye,
  X
} from "lucide-react";
import type { MediaItem } from "@/lib/types";

export default function StudioMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadMedia() {
    try {
      setLoading(true);
      const res = await fetch("/api/studio/media");
      if (res.ok) {
        const data = await res.json();
        setMediaList(data);
      }
    } catch (e) {
      console.error("Failed to load media", e);
      setError("Gagal memuat pustaka media");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedia();
  }, []);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt", file.name.replace(/\.[^/.]+$/, ""));

    setUploading(true);
    setError("");

    try {
      const res = await fetch("/api/studio/media/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengunggah file");
      }

      setMediaList((prev) => [data, ...prev]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal mengunggah file");
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(media: MediaItem) {
    const ok = window.confirm(`Apakah Anda yakin ingin menghapus media "${media.filename}"?`);
    if (!ok) return;

    try {
      const res = await fetch(`/api/studio/media/${media.id}`, {
        method: "DELETE"
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal menghapus media");
        return;
      }

      setMediaList((prev) => prev.filter((m) => m.id !== media.id));
      if (previewMedia?.id === media.id) setPreviewMedia(null);
    } catch (e) {
      console.error("Delete media error", e);
      alert("Terjadi kesalahan saat menghapus media");
    }
  }

  function copyToClipboard(url: string, id: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function formatBytes(bytes: number): string {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  return (
    <div className="studio-page">
      <div className="studio-header">
        <div>
          <div className="studio-kicker">ASSETS & STORAGE</div>
          <h1>Media Library</h1>
          <p>Kelola semua gambar, tangkapan layar proyek, dan sertifikat dalam satu tempat.</p>
        </div>
      </div>

      {error && (
        <div className="studio-alert studio-alert-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Box */}
      <div className="studio-upload-card">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif"
          style={{ display: "none" }}
        />
        <div
          className="studio-upload-dropzone"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud size={36} className="text-cyan-400" />
          <div>
            <strong>{uploading ? "Sedang Mengunggah..." : "Klik untuk Unggah Gambar"}</strong>
            <p>Mendukung format JPG, PNG, WEBP, SVG (Maks. 10MB)</p>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="studio-spinner-wrap">
          <div className="studio-spinner" />
        </div>
      ) : mediaList.length === 0 ? (
        <div className="studio-empty-state">
          <ImageIcon size={36} />
          <p>Belum ada media dalam pustaka.</p>
        </div>
      ) : (
        <div className="studio-media-grid">
          {mediaList.map((media) => (
            <div key={media.id} className="studio-media-card">
              <div className="studio-media-preview" onClick={() => setPreviewMedia(media)}>
                <Image
                  src={media.url}
                  alt={media.alt || media.filename}
                  fill
                  sizes="(max-width: 768px) 50vw, 220px"
                />
                <span className="studio-media-hover-overlay">
                  <Eye size={16} /> Preview
                </span>
              </div>

              <div className="studio-media-info">
                <strong title={media.filename}>{media.filename}</strong>
                <div className="studio-media-meta">
                  <span>{formatBytes(media.size)}</span>
                  <span>{media.type.replace("image/", "").toUpperCase()}</span>
                </div>
              </div>

              <div className="studio-media-actions">
                <button
                  className="studio-btn studio-btn-secondary studio-btn-sm"
                  onClick={() => copyToClipboard(media.url, media.id)}
                  title="Copy URL"
                >
                  {copiedId === media.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedId === media.id ? "Copied" : "Copy URL"}</span>
                </button>
                <button
                  className="studio-btn studio-btn-danger studio-btn-sm"
                  onClick={() => handleDelete(media)}
                  title="Hapus media"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Full Preview Modal */}
      {previewMedia && (
        <div className="studio-modal-backdrop" onClick={() => setPreviewMedia(null)}>
          <div className="studio-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="studio-modal-close" onClick={() => setPreviewMedia(null)}>
              <X size={18} />
            </button>
            <div className="studio-modal-image-stage">
              <Image
                src={previewMedia.url}
                alt={previewMedia.alt || previewMedia.filename}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
            <div className="studio-modal-details">
              <h4>{previewMedia.filename}</h4>
              <div className="studio-modal-meta-grid">
                <div><span>URL:</span> <code>{previewMedia.url}</code></div>
                <div><span>Size:</span> {formatBytes(previewMedia.size)}</div>
                <div><span>Type:</span> {previewMedia.type}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
