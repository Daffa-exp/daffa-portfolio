import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST() {
  try {
    await auth.destroySession();
    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
