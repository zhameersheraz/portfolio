import { About } from "@/components/about";
export const metadata = {
  title: "About — Zhameer Sheraz U. Tampugao",
  description: "A longer version of who I am, what I'm learning, and what I'm working on.",
};
export default function AboutPage() {
  return (
    <main className="pt-24 pb-12">
      <About />
    </main>
  );
}
