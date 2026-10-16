"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Download, Mail, X, CheckCircle2, Loader2, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";

const WEB3FORMS_KEY = "d7597fd4-4c3b-40d2-ad55-710160cd9abd";
const FILE_URL = "/downloads/LRBC-Brochure.pdf";
const FILE_NAME = "LRBC-Brochure.pdf";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Same key the case-study page uses, so one verification unlocks both. */
const VERIFIED_KEY = "lrbc-cs-verified";

type Verified = { email: string; token: string };

function readVerified(): Verified | null {
  try {
    const v = JSON.parse(localStorage.getItem(VERIFIED_KEY) || "null");
    if (!v?.email || !v?.token) return null;
    const payload = JSON.parse(atob(String(v.token).split(".")[0].replace(/-/g, "+").replace(/_/g, "/")));
    return payload?.x && Date.now() < payload.x ? { email: v.email, token: v.token } : null;
  } catch { return null; }
}

/** "Download Brochure" → verify your email with a 6-digit code (OTP) → download starts. */
export default function BrochureDownload({ source = "Home hero" }: { source?: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"email" | "otp" | "done">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [challenge, setChallenge] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => { window.removeEventListener("keydown", onKey); clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step]);
  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const reset = () => { setStep("email"); setError(""); setInfo(""); setEmail(""); setCode(""); setChallenge(""); setBusy(false); setWait(0); };
  const close = () => { setOpen(false); setTimeout(reset, 200); };

  const startDownload = () => {
    const a = document.createElement("a");
    a.href = FILE_URL; a.download = FILE_NAME; a.rel = "noopener";
    document.body.appendChild(a); a.click(); a.remove();
  };

  /** Already verified on this device (within 30 days) → no code needed again. */
  const onButton = () => {
    const v = readVerified();
    if (v) { setEmail(v.email); setStep("done"); setOpen(true); startDownload(); return; }
    setOpen(true);
  };

  const sendCode = async () => {
    const value = email.trim();
    if (!value) { setError("Please enter your email to download the brochure."); inputRef.current?.focus(); return; }
    if (!EMAIL_RE.test(value)) { setError("Please enter a valid email address."); inputRef.current?.focus(); return; }
    setError(""); setInfo(""); setBusy(true);
    try {
      const res = await fetch("/api/case-study/otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, purpose: "brochure" }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(d.error === "slow_down" ? "Please wait a few seconds before requesting another code."
          : d.error === "invalid_email" ? "Please enter a valid email address."
          : "We couldn't send the code right now. Please try again in a moment.");
        setBusy(false); return;
      }
      setChallenge(d.challenge); setCode(""); setStep("otp"); setWait(30);
      setInfo(d.devCode ? `Dev mode — your code is ${d.devCode}` : `We've sent a 6-digit code to ${value}.`);
    } catch { setError("Something went wrong. Please try again."); }
    setBusy(false);
  };

  const verify = async () => {
    if (code.length !== 6) { setError("Enter the 6-digit code."); return; }
    setError(""); setBusy(true);
    try {
      const res = await fetch("/api/case-study/verify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code, challenge }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(d.error === "expired" ? "This code has expired. Please request a new one."
          : d.error === "too_many" ? "Too many attempts. Please request a new code."
          : "That code isn't right. Please check and try again.");
        setBusy(false); return;
      }
      try { localStorage.setItem(VERIFIED_KEY, JSON.stringify({ email: d.email, token: d.token })); } catch { /* ignore */ }
      // lead for the team — only verified emails reach us (never blocks the download)
      const fd = new FormData();
      fd.append("access_key", WEB3FORMS_KEY);
      fd.append("subject", `Brochure download (verified) — ${source}`);
      fd.append("source", `${source} — email verified with OTP`);
      fd.append("email", d.email);
      fetch("https://api.web3forms.com/submit", { method: "POST", body: fd }).catch(() => {});
      setStep("done"); setBusy(false);
      startDownload();
    } catch { setError("Something went wrong. Please try again."); setBusy(false); }
  };

  const modal = open ? (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Download brochure">
      <div className="absolute inset-0 -z-10" onClick={close} />
      <div className="relative max-h-[92dvh] w-full max-w-md animate-in fade-in zoom-in-95 overflow-y-auto rounded-3xl border border-border/60 bg-background p-6 shadow-2xl duration-200 sm:p-8">
        <button onClick={close} aria-label="Close" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-muted/60 transition-colors hover:bg-muted">
          <X className="h-4 w-4" />
        </button>

        {step === "done" ? (
          <div className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><CheckCircle2 className="h-7 w-7" /></span>
            <h3 className="mt-5 text-xl font-semibold text-foreground">Thank you!</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Your brochure is downloading now. If nothing happens, use the button below.</p>
            <div className="mt-6 flex flex-col gap-3">
              <a href={FILE_URL} download={FILE_NAME} className="lrbc-btn lrbc-btn-primary"><Download className="h-4 w-4" /> Download again</a>
              <button onClick={close} className="lrbc-btn lrbc-btn-secondary">Close</button>
            </div>
          </div>
        ) : step === "email" ? (
          <form onSubmit={(e) => { e.preventDefault(); sendCode(); }} noValidate>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5227FF] to-[#a855f7] text-white shadow-lg shadow-primary/30"><Lock className="h-5 w-5" /></span>
            <h3 className="mt-5 text-xl font-semibold text-foreground">Download our brochure</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Verify your email with a 6-digit code and your download will start right away.</p>

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

            <button type="submit" disabled={busy} className="lrbc-btn lrbc-btn-primary mt-6 w-full disabled:opacity-70">
              {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending code…</> : "Send verification code"}
            </button>
          </form>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); verify(); }} noValidate>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5227FF] to-[#a855f7] text-white shadow-lg shadow-primary/30"><Lock className="h-5 w-5" /></span>
            <h3 className="mt-5 text-xl font-semibold text-foreground">Enter your code</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{info}</p>
            <label htmlFor="brochure-otp" className="mt-6 block text-sm font-medium text-foreground">Verification code</label>
            <input
              id="brochure-otp" ref={inputRef} inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code}
              onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
              className={`mt-2 h-12 w-full rounded-xl border bg-background px-3 text-center font-mono text-2xl tracking-[0.5em] outline-none focus-visible:ring-2 focus-visible:ring-ring ${error ? "border-red-500" : "border-input"}`}
            />
            {error && <p role="alert" className="mt-1.5 text-xs text-red-500">{error}</p>}
            <button type="submit" disabled={busy || code.length !== 6} className="lrbc-btn lrbc-btn-primary mt-6 w-full disabled:opacity-60">
              {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</> : <><Download className="h-4 w-4" /> Verify & download</>}
            </button>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <button type="button" onClick={() => { setStep("email"); setError(""); }} className="underline-offset-2 hover:text-primary hover:underline">Change email</button>
              <button type="button" disabled={wait > 0 || busy} onClick={sendCode} className="underline-offset-2 hover:text-primary hover:underline disabled:no-underline disabled:opacity-60">
                {wait > 0 ? `Resend code in ${wait}s` : "Resend code"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  ) : null;

  return (
    <>
      <button type="button" className="lrbc-btn lrbc-btn-secondary" onClick={onButton}>
        Download Brochure
      </button>
      {mounted && createPortal(modal, document.body)}
    </>
  );
}
