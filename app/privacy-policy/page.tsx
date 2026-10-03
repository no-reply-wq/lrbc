import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { PRIVACY_SECTIONS } from "@/components/legal/privacy-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  const sections = PRIVACY_SECTIONS.map((s, i) => (i === 0 ? { ...s, id: "intro", title: null } : s));
  return (
    <LegalPage
      kind="privacy"
      title="Privacy Policy"
      intro="How we collect, use and protect your personal information."
      sections={sections}
      other={{ label: "Read Terms of Use", href: "/terms-of-use" }}
    />
  );
}
