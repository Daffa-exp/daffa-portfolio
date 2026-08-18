import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const authCheck = await auth.requireAdmin();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 });
  }

  const projects = db.getProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  try {
    const authCheck = await auth.requireAdmin();
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, category, tagline, shortDescription, fullDescription, coverImage, galleryImages, technologies } = body;

    if (!title || !shortDescription || !fullDescription) {
      return NextResponse.json({ error: "Title, short description, and full description are required" }, { status: 400 });
    }

    const newProject = db.createProject({
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: category || "WEB APPLICATION",
      tagline: tagline || "",
      shortDescription,
      fullDescription,
      role: body.role || "Developer",
      teamSize: Number(body.teamSize) || 1,
      collaborationDescription: body.collaborationDescription || "",
      technologies: Array.isArray(technologies) ? technologies : (typeof technologies === "string" ? technologies.split(",").map((s: string) => s.trim()).filter(Boolean) : []),
      features: Array.isArray(body.features) ? body.features : [],
      challenges: Array.isArray(body.challenges) ? body.challenges : [],
      solutions: Array.isArray(body.solutions) ? body.solutions : [],
      results: Array.isArray(body.results) ? body.results : [],
      projectUrl: body.projectUrl || "",
      githubUrl: body.githubUrl || "",
      coverImage: coverImage || "/assets/projects/foodmart/1.webp",
      galleryImages: Array.isArray(galleryImages) && galleryImages.length > 0 ? galleryImages : [coverImage || "/assets/projects/foodmart/1.webp"],
      featured: Boolean(body.featured),
      order: Number(body.order) || db.getProjects().length + 1
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
