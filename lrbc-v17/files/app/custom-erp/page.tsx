import type { Metadata } from "next";
import { Cog, Cloud, Factory, Users, Plug, Lock, LineChart, Headphones } from "lucide-react";
import { ProductPage, type ProductPageData } from "@/components/product-pages/ProductPage";

export const metadata: Metadata = {
  title: "Custom ERP",
  description:
    "Custom ERP by LRBC: a cloud-based ERP built around your processes for businesses with ₹50 Cr+ turnover — any team size, any number of factories and locations.",
  alternates: { canonical: "/custom-erp" },
  openGraph: {
    title: "Custom ERP",
    description: "A cloud ERP designed around your workflows — for any team size, any factory and any number of locations.",
    url: "/custom-erp",
    type: "website",
  },
};

const data: ProductPageData = {
  slug: "custom-erp",
  name: "Custom ERP",
  badge: "For ₹50 Cr+ turnover",
  h1: ["An ERP built around", "how your business runs"],
  answer:
    "Custom ERP is a cloud-based ERP that LRBC designs and builds around your own processes, for businesses with a turnover of ₹50 Cr and above. It supports any team size, any number of factories and locations, with secure cloud storage and workflows shaped to your operations.",
  heroText:
    "Your workflow. Your systems. Your way. Curated for special needs of your business supporting large and multiple teams, factories, and locations, with secure cloud storage.",
  stats: [
    { value: "₹50 Cr+", label: "Ideal turnover" },
    { value: "3+", label: "Team, plants, locations" },
    { value: "Cloud-based", label: "Secure & always available" },
  ],
  features: [
    { icon: Cog, title: "Workflows your way", text: "We build the software to fit your process, from order to dispatch and beyond, instead of forcing your team to change how they work." },
    { icon: Cloud, title: "Secure cloud storage", text: "Your business data lives in the cloud with automatic backups, available from any location to the people who need it." },
    { icon: Factory, title: "Any factory, any location", text: "Manage multiple plants, branches and warehouses in one connected system with a single view of operations." },
    { icon: Users, title: "Any team size", text: "From a few dozen to thousands of employees, with role-based access at every level." },
    { icon: Lock, title: "Role-based control", text: "Approvals and permissions follow your hierarchy, so the right people see and approve the right things." },
    { icon: Plug, title: "Fits your existing tools", text: "Connects with the tools you already use, so you do not have to start from zero." },
    { icon: LineChart, title: "Decision-ready reports", text: "Dashboards and reports designed around the numbers your leadership actually reviews." },
    { icon: Headphones, title: "Rollout and ongoing support", text: "Training, change-over management and continued support after go-live." },
  ],
  steps: [
    { icon: "search", title: "Study", text: "We spend time on the ground to understand your processes, pain points and goals." },
    { icon: "build", title: "Design & build", text: "We design workflows and modules around your operations and build them with your team's feedback." },
    { icon: "rocket", title: "Deploy & support", text: "We roll out in stages, train your people and support you as the system becomes part of daily work." },
  ],
  fits: [
    "Your annual turnover is ₹50 Cr or more",
    "Your processes are specific and off-the-shelf software does not fit",
    "You run multiple factories, plants or locations",
    "You want secure cloud access and strong control over approvals",
  ],
  notFits: [
    "You want a ready-made, lightweight system you can start using quickly",
    "Your turnover is below ₹50 Cr and your needs are fairly standard",
  ],
  pricing: {
    title: "Scoped around your business",
    text: "A custom build is priced on its scope: the processes covered, the number of locations and users, and the integrations needed. We start with a study of your operations, then share a clear proposal so you know what you are getting before work begins.",
    points: ["Proposal after a process study", "Clear scope before work begins", "Rolled out in stages", "Support included after go-live"],
  },
  faqs: [
    { q: "What is Custom ERP?", a: "Custom ERP is a cloud-based ERP that LRBC designs around your own processes, for businesses with a turnover of ₹50 Cr and above." },
    { q: "Who is Custom ERP for?", a: "Larger and fast-growing businesses, with any employee size and any number of factories or locations, whose processes are too specific for an off-the-shelf system." },
    { q: "Is my data safe in the cloud?", a: "Data is held in secure cloud storage with automatic backups and role-based access, so only the right people can see the right information." },
    { q: "Can it connect with the tools we already use?", a: "Yes. We plan integrations with your existing tools during the design stage." },
    { q: "How is the price decided?", a: "It depends on the scope: processes covered, locations, users and integrations. We share a proposal after studying your operations." },
    { q: "Why choose LRBC instead of a mainstream ERP like Zoho or SAP?", a: "Mainstream ERPs are built for the average business, so teams often end up changing their processes to fit the software, paying for modules they never use, or relying on add-ons and workarounds. LRBC does it the other way round: we study how your business actually runs and build the ERP around your workflows, approvals, factories and reports. You also get one accountable team for design, rollout, training and support after go-live, secure cloud data, and a scope and price based on what you actually need. If a standard package already fits your business well, we will tell you so." },
    { q: "Should I choose Mini ERP or Custom ERP?", a: "Mini ERP suits ₹10–50 Cr businesses with standard needs and a lean budget. Custom ERP suits ₹50 Cr+ businesses that need workflows built around their own operations." },
  ],
  ctaTitle: "Let's design the ERP your business deserves",
  ctaText: "Share a few details and our team will get back to you to plan the next step.",
  other: { name: "Mini ERP", href: "/mini-erp", text: "See Mini ERP for ₹10–50 Cr businesses" },
};

export default function CustomErpPage() {
  return <ProductPage d={data} />;
}
