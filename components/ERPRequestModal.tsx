"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, X } from "lucide-react";

interface ERPRequestModalProps {
  buttonText?: string;
  className?: string;
}

export function ERPRequestModal({
  buttonText = "Book a Demo",
  className,
}: ERPRequestModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [mounted, setMounted] = useState(false);

  // Portal needs the DOM to be ready
  useEffect(() => {
    setMounted(true);
  }, []);

  const open = () => setIsOpen(true);

  const close = () => {
    setIsOpen(false);
    setStatus("idle");
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "d7597fd4-4c3b-40d2-ad55-710160cd9abd");
    formData.append("subject", "New ERP Development Request for Business");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  const modal = isOpen ? (
    // Overlay is the scrollable layer — no body lock needed
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop — click to close */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={close}
      />

      {/* Scrollable centering wrapper */}
      <div className="flex min-h-full items-center justify-center p-4">
        <Card className="relative z-10 w-full max-w-md rounded-[24px] border-border/60 bg-background p-7 shadow-2xl">
          {/* Close button */}
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {status === "success" ? (
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Request Sent!</h3>
              <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                Thank you! We received your demo request and will get back to you shortly.
              </p>
              <button
                type="button"
                onClick={close}
                className="mt-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground font-medium"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1 pr-6">
                <h3 className="text-xl font-bold tracking-tight">Book a Demo</h3>
                <p className="text-muted-foreground text-sm">
                  Fill in your details and we'll get back to you to schedule a demo.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo-name">Your Name *</Label>
                <Input id="demo-name" name="name" placeholder="Laksh Gupta" className="h-12 rounded-xl" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo-company">Company Name *</Label>
                <Input id="demo-company" name="company" placeholder="ACD .com" className="h-12 rounded-xl" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo-email">Business Email *</Label>
                <Input id="demo-email" name="email" type="email" placeholder="Laksh@gmail.com" className="h-12 rounded-xl" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo-phone">Phone Number</Label>
                <Input id="demo-phone" name="phone" type="tel" placeholder="+91 98765 43210" className="h-12 rounded-xl" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo-message">What are you looking for?</Label>
                <textarea
                  id="demo-message"
                  name="message"
                  rows={3}
                  defaultValue="I'd like to see a demo of the ERP solution."
                  className="flex w-full rounded-xl border border-input bg-background px-3 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 resize-none"
                />
              </div>

              {status === "error" && (
                <p className="text-red-600 text-sm text-center font-medium">
                  Something went wrong. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {status === "submitting" ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                ) : "Request Demo"}
              </button>
            </form>
          )}
        </Card>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={open}
        className={
          className ||
          "inline-flex items-center gap-2 h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-all duration-300 hover:opacity-90"
        }
      >
        {buttonText}
      </button>

      {/* Mount modal at document.body so it escapes all stacking contexts */}
      {mounted && createPortal(modal, document.body)}
    </>
  );
}
