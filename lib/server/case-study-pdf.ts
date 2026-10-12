import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from "pdf-lib";
import fs from "fs/promises";
import path from "path";
import type { CaseStudy } from "@/lib/case-studies";

const W = 595.28, H = 841.89, M = 48, CW = W - M * 2;
const INK = rgb(0.106, 0.106, 0.184), MUTED = rgb(0.42, 0.42, 0.5), BRAND = rgb(0.322, 0.153, 1);
const LABEL = { Problem: rgb(0.93, 0.27, 0.27), Solution: rgb(0.15, 0.39, 0.92), Result: rgb(0.09, 0.64, 0.29) };

/** Standard PDF fonts only cover Latin-1, so map the few symbols our copy uses. */
const clean = (s: string) =>
  s.replace(/[→⟶]/g, "->").replace(/[←]/g, "<-").replace(/[‘’‚]/g, "'").replace(/[“”„]/g, '"').replace(/…/g, "...")
    .replace(/[‐‑−]/g, "-").replace(/ /g, " ").replace(/[^\x09\x0a\x0d\x20-\x7e\xa0-\xff–—•]/g, "");

async function loadBytes(p: string, origin: string): Promise<Buffer | null> {
  if (/^https?:\/\//.test(p)) {
    try { const r = await fetch(p); return r.ok ? Buffer.from(await r.arrayBuffer()) : null; } catch { return null; }
  }
  try { return await fs.readFile(path.join(process.cwd(), "public", p)); } catch {}
  try { const r = await fetch(origin + p); return r.ok ? Buffer.from(await r.arrayBuffer()) : null; } catch { return null; }
}

async function shrink(buf: Buffer): Promise<{ bytes: Buffer; png: boolean }> {
  try {
    const sharp = (await import("sharp")).default;
    return { bytes: await sharp(buf).rotate().resize({ width: 1500, withoutEnlargement: true }).jpeg({ quality: 78 }).toBuffer(), png: false };
  } catch {
    return { bytes: buf, png: buf[0] === 0x89 && buf[1] === 0x50 };
  }
}

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const lines: string[] = [];
  for (const para of clean(text).split(/\n+/)) {
    let line = "";
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const t = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(t, size) <= width) line = t;
      else { if (line) lines.push(line); line = word; }
    }
    if (line) lines.push(line);
  }
  return lines;
}

export async function buildCaseStudyPdf(cs: CaseStudy, origin: string): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(clean(cs.client)); pdf.setAuthor("LRBC"); pdf.setSubject("LRBC case study");
  const reg = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let logo: Awaited<ReturnType<PDFDocument["embedPng"]>> | null = null;
  const lb = await loadBytes("/images/icon.png", origin);
  if (lb) { try { logo = await pdf.embedPng(lb); } catch {} }

  let page!: PDFPage, y = 0;
  const gradientBar = (pg: PDFPage, top: number, h: number) => {
    const steps = 60, a = [0.322, 0.153, 1], b = [0.851, 0.275, 0.937];
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      pg.drawRectangle({ x: (W / steps) * i, y: top, width: W / steps + 1, height: h, color: rgb(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t) });
    }
  };
  const newPage = (first = false) => {
    page = pdf.addPage([W, H]);
    gradientBar(page, H - 8, 8);
    y = H - 48;
    if (first) {
      if (logo) page.drawImage(logo, { x: M, y: y - 16, width: 22, height: 22 });
      page.drawText("LRBC", { x: M + (logo ? 30 : 0), y: y - 10, size: 15, font: bold, color: INK });
      const tag = "CASE STUDY";
      page.drawText(tag, { x: W - M - bold.widthOfTextAtSize(tag, 9), y: y - 8, size: 9, font: bold, color: BRAND });
      y -= 52;
    }
  };
  const need = (h: number) => { if (y - h < M + 28) newPage(); };

  newPage(true);
  // title + meta
  for (const l of wrap(cs.client, bold, 24, CW)) { need(30); page.drawText(l, { x: M, y: y - 22, size: 24, font: bold, color: INK }); y -= 30; }
  const meta = clean([cs.industry, cs.date].filter(Boolean).join("   |   "));
  page.drawText(meta, { x: M, y: y - 12, size: 10.5, font: reg, color: MUTED });
  y -= 30;

  // metrics
  if (cs.metrics.length) {
    const gap = 10, bw = (CW - gap * (cs.metrics.length - 1)) / cs.metrics.length, bh = 52;
    cs.metrics.forEach((m, i) => {
      const x = M + i * (bw + gap);
      page.drawRectangle({ x, y: y - bh, width: bw, height: bh, color: rgb(0.96, 0.95, 1), borderColor: rgb(0.85, 0.82, 1), borderWidth: 0.8 });
      const v = clean(m.value), l = clean(m.label);
      page.drawText(v, { x: x + (bw - bold.widthOfTextAtSize(v, 14)) / 2, y: y - 24, size: 14, font: bold, color: BRAND });
      page.drawText(l, { x: x + (bw - reg.widthOfTextAtSize(l, 8.5)) / 2, y: y - 40, size: 8.5, font: reg, color: MUTED });
    });
    y -= bh + 26;
  }

  // sections
  const section = (title: keyof typeof LABEL, body: string) => {
    need(60);
    page.drawRectangle({ x: M, y: y - 14, width: 3, height: 14, color: LABEL[title] });
    page.drawText(title.toUpperCase(), { x: M + 10, y: y - 11, size: 10.5, font: bold, color: LABEL[title] });
    y -= 26;
    for (const l of wrap(body, reg, 11, CW)) { need(17); page.drawText(l, { x: M, y: y - 11, size: 11, font: reg, color: INK }); y -= 17; }
    y -= 14;
  };
  section("Problem", cs.problem);
  section("Solution", cs.solution);
  section("Result", cs.result);

  // images
  const imgs: { img: Awaited<ReturnType<PDFDocument["embedJpg"]>> }[] = [];
  for (const p of cs.images) {
    const raw = await loadBytes(p, origin);
    if (!raw) continue;
    try {
      const { bytes, png } = await shrink(raw);
      imgs.push({ img: png ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes) });
    } catch {}
  }
  if (imgs.length) {
    const f = imgs[0].img;
    need(26 + Math.min(CW / f.width, 330 / f.height) * f.height + 18); // keep the heading with its first image
    page.drawText("REAL RESULTS", { x: M, y: y - 11, size: 10.5, font: bold, color: BRAND });
    y -= 26;
    for (const { img } of imgs) {
      const sc = Math.min(CW / img.width, 330 / img.height), w = img.width * sc, h = img.height * sc;
      need(h + 18);
      page.drawRectangle({ x: M + (CW - w) / 2 - 1, y: y - h - 1, width: w + 2, height: h + 2, borderColor: rgb(0.86, 0.86, 0.92), borderWidth: 0.8 });
      page.drawImage(img, { x: M + (CW - w) / 2, y: y - h, width: w, height: h });
      y -= h + 18;
    }
  }

  // footer on every page
  const pages = pdf.getPages();
  pages.forEach((pg, i) => {
    pg.drawLine({ start: { x: M, y: 40 }, end: { x: W - M, y: 40 }, thickness: 0.6, color: rgb(0.88, 0.88, 0.93) });
    pg.drawText("LRBC  |  lrbc.ai  |  contact@lrbc.ai", { x: M, y: 26, size: 8.5, font: reg, color: MUTED });
    const n = `${i + 1} / ${pages.length}`;
    pg.drawText(n, { x: W - M - reg.widthOfTextAtSize(n, 8.5), y: 26, size: 8.5, font: reg, color: MUTED });
  });
  return pdf.save();
}
