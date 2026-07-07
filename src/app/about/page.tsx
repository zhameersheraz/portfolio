import type { Metadata } from "next";
import { About } from "@/components/about";
import { Skills } from "@/components/skills";

export const metadata: Metadata = {
  title: "About",
  description: "A bit more about me, my background, and what I am working on.",
};

export default function AboutPage() {
  return (
    <div className="pt-14">
      <About />
      <Skills />
    </div>
  );
}