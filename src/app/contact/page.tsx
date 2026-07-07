import type { Metadata } from "next";
import { Contact } from "@/components/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send me a message. For collab, CTF questions, or just to say hi.",
};

export default function ContactPage() {
  return (
    <div className="pt-14">
      <Contact />
    </div>
  );
}