import Image from "next/image";
import type { Project } from "@/lib/types";
import { hostOf, isPortraitProject } from "@/lib/display";

interface ProjectFrameProps {
  project: Project;
  sizes: string;
  priority?: boolean;
  /** which gallery image to show; defaults to the cover */
  src?: string;
}

/**
 * Product screenshot frame: dark UI surface, 12px radius, monochrome chrome.
 * Real project screenshots are the visual evidence; nothing here is decorative imagery.
 */
export function ProjectFrame({ project, sizes, priority = false, src }: ProjectFrameProps) {
  const image = src || project.coverImage || project.galleryImages?.[0] || "";
  const portrait = isPortraitProject(project.category);
  const host = hostOf(project.projectUrl);

  return (
    <div className={`frame ${portrait ? "frame--portrait" : ""}`}>
      <div className="frame__bar" aria-hidden="true">
        <span className="frame__dots">
          <i />
          <i />
          <i />
        </span>
        {host ? <span className="frame__url">{host}</span> : <span className="frame__url frame__url--quiet">{project.title}</span>}
      </div>
      <div className="frame__screen">
        {image && (
          <Image
            className="frame__img"
            src={image}
            alt={`${project.title} screenshot`}
            fill
            sizes={sizes}
            priority={priority}
          />
        )}
      </div>
    </div>
  );
}
