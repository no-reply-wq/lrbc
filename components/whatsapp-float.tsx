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
      className="whatsapp-float-btn fixed bottom-5 right-5 z-[60] sm:bottom-6 sm:right-6"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping [animation-duration:2.2s]" />
      <span className="whatsapp-glow absolute inset-0 rounded-full" />

      {/* Official WhatsApp SVG logo */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="relative z-10 h-8 w-8"
        aria-hidden="true"
      >
        <path fill="#fff" d="M4.868 43.303l2.694-9.835a18.957 18.957 0 01-2.54-9.538C5.026 13.528 13.553 5 24.014 5c5.079.002 9.845 1.979 13.43 5.566a18.952 18.952 0 015.556 13.428c-.004 10.465-8.531 18.993-18.986 18.993a19.01 19.01 0 01-9.073-2.302z"/>
        <path fill="#25D366" d="M24.014 5C13.553 5 5.026 13.528 5.022 23.93a18.957 18.957 0 002.54 9.538L4.868 43.303l10.146-2.662a18.985 18.985 0 009.001 2.285h.008c10.461 0 18.988-8.528 18.992-18.993A18.952 18.952 0 0037.444 10.566 18.944 18.944 0 0024.014 5z"/>
        <path fill="#fff" fillRule="evenodd" d="M19.268 16.045c-.355-.79-.729-.806-1.068-.82-.277-.012-.594-.011-.911-.011s-.83.124-1.265.619c-.435.495-1.661 1.622-1.661 3.956 0 2.334 1.7 4.59 1.937 4.907.237.316 3.282 5.209 8.104 7.095 4.007 1.58 4.823 1.266 5.693 1.187.87-.079 2.807-1.147 3.202-2.255.395-1.108.395-2.057.277-2.255-.119-.198-.435-.316-.911-.554s-2.807-1.385-3.242-1.543c-.435-.158-.75-.237-1.068.238-.316.474-1.225 1.543-1.502 1.859-.277.317-.554.357-1.03.119-.476-.237-2.01-.741-3.83-2.364-1.416-1.263-2.372-2.824-2.649-3.298-.277-.475-.03-.731.208-.968.213-.213.476-.554.714-.831.237-.277.316-.475.475-.791.158-.317.079-.594-.04-.831-.117-.238-1.043-2.584-1.464-3.505z" clipRule="evenodd"/>
      </svg>
    </Link>
  );
}