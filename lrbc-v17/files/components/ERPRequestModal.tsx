"use client";

import ContactFormModal from "@/components/ContactFormModal";

interface ERPRequestModalProps {
  buttonText?: string;
  className?: string;
  showArrow?: boolean;
}

/**
 * "Book a Demo" button. It opens the same enquiry form used everywhere else on the site
 * (Company Name, Contact Name, Email, Contact No., City, Industry — all mandatory),
 * so every entry point collects the same lead details.
 */
export function ERPRequestModal({ buttonText = "Book a Demo", className, showArrow = false }: ERPRequestModalProps) {
  return <ContactFormModal buttonText={buttonText} className={className} showArrow={showArrow} source="Book a Demo" />;
}
