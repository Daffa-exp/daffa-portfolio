import type { SkillGroup } from "./types";

/** "FULL-STACK WEB" -> "Full-stack web". Display only; stored data is untouched. */
export function sentenceCase(value: string): string {
  const lower = value.trim().toLowerCase();
  if (!lower) return "";
  const acronyms = lower.replace(/\bai\b/g, "AI").replace(/\bui\b/g, "UI");
  return acronyms.charAt(0).toUpperCase() + acronyms.slice(1);
}

export function hostOf(url?: string): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export type SkillCategoryKey = "frontend" | "backend" | "mobile" | "database" | "ai" | "tools";

export interface SkillCategory {
  key: SkillCategoryKey;
  label: string;
  note: string;
  items: string[];
}

const CATEGORY_META: Record<SkillCategoryKey, { label: string; note: string }> = {
  frontend: { label: "Frontend", note: "Interfaces for web apps and landing pages" },
  backend: { label: "Backend", note: "APIs, services and server-side logic" },
  mobile: { label: "Mobile & desktop", note: "Apps outside the browser" },
  database: { label: "Database", note: "Relational, hosted and ORM-driven storage" },
  ai: { label: "AI", note: "Building with and for AI tools" },
  tools: { label: "Tools", note: "Environment, versioning and delivery" }
};

const ORDER: SkillCategoryKey[] = ["frontend", "backend", "mobile", "database", "ai", "tools"];

const LOOKUP: Record<string, SkillCategoryKey> = {
  html: "frontend",
  css: "frontend",
  javascript: "frontend",
  typescript: "frontend",
  react: "frontend",
  "next.js": "frontend",
  nextjs: "frontend",
  "tailwind css": "frontend",
  tailwind: "frontend",
  "node.js": "backend",
  nodejs: "backend",
  "express.js": "backend",
  express: "backend",
  python: "backend",
  php: "backend",
  laravel: "backend",
  flask: "backend",
  flutter: "mobile",
  dart: "mobile",
  electron: "mobile",
  mysql: "database",
  firebase: "database",
  supabase: "database",
  prisma: "database",
  postgresql: "database",
  "ai-assisted development": "ai",
  docker: "tools",
  git: "tools",
  vitest: "tools"
};

/** Regroups the flat studio-managed skill list into the six display categories. */
export function groupSkills(groups: SkillGroup[]): SkillCategory[] {
  const buckets = new Map<SkillCategoryKey, string[]>(ORDER.map((k) => [k, []]));
  const seen = new Set<string>();

  for (const group of groups) {
    for (const item of group.items) {
      const key = LOOKUP[item.trim().toLowerCase()] ?? "tools";
      const id = item.trim().toLowerCase();
      if (seen.has(id)) continue;
      seen.add(id);
      buckets.get(key)!.push(item);
    }
  }

  return ORDER.filter((k) => (buckets.get(k)?.length ?? 0) > 0).map((key) => ({
    key,
    label: CATEGORY_META[key].label,
    note: CATEGORY_META[key].note,
    items: buckets.get(key)!
  }));
}

/** Portrait screenshots (phone apps) need a different frame than desktop UI. */
export function isPortraitProject(category: string): boolean {
  return /mobile/i.test(category);
}
