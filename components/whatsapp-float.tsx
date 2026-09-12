"use client";

import Link from "next/link";

const WHATSAPP_URL = "https://wa.me/919954953008";

export default function WhatsAppFloat() {
  return (
    <Link
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="
        fixed bottom-5 right-5 z-[60] sm:bottom-6 sm:right-6
        flex h-14 w-14 items-center justify-center rounded-full
        bg-[#25D366] text-white shadow-lg shadow-black/25
        transition-transform duration-300 ease-out
        hover:scale-110 active:scale-95
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2
      "
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping [animation-duration:2.2s]" />
      {/* Official WhatsApp logo SVG */}
      <svg className="relative h-8 w-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4C12.954 4 4 12.954 4 24c0 3.566.944 6.91 2.594 9.8L4 44l10.476-2.548A19.9 19.9 0 0 0 24 44c11.046 0 20-8.954 20-20S35.046 4 24 4z" fill="white"/>
        <path d="M24 7.2c-9.27 0-16.8 7.53-16.8 16.8 0 3.17.88 6.13 2.41 8.66L8 40l7.57-1.98a16.74 16.74 0 0 0 8.43 2.28c9.27 0 16.8-7.53 16.8-16.8 0-9.27-7.53-16.8-16.8-16.8z" fill="#25D366"/>
        <path d="M18.4 15.2c-.4-.9-1.1-.8-1.5-.8-.38 0-.82-.04-1.26-.04-.44 0-1.15.16-1.75.82-.6.66-2.3 2.24-2.3 5.46 0 3.22 2.35 6.34 2.68 6.78.33.44 4.54 7.2 11.18 9.8 5.56 2.16 6.7 1.74 7.9 1.63 1.2-.11 3.87-1.57 4.41-3.1.54-1.53.54-2.84.38-3.1-.16-.27-.6-.44-1.26-.77-.66-.33-3.87-1.9-4.47-2.12-.6-.22-1.04-.33-1.48.33-.44.66-1.7 2.12-2.08 2.56-.38.44-.77.5-1.43.16-.66-.33-2.78-1.02-5.3-3.26-1.96-1.74-3.28-3.89-3.67-4.55-.38-.66-.04-1.02.29-1.35.3-.3.66-.77 1-.11.33.66 1.26 1.6 1.26 1.6.33.44.66.5 1 .33z" fill="white"/>
      </svg>
    </Link>
  );
}
