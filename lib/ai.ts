import { db } from "./db";
import type { AIMessage, AICopilotSuggestion, Project, Certificate } from "./types";

interface AIConfig {
  provider: "gemini" | "openai" | "groq" | "fallback";
  apiKey: string;
  model: string;
}

function getAIConfig(): AIConfig {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  const apiKey =
    process.env.AI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.GROQ_API_KEY ||
    "";

  let defaultModel = "gemini-1.5-flash";
  if (provider === "openai") defaultModel = "gpt-4o-mini";
  if (provider === "groq") defaultModel = "llama-3.3-70b-versatile";

  const model = process.env.AI_MODEL || defaultModel;

  if (!apiKey) {
    return { provider: "fallback", apiKey: "", model };
  }

  return {
    provider: provider as AIConfig["provider"],
    apiKey,
    model
  };
}

function buildPortfolioContext(): string {
  const profile = db.getProfile();
  const skills = db.getSkills();
  const projects = db.getProjects();
  const certs = db.getCertificates();

  return `
=== DAFFA PORTFOLIO VERIFIED KNOWLEDGE BASE ===
NAMA: ${profile.fullName} (${profile.name})
ROLE: ${profile.role}
LOKASI: ${profile.location}
EMAIL: ${profile.email}
GITHUB: ${profile.github}
BIO: ${profile.bio}

PENDIDIKAN:
${profile.education.map((e) => `- ${e.period}: ${e.institution} (${e.field})`).join("\n")}

KEAHLIAN & TEKNOLOGI (SKILLS):
${skills.map((s) => `- ${s.group}: ${s.items.join(", ")}`).join("\n")}

PROYEK-PROYEK TERVERIFIKASI (${projects.length} Total):
${projects
  .map(
    (p, idx) => `
[PROYEK #${idx + 1}]
- ID: ${p.id}
- Judul: ${p.title}
- Kategori: ${p.category}
- Tagline: ${p.tagline}
- Deskripsi Singkat: ${p.shortDescription}
- Deskripsi Lengkap: ${p.fullDescription}
- Role Daffa: ${p.role || "Developer"}
- Ukuran Tim: ${p.teamSize || 1} orang
- Catatan Kolaborasi: ${p.collaborationDescription || (p.teamSize && p.teamSize > 1 ? "Dikerjakan bersama tim" : "Dikerjakan mandiri")}
- Teknologi: ${p.technologies.join(", ")}
- Fitur Utama: ${p.features ? p.features.join("; ") : "-"}
- Live Demo: ${p.projectUrl || "Tidak ada"}
- GitHub: ${p.githubUrl || "Tidak dicantumkan"}
- Featured: ${p.featured ? "Ya (Featured)" : "Tidak"}
`
  )
  .join("\n")}

SERTIFIKASI TERVERIFIKASI (${certs.length} Total):
${certs
  .map(
    (c, idx) => `
[SERTIFIKAT #${idx + 1}]
- Judul: ${c.title}
- Penerbit: ${c.issuer}
- Tanggal: ${c.issueDate}
- Deskripsi: ${c.description || "-"}
- Credential URL: ${c.credentialUrl || "-"}
`
  )
  .join("\n")}
=== AKHIR KNOWLEDGE BASE ===
`.trim();
}

// Low-latency, zero-hallucination intelligent fallback when no external LLM API key is set
function answerWithLocalRAG(query: string): { text: string; actions: AIMessage["actions"] } {
  const q = query.toLowerCase();
  const projects = db.getProjects();
  const certs = db.getCertificates();
  const profile = db.getProfile();
  const skills = db.getSkills();

  const actions: AIMessage["actions"] = [];

  // InstanPage specific query
  if (q.includes("instanpage") || q.includes("instant page") || q.includes("landing page")) {
    const instan = projects.find((p) => p.slug === "instanpage" || p.id === "instanpage");
    if (instan) {
      actions.push({ label: "Buka InstanPage", url: instan.projectUrl || "#projects", type: "link" });
      actions.push({ label: "Lihat Semua Proyek", url: "#projects", type: "scroll" });
      return {
        text: `**InstanPage** adalah aplikasi pembuat landing page promosi instan untuk UMKM dan campaign dengan template siap pakai. \n\n` +
          `• **Kolaborasi & Tim**: Proyek ini dikembangkan secara kolaboratif bersama **2 rekan tim (total 3 orang)**.\n` +
          `• **Kontribusi Daffa**: Arsitektur full-stack, integrasi backend Express.js, skema database Prisma/MySQL, kontainerisasi Docker, serta automated testing dengan Vitest.\n` +
          `• **Tech Stack**: Next.js, React, Express.js, MySQL, Prisma, Docker, Vitest, Tailwind CSS.\n` +
          `• **Live Demo**: ${instan.projectUrl}`,
        actions
      };
    }
  }

  // Foodmart query
  if (q.includes("foodmart") || q.includes("food mart") || q.includes("makanan")) {
    const foodmart = projects.find((p) => p.slug === "foodmart" || p.id === "foodmart");
    if (foodmart) {
      actions.push({ label: "Buka Foodmart", url: foodmart.projectUrl || "#projects", type: "link" });
      return {
        text: `**Foodmart** adalah website pemesanan makanan online dengan katalog menu, promo, keranjang belanja, dan dashboard admin. Frontend & backend dipisah sebagai dua service independen, dengan REST API serverless di Vercel.\n\n` +
          `• **Tech Stack**: Next.js, TypeScript, Tailwind CSS, Node.js, Vercel.\n` +
          `• **Live Demo**: ${foodmart.projectUrl}`,
        actions
      };
    }
  }

  // Pariwisata query
  if (q.includes("pariwisata") || q.includes("wisata") || q.includes("jakarta")) {
    const pariwisata = projects.find((p) => p.slug === "pariwisata" || p.id === "pariwisata");
    if (pariwisata) {
      actions.push({ label: "Buka Pariwisata", url: pariwisata.projectUrl || "#projects", type: "link" });
      return {
        text: `**Pariwisata** adalah website eksplorasi wisata & booking di Jakarta dengan fitur pemesanan tiket, booking hotel, destinasi, kuliner, dan galeri. Proyek ini dibangun murni menggunakan HTML, CSS, dan JavaScript native tanpa framework untuk memaksimalkan performa.\n\n` +
          `• **Live Demo**: ${pariwisata.projectUrl}`,
        actions
      };
    }
  }

  // Projects general
  if (q.includes("proyek") || q.includes("project") || q.includes("karya") || q.includes("portofolio")) {
    actions.push({ label: "Lihat Bagian Proyek", url: "#projects", type: "scroll" });
    const featuredList = projects.filter((p) => p.featured).map((p) => `• **${p.title}** (${p.category}) — ${p.tagline}`).join("\n");
    return {
      text: `Daffa telah membangun lebih dari ${projects.length} proyek web, desktop, mobile, dan AI. 3 proyek unggulan utama adalah:\n\n${featuredList}\n\nAda juga proyek desktop seperti *Kas Kelas* (Electron) & *Hubin*, sistem AI *Exam Monitoring System* (OpenCV/MediaPipe), dan lainnya.`,
      actions
    };
  }

  // Certificates
  if (q.includes("sertifikat") || q.includes("certificate") || q.includes("sertifikasi") || q.includes("lisensi")) {
    actions.push({ label: "Lihat Sertifikat", url: "#certificates", type: "scroll" });
    const certList = certs.slice(0, 4).map((c) => `• **${c.title}** — ${c.issuer} (${c.issueDate})`).join("\n");
    return {
      text: `Daffa memiliki ${certs.length} sertifikasi di bidang Artificial Intelligence, Information Security, dan Web Development:\n\n${certList}\n\n...dan sertifikasi lainnya dari Komdigi serta lembaga terkemuka.`,
      actions
    };
  }

  // Skills / Stack
  if (q.includes("skill") || q.includes("kemampuan") || q.includes("teknologi") || q.includes("bahasa") || q.includes("stack") || q.includes("next.js") || q.includes("backend")) {
    actions.push({ label: "Lihat Skills", url: "#skills", type: "scroll" });
    const allSkills = skills.map((s) => `• **${s.group}**: ${s.items.join(", ")}`).join("\n");
    return {
      text: `Keahlian dan teknologi yang dikuasai Daffa mencakup:\n\n${allSkills}\n\nDaffa memiliki fokus mendalam pada Back-End Development dan arsitektur aplikasi modern.`,
      actions
    };
  }

  // Contact / Hubungi
  if (q.includes("kontak") || q.includes("contact") || q.includes("hubungi") || q.includes("email") || q.includes("hire") || q.includes("pesan")) {
    actions.push({ label: "Kirim Pesan", url: "#contact", type: "scroll" });
    actions.push({ label: "Email Daffa", url: `mailto:${profile.email}`, type: "link" });
    return {
      text: `Anda dapat menghubungi Muhamad Daffa Permana melalui:\n\n• **Email**: ${profile.email}\n• **GitHub**: ${profile.github}\n• **Lokasi**: ${profile.location}\n\nAtau gunakan formulir pesan di bagian bawah portfolio.`,
      actions
    };
  }

  // About / Siapa Daffa
  if (q.includes("siapa") || q.includes("profil") || q.includes("about") || q.includes("daffa") || q.includes("halo") || q.includes("hai")) {
    actions.push({ label: "Lihat Proyek", url: "#projects", type: "scroll" });
    actions.push({ label: "Hubungi Daffa", url: "#contact", type: "scroll" });
    return {
      text: `Halo! Saya **Daffa AI**, asisten portofolio **Muhamad Daffa Permana**.\n\nDaffa adalah seorang **Junior Software Developer** dengan fokus pada Back-End Development serta pengalaman membangun aplikasi web modern (Next.js, Express, React), aplikasi desktop (Electron), mobile (Flutter), dan AI/Computer Vision (Python, OpenCV).\n\nAda yang ingin Anda ketahui tentang proyek, keahlian, atau sertifikasi Daffa?`,
      actions
    };
  }

  // Generic fallback with strict anti-hallucination
  actions.push({ label: "Jelajahi Proyek", url: "#projects", type: "scroll" });
  actions.push({ label: "Hubungi Daffa", url: "#contact", type: "scroll" });
  return {
    text: `Informasi spesifik tersebut belum tercatat dalam basis data portofolio Daffa. Anda dapat melihat proyek-proyek terbaru di bagian Proyek atau menghubungi Daffa langsung melalui email: **${profile.email}**.`,
    actions
  };
}

// Call external LLM provider
async function callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
  const config = getAIConfig();
  if (config.provider === "fallback" || !config.apiKey) {
    throw new Error("No API key configured for external LLM");
  }

  if (config.provider === "gemini") {
    // Direct Google Gemini REST API (v1beta)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\nUSER PROMPT:\n${userPrompt}` }] }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const candidate = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) throw new Error("Empty response from Gemini API");
    return candidate;
  }

  if (config.provider === "openai" || config.provider === "groq") {
    const baseUrl =
      config.provider === "groq"
        ? "https://api.groq.com/openai/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`${config.provider} API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const message = data?.choices?.[0]?.message?.content;
    if (!message) throw new Error(`Empty response from ${config.provider}`);
    return message;
  }

  throw new Error(`Unsupported provider: ${config.provider}`);
}

export const ai = {
  // Visitor AI Assistant
  async answerVisitor(query: string, history: Array<{ role: "user" | "assistant"; content: string }> = []): Promise<AIMessage> {
    const context = buildPortfolioContext();
    const config = getAIConfig();

    const systemPrompt = `
Anda adalah "Daffa AI", asisten pintar representasi portofolio resmi Muhamad Daffa Permana.
Tugas Anda adalah menjawab pertanyaan pengunjung dengan ramah, profesional, ringkas, dan akurat.

ATURAN UTAMA (ANTI-HALLUCINATION STRICT RULE):
1. Jawab HANYA berdasarkan fakta yang tertulis dalam KNOWLEDGE BASE di bawah.
2. JANGAN PERNAH mengarang pengalaman kerja, perusahaan, klien, gaji, penghargaan, atau sertifikat yang tidak tertulis.
3. Jika informasi yang ditanyakan tidak ada dalam knowledge base, katakan secara sopan bahwa informasi tersebut tidak tersedia di portofolio.
4. Untuk proyek InstanPage: Selalu sebutkan dengan jujur bahwa proyek tersebut dikembangkan bersama tim (3 orang), bukan sendiri, dengan fokus Daffa pada backend, Prisma/MySQL, Docker, dan testing Vitest.
5. Berikan jawaban dalam bahasa Indonesia yang natural dan ramah.
6. Buat jawaban padat dan mudah dibaca (gunakan bullet points jika membantu).

${context}
`;

    // Try external LLM if configured, otherwise use high-fidelity local RAG
    if (config.provider !== "fallback" && config.apiKey) {
      try {
        const conversationSnippet = history
          .slice(-4)
          .map((h) => `${h.role === "user" ? "User" : "Assistant"}: ${h.content}`)
          .join("\n");

        const prompt = conversationSnippet ? `${conversationSnippet}\nUser: ${query}` : query;
        const text = await callLLM(systemPrompt, prompt);

        // Deduce navigation actions from query & response
        const actions: AIMessage["actions"] = [];
        const lower = `${query} ${text}`.toLowerCase();
        if (lower.includes("instanpage")) {
          const instan = db.getProjectById("instanpage");
          if (instan?.projectUrl) actions.push({ label: "Buka InstanPage", url: instan.projectUrl, type: "link" });
        }
        if (lower.includes("foodmart")) {
          const food = db.getProjectById("foodmart");
          if (food?.projectUrl) actions.push({ label: "Buka Foodmart", url: food.projectUrl, type: "link" });
        }
        if (lower.includes("pariwisata")) {
          const pari = db.getProjectById("pariwisata");
          if (pari?.projectUrl) actions.push({ label: "Buka Pariwisata", url: pari.projectUrl, type: "link" });
        }
        if (lower.includes("sertifikat") || lower.includes("certificate")) {
          actions.push({ label: "Lihat Sertifikat", url: "#certificates", type: "scroll" });
        }
        if (lower.includes("kontak") || lower.includes("contact") || lower.includes("email")) {
          actions.push({ label: "Hubungi Daffa", url: "#contact", type: "scroll" });
        }
        if (actions.length === 0) {
          actions.push({ label: "Lihat Proyek", url: "#projects", type: "scroll" });
        }

        return {
          role: "assistant",
          content: text,
          actions: actions.slice(0, 3)
        };
      } catch (err) {
        console.warn("External LLM failed, using intelligent local RAG fallback:", err);
      }
    }

    const localResult = answerWithLocalRAG(query);
    return {
      role: "assistant",
      content: localResult.text,
      actions: localResult.actions
    };
  },

  // Admin AI Portfolio Copilot
  async runCopilot(prompt: string, contextId?: string, type: "project" | "certificate" | "general" = "project"): Promise<{
    message: string;
    suggestion?: AICopilotSuggestion;
  }> {
    const config = getAIConfig();
    let targetProject: Project | undefined;
    let targetCert: Certificate | undefined;

    if (type === "project" && contextId) {
      targetProject = db.getProjectById(contextId);
    } else if (type === "certificate" && contextId) {
      targetCert = db.getCertificateById(contextId);
    }

    const targetData = targetProject || targetCert;

    const systemPrompt = `
Anda adalah "Portfolio Copilot", AI konsultan profesional khusus untuk membantu pemilik portofolio (Muhamad Daffa Permana) mengoptimasi konten, deskripsi teknis, SEO metadata, dan kelengkapan portofolio.

ATURAN COPILOT:
1. Jangan langsung menimpa data sembarangan. Berikan saran yang terstruktur dan bermakna.
2. Gunakan terminologi rekayasa perangkat lunak modern yang elegan dan presisi.
3. Tetap pertahankan fakta asli (misal: InstanPage adalah kerja tim 3 orang, Pariwisata berbasis vanilla JS, dsb).
4. Berikan output format JSON jika diminta saran perubahan.
`;

    if (config.provider !== "fallback" && config.apiKey) {
      try {
        const userPrompt = `
Konteks Data Saat Ini:
${JSON.stringify(targetData || { allProjects: db.getProjects().map((p) => ({ id: p.id, title: p.title })) }, null, 2)}

Permintaan Admin:
${prompt}

Berikan respon informatif. Jika ada rekomendasi perbaikan teks spesifik, sertakan JSON dengan format:
\`\`\`json
{
  "targetField": "fullDescription" | "tagline" | "shortDescription" | "collaborationDescription",
  "originalValue": "...",
  "suggestedValue": "...",
  "rationale": "...",
  "changesSummary": ["poin 1", "poin 2"]
}
\`\`\`
`;
        const response = await callLLM(systemPrompt, userPrompt);
        let suggestion: AICopilotSuggestion | undefined;

        // Try extracting JSON suggestion if provided
        const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          try {
            suggestion = JSON.parse(jsonMatch[1]);
          } catch {
            // ignore parse failure
          }
        }

        const cleanMessage = response.replace(/```json[\s\S]*?```/, "").trim();
        return {
          message: cleanMessage || response,
          suggestion
        };
      } catch (err) {
        console.warn("External copilot LLM failed, using intelligent local engine:", err);
      }
    }

    // Local Copilot Engine
    if (targetProject) {
      if (targetProject.slug === "instanpage" || targetProject.id === "instanpage") {
        return {
          message: `Rekomendasi optimasi untuk **InstanPage**: Penjelasan kolaborasi tim dan arsitektur backend telah disusun secara profesional agar menarik bagi tech recruiter.`,
          suggestion: {
            targetField: "fullDescription",
            originalValue: targetProject.fullDescription,
            suggestedValue: `Platform SaaS Landing Page Builder modern untuk UMKM dan digital marketer. Dikembangkan secara kolaboratif bersama 2 rekan tim (tim 3 orang). Bertanggung jawab atas arsitektur backend REST API, pemodelan database relasional dengan Prisma ORM & MySQL, kontainerisasi Docker Compose untuk konsistensi deployment, serta automated unit testing dengan Vitest.`,
            rationale: `Memperjelas pembagian peran tim secara transparan dan menonjolkan keahlian backend (Prisma, Docker, Vitest).`,
            changesSummary: [
              "Menyebutkan ukuran tim 3 orang secara eksplisit",
              "Menyoroti tanggung jawab spesifik pada database & backend testing",
              "Menghilangkan klaim berlebihan dan menjaga akurasi teknis"
            ]
          }
        };
      }

      return {
        message: `Rekomendasi optimasi untuk **${targetProject.title}**: Penajaman deskripsi teknis dan pemaparan solusi arsitektural.`,
        suggestion: {
          targetField: "fullDescription",
          originalValue: targetProject.fullDescription,
          suggestedValue: `${targetProject.fullDescription} Dirancang dengan fokus pada efisiensi performa, kebersihan kode (clean code), dan kemudahan pemeliharaan sistem.`,
          rationale: `Meningkatkan bobot teknis pada deskripsi proyek.`,
          changesSummary: [
            "Menambahkan penekanan pada standar clean code",
            "Meningkatkan profesionalitas kalimat"
          ]
        }
      };
    }

    return {
      message: `Portfolio Copilot aktif. Portofolio Anda saat ini memiliki ${db.getProjects().length} proyek dan ${db.getCertificates().length} sertifikasi. Anda dapat meminta saya menyempurnakan deskripsi proyek apa pun, menganalisis link, atau memperbaiki SEO metadata.`
    };
  }
};
