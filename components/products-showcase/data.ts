import {
  LayoutDashboard,
  RefreshCw,
  Building2,
  Boxes,
  Workflow,
  Sparkles,
  UserCheck,
  ListTodo,
  Gauge,
  TrendingUp,
  Target,
  Layers,
  Network,
  Wallet,
  Cloud,
  Cog,
  Factory,
  type LucideIcon,
} from "lucide-react";

/**
 * Products & Services showcase — data
 * ───────────────────────────────────
 * To add a new product, push ONE object into PRODUCTS.
 * The stack tabs (bookmarks), tablet, cards, pop-ups and swipe controls
 * are all generated from this file.
 */

export type VisualKey =
  | "lekha-dashboard"
  | "lekha-sync"
  | "lekha-company"
  | "lekha-stock"
  | "attendance"
  | "kanban"
  | "performance"
  | "impact"
  | "steps"
  | "pitch"
  | "fit"
  | "modules"
  | "network"
  | "cost"
  | "cloud"
  | "flow";

export type CardDetail = {
  heading: string;
  body: string;
  points: string[];
};

export type ShowcaseCard = {
  id: string;
  title: string;
  icon: LucideIcon;
  visual: VisualKey;
  /** Tailwind grid classes for md+ (12-col bento, 3 rows) */
  span: string;
  /** Where the hover pop-up opens from */
  align: "left" | "center" | "right";
  valign: "top" | "center" | "bottom";
  detail: CardDetail;
  /** Only used by "steps" visual */
  steps?: { title: string; text: string }[];
  /** Only used by "impact" visual */
  metrics?: { value: string; label: string }[];
  /** Used by "fit", "modules", "network", "cloud" and "flow" visuals */
  chips?: string[];
};

export type Product = {
  id: string;
  name: string;
  initial: string;
  tagline: string;
  description: string;
  href: string;
  /** css gradient used for the bookmark, logo mark and accents */
  gradient: string;
  /** Optional label for the pitch-card button (default: "Explore {name}") */
  cta?: string;
  cards: ShowcaseCard[];
};

export const PRODUCTS: Product[] = [
  /* ───────────────────────── LekhaSetu ───────────────────────── */
  {
    id: "lekhasetu",
    name: "LekhaSetu",
    initial: "L",
    tagline: "Your accounts, live in the cloud",
    description:
      "Forget manual exports and outdated reports. LekhaSetu continuously syncs your Account data with the cloud so every dashboard, report and insight is always current.",
    href: "/lekhasetu",
    gradient: "linear-gradient(135deg, #6d3df0 0%, #4f46e5 100%)",
    cards: [
      {
        id: "dashboard",
        title: "Live Business Dashboards",
        icon: LayoutDashboard,
        visual: "lekha-dashboard",
        span: "md:col-span-6 md:row-span-2",
        align: "left",
        valign: "top",
        detail: {
          heading: "Live Business Dashboards",
          body: "Access real-time insights from any device, anywhere. Every dashboard, report and insight stays current because your data is synced automatically.",
          points: ["Real-time insights, any device", "Receivables & payables at a glance", "No manual exports or outdated reports"],
        },
      },
      {
        id: "sync",
        title: "Real-Time Sync",
        icon: RefreshCw,
        visual: "lekha-sync",
        span: "md:col-span-6",
        align: "right",
        valign: "top",
        detail: {
          heading: "Real-Time Synchronization",
          body: "Automatically sync vouchers, ledgers, and stock data every few minutes. Keep your business data secure, current, and always accessible without manual effort.",
          points: ["Vouchers, ledgers & stock data", "Automatic cloud sync", "Secure and always accessible"],
        },
      },
      {
        id: "company",
        title: "Multi-Company",
        icon: Building2,
        visual: "lekha-company",
        span: "md:col-span-3",
        align: "center",
        valign: "center",
        detail: {
          heading: "Multi-Company Support",
          body: "Manage multiple location accounting from a single platform.",
          points: ["Multi-company management", "Multiple locations, one platform"],
        },
      },
      {
        id: "stock",
        title: "Inventory Insights",
        icon: Boxes,
        visual: "lekha-stock",
        span: "md:col-span-3",
        align: "right",
        valign: "center",
        detail: {
          heading: "Inventory & Stock Tracking",
          body: "Stay on top of stock movement, consumption, and production.",
          points: ["Stock movement", "Consumption & production", "Inventory insights"],
        },
      },
      {
        id: "how",
        title: "How it works",
        icon: Workflow,
        visual: "steps",
        span: "md:col-span-6",
        align: "left",
        valign: "bottom",
        steps: [
          { title: "Connect", text: "Link your accounting data" },
          { title: "Sync", text: "Auto-syncs every few minutes" },
          { title: "Decide", text: "Live reports anywhere" },
        ],
        detail: {
          heading: "How LekhaSetu works",
          body: "Connect once and LekhaSetu keeps your Account data continuously synced with the cloud — so your team reads reports instead of requesting them.",
          points: ["1 · Connect your accounting data", "2 · It syncs to the cloud automatically", "3 · View dashboards and reports on any device"],
        },
      },
      {
        id: "pitch",
        title: "Why LekhaSetu",
        icon: Sparkles,
        visual: "pitch",
        span: "md:col-span-6",
        align: "right",
        valign: "bottom",
        detail: {
          heading: "LekhaSetu",
          body: "Forget manual exports and outdated reports. LekhaSetu continuously syncs your Account data with the cloud so every dashboard, report and insight is always current.",
          points: ["Real-time cloud sync", "Multi-company management", "Inventory insights"],
        },
      },
    ],
  },

  /* ───────────────────────── WorkPilot ───────────────────────── */
  {
    id: "workpilot",
    name: "WorkPilot",
    initial: "W",
    tagline: "Your team, one clear view",
    description:
      "WorkPilot simplifies workforce management by bringing attendance, task allocation, and work tracking into one centralized platform. With a quick overview of your team's progress and day-to-day activities, you can spend less time following up and more time helping your business move forward.",
    href: "/workpilot",
    gradient: "linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)",
    cards: [
      {
        id: "attendance",
        title: "Live Attendance",
        icon: UserCheck,
        visual: "attendance",
        span: "md:col-span-6 md:row-span-2",
        align: "left",
        valign: "top",
        detail: {
          heading: "Live Attendance Tracking",
          body: "Know exactly who clocked in, who is late, and who is absent — updated in real time, every day. No manual registers, no end-of-day reconciliation.",
          points: ["Updated in real time, every day", "Mobile-first: check in from any phone", "Full activity history, permanently logged"],
        },
      },
      {
        id: "tasks",
        title: "Smart Task Assignment",
        icon: ListTodo,
        visual: "kanban",
        span: "md:col-span-6",
        align: "right",
        valign: "top",
        detail: {
          heading: "Smart Task Assignment",
          body: "Assign tasks to individuals or teams, set deadlines, and track completion status. Everyone knows what they need to do — and managers can see it all.",
          points: ["Individuals or whole teams", "Deadlines & completion status", "Automated reminders for pending work"],
        },
      },
      {
        id: "performance",
        title: "Performance",
        icon: Gauge,
        visual: "performance",
        span: "md:col-span-3",
        align: "center",
        valign: "center",
        detail: {
          heading: "Performance Dashboards",
          body: "Each employee gets a score based on attendance, task completion, and activity. Identify top performers and spot patterns before they become problems.",
          points: ["Score from attendance, tasks & activity", "Spot patterns early", "Role-based access for every level"],
        },
      },
      {
        id: "impact",
        title: "Impact",
        icon: TrendingUp,
        visual: "impact",
        span: "md:col-span-3",
        align: "right",
        valign: "center",
        metrics: [
          { value: "94%", label: "Fewer manual follow-ups" },
          { value: "3×", label: "Faster daily reporting" },
          { value: "100%", label: "Visibility into team activity" },
          { value: "0", label: "Missed attendance records" },
        ],
        detail: {
          heading: "What teams get",
          body: "Less chasing, more moving forward. Instant MIS reports ready to share with leadership or export to Excel.",
          points: ["94% reduction in manual follow-ups", "3× faster daily reporting", "100% visibility · 0 missed attendance records"],
        },
      },
      {
        id: "how",
        title: "How it works",
        icon: Workflow,
        visual: "steps",
        span: "md:col-span-6",
        align: "left",
        valign: "bottom",
        steps: [
          { title: "Add your team", text: "Import people, roles & departments" },
          { title: "Assign & track", text: "Tasks and progress, instantly" },
          { title: "Review & improve", text: "Weekly performance reports" },
        ],
        detail: {
          heading: "How WorkPilot works",
          body: "WorkPilot maps to your existing org structure — no restructuring needed.",
          points: [
            "1 · Add your team: import employees, define roles and departments",
            "2 · Assign & track: managers set deadlines, employees update from any device",
            "3 · Review & improve: weekly reports show bottlenecks before they hurt",
          ],
        },
      },
      {
        id: "pitch",
        title: "Why WorkPilot",
        icon: Sparkles,
        visual: "pitch",
        span: "md:col-span-6",
        align: "right",
        valign: "bottom",
        detail: {
          heading: "WorkPilot",
          body: "Attendance, task allocation, and work tracking in one centralized platform — so you spend less time following up and more time helping your business move forward.",
          points: ["Attendance", "Task assignment", "Activity history", "Performance tracking"],
        },
      },
    ],
  },

  /* ───────────────────────── Mini ERP ───────────────────────── */
  {
    id: "minierp",
    name: "Mini ERP",
    initial: "M",
    tagline: "Right-sized ERP for growing businesses",
    description:
      "A lean, affordable ERP for businesses with a turnover of ₹10 Cr to ₹50 Cr. Manage sales, purchase, stock, accounts and approvals — across every location — without the weight, cost and complexity of a full-scale system.",
    href: "/contact",
    cta: "Talk to us about Mini ERP",
    gradient: "linear-gradient(135deg, #a855f7 0%, #6d3df0 100%)",
    cards: [
      {
        id: "fit",
        title: "Right-Fit Filter",
        icon: Target,
        visual: "fit",
        span: "md:col-span-6 md:row-span-2",
        align: "left",
        valign: "top",
        metrics: [{ value: "₹10–50 Cr", label: "Annual turnover" }],
        chips: ["Lean data", "Multi-location", "Low cost", "Quick setup"],
        detail: {
          heading: "Built for ₹10 Cr – ₹50 Cr businesses",
          body: "Mini ERP is designed for growing businesses that need control and visibility, but not a heavy, expensive implementation. You get the essentials, set up quickly and easy for your team to adopt.",
          points: ["Turnover band: ₹10 Cr to ₹50 Cr", "Lean data — only what you actually manage", "Multi-location ready", "Affordable, quick to set up"],
        },
      },
      {
        id: "modules",
        title: "Core Modules",
        icon: Layers,
        visual: "modules",
        span: "md:col-span-6",
        align: "right",
        valign: "top",
        chips: ["Sales", "Purchase", "Inventory", "Accounts", "Reports", "Approvals"],
        detail: {
          heading: "Everything essential, nothing extra",
          body: "Start with the modules that run your day-to-day business. Each one talks to the others, so you enter data once and see it everywhere.",
          points: ["Sales & Purchase in one flow", "Inventory and Accounts connected", "Reports and Approvals for the owner", "Add modules only when you need them"],
        },
      },
      {
        id: "locations",
        title: "Multi-Location",
        icon: Network,
        visual: "network",
        span: "md:col-span-3",
        align: "center",
        valign: "center",
        chips: ["Head office", "Branch", "Warehouse"],
        detail: {
          heading: "Multi-Location Management",
          body: "Run your head office, branches and warehouses from one system, with a single view of the whole business.",
          points: ["One system, many locations", "Location-wise and consolidated reports"],
        },
      },
      {
        id: "cost",
        title: "Low Cost",
        icon: Wallet,
        visual: "cost",
        span: "md:col-span-3",
        align: "right",
        valign: "center",
        detail: {
          heading: "Affordable by design",
          body: "Because Mini ERP keeps the data and modules lean, it costs far less to set up and run than a full-scale ERP. Exact pricing depends on your modules and locations — talk to us for a quote.",
          points: ["Lean scope keeps cost down", "Pay for the modules you use", "Grow into more later"],
        },
      },
      {
        id: "how",
        title: "How it works",
        icon: Workflow,
        visual: "steps",
        span: "md:col-span-6",
        align: "left",
        valign: "bottom",
        steps: [
          { title: "Understand", text: "Map your business & locations" },
          { title: "Configure", text: "Only the modules you need" },
          { title: "Go live", text: "Training and support" },
        ],
        detail: {
          heading: "How Mini ERP works",
          body: "We keep the process simple and get you live quickly, without disturbing your day-to-day work.",
          points: ["1 · Understand: we map your business and locations", "2 · Configure: set up only the modules you need", "3 · Go live: train your team and support you after launch"],
        },
      },
      {
        id: "pitch",
        title: "Why Mini ERP",
        icon: Sparkles,
        visual: "pitch",
        span: "md:col-span-6",
        align: "right",
        valign: "bottom",
        detail: {
          heading: "Mini ERP",
          body: "A lean, affordable ERP for businesses with a turnover of ₹10 Cr to ₹50 Cr — multi-location ready, quick to adopt, and built to grow with you.",
          points: ["₹10 Cr – ₹50 Cr turnover", "Multi-location management", "Low cost, lean data"],
        },
      },
    ],
  },

  /* ───────────────────────── Custom ERP ───────────────────────── */
  {
    id: "customerp",
    name: "Custom ERP",
    initial: "C",
    tagline: "Built around how your business runs",
    description:
      "A cloud-based ERP designed and built around your processes, for businesses with a turnover of ₹50 Cr and above. Any team size, any number of factories and locations — with secure cloud storage and workflows shaped to your operations.",
    href: "/contact",
    cta: "Talk to us about Custom ERP",
    gradient: "linear-gradient(135deg, #312e81 0%, #7c3aed 100%)",
    cards: [
      {
        id: "fit",
        title: "Right-Fit Filter",
        icon: Target,
        visual: "fit",
        span: "md:col-span-6 md:row-span-2",
        align: "left",
        valign: "top",
        metrics: [{ value: "₹50 Cr+", label: "Annual turnover" }],
        chips: ["Any employee size", "Any factory", "Multi-location", "Cloud-ready"],
        detail: {
          heading: "Built for ₹50 Cr+ businesses",
          body: "Custom ERP is for larger and fast-growing businesses whose processes are too specific for an off-the-shelf system. We design it around your operations — for any team size and any number of plants.",
          points: ["Turnover: ₹50 Cr and above", "Any employee size", "Any factory or plant", "Multi-location, cloud-ready"],
        },
      },
      {
        id: "cloud",
        title: "Cloud Storage",
        icon: Cloud,
        visual: "cloud",
        span: "md:col-span-6",
        align: "right",
        valign: "top",
        chips: ["Secure storage", "Automatic backups", "Role-based access"],
        detail: {
          heading: "Your data, safe in the cloud",
          body: "All your business data lives in secure cloud storage, so it is available to the right people from anywhere, and protected against loss.",
          points: ["Secure cloud storage", "Automatic backups", "Role-based access for every level", "Available from any location"],
        },
      },
      {
        id: "locations",
        title: "Multi-Location",
        icon: Factory,
        visual: "network",
        span: "md:col-span-3",
        align: "center",
        valign: "center",
        chips: ["Factory 1", "Factory 2", "Head office"],
        detail: {
          heading: "Multiple Factories & Locations",
          body: "Bring every factory, warehouse and office onto one platform, with plant-wise and company-wide visibility.",
          points: ["Plant-wise and consolidated view", "One platform for all sites"],
        },
      },
      {
        id: "workflows",
        title: "Your Workflows",
        icon: Cog,
        visual: "flow",
        span: "md:col-span-3",
        align: "right",
        valign: "center",
        chips: ["Order", "Plan", "Produce", "Dispatch"],
        detail: {
          heading: "Workflows shaped to your business",
          body: "Instead of changing your process to fit the software, we build the software to fit your process — from order to dispatch and beyond.",
          points: ["Designed around your process", "Approvals and rules your way", "Integrates with your existing tools"],
        },
      },
      {
        id: "how",
        title: "How it works",
        icon: Workflow,
        visual: "steps",
        span: "md:col-span-6",
        align: "left",
        valign: "bottom",
        steps: [
          { title: "Study", text: "Understand your processes" },
          { title: "Design & build", text: "Workflows made for you" },
          { title: "Deploy & support", text: "Rollout, training, care" },
        ],
        detail: {
          heading: "How Custom ERP works",
          body: "A structured, step-by-step approach so the system matches your business before it goes live.",
          points: ["1 · Study: we understand your processes on the ground", "2 · Design & build: workflows and modules made for you", "3 · Deploy & support: rollout, training and ongoing support"],
        },
      },
      {
        id: "pitch",
        title: "Why Custom ERP",
        icon: Sparkles,
        visual: "pitch",
        span: "md:col-span-6",
        align: "right",
        valign: "bottom",
        detail: {
          heading: "Custom ERP",
          body: "A cloud-based ERP built around your processes — for ₹50 Cr+ businesses, any team size, any number of factories and locations.",
          points: ["₹50 Cr+ turnover", "Cloud storage", "Any employee size · any factory", "Multi-location"],
        },
      },
    ],
  },
];
