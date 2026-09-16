import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SiteContent from '@/lib/models/SiteContent';

// Seed data — default content for every editable section
const SEED_CONTENT = [
  // ── HOME ──────────────────────────────────────────────────────────────────
  { key: 'home_hero', page: 'home', section: 'Hero Section', data: {
    badge: 'Lean Resource Business Consulting Private Limited',
    heading_line1: 'Better Tools.',
    heading_line2: 'Better Business.',
    subheading: "The right technology doesn't complicate your business. It helps it flow.",
    cta_primary: 'Contact our team',
    cta_secondary: 'Request a demo',
  }},
  { key: 'home_about', page: 'home', section: 'About ERP Section', data: {
    badge: 'About Our ERP',
    heading: 'One ERP. Every Process. Zero Bottlenecks.',
    body: 'One platform for everything your business needs. Our ERP solutions keep your operations connected, simple, and efficient.',
    sub_body: "One ERP. Every Process. Zero Bottlenecks, meshed up data, dependency on an individual's.",
  }},
  { key: 'home_features', page: 'home', section: 'Why Choose Us Section', data: {
    heading: 'Why Businesses Choose Our ERP',
    subheading: "One ERP. Every Process. Zero Bottlenecks, meshed up data, dependency on an individual's",
    features: [
      'Built around your unique workflows',
      'Easy for every team to learn and use',
      'Real-time dashboards for complete operational visibility',
      'Scales as your business grows',
    ],
  }},
  { key: 'home_products', page: 'home', section: 'Products Section', data: {
    heading: 'Products',
    lekhasetu_title: 'LekhaSetu',
    lekhasetu_desc: 'Forget manual exports and outdated reports. LekhaSetu continuously syncs your Account data with the cloud so every dashboard, report and insight is always current.',
    lekhasetu_features: ['Real-time cloud sync', 'Multi-company management', 'Inventory insights'],
    workpilot_title: 'WorkPilot',
    workpilot_desc: 'WorkPilot simplifies workforce management by bringing attendance, task allocation, and work tracking into one centralized platform.',
    workpilot_features: ['Attendance', 'Task assignment', 'Activity history', 'Performance tracking'],
  }},

  // ── ABOUT ─────────────────────────────────────────────────────────────────
  { key: 'about_hero', page: 'about', section: 'Hero Section', data: {
    badge: 'About Us',
    heading_line1: 'Building Technology',
    heading_line2: 'Around People,',
    heading_line3: 'Not Processes.',
    subheading: "Every growing business deserves software that's simple, reliable, and built around the way it works.",
  }},
  { key: 'about_story', page: 'about', section: 'Our Story', data: {
    badge: 'Our Story',
    image_url: 'https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=2747&auto=format&fit=crop',
    story_heading: 'Our journey began with a simple observation.',
    story_body: 'While working closely with businesses across industries, our founder saw organizations struggling with paperwork, disconnected systems, and software that was often too complicated for everyday users.',
    story_tagline: 'Rather than asking businesses to adapt to technology, we chose to build technology that adapts to them.',
  }},
  { key: 'about_team', page: 'about', section: 'Team Section', data: {
    badge: 'Team',
    heading: 'Meet the team',
    subheading: 'During the working process, we perform regular fitting with the client because he is the only person who can feel whether a new suit fits or not.',
  }},

  // ── LEKHASETU ─────────────────────────────────────────────────────────────
  { key: 'lekhasetu_hero', page: 'lekhasetu', section: 'Hero Section', data: {
    badge: 'LekhaSetu',
    heading_line1: 'Your accounting data,',
    heading_line2: 'always current.',
    subheading: 'Forget manual exports and outdated reports. LekhaSetu continuously syncs your accounting data with the cloud so every dashboard, report and insight is always current.',
    cta_primary: 'Get Started',
    cta_secondary: 'See how it works',
  }},
  { key: 'lekhasetu_features', page: 'lekhasetu', section: 'Features Section', data: {
    heading: 'Everything you need, connected.',
    features: [
      { title: 'Real-time cloud sync', desc: 'Data syncs automatically — no manual exports ever.' },
      { title: 'Multi-company management', desc: 'Manage multiple entities from one unified dashboard.' },
      { title: 'Inventory insights', desc: 'Live stock levels across all locations.' },
      { title: 'Custom reporting', desc: 'Build the reports your team actually needs.' },
    ],
  }},

  // ── CONTACT ───────────────────────────────────────────────────────────────
  { key: 'contact_hero', page: 'contact', section: 'Hero Section', data: {
    badge: 'Contact Us',
    heading: 'Your next stage of growth starts here.',
    subheading: 'Less time managing operations. More time building your business.',
  }},
  { key: 'contact_info', page: 'contact', section: 'Contact Details', data: {
    email: 'contact@lrbc.ai',
    phone: '+91-9954953008',
    office1_label: 'Head Office',
    office1_address: '7th Floor, Pranava Business Park, Gachibowli - Miyapur Rd, Hyderabad, Telangana 500084',
    office2_label: 'Corporate Office',
    office2_address: 'Plot no, 24, Shanti Nagar, Kompally, Hyderabad, Telangana 500100',
  }},

  // ── TESTIMONIALS ──────────────────────────────────────────────────────────
  { key: 'testimonials_hero', page: 'testimonials', section: 'Hero Section', data: {
    badge: 'Testimonials and Case Studies',
    heading_line1: 'Real Results.',
    heading_line2: 'Real Clients.',
    subheading: 'Hear directly from the businesses we have helped and see the numbers behind each engagement.',
  }},
  { key: 'testimonials_section', page: 'testimonials', section: 'Testimonials Section', data: {
    eyebrow: 'Client Voices',
    heading: 'What Our Clients Say',
    subheading: 'Every quote came directly from a founder, director, or operations leader we have worked with.',
  }},
  { key: 'casestudies_section', page: 'testimonials', section: 'Case Studies Section', data: {
    eyebrow: 'Deep Dives',
    heading: 'The Work, In Detail',
    subheading: 'Each case study shows the specific problem, the system we built, and the measurable outcome.',
  }},
  { key: 'testimonials_cta', page: 'testimonials', section: 'CTA Banner', data: {
    heading: 'Ready to become the next case study?',
    subheading: 'Book a discovery call and let us map out what a Business Operating System looks like for your operations.',
    button_text: 'Get Started',
    button_href: '/contact?openForm=true',
  }},
];

export async function GET() {
  try {
    await connectDB();
    // Upsert seed content if docs don't exist yet
    for (const item of SEED_CONTENT) {
      await SiteContent.updateOne({ key: item.key }, { $setOnInsert: item }, { upsert: true });
    }
    const docs = await SiteContent.find().sort({ page: 1, key: 1 }).lean();
    return NextResponse.json(docs);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const doc = await SiteContent.findOneAndUpdate(
      { key: body.key },
      body,
      { upsert: true, new: true }
    );
    return NextResponse.json(doc, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}