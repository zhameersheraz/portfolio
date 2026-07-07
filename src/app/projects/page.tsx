import type { Metadata } from "next";
import { Projects } from "@/components/project-card";
import { SectionHeader } from "@/components/about";

export const metadata: Metadata = {
  title: "Projects",
  description: "All the repos I have shipped or actively maintain.",
};

export default function ProjectsPage() {
  return (
    <div className="container-wide pt-28 pb-24">
      <SectionHeader
        index="01"
        label="Projects"
        title="All projects"
        description="Everything publicly visible on my GitHub — repos I own or actively maintain."
      />
      <div className="mt-10">
        <Projects />
      </div>
    </div>
  );
}