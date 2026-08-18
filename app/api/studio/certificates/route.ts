import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const authCheck = await auth.requireAdmin();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 });
  }

  const certs = db.getCertificates();
  return NextResponse.json(certs);
}

export async function POST(request: Request) {
  try {
    const authCheck = await auth.requireAdmin();
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }

    const body = await request.json();
    const { title, issuer, issueDate, imageUrl } = body;

    if (!title || !issuer || !issueDate) {
      return NextResponse.json({ error: "Title, issuer, and issue date are required" }, { status: 400 });
    }

    const newCert = db.createCertificate({
      title,
      issuer,
      issueDate,
      description: body.description || "",
      credentialUrl: body.credentialUrl || "",
      imageUrl: imageUrl || "/assets/certs/cert1.jpg",
      featured: body.featured !== undefined ? Boolean(body.featured) : true,
      order: Number(body.order) || db.getCertificates().length + 1
    });

    return NextResponse.json(newCert, { status: 201 });
  } catch (error) {
    console.error("Create certificate error:", error);
    return NextResponse.json({ error: "Failed to create certificate" }, { status: 500 });
  }
}
