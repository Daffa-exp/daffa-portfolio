import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const authCheck = await auth.requireAdmin();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 });
  }

  const { id } = await context.params;
  const cert = db.getCertificateById(id);
  if (!cert) {
    return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
  }

  return NextResponse.json(cert);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = await auth.requireAdmin();
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const updated = db.updateCertificate(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update certificate error:", error);
    return NextResponse.json({ error: "Failed to update certificate" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = await auth.requireAdmin();
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }

    const { id } = await context.params;
    const deleted = db.deleteCertificate(id);
    if (!deleted) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Certificate deleted" });
  } catch (error) {
    console.error("Delete certificate error:", error);
    return NextResponse.json({ error: "Failed to delete certificate" }, { status: 500 });
  }
}
