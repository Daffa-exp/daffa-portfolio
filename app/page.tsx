import PortfolioPage from "@/components/PortfolioPage";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function Home() {
  const projects = db.getProjects();
  const certificates = db.getCertificates();
  const skills = db.getSkills();

  return (
    <PortfolioPage
      initialProjects={projects}
      initialCertificates={certificates}
      initialSkills={skills}
    />
  );
}
