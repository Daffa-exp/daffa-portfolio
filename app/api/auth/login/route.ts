import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    const isValid = auth.validatePassword(password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
    }

    await auth.createSession();
    return NextResponse.json({ success: true, message: "Logged in successfully" });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Internal authentication error" }, { status: 500 });
  }
}
