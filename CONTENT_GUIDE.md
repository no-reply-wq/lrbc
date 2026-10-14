# LRBC content guide — adding things the systematic way

Every item we add (video, case study, testimonial, link …) is stored as **one numbered entry in a registry file**,
and its files are saved with the **same number in the file name**. This keeps the site tidy now and lets us move
everything into a database when the backend is built.

Rules for everything:
1. One registry file per kind of content (listed below). Never keep content only inside a component.
2. Numbers only go up (1, 2, 3 …). Never reuse or renumber an old one.
3. Files are named `NN-company-client.ext` (lower-case, hyphens, two-digit number) and live in a fixed folder.
4. Every item records who/what/where: names, category, links — so a database row can be built from it later.

## Video testimonials (home page)
Registry: `lib/video-testimonials.ts`  ·  Videos: `public/videos/testimonials/`  ·  Covers: `public/images/testimonials/`

Details needed for each new video:
| # | Detail | Example |
|---|--------|---------|
| 1 | Video file | `05-arv-companies-varun-bathwal.mp4` |
| 2 | Business category | Woven Sack Manufacturing |
| 3 | Company name | ARV Companies |
| 4 | Client name | Varun Bathwal |
| 5 | Position | CEO |
| 6 | One-line quote | “Our roll tracking is now error-free.” |
| 7 | YouTube link of the same video | https://www.youtube.com/watch?v=… (shows the YouTube icon on the card) |
| 8 | Cover image (optional) | `05-arv-companies-varun-bathwal.jpg` |

## Case studies
Registry: `lib/case-studies.ts` (ids like `navtech1`)  ·  Images: `public/images/casestudy/<client>-case<N>-<n>.jpeg`

## Social links (footer)
Registry: `lib/social-links.ts` — LinkedIn, Instagram, Facebook, YouTube. An empty link hides that icon.

## Where files go when sent
Anything sent for the site is added to the next installer zip under the same path, so it also lands on your computer
inside the project folder (then `git add -A`, commit and push).
