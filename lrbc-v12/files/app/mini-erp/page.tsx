import type { Metadata } from "next";
import { ShoppingCart, Truck, Boxes, Calculator, BarChart3, ShieldCheck, Network, Wallet } from "lucide-react";
import { ProductPage, type ProductPageData } from "@/components/product-pages/ProductPage";

export const metadata: Metadata = {
  title: "Mini ERP",
  description:
    "Mini ERP by LRBC: a lean, affordable ERP for businesses with ₹10–50 Cr turnover. Sales, purchase, inventory, accounts and approvals across every location.",
  alternates: { canonical: "/mini-erp" },
  openGraph: {
    title: "Mini ERP",
    description: "A lean, affordable, multi-location ERP for growing businesses — sales, purchase, stock, accounts and approvals in one system.",
    url: "/mini-erp",
    type: "website",
  },
};

const data: ProductPageData = {
  slug: "mini-erp",
  name: "Mini ERP",
  badge: "For ₹10 Cr – ₹50 Cr turnover",
  h1: ["The right-sized ERP", "for growing businesses"],
  answer:
    "Mini ERP is a lean, affordable ERP from LRBC for businesses with a turnover of ₹10 Cr to ₹50 Cr. It connects sales, purchase, inventory, accounts and approvals across every location, without the cost and complexity of a full-scale system.",
  heroText:
    "Connect your everyday operations from sales to accounting on a system that keeps things simple, your costs low, and tailored for your growing business.",
  stats: [
    { value: "₹10–50 Cr", label: "Ideal turnover" },
    { value: "Multi-location", label: "Branches & warehouses" },
    { value: "Lean & affordable", label: "Pay for what you use" },
  ],
  features: [
    { icon: ShoppingCart, title: "Sales", text: "Quotations, orders and invoices in one flow, so your sales team and accounts always see the same numbers." },
    { icon: Truck, title: "Purchase", text: "Raise purchase requests and orders, track supplier dealings and keep buying under control." },
    { icon: Boxes, title: "Inventory", text: "Know what you have, where it is and what to reorder, location by location." },
    { icon: Calculator, title: "Accounts", text: "Entries flow in from sales, purchase and stock, so there is less re-typing and fewer mismatches." },
    { icon: ShieldCheck, title: "Approvals", text: "Important actions reach the right person for approval, with a clear record of who approved what." },
    { icon: BarChart3, title: "Reports for the owner", text: "Location-wise and consolidated reports, so decisions are based on data, not guesswork." },
    { icon: Network, title: "Multi-location ready", text: "Run head office, branches and warehouses from one system with a single view of the whole business." },
    { icon: Wallet, title: "Low cost, lean data", text: "A focused scope keeps set-up and running costs far below a full-scale ERP. Add modules only when you need them." },
  ],
  steps: [
    { icon: "search", title: "Understand", text: "We map your business, your locations and the way your team works today." },
    { icon: "configure", title: "Configure", text: "We set up only the modules you need, so you are not paying for features you will never use." },
    { icon: "rocket", title: "Go live", text: "We train your team and support you after launch, so the change settles in smoothly." },
  ],
  fits: [
    "Your annual turnover is roughly ₹10 Cr to ₹50 Cr",
    "Data is scattered across spreadsheets, paperwork and different tools",
    "You have multiple locations, branches or warehouses",
    "You want an ERP that is quick to adopt and light on the budget",
  ],
  notFits: [
    "Your processes are highly specific and need workflows built from scratch",
    "You run multiple factories or a very large team with complex approvals",
    "You lead a large number of teams across multiple locations with more complex processes",
  ],
  pricing: {
    title: "Pricing that stays lean",
    text: "Mini ERP is priced around the modules and locations you actually use, so there is no heavy upfront cost for features you do not need. Because every business is different, we share a clear quote after a short conversation about your requirements.",
    points: ["Pay only for the modules you use", "Scales with locations and users", "No lock-in to features you do not need", "Add more modules as you grow"],
  },
  faqs: [
    { q: "What is Mini ERP?", a: "Mini ERP is a lean ERP system from LRBC that connects sales, purchase, inventory, accounts and approvals in one place, built for businesses with a turnover of ₹10 Cr to ₹50 Cr." },
    { q: "How is Mini ERP different from a full ERP?", a: "It keeps the data and modules lean, so it is quicker to set up, easier for your team to adopt and far more affordable than a full-scale ERP." },
    { q: "Can it manage more than one location?", a: "Yes. Head Office, branches and warehouses can run on a single system across multiple locations, with consolidated reports." },
    { q: "How much does Mini ERP cost?", a: "The cost depends on the modules, number of users and locations you need. Contact us and we will prepare a quote for your requirements." },
    { q: "How long does it take to go live?", a: "Typically, implementation takes around 30–60 days, depending on your business requirements and the modules involved. We understand your workflows, configure the system, train your team, and provide support to ensure a smooth go-live." },
    { q: "What if my business outgrows Mini ERP?", a: "You can add modules as your business grows. If your processes become more complex, we can smoothly transition you to a full-scale ERP tailored to your evolving business needs and workflows." },
  ],
  ctaTitle: "Ready for an ERP that fits your size?",
  ctaText: "Tell us about your business and we will suggest the modules you need and share a clear quote.",
  other: { name: "Custom ERP", href: "/custom-erp", text: "See Custom ERP for ₹50 Cr+ businesses" },
};

export default function MiniErpPage() {
  return <ProductPage d={data} />;
}
