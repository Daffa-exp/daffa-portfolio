import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const message = String(form.get("message") || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Nama, email, dan pesan wajib diisi." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO || "permanadaffa89@gmail.com";
    const from = process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>";

    if (!apiKey) {
      return NextResponse.json({ error: "Email service belum dikonfigurasi. Tambahkan RESEND_API_KEY di .env.local." }, { status: 503 });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio message from ${name}`,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.7;color:#111">
            <h2>New Portfolio Message</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Resend error:", detail);
      return NextResponse.json({ error: "Email service menolak pengiriman." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat mengirim pesan." }, { status: 500 });
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
