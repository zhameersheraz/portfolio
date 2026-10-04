import type { Metadata } from "next";
import { Projects } from "@/components/project-card";
import { SectionHeader } from "@/components/about";

export const metadata: Metadata = {
  title: "Projects",
  description: "The public repos I have shipped or actively maintain.",
};

export default function ProjectsPage() {
  return (
    <div className="container-wide pt-28 pb-24">
      <SectionHeader
        index="01"
        label="Projects"
        title="Public projects"
        description="Everything here is public on my GitHub. Repos I own or actively maintain. Some other work stays private."
      />
      <div className="mt-10">
        <Projects bare />
      </div>
    </div>
  );
}