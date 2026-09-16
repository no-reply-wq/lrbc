"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, ChevronDown } from "lucide-react";

interface CountryOption {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

interface StateOption {
  name: string;
  code: string;
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
  "h-12 w-full appearance-none rounded-xl border border-input bg-background px-3 pr-9 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 disabled:opacity-60 cursor-pointer";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [phoneError, setPhoneError] = useState("");

  // ── Countries ─────────────────────────────────────────────────────────────
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);

  // ── States / Provinces ────────────────────────────────────────────────────
  const [states, setStates] = useState<StateOption[]>([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [selectedState, setSelectedState] = useState("");

  // ── Phone ─────────────────────────────────────────────────────────────────
  const [phoneNumber, setPhoneNumber] = useState("");
  const activePhoneRule = selectedCountry
    ? PHONE_RULES[selectedCountry.dialCode] || DEFAULT_PHONE_RULE
    : DEFAULT_PHONE_RULE;

  // ── Location ──────────────────────────────────────────────────────────────
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);

  // ── 1. Load ALL countries on mount ────────────────────────────────────────
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
            const suffix =
              c.idd.suffixes?.length === 1 ? c.idd.suffixes[0] : "";
            return {
              name: c.name.common,
              code: c.cca2,
              dialCode: `${c.idd.root}${suffix}`,
              flag: c.flag ?? "",
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(formatted);
        const india = formatted.find((c) => c.code === "IN") ?? formatted[0];
        setSelectedCountry(india);
      } catch {
        setCountries(FALLBACK_COUNTRIES);
        setSelectedCountry(FALLBACK_COUNTRIES[0]);
      } finally {
        setCountriesLoading(false);
      }
    };
    load();
  }, []);

  // ── 2. Load states whenever country changes ───────────────────────────────
  useEffect(() => {
    if (!selectedCountry) return;
    setSelectedState("");
    setStates([]);
    setCity("");
    setPincode("");
    setStatesLoading(true);

    const load = async () => {
      try {
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/states",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: selectedCountry.name }),
          }
        );
        const data = await res.json();
        if (!data.error && Array.isArray(data.data?.states)) {
          setStates(
            data.data.states.map((s: any) => ({
              name: s.name,
              code: s.state_code ?? s.name,
            }))
          );
        }
      } catch {
        // silent — user can type manually
      } finally {
        setStatesLoading(false);
      }
    };
    load();
  }, [selectedCountry]);

  // ── 3. Pincode autofill (India only) ─────────────────────────────────────
  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.replace(/\D/g, "");
    setPincode(code);
    if (code.length === 6 && selectedCountry?.code === "IN") {
      setIsPincodeLoading(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${code}`);
        const result = await res.json();
        if (result?.[0]?.Status === "Success" && result[0].PostOffice?.length > 0) {
          const po = result[0].PostOffice[0];
          setCity(po.District || po.Block || "");
          const match = states.find(
            (s) => s.name.toLowerCase() === (po.State || "").toLowerCase()
          );
          setSelectedState(match ? match.name : po.State || "");
        }
      } catch { /* silent */ }
      finally { setIsPincodeLoading(false); }
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneError("");
    setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = countries.find((c) => c.code === e.target.value);
    if (found) {
      setSelectedCountry(found);
      setPhoneNumber("");
      setPhoneError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (phoneNumber.length < activePhoneRule.min || phoneNumber.length > activePhoneRule.max) {
      setPhoneError("Please enter a valid phone number.");
      return;
    }
    setStatus("submitting");
    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "d7597fd4-4c3b-40d2-ad55-710160cd9abd");
    formData.set("country", selectedCountry?.name ?? "");
    formData.set("state", selectedState);
    formData.set("city", city);
    formData.set("fullContactNumber", `${selectedCountry?.dialCode ?? ""} ${phoneNumber}`);
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
      setStatus(res.ok ? "success" : "error");
    } catch { setStatus("error"); }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Card className="rounded-[28px] border-border/60 bg-background/80 p-8 shadow-xl backdrop-blur flex flex-col justify-center transition-shadow duration-500 ease-out hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.15)]">
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
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input id="companyName" name="companyName" placeholder="ACD .com" className="h-12 rounded-xl" required />
          </div>

          {/* Contact Person & Designation */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input id="contactPerson" name="contactPerson" placeholder="Laksh Gupta" className="h-12 rounded-xl" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation *</Label>
              <Input id="designation" name="designation" placeholder="Manager" className="h-12 rounded-xl" required />
            </div>
          </div>

          {/* Business Email */}
          <div className="space-y-2">
            <Label htmlFor="businessEmail">Business Email *</Label>
            <Input id="businessEmail" name="businessEmail" type="email" placeholder="Laksh@gmail.com" className="h-12 rounded-xl" required />
          </div>

          {/* Phone — fused dial-code + number row */}
          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number *</Label>
            <div className="flex h-12 w-full overflow-hidden rounded-xl border border-input bg-background shadow-sm focus-within:ring-2 focus-within:ring-purple-500/40 focus-within:border-purple-400 transition-all">
              {/* Dial-code selector */}
              <div className="relative flex shrink-0 items-center border-r border-input">
                <select
                  name="countryCode"
                  value={selectedCountry?.code ?? ""}
                  onChange={handleCountryChange}
                  disabled={countriesLoading}
                  className="h-full appearance-none bg-transparent pl-3 pr-7 text-sm font-medium focus:outline-none cursor-pointer"
                  style={{ minWidth: "105px" }}
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
              {/* Number field */}
              <input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                maxLength={activePhoneRule.max}
                placeholder={activePhoneRule.placeholder}
                className="h-full flex-1 bg-transparent px-3 text-sm focus:outline-none"
                required
              />
            </div>
            {phoneError && <p className="text-xs text-red-500">{phoneError}</p>}
          </div>

          {/* ── Location Details ──────────────────────────────────────────── */}
          <div className="space-y-4 rounded-2xl border border-border/50 bg-muted/20 p-4">
            <h3 className="text-sm font-semibold text-foreground/80">Location Details</h3>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="loc-country">Country</Label>
              <div className="relative">
                <select
                  id="loc-country"
                  name="country"
                  value={selectedCountry?.code ?? ""}
                  onChange={handleCountryChange}
                  disabled={countriesLoading}
                  className={SELECT_CLS}
                >
                  {countriesLoading ? (
                    <option>Loading countries…</option>
                  ) : (
                    countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag}  {c.name}
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                {countriesLoading && (
                  <Loader2 className="absolute right-8 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
            </div>

            {/* State / Province */}
            <div className="space-y-2">
              <Label htmlFor="loc-state">
                State / Province
                {statesLoading && (
                  <Loader2 className="ml-1.5 inline h-3 w-3 animate-spin text-muted-foreground" />
                )}
              </Label>
              {states.length > 0 ? (
                <div className="relative">
                  <select
                    id="loc-state"
                    name="state"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className={SELECT_CLS}
                  >
                    <option value="">Select state / province</option>
                    {states.map((s) => (
                      <option key={s.code} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              ) : (
                <Input
                  id="loc-state"
                  name="state"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  placeholder={statesLoading ? "Loading states…" : "Enter state / province"}
                  disabled={statesLoading}
                  className="h-12 rounded-xl"
                />
              )}
            </div>

            {/* City & Pincode */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="loc-city">City</Label>
                <Input
                  id="loc-city"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Hyderabad"
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="loc-pincode">Pincode / ZIP</Label>
                  {isPincodeLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
                </div>
                <Input
                  id="loc-pincode"
                  name="pincode"
                  maxLength={10}
                  value={pincode}
                  onChange={handlePincodeChange}
                  placeholder="500084"
                  className="h-12 rounded-xl"
                />
              </div>
            </div>

            {/* Street Address */}
            <div className="space-y-2">
              <Label htmlFor="loc-street">Street Address</Label>
              <Input
                id="loc-street"
                name="streetAddress"
                placeholder="7th Floor, Pranava Business Park…"
                className="h-12 rounded-xl"
              />
            </div>
          </div>

          {/* Employee Size & Annual Turnover */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="employeeSize">Employee Size</Label>
              <div className="relative">
                <select id="employeeSize" name="employeeSize" className={SELECT_CLS}>
                  <option value="">Select range</option>
                  <option>1–10</option>
                  <option>11–50</option>
                  <option>51–200</option>
                  <option>201–500</option>
                  <option>501–1000</option>
                  <option>1000+</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="annualTurnover">Annual Turnover</Label>
              <div className="relative">
                <select id="annualTurnover" name="annualTurnover" className={SELECT_CLS}>
                  <option value="">Select range</option>
                  <option>Up to ₹20 Lakhs</option>
                  <option>₹20 Lakhs – ₹1 Crore</option>
                  <option>₹1 Crore – ₹5 Crores</option>
                  <option>₹5 Crores – ₹25 Crores</option>
                  <option>₹25 Crores – ₹100 Crores</option>
                  <option>₹100 Crores – ₹500 Crores</option>
                  <option>Above ₹500 Crores</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Business Goals */}
          <div className="space-y-2">
            <Label htmlFor="goals">Business Goals / What do you want to achieve? *</Label>
            <Input id="goals" name="goals" placeholder="Streamline our operations…" className="h-12 rounded-xl" required />
          </div>

          {status === "error" && (
            <p className="text-red-600 font-medium text-center text-sm">
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
            ) : "Schedule a Consultation"}
          </button>
        </form>
      )}
    </Card>
  );
}
