"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Download, Mail, X, CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const WEB3FORMS_KEY = "d7597fd4-4c3b-40d2-ad55-710160cd9abd";
const FILE_URL = "/downloads/LRBC-Brochure.pdf";
const FILE_NAME = "LRBC-Brochure.pdf";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** "Download Brochure" button → asks for an email → only then starts the download. */
export default function BrochureDownload({ source = "Home hero" }: { source?: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => { window.removeEventListener("keydown", onKey); clearTimeout(t); };
  }, [open]);

  const close = () => { setOpen(false); setTimeout(() => { setStatus("idle"); setError(""); setEmail(""); }, 200); };

  const startDownload = () => {
    const a = document.createElement("a");
    a.href = FILE_URL; a.download = FILE_NAME; a.rel = "noopener";
    document.body.appendChild(a); a.click(); a.remove();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) { setError("Please enter your email to download the brochure."); inputRef.current?.focus(); return; }
    if (!EMAIL_RE.test(value)) { setError("Please enter a valid email address."); inputRef.current?.focus(); return; }
    setError(""); setStatus("sending");

    // send the lead to the team (never blocks the download if the network is slow)
    const fd = new FormData();
    fd.append("access_key", WEB3FORMS_KEY);
    fd.append("subject", `Brochure download — ${source}`);
    fd.append("source", source);
    fd.append("email", value);
    try {
      const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 6000);
      await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd, signal: ctrl.signal }).catch(() => {});
      clearTimeout(t);
    } catch { /* ignore */ }

    setStatus("done");
    startDownload();
  };

  const modal = open ? (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Download brochure">
      <div className="absolute inset-0 -z-10" onClick={close} />
      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-200 rounded-3xl border border-border/60 bg-background p-6 shadow-2xl sm:p-8">
        <button onClick={close} aria-label="Close" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-muted/60 transition-colors hover:bg-muted">
          <X className="h-4 w-4" />
        </button>

        {status === "done" ? (
          <div className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><CheckCircle2 className="h-7 w-7" /></span>
            <h3 className="mt-5 text-xl font-semibold text-foreground">Thank you!</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Your brochure is downloading now. If nothing happens, use the button below.</p>
            <div className="mt-6 flex flex-col gap-3">
              <a href={FILE_URL} download={FILE_NAME} className="lrbc-btn lrbc-btn-primary"><Download className="h-4 w-4" /> Download again</a>
              <button onClick={close} className="lrbc-btn lrbc-btn-secondary">Close</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5227FF] to-[#a855f7] text-white shadow-lg shadow-primary/30"><Download className="h-6 w-6" /></span>
            <h3 className="mt-5 text-xl font-semibold text-foreground">Download our brochure</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Enter your email and your download will start right away.</p>

            <label htmlFor="brochure-email" className="mt-6 block text-sm font-medium text-foreground">Email address</label>
            <div className="relative mt-2">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="brochure-email" ref={inputRef} type="email" inputMode="email" autoComplete="email" placeholder="you@company.com"
                value={email} onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                aria-invalid={!!error}
                className={`h-12 rounded-xl pl-10 ${error ? "border-red-500 focus-visible:ring-red-500/30" : ""}`}
              />
            </div>
            {error && <p role="alert" className="mt-1.5 text-xs text-red-500">{error}</p>}

            <button type="submit" disabled={status === "sending"} className="lrbc-btn lrbc-btn-primary mt-6 w-full disabled:opacity-70">
              {status === "sending" ? <><Loader2 className="h-4 w-4 animate-spin" /> Please wait…</> : <><Download className="h-4 w-4" /> Download Brochure</>}
            </button>
          </form>
        )}
      </div>
    </div>
  ) : null;

  return (
    <>
      <button type="button" className="lrbc-btn lrbc-btn-secondary" onClick={() => setOpen(true)}>
        Download Brochure
      </button>
      {mounted && createPortal(modal, document.body)}
    </>
  );
}
