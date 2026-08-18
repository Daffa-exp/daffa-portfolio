import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const projects = db.getProjects();
  const certificates = db.getCertificates();
  const profile = db.getProfile();
  const skills = db.getSkills();

  return NextResponse.json({
    projects,
    featuredProjects: projects.filter((p) => p.featured),
    moreProjects: projects.filter((p) => !p.featured),
    certificates,
    profile,
    skills
  });
}
