import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { TERMS_SECTIONS } from "@/components/legal/terms-content";

export const metadata: Metadata = {
  title: "Terms of Use",
  alternates: { canonical: "/terms-of-use" },
};

export default function TermsOfUsePage() {
  const sections = TERMS_SECTIONS.filter((s) => s.title && s.html.trim());
  return (
    <LegalPage
      kind="terms"
      title="Terms of Use"
      intro="The terms that apply when you use the LRBC website and services."
      sections={sections}
      other={{ label: "Read Privacy Policy", href: "/privacy-policy" }}
    />
  );
}
