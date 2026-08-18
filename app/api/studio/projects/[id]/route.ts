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
  const project = db.getProjectById(id);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
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

    if (body.technologies && typeof body.technologies === "string") {
      body.technologies = body.technologies.split(",").map((s: string) => s.trim()).filter(Boolean);
    }

    const updated = db.updateProject(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
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
    const deleted = db.deleteProject(id);
    if (!deleted) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
