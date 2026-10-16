"use client";

import Link from "next/link";

interface ERPRequestModalProps {
  buttonText?: string;
  className?: string;
  showArrow?: boolean;
}

/** "Book a Demo" button — takes the visitor to the Book a Demo page (/demo). */
export function ERPRequestModal({ buttonText = "Book a Demo", className, showArrow = false }: ERPRequestModalProps) {
  return (
    <Link href="/demo" className={className || "lrbc-btn lrbc-btn-primary"}>
      {buttonText}
      {showArrow && (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      )}
    </Link>
  );
}
