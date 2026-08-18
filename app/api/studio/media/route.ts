import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const authCheck = await auth.requireAdmin();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 });
  }

  const media = db.getMedia();
  return NextResponse.json(media);
}
