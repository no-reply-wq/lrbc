"use client";
import { useFadeUp } from '@/components/ui/use-scroll-animation';

// =============================================================================
// CASE STUDIES PAGE — FULLY DYNAMIC
// To add/edit/remove a case study, edit the CASE_STUDIES array below.
// Each entry has:
//   client    — company name shown as heading
//   industry  — shown as a badge
//   date      — project date e.g. "March 2025" shown as a small badge
//   featured  — true/false (shows "Featured" badge)
//   problem   — the business problem paragraph(s)
//   solution  — how LRBC solved it
//   result    — the outcome
//   metrics   — array of { value, label } shown as top-right stat chips (max 3)
//   images    — array of local paths like "/images/casestudy/navtech-case1-1.jpeg"
//               or Unsplash URLs — add as many as you want, carousel handles them
//
// To add a new case study, copy one entry, paste it below, change the values.
// The layout (alternating image position, blur effect, load-more) is automatic.
// =============================================================================

import { useState, useMemo } from "react";
import { HeroHeader } from "@/components/header";
import FooterSection from "@/components/footer-section";
import NewHeroSection from "@/components/new-components/new-hero";
import { TrendingUp, ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Calendar, Star, Quote } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// =============================================================================
// ✏️  EDIT YOUR CASE STUDIES HERE
// =============================================================================
const CASE_STUDIES = [
  {
    id: "navtech1",
    client: "Navtech Industries — Case I",
    industry: "SS Kitchenware",
    date: "August 2026",
    featured: true,
    problem:
      "The store was issuing raw materials and packaging materials to the factory floor based on whoever asked verbally. There was no record of what was given, to whom, for which order, or how much was left. If materials ran short mid-production, nobody knew whether the stock had run out or whether it had been taken for a different order. A worker could walk up to the store, ask for materials, and walk away with them — no paperwork, no record, no link to any specific order. The store manager had no way to prioritise: every request felt equally urgent.",
    solution:
      "Every material request is now a formal record — before anything leaves the store, a request must be raised in the system linked to a specific order and production run. The store manager reviews each request, confirms the quantity to issue, and logs it digitally; the system records what was given, for which order, and when, automatically updating inventory balances. Raw material requests (steel, components) and packaging requests (boxes, labels, inserts) are handled as separate stages with their own approval flows. A production run cannot proceed to cutting or assembly until the store confirms that required materials have been formally allocated and issued.",
    result:
      "The store can now answer instantly — for any order — what was issued, how much, and when. That information used to exist nowhere. Material shortages mid-production dropped to near zero. The store manager now operates from a single screen with complete visibility into every pending request, eliminating verbal queues and priority conflicts entirely.",
    metrics: [
      { value: "0 → 100%", label: "Material traceability" },
      { value: "Eliminated", label: "Verbal requests" },
      { value: "Near zero", label: "Mid-run shortages" },
    ],
    images: [
      "/images/casestudy/navtech-case1-1.jpeg",
      "/images/casestudy/navtech-case1-2.jpeg",
      "/images/casestudy/navtech-case1-3.jpeg",
      "/images/casestudy/navtech-case1-4.jpeg",
      "/images/casestudy/navtech-case1-5.jpeg",
      "/images/casestudy/navtech-case1-6.jpeg",
    ],
  },
  {
    id: "navtech2",
    client: "Navtech Industries — Case II",
    industry: "SS Kitchenware",
    date: "August 2026",
    featured: true,
    problem:
      "Navtech sells gift sets — products like a 4-piece kitchen tool set containing a ladle, a spoon, a skimmer, and a turner in one box. Each item is a separate product with its own raw material, production steps, and timeline. There was no system to track these components together. The packing team would sometimes start assembling a set only to find that one of the four items had not come back from the polishing vendor yet. Or they would pack the set with the wrong grade of steel for one component because nobody had specified it. Orders were delayed, boxes had to be opened, and in some cases the wrong items were dispatched inside the set.",
    solution:
      "When a set order is planned, each individual component receives its own production record, enabling visibility into exact stage progress (cutting, polish, or ready). The system automatically restricts set packaging until every single constituent item is confirmed ready, preventing stalled assembly runs. Sales captures at the point of sale whether items go directly into the parent set box or receive individual wrapping, seamlessly instructing packaging workstations. Planners can schedule confirmed components immediately while deferring pending parts, keeping unfulfilled components visible in the planning backlog until resolved.",
    result:
      "Set packaging errors dropped to zero within the first month — no more wrong items dispatched, no more boxes opened for corrections. Assembly start is now gated by system confirmation, meaning every set that enters packaging is guaranteed to have all components ready and correctly specified. Production visibility across multi-component orders improved from zero to real-time, and the planning team recovered an estimated 6–8 hours per week previously spent chasing component status across the floor.",
    metrics: [
      { value: "→ Zero", label: "Packing errors" },
      { value: "6–8 hrs/wk", label: "Time recovered" },
      { value: "Real-time", label: "Set visibility" },
    ],
    images: [
      "/images/casestudy/navtech-case2-1.jpeg",
      "/images/casestudy/navtech-case2-2.jpeg",
    ],
  },
  {
    id: "ColorplasLLP1",
    client: "Colorplas LLP",
    industry: "Plastic Manufacturing",
    date: "June 2025",
    featured: true,
    problem:
      "Raising purchase orders was slow, prone to errors, and relied heavily on scattered manual note-keeping and phone calls. Staff struggled to track pending orders or identify which vendor had offered the best historical rates. Without a standardized system, updating delivery dates or correcting quantities often led to lost information and costly delays on the factory floor.",
    solution:
      "A custom module was built to turn material requisitions into purchase orders with a few clicks, enabling automated tracking and side-by-side vendor comparisons. Requisitions automatically pull the correct units of measurement, eliminating guesswork. Orders now move through distinct, trackable stages—from raised to received—automatically updating the system once materials arrive.",
    result:
      "The purchasing process transformed into a highly trackable system where buying decisions are based on clear numbers rather than memory. Filtering by vendor history is now instantaneous, removing the need to dig through old paperwork. This streamlined approach guarantees edits save properly every time and saves hours of administrative work.",
    metrics: [
      { value: "1-click", label: "PO from requisition" },
      { value: "Instant", label: "Vendor comparison" },
      { value: "100%", label: "Order traceability" },
    ],
    images: [
      "/images/casestudy/colorplas-case1-1.jpeg",
      "/images/casestudy/colorplas-case1-2.jpeg",
      "/images/casestudy/colorplas-case1-3.jpeg",
      "/images/casestudy/colorplas-case1-4.jpeg",
    ],
  },
  {
    id: "WorkDigitally1",
    client: "Work Digitally — Case I",
    industry: "Digital Marketing Agency",
    date: "April 2025",
    featured: true,
    problem:
      "Task reminders and notifications were sent manually via WhatsApp or forgotten entirely, leaving no paper trail or guarantee that a message was received or noticed by the assignee. Relying on human memory to chase lead sheets or send midweek reports proved highly unreliable and created a system where accountability was almost impossible to enforce.",
    solution:
      "The system now automatically sends smart, scheduled WhatsApp reminders containing specific details about pending tasks, who assigned them, and for which client. Every automated message is meticulously logged, recording the recipient, timestamp, exact content, and delivery status—including the specific reason if a message fails to send.",
    result:
      "Accountability is built directly into the process via a definitive, reliable communication log. The team receives clear, actionable prompts instead of vague nudges, entirely eliminating the need for constant manual chasing and ensuring everyone knows exactly what is expected of them each morning.",
    metrics: [
      { value: "Automated", label: "Daily reminders" },
      { value: "100%", label: "Message logged" },
      { value: "→ Zero", label: "Missed follow-ups" },
    ],
    images: [
      "/images/casestudy/workdigitally-case1-1.jpeg",
    ],
  },
  {
    id: "WorkDigitally2",
    client: "Work Digitally — Case II",
    industry: "Digital Marketing Agency",
    date: "April 2025",
    featured: true,
    problem:
      "Day-to-day operations were scattered across spreadsheets or reliant on memory, leading to missed deadlines, lost task assignments, and a generic, one-size-fits-all approach to checklists. Crucial tasks like hygiene checks, photo shoot schedules, and monthly reports were often simply forgotten until a deadline was missed.",
    solution:
      "The agency implemented a complete internal operations platform that runs automatically in the background on a set schedule. The system now generates personalized daily and weekly checklists tailored specifically to each team member's unique role. Furthermore, team members are no longer overwhelmed by a flood of company-wide information, seeing only the tasks directly assigned to them.",
    result:
      "Every task, client, and deadline is now tracked automatically, ensuring nothing falls through the cracks. By removing administrative noise, the team is freed up to focus entirely on executing great campaigns and delivering quality creative work for their brands.",
    metrics: [
      { value: "Role-based", label: "Personalised checklists" },
      { value: "→ Zero", label: "Missed deadlines" },
      { value: "Automated", label: "Weekly task gen" },
    ],
    images: [
      "/images/casestudy/workdigitally-case2-1.jpeg",
      "/images/casestudy/workdigitally-case2-2.jpeg",
    ],
  },
  {
    id: "WorkDigitally3",
    client: "Work Digitally — Case III",
    industry: "Digital Marketing Agency",
    date: "May 2025",
    featured: true,
    problem:
      "Every time a new client was onboarded, the agency had to manually create folders, build sub-folders, and set up onboarding paperwork, which was a slow, repetitive, and error-prone process. This manual setup simply could not scale, meaning every new client added an identical, tedious administrative burden to the team's workload.",
    solution:
      "The entire setup process was automated so that the moment a new client is added, the system generates a dedicated folder with a consistent, ready-to-use sub-folder structure. This automated structure includes predefined sections for brand assets, data, content calendars, reports, and ad creatives, ensuring uniformity across the board.",
    result:
      "Growth no longer translates to increased administrative work, as the system handles all folder creation and structuring automatically without any manual effort. Every client starts on a solid, consistent foundation from day one, regardless of how busy the team might be.",
    metrics: [
      { value: "Instant", label: "Folder creation" },
      { value: "→ Zero", label: "Manual setup work" },
      { value: "100%", label: "Structure consistency" },
    ],
    images: [
      "/images/casestudy/workdigitally-case3-1.jpeg",
      "/images/casestudy/workdigitally-case3-2.jpeg",
      "/images/casestudy/workdigitally-case3-3.jpeg",
      "/images/casestudy/workdigitally-case3-4.jpeg",
    ],
  },
  {
    id: "WorkDigitally4",
    client: "Work Digitally — Case IV",
    industry: "Digital Marketing Agency",
    date: "May 2025",
    featured: true,
    problem:
      "Creating client onboarding forms manually involved copy-pasting old documents, which took time and often led to embarrassing mistakes like leaving a previous client's name on a form. Furthermore, because folder structures varied based on who set them up, finding existing brand assets or past reports later became a time-wasting guessing game.",
    solution:
      "The system now automatically generates a personalized onboarding document filled out with the specific client's name and details, placing it directly into their new folder. Because every client folder now follows the exact same structure, team members can instantly locate materials, whether it is their first or fiftieth day working on the account.",
    result:
      "Onboarding is significantly faster and more reliable, allowing the agency to provide a highly professional, organized experience from the very first client interaction. Team members no longer waste time searching for files or duplicating work, as they always know exactly where to find necessary materials.",
    metrics: [
      { value: "Auto-fill", label: "Onboarding docs" },
      { value: "→ Zero", label: "Data-entry errors" },
      { value: "Instant", label: "Asset retrieval" },
    ],
    images: [
      "/images/casestudy/workdigitally-case4-1.jpeg",
    ],
  },
  {
    id: "ChefMateTechnologies1",
    client: "ChefMate Technologies",
    industry: "Commercial Kitchen Equipment",
    date: "January 2025",
    featured: true,
    problem:
      "Before the transition, sales teams relied heavily on personal inboxes, notebooks, and WhatsApp messages to manage their deals. This fragmented approach left them flying blind, unable to track whether a customer quote was ever approved or converted into a tangible order.",
    solution:
      "A unified pipeline was built to seamlessly connect Enquiries, Quotations, Sales Orders, Work Orders, and Bills of Quantities. This automated system instantly calculates complex variables like taxes and freight while generating professional, branded PDF documents with a single click.",
    result:
      "The sales team is now freed from tedious manual data entry and formatting tasks, allowing them to focus entirely on closing deals. Every quotation carries its full history forward automatically, completely eliminating manual pricing errors and lost information.",
    metrics: [
      { value: "→ Zero", label: "Pricing errors" },
      { value: "1-click", label: "PDF generation" },
      { value: "100%", label: "Quote traceability" },
    ],
    images: [
      "/images/casestudy/chefmate-case1-1.jpeg",
      "/images/casestudy/chefmate-case1-2.jpeg",
      "/images/casestudy/chefmate-case1-3.jpeg",
    ],
  },
  {
    id: "ARVCompanies1",
    client: "ARV Companies — Case I",
    industry: "Woven Sack Manufacturing",
    date: "February 2025",
    featured: true,
    problem:
      "Before implementing a unified system, identifying available fabric rolls required physically walking the factory floor or calling various departments. Because stock was constantly moving, this information was often outdated by the time it was reported, forcing management to make production plans and customer promises based on guesswork.",
    solution:
      "The system was redesigned so that every single roll exists as one live, centralized digital record from creation to dispatch. The instant a roll is consumed, marked ready, or shipped out, its status updates immediately across the entire network for all users.",
    result:
      "Floor supervisors and business owners can now view exact, real-time material availability without making a single phone call. Customer commitments and subsequent production runs are now confidently scheduled using highly accurate, up-to-the-minute data.",
    metrics: [
      { value: "Real-time", label: "Roll visibility" },
      { value: "Zero", label: "Guesswork" },
      { value: "Instant", label: "Status updates" },
    ],
    images: [
      "/images/casestudy/arvcompanies-case1-1.jpeg",
      "/images/casestudy/arvcompanies-case1-2.jpeg",
    ],
  },
  {
    id: "ARVCompanies2",
    client: "ARV Companies — Case II",
    industry: "Woven Sack Manufacturing",
    date: "March 2025",
    featured: true,
    problem:
      "Uniquely identifying rolls via handwritten numbers and manual data entry was extremely slow and invited constant human error. A single typo, skipped roll, or duplicate number misread by a worker could make a roll completely untraceable later in the production line.",
    solution:
      "Manual entry was replaced with barcodes attached to every roll, which are instantly scanned at every key stage of production. Scanning a roll immediately pulls up its exact digital profile in seconds, bypassing the need for manual keystrokes entirely.",
    result:
      "Inventory tracking is now incredibly fast and accurate by design. Errors originating from misread handwriting or mistyped digits have been eradicated, ensuring every roll's journey is cleanly and automatically captured.",
    metrics: [
      { value: "→ Zero", label: "Entry errors" },
      { value: "Seconds", label: "Lookup time" },
      { value: "100%", label: "Roll accuracy" },
    ],
    images: [
      "/images/casestudy/arvcompanies-case2-1.jpeg",
      "/images/casestudy/arvcompanies-case2-2.jpeg",
      "/images/casestudy/arvcompanies-case2-3.jpeg",
      "/images/casestudy/arvcompanies-case2-4.jpeg",
      "/images/casestudy/arvcompanies-case2-5.jpeg",
    ],
  },
  {
    id: "ARVCompanies3",
    client: "ARV Companies — Case III",
    industry: "Woven Sack Manufacturing",
    date: "March 2025",
    featured: true,
    problem:
      "The factory relied on handwritten paper logs to track production, leading to typos, illegible handwriting, and miscalculated tallies. Because two separate units required unique roll IDs, manual numbering constantly risked creating duplicate, skipped, or mismatched labels.",
    solution:
      "A simple, purpose-built digital logging screen was installed directly at the point of production. When operators select the unit, loom, and SKU, the system automatically assigns the next correct, unique roll ID without any manual counting.",
    result:
      "Data entry now takes seconds instead of minutes, completely removing the need to recopy data later. Auto-generated roll numbers eliminated human error, ensuring an accurate and reliable digital record for every single roll.",
    metrics: [
      { value: "Seconds", label: "Entry time" },
      { value: "→ Zero", label: "Duplicate IDs" },
      { value: "100%", label: "Log accuracy" },
    ],
    images: [
      "/images/casestudy/arvcompanies-case3-1.jpeg",
      "/images/casestudy/arvcompanies-case3-2.jpeg",
    ],
  },
  {
    id: "SantWires1",
    client: "Sant Wires",
    industry: "Wire Mesh & Gabion Manufacturing",
    date: "July 2025",
    featured: true,
    problem:
      "The sales team managed leads through phone calls and WhatsApp, jotting them down in personal notebooks, which led to lost leads and forgotten follow-ups. Additionally, typing quotations in Word was highly error-prone and took hours or even a full day to complete.",
    solution:
      "A centralised logging system was introduced to track all enquiries in one place, complete with automatic follow-up reminders. The app also allowed salespeople to generate professional quotations in minutes, automatically filling in rates and GST, and converting them to sales orders with a single tap.",
    result:
      "The team can now respond to customers significantly faster, preventing leads from falling through the cracks and maintaining a clear, traceable history of every quotation.",
    metrics: [
      { value: "Minutes", label: "Quote generation" },
      { value: "→ Zero", label: "Lost leads" },
      { value: "1-tap", label: "Order conversion" },
    ],
    images: [
      "/images/casestudy/santwires-case1-1.jpeg",
    ],
  },

 

  {
    id: "Colorplas2",
    client: "Colorplas LLP - Case II",
    industry: "Plastics Manufacturing",
    date: "January 2026",
    featured: true,
    problem:"The lab team received samples through informal verbal handoffs or phone calls, working from an unorganized pile or drawer of physical samples. They lacked clear context on who the sample belonged to or what exact specifications were being matched. When testing was finished, technicians had to remember to manually inform the correct salesperson. ",
    solution:"The R&D team now operates from a centralized, digital trial queue rather than a physical drawer. Each R&D trial record is permanently linked to the original customer enquiry, displaying exact visual and contextual data for the technicians. Lab staff update the trial status in the system, which automatically alerts the sales team without requiring a meeting.  ",
    result:"Lab work is completely structured, with technicians knowing exactly what to test and for whom at all times. The elimination of verbal handoffs ensures no critical sample information gets lost in translation. Testing progress is instantly communicated across departments, entirely removing the administrative communication burden from the lab staff.  Icon ",
    metrics: [
      { value: "Minutes", label: "Quote generation" },
      { value: "→ Zero", label: "Lost leads" },
      { value: "1-tap", label: "Order conversion" },
    ],
    images: [
      "/images/casestudy/colorplas-case2-1.jpeg",
      "/images/casestudy/colorplas-case2-2.jpeg",
      "/images/casestudy/colorplas-case2-3.jpeg",
    ],
  },
   {
    id: "WeddingAlliance1",
    client: "Wedding Alliance",
    industry: "Matchmaking & Wedding Services",
    date: "December 2025",
    featured: true,
    problem:"The internal process for managing new leads was chaotic. Employees wasted hours every day just trying to organize their lists and figure out who to call next.",
    solution:" We introduced a smart, automated task system. Leads are instantly assigned to the right person, and staff simply log in to work through a clean, organized daily list.",
    result:" The chaos is gone. The team now handles a massive volume of leads effortlessly, leading to faster follow-ups and higher conversion rates.",

    metrics: [
      { value: "Minutes", label: "Quote generation" },
      { value: "→ Zero", label: "Lost leads" },
      { value: "1-tap", label: "Order conversion" },
    ],
    images: [
      "/images/casestudy/weddingalliance-case1-1.jpeg",
      "/images/casestudy/weddingalliance-case1-2.jpeg",
      "/images/casestudy/weddingalliance-case1-3.jpeg",
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // ➕ ADD A NEW CASE STUDY — copy the block above and paste it here
  // ──────────────────────────────────────────────────────────────────────────
];


// =============================================================================
// REVIEWS / TESTIMONIALS — add new entries here
// =============================================================================
const REVIEWS = [
  {
    quote: "We engaged LRBC to streamline our internal systems, and we are incredibly pleased with the results. They provided a true end-to-end solution that handles everything from initial inquiries and the complete sales process to our manufacturing and stores modules. We are very happy with how seamlessly the product connects all our processes. Thanks to this system, our dependency on manual effort has reduced significantly.",
    name: "Prabhu Pandurang",
    designation: "CEO",
    company: "Chefmate — Commercial Kitchen Hoods",
    image: "/images/Prabhu.jpeg",
    rating: 5,
  },
  {
    quote: "When hiring someone to build business systems, you need a partner who understands your requirements and seamlessly translates ideas into practical solutions. Working with Lalit at LRBC was exactly that experience. He is incredibly patient, approachable, and highly prompt in his responses. Lalit stays updated with the latest technologies and genuinely cares about helping your business grow. He made our entire system-building process smooth and completely hassle-free. If you are looking for a technology partner who truly listens and delivers, I confidently recommend LRBC. Highly recommended for anyone wanting to create robust systems to scale their business!",
    name: "Ekkta V Vohra",
    designation: "Founder",
    company: "Wedding Alliances",
    image: "/images/Ekkta.jpeg",
    rating: 5,
  },
  {
    quote: "The unique part about their offerings is that they spend time in understanding your business and its details, and offer products which have been made specifically for our needs rather than pushing any standard product. This helps in keeping the operation and learning simple and cost friendly.",
    name: "Varun Bathwal",
    designation: "CEO",
    company: "ARV",
    image: "/images/Varun.jpeg",
    rating: 5,
  },
  {
    quote: "Team LRBC is highly capable and possesses extensive knowledge across various subjects, particularly in the area of process optimisation for business owners. I personally consult with them for technology-related solutions and consistently receive valuable and meaningful insights.",
    name: "Kanul Verma",
    designation: "Executive Director",
    company: "Hitco Group",
    image: "/images/Kanul.jpeg",
    rating: 5,
  },
];

// =============================================================================
// NOTHING TO EDIT BELOW THIS LINE — layout is fully automatic
// =============================================================================

const CS_PAGE = 2;

function ImageCarousel({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);
  if (!images.length) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-muted/30 select-none">
      {/* Image takes its natural width/height — container wraps around it */}
      <img
        src={images[idx]}
        alt="Project screenshot"
        className="w-full h-auto block transition-all duration-500"
        draggable={false}
        onContextMenu={e => e.preventDefault()}
      />

      {images.length > 1 && (
        <>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? "w-5 bg-primary" : "w-1.5 bg-primary/30"}`} />
            ))}
          </div>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition z-10">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition z-10">
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}


function CaseStudyCard({ cs, index }: { cs: typeof CASE_STUDIES[0]; index: number }) {
  const imageRight = index % 2 === 0;
  return (
    <div className="lrbc-anim relative rounded-3xl border border-border bg-card/60 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30">
      <div className="h-1 w-full bg-gradient-to-r from-primary via-purple-400 to-pink-400" />
      <div className="p-4 sm:p-7 lg:p-9 flex flex-col gap-4 sm:gap-6">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {cs.featured && <Badge variant="secondary" className="text-xs rounded-full">Featured</Badge>}
              <Badge variant="outline" className="text-xs rounded-full">{cs.industry}</Badge>
              {cs.date && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {cs.date}
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold">{cs.client}</h3>
          </div>
          {cs.metrics.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
              {cs.metrics.map((m, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-center min-w-[72px]">
                  <span className="text-sm font-bold text-primary leading-tight">{m.value}</span>
                  <span className="text-[10px] text-muted-foreground leading-tight">{m.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/*
           * MOBILE  (<md): fixed order — Problem → Solution → Result → Images
           * DESKTOP (md+): alternating 2x2 grid controlled by imageRight
           *
           * How it works:
           * - On mobile: flex-col + CSS order classes force the fixed order
           * - On desktop: we switch to grid and reset order so imageRight controls layout
            */}
        {imageRight ? (
            <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4">
              <div className="order-1 md:order-1 rounded-2xl bg-muted/40 p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-red-500">Problem</p>
                <p className="text-sm text-foreground/80 leading-6">{cs.problem}</p>
              </div>
              <div className="order-3 md:order-2 rounded-2xl bg-muted/40 p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-green-500">Result</p>
                <p className="text-sm text-foreground/80 leading-6">{cs.result}</p>
              </div>
              <div className="order-2 md:order-3 rounded-2xl bg-muted/40 p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-blue-500">Solution</p>
                <p className="text-sm text-foreground/80 leading-6">{cs.solution}</p>
              </div>
              <div className="order-4 md:order-4 rounded-2xl overflow-hidden">
                <ImageCarousel images={cs.images} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4">
              <div className="order-1 md:order-2 rounded-2xl bg-muted/40 p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-red-500">Problem</p>
                <p className="text-sm text-foreground/80 leading-6">{cs.problem}</p>
              </div>
              <div className="order-3 md:order-1 rounded-2xl bg-muted/40 p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-green-500">Result</p>
                <p className="text-sm text-foreground/80 leading-6">{cs.result}</p>
              </div>
              <div className="order-2 md:order-4 rounded-2xl bg-muted/40 p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-blue-500">Solution</p>
                <p className="text-sm text-foreground/80 leading-6">{cs.solution}</p>
              </div>
              <div className="order-4 md:order-3 rounded-2xl overflow-hidden">
                <ImageCarousel images={cs.images} />
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}


export default function CaseStudiesPage() {
  const sectionRef = useFadeUp();
  const [csVisible, setCsVisible] = useState(CS_PAGE);

  const shuffled = useMemo(() => [...CASE_STUDIES].sort(() => Math.random() - 0.5), []);
  const shownCs = shuffled.slice(0, csVisible);
  const moreCs  = CASE_STUDIES.length - csVisible;

  return (
    <div className="mx-auto min-w-full max-w-full overflow-x-hidden">
      <HeroHeader />

      <NewHeroSection
        title={
          <h1 className="mx-auto max-w-5xl flex flex-col text-center text-4xl max-md:font-bold md:text-5xl xl:text-[5.25rem]">
            <span className="overflow-hidden">Real Results.</span>
            <span className="overflow-hidden">Real Clients.</span>
          </h1>
        }
        subtitle="Every case study is a real business problem we solved. Every number is verified."
        buttonText="Book a Discovery Call"
        buttonHref="/contact"
        badgeText="Case Studies"
      />

      {/* ── Case Studies ─────────────────────────────────────────────── */}
      <section ref={sectionRef} className="mx-auto max-w-6xl px-4 sm:px-6 py-10 md:py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Deep Dives</p>
          <h2 className="lrbc-anim text-3xl sm:text-4xl font-semibold">The Work, In Detail</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Each case study shows the specific problem, the system we built, and the measurable outcome.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {shownCs.map((cs, i) => <CaseStudyCard key={cs.id} cs={cs} index={i} />)}
        </div>

        {CASE_STUDIES.length > CS_PAGE && (
          <div className="flex justify-center mt-8">
            {moreCs > 0 ? (
              <button
                onClick={() => setCsVisible(v => v + CS_PAGE)}
                className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary hover:bg-primary/5"
              >
                <ChevronDown className="h-4 w-4" />
                Load more
              </button>
            ) : (
              <button
                onClick={() => setCsVisible(CS_PAGE)}
                className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary hover:bg-primary/5"
              >
                <ChevronDown className="h-4 w-4 rotate-180" />
                Show less
              </button>
            )}
          </div>
        )}
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-10 md:py-16">
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5 p-10 text-center shadow-sm">
          <TrendingUp className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h3 className="text-2xl sm:text-3xl font-semibold mb-3">Ready to become the next case study?</h3>
          <p className="text-muted-foreground mb-7 max-w-md mx-auto text-sm sm:text-base">
            Book a discovery call and let us map out what a Business Operating System looks like for your operations.
          </p>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/contact?openForm=true">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
 