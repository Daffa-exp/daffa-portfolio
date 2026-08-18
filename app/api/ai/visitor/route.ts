import { NextResponse } from "next/server";
import { ai } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, history } = body;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    if (query.length > 500) {
      return NextResponse.json({ error: "Query too long (max 500 chars)" }, { status: 400 });
    }

    const response = await ai.answerVisitor(query.trim(), Array.isArray(history) ? history : []);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Visitor AI API error:", error);
    return NextResponse.json({
      role: "assistant",
      content: "Maaf, terjadi kendala saat memproses pertanyaan Anda. Silakan coba lagi sebentar lagi atau hubungi Daffa melalui kontak yang tersedia.",
      actions: [{ label: "Lihat Proyek", url: "#projects", type: "scroll" }]
    });
  }
}
