import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const authCheck = await auth.requireAdmin();
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }

    const { ids } = await request.json();
    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: "IDs array is required" }, { status: 400 });
    }

    const reordered = db.reorderProjects(ids);
    return NextResponse.json(reordered);
  } catch (error) {
    console.error("Reorder projects error:", error);
    return NextResponse.json({ error: "Failed to reorder projects" }, { status: 500 });
  }
}
