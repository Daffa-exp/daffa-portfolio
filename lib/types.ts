export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  role?: string;
  teamSize?: number;
  collaborationDescription?: string;
  technologies: string[];
  features?: string[];
  challenges?: string[];
  solutions?: string[];
  results?: string[];
  projectUrl?: string;
  githubUrl?: string;
  coverImage: string;
  galleryImages: string[];
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  description?: string;
  credentialUrl?: string;
  imageUrl: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  type: string;
  size: number;
  alt?: string;
  createdAt: string;
}

export interface ProfileInfo {
  name: string;
  fullName: string;
  role: string;
  bio: string;
  about: string[];
  location: string;
  email: string;
  github: string;
  avatarUrl: string;
  education: Array<{
    period: string;
    institution: string;
    field: string;
  }>;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface StudioHealth {
  totalProjects: number;
  featuredProjects: number;
  totalCertificates: number;
  totalMedia: number;
  completenessScore: number;
  brokenLinks: Array<{ projectId: string; title: string; url: string; reason: string }>;
  missingDescriptions: Array<{ id: string; type: "project" | "certificate"; title: string }>;
  missingImages: Array<{ id: string; type: "project" | "certificate"; title: string }>;
  aiRecommendations: string[];
}

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
  actions?: Array<{
    label: string;
    url?: string;
    type?: "link" | "scroll" | "modal";
    target?: string;
  }>;
}

export interface AICopilotSuggestion {
  targetField: string;
  originalValue: string;
  suggestedValue: string;
  rationale: string;
  changesSummary: string[];
}
