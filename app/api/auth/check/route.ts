import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  const isAuth = await auth.isAuthenticated();
  return NextResponse.json({ authenticated: isAuth });
}
