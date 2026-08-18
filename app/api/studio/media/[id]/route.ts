import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

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
    const result = db.deleteMedia(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Cannot delete media" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Media deleted successfully" });
  } catch (error) {
    console.error("Delete media error:", error);
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
}
