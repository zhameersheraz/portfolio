import { Hero } from "@/components/hero";
import { Currently } from "@/components/currently";
import { StatsStrip } from "@/components/stats-strip";
import { Competitions } from "@/components/competitions";
import { Skills } from "@/components/skills";
import { Projects } from "@/components/project-card";
import { Contact } from "@/components/contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Currently />
      <StatsStrip />
      <Competitions />
      <Skills />
      <Projects />
      <Contact />
    </>
  );
}
