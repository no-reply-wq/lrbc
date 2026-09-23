"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { createPortal } from "react-dom";

interface ContactFormModalProps {
  buttonText?: string;
  className?: string;
  showArrow?: boolean;
}

export default function ContactFormModal({
  buttonText = "Contact Our Team",
  className,
  showArrow = false,
}: ContactFormModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const open  = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const modal = isOpen ? (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div
        className="absolute inset-0 -z-10"
        onClick={close}
      />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <button
          onClick={close}
          className="absolute right-4 top-4 sm:right-6 sm:top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-background/50 hover:bg-background transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="p-1">
          <ContactForm />
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={open}
        className={
          className ||
          "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90"
        }
      >
        {buttonText}
        {showArrow && (
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        )}
      </button>
      {mounted && createPortal(modal, document.body)}
    </>
  );
}
