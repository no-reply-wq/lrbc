# LRBC design standards (read before adding pages or sections)

These rules keep every page consistent. Follow them for all new work.

## 1. Spacing
- Every content section uses **`py-8 md:py-12`** (or the `.lrbc-section` class). Do not use `py-16`, `py-24`, `py-32` etc.
- Between a hero and the next section there must be no empty band: hero bottom padding stays small (`pb-6 sm:pb-8`) and the next section starts straight after.
- Inside a section: heading → content gap `mt-8` (mobile `mt-6`); card grids `gap-4`.
- Page side gutters: `px-4 sm:px-6`. Content width: `max-w-6xl` (text-heavy: `max-w-3xl`/`max-w-4xl`).

## 2. Buttons
Use the shared classes from `app/globals.css`:
- Primary: `lrbc-btn lrbc-btn-primary`
- Secondary / outline: `lrbc-btn lrbc-btn-secondary`
- On dark / gradient backgrounds: `lrbc-btn lrbc-btn-light`
All three share one height (48 px), radius, hover lift and press animation. Full-width on phones, automatic width from `sm` up.
Do not invent new button styles. Buttons that open the contact form use `<ContactFormModal className="lrbc-btn lrbc-btn-primary" ... />`.
The site-wide magnetic effect (`components/MagneticAll.tsx`) applies automatically; opt out with `data-no-magnet`.

## 3. Forms
- Only one form exists: `components/ContactForm.tsx`. Open it with `ContactFormModal` (or `ERPRequestModal`) and pass a `source` so the lead email says where it came from.
- Never build a second contact form. Fields, labels, placeholders and validation live in `ContactForm.tsx`.
- Inputs are 16 px on mobile (prevents iOS zoom), labels above fields, required fields marked with `*`.

## 4. Typography & colour
- Fonts: Inter (body), Plus Jakarta Sans (headings), JetBrains Mono (labels). No other fonts.
- Brand: indigo/violet gradient (`#5227FF → #a855f7 → #d946ef`). Light theme is the default.
- Page H1 once per page; section titles are `h2`, card titles `h3`.

## 5. Motion
- Scroll animations: one-time, 0.5–0.9 s, `cubic-bezier(.22,1,.36,1)`. Always provide a `prefers-reduced-motion` fallback.
- Hover: lift 2 px max. No infinite bobbing animations on buttons or forms.

## 6. SEO for every new page
- Server component exporting `metadata` (title ≤ 60 chars, description ≤ 160, canonical, openGraph).
- JSON-LD for the page type (Service / FAQPage / BreadcrumbList), one H1, descriptive alt text on images.
- Add the page to the navbar (`components/header.tsx`) and the footer links.
