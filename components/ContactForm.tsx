"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, ChevronDown, Building2, User, Mail, MapPin, Factory } from "lucide-react";

interface CountryOption {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

const DEFAULT_PHONE_RULE = { placeholder: "12345 67890", min: 7, max: 15 };
const PHONE_RULES: Record<string, { placeholder: string; min: number; max: number }> = {
  "+91": { placeholder: "98765 43210", min: 10, max: 10 },
  "+1":  { placeholder: "(555) 000-0000", min: 10, max: 10 },
  "+44": { placeholder: "7911 123456", min: 10, max: 10 },
  "+61": { placeholder: "412 345 678", min: 9, max: 9 },
  "+971":{ placeholder: "50 123 4567", min: 9, max: 9 },
  "+49": { placeholder: "1512 3456789", min: 10, max: 11 },
  "+33": { placeholder: "6 12 34 56 78", min: 9, max: 9 },
  "+81": { placeholder: "90 1234 5678", min: 10, max: 10 },
  "+65": { placeholder: "8123 4567", min: 8, max: 8 },
  "+60": { placeholder: "12-345 6789", min: 9, max: 10 },
  "+86": { placeholder: "138 0013 8000", min: 11, max: 11 },
  "+55": { placeholder: "11 91234-5678", min: 10, max: 11 },
  "+27": { placeholder: "71 123 4567", min: 9, max: 9 },
  "+82": { placeholder: "10-1234-5678", min: 9, max: 10 },
  "+62": { placeholder: "812-3456-7890", min: 9, max: 12 },
  "+52": { placeholder: "55 1234 5678", min: 10, max: 10 },
  "+34": { placeholder: "612 34 56 78", min: 9, max: 9 },
  "+39": { placeholder: "312 345 6789", min: 9, max: 10 },
  "+31": { placeholder: "6 12345678", min: 9, max: 9 },
};

// Minimal fallback in case API is unreachable
const FALLBACK_COUNTRIES: CountryOption[] = [
  { name: "India", code: "IN", dialCode: "+91", flag: "🇮🇳" },
  { name: "United States", code: "US", dialCode: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", dialCode: "+44", flag: "🇬🇧" },
  { name: "Australia", code: "AU", dialCode: "+61", flag: "🇦🇺" },
  { name: "UAE", code: "AE", dialCode: "+971", flag: "🇦🇪" },
  { name: "Germany", code: "DE", dialCode: "+49", flag: "🇩🇪" },
  { name: "France", code: "FR", dialCode: "+33", flag: "🇫🇷" },
  { name: "Japan", code: "JP", dialCode: "+81", flag: "🇯🇵" },
  { name: "Singapore", code: "SG", dialCode: "+65", flag: "🇸🇬" },
  { name: "Canada", code: "CA", dialCode: "+1", flag: "🇨🇦" },
];

// Shared select className
const SELECT_CLS =
  "h-12 w-full appearance-none rounded-xl border border-input bg-background px-3 pr-9 text-base sm:text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 disabled:opacity-60 cursor-pointer";

const CITIES = [
  "Hyderabad", "Bengaluru", "Mumbai", "Delhi NCR", "Chennai", "Pune", "Kolkata", "Ahmedabad",
  "Surat", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Bhopal", "Visakhapatnam",
  "Vijayawada", "Coimbatore", "Kochi", "Thiruvananthapuram", "Chandigarh", "Ludhiana", "Guwahati",
  "Patna", "Ranchi", "Bhubaneswar", "Raipur", "Vadodara", "Rajkot", "Nashik", "Mysuru", "Mangaluru",
];
const OTHER_CITY = "Other";

type Errors = Partial<Record<"companyName" | "contactPerson" | "businessEmail" | "contactNumber" | "city" | "industry", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [cityChoice, setCityChoice] = useState("");

  // ── Countries (dial code list for the phone field) ─────────────────────────
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);

  // ── Phone ─────────────────────────────────────────────────────────────────
  const [phoneNumber, setPhoneNumber] = useState("");
  const activePhoneRule = selectedCountry
    ? PHONE_RULES[selectedCountry.dialCode] || DEFAULT_PHONE_RULE
    : DEFAULT_PHONE_RULE;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,idd,cca2,flag",
          { next: { revalidate: 86400 } } as RequestInit
        );
        if (!res.ok) throw new Error("fetch failed");
        const data: any[] = await res.json();
        const formatted: CountryOption[] = data
          .filter((c) => c.idd?.root)
          .map((c) => {
            const suffix = c.idd.suffixes?.length === 1 ? c.idd.suffixes[0] : "";
            return {
              name: c.name.common,
              code: c.cca2,
              dialCode: `${c.idd.root}${suffix}`,
              flag: c.flag ?? "",
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(formatted);
        setSelectedCountry(formatted.find((c) => c.code === "IN") ?? formatted[0]);
      } catch {
        setCountries(FALLBACK_COUNTRIES);
        setSelectedCountry(FALLBACK_COUNTRIES[0]);
      } finally {
        setCountriesLoading(false);
      }
    };
    load();
  }, []);

  const clearError = (k: keyof Errors) =>
    setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError("contactNumber");
    setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = countries.find((c) => c.code === e.target.value);
    if (found) {
      setSelectedCountry(found);
      setPhoneNumber("");
      clearError("contactNumber");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const val = (k: string) => String(fd.get(k) ?? "").trim();

    // All six fields are mandatory
    const next: Errors = {};
    if (!val("companyName")) next.companyName = "Please enter your company name.";
    if (!val("contactPerson")) next.contactPerson = "Please enter the contact person's name.";
    if (!val("businessEmail")) next.businessEmail = "Please enter your email address.";
    else if (!EMAIL_RE.test(val("businessEmail"))) next.businessEmail = "Please enter a valid email address.";
    if (!phoneNumber) next.contactNumber = "Please enter your contact number.";
    else if (phoneNumber.length < activePhoneRule.min || phoneNumber.length > activePhoneRule.max)
      next.contactNumber = "Please enter a valid contact number.";
    const cityValue = cityChoice === OTHER_CITY ? val("cityOther") : cityChoice;
    if (!cityChoice) next.city = "Please select your city.";
    else if (!cityValue) next.city = "Please type your city name.";
    if (!val("industry")) next.industry = "Please enter your industry.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = Object.keys(next)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    const formData = new FormData();
    formData.append("access_key", "d7597fd4-4c3b-40d2-ad55-710160cd9abd");
    formData.set("companyName", val("companyName"));
    formData.set("contactPerson", val("contactPerson"));
    formData.set("businessEmail", val("businessEmail"));
    formData.set("fullContactNumber", `${selectedCountry?.dialCode ?? ""} ${phoneNumber}`);
    formData.set("city", cityValue);
    formData.set("industry", val("industry"));
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
      setStatus(res.ok ? "success" : "error");
    } catch { setStatus("error"); }
  };

  const fieldCls = (k: keyof Errors) =>
    `h-12 rounded-xl pl-10 ${errors[k] ? "border-red-500 focus-visible:ring-red-500/30" : ""}`;
  const ErrorMsg = ({ k }: { k: keyof Errors }) =>
    errors[k] ? <p role="alert" className="text-xs text-red-500">{errors[k]}</p> : null;

  return (
    <Card className="rounded-[20px] sm:rounded-[28px] border-border/60 bg-background/80 p-4 sm:p-6 md:p-8 shadow-xl backdrop-blur flex flex-col justify-center transition-shadow duration-500 ease-out hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.15)]">
      {status === "success" ? (
        <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight">Request Sent!</h3>
          <p className="text-muted-foreground text-lg max-w-sm">
            Thank you for reaching out. Our team will get back to you shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="companyName" name="companyName" autoComplete="organization" placeholder="e.g. ACD Pvt. Ltd." className={fieldCls("companyName")} onChange={() => clearError("companyName")} required />
            </div>
            <ErrorMsg k="companyName" />
          </div>

          {/* Contact Name */}
          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Name *</Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="contactPerson" name="contactPerson" autoComplete="name" placeholder="e.g. Laksh Gupta" className={fieldCls("contactPerson")} onChange={() => clearError("contactPerson")} required />
            </div>
            <ErrorMsg k="contactPerson" />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="businessEmail">Email *</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="businessEmail" name="businessEmail" type="email" autoComplete="email" placeholder="e.g. laksh@company.com" className={fieldCls("businessEmail")} onChange={() => clearError("businessEmail")} required />
            </div>
            <ErrorMsg k="businessEmail" />
          </div>

          {/* Contact No. — dial-code + number */}
          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact No. *</Label>
            <div className={`flex h-12 w-full overflow-hidden rounded-xl border bg-background shadow-sm focus-within:ring-2 focus-within:ring-purple-500/40 focus-within:border-purple-400 transition-all ${errors.contactNumber ? "border-red-500" : "border-input"}`}>
              <div className="relative flex shrink-0 items-center border-r border-input">
                <select
                  name="countryCode"
                  aria-label="Country dial code"
                  value={selectedCountry?.code ?? ""}
                  onChange={handleCountryChange}
                  disabled={countriesLoading}
                  className="h-full w-[96px] appearance-none bg-transparent pl-3 pr-7 text-base font-medium focus:outline-none cursor-pointer sm:w-[105px] sm:text-sm"
                >
                  {countriesLoading ? (
                    <option>Loading…</option>
                  ) : (
                    countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.dialCode}
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="pointer-events-none absolute right-1.5 h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={phoneNumber}
                onChange={handlePhoneChange}
                maxLength={activePhoneRule.max}
                placeholder={`e.g. ${activePhoneRule.placeholder}`}
                className="h-full min-w-0 flex-1 bg-transparent px-3 text-base focus:outline-none sm:text-sm"
                required
              />
            </div>
            <ErrorMsg k="contactNumber" />
          </div>

          {/* City — dropdown */}
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                id="city"
                name="city"
                value={cityChoice}
                onChange={(e) => { setCityChoice(e.target.value); clearError("city"); }}
                className={`${SELECT_CLS} pl-10 ${errors.city ? "border-red-500" : ""} ${cityChoice ? "" : "text-muted-foreground"}`}
                required
              >
                <option value="" disabled>Select your city</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value={OTHER_CITY}>Other (type your city)</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            {cityChoice === OTHER_CITY && (
              <Input name="cityOther" placeholder="e.g. Nellore" className="h-12 rounded-xl" onChange={() => clearError("city")} />
            )}
            <ErrorMsg k="city" />
          </div>

          {/* Industry — free text */}
          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <div className="relative">
              <Factory className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="industry" name="industry" placeholder="e.g. Manufacturing, Retail, Healthcare" className={fieldCls("industry")} onChange={() => clearError("industry")} required />
            </div>
            <ErrorMsg k="industry" />
          </div>

          {status === "error" && (
            <p className="text-red-600 font-medium text-center text-sm">
              Something went wrong. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="lrbc-btn w-full h-12 sm:h-14 rounded-xl bg-primary text-primary-foreground font-semibold transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {status === "submitting" ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
            ) : "Schedule a Consultation"}
          </button>
        </form>
      )}
    </Card>
  );
}
